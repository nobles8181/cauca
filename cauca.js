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

    const userFile = `system/data/fishing/${senderID}.json`;
    if (!fs.existsSync(userFile)) {
      const name = (await Users.getName(senderID)) || `Người chơi ${senderID}`;
      fs.writeFileSync(userFile, JSON.stringify({
        name, xu: 1000, rod: { name: "Cần Gỗ", tier: 0 },
        line: { name: "Dây thường", durability: 20, maxDurability: 20 },
        bait: "Mồi thường", level: 1, fish: {}, dex: [], buffs: [],
        title: "", khu: "Sông Lặng"
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
      case "shop": return this.handle_shop({ api, event, model, Threads, Users, Currencies });
      case "craft": return this.handle_craft({ api, event, model, Threads, Users, Currencies });
      case "upgrade": return this.handle_upgrade({ api, event, model, Threads, Users, Currencies });
      case "bait": return this.handle_bait({ api, event, model, Threads, Users, Currencies });
      case "dex": return this.handle_dex({ api, event, model, Threads, Users, Currencies });
      case "sell": return this.handle_sell({ api, event, model, Threads, Users, Currencies });
      case "khu": return this.handle_khu({ api, event, model, Threads, Users, Currencies });
      case "duel": return this.handle_duel({ api, event, model, Threads, Users, Currencies });
      case "boss": return this.handle_boss({ api, event, model, Threads, Users, Currencies });
      case "hire": return this.handle_hire({ api, event, model, Threads, Users, Currencies });
      case "market": return this.handle_market({ api, event, model, Threads, Users, Currencies });
      case "quest": return this.handle_quest({ api, event, model, Threads, Users, Currencies });
      case "top": return this.handle_top({ api, event, model, Threads, Users, Currencies });
      case "line": return this.handle_line({ api, event, model, Threads, Users, Currencies });
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

    const chance = Math.random() * 100;
    let fish;
    if (chance < 65) fish = fishList.find(f => f.rarity === "common");
    else if (chance < 90) fish = fishList.find(f => f.rarity === "rare");
    else fish = fishList.find(f => f.rarity === "legendary");

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

    data.xu += fish.value;
    data.line.durability--;
    data.fish[fish.name] = (data.fish[fish.name] || 0) + 1;
    if (!data.dex.includes(fish.name)) data.dex.push(fish.name);

    fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

    const fishMsg =
      `${congrats[Math.floor(Math.random() * congrats.length)]}\n` +
      `(${fish.rarity.toUpperCase()} – ${emoji[fish.rarity]})\n` +
      `💰 +${fish.value.toLocaleString()} xu`;

    return api.sendMessage(fishMsg, threadID, messageID);
  }
  static async handle_shop({ api, event, model, Threads, Users, Currencies }) {
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
      `• Mồi hiếm - 2000 xu`;
    return api.sendMessage(shopMsg, event.threadID, event.messageID);
  }

  static async handle_craft({ api, event, model, Threads, Users, Currencies }) {
    return api.sendMessage(
      `⚒️ CHẾ TẠO\n\n• Cần Rồng (+1): yêu cầu Cần Bạc + Đá x3\n• Cần Bóng Tối (+2): Cần Vàng + Đá x5\n• Không thể mua các cần này từ shop!`,
      event.threadID,
      event.messageID
    );
  }

  static async handle_upgrade({ api, event, model, Threads, Users, Currencies }) {
    return api.sendMessage(
      `📈 NÂNG CẤP CẦN CÂU\n\n• Dùng Đá nâng cấp để tăng +1, tối đa +5\n• Càng nâng cao, tỉ lệ bắt cá hiếm cao hơn và giảm rách dây`,
      event.threadID,
      event.messageID
    );
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
    const data = JSON.parse(fs.readFileSync(`system/data/fishing/${event.senderID}.json`));
    const fishBag = data.fish;
    const list = Object.keys(fishBag).length
      ? Object.entries(fishBag).map(([f, n]) => `• ${f} × ${n}`).join("\n")
      : "❌ Bạn chưa có con cá nào.";

    return api.sendMessage(`🎒 TÚI CÁ\n\n${list}`, event.threadID, event.messageID);
  }

  static async handle_bait({ api, event, model, Threads, Users, Currencies }) {
    const baitMsg =
      `🪱 MỒI CÂU\n\n` +
      `• Mồi thường: cơ bản\n` +
      `• Mồi thơm: tăng 10% tỉ lệ ra cá rare\n` +
      `• Mồi hiếm: tăng 25% tỉ lệ ra cá rare & legendary\n` +
      `• Một số mồi đặc biệt có thể chỉ có từ sự kiện`;
    return api.sendMessage(baitMsg, event.threadID, event.messageID);
  }

  static async handle_line({ api, event, model, Threads, Users, Currencies }) {
    return api.sendMessage(
      `🧵 DÂY CÂU\n\n• Dây thường: 20 lần dùng\n• Dây bền: 40 lần dùng\n• Nếu dây đứt, bạn sẽ không thể câu.`,
      event.threadID,
      event.messageID
    );
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

  static async handle_khu({ api, event, model, Threads, Users, Currencies }) {
    const userFile = `system/data/fishing/${event.senderID}.json`;
    const data = JSON.parse(fs.readFileSync(userFile));
    const level = data.level;

    const areas = [
      { name: "Sông Lặng", required: 1 },
      { name: "Hồ Lớn", required: 3 },
      { name: "Rừng Thiêng", required: 5 },
      { name: "Núi Lửa", required: 8 },
      { name: "Hang Băng", required: 12 }
    ];

    const list = areas.map(area => {
      const status = level >= area.required ? "(✔️ Mở)" : `(🔒 Cần LV ${area.required})`;
      const boss = (area.name === "Núi Lửa") ? "🔥 Boss cá!" : "";
      return `• ${area.name} ${status} ${boss}`;
    }).join("\n");

    return api.sendMessage(`📍 KHU VỰC\n${list}\n\nDùng .fish khu [tên] để chọn`, event.threadID, event.messageID);
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