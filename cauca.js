const fs = require("fs");

module.exports = class {
  static config = {
    name: "fish",
    aliases: ["fishing", "cauca"],
    version: "1.0.0",
    role: 0,
    author: "Panna",
    info: "Game câu cá",
    Category: "Game",
    guides: ".fish + lệnh (cauca/shop/info/khu/...)",
    cd: 5,
    hasPrefix: true,
    images: []
  };

  static async onRun({ api, event, msg, model, Threads, Users, Currencies, args }) {
    const { threadID, senderID, messageID } = event;
    const input = args[0]?.toLowerCase();
    const subCommand = args[1]?.toLowerCase();

    const userFile = `system/data/fishing/${senderID}.json`;
    if (!fs.existsSync(userFile)) {
      const name = (await Users.getName(senderID)) || `Người chơi ${senderID}`;
      fs.writeFileSync(userFile, JSON.stringify({
        name, xu: 1000, rod: { name: "Cần Gỗ", tier: 0 },
        line: { name: "Dây thường", durability: 20, maxDurability: 20 },
        bait: "Mồi thường", level: 1, fish: {}, dex: [], buffs: [],
        title: "", khu: "Sông Lặng", inventory: {
          "Đá nâng cấp": 0,
          "Mồi thơm": 0,
          "Mồi hiếm": 0,
          "Dây bền": 0
        }
      }, null, 2));
    }

    if (!input) {
      return api.sendMessage(
        `🎣 MENU CÂU CÁ\n\n` +
        `• .fish cauca - Câu cá\n` +
        `• .fish khu - Khu vực câu\n` +
        `• .fish shop - Mua cần/mồi/dây\n` +
        `• .fish craft - Chế tạo cần đặc biệt\n` +
        `• .fish upgrade - Nâng cấp cần\n` +
        `• .fish dex - Bộ sưu tập cá\n` +
        `• .fish info - Thông tin người chơi\n` +
        `• .fish inv - Túi đồ cá\n` +
        `• .fish sell - Bán cá\n` +
        `• .fish duel/hire/boss/quest/market/top`,
        threadID, messageID
      );
    }

    switch (input) {
      case "cauca": return this.handle_cauca({ api, event, model, Threads, Users, Currencies });
      case "info": return this.handle_info({ api, event, model, Threads, Users, Currencies });
      case "inv": return this.handle_inv({ api, event, model, Threads, Users, Currencies });
      case "shop": return this.handle_shop({ api, event, model, Threads, Users, Currencies, args });
      case "craft": return this.handle_craft({ api, event, model, Threads, Users, Currencies, args });
      case "upgrade": return this.handle_upgrade({ api, event, model, Threads, Users, Currencies, args });
      case "bait": return this.handle_bait({ api, event, model, Threads, Users, Currencies, args });
      case "dex": return this.handle_dex({ api, event, model, Threads, Users, Currencies });
      case "sell": return this.handle_sell({ api, event, model, Threads, Users, Currencies });
      case "khu": return this.handle_khu({ api, event, model, Threads, Users, Currencies, args });
      case "duel": return this.handle_duel({ api, event, model, Threads, Users, Currencies });
      case "boss": return this.handle_boss({ api, event, model, Threads, Users, Currencies });
      case "hire": return this.handle_hire({ api, event, model, Threads, Users, Currencies });
      case "market": return this.handle_market({ api, event, model, Threads, Users, Currencies });
      case "quest": return this.handle_quest({ api, event, model, Threads, Users, Currencies });
      case "top": return this.handle_top({ api, event, model, Threads, Users, Currencies });
      case "line": return this.handle_line({ api, event, model, Threads, Users, Currencies, args });
      default:
        return api.sendMessage(
          `⚠️ Lệnh không hợp lệ. Gõ ".fish" để xem menu.`, threadID, messageID
        );
    }
  }

  static async handle_cauca({ api, event, msg, model, Threads, Users, Currencies }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));

    if (data.line.durability <= 0)
      return api.sendMessage(`🧵 Dây câu đã đứt, hãy mua dây mới (.fish line)!`, threadID, messageID);

    const fishList = [
      { name: "Cá diếc", rarity: "common", value: 300 },
      { name: "Cá lóc", rarity: "common", value: 400 },
      { name: "Cá heo", rarity: "rare", value: 1500 },
      { name: "Cá mập", rarity: "legendary", value: 6000 },
      { name: "Cá rồng", rarity: "legendary", value: 10000 },
      { name: "Cá ma", rarity: "legendary", value: 12000 },
      { name: "Cá mồi", rarity: "common", value: 250 },
      { name: "Cá mặt trăng", rarity: "rare", value: 2500 },
      { name: "Cá thần thoại", rarity: "legendary", value: 20000 }
    ];

    // Tính toán tỉ lệ dựa trên mồi và cần câu
    let baseChance = Math.random() * 100;
    let fish;
    
    // Ảnh hưởng của mồi
    if (data.bait === "Mồi thơm") {
      baseChance += 10; // Tăng 10% tỉ lệ rare
    } else if (data.bait === "Mồi hiếm") {
      baseChance += 25; // Tăng 25% tỉ lệ rare & legendary
    }
    
    // Ảnh hưởng của cần câu
    baseChance += (data.rod.tier || 0) * 5; // Mỗi tier tăng 5%
    
    // Ảnh hưởng của khu vực
    const areaBonus = {
      "Sông Lặng": 0,
      "Hồ Lớn": 5,
      "Rừng Thiêng": 10,
      "Núi Lửa": 15,
      "Hang Băng": 20
    };
    baseChance += areaBonus[data.khu] || 0;

    if (baseChance < 65) {
      fish = fishList.find(f => f.rarity === "common");
    } else if (baseChance < 90) {
      fish = fishList.find(f => f.rarity === "rare");
    } else {
      fish = fishList.find(f => f.rarity === "legendary");
    }

    const congrats = [
      `🎉 Wow! Bạn câu được ${fish.name}!`,
      `🐟 ${fish.name} đã mắc câu rồi kìa!`,
      `🎣 Bạn kéo được ${fish.name} từ hồ!`,
      `✨ Một con ${fish.name} tuyệt đẹp!`,
      `🎯 ${fish.name} không thoát được bạn!`
    ];

    const emoji = {
      common: "⚪",
      rare: "🔵",
      legendary: "🟡"
    };

    // Tính toán reward
    const baseValue = fish.value;
    const tierBonus = (data.rod.tier || 0) * 0.1; // Mỗi tier tăng 10% giá trị
    const finalValue = Math.floor(baseValue * (1 + tierBonus));
    
    data.xu += finalValue;
    data.line.durability--;
    data.fish[fish.name] = (data.fish[fish.name] || 0) + 1;
    if (!data.dex.includes(fish.name)) data.dex.push(fish.name);
    
    // Level up system
    const oldLevel = data.level;
    data.level = Math.floor(data.xu / 10000) + 1; // Mỗi 10k xu = 1 level
    
    // Random drop items
    const dropChance = Math.random() * 100;
    let dropMsg = "";
    if (dropChance < 5) { // 5% chance
      data.inventory["Đá nâng cấp"] = (data.inventory["Đá nâng cấp"] || 0) + 1;
      dropMsg = "\n💎 +1 Đá nâng cấp";
    } else if (dropChance < 15) { // 10% chance
      data.inventory["Mồi thơm"] = (data.inventory["Mồi thơm"] || 0) + 1;
      dropMsg = "\n🪱 +1 Mồi thơm";
    }

    fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

    let fishMsg = `${congrats[Math.floor(Math.random() * congrats.length)]}\n` +
      `(${fish.rarity.toUpperCase()} – ${emoji[fish.rarity]})\n` +
      `💰 +${finalValue.toLocaleString()} xu${dropMsg}`;
    
    if (data.level > oldLevel) {
      fishMsg += `\n🎉 LEVEL UP! Bạn đã đạt Level ${data.level}!`;
    }

    return api.sendMessage(fishMsg, threadID, messageID);
  }
  static async handle_shop({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();
    const item = args[2]?.toLowerCase();
    const amount = parseInt(args[3]) || 1;

    if (!action) {
      const shopMsg =
        `🛒 SHOP CÂU CÁ\n\n` +
        `🎣 CẦN:\n` +
        `• Cần Gỗ (+0) - 0 xu (có sẵn)\n` +
        `• Cần Bạc (+0) - 5000 xu\n` +
        `• Cần Vàng (+0) - 15000 xu\n\n` +
        `🧵 DÂY:\n` +
        `• Dây thường - 200 xu\n` +
        `• Dây bền - 500 xu\n\n` +
        `💎 ĐÁ NÂNG CẤP:\n` +
        `• Đá nâng cấp - 1000 xu\n\n` +
        `🪱 MỒI:\n` +
        `• Mồi thường - 0 xu\n` +
        `• Mồi thơm - 800 xu\n` +
        `• Mồi hiếm - 2000 xu\n\n` +
        `💡 Cách dùng: .fish shop buy [tên] [số lượng]`;
      return api.sendMessage(shopMsg, threadID, messageID);
    }

    if (action === "buy") {
      const shopItems = {
        "cần bạc": { price: 5000, type: "rod", name: "Cần Bạc", tier: 0 },
        "cần vàng": { price: 15000, type: "rod", name: "Cần Vàng", tier: 0 },
        "dây thường": { price: 200, type: "line", name: "Dây thường", durability: 20, maxDurability: 20 },
        "dây bền": { price: 500, type: "line", name: "Dây bền", durability: 40, maxDurability: 40 },
        "đá nâng cấp": { price: 1000, type: "item", name: "Đá nâng cấp" },
        "mồi thơm": { price: 800, type: "item", name: "Mồi thơm" },
        "mồi hiếm": { price: 2000, type: "item", name: "Mồi hiếm" }
      };

      const selectedItem = shopItems[item];
      if (!selectedItem) {
        return api.sendMessage(`❌ Không tìm thấy vật phẩm "${item}" trong shop!`, threadID, messageID);
      }

      const totalCost = selectedItem.price * amount;
      if (data.xu < totalCost) {
        return api.sendMessage(`❌ Bạn không đủ xu! Cần ${totalCost.toLocaleString()} xu, hiện có ${data.xu.toLocaleString()} xu.`, threadID, messageID);
      }

      data.xu -= totalCost;

      if (selectedItem.type === "rod") {
        data.rod = { name: selectedItem.name, tier: selectedItem.tier };
      } else if (selectedItem.type === "line") {
        data.line = { name: selectedItem.name, durability: selectedItem.durability, maxDurability: selectedItem.maxDurability };
      } else if (selectedItem.type === "item") {
        data.inventory[selectedItem.name] = (data.inventory[selectedItem.name] || 0) + amount;
      }

      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ Đã mua ${amount}x ${selectedItem.name} với giá ${totalCost.toLocaleString()} xu!`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish shop" để xem menu.`, threadID, messageID);
  }

  static async handle_craft({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();

    if (!action) {
      return api.sendMessage(
        `⚒️ CHẾ TẠO\n\n• Cần Rồng (+1): yêu cầu Cần Bạc + Đá x3\n• Cần Bóng Tối (+2): Cần Vàng + Đá x5\n• Không thể mua các cần này từ shop!\n\n💡 Cách dùng: .fish craft [tên cần]`,
        threadID,
        messageID
      );
    }

    const craftRecipes = {
      "cần rồng": {
        requirements: { "Cần Bạc": 1, "Đá nâng cấp": 3 },
        result: { name: "Cần Rồng", tier: 1 }
      },
      "cần bóng tối": {
        requirements: { "Cần Vàng": 1, "Đá nâng cấp": 5 },
        result: { name: "Cần Bóng Tối", tier: 2 }
      }
    };

    const recipe = craftRecipes[action];
    if (!recipe) {
      return api.sendMessage(`❌ Không tìm thấy công thức chế tạo "${action}"!`, threadID, messageID);
    }

    // Kiểm tra nguyên liệu
    for (const [item, required] of Object.entries(recipe.requirements)) {
      if (item === "Cần Bạc" && data.rod.name !== "Cần Bạc") {
        return api.sendMessage(`❌ Bạn cần có Cần Bạc để chế tạo!`, threadID, messageID);
      }
      if (item === "Cần Vàng" && data.rod.name !== "Cần Vàng") {
        return api.sendMessage(`❌ Bạn cần có Cần Vàng để chế tạo!`, threadID, messageID);
      }
      if (item === "Đá nâng cấp" && (data.inventory["Đá nâng cấp"] || 0) < required) {
        return api.sendMessage(`❌ Bạn cần ${required}x Đá nâng cấp để chế tạo!`, threadID, messageID);
      }
    }

    // Thực hiện chế tạo
    data.rod = recipe.result;
    if (data.inventory["Đá nâng cấp"]) {
      data.inventory["Đá nâng cấp"] -= recipe.requirements["Đá nâng cấp"];
    }

    fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
    return api.sendMessage(`✅ Chế tạo thành công ${recipe.result.name} (+${recipe.result.tier})!`, threadID, messageID);
  }

  static async handle_upgrade({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();

    if (!action) {
      return api.sendMessage(
        `📈 NÂNG CẤP CẦN CÂU\n\n• Dùng Đá nâng cấp để tăng +1, tối đa +5\n• Càng nâng cao, tỉ lệ bắt cá hiếm cao hơn và giảm rách dây\n\n💡 Cách dùng: .fish upgrade rod`,
        threadID,
        messageID
      );
    }

    if (action === "rod") {
      if (data.rod.tier >= 5) {
        return api.sendMessage(`❌ Cần câu đã đạt cấp tối đa (+5)!`, threadID, messageID);
      }

      if ((data.inventory["Đá nâng cấp"] || 0) < 1) {
        return api.sendMessage(`❌ Bạn cần 1x Đá nâng cấp để nâng cấp cần!`, threadID, messageID);
      }

      data.rod.tier += 1;
      data.inventory["Đá nâng cấp"] -= 1;

      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ Nâng cấp thành công! ${data.rod.name} (+${data.rod.tier})`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish upgrade" để xem hướng dẫn.`, threadID, messageID);
  }

  static async handle_info({ api, event, model, Threads, Users, Currencies }) {
    const data = JSON.parse(fs.readFileSync(`system/data/fishing/${event.senderID}.json`));
    const name = (await Users.getName(event.senderID)) || data.name;

    const infoMsg =
      `📄 THÔNG TIN NGƯ DÂN\n\n` +
      `👤 Tên: ${name}\n` +
      `🎣 Cần: ${data.rod.name} (+${data.rod.tier || 0})\n` +
      `🪱 Mồi: ${data.bait}\n` +
      `🧵 Dây: ${data.line.name} (${data.line.durability}/${data.line.maxDurability})\n` +
      `💰 Xu: ${data.xu.toLocaleString()} xu\n` +
      `🔖 Danh hiệu: ${data.title || "Chưa có"}\n` +
      `📍 Khu: ${data.khu}\n` +
      `⭐ Level: ${data.level}`;
    return api.sendMessage(infoMsg, event.threadID, event.messageID);
  }

  static async handle_inv({ api, event, model, Threads, Users, Currencies }) {
    const { senderID, threadID, messageID } = event;
    const data = JSON.parse(fs.readFileSync(`system/data/fishing/${senderID}.json`));
    const fishBag = data.fish;
    const inventory = data.inventory || {};
    
    const fishList = Object.keys(fishBag).length
      ? Object.entries(fishBag).map(([f, n]) => `• ${f} × ${n}`).join("\n")
      : "❌ Bạn chưa có con cá nào.";
    
    const itemList = Object.keys(inventory).length
      ? Object.entries(inventory).filter(([item, count]) => count > 0)
        .map(([item, count]) => `• ${item} × ${count}`).join("\n")
      : "❌ Bạn chưa có vật phẩm nào.";

    const invMsg = `🎒 TÚI ĐỒ NGƯ DÂN\n\n🐟 CÁ:\n${fishList}\n\n📦 VẬT PHẨM:\n${itemList}`;
    return api.sendMessage(invMsg, threadID, messageID);
  }

  static async handle_bait({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();

    if (!action) {
      const baitMsg =
        `🪱 MỒI CÂU\n\n` +
        `• Mồi thường: cơ bản\n` +
        `• Mồi thơm: tăng 10% tỉ lệ ra cá rare\n` +
        `• Mồi hiếm: tăng 25% tỉ lệ ra cá rare & legendary\n` +
        `• Một số mồi đặc biệt có thể chỉ có từ sự kiện\n\n` +
        `💡 Cách dùng: .fish bait use [tên mồi]`;
      return api.sendMessage(baitMsg, threadID, messageID);
    }

    if (action === "use") {
      const baitName = args[2]?.toLowerCase();
      if (!baitName) {
        return api.sendMessage(`❌ Vui lòng chọn mồi để sử dụng!`, threadID, messageID);
      }

      const baitMap = {
        "mồi thường": "Mồi thường",
        "mồi thơm": "Mồi thơm",
        "mồi hiếm": "Mồi hiếm"
      };

      const selectedBait = baitMap[baitName];
      if (!selectedBait) {
        return api.sendMessage(`❌ Không tìm thấy mồi "${baitName}"!`, threadID, messageID);
      }

      if (selectedBait === "Mồi thường") {
        data.bait = selectedBait;
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
        return api.sendMessage(`✅ Đã chuyển sang sử dụng Mồi thường!`, threadID, messageID);
      }

      if ((data.inventory[selectedBait] || 0) < 1) {
        return api.sendMessage(`❌ Bạn không có ${selectedBait}! Hãy mua từ shop.`, threadID, messageID);
      }

      data.bait = selectedBait;
      data.inventory[selectedBait] -= 1;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ Đã sử dụng ${selectedBait}!`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish bait" để xem hướng dẫn.`, threadID, messageID);
  }

  static async handle_line({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();

    if (!action) {
      return api.sendMessage(
        `🧵 DÂY CÂU\n\n• Dây thường: 20 lần dùng\n• Dây bền: 40 lần dùng\n• Nếu dây đứt, bạn sẽ không thể câu.\n\n💡 Cách dùng: .fish line use [tên dây]`,
        threadID,
        messageID
      );
    }

    if (action === "use") {
      const lineName = args[2]?.toLowerCase();
      if (!lineName) {
        return api.sendMessage(`❌ Vui lòng chọn dây để sử dụng!`, threadID, messageID);
      }

      const lineMap = {
        "dây thường": { name: "Dây thường", durability: 20, maxDurability: 20 },
        "dây bền": { name: "Dây bền", durability: 40, maxDurability: 40 }
      };

      const selectedLine = lineMap[lineName];
      if (!selectedLine) {
        return api.sendMessage(`❌ Không tìm thấy dây "${lineName}"!`, threadID, messageID);
      }

      if (lineName === "dây thường") {
        data.line = selectedLine;
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
        return api.sendMessage(`✅ Đã chuyển sang sử dụng Dây thường!`, threadID, messageID);
      }

      if ((data.inventory["Dây bền"] || 0) < 1) {
        return api.sendMessage(`❌ Bạn không có Dây bền! Hãy mua từ shop.`, threadID, messageID);
      }

      data.line = selectedLine;
      data.inventory["Dây bền"] -= 1;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ Đã sử dụng Dây bền!`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish line" để xem hướng dẫn.`, threadID, messageID);
  }

  static async handle_sell({ api, event, model, Threads, Users, Currencies }) {
    const userFile = `system/data/fishing/${event.senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const values = { "common": 300, "rare": 1500, "legendary": 5000 };
    let total = 0;

    for (const [fish, amount] of Object.entries(data.fish)) {
      if (amount > 0) {
        const rarity = ["rồng", "ma", "mập"].some(k => fish.toLowerCase().includes(k))
          ? "legendary" : ["heo", "trăng"].some(k => fish.toLowerCase().includes(k))
          ? "rare" : "common";
        total += values[rarity] * amount;
      }
    }

    data.xu += total;
    data.fish = {};
    fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
    return api.sendMessage(`💰 Bạn đã bán hết cá và nhận được ${total.toLocaleString()} xu`, event.threadID, event.messageID);
  }
  static async handle_dex({ api, event, model, Threads, Users, Currencies }) {
    const data = JSON.parse(fs.readFileSync(`system/data/fishing/${event.senderID}.json`));
    const dex = data.dex;
    if (!dex.length) return api.sendMessage("📘 Bạn chưa câu được con cá nào!", event.threadID, event.messageID);

    const dexMsg = `📘 BỘ SƯU TẬP CÁ (${dex.length} loài)\n\n` +
      dex.map((name, i) => `#${i + 1}. ${name}`).join("\n");
    return api.sendMessage(dexMsg, event.threadID, event.messageID);
  }

  static async handle_khu({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const level = data.level;
    const action = args[1]?.toLowerCase();

    const areas = [
      { name: "Sông Lặng", required: 1 },
      { name: "Hồ Lớn", required: 3 },
      { name: "Rừng Thiêng", required: 5 },
      { name: "Núi Lửa", required: 8 },
      { name: "Hang Băng", required: 12 }
    ];

    if (!action) {
      const list = areas.map(area => {
        const status = level >= area.required ? "(✔️ Mở)" : `(🔒 Cần LV ${area.required})`;
        const boss = (area.name === "Núi Lửa") ? "🔥 Boss cá!" : "";
        return `• ${area.name} ${status} ${boss}`;
      }).join("\n");

      return api.sendMessage(`📍 KHU VỰC\n${list}\n\n💡 Dùng .fish khu go [tên] để chuyển đến`, threadID, messageID);
    }

    if (action === "go") {
      const areaName = args.slice(2).join(" ");
      if (!areaName) {
        return api.sendMessage(`❌ Vui lòng chọn khu vực để chuyển đến!`, threadID, messageID);
      }

      const selectedArea = areas.find(area => 
        area.name.toLowerCase().includes(areaName.toLowerCase()) ||
        areaName.toLowerCase().includes(area.name.toLowerCase())
      );

      if (!selectedArea) {
        return api.sendMessage(`❌ Không tìm thấy khu vực "${areaName}"!`, threadID, messageID);
      }

      if (level < selectedArea.required) {
        return api.sendMessage(`❌ Bạn cần đạt Level ${selectedArea.required} để vào ${selectedArea.name}!`, threadID, messageID);
      }

      data.khu = selectedArea.name;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ Đã chuyển đến ${selectedArea.name}!`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish khu" để xem hướng dẫn.`, threadID, messageID);
  }

  static async handle_top({ api, event, model, Threads, Users, Currencies }) {
    const dir = "system/data/fishing";
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));

    const top = files.map(f => {
      const data = JSON.parse(fs.readFileSync(`${dir}/${f}`));
      return { name: data.name, xu: data.xu };
    }).sort((a, b) => b.xu - a.xu).slice(0, 10);

    const topMsg = `🏆 BẢNG XẾP HẠNG NGƯ DÂN\n\n` +
      top.map((u, i) => `#${i + 1}. ${u.name} - ${u.xu.toLocaleString()} xu`).join("\n");
    return api.sendMessage(topMsg, event.threadID, event.messageID);
  }

  static async handle_duel({ api, event, model, Threads, Users, Currencies }) {
    return api.sendMessage(
      `⚔️ PvP ĐẤU CÁ sẽ sớm ra mắt!\nBạn có thể thách đấu người chơi khác để giành cá hoặc xu.`,
      event.threadID,
      event.messageID
    );
  }

  static async handle_boss({ api, event, model, Threads, Users, Currencies }) {
    return api.sendMessage(
      `🔥 BOSS CÁ\n\nBoss Quỷ Đỏ hiện đang lang thang ở "Núi Lửa".\nHãy đến đó bằng lệnh ".fish khu" và câu để bắt gặp!`,
      event.threadID,
      event.messageID
    );
  }

  static async handle_market({ api, event, model, Threads, Users, Currencies }) {
    return api.sendMessage(
      `🏪 CHỢ CÁ\n\nTính năng giao dịch cá & vật phẩm giữa người chơi đang được phát triển.`,
      event.threadID,
      event.messageID
    );
  }

  static async handle_quest({ api, event, model, Threads, Users, Currencies }) {
    return api.sendMessage(
      `📋 NHIỆM VỤ HẰNG NGÀY\n\n• Bắt 3 cá hiếm\n• Bán 5 con cá\n• Kiếm 2000 xu từ câu cá\n\n(Tính năng hoàn thành tự động sẽ được cập nhật)`,
      event.threadID,
      event.messageID
    );
  }

  static async handle_hire({ api, event, model, Threads, Users, Currencies }) {
    return api.sendMessage(
      `🧑‍🌾 THUÊ NGƯ DÂN CÂU HỘ\n\nBạn sẽ tự động câu cá trong 30 phút tới và nhận cá ngẫu nhiên. Tính năng đang thử nghiệm.`,
      event.threadID,
      event.messageID
    );
  }
  static async onLoad({ api, model }) {
    const folder = "system/data/fishing";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    // Tự động spawn Boss cá mỗi 30 phút
    setInterval(() => {
      const areas = ["Núi Lửa", "Hang Băng", "Rừng Thiêng"];
      const randomArea = areas[Math.floor(Math.random() * areas.length)];
      api.sendMessage(
        `⚠️ Một con Boss cá vừa xuất hiện tại ${randomArea}!\nNhanh lên và dùng ".fish khu" để đến đó!`,
        model.getMainThread()
      );
    }, 1000 * 60 * 30);
  }

  static async onEvent({ api, event, model, Threads, Users, Currencies }) {
    // Có thể xử lý sự kiện tin nhắn nếu cần (hiện chưa dùng)
  }

  static async onReply({ api, event, model, Threads, Users, Currencies, onReply }) {
    // Có thể xử lý trả lời tin nhắn nếu có (hiện chưa dùng)
  }

  static async onReaction({ api, event, model, Threads, Users, Currencies, onReaction }) {
    // Có thể xử lý phản ứng (hiện chưa dùng)
  }
};