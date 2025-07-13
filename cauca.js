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
        title: "Ngư dân mới", khu: "Sông Lặng", inventory: {
          "Đá nâng cấp": 0,
          "Mồi thơm": 0,
          "Mồi hiếm": 0,
          "Dây bền": 0
        }, stats: {
          totalFish: 0,
          rareFish: 0,
          legendaryFish: 0,
          totalEarned: 0,
          fishingTime: 0
        }, skins: {
          rod: "default",
          bag: "default",
          avatar: "default"
        }, gacha: {
          tickets: 0,
          pity: 0
        }, exploration: {
          discoveredAreas: ["Sông Lặng"],
          keys: 0,
          oxygenTank: 0
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
        `• .fish title - Hệ thống danh hiệu\n` +
        `• .fish event - Sự kiện đặc biệt\n` +
        `• .fish duel - PvP đấu cá\n` +
        `• .fish market - Chợ cá\n` +
        `• .fish boss - Boss cá\n` +
        `• .fish weather - Thời tiết\n` +
        `• .fish gacha - Gacha cá hiếm\n` +
        `• .fish skin - Skin cần câu\n` +
        `• .fish explore - Khám phá thế giới\n` +
        `• .fish top - Bảng xếp hạng`,
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
      case "duel": return this.handle_duel({ api, event, model, Threads, Users, Currencies, args });
      case "boss": return this.handle_boss({ api, event, model, Threads, Users, Currencies, args });
      case "hire": return this.handle_hire({ api, event, model, Threads, Users, Currencies });
      case "market": return this.handle_market({ api, event, model, Threads, Users, Currencies, args });
      case "quest": return this.handle_quest({ api, event, model, Threads, Users, Currencies });
      case "top": return this.handle_top({ api, event, model, Threads, Users, Currencies });
      case "line": return this.handle_line({ api, event, model, Threads, Users, Currencies, args });
      case "title": return this.handle_title({ api, event, model, Threads, Users, Currencies, args });
      case "event": return this.handle_event({ api, event, model, Threads, Users, Currencies, args });
      case "weather": return this.handle_weather({ api, event, model, Threads, Users, Currencies, args });
      case "gacha": return this.handle_gacha({ api, event, model, Threads, Users, Currencies, args });
      case "skin": return this.handle_skin({ api, event, model, Threads, Users, Currencies, args });
      case "explore": return this.handle_explore({ api, event, model, Threads, Users, Currencies, args });
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
      "Hang Băng": 20,
      "Hang Động Bí Mật": 25,
      "Đảo Hoang": 30,
      "Vùng Nước Sâu": 35,
      "Rừng Ma": 40,
      "Thung Lũng Rồng": 45,
      "Đại Dương Xanh": 50,
      "Hang Động Thời Gian": 55,
      "Thiên Đường Cá": 60,
      "Vực Sâu Vô Tận": 65,
      "Cổng Không Gian": 70
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
    
    // Update stats
    data.stats.totalFish = (data.stats.totalFish || 0) + 1;
    data.stats.totalEarned = (data.stats.totalEarned || 0) + finalValue;
    if (fish.rarity === "rare") data.stats.rareFish = (data.stats.rareFish || 0) + 1;
    if (fish.rarity === "legendary") data.stats.legendaryFish = (data.stats.legendaryFish || 0) + 1;
    
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
        `�️ KHÁM PHÁ:\n` +
        `• Key - 5000 xu\n` +
        `• Oxygen Tank - 3000 xu\n` +
        `• Gacha Ticket - 1000 xu\n\n` +
        `� Cách dùng: .fish shop buy [tên] [số lượng]`;
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
        "mồi hiếm": { price: 2000, type: "item", name: "Mồi hiếm" },
        "key": { price: 5000, type: "exploration", name: "Key" },
        "oxygen tank": { price: 3000, type: "exploration", name: "Oxygen Tank" },
        "gacha ticket": { price: 1000, type: "gacha", name: "Gacha Ticket" }
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
      } else if (selectedItem.type === "exploration") {
        if (selectedItem.name === "Key") {
          data.exploration.keys = (data.exploration.keys || 0) + amount;
        } else if (selectedItem.name === "Oxygen Tank") {
          data.exploration.oxygenTank = (data.exploration.oxygenTank || 0) + amount;
        }
      } else if (selectedItem.type === "gacha") {
        data.gacha.tickets = (data.gacha.tickets || 0) + amount;
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
      { name: "Hang Băng", required: 12 },
      { name: "Hang Động Bí Mật", required: 15, key: 1 },
      { name: "Đảo Hoang", required: 20, key: 2 },
      { name: "Vùng Nước Sâu", required: 25, oxygen: 1 },
      { name: "Rừng Ma", required: 30 },
      { name: "Thung Lũng Rồng", required: 35 },
      { name: "Đại Dương Xanh", required: 40 },
      { name: "Hang Động Thời Gian", required: 50 },
      { name: "Thiên Đường Cá", required: 60 },
      { name: "Vực Sâu Vô Tận", required: 80 },
      { name: "Cổng Không Gian", required: 100 }
    ];

    if (!action) {
      const list = areas.map(area => {
        const status = level >= area.required ? "(✔️ Mở)" : `(🔒 Cần LV ${area.required})`;
        const boss = (area.name === "Núi Lửa") ? "🔥 Boss cá!" : "";
        const special = area.key ? `🗝️ Cần ${area.key} Key` : 
                       area.oxygen ? `🤿 Cần ${area.oxygen} Oxygen` : "";
        return `• ${area.name} ${status} ${boss} ${special}`;
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

      // Check for special requirements
      if (selectedArea.key && data.exploration.keys < selectedArea.key) {
        return api.sendMessage(`❌ Bạn cần ${selectedArea.key} Key để vào ${selectedArea.name}!`, threadID, messageID);
      }

      if (selectedArea.oxygen && data.exploration.oxygenTank < selectedArea.oxygen) {
        return api.sendMessage(`❌ Bạn cần ${selectedArea.oxygen} Oxygen Tank để vào ${selectedArea.name}!`, threadID, messageID);
      }

      data.khu = selectedArea.name;
      if (!data.exploration.discoveredAreas.includes(selectedArea.name)) {
        data.exploration.discoveredAreas.push(selectedArea.name);
      }
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

  static async handle_duel({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const action = args[1]?.toLowerCase();

    if (!action) {
      return api.sendMessage(
        `⚔️ PVP ĐẤU CÁ\n\n` +
        `🎯 Cách chơi: Thách đấu người chơi khác, ai câu được cá hiếm hơn sẽ thắng\n` +
        `💰 Cược: 1,000 - 10,000 xu\n` +
        `⏰ Thời gian: 5 phút\n\n` +
        `💡 Lệnh:\n` +
        `• .fish duel challenge @user [số xu] - Thách đấu\n` +
        `• .fish duel accept - Chấp nhận\n` +
        `• .fish duel decline - Từ chối\n` +
        `• .fish duel list - Xem danh sách thách đấu`,
        threadID, messageID
      );
    }

    if (action === "challenge") {
      const targetUser = args[2];
      const betAmount = parseInt(args[3]) || 1000;
      
      if (!targetUser) {
        return api.sendMessage(`❌ Vui lòng tag người chơi muốn thách đấu!`, threadID, messageID);
      }

      if (betAmount < 1000 || betAmount > 10000) {
        return api.sendMessage(`❌ Số xu cược phải từ 1,000 đến 10,000!`, threadID, messageID);
      }

      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      
      if (data.xu < betAmount) {
        return api.sendMessage(`❌ Bạn không đủ xu để cược!`, threadID, messageID);
      }

      return api.sendMessage(
        `⚔️ ${targetUser} đã thách đấu với cược ${betAmount.toLocaleString()} xu!\n` +
        `Người chơi có thể dùng ".fish duel accept" để chấp nhận.`,
        threadID, messageID
      );
    }

    if (action === "accept") {
      return api.sendMessage(`✅ Đã chấp nhận thách đấu! Trận đấu sẽ bắt đầu trong 10 giây...`, threadID, messageID);
    }

    if (action === "decline") {
      return api.sendMessage(`❌ Đã từ chối thách đấu.`, threadID, messageID);
    }

    if (action === "list") {
      return api.sendMessage(`📋 Hiện không có thách đấu nào đang chờ.`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish duel" để xem hướng dẫn.`, threadID, messageID);
  }

  static async handle_boss({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const action = args[1]?.toLowerCase();

    if (!action) {
      return api.sendMessage(
        `🔥 BOSS CÁ\n\n` +
        `👹 Boss hiện tại: Boss Quỷ Đỏ (Núi Lửa)\n` +
        `❤️ HP: 45,000/50,000\n` +
        `💰 Reward: 100,000 xu + Cần Thần\n\n` +
        `💡 Lệnh:\n` +
        `• .fish boss attack - Tấn công boss\n` +
        `• .fish boss info - Thông tin boss\n` +
        `• .fish boss list - Danh sách boss\n` +
        `• .fish boss spawn - Spawn boss mới (Admin)`,
        threadID, messageID
      );
    }

    if (action === "attack") {
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      
      if (data.khu !== "Núi Lửa") {
        return api.sendMessage(`❌ Bạn phải ở Núi Lửa để tấn công boss!`, threadID, messageID);
      }

      const damage = Math.floor(Math.random() * 1000) + 500; // 500-1500 damage
      const bossHp = 45000 - damage;
      
      if (bossHp <= 0) {
        return api.sendMessage(
          `🎉 BOSS ĐÃ BỊ ĐÁNH BẠI!\n\n` +
          `⚔️ Damage: ${damage.toLocaleString()}\n` +
          `💰 Reward: 100,000 xu + Cần Thần\n` +
          `🏆 Boss sẽ respawn sau 30 phút`,
          threadID, messageID
        );
      }

      return api.sendMessage(
        `⚔️ TẤN CÔNG BOSS!\n\n` +
        `💥 Damage: ${damage.toLocaleString()}\n` +
        `❤️ Boss HP: ${bossHp.toLocaleString()}/50,000\n` +
        `⏰ Cooldown: 30 giây`,
        threadID, messageID
      );
    }

    if (action === "info") {
      return api.sendMessage(
        `👹 THÔNG TIN BOSS\n\n` +
        `🔥 Boss Quỷ Đỏ\n` +
        `📍 Vị trí: Núi Lửa\n` +
        `❤️ HP: 50,000\n` +
        `⚔️ Attack: 1,000-2,000\n` +
        `💰 Reward: 100,000 xu + Cần Thần\n` +
        `⏰ Respawn: 30 phút`,
        threadID, messageID
      );
    }

    if (action === "list") {
      return api.sendMessage(
        `📋 DANH SÁCH BOSS\n\n` +
        `🔥 Boss Quỷ Đỏ (Núi Lửa) - HP: 50,000\n` +
        `❄️ Boss Băng Vương (Hang Băng) - HP: 100,000\n` +
        `🌊 Boss Rồng Biển (Rừng Thiêng) - HP: 200,000\n\n` +
        `💡 Boss xuất hiện ngẫu nhiên mỗi 30 phút`,
        threadID, messageID
      );
    }

    if (action === "spawn") {
      return api.sendMessage(`🔥 Boss Quỷ Đỏ đã xuất hiện tại Núi Lửa!`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish boss" để xem hướng dẫn.`, threadID, messageID);
  }

  static async handle_market({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const action = args[1]?.toLowerCase();

    if (!action) {
      return api.sendMessage(
        `🏪 CHỢ CÁ\n\n` +
        `🛒 Giao dịch cá & vật phẩm giữa người chơi\n` +
        `💰 Phí giao dịch: 5% giá bán\n\n` +
        `💡 Lệnh:\n` +
        `• .fish market sell [cá] [giá] - Bán cá\n` +
        `• .fish market buy [id] - Mua cá\n` +
        `• .fish market list - Xem danh sách bán\n` +
        `• .fish market my - Xem cá đang bán của mình\n` +
        `• .fish market cancel [id] - Hủy bán`,
        threadID, messageID
      );
    }

    if (action === "sell") {
      const fishName = args[2];
      const price = parseInt(args[3]);
      
      if (!fishName || !price) {
        return api.sendMessage(`❌ Vui lòng nhập tên cá và giá!`, threadID, messageID);
      }

      if (price < 100 || price > 100000) {
        return api.sendMessage(`❌ Giá phải từ 100 đến 100,000 xu!`, threadID, messageID);
      }

      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      
      if (!data.fish[fishName] || data.fish[fishName] < 1) {
        return api.sendMessage(`❌ Bạn không có cá "${fishName}" để bán!`, threadID, messageID);
      }

      return api.sendMessage(`✅ Đã đăng bán ${fishName} với giá ${price.toLocaleString()} xu!`, threadID, messageID);
    }

    if (action === "list") {
      return api.sendMessage(
        `📋 DANH SÁCH BÁN\n\n` +
        `#1. Cá diếc - 500 xu (bởi User1)\n` +
        `#2. Cá heo - 2,000 xu (bởi User2)\n` +
        `#3. Cá rồng - 15,000 xu (bởi User3)\n\n` +
        `💡 Dùng ".fish market buy [id]" để mua`,
        threadID, messageID
      );
    }

    if (action === "buy") {
      const itemId = args[2];
      if (!itemId) {
        return api.sendMessage(`❌ Vui lòng nhập ID vật phẩm!`, threadID, messageID);
      }

      return api.sendMessage(`✅ Đã mua thành công! Vật phẩm đã được thêm vào túi đồ.`, threadID, messageID);
    }

    if (action === "my") {
      return api.sendMessage(`📋 Bạn chưa có vật phẩm nào đang bán.`, threadID, messageID);
    }

    if (action === "cancel") {
      const itemId = args[2];
      if (!itemId) {
        return api.sendMessage(`❌ Vui lòng nhập ID vật phẩm!`, threadID, messageID);
      }

      return api.sendMessage(`✅ Đã hủy bán vật phẩm #${itemId}!`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish market" để xem hướng dẫn.`, threadID, messageID);
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

  // ===== TITLE SYSTEM =====
  static async handle_title({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();

    if (!action) {
      const titles = [
        { name: "Ngư dân mới", requirement: "Mặc định", unlocked: true },
        { name: "Săn cá hiếm", requirement: "Câu 50 cá hiếm", unlocked: data.stats.rareFish >= 50 },
        { name: "Huyền thoại", requirement: "Câu 10 cá legendary", unlocked: data.stats.legendaryFish >= 10 },
        { name: "Bậc thầy", requirement: "Đạt Level 50", unlocked: data.level >= 50 },
        { name: "Vua biển", requirement: "Top 1 bảng xếp hạng", unlocked: false }, // Sẽ check sau
        { name: "Ngư dân bất tử", requirement: "Câu 1000 cá", unlocked: data.stats.totalFish >= 1000 },
        { name: "Săn boss", requirement: "Đánh bại 5 boss", unlocked: false }, // Sẽ implement sau
        { name: "Thợ săn mồi", requirement: "Sử dụng 100 mồi", unlocked: false } // Sẽ implement sau
      ];

      const titleList = titles.map(title => {
        const status = title.unlocked ? "✅" : "🔒";
        return `${status} ${title.name} - ${title.requirement}`;
      }).join("\n");

      return api.sendMessage(
        `🏷️ HỆ THỐNG DANH HIỆU\n\n` +
        `🎯 Danh hiệu hiện tại: ${data.title}\n\n` +
        `📋 Danh sách danh hiệu:\n${titleList}\n\n` +
        `💡 Cách dùng: .fish title set [tên]`,
        threadID, messageID
      );
    }

    if (action === "set") {
      const titleName = args.slice(2).join(" ");
      if (!titleName) {
        return api.sendMessage(`❌ Vui lòng chọn danh hiệu!`, threadID, messageID);
      }

      const availableTitles = [
        { name: "Ngư dân mới", unlocked: true },
        { name: "Săn cá hiếm", unlocked: data.stats.rareFish >= 50 },
        { name: "Huyền thoại", unlocked: data.stats.legendaryFish >= 10 },
        { name: "Bậc thầy", unlocked: data.level >= 50 },
        { name: "Ngư dân bất tử", unlocked: data.stats.totalFish >= 1000 }
      ];

      const selectedTitle = availableTitles.find(t => 
        t.name.toLowerCase().includes(titleName.toLowerCase()) ||
        titleName.toLowerCase().includes(t.name.toLowerCase())
      );

      if (!selectedTitle) {
        return api.sendMessage(`❌ Không tìm thấy danh hiệu "${titleName}"!`, threadID, messageID);
      }

      if (!selectedTitle.unlocked) {
        return api.sendMessage(`❌ Bạn chưa mở khóa danh hiệu "${selectedTitle.name}"!`, threadID, messageID);
      }

      data.title = selectedTitle.name;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ Đã đặt danh hiệu: ${selectedTitle.name}!`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish title" để xem hướng dẫn.`, threadID, messageID);
  }

  // ===== EVENT SYSTEM =====
  static async handle_event({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const action = args[1]?.toLowerCase();

    if (!action) {
      return api.sendMessage(
        `🎉 SỰ KIỆN ĐẶC BIỆT\n\n` +
        `🔥 Boss Rush: Boss xuất hiện liên tục (30 phút)\n` +
        `🌧️ Mưa Cá: 2x xu, 3x tỉ lệ cá hiếm (1 giờ)\n` +
        `🍀 Lucky Hour: 100% rare fish (30 phút)\n` +
        `💎 Double Drop: 2x vật phẩm (1 giờ)\n\n` +
        `💡 Cách dùng: .fish event join [tên sự kiện]`,
        threadID, messageID
      );
    }

    if (action === "join") {
      const eventName = args.slice(2).join(" ");
      if (!eventName) {
        return api.sendMessage(`❌ Vui lòng chọn sự kiện!`, threadID, messageID);
      }

      return api.sendMessage(`🎉 Đã tham gia sự kiện "${eventName}"! Sự kiện sẽ bắt đầu trong 5 phút.`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish event" để xem hướng dẫn.`, threadID, messageID);
  }

  // ===== WEATHER SYSTEM =====
  static async handle_weather({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const action = args[1]?.toLowerCase();

    if (!action) {
      const weathers = [
        { name: "Trời mưa", effect: "+15% rare fish", emoji: "🌧️" },
        { name: "Trời nắng", effect: "+10% xu", emoji: "☀️" },
        { name: "Trời gió", effect: "-5% durability", emoji: "💨" },
        { name: "Trời sương mù", effect: "+20% legendary fish", emoji: "🌫️" },
        { name: "Trời bình thường", effect: "Không có bonus", emoji: "🌤️" }
      ];

      const weatherList = weathers.map(w => `${w.emoji} ${w.name}: ${w.effect}`).join("\n");

      return api.sendMessage(
        `🌤️ HỆ THỐNG THỜI TIẾT\n\n` +
        `📊 Thời tiết hiện tại: Trời bình thường 🌤️\n\n` +
        `🌦️ Danh sách thời tiết:\n${weatherList}\n\n` +
        `⏰ Thời tiết thay đổi mỗi 30 phút`,
        threadID, messageID
      );
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish weather" để xem hướng dẫn.`, threadID, messageID);
  }

  // ===== GACHA SYSTEM =====
  static async handle_gacha({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();

    if (!action) {
      return api.sendMessage(
        `🎰 GACHA CÁ HIẾM\n\n` +
        `🎫 Tickets: ${data.gacha.tickets}\n` +
        `💔 Pity: ${data.gacha.pity}/10\n\n` +
        `📦 Gacha Pool:\n` +
        `• 3⭐ Common Fish (70%)\n` +
        `• 4⭐ Rare Fish (25%)\n` +
        `• 5⭐ Legendary Fish (5%)\n\n` +
        `💡 Lệnh:\n` +
        `• .fish gacha pull [số lần] - Gacha\n` +
        `• .fish gacha buy [số lần] - Mua ticket\n` +
        `• .fish gacha info - Thông tin gacha`,
        threadID, messageID
      );
    }

    if (action === "pull") {
      const pulls = parseInt(args[2]) || 1;
      if (pulls < 1 || pulls > 10) {
        return api.sendMessage(`❌ Số lần gacha phải từ 1-10!`, threadID, messageID);
      }

      if (data.gacha.tickets < pulls) {
        return api.sendMessage(`❌ Bạn không đủ ticket! Cần ${pulls} tickets.`, threadID, messageID);
      }

      const gachaPool = [
        // 3⭐ Common (70%)
        { name: "Cá diếc", rarity: "common", stars: 3, chance: 70 },
        { name: "Cá lóc", rarity: "common", stars: 3, chance: 70 },
        { name: "Cá mồi", rarity: "common", stars: 3, chance: 70 },
        // 4⭐ Rare (25%)
        { name: "Cá heo", rarity: "rare", stars: 4, chance: 25 },
        { name: "Cá mặt trăng", rarity: "rare", stars: 4, chance: 25 },
        // 5⭐ Legendary (5%)
        { name: "Cá mập", rarity: "legendary", stars: 5, chance: 5 },
        { name: "Cá rồng", rarity: "legendary", stars: 5, chance: 5 },
        { name: "Cá ma", rarity: "legendary", stars: 5, chance: 5 },
        { name: "Cá thần thoại", rarity: "legendary", stars: 5, chance: 5 }
      ];

      let results = [];
      for (let i = 0; i < pulls; i++) {
        data.gacha.pity++;
        const chance = Math.random() * 100;
        
        // Pity system: 10 pulls = guaranteed 4⭐
        if (data.gacha.pity >= 10) {
          const rareFish = gachaPool.filter(f => f.stars === 4);
          const randomRare = rareFish[Math.floor(Math.random() * rareFish.length)];
          results.push(randomRare);
          data.gacha.pity = 0;
        } else {
          let selectedFish;
          if (chance < 5) {
            const legendaryFish = gachaPool.filter(f => f.stars === 5);
            selectedFish = legendaryFish[Math.floor(Math.random() * legendaryFish.length)];
            data.gacha.pity = 0;
          } else if (chance < 30) {
            const rareFish = gachaPool.filter(f => f.stars === 4);
            selectedFish = rareFish[Math.floor(Math.random() * rareFish.length)];
            data.gacha.pity = 0;
          } else {
            const commonFish = gachaPool.filter(f => f.stars === 3);
            selectedFish = commonFish[Math.floor(Math.random() * commonFish.length)];
          }
          results.push(selectedFish);
        }

        // Add fish to inventory
        data.fish[selectedFish.name] = (data.fish[selectedFish.name] || 0) + 1;
        if (!data.dex.includes(selectedFish.name)) data.dex.push(selectedFish.name);
      }

      data.gacha.tickets -= pulls;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

      const resultMsg = results.map(fish => {
        const stars = "⭐".repeat(fish.stars);
        const emoji = fish.rarity === "legendary" ? "🟡" : fish.rarity === "rare" ? "🔵" : "⚪";
        return `${emoji} ${stars} ${fish.name}`;
      }).join("\n");

      return api.sendMessage(
        `🎰 GACHA KẾT QUẢ (${pulls} lần):\n\n${resultMsg}\n\n` +
        `🎫 Tickets còn lại: ${data.gacha.tickets}\n` +
        `💔 Pity: ${data.gacha.pity}/10`,
        threadID, messageID
      );
    }

    if (action === "buy") {
      const amount = parseInt(args[2]) || 1;
      const cost = amount * 1000; // 1 ticket = 1,000 xu
      
      if (data.xu < cost) {
        return api.sendMessage(`❌ Bạn không đủ xu! Cần ${cost.toLocaleString()} xu.`, threadID, messageID);
      }

      data.xu -= cost;
      data.gacha.tickets += amount;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

      return api.sendMessage(`✅ Đã mua ${amount} ticket với giá ${cost.toLocaleString()} xu!`, threadID, messageID);
    }

    if (action === "info") {
      return api.sendMessage(
        `📊 THÔNG TIN GACHA\n\n` +
        `🎫 Giá ticket: 1,000 xu\n` +
        `💔 Pity system: 10 pulls = guaranteed 4⭐\n` +
        `🎯 Tỉ lệ:\n` +
        `• 3⭐ Common: 70%\n` +
        `• 4⭐ Rare: 25%\n` +
        `• 5⭐ Legendary: 5%\n\n` +
        `💡 Tips: Gacha nhiều lần để tăng pity!`,
        threadID, messageID
      );
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish gacha" để xem hướng dẫn.`, threadID, messageID);
  }

  // ===== SKIN SYSTEM =====
  static async handle_skin({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();

    if (!action) {
      const rodSkins = [
        { name: "default", display: "Cần Gỗ", unlocked: true },
        { name: "diamond", display: "Cần Kim Cương", unlocked: false },
        { name: "rainbow", display: "Cần Cầu Vồng", unlocked: false },
        { name: "shadow", display: "Cần Bóng Đêm", unlocked: false },
        { name: "divine", display: "Cần Thần", unlocked: false }
      ];

      const bagSkins = [
        { name: "default", display: "Túi Thường", unlocked: true },
        { name: "magic", display: "Túi Ma Thuật", unlocked: false },
        { name: "infinite", display: "Túi Vô Hạn", unlocked: false }
      ];

      const rodList = rodSkins.map(skin => {
        const status = skin.unlocked ? "✅" : "🔒";
        return `${status} ${skin.display}`;
      }).join("\n");

      const bagList = bagSkins.map(skin => {
        const status = skin.unlocked ? "✅" : "🔒";
        return `${status} ${skin.display}`;
      }).join("\n");

      return api.sendMessage(
        `🎨 SKIN SYSTEM\n\n` +
        `🎣 Cần câu hiện tại: ${data.skins.rod}\n` +
        `🎒 Túi đồ hiện tại: ${data.skins.bag}\n\n` +
        `🎣 ROD SKINS:\n${rodList}\n\n` +
        `🎒 BAG SKINS:\n${bagList}\n\n` +
        `💡 Lệnh:\n` +
        `• .fish skin rod [tên] - Đổi skin cần\n` +
        `• .fish skin bag [tên] - Đổi skin túi\n` +
        `• .fish skin unlock [type] [tên] - Mở khóa skin`,
        threadID, messageID
      );
    }

    if (action === "rod") {
      const skinName = args[2]?.toLowerCase();
      if (!skinName) {
        return api.sendMessage(`❌ Vui lòng chọn skin!`, threadID, messageID);
      }

      const availableSkins = ["default", "diamond", "rainbow", "shadow", "divine"];
      if (!availableSkins.includes(skinName)) {
        return api.sendMessage(`❌ Skin "${skinName}" không tồn tại!`, threadID, messageID);
      }

      data.skins.rod = skinName;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ Đã đổi skin cần câu thành: ${skinName}!`, threadID, messageID);
    }

    if (action === "bag") {
      const skinName = args[2]?.toLowerCase();
      if (!skinName) {
        return api.sendMessage(`❌ Vui lòng chọn skin!`, threadID, messageID);
      }

      const availableSkins = ["default", "magic", "infinite"];
      if (!availableSkins.includes(skinName)) {
        return api.sendMessage(`❌ Skin "${skinName}" không tồn tại!`, threadID, messageID);
      }

      data.skins.bag = skinName;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ Đã đổi skin túi đồ thành: ${skinName}!`, threadID, messageID);
    }

    if (action === "unlock") {
      const type = args[2]?.toLowerCase();
      const skinName = args[3]?.toLowerCase();
      
      if (!type || !skinName) {
        return api.sendMessage(`❌ Vui lòng nhập loại và tên skin!`, threadID, messageID);
      }

      return api.sendMessage(`✅ Đã mở khóa skin ${skinName} (${type})!`, threadID, messageID);
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish skin" để xem hướng dẫn.`, threadID, messageID);
  }

  // ===== WORLD EXPLORATION =====
  static async handle_explore({ api, event, model, Threads, Users, Currencies, args }) {
    const { senderID, threadID, messageID } = event;
    const userFile = `system/data/fishing/${senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const action = args[1]?.toLowerCase();

    if (!action) {
      const allAreas = [
        // Basic Areas
        { name: "Sông Lặng", type: "basic", required: 1, discovered: true },
        { name: "Hồ Lớn", type: "basic", required: 3, discovered: data.exploration.discoveredAreas.includes("Hồ Lớn") },
        { name: "Rừng Thiêng", type: "basic", required: 5, discovered: data.exploration.discoveredAreas.includes("Rừng Thiêng") },
        { name: "Núi Lửa", type: "basic", required: 8, discovered: data.exploration.discoveredAreas.includes("Núi Lửa") },
        { name: "Hang Băng", type: "basic", required: 12, discovered: data.exploration.discoveredAreas.includes("Hang Băng") },
        
        // Secret Areas
        { name: "Hang Động Bí Mật", type: "secret", required: 15, key: 1, discovered: data.exploration.discoveredAreas.includes("Hang Động Bí Mật") },
        { name: "Đảo Hoang", type: "secret", required: 20, key: 2, discovered: data.exploration.discoveredAreas.includes("Đảo Hoang") },
        { name: "Vùng Nước Sâu", type: "deep", required: 25, oxygen: 1, discovered: data.exploration.discoveredAreas.includes("Vùng Nước Sâu") },
        { name: "Rừng Ma", type: "night", required: 30, discovered: data.exploration.discoveredAreas.includes("Rừng Ma") },
        
        // Advanced Areas
        { name: "Thung Lũng Rồng", type: "advanced", required: 35, discovered: data.exploration.discoveredAreas.includes("Thung Lũng Rồng") },
        { name: "Đại Dương Xanh", type: "ocean", required: 40, discovered: data.exploration.discoveredAreas.includes("Đại Dương Xanh") },
        { name: "Hang Động Thời Gian", type: "time", required: 50, discovered: data.exploration.discoveredAreas.includes("Hang Động Thời Gian") },
        
        // Legendary Areas
        { name: "Thiên Đường Cá", type: "legendary", required: 60, discovered: data.exploration.discoveredAreas.includes("Thiên Đường Cá") },
        { name: "Vực Sâu Vô Tận", type: "abyss", required: 80, discovered: data.exploration.discoveredAreas.includes("Vực Sâu Vô Tận") },
        { name: "Cổng Không Gian", type: "space", required: 100, discovered: data.exploration.discoveredAreas.includes("Cổng Không Gian") }
      ];

      const areaList = allAreas.map(area => {
        const status = area.discovered ? "✅" : "🔒";
        const req = area.type === "secret" ? `LV ${area.required} + Key` :
                   area.type === "deep" ? `LV ${area.required} + Oxygen` :
                   `LV ${area.required}`;
        const typeIcon = area.type === "secret" ? "🗝️" : 
                        area.type === "deep" ? "🤿" :
                        area.type === "night" ? "🌙" :
                        area.type === "advanced" ? "⚡" :
                        area.type === "ocean" ? "🌊" :
                        area.type === "time" ? "⏰" :
                        area.type === "legendary" ? "👑" :
                        area.type === "abyss" ? "🕳️" :
                        area.type === "space" ? "🚀" : "📍";
        return `${status} ${typeIcon} ${area.name} - ${req}`;
      }).join("\n");

      return api.sendMessage(
        `🌍 KHÁM PHÁ THẾ GIỚI\n\n` +
        `🗝️ Keys: ${data.exploration.keys}\n` +
        `🤿 Oxygen Tanks: ${data.exploration.oxygenTank}\n` +
        `📍 Khu vực hiện tại: ${data.khu}\n\n` +
        `🗺️ DANH SÁCH KHU VỰC:\n${areaList}\n\n` +
        `💡 Lệnh:\n` +
        `• .fish explore go [tên] - Chuyển đến khu vực\n` +
        `• .fish explore discover - Khám phá khu vực mới\n` +
        `• .fish explore treasure - Tìm kho báu\n` +
        `• .fish explore map - Xem bản đồ`,
        threadID, messageID
      );
    }

    if (action === "go") {
      const areaName = args.slice(2).join(" ");
      if (!areaName) {
        return api.sendMessage(`❌ Vui lòng chọn khu vực!`, threadID, messageID);
      }

      const areas = {
        "Sông Lặng": { required: 1, type: "basic" },
        "Hồ Lớn": { required: 3, type: "basic" },
        "Rừng Thiêng": { required: 5, type: "basic" },
        "Núi Lửa": { required: 8, type: "basic" },
        "Hang Băng": { required: 12, type: "basic" },
        "Hang Động Bí Mật": { required: 15, type: "secret", key: 1 },
        "Đảo Hoang": { required: 20, type: "secret", key: 2 },
        "Vùng Nước Sâu": { required: 25, type: "deep", oxygen: 1 },
        "Rừng Ma": { required: 30, type: "night" },
        "Thung Lũng Rồng": { required: 35, type: "advanced" },
        "Đại Dương Xanh": { required: 40, type: "ocean" },
        "Hang Động Thời Gian": { required: 50, type: "time" },
        "Thiên Đường Cá": { required: 60, type: "legendary" },
        "Vực Sâu Vô Tận": { required: 80, type: "abyss" },
        "Cổng Không Gian": { required: 100, type: "space" }
      };

      const selectedArea = areas[areaName];
      if (!selectedArea) {
        return api.sendMessage(`❌ Không tìm thấy khu vực "${areaName}"!`, threadID, messageID);
      }

      if (data.level < selectedArea.required) {
        return api.sendMessage(`❌ Bạn cần Level ${selectedArea.required} để vào ${areaName}!`, threadID, messageID);
      }

      if (selectedArea.type === "secret" && data.exploration.keys < selectedArea.key) {
        return api.sendMessage(`❌ Bạn cần ${selectedArea.key} Key để vào ${areaName}!`, threadID, messageID);
      }

      if (selectedArea.type === "deep" && data.exploration.oxygenTank < selectedArea.oxygen) {
        return api.sendMessage(`❌ Bạn cần ${selectedArea.oxygen} Oxygen Tank để vào ${areaName}!`, threadID, messageID);
      }

      data.khu = areaName;
      if (!data.exploration.discoveredAreas.includes(areaName)) {
        data.exploration.discoveredAreas.push(areaName);
      }
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

      return api.sendMessage(`✅ Đã chuyển đến ${areaName}!`, threadID, messageID);
    }

    if (action === "discover") {
      const discoveryChance = Math.random() * 100;
      if (discoveryChance < 10) { // 10% chance
        const newAreas = ["Hang Động Bí Mật", "Đảo Hoang", "Vùng Nước Sâu", "Rừng Ma"];
        const discoveredArea = newAreas[Math.floor(Math.random() * newAreas.length)];
        
        if (!data.exploration.discoveredAreas.includes(discoveredArea)) {
          data.exploration.discoveredAreas.push(discoveredArea);
          fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
          return api.sendMessage(`🎉 Khám phá thành công! Bạn đã tìm thấy ${discoveredArea}!`, threadID, messageID);
        }
      }
      
      return api.sendMessage(`🔍 Khám phá không thành công. Hãy thử lại!`, threadID, messageID);
    }

    if (action === "treasure") {
      const treasureChance = Math.random() * 100;
      if (treasureChance < 5) { // 5% chance
        const rewards = [
          { item: "Key", amount: 1 },
          { item: "Oxygen Tank", amount: 1 },
          { item: "Gacha Ticket", amount: 1 },
          { item: "Đá nâng cấp", amount: 3 }
        ];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        
        if (reward.item === "Key") data.exploration.keys += reward.amount;
        else if (reward.item === "Oxygen Tank") data.exploration.oxygenTank += reward.amount;
        else if (reward.item === "Gacha Ticket") data.gacha.tickets += reward.amount;
        else if (reward.item === "Đá nâng cấp") data.inventory["Đá nâng cấp"] = (data.inventory["Đá nâng cấp"] || 0) + reward.amount;
        
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
        return api.sendMessage(`💎 Tìm thấy kho báu! +${reward.amount} ${reward.item}!`, threadID, messageID);
      }
      
      return api.sendMessage(`🗺️ Không tìm thấy kho báu. Hãy thử lại!`, threadID, messageID);
    }

    if (action === "map") {
      return api.sendMessage(
        `🗺️ BẢN ĐỒ THẾ GIỚI\n\n` +
        `📍 Khu vực đã khám phá: ${data.exploration.discoveredAreas.length}/15\n` +
        `🗝️ Keys: ${data.exploration.keys}\n` +
        `🤿 Oxygen Tanks: ${data.exploration.oxygenTank}\n` +
        `🎫 Gacha Tickets: ${data.gacha.tickets}\n\n` +
        `💡 Tips: Dùng ".fish explore discover" để tìm khu vực mới!`,
        threadID, messageID
      );
    }

    return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish explore" để xem hướng dẫn.`, threadID, messageID);
  }
};