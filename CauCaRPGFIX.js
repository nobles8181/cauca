const fs = require("fs");

module.exports = class {
  static config = {
    name: "fish",
    aliases: ["fishing", "cauca"],
    version: "1.0.0",
    role: 0,
    author: "Panna",
    info: "Game câu cá RPG",
    Category: "Game",
    guides: ".fish + lệnh",
    cd: 5,
    hasPrefix: true,
    images: []
  };

  static async onRun({ api, event, msg, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Bắt đầu xử lý lệnh");
      
      const { threadID, senderID, messageID } = event;
      const input = args[0]?.toLowerCase();

      console.log(`🎣 CauCaRPG: User ${senderID}, Command: ${input}`);

      // Tạo thư mục nếu chưa có
      const folder = "system/data/fishing";
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log("🎣 CauCaRPG: Đã tạo thư mục fishing");
      }

      const userFile = `system/data/fishing/${senderID}.json`;
      
      // Tạo file user nếu chưa có
      if (!fs.existsSync(userFile)) {
        console.log(`🎣 CauCaRPG: Tạo file mới cho user ${senderID}`);
        
        let name = `Người chơi ${senderID}`;
        try {
          if (Users && typeof Users.getName === 'function') {
            name = await Users.getName(senderID) || name;
            console.log(`🎣 CauCaRPG: Lấy tên user thành công: ${name}`);
          }
        } catch (error) {
          console.log(`🎣 CauCaRPG: Lỗi lấy tên user: ${error.message}`);
        }

        const userData = {
          name, 
          xu: 1000, 
          rod: { name: "Cần Gỗ", tier: 0 },
          line: { name: "Dây thường", durability: 20, maxDurability: 20 },
          bait: "Mồi thường", 
          level: 1, 
          fish: {}, 
          dex: [], 
          title: "Ngư dân mới", 
          khu: "Sông Lặng", 
          inventory: {
            "Đá nâng cấp": 0,
            "Mồi thơm": 0,
            "Mồi hiếm": 0,
            "Dây bền": 0
          }, 
          stats: {
            totalFish: 0,
            rareFish: 0,
            legendaryFish: 0,
            totalEarned: 0
          }, 
          skins: {
            rod: "default",
            bag: "default",
            avatar: "default"
          }, 
          gacha: {
            tickets: 0,
            pity: 0
          }, 
          exploration: {
            discoveredAreas: ["Sông Lặng"],
            keys: 0,
            oxygenTank: 0
          }
        };

        fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
        console.log(`🎣 CauCaRPG: Đã tạo file user thành công`);
      }

      if (!input) {
        console.log("🎣 CauCaRPG: Hiển thị menu chính");
        return api.sendMessage(
          `🎣 MENU CÂU CÁ RPG\n\n` +
          `• .fish cauca - Câu cá\n` +
          `• .fish info - Thông tin người chơi\n` +
          `• .fish shop - Mua đồ\n` +
          `• .fish gacha - Gacha cá hiếm\n` +
          `• .fish skin - Skin cần câu\n` +
          `• .fish explore - Khám phá thế giới\n` +
          `• .fish hire - Thuê ngư dân\n` +
          `• .fish top - Bảng xếp hạng\n\n` +
          `💡 Gõ ".fish [lệnh]" để sử dụng`,
          threadID, messageID
        );
      }

      console.log(`🎣 CauCaRPG: Xử lý lệnh: ${input}`);
      
      switch (input) {
        case "cauca": 
          console.log("🎣 CauCaRPG: Gọi handle_cauca");
          return this.handle_cauca({ api, event, model, Threads, Users, Currencies });
        case "info": 
          console.log("🎣 CauCaRPG: Gọi handle_info");
          return this.handle_info({ api, event, model, Threads, Users, Currencies });
        case "shop": 
          console.log("🎣 CauCaRPG: Gọi handle_shop");
          return this.handle_shop({ api, event, model, Threads, Users, Currencies, args });
        case "gacha": 
          console.log("🎣 CauCaRPG: Gọi handle_gacha");
          return this.handle_gacha({ api, event, model, Threads, Users, Currencies, args });
        case "skin": 
          console.log("🎣 CauCaRPG: Gọi handle_skin");
          return this.handle_skin({ api, event, model, Threads, Users, Currencies, args });
        case "explore": 
          console.log("🎣 CauCaRPG: Gọi handle_explore");
          return this.handle_explore({ api, event, model, Threads, Users, Currencies, args });
        case "hire": 
          console.log("🎣 CauCaRPG: Gọi handle_hire");
          return this.handle_hire({ api, event, model, Threads, Users, Currencies, args });
        case "top": 
          console.log("🎣 CauCaRPG: Gọi handle_top");
          return this.handle_top({ api, event, model, Threads, Users, Currencies });
        default:
          console.log(`🎣 CauCaRPG: Lệnh không hợp lệ: ${input}`);
          return api.sendMessage(
            `⚠️ Lệnh không hợp lệ. Gõ ".fish" để xem menu.`, threadID, messageID
          );
      }
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong onRun: ${error.message}`);
      console.log(`🎣 CauCaRPG: Stack trace: ${error.stack}`);
      return api.sendMessage(
        `❌ Có lỗi xảy ra: ${error.message}\nVui lòng thử lại sau!`, 
        event.threadID, 
        event.messageID
      );
    }
  }

  static async handle_cauca({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Bắt đầu câu cá");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));

      if (data.line.durability <= 0) {
        return api.sendMessage(`🧵 Dây câu đã đứt, hãy mua dây mới!`, threadID, messageID);
      }

      const fishList = [
        { name: "Cá diếc", rarity: "common", value: 300 },
        { name: "Cá lóc", rarity: "common", value: 400 },
        { name: "Cá heo", rarity: "rare", value: 1500 },
        { name: "Cá mập", rarity: "legendary", value: 6000 }
      ];

      let baseChance = Math.random() * 100;
      let fish;
      
      if (data.bait === "Mồi thơm") {
        baseChance += 10;
      } else if (data.bait === "Mồi hiếm") {
        baseChance += 25;
      }
      
      baseChance += (data.rod.tier || 0) * 5;

      if (baseChance < 65) {
        fish = fishList.find(f => f.rarity === "common");
      } else if (baseChance < 90) {
        fish = fishList.find(f => f.rarity === "rare");
      } else {
        fish = fishList.find(f => f.rarity === "legendary");
      }

      const emoji = {
        common: "⚪",
        rare: "🔵",
        legendary: "🟡"
      };

      const finalValue = Math.floor(fish.value * (1 + (data.rod.tier || 0) * 0.1));
      
      data.xu += finalValue;
      data.line.durability--;
      data.fish[fish.name] = (data.fish[fish.name] || 0) + 1;
      if (!data.dex.includes(fish.name)) data.dex.push(fish.name);
      
      data.stats.totalFish = (data.stats.totalFish || 0) + 1;
      data.stats.totalEarned = (data.stats.totalEarned || 0) + finalValue;
      if (fish.rarity === "rare") data.stats.rareFish = (data.stats.rareFish || 0) + 1;
      if (fish.rarity === "legendary") data.stats.legendaryFish = (data.stats.legendaryFish || 0) + 1;
      
      const oldLevel = data.level;
      data.level = Math.floor(data.xu / 10000) + 1;

      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

      let fishMsg = `🎉 Bạn câu được ${fish.name}!\n` +
        `(${fish.rarity.toUpperCase()} – ${emoji[fish.rarity]})\n` +
        `💰 +${finalValue.toLocaleString()} xu`;
      
      if (data.level > oldLevel) {
        fishMsg += `\n🎉 LEVEL UP! Bạn đã đạt Level ${data.level}!`;
      }

      console.log("🎣 CauCaRPG: Câu cá thành công");
      return api.sendMessage(fishMsg, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_cauca: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra khi câu cá!`, event.threadID, event.messageID);
    }
  }

  static async handle_info({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị thông tin");
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
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_info: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_shop({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị shop");
      const { senderID, threadID, messageID } = event;
      const action = args[1]?.toLowerCase();

      if (!action) {
        const shopMsg =
          `🛒 SHOP CÂU CÁ\n\n` +
          `🎣 CẦN CÂU:\n` +
          `• Cần Gỗ (+0) - 0 xu (có sẵn)\n` +
          `• Cần Đồng (+0) - 2,000 xu\n` +
          `• Cần Sắt (+0) - 5,000 xu\n` +
          `• Cần Bạc (+0) - 10,000 xu\n` +
          `• Cần Vàng (+0) - 20,000 xu\n\n` +
          `🧵 DÂY CÂU:\n` +
          `• Dây thường - 200 xu\n` +
          `• Dây bền - 500 xu\n` +
          `• Dây thép - 1,000 xu\n\n` +
          `🪱 MỒI:\n` +
          `• Mồi thường - 0 xu\n` +
          `• Mồi thơm - 800 xu\n` +
          `• Mồi hiếm - 2,000 xu\n\n` +
          `💡 Cách dùng: .fish shop buy [tên] [số lượng]`;
        return api.sendMessage(shopMsg, threadID, messageID);
      }

      if (action === "buy") {
        const item = args[2]?.toLowerCase();
        const amount = parseInt(args[3]) || 1;
        
        if (!item) {
          return api.sendMessage(`❌ Vui lòng chọn vật phẩm!`, threadID, messageID);
        }

        const shopItems = {
          "cần đồng": { price: 2000, type: "rod", name: "Cần Đồng", tier: 0 },
          "cần sắt": { price: 5000, type: "rod", name: "Cần Sắt", tier: 0 },
          "cần bạc": { price: 10000, type: "rod", name: "Cần Bạc", tier: 0 },
          "cần vàng": { price: 20000, type: "rod", name: "Cần Vàng", tier: 0 },
          "dây thường": { price: 200, type: "line", name: "Dây thường", durability: 20, maxDurability: 20 },
          "dây bền": { price: 500, type: "line", name: "Dây bền", durability: 40, maxDurability: 40 },
          "dây thép": { price: 1000, type: "line", name: "Dây thép", durability: 60, maxDurability: 60 },
          "mồi thơm": { price: 800, type: "item", name: "Mồi thơm" },
          "mồi hiếm": { price: 2000, type: "item", name: "Mồi hiếm" }
        };

        const selectedItem = shopItems[item];
        if (!selectedItem) {
          return api.sendMessage(`❌ Không tìm thấy vật phẩm "${item}"!`, threadID, messageID);
        }

        const userFile = `system/data/fishing/${senderID}.json`;
        const data = JSON.parse(fs.readFileSync(userFile));
        const totalCost = selectedItem.price * amount;

        if (data.xu < totalCost) {
          return api.sendMessage(`❌ Bạn không đủ xu! Cần ${totalCost.toLocaleString()} xu.`, threadID, messageID);
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
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_shop: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_gacha({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị gacha");
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
          { name: "Cá diếc", rarity: "common", stars: 3 },
          { name: "Cá lóc", rarity: "common", stars: 3 },
          { name: "Cá heo", rarity: "rare", stars: 4 },
          { name: "Cá mập", rarity: "legendary", stars: 5 },
          { name: "Cá rồng", rarity: "legendary", stars: 5 }
        ];

        let results = [];
        for (let i = 0; i < pulls; i++) {
          data.gacha.pity++;
          const chance = Math.random() * 100;
          
          let selectedFish;
          if (data.gacha.pity >= 10) {
            const rareFish = gachaPool.filter(f => f.stars === 4);
            selectedFish = rareFish[Math.floor(Math.random() * rareFish.length)];
            data.gacha.pity = 0;
          } else {
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
          }
          results.push(selectedFish);
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
        const cost = amount * 1000;
        
        if (data.xu < cost) {
          return api.sendMessage(`❌ Bạn không đủ xu! Cần ${cost.toLocaleString()} xu.`, threadID, messageID);
        }

        data.xu -= cost;
        data.gacha.tickets += amount;
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

        return api.sendMessage(`✅ Đã mua ${amount} ticket với giá ${cost.toLocaleString()} xu!`, threadID, messageID);
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish gacha" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_gacha: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_skin({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị skin");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      const action = args[1]?.toLowerCase();

      if (!action) {
        return api.sendMessage(
          `🎨 SKIN SYSTEM\n\n` +
          `🎣 Cần câu hiện tại: ${data.skins.rod}\n` +
          `🎒 Túi đồ hiện tại: ${data.skins.bag}\n` +
          `👤 Avatar hiện tại: ${data.skins.avatar}\n\n` +
          `💡 Lệnh:\n` +
          `• .fish skin rod [tên] - Đổi skin cần\n` +
          `• .fish skin bag [tên] - Đổi skin túi\n` +
          `• .fish skin avatar [tên] - Đổi avatar`,
          threadID, messageID
        );
      }

      if (action === "rod") {
        const skinName = args[2]?.toLowerCase();
        if (!skinName) {
          return api.sendMessage(`❌ Vui lòng chọn skin!`, threadID, messageID);
        }

        const availableSkins = ["default", "copper", "iron", "silver", "gold"];
        if (!availableSkins.includes(skinName)) {
          return api.sendMessage(`❌ Skin "${skinName}" không tồn tại!`, threadID, messageID);
        }

        data.skins.rod = skinName;
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
        return api.sendMessage(`✅ Đã đổi skin cần câu thành: ${skinName}!`, threadID, messageID);
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish skin" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_skin: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_explore({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị explore");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      const action = args[1]?.toLowerCase();

      if (!action) {
        const allAreas = [
          { name: "Sông Lặng", type: "basic", required: 1, discovered: true },
          { name: "Hồ Lớn", type: "basic", required: 3, discovered: data.exploration.discoveredAreas.includes("Hồ Lớn") },
          { name: "Rừng Thiêng", type: "basic", required: 5, discovered: data.exploration.discoveredAreas.includes("Rừng Thiêng") },
          { name: "Núi Lửa", type: "basic", required: 8, discovered: data.exploration.discoveredAreas.includes("Núi Lửa") },
          { name: "Hang Băng", type: "basic", required: 12, discovered: data.exploration.discoveredAreas.includes("Hang Băng") }
        ];

        const areaList = allAreas.map(area => {
          const status = area.discovered ? "✅" : "🔒";
          return `${status} ${area.name} - LV ${area.required}`;
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
          "Hang Băng": { required: 12, type: "basic" }
        };

        const selectedArea = areas[areaName];
        if (!selectedArea) {
          return api.sendMessage(`❌ Không tìm thấy khu vực "${areaName}"!`, threadID, messageID);
        }

        if (data.level < selectedArea.required) {
          return api.sendMessage(`❌ Bạn cần Level ${selectedArea.required} để vào ${areaName}!`, threadID, messageID);
        }

        data.khu = areaName;
        if (!data.exploration.discoveredAreas.includes(areaName)) {
          data.exploration.discoveredAreas.push(areaName);
        }
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

        return api.sendMessage(`✅ Đã chuyển đến ${areaName}!`, threadID, messageID);
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish explore" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_explore: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_hire({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị hire");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      const action = args[1]?.toLowerCase();

      if (!action) {
        const hireList = [
          { name: "Ngư dân tập sự", cost: 1000, duration: 30, efficiency: 1, description: "Câu cá cơ bản trong 30 phút" },
          { name: "Ngư dân chuyên", cost: 3000, duration: 60, efficiency: 2, description: "Câu cá hiệu quả trong 1 giờ" },
          { name: "Ngư dân bậc thầy", cost: 8000, duration: 120, efficiency: 3, description: "Câu cá chuyên nghiệp trong 2 giờ" }
        ];

        const hireMsg = hireList.map(hire => 
          `🧑‍🌾 ${hire.name}\n` +
          `💰 Giá: ${hire.cost.toLocaleString()} xu\n` +
          `⏰ Thời gian: ${hire.duration} phút\n` +
          `⚡ Hiệu suất: ${hire.efficiency}x\n` +
          `📝 ${hire.description}\n`
        ).join("\n");

        return api.sendMessage(
          `🧑‍🌾 THUÊ NGƯ DÂN CÂU HỘ\n\n` +
          `💰 Xu hiện tại: ${data.xu.toLocaleString()} xu\n` +
          `⏰ Đang thuê: ${data.hire?.active ? `${data.hire.fisher} (${data.hire.timeLeft} phút)` : "Không có"}\n\n` +
          `📋 DANH SÁCH NGƯ DÂN:\n${hireMsg}\n` +
          `💡 Lệnh:\n` +
          `• .fish hire [tên] - Thuê ngư dân\n` +
          `• .fish hire status - Xem trạng thái\n` +
          `• .fish hire fire - Sa thải ngư dân`,
          threadID, messageID
        );
      }

      if (action === "status") {
        if (!data.hire?.active) {
          return api.sendMessage(`❌ Bạn chưa thuê ngư dân nào!`, threadID, messageID);
        }

        return api.sendMessage(
          `📊 TRẠNG THÁI NGƯ DÂN\n\n` +
          `🧑‍🌾 ${data.hire.fisher}\n` +
          `⏰ Thời gian còn lại: ${data.hire.timeLeft} phút\n` +
          `⚡ Hiệu suất: ${data.hire.efficiency}x`,
          threadID, messageID
        );
      }

      if (action === "fire") {
        if (!data.hire?.active) {
          return api.sendMessage(`❌ Bạn chưa thuê ngư dân nào!`, threadID, messageID);
        }

        delete data.hire;
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
        return api.sendMessage(`✅ Đã sa thải ngư dân!`, threadID, messageID);
      }

      const fisherName = args.slice(1).join(" ");
      if (!fisherName) {
        return api.sendMessage(`❌ Vui lòng chọn ngư dân để thuê!`, threadID, messageID);
      }

      const hireOptions = {
        "ngư dân tập sự": { cost: 1000, duration: 30, efficiency: 1 },
        "ngư dân chuyên": { cost: 3000, duration: 60, efficiency: 2 },
        "ngư dân bậc thầy": { cost: 8000, duration: 120, efficiency: 3 }
      };

      const selectedFisher = Object.entries(hireOptions).find(([name, _]) => 
        name.toLowerCase().includes(fisherName.toLowerCase()) ||
        fisherName.toLowerCase().includes(name.toLowerCase())
      );

      if (!selectedFisher) {
        return api.sendMessage(`❌ Không tìm thấy ngư dân "${fisherName}"!`, threadID, messageID);
      }

      const [fisherName_, fisherData] = selectedFisher;

      if (data.xu < fisherData.cost) {
        return api.sendMessage(`❌ Bạn không đủ xu! Cần ${fisherData.cost.toLocaleString()} xu.`, threadID, messageID);
      }

      if (data.hire?.active) {
        return api.sendMessage(`❌ Bạn đã có ngư dân đang làm việc! Dùng ".fish hire fire" để sa thải.`, threadID, messageID);
      }

      data.xu -= fisherData.cost;
      data.hire = {
        active: true,
        fisher: fisherName_,
        duration: fisherData.duration,
        timeLeft: fisherData.duration,
        efficiency: fisherData.efficiency,
        fishCaught: 0,
        xuEarned: 0,
        startTime: Date.now()
      };

      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

      return api.sendMessage(
        `✅ Đã thuê ${fisherName_} thành công!\n\n` +
        `💰 Đã trả: ${fisherData.cost.toLocaleString()} xu\n` +
        `⏰ Thời gian: ${fisherData.duration} phút\n` +
        `⚡ Hiệu suất: ${fisherData.efficiency}x\n\n` +
        `💡 Dùng ".fish hire status" để xem tiến độ`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_hire: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_top({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị top");
      const dir = "system/data/fishing";
      const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));

      const top = files.map(f => {
        const data = JSON.parse(fs.readFileSync(`${dir}/${f}`));
        return { name: data.name, xu: data.xu };
      }).sort((a, b) => b.xu - a.xu).slice(0, 10);

      const topMsg = `🏆 BẢNG XẾP HẠNG NGƯ DÂN\n\n` +
        top.map((u, i) => `#${i + 1}. ${u.name} - ${u.xu.toLocaleString()} xu`).join("\n");
      
      return api.sendMessage(topMsg, event.threadID, event.messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_top: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async onLoad({ api, model }) {
    console.log("🎣 CauCaRPG: Module đã được load");
    const folder = "system/data/fishing";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  }

  static async onEvent({ api, event, model, Threads, Users, Currencies }) {
    // Có thể xử lý sự kiện tin nhắn nếu cần
  }

  static async onReply({ api, event, model, Threads, Users, Currencies, onReply }) {
    // Có thể xử lý trả lời tin nhắn nếu có
  }

  static async onReaction({ api, event, model, Threads, Users, Currencies, onReaction }) {
    // Có thể xử lý phản ứng nếu có
  }
};