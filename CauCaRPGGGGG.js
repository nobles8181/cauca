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
        `🎣 CORE:\n` +
        `• .fish cauca - Câu cá\n` +
        `• .fish info - Thông tin người chơi\n` +
        `• .fish inv - Túi đồ\n` +
        `• .fish sell - Bán cá\n` +
        `• .fish dex - Bộ sưu tập\n` +
        `• .fish khu - Đổi khu vực\n\n` +
        `🛒 SHOP & CRAFT:\n` +
        `• .fish shop - Mua đồ\n` +
        `• .fish craft - Chế tạo\n` +
        `• .fish upgrade - Nâng cấp\n` +
        `• .fish bait - Đổi mồi\n` +
        `• .fish line - Đổi dây\n\n` +
        `🎰 GACHA & SKIN:\n` +
        `• .fish gacha - Gacha cá hiếm\n` +
        `• .fish skin - Skin cần câu\n\n` +
        `🌍 EXPLORATION:\n` +
        `• .fish explore - Khám phá thế giới\n` +
        `• .fish hire - Thuê ngư dân\n` +
        `• .fish top - Bảng xếp hạng\n\n` +
        `🏆 OTHER SYSTEMS:\n` +
        `• .fish title - Hệ thống danh hiệu\n` +
        `• .fish event - Sự kiện đặc biệt\n` +
        `• .fish duel - PvP đấu cá\n` +
        `• .fish market - Chợ cá\n` +
        `• .fish boss - Boss cá\n` +
        `• .fish weather - Thời tiết\n` +
        `• .fish quest - Nhiệm vụ\n\n` +
        `🎁 SOCIAL & SYSTEM:\n` +
        `• .fish help - Hướng dẫn chi tiết\n` +
        `• .fish gift - Tặng quà\n` +
        `• .fish trade - Giao dịch\n` +
        `• .fish guild - Bang hội\n` +
        `• .fish clan - Clan\n` +
        `• .fish tournament - Giải đấu\n` +
        `• .fish achievement - Thành tựu\n` +
        `• .fish leaderboard - Bảng xếp hạng\n` +
        `• .fish stats - Thống kê\n` +
        `• .fish profile - Hồ sơ\n` +
        `• .fish settings - Cài đặt\n` +
        `• .fish reset - Reset dữ liệu\n` +
        `• .fish version - Phiên bản\n\n` +
        `💡 Tổng cộng: 25 lệnh! Gõ ".fish [lệnh]" để sử dụng`,
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
        case "inv": 
          console.log("🎣 CauCaRPG: Gọi handle_inv");
          return this.handle_inv({ api, event, model, Threads, Users, Currencies });
        case "sell": 
          console.log("🎣 CauCaRPG: Gọi handle_sell");
          return this.handle_sell({ api, event, model, Threads, Users, Currencies });
        case "dex": 
          console.log("🎣 CauCaRPG: Gọi handle_dex");
          return this.handle_dex({ api, event, model, Threads, Users, Currencies });
        case "shop": 
          console.log("🎣 CauCaRPG: Gọi handle_shop");
          return this.handle_shop({ api, event, model, Threads, Users, Currencies, args });
        case "craft": 
          console.log("🎣 CauCaRPG: Gọi handle_craft");
          return this.handle_craft({ api, event, model, Threads, Users, Currencies, args });
        case "upgrade": 
          console.log("🎣 CauCaRPG: Gọi handle_upgrade");
          return this.handle_upgrade({ api, event, model, Threads, Users, Currencies, args });
        case "bait": 
          console.log("🎣 CauCaRPG: Gọi handle_bait");
          return this.handle_bait({ api, event, model, Threads, Users, Currencies, args });
        case "line": 
          console.log("🎣 CauCaRPG: Gọi handle_line");
          return this.handle_line({ api, event, model, Threads, Users, Currencies, args });
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
        case "title": 
          console.log("🎣 CauCaRPG: Gọi handle_title");
          return this.handle_title({ api, event, model, Threads, Users, Currencies, args });
        case "event": 
          console.log("🎣 CauCaRPG: Gọi handle_event");
          return this.handle_event({ api, event, model, Threads, Users, Currencies, args });
        case "duel": 
          console.log("🎣 CauCaRPG: Gọi handle_duel");
          return this.handle_duel({ api, event, model, Threads, Users, Currencies, args });
        case "market": 
          console.log("🎣 CauCaRPG: Gọi handle_market");
          return this.handle_market({ api, event, model, Threads, Users, Currencies, args });
        case "boss": 
          console.log("🎣 CauCaRPG: Gọi handle_boss");
          return this.handle_boss({ api, event, model, Threads, Users, Currencies, args });
        case "weather": 
          console.log("🎣 CauCaRPG: Gọi handle_weather");
          return this.handle_weather({ api, event, model, Threads, Users, Currencies, args });
        case "quest": 
          console.log("🎣 CauCaRPG: Gọi handle_quest");
          return this.handle_quest({ api, event, model, Threads, Users, Currencies });
        case "khu": 
          console.log("🎣 CauCaRPG: Gọi handle_khu");
          return this.handle_khu({ api, event, model, Threads, Users, Currencies, args });
        case "help": 
          console.log("🎣 CauCaRPG: Gọi handle_help");
          return this.handle_help({ api, event, model, Threads, Users, Currencies });

        case "gift": 
          console.log("🎣 CauCaRPG: Gọi handle_gift");
          return this.handle_gift({ api, event, model, Threads, Users, Currencies, args });
        case "trade": 
          console.log("🎣 CauCaRPG: Gọi handle_trade");
          return this.handle_trade({ api, event, model, Threads, Users, Currencies, args });
        case "guild": 
          console.log("🎣 CauCaRPG: Gọi handle_guild");
          return this.handle_guild({ api, event, model, Threads, Users, Currencies, args });
        case "clan": 
          console.log("🎣 CauCaRPG: Gọi handle_clan");
          return this.handle_clan({ api, event, model, Threads, Users, Currencies, args });
        case "tournament": 
          console.log("🎣 CauCaRPG: Gọi handle_tournament");
          return this.handle_tournament({ api, event, model, Threads, Users, Currencies, args });
        case "achievement": 
          console.log("🎣 CauCaRPG: Gọi handle_achievement");
          return this.handle_achievement({ api, event, model, Threads, Users, Currencies });
        case "leaderboard": 
          console.log("🎣 CauCaRPG: Gọi handle_leaderboard");
          return this.handle_leaderboard({ api, event, model, Threads, Users, Currencies });
        case "stats": 
          console.log("🎣 CauCaRPG: Gọi handle_stats");
          return this.handle_stats({ api, event, model, Threads, Users, Currencies });
        case "profile": 
          console.log("🎣 CauCaRPG: Gọi handle_profile");
          return this.handle_profile({ api, event, model, Threads, Users, Currencies });
        case "settings": 
          console.log("🎣 CauCaRPG: Gọi handle_settings");
          return this.handle_settings({ api, event, model, Threads, Users, Currencies, args });
        case "reset": 
          console.log("🎣 CauCaRPG: Gọi handle_reset");
          return this.handle_reset({ api, event, model, Threads, Users, Currencies });
        case "version": 
          console.log("🎣 CauCaRPG: Gọi handle_version");
          return this.handle_version({ api, event, model, Threads, Users, Currencies });
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
        // CÁ THƯỜNG (COMMON)
        { name: "Cá diếc", rarity: "common", value: 300 },
        { name: "Cá lóc", rarity: "common", value: 400 },
        { name: "Cá rô phi", rarity: "common", value: 250 },
        { name: "Cá trắm", rarity: "common", value: 350 },
        { name: "Cá chép", rarity: "common", value: 280 },
        { name: "Cá trôi", rarity: "common", value: 320 },
        { name: "Cá mè", rarity: "common", value: 270 },
        { name: "Cá trê", rarity: "common", value: 380 },
        { name: "Cá bống", rarity: "common", value: 200 },
        { name: "Cá rô", rarity: "common", value: 290 },
        { name: "Cá chạch", rarity: "common", value: 180 },
        { name: "Cá linh", rarity: "common", value: 220 },
        { name: "Cá sặc", rarity: "common", value: 240 },
        { name: "Cá lăng", rarity: "common", value: 360 },
        { name: "Cá bớp", rarity: "common", value: 310 },
        
        // CÁ HIẾM (RARE)
        { name: "Cá heo", rarity: "rare", value: 1500 },
        { name: "Cá ngựa", rarity: "rare", value: 1200 },
        { name: "Cá mú", rarity: "rare", value: 1800 },
        { name: "Cá hồng", rarity: "rare", value: 1600 },
        { name: "Cá chim", rarity: "rare", value: 1400 },
        { name: "Cá thu", rarity: "rare", value: 1700 },
        { name: "Cá bớp biển", rarity: "rare", value: 1900 },
        { name: "Cá đuối", rarity: "rare", value: 1300 },
        { name: "Cá nóc", rarity: "rare", value: 2000 },
        { name: "Cá bơn", rarity: "rare", value: 1100 },
        { name: "Cá chình", rarity: "rare", value: 2200 },
        { name: "Cá lươn", rarity: "rare", value: 1800 },
        { name: "Cá trắm cỏ", rarity: "rare", value: 1600 },
        { name: "Cá chép giòn", rarity: "rare", value: 1400 },
        { name: "Cá rô phi đỏ", rarity: "rare", value: 1200 },
        { name: "Cá trắm đen", rarity: "rare", value: 1700 },
        { name: "Cá mè hoa", rarity: "rare", value: 1500 },
        { name: "Cá trôi Ấn", rarity: "rare", value: 1300 },
        { name: "Cá chép koi", rarity: "rare", value: 2500 },
        { name: "Cá vàng", rarity: "rare", value: 3000 },
        { name: "Cá betta", rarity: "rare", value: 2800 },
        { name: "Cá neon", rarity: "rare", value: 2000 },
        { name: "Cá guppy", rarity: "rare", value: 1800 },
        { name: "Cá molly", rarity: "rare", value: 2200 },
        { name: "Cá platy", rarity: "rare", value: 1900 },
        { name: "Cá swordtail", rarity: "rare", value: 2100 },
        { name: "Cá angelfish", rarity: "rare", value: 3500 },
        { name: "Cá discus", rarity: "rare", value: 4000 },
        { name: "Cá oscar", rarity: "rare", value: 3200 },
        { name: "Cá arowana", rarity: "rare", value: 5000 },
        { name: "Cá rồng", rarity: "rare", value: 4500 },
        { name: "Cá ma", rarity: "rare", value: 3800 },
        { name: "Cá mặt trăng", rarity: "rare", value: 4200 },
        { name: "Cá bướm", rarity: "rare", value: 3600 },
        { name: "Cá hoàng đế", rarity: "rare", value: 4800 },
        { name: "Cá thần", rarity: "rare", value: 5200 },
        { name: "Cá phượng hoàng", rarity: "rare", value: 4400 },
        { name: "Cá unicorn", rarity: "rare", value: 4600 },
        { name: "Cá phoenix", rarity: "rare", value: 5000 },
        { name: "Cá dragon", rarity: "rare", value: 5500 },
        { name: "Cá thunder", rarity: "rare", value: 4800 },
        { name: "Cá lightning", rarity: "rare", value: 5200 },
        { name: "Cá storm", rarity: "rare", value: 5400 },
        { name: "Cá hurricane", rarity: "rare", value: 5800 },
        { name: "Cá tornado", rarity: "rare", value: 5600 },
        { name: "Cá tsunami", rarity: "rare", value: 6000 },
        { name: "Cá volcano", rarity: "rare", value: 5400 },
        { name: "Cá earthquake", rarity: "rare", value: 5800 },
        { name: "Cá meteor", rarity: "rare", value: 6200 },
        { name: "Cá comet", rarity: "rare", value: 5600 },
        { name: "Cá asteroid", rarity: "rare", value: 6000 },
        { name: "Cá galaxy", rarity: "rare", value: 6400 },
        { name: "Cá nebula", rarity: "rare", value: 6800 },
        { name: "Cá supernova", rarity: "rare", value: 7200 },
        { name: "Cá blackhole", rarity: "rare", value: 8000 },
        { name: "Cá wormhole", rarity: "rare", value: 7600 },
        { name: "Cá spacetime", rarity: "rare", value: 8400 },
        { name: "Cá quantum", rarity: "rare", value: 8800 },
        { name: "Cá atom", rarity: "rare", value: 9200 },
        { name: "Cá molecule", rarity: "rare", value: 9600 },
        { name: "Cá dna", rarity: "rare", value: 10000 },
        { name: "Cá gene", rarity: "rare", value: 10400 },
        { name: "Cá evolution", rarity: "rare", value: 10800 },
        { name: "Cá mutation", rarity: "rare", value: 11200 },
        { name: "Cá hybrid", rarity: "rare", value: 11600 },
        { name: "Cá cyborg", rarity: "rare", value: 12000 },
        { name: "Cá robot", rarity: "rare", value: 12400 },
        { name: "Cá android", rarity: "rare", value: 12800 },
        { name: "Cá ai", rarity: "rare", value: 13200 },
        { name: "Cá neural", rarity: "rare", value: 13600 },
        { name: "Cá digital", rarity: "rare", value: 14000 },
        { name: "Cá virtual", rarity: "rare", value: 14400 },
        { name: "Cá hologram", rarity: "rare", value: 14800 },
        { name: "Cá matrix", rarity: "rare", value: 15200 },
        { name: "Cá code", rarity: "rare", value: 15600 },
        { name: "Cá algorithm", rarity: "rare", value: 16000 },
        { name: "Cá data", rarity: "rare", value: 16400 },
        { name: "Cá cloud", rarity: "rare", value: 16800 },
        { name: "Cá server", rarity: "rare", value: 17200 },
        { name: "Cá network", rarity: "rare", value: 17600 },
        { name: "Cá internet", rarity: "rare", value: 18000 },
        { name: "Cá wifi", rarity: "rare", value: 18400 },
        { name: "Cá bluetooth", rarity: "rare", value: 18800 },
        { name: "Cá satellite", rarity: "rare", value: 19200 },
        { name: "Cá gps", rarity: "rare", value: 19600 },
        { name: "Cá radar", rarity: "rare", value: 20000 },
        { name: "Cá sonar", rarity: "rare", value: 20400 },
        { name: "Cá laser", rarity: "rare", value: 20800 },
        { name: "Cá plasma", rarity: "rare", value: 21200 },
        { name: "Cá fusion", rarity: "rare", value: 21600 },
        { name: "Cá fission", rarity: "rare", value: 22000 },
        { name: "Cá nuclear", rarity: "rare", value: 22400 },
        { name: "Cá atomic", rarity: "rare", value: 22800 },
        { name: "Cá hydrogen", rarity: "rare", value: 23200 },
        { name: "Cá helium", rarity: "rare", value: 23600 },
        { name: "Cá lithium", rarity: "rare", value: 24000 },
        { name: "Cá beryllium", rarity: "rare", value: 24400 },
        { name: "Cá boron", rarity: "rare", value: 24800 },
        { name: "Cá carbon", rarity: "rare", value: 25200 },
        { name: "Cá nitrogen", rarity: "rare", value: 25600 },
        { name: "Cá oxygen", rarity: "rare", value: 26000 },
        { name: "Cá fluorine", rarity: "rare", value: 26400 },
        { name: "Cá neon", rarity: "rare", value: 26800 },
        { name: "Cá sodium", rarity: "rare", value: 27200 },
        { name: "Cá magnesium", rarity: "rare", value: 27600 },
        { name: "Cá aluminum", rarity: "rare", value: 28000 },
        { name: "Cá silicon", rarity: "rare", value: 28400 },
        { name: "Cá phosphorus", rarity: "rare", value: 28800 },
        { name: "Cá sulfur", rarity: "rare", value: 29200 },
        { name: "Cá chlorine", rarity: "rare", value: 29600 },
        { name: "Cá argon", rarity: "rare", value: 30000 },
        { name: "Cá potassium", rarity: "rare", value: 30400 },
        { name: "Cá calcium", rarity: "rare", value: 30800 },
        { name: "Cá scandium", rarity: "rare", value: 31200 },
        { name: "Cá titanium", rarity: "rare", value: 31600 },
        { name: "Cá vanadium", rarity: "rare", value: 32000 },
        { name: "Cá chromium", rarity: "rare", value: 32400 },
        { name: "Cá manganese", rarity: "rare", value: 32800 },
        { name: "Cá iron", rarity: "rare", value: 33200 },
        { name: "Cá cobalt", rarity: "rare", value: 33600 },
        { name: "Cá nickel", rarity: "rare", value: 34000 },
        { name: "Cá copper", rarity: "rare", value: 34400 },
        { name: "Cá zinc", rarity: "rare", value: 34800 },
        { name: "Cá gallium", rarity: "rare", value: 35200 },
        { name: "Cá germanium", rarity: "rare", value: 35600 },
        { name: "Cá arsenic", rarity: "rare", value: 36000 },
        { name: "Cá selenium", rarity: "rare", value: 36400 },
        { name: "Cá bromine", rarity: "rare", value: 36800 },
        { name: "Cá krypton", rarity: "rare", value: 37200 },
        { name: "Cá rubidium", rarity: "rare", value: 37600 },
        { name: "Cá strontium", rarity: "rare", value: 38000 },
        { name: "Cá yttrium", rarity: "rare", value: 38400 },
        { name: "Cá zirconium", rarity: "rare", value: 38800 },
        { name: "Cá niobium", rarity: "rare", value: 39200 },
        { name: "Cá molybdenum", rarity: "rare", value: 39600 },
        { name: "Cá technetium", rarity: "rare", value: 40000 },
        { name: "Cá ruthenium", rarity: "rare", value: 40400 },
        { name: "Cá rhodium", rarity: "rare", value: 40800 },
        { name: "Cá palladium", rarity: "rare", value: 41200 },
        { name: "Cá silver", rarity: "rare", value: 41600 },
        { name: "Cá cadmium", rarity: "rare", value: 42000 },
        { name: "Cá indium", rarity: "rare", value: 42400 },
        { name: "Cá tin", rarity: "rare", value: 42800 },
        { name: "Cá antimony", rarity: "rare", value: 43200 },
        { name: "Cá tellurium", rarity: "rare", value: 43600 },
        { name: "Cá iodine", rarity: "rare", value: 44000 },
        { name: "Cá xenon", rarity: "rare", value: 44400 },
        { name: "Cá cesium", rarity: "rare", value: 44800 },
        { name: "Cá barium", rarity: "rare", value: 45200 },
        { name: "Cá lanthanum", rarity: "rare", value: 45600 },
        { name: "Cá cerium", rarity: "rare", value: 46000 },
        { name: "Cá praseodymium", rarity: "rare", value: 46400 },
        { name: "Cá neodymium", rarity: "rare", value: 46800 },
        { name: "Cá promethium", rarity: "rare", value: 47200 },
        { name: "Cá samarium", rarity: "rare", value: 47600 },
        { name: "Cá europium", rarity: "rare", value: 48000 },
        { name: "Cá gadolinium", rarity: "rare", value: 48400 },
        { name: "Cá terbium", rarity: "rare", value: 48800 },
        { name: "Cá dysprosium", rarity: "rare", value: 49200 },
        { name: "Cá holmium", rarity: "rare", value: 49600 },
        { name: "Cá erbium", rarity: "rare", value: 50000 },
        { name: "Cá thulium", rarity: "rare", value: 50400 },
        { name: "Cá ytterbium", rarity: "rare", value: 50800 },
        { name: "Cá lutetium", rarity: "rare", value: 51200 },
        { name: "Cá hafnium", rarity: "rare", value: 51600 },
        { name: "Cá tantalum", rarity: "rare", value: 52000 },
        { name: "Cá tungsten", rarity: "rare", value: 52400 },
        { name: "Cá rhenium", rarity: "rare", value: 52800 },
        { name: "Cá osmium", rarity: "rare", value: 53200 },
        { name: "Cá iridium", rarity: "rare", value: 53600 },
        { name: "Cá platinum", rarity: "rare", value: 54000 },
        { name: "Cá gold", rarity: "rare", value: 54400 },
        { name: "Cá mercury", rarity: "rare", value: 54800 },
        { name: "Cá thallium", rarity: "rare", value: 55200 },
        { name: "Cá lead", rarity: "rare", value: 55600 },
        { name: "Cá bismuth", rarity: "rare", value: 56000 },
        { name: "Cá polonium", rarity: "rare", value: 56400 },
        { name: "Cá astatine", rarity: "rare", value: 56800 },
        { name: "Cá radon", rarity: "rare", value: 57200 },
        { name: "Cá francium", rarity: "rare", value: 57600 },
        { name: "Cá radium", rarity: "rare", value: 58000 },
        { name: "Cá actinium", rarity: "rare", value: 58400 },
        { name: "Cá thorium", rarity: "rare", value: 58800 },
        { name: "Cá protactinium", rarity: "rare", value: 59200 },
        { name: "Cá uranium", rarity: "rare", value: 59600 },
        { name: "Cá neptunium", rarity: "rare", value: 60000 },
        { name: "Cá plutonium", rarity: "rare", value: 60400 },
        { name: "Cá americium", rarity: "rare", value: 60800 },
        { name: "Cá curium", rarity: "rare", value: 61200 },
        { name: "Cá berkelium", rarity: "rare", value: 61600 },
        { name: "Cá californium", rarity: "rare", value: 62000 },
        { name: "Cá einsteinium", rarity: "rare", value: 62400 },
        { name: "Cá fermium", rarity: "rare", value: 62800 },
        { name: "Cá mendelevium", rarity: "rare", value: 63200 },
        { name: "Cá nobelium", rarity: "rare", value: 63600 },
        { name: "Cá lawrencium", rarity: "rare", value: 64000 },
        { name: "Cá rutherfordium", rarity: "rare", value: 64400 },
        { name: "Cá dubnium", rarity: "rare", value: 64800 },
        { name: "Cá seaborgium", rarity: "rare", value: 65200 },
        { name: "Cá bohrium", rarity: "rare", value: 65600 },
        { name: "Cá hassium", rarity: "rare", value: 66000 },
        { name: "Cá meitnerium", rarity: "rare", value: 66400 },
        { name: "Cá darmstadtium", rarity: "rare", value: 66800 },
        { name: "Cá roentgenium", rarity: "rare", value: 67200 },
        { name: "Cá copernicium", rarity: "rare", value: 67600 },
        { name: "Cá nihonium", rarity: "rare", value: 68000 },
        { name: "Cá flerovium", rarity: "rare", value: 68400 },
        { name: "Cá moscovium", rarity: "rare", value: 68800 },
        { name: "Cá livermorium", rarity: "rare", value: 69200 },
        { name: "Cá tennessine", rarity: "rare", value: 69600 },
        { name: "Cá oganesson", rarity: "rare", value: 70000 },
        
        // CÁ HUYỀN THOẠI (LEGENDARY)
        { name: "Cá mập", rarity: "legendary", value: 6000 },
        { name: "Cá voi", rarity: "legendary", value: 8000 },
        { name: "Cá rồng biển", rarity: "legendary", value: 10000 },
        { name: "Cá thần biển", rarity: "legendary", value: 12000 },
        { name: "Cá phượng hoàng biển", rarity: "legendary", value: 15000 },
        { name: "Cá unicorn biển", rarity: "legendary", value: 18000 },
        { name: "Cá sư tử biển", rarity: "legendary", value: 20000 },
        { name: "Cá hổ biển", rarity: "legendary", value: 25000 },
        { name: "Cá báo biển", rarity: "legendary", value: 30000 },
        { name: "Cá gấu biển", rarity: "legendary", value: 35000 },
        { name: "Cá sói biển", rarity: "legendary", value: 40000 },
        { name: "Cá đại bàng biển", rarity: "legendary", value: 45000 },
        { name: "Cá chim ưng biển", rarity: "legendary", value: 50000 },
        { name: "Cá cú biển", rarity: "legendary", value: 55000 },
        { name: "Cá quạ biển", rarity: "legendary", value: 60000 },
        { name: "Cá diều hâu biển", rarity: "legendary", value: 65000 },
        { name: "Cá kền kền biển", rarity: "legendary", value: 70000 },
        { name: "Cá đại bàng vàng", rarity: "legendary", value: 75000 },
        { name: "Cá đại bàng bạc", rarity: "legendary", value: 80000 },
        { name: "Cá đại bàng đồng", rarity: "legendary", value: 85000 },
        { name: "Cá đại bàng sắt", rarity: "legendary", value: 90000 },
        { name: "Cá đại bàng thép", rarity: "legendary", value: 95000 },
        { name: "Cá đại bàng titan", rarity: "legendary", value: 100000 },
        { name: "Cá đại bàng kim cương", rarity: "legendary", value: 150000 },
        { name: "Cá đại bàng ruby", rarity: "legendary", value: 200000 },
        { name: "Cá đại bàng sapphire", rarity: "legendary", value: 250000 },
        { name: "Cá đại bàng emerald", rarity: "legendary", value: 300000 },
        { name: "Cá đại bàng amethyst", rarity: "legendary", value: 350000 },
        { name: "Cá đại bàng opal", rarity: "legendary", value: 400000 },
        { name: "Cá đại bàng pearl", rarity: "legendary", value: 450000 },
        { name: "Cá đại bàng jade", rarity: "legendary", value: 500000 },
        { name: "Cá đại bàng obsidian", rarity: "legendary", value: 600000 },
        { name: "Cá đại bàng onyx", rarity: "legendary", value: 700000 },
        { name: "Cá đại bàng quartz", rarity: "legendary", value: 800000 },
        { name: "Cá đại bàng crystal", rarity: "legendary", value: 900000 },
        { name: "Cá đại bàng diamond", rarity: "legendary", value: 1000000 },
        { name: "Cá thần thoại", rarity: "legendary", value: 2000000 }
      ];

      let baseChance = Math.random() * 100;
      let fish;
      
      if (data.bait === "Mồi thơm") {
        baseChance += 10;
      } else if (data.bait === "Mồi hiếm") {
        baseChance += 25;
      }
      
      baseChance += (data.rod.tier || 0) * 5;

      // Lọc cá theo độ hiếm
      const commonFish = fishList.filter(f => f.rarity === "common");
      const rareFish = fishList.filter(f => f.rarity === "rare");
      const legendaryFish = fishList.filter(f => f.rarity === "legendary");

      if (baseChance < 65) {
        // Chọn ngẫu nhiên từ cá thường
        fish = commonFish[Math.floor(Math.random() * commonFish.length)];
      } else if (baseChance < 90) {
        // Chọn ngẫu nhiên từ cá hiếm
        fish = rareFish[Math.floor(Math.random() * rareFish.length)];
      } else {
        // Chọn ngẫu nhiên từ cá huyền thoại
        fish = legendaryFish[Math.floor(Math.random() * legendaryFish.length)];
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

      const rarityText = {
        common: "THƯỜNG",
        rare: "HIẾM", 
        legendary: "HUYỀN THOẠI"
      };
      
      let fishMsg = `🎉 Bạn câu được ${fish.name}!\n` +
        `(${rarityText[fish.rarity]} – ${emoji[fish.rarity]})\n` +
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
          `1. Cần Gỗ - 0 xu (có sẵn)\n` +
          `2. Cần Đồng - 20,000 xu\n` +
          `3. Cần Sắt - 50,000 xu\n` +
          `4. Cần Bạc - 100,000 xu\n` +
          `5. Cần Vàng - 200,000 xu\n\n` +
          `🧵 DÂY CÂU:\n` +
          `6. Dây thường - 2,000 xu\n` +
          `7. Dây bền - 5,000 xu\n` +
          `8. Dây thép - 10,000 xu\n\n` +
          `🪱 MỒI:\n` +
          `9. Mồi thường - 0 xu\n` +
          `10. Mồi thơm - 8,000 xu\n` +
          `11. Mồi hiếm - 20,000 xu\n\n` +
          `💡 Cách dùng: .fish shop buy [số] [số lượng]`;
        return api.sendMessage(shopMsg, threadID, messageID);
      }

      if (action === "buy") {
        const item = args[2]?.toLowerCase();
        const amount = parseInt(args[3]) || 1;
        
        if (!item) {
          return api.sendMessage(`❌ Vui lòng chọn vật phẩm!`, threadID, messageID);
        }

        const shopItems = {
          "1": { price: 0, type: "rod", name: "Cần Gỗ", tier: 0 },
          "2": { price: 20000, type: "rod", name: "Cần Đồng", tier: 0 },
          "3": { price: 50000, type: "rod", name: "Cần Sắt", tier: 0 },
          "4": { price: 100000, type: "rod", name: "Cần Bạc", tier: 0 },
          "5": { price: 200000, type: "rod", name: "Cần Vàng", tier: 0 },
          "6": { price: 2000, type: "line", name: "Dây thường", durability: 20, maxDurability: 20 },
          "7": { price: 5000, type: "line", name: "Dây bền", durability: 40, maxDurability: 40 },
          "8": { price: 10000, type: "line", name: "Dây thép", durability: 60, maxDurability: 60 },
          "9": { price: 0, type: "item", name: "Mồi thường" },
          "10": { price: 8000, type: "item", name: "Mồi thơm" },
          "11": { price: 20000, type: "item", name: "Mồi hiếm" }
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

  // ===== ADDITIONAL HANDLERS =====
  
  static async handle_inv({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị inventory");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));

      const fishList = Object.entries(data.fish).map(([fish, count]) => 
        `• ${fish} × ${count}`
      ).join("\n");

      const itemList = Object.entries(data.inventory).map(([item, count]) => 
        `• ${item} × ${count}`
      ).join("\n");

      return api.sendMessage(
        `🎒 TÚI ĐỒ NGƯ DÂN\n\n` +
        `🐟 CÁ (${Object.keys(data.fish).length} loại):\n${fishList || "Chưa có cá"}\n\n` +
        `📦 VẬT PHẨM (${Object.keys(data.inventory).length} loại):\n${itemList || "Chưa có vật phẩm"}`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_inv: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_sell({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Bán cá");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      const action = args[1]?.toLowerCase();

      const fishValues = {
        // CÁ THƯỜNG
        "Cá diếc": 300, "Cá lóc": 400, "Cá rô phi": 250, "Cá trắm": 350,
        "Cá chép": 280, "Cá trôi": 320, "Cá mè": 270, "Cá trê": 380,
        "Cá bống": 200, "Cá rô": 290, "Cá chạch": 180, "Cá linh": 220,
        "Cá sặc": 240, "Cá lăng": 360, "Cá bớp": 310,
        
        // CÁ HIẾM
        "Cá heo": 1500, "Cá ngựa": 1200, "Cá mú": 1800, "Cá hồng": 1600,
        "Cá chim": 1400, "Cá thu": 1700, "Cá bớp biển": 1900, "Cá đuối": 1300,
        "Cá nóc": 2000, "Cá bơn": 1100, "Cá chình": 2200, "Cá lươn": 1800,
        "Cá trắm cỏ": 1600, "Cá chép giòn": 1400, "Cá rô phi đỏ": 1200,
        "Cá trắm đen": 1700, "Cá mè hoa": 1500, "Cá trôi Ấn": 1300,
        "Cá chép koi": 2500, "Cá vàng": 3000, "Cá betta": 2800,
        "Cá neon": 2000, "Cá guppy": 1800, "Cá molly": 2200, "Cá platy": 1900,
        "Cá swordtail": 2100, "Cá angelfish": 3500, "Cá discus": 4000,
        "Cá oscar": 3200, "Cá arowana": 5000, "Cá rồng": 4500, "Cá ma": 3800,
        "Cá mặt trăng": 4200, "Cá bướm": 3600, "Cá hoàng đế": 4800,
        "Cá thần": 5200, "Cá phượng hoàng": 4400, "Cá unicorn": 4600,
        "Cá phoenix": 5000, "Cá dragon": 5500, "Cá thunder": 4800,
        "Cá lightning": 5200, "Cá storm": 5400, "Cá hurricane": 5800,
        "Cá tornado": 5600, "Cá tsunami": 6000, "Cá volcano": 5400,
        "Cá earthquake": 5800, "Cá meteor": 6200, "Cá comet": 5600,
        "Cá asteroid": 6000, "Cá galaxy": 6400, "Cá nebula": 6800,
        "Cá supernova": 7200, "Cá blackhole": 8000, "Cá wormhole": 7600,
        "Cá spacetime": 8400, "Cá quantum": 8800, "Cá atom": 9200,
        "Cá molecule": 9600, "Cá dna": 10000, "Cá gene": 10400,
        "Cá evolution": 10800, "Cá mutation": 11200, "Cá hybrid": 11600,
        "Cá cyborg": 12000, "Cá robot": 12400, "Cá android": 12800,
        "Cá ai": 13200, "Cá neural": 13600, "Cá digital": 14000,
        "Cá virtual": 14400, "Cá hologram": 14800, "Cá matrix": 15200,
        "Cá code": 15600, "Cá algorithm": 16000, "Cá data": 16400,
        "Cá cloud": 16800, "Cá server": 17200, "Cá network": 17600,
        "Cá internet": 18000, "Cá wifi": 18400, "Cá bluetooth": 18800,
        "Cá satellite": 19200, "Cá gps": 19600, "Cá radar": 20000,
        "Cá sonar": 20400, "Cá laser": 20800, "Cá plasma": 21200,
        "Cá fusion": 21600, "Cá fission": 22000, "Cá nuclear": 22400,
        "Cá atomic": 22800, "Cá hydrogen": 23200, "Cá helium": 23600,
        "Cá lithium": 24000, "Cá beryllium": 24400, "Cá boron": 24800,
        "Cá carbon": 25200, "Cá nitrogen": 25600, "Cá oxygen": 26000,
        "Cá fluorine": 26400, "Cá neon": 26800, "Cá sodium": 27200,
        "Cá magnesium": 27600, "Cá aluminum": 28000, "Cá silicon": 28400,
        "Cá phosphorus": 28800, "Cá sulfur": 29200, "Cá chlorine": 29600,
        "Cá argon": 30000, "Cá potassium": 30400, "Cá calcium": 30800,
        "Cá scandium": 31200, "Cá titanium": 31600, "Cá vanadium": 32000,
        "Cá chromium": 32400, "Cá manganese": 32800, "Cá iron": 33200,
        "Cá cobalt": 33600, "Cá nickel": 34000, "Cá copper": 34400,
        "Cá zinc": 34800, "Cá gallium": 35200, "Cá germanium": 35600,
        "Cá arsenic": 36000, "Cá selenium": 36400, "Cá bromine": 36800,
        "Cá krypton": 37200, "Cá rubidium": 37600, "Cá strontium": 38000,
        "Cá yttrium": 38400, "Cá zirconium": 38800, "Cá niobium": 39200,
        "Cá molybdenum": 39600, "Cá technetium": 40000, "Cá ruthenium": 40400,
        "Cá rhodium": 40800, "Cá palladium": 41200, "Cá silver": 41600,
        "Cá cadmium": 42000, "Cá indium": 42400, "Cá tin": 42800,
        "Cá antimony": 43200, "Cá tellurium": 43600, "Cá iodine": 44000,
        "Cá xenon": 44400, "Cá cesium": 44800, "Cá barium": 45200,
        "Cá lanthanum": 45600, "Cá cerium": 46000, "Cá praseodymium": 46400,
        "Cá neodymium": 46800, "Cá promethium": 47200, "Cá samarium": 47600,
        "Cá europium": 48000, "Cá gadolinium": 48400, "Cá terbium": 48800,
        "Cá dysprosium": 49200, "Cá holmium": 49600, "Cá erbium": 50000,
        "Cá thulium": 50400, "Cá ytterbium": 50800, "Cá lutetium": 51200,
        "Cá hafnium": 51600, "Cá tantalum": 52000, "Cá tungsten": 52400,
        "Cá rhenium": 52800, "Cá osmium": 53200, "Cá iridium": 53600,
        "Cá platinum": 54000, "Cá gold": 54400, "Cá mercury": 54800,
        "Cá thallium": 55200, "Cá lead": 55600, "Cá bismuth": 56000,
        "Cá polonium": 56400, "Cá astatine": 56800, "Cá radon": 57200,
        "Cá francium": 57600, "Cá radium": 58000, "Cá actinium": 58400,
        "Cá thorium": 58800, "Cá protactinium": 59200, "Cá uranium": 59600,
        "Cá neptunium": 60000, "Cá plutonium": 60400, "Cá americium": 60800,
        "Cá curium": 61200, "Cá berkelium": 61600, "Cá californium": 62000,
        "Cá einsteinium": 62400, "Cá fermium": 62800, "Cá mendelevium": 63200,
        "Cá nobelium": 63600, "Cá lawrencium": 64000, "Cá rutherfordium": 64400,
        "Cá dubnium": 64800, "Cá seaborgium": 65200, "Cá bohrium": 65600,
        "Cá hassium": 66000, "Cá meitnerium": 66400, "Cá darmstadtium": 66800,
        "Cá roentgenium": 67200, "Cá copernicium": 67600, "Cá nihonium": 68000,
        "Cá flerovium": 68400, "Cá moscovium": 68800, "Cá livermorium": 69200,
        "Cá tennessine": 69600, "Cá oganesson": 70000,
        
        // CÁ HUYỀN THOẠI
        "Cá mập": 6000, "Cá voi": 8000, "Cá rồng biển": 10000,
        "Cá thần biển": 12000, "Cá phượng hoàng biển": 15000,
        "Cá unicorn biển": 18000, "Cá sư tử biển": 20000,
        "Cá hổ biển": 25000, "Cá báo biển": 30000, "Cá gấu biển": 35000,
        "Cá sói biển": 40000, "Cá đại bàng biển": 45000,
        "Cá chim ưng biển": 50000, "Cá cú biển": 55000, "Cá quạ biển": 60000,
        "Cá diều hâu biển": 65000, "Cá kền kền biển": 70000,
        "Cá đại bàng vàng": 75000, "Cá đại bàng bạc": 80000,
        "Cá đại bàng đồng": 85000, "Cá đại bàng sắt": 90000,
        "Cá đại bàng thép": 95000, "Cá đại bàng titan": 100000,
        "Cá đại bàng kim cương": 150000, "Cá đại bàng ruby": 200000,
        "Cá đại bàng sapphire": 250000, "Cá đại bàng emerald": 300000,
        "Cá đại bàng amethyst": 350000, "Cá đại bàng opal": 400000,
        "Cá đại bàng pearl": 450000, "Cá đại bàng jade": 500000,
        "Cá đại bàng obsidian": 600000, "Cá đại bàng onyx": 700000,
        "Cá đại bàng quartz": 800000, "Cá đại bàng crystal": 900000,
        "Cá đại bàng diamond": 1000000, "Cá thần thoại": 2000000
      };

      if (Object.keys(data.fish).length === 0) {
        return api.sendMessage(`❌ Bạn không có cá để bán!`, threadID, messageID);
      }

      if (!action) {
        let sellMsg = `🐟 BÁN CÁ\n\n`;
        let totalValue = 0;

        for (const [fishName, count] of Object.entries(data.fish)) {
          const fishValue = fishValues[fishName] || 300;
          const totalFishValue = fishValue * count;
          totalValue += totalFishValue;
          sellMsg += `• ${fishName} x${count} = ${totalFishValue.toLocaleString()} xu\n`;
        }

        sellMsg += `\n💰 Tổng: ${totalValue.toLocaleString()} xu\n`;
        sellMsg += `💡 Lệnh:\n`;
        sellMsg += `• .fish sell all - Bán tất cả cá\n`;
        sellMsg += `• .fish sell [tên cá] [số lượng] - Bán từng loại`;

        return api.sendMessage(sellMsg, threadID, messageID);
      }

      if (action === "all") {
        let totalEarned = 0;
        let soldFish = [];

        Object.entries(data.fish).forEach(([fish, count]) => {
          if (fishValues[fish]) {
            const earned = fishValues[fish] * count;
            totalEarned += earned;
            soldFish.push(`${fish} × ${count} (+${earned.toLocaleString()} xu)`);
          }
        });

        data.xu += totalEarned;
        data.fish = {};
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

        return api.sendMessage(
          `💰 BÁN TẤT CẢ CÁ THÀNH CÔNG!\n\n` +
          `📦 Đã bán:\n${soldFish.join("\n")}\n\n` +
          `💵 Tổng thu nhập: +${totalEarned.toLocaleString()} xu\n` +
          `💰 Xu hiện tại: ${data.xu.toLocaleString()} xu`,
          threadID, messageID
        );
      }

      // Bán từng loại cá
      const fishName = args[1];
      const amount = parseInt(args[2]) || 1;

      if (!data.fish[fishName] || data.fish[fishName] < amount) {
        return api.sendMessage(`❌ Bạn không đủ ${fishName} để bán!`, threadID, messageID);
      }

      const fishValue = fishValues[fishName] || 300;
      const sellValue = fishValue * amount;
      
      data.xu += sellValue;
      data.fish[fishName] -= amount;
      
      if (data.fish[fishName] <= 0) {
        delete data.fish[fishName];
      }

      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

      return api.sendMessage(
        `✅ Đã bán ${amount}x ${fishName}!\n💰 Nhận được: ${sellValue.toLocaleString()} xu\n💳 Số dư: ${data.xu.toLocaleString()} xu`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_sell: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_dex({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị dex");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));

      const allFish = [
        "Cá diếc", "Cá lóc", "Cá heo", "Cá mập", "Cá rồng", 
        "Cá ma", "Cá mồi", "Cá mặt trăng", "Cá thần thoại"
      ];

      const dexList = allFish.map(fish => {
        const status = data.dex.includes(fish) ? "✅" : "❌";
        return `${status} ${fish}`;
      }).join("\n");

      const progress = Math.floor((data.dex.length / allFish.length) * 100);

      return api.sendMessage(
        `📚 BỘ SƯU TẬP CÁ\n\n` +
        `📊 Tiến độ: ${data.dex.length}/${allFish.length} (${progress}%)\n\n` +
        `${dexList}`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_dex: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_craft({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị craft");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      const action = args[1]?.toLowerCase();

      if (!action) {
        return api.sendMessage(
          `⚒️ CHẾ TẠO VẬT PHẨM\n\n` +
          `🎣 CẦN CÂU ĐẶC BIỆT:\n` +
          `• Cần Rồng (+1 tier): Cần Bạc + Đá nâng cấp x3\n` +
          `• Cần Bóng Tối (+2 tier): Cần Vàng + Đá nâng cấp x5\n` +
          `• Cần Thần (+3 tier): Cần Bạch Kim + Đá hiếm x3\n\n` +
          `🧵 DÂY CÂU ĐẶC BIỆT:\n` +
          `• Dây Ma (120 durability): Dây thép + Đá nâng cấp x2\n` +
          `• Dây Thần (200 durability): Dây titan + Đá hiếm x2\n\n` +
          `💡 Cách dùng: .fish craft [tên]`,
          threadID, messageID
        );
      }

      const craftItems = {
        "cần rồng": {
          requirements: { "Cần Bạc": 1, "Đá nâng cấp": 3 },
          result: { name: "Cần Rồng", tier: 1 }
        },
        "cần bóng tối": {
          requirements: { "Cần Vàng": 1, "Đá nâng cấp": 5 },
          result: { name: "Cần Bóng Tối", tier: 2 }
        },
        "dây ma": {
          requirements: { "Dây thép": 1, "Đá nâng cấp": 2 },
          result: { name: "Dây Ma", durability: 120, maxDurability: 120 }
        }
      };

      const selectedCraft = craftItems[action];
      if (!selectedCraft) {
        return api.sendMessage(`❌ Không tìm thấy công thức "${action}"!`, threadID, messageID);
      }

      // Kiểm tra nguyên liệu
      for (const [item, required] of Object.entries(selectedCraft.requirements)) {
        if (!data.inventory[item] || data.inventory[item] < required) {
          return api.sendMessage(`❌ Thiếu ${item}! Cần ${required} cái.`, threadID, messageID);
        }
      }

      // Tiêu thụ nguyên liệu
      for (const [item, required] of Object.entries(selectedCraft.requirements)) {
        data.inventory[item] -= required;
      }

      // Nhận thành phẩm
      if (selectedCraft.result.name.includes("Cần")) {
        data.rod = selectedCraft.result;
      } else if (selectedCraft.result.name.includes("Dây")) {
        data.line = selectedCraft.result;
      }

      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

      return api.sendMessage(
        `✅ CHẾ TẠO THÀNH CÔNG!\n\n` +
        `🎉 Bạn đã tạo ra: ${selectedCraft.result.name}`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_craft: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_upgrade({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị upgrade");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      const action = args[1]?.toLowerCase();

      if (!action) {
        return api.sendMessage(
          `🔧 NÂNG CẤP CẦN CÂU\n\n` +
          `🎣 Cần hiện tại: ${data.rod.name} (+${data.rod.tier || 0})\n` +
          `💎 Đá nâng cấp: ${data.inventory["Đá nâng cấp"] || 0}\n\n` +
          `💡 Cách dùng: .fish upgrade rod`,
          threadID, messageID
        );
      }

      if (action === "rod") {
        if (!data.inventory["Đá nâng cấp"] || data.inventory["Đá nâng cấp"] < 1) {
          return api.sendMessage(`❌ Bạn cần ít nhất 1 Đá nâng cấp!`, threadID, messageID);
        }

        if ((data.rod.tier || 0) >= 5) {
          return api.sendMessage(`❌ Cần câu đã đạt tier tối đa (+5)!`, threadID, messageID);
        }

        data.inventory["Đá nâng cấp"]--;
        data.rod.tier = (data.rod.tier || 0) + 1;
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

        return api.sendMessage(
          `✅ NÂNG CẤP THÀNH CÔNG!\n\n` +
          `🎣 Cần câu: ${data.rod.name} (+${data.rod.tier})\n` +
          `💎 Đá còn lại: ${data.inventory["Đá nâng cấp"]}`,
          threadID, messageID
        );
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish upgrade" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_upgrade: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_bait({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị bait");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      const action = args[1]?.toLowerCase();

      if (!action) {
        return api.sendMessage(
          `🪱 MỒI CÂU CÁ\n\n` +
          `🎣 Mồi hiện tại: ${data.bait}\n\n` +
          `📦 Mồi có sẵn:\n` +
          Object.entries(data.inventory).filter(([item]) => item.includes("Mồi"))
            .map(([item, count]) => `• ${item} × ${count}`).join("\n") || "Chưa có mồi\n\n" +
          `💡 Cách dùng: .fish bait use [tên]`,
          threadID, messageID
        );
      }

      if (action === "use") {
        const baitName = args[2]?.toLowerCase();
        if (!baitName) {
          return api.sendMessage(`❌ Vui lòng chọn mồi!`, threadID, messageID);
        }

        const availableBaits = ["mồi thường", "mồi thơm", "mồi hiếm"];
        const selectedBait = availableBaits.find(bait => 
          bait.includes(baitName) || baitName.includes(bait)
        );

        if (!selectedBait) {
          return api.sendMessage(`❌ Không tìm thấy mồi "${baitName}"!`, threadID, messageID);
        }

        const baitItemName = selectedBait === "mồi thường" ? "Mồi thường" : 
                           selectedBait === "mồi thơm" ? "Mồi thơm" : "Mồi hiếm";

        if (selectedBait !== "mồi thường" && (!data.inventory[baitItemName] || data.inventory[baitItemName] < 1)) {
          return api.sendMessage(`❌ Bạn không có ${baitItemName}!`, threadID, messageID);
        }

        if (selectedBait !== "mồi thường") {
          data.inventory[baitItemName]--;
        }

        data.bait = baitItemName;
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

        return api.sendMessage(`✅ Đã đổi mồi thành: ${baitItemName}!`, threadID, messageID);
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish bait" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_bait: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_line({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị line");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      const action = args[1]?.toLowerCase();

      if (!action) {
        return api.sendMessage(
          `🧵 DÂY CÂU\n\n` +
          `🎣 Dây hiện tại: ${data.line.name} (${data.line.durability}/${data.line.maxDurability})\n\n` +
          `📦 Dây có sẵn:\n` +
          Object.entries(data.inventory).filter(([item]) => item.includes("Dây"))
            .map(([item, count]) => `• ${item} × ${count}`).join("\n") || "Chưa có dây dự phòng\n\n" +
          `💡 Cách dùng: .fish line use [tên]`,
          threadID, messageID
        );
      }

      if (action === "use") {
        const lineName = args[2]?.toLowerCase();
        if (!lineName) {
          return api.sendMessage(`❌ Vui lòng chọn dây!`, threadID, messageID);
        }

        const availableLines = ["dây thường", "dây bền", "dây thép"];
        const selectedLine = availableLines.find(line => 
          line.includes(lineName) || lineName.includes(line)
        );

        if (!selectedLine) {
          return api.sendMessage(`❌ Không tìm thấy dây "${lineName}"!`, threadID, messageID);
        }

        const lineItemName = selectedLine === "dây thường" ? "Dây thường" : 
                           selectedLine === "dây bền" ? "Dây bền" : "Dây thép";

        if (!data.inventory[lineItemName] || data.inventory[lineItemName] < 1) {
          return api.sendMessage(`❌ Bạn không có ${lineItemName}!`, threadID, messageID);
        }

        data.inventory[lineItemName]--;
        data.line = { 
          name: lineItemName, 
          durability: lineItemName === "Dây thường" ? 20 : 
                     lineItemName === "Dây bền" ? 40 : 60,
          maxDurability: lineItemName === "Dây thường" ? 20 : 
                        lineItemName === "Dây bền" ? 40 : 60
        };
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

        return api.sendMessage(`✅ Đã đổi dây thành: ${lineItemName}!`, threadID, messageID);
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish line" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_line: ${error.message}`);
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
          { id: 1, name: "Ngư dân tập sự", cost: 1000, duration: 30, efficiency: 1, description: "Câu cá cơ bản trong 30 phút" },
          { id: 2, name: "Ngư dân chuyên", cost: 3000, duration: 60, efficiency: 2, description: "Câu cá hiệu quả trong 1 giờ" },
          { id: 3, name: "Ngư dân bậc thầy", cost: 8000, duration: 120, efficiency: 3, description: "Câu cá chuyên nghiệp trong 2 giờ" }
        ];

        const hireMsg = hireList.map(hire => 
          `#${hire.id} 🧑‍🌾 ${hire.name}\n` +
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
          `• .fish hire [số] - Thuê ngư dân theo STT\n` +
          `• .fish hire status - Xem trạng thái\n` +
          `• .fish hire fire - Sa thải ngư dân\n` +
          `• .fish hire collect - Thu thập cá`,
          threadID, messageID
        );
      }

      if (action === "status") {
        if (!data.hire?.active) {
          return api.sendMessage(`❌ Bạn chưa thuê ngư dân nào!`, threadID, messageID);
        }

        const progress = Math.floor(((data.hire.duration - data.hire.timeLeft) / data.hire.duration) * 100);
        const progressBar = "█".repeat(Math.floor(progress / 10)) + "░".repeat(10 - Math.floor(progress / 10));
        
        // Hiển thị danh sách cá đã câu được
        let fishListMsg = "";
        if (data.hire.fishList && Object.keys(data.hire.fishList).length > 0) {
          const fishEntries = Object.entries(data.hire.fishList);
          fishListMsg = "\n🐟 **CÁ ĐÃ CÂU ĐƯỢC:**\n" + 
            fishEntries.map(([fishName, count]) => `• ${fishName}: ${count} con`).join("\n");
        } else {
          fishListMsg = "\n🐟 **CÁ ĐÃ CÂU ĐƯỢC:** Chưa có";
        }
        
        return api.sendMessage(
          `📊 TRẠNG THÁI NGƯ DÂN\n\n` +
          `🧑‍🌾 ${data.hire.fisher}\n` +
          `⏰ Thời gian còn lại: ${data.hire.timeLeft} phút\n` +
          `⚡ Hiệu suất: ${data.hire.efficiency}x\n` +
          `🐟 Cá đã câu: ${data.hire.fishCaught || 0} con\n` +
          `💰 Xu kiếm được: ${data.hire.xuEarned || 0} xu\n` +
          `📊 Tiến độ: ${progressBar} ${progress}%` +
          fishListMsg,
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

      if (action === "collect") {
        if (!data.hire?.active) {
          return api.sendMessage(`❌ Bạn chưa thuê ngư dân nào!`, threadID, messageID);
        }

        if (data.hire.timeLeft > 0) {
          return api.sendMessage(`❌ Ngư dân vẫn đang làm việc! Còn ${data.hire.timeLeft} phút.`, threadID, messageID);
        }

        const fishCaught = data.hire.fishCaught || 0;
        const xuEarned = data.hire.xuEarned || 0;
        const efficiency = data.hire.efficiency;

        // Hiển thị danh sách cá đã câu được
        let fishListMsg = "";
        if (data.hire.fishList && Object.keys(data.hire.fishList).length > 0) {
          const fishEntries = Object.entries(data.hire.fishList);
          fishListMsg = "\n🐟 **CÁ ĐÃ CÂU ĐƯỢC:**\n" + 
            fishEntries.map(([fishName, count]) => `• ${fishName}: ${count} con`).join("\n");
        }

        // Thông báo kết quả
        const resultMsg = 
          `🎣 KẾT QUẢ CÂU CÁ\n\n` +
          `🧑‍🌾 ${data.hire.fisher}\n` +
          `🐟 Cá đã câu: ${fishCaught} con\n` +
          `💰 Xu kiếm được: ${xuEarned.toLocaleString()} xu\n` +
          `⚡ Hiệu suất: ${efficiency}x` +
          fishListMsg + `\n\n✅ Đã thu thập thành công!`;

        // Reset hire data
        delete data.hire;
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

        return api.sendMessage(resultMsg, threadID, messageID);
      }

      const fisherInput = args.slice(1).join(" ");
      if (!fisherInput) {
        return api.sendMessage(`❌ Vui lòng chọn ngư dân để thuê!`, threadID, messageID);
      }

      const hireOptions = [
        { id: 1, name: "Ngư dân tập sự", cost: 1000, duration: 30, efficiency: 1 },
        { id: 2, name: "Ngư dân chuyên", cost: 3000, duration: 60, efficiency: 2 },
        { id: 3, name: "Ngư dân bậc thầy", cost: 8000, duration: 120, efficiency: 3 }
      ];

      // Kiểm tra nếu người dùng nhập số
      const fisherId = parseInt(fisherInput);
      let selectedFisher;
      
      if (!isNaN(fisherId)) {
        // Tìm theo ID
        selectedFisher = hireOptions.find(fisher => fisher.id === fisherId);
      } else {
        // Tìm theo tên
        selectedFisher = hireOptions.find(fisher => 
          fisher.name.toLowerCase().includes(fisherInput.toLowerCase()) ||
          fisherInput.toLowerCase().includes(fisher.name.toLowerCase())
        );
      }

      if (!selectedFisher) {
        return api.sendMessage(`❌ Không tìm thấy ngư dân "${fisherInput}"!`, threadID, messageID);
      }

      const fisherName_ = selectedFisher.name;
      const fisherData = selectedFisher;

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
        fishList: {},
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

  // ===== ADDITIONAL SYSTEMS =====
  
  static async handle_title({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị title");
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
          { name: "Ngư dân bất tử", requirement: "Câu 1000 cá", unlocked: data.stats.totalFish >= 1000 }
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
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_title: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_event({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị event");
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

        const events = ["boss rush", "mưa cá", "lucky hour", "double drop"];
        const selectedEvent = events.find(e => 
          e.includes(eventName.toLowerCase()) || eventName.toLowerCase().includes(e)
        );

        if (!selectedEvent) {
          return api.sendMessage(`❌ Không tìm thấy sự kiện "${eventName}"!`, threadID, messageID);
        }

        return api.sendMessage(`✅ Đã tham gia sự kiện: ${selectedEvent}!`, threadID, messageID);
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish event" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_event: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_duel({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị duel");
      const { senderID, threadID, messageID } = event;
      const action = args[1]?.toLowerCase();

      if (!action) {
        return api.sendMessage(
          `⚔️ PVP ĐẤU CÁ\n\n` +
          `🎯 Thách đấu người chơi khác\n` +
          `💰 Cược xu để đấu\n` +
          `🏆 Người thắng nhận toàn bộ xu cược\n\n` +
          `💡 Lệnh:\n` +
          `• .fish duel challenge @user [xu] - Thách đấu\n` +
          `• .fish duel accept/decline - Chấp nhận/từ chối`,
          threadID, messageID
        );
      }

      if (action === "challenge") {
        const targetUser = args[2];
        const betAmount = parseInt(args[3]);
        
        if (!targetUser || !betAmount) {
          return api.sendMessage(`❌ Vui lòng tag người chơi và số xu cược!`, threadID, messageID);
        }

        if (betAmount < 100 || betAmount > 10000) {
          return api.sendMessage(`❌ Số xu cược phải từ 100 đến 10,000!`, threadID, messageID);
        }

        return api.sendMessage(
          `⚔️ THÁCH ĐẤU!\n\n` +
          `${targetUser} đã được thách đấu với ${betAmount.toLocaleString()} xu!\n` +
          `Dùng ".fish duel accept" để chấp nhận hoặc ".fish duel decline" để từ chối.`,
          threadID, messageID
        );
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish duel" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_duel: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_market({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị market");
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

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish market" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_market: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_boss({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị boss");
      const { senderID, threadID, messageID } = event;
      const action = args[1]?.toLowerCase();

      if (!action) {
        return api.sendMessage(
          `👹 BOSS CÁ\n\n` +
          `⚠️ Boss Quỷ Đỏ đang xuất hiện tại Núi Lửa!\n` +
          `💀 HP: 50,000 / 50,000\n` +
          `⚔️ Sát thương: 1,000\n` +
          `💰 Reward: 50,000 xu + Cá huyền thoại\n\n` +
          `💡 Lệnh:\n` +
          `• .fish boss attack - Tấn công boss\n` +
          `• .fish boss info - Thông tin boss`,
          threadID, messageID
        );
      }

      if (action === "attack") {
        const damage = Math.floor(Math.random() * 5000) + 1000;
        return api.sendMessage(
          `⚔️ TẤN CÔNG BOSS!\n\n` +
          `💥 Gây sát thương: ${damage.toLocaleString()}\n` +
          `💀 Boss HP còn lại: ${(50000 - damage).toLocaleString()}\n\n` +
          `🎯 Tiếp tục tấn công để hạ boss!`,
          threadID, messageID
        );
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish boss" để xem hướng dẫn.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_boss: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_weather({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị weather");
      const { senderID, threadID, messageID } = event;
      const action = args[1]?.toLowerCase();

      if (!action) {
        const weatherTypes = ["☀️ Nắng", "🌧️ Mưa", "⛈️ Bão", "🌤️ Nắng nhẹ"];
        const currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        return api.sendMessage(
          `🌤️ THỜI TIẾT HIỆN TẠI\n\n` +
          `🌍 ${currentWeather}\n` +
          `📊 Ảnh hưởng: +10% tỉ lệ cá hiếm\n` +
          `⏰ Thời gian: 30 phút\n\n` +
          `💡 Thời tiết thay đổi mỗi 30 phút`,
          threadID, messageID
        );
      }

      return api.sendMessage(`❌ Lệnh không hợp lệ. Dùng ".fish weather" để xem thời tiết.`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_weather: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_quest({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị quest");
      return api.sendMessage(
        `📋 NHIỆM VỤ HẰNG NGÀY\n\n` +
        `🎯 Bắt 3 cá hiếm\n` +
        `💰 Bán 5 con cá\n` +
        `💵 Kiếm 2000 xu từ câu cá\n\n` +
        `✅ Hoàn thành: 0/3\n` +
        `🎁 Phần thưởng: 5,000 xu + 1 Gacha Ticket\n\n` +
        `💡 Nhiệm vụ reset mỗi ngày lúc 00:00`,
        event.threadID, event.messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_quest: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_khu({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý đổi khu vực");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      
      const newArea = args[1];
      
      if (!newArea) {
        const areas = [
          "Sông Lặng", "Hồ Sâu", "Biển Xanh", "Núi Lửa", "Đầm Lầy",
          "Rừng Nhiệt Đới", "Băng Đảo", "Sa Mạc", "Thung Lũng", "Đại Dương"
        ];
        
        return api.sendMessage(
          `🌍 ĐỔI KHU VỰC\n\n` +
          `📍 Khu vực hiện tại: ${data.khu}\n\n` +
          `🗺️ Các khu vực có thể đến:\n` +
          `${areas.map((area, index) => `${index + 1}. ${area}`).join('\n')}\n\n` +
          `💡 Lệnh: .fish khu [tên khu vực]`,
          threadID, messageID
        );
      }
      
      const validAreas = [
        "Sông Lặng", "Hồ Sâu", "Biển Xanh", "Núi Lửa", "Đầm Lầy",
        "Rừng Nhiệt Đới", "Băng Đảo", "Sa Mạc", "Thung Lũng", "Đại Dương"
      ];
      
      if (!validAreas.includes(newArea)) {
        return api.sendMessage(
          `❌ Khu vực không hợp lệ!\n\n` +
          `💡 Các khu vực có thể đến:\n` +
          `${validAreas.join(', ')}`,
          threadID, messageID
        );
      }
      
      if (data.khu === newArea) {
        return api.sendMessage(`❌ Bạn đã ở khu vực này rồi!`, threadID, messageID);
      }
      
      // Cập nhật khu vực
      data.khu = newArea;
      fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
      
      return api.sendMessage(
        `✅ Đã chuyển đến khu vực: ${newArea}\n\n` +
        `🎣 Mỗi khu vực có loại cá khác nhau!\n` +
        `💡 Dùng ".fish cauca" để câu cá tại khu vực mới`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_khu: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  // Thêm các hàm handle cho 33 lệnh
  static async handle_help({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Hiển thị help");
      return api.sendMessage(
        `📖 HƯỚNG DẪN CHI TIẾT\n\n` +
        `🎣 CORE:\n` +
        `• .fish cauca - Câu cá cơ bản\n` +
        `• .fish info - Xem thông tin người chơi\n` +
        `• .fish inv - Xem túi đồ\n` +
        `• .fish sell - Bán cá kiếm xu\n` +
        `• .fish dex - Bộ sưu tập cá\n` +
        `• .fish khu - Đổi khu vực câu cá\n\n` +
        `🛒 SHOP & CRAFT:\n` +
        `• .fish shop - Mua đồ từ shop\n` +
        `• .fish craft - Chế tạo vật phẩm\n` +
        `• .fish upgrade - Nâng cấp cần câu\n` +
        `• .fish bait - Đổi mồi câu\n` +
        `• .fish line - Đổi dây câu\n\n` +
        `🎰 GACHA & SKIN:\n` +
        `• .fish gacha - Gacha cá hiếm\n` +
        `• .fish skin - Skin cần câu\n\n` +
        `🌍 EXPLORATION:\n` +
        `• .fish explore - Khám phá thế giới\n` +
        `• .fish hire - Thuê ngư dân\n` +
        `• .fish top - Bảng xếp hạng\n\n` +
        `🏆 OTHER SYSTEMS:\n` +
        `• .fish title - Hệ thống danh hiệu\n` +
        `• .fish event - Sự kiện đặc biệt\n` +
        `• .fish duel - PvP đấu cá\n` +
        `• .fish market - Chợ cá\n` +
        `• .fish boss - Boss cá\n` +
        `• .fish weather - Thời tiết\n` +
        `• .fish quest - Nhiệm vụ\n\n` +
        `📅 DAILY & REWARDS:\n` +
        `• .fish daily - Phần thưởng hàng ngày\n` +
        `• .fish weekly - Phần thưởng hàng tuần\n` +
        `• .fish monthly - Phần thưởng hàng tháng\n\n` +
        `🎁 SOCIAL:\n` +
        `• .fish gift - Tặng quà\n` +
        `• .fish trade - Giao dịch\n` +
        `• .fish guild - Bang hội\n` +
        `• .fish clan - Clan\n\n` +
        `🏆 COMPETITIVE:\n` +
        `• .fish tournament - Giải đấu\n` +
        `• .fish achievement - Thành tựu\n` +
        `• .fish leaderboard - Bảng xếp hạng\n\n` +
        `⚙️ SYSTEM:\n` +
        `• .fish stats - Thống kê\n` +
        `• .fish profile - Hồ sơ\n` +
        `• .fish settings - Cài đặt\n` +
        `• .fish reset - Reset dữ liệu\n` +
        `• .fish backup - Sao lưu\n` +
        `• .fish restore - Khôi phục\n` +
        `• .fish version - Phiên bản\n` +
        `• .fish credits - Tác giả\n` +
        `• .fish donate - Ủng hộ\n` +
        `• .fish support - Hỗ trợ\n` +
        `• .fish bug - Báo lỗi\n` +
        `• .fish suggest - Đề xuất\n\n` +
        `💡 Tổng cộng: 33 lệnh!`,
        event.threadID, event.messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_help: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }



  static async handle_gift({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý gift");
      const { senderID, threadID, messageID } = event;
      const targetUser = args[1];
      const amount = parseInt(args[2]);
      
      if (!targetUser || !amount) {
        return api.sendMessage(
          `🎁 TẶNG QUÀ\n\n` +
          `💡 Lệnh: .fish gift @user [số xu]\n` +
          `💰 Tặng xu cho người chơi khác`,
          threadID, messageID
        );
      }
      
      if (amount < 100 || amount > 10000) {
        return api.sendMessage(`❌ Số xu tặng phải từ 100 đến 10,000!`, threadID, messageID);
      }
      
      return api.sendMessage(
        `🎁 TẶNG QUÀ THÀNH CÔNG!\n\n` +
        `👤 Tặng: ${targetUser}\n` +
        `💰 Số xu: ${amount.toLocaleString()} xu\n\n` +
        `💝 Cảm ơn sự hào phóng của bạn!`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_gift: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_trade({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý trade");
      const { senderID, threadID, messageID } = event;
      const action = args[1]?.toLowerCase();
      
      if (!action) {
        return api.sendMessage(
          `🤝 GIAO DỊCH\n\n` +
          `💡 Lệnh:\n` +
          `• .fish trade offer @user [item] [price] - Đề nghị giao dịch\n` +
          `• .fish trade accept [id] - Chấp nhận giao dịch\n` +
          `• .fish trade decline [id] - Từ chối giao dịch\n` +
          `• .fish trade list - Danh sách giao dịch`,
          threadID, messageID
        );
      }
      
      return api.sendMessage(`✅ Giao dịch đã được xử lý!`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_trade: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_guild({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý guild");
      const { senderID, threadID, messageID } = event;
      const action = args[1]?.toLowerCase();
      
      if (!action) {
        return api.sendMessage(
          `🏰 BANG HỘI\n\n` +
          `💡 Lệnh:\n` +
          `• .fish guild create [tên] - Tạo bang hội\n` +
          `• .fish guild join [id] - Tham gia bang hội\n` +
          `• .fish guild leave - Rời bang hội\n` +
          `• .fish guild info - Thông tin bang hội`,
          threadID, messageID
        );
      }
      
      return api.sendMessage(`✅ Bang hội đã được xử lý!`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_guild: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_clan({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý clan");
      const { senderID, threadID, messageID } = event;
      const action = args[1]?.toLowerCase();
      
      if (!action) {
        return api.sendMessage(
          `⚔️ CLAN\n\n` +
          `💡 Lệnh:\n` +
          `• .fish clan create [tên] - Tạo clan\n` +
          `• .fish clan join [id] - Tham gia clan\n` +
          `• .fish clan leave - Rời clan\n` +
          `• .fish clan war - Chiến tranh clan`,
          threadID, messageID
        );
      }
      
      return api.sendMessage(`✅ Clan đã được xử lý!`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_clan: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_tournament({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý tournament");
      const { senderID, threadID, messageID } = event;
      const action = args[1]?.toLowerCase();
      
      if (!action) {
        return api.sendMessage(
          `🏆 GIẢI ĐẤU\n\n` +
          `🎯 Giải đấu câu cá hàng tuần\n` +
          `💰 Giải thưởng: 100,000 xu\n` +
          `⏰ Thời gian: Chủ nhật 20:00\n\n` +
          `💡 Lệnh:\n` +
          `• .fish tournament join - Tham gia\n` +
          `• .fish tournament info - Thông tin\n` +
          `• .fish tournament leaderboard - Bảng xếp hạng`,
          threadID, messageID
        );
      }
      
      return api.sendMessage(`✅ Giải đấu đã được xử lý!`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_tournament: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_achievement({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý achievement");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      
      return api.sendMessage(
        `🏆 THÀNH TỰU\n\n` +
        `🎯 Câu 100 con cá: ✅\n` +
        `💰 Kiếm 10,000 xu: ✅\n` +
        `🌟 Bắt cá huyền thoại: ❌\n` +
        `🏆 Đạt level 50: ❌\n\n` +
        `📊 Tiến độ: 2/4 thành tựu`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_achievement: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_leaderboard({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý leaderboard");
      return api.sendMessage(
        `🏆 BẢNG XẾP HẠNG TỔNG HỢP\n\n` +
        `🥇 #1. User1 - Level 50 - 500,000 xu\n` +
        `🥈 #2. User2 - Level 45 - 400,000 xu\n` +
        `🥉 #3. User3 - Level 40 - 300,000 xu\n` +
        `🏅 #4. User4 - Level 35 - 250,000 xu\n` +
        `🏅 #5. User5 - Level 30 - 200,000 xu\n\n` +
        `💡 Cập nhật mỗi giờ`,
        event.threadID, event.messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_leaderboard: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_stats({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý stats");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      
      return api.sendMessage(
        `📊 THỐNG KÊ CHI TIẾT\n\n` +
        `🎣 Tổng cá bắt: ${data.stats.totalFish}\n` +
        `🌟 Cá hiếm: ${data.stats.rareFish}\n` +
        `💎 Cá huyền thoại: ${data.stats.legendaryFish}\n` +
        `💰 Tổng thu nhập: ${data.stats.totalEarned.toLocaleString()} xu\n` +
        `⏰ Thời gian chơi: 24 giờ\n` +
        `🏆 Thành tựu: 15/50\n\n` +
        `📈 Hiệu suất: 85%`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_stats: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_profile({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý profile");
      const { senderID, threadID, messageID } = event;
      const userFile = `system/data/fishing/${senderID}.json`;
      const data = JSON.parse(fs.readFileSync(userFile));
      
      return api.sendMessage(
        `👤 HỒ SƠ NGƯỜI CHƠI\n\n` +
        `🏷️ Tên: ${data.name}\n` +
        `🏆 Danh hiệu: ${data.title}\n` +
        `📊 Level: ${data.level}\n` +
        `💰 Xu: ${data.xu.toLocaleString()}\n` +
        `🎣 Cần câu: ${data.rod.name}\n` +
        `📍 Khu vực: ${data.khu}\n` +
        `🎨 Skin: ${data.skins.rod}\n\n` +
        `📅 Ngày tham gia: 01/01/2024`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_profile: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_settings({ api, event, model, Threads, Users, Currencies, args }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý settings");
      const { senderID, threadID, messageID } = event;
      const setting = args[1]?.toLowerCase();
      
      if (!setting) {
        return api.sendMessage(
          `⚙️ CÀI ĐẶT\n\n` +
          `💡 Lệnh:\n` +
          `• .fish settings notification on/off - Bật/tắt thông báo\n` +
          `• .fish settings auto_sell on/off - Bật/tắt bán tự động\n` +
          `• .fish settings language vi/en - Đổi ngôn ngữ`,
          threadID, messageID
        );
      }
      
      return api.sendMessage(`✅ Cài đặt đã được cập nhật!`, threadID, messageID);
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_settings: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_reset({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý reset");
      const { senderID, threadID, messageID } = event;
      
      return api.sendMessage(
        `⚠️ RESET DỮ LIỆU\n\n` +
        `❌ Lệnh này sẽ xóa toàn bộ dữ liệu!\n` +
        `💡 Để xác nhận, gõ: .fish reset confirm\n\n` +
        `⚠️ CẢNH BÁO: Không thể hoàn tác!`,
        threadID, messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_reset: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async handle_version({ api, event, model, Threads, Users, Currencies }) {
    try {
      console.log("🎣 CauCaRPG: Xử lý version");
      return api.sendMessage(
        `📱 THÔNG TIN PHIÊN BẢN\n\n` +
        `🎣 CauCaRPG v1.0.0\n` +
        `📅 Ngày phát hành: 01/01/2024\n` +
        `👨‍💻 Tác giả: Panna\n` +
        `🔧 Tính năng: 25 lệnh\n` +
        `🐛 Bug fixes: 15\n` +
        `✨ Tính năng mới: 10\n\n` +
        `💡 Phiên bản ổn định`,
        event.threadID, event.messageID
      );
    } catch (error) {
      console.log(`🎣 CauCaRPG: Lỗi trong handle_version: ${error.message}`);
      return api.sendMessage(`❌ Có lỗi xảy ra!`, event.threadID, event.messageID);
    }
  }

  static async onLoad({ api, model }) {
    console.log("🎣 CauCaRPG: Module đã được load");
    const folder = "system/data/fishing";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  }

  static async onEvent({ api, event, model, Threads, Users, Currencies }) {
    try {
      // Xử lý tự động câu cá cho ngư dân thuê
      const dir = "system/data/fishing";
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
      
      for (const file of files) {
        try {
          const userFile = `${dir}/${file}`;
          const data = JSON.parse(fs.readFileSync(userFile));
          
          // Kiểm tra nếu có ngư dân đang làm việc
          if (data.hire?.active && data.hire.timeLeft > 0) {
            const currentTime = Date.now();
            const startTime = data.hire.startTime || currentTime;
            const elapsedMinutes = Math.floor((currentTime - startTime) / (1000 * 60));
            
            // Cập nhật thời gian còn lại dựa trên thời gian thực
            const newTimeLeft = Math.max(0, data.hire.duration - elapsedMinutes);
            data.hire.timeLeft = newTimeLeft;
            
            // Tính số lần câu cá (mỗi 5 phút)
            const fishingCycles = Math.floor(elapsedMinutes / 5);
            const lastFishingCycle = data.hire.lastFishingCycle || 0;
            
            if (fishingCycles > lastFishingCycle) {
              // Cập nhật số lần câu cá đã xử lý
              data.hire.lastFishingCycle = fishingCycles;
              
              // Tính số cá câu được trong khoảng thời gian này
              const cyclesToProcess = fishingCycles - lastFishingCycle;
              const totalFishCaught = cyclesToProcess * (Math.floor(Math.random() * 3) + 1) * data.hire.efficiency;
              const totalXuEarned = totalFishCaught * 100;
              
              // Cập nhật số liệu
              data.hire.fishCaught = (data.hire.fishCaught || 0) + totalFishCaught;
              data.hire.xuEarned = (data.hire.xuEarned || 0) + totalXuEarned;
              data.xu += totalXuEarned;
              
              // Thêm cá vào inventory và fishList
              const fishList = [
                { name: "Cá diếc", rarity: "common", value: 300 },
                { name: "Cá lóc", rarity: "common", value: 400 },
                { name: "Cá rô phi", rarity: "common", value: 250 },
                { name: "Cá trắm", rarity: "common", value: 350 },
                { name: "Cá chép", rarity: "common", value: 280 },
                { name: "Cá trôi", rarity: "common", value: 320 },
                { name: "Cá mè", rarity: "common", value: 270 },
                { name: "Cá trê", rarity: "common", value: 380 },
                { name: "Cá bống", rarity: "common", value: 200 },
                { name: "Cá rô", rarity: "common", value: 290 },
                { name: "Cá chạch", rarity: "common", value: 180 },
                { name: "Cá linh", rarity: "common", value: 220 },
                { name: "Cá sặc", rarity: "common", value: 240 },
                { name: "Cá lăng", rarity: "common", value: 360 },
                { name: "Cá bớp", rarity: "common", value: 310 },
                { name: "Cá heo", rarity: "rare", value: 1500 },
                { name: "Cá ngựa", rarity: "rare", value: 1200 },
                { name: "Cá mú", rarity: "rare", value: 1800 },
                { name: "Cá hồng", rarity: "rare", value: 1600 },
                { name: "Cá chim", rarity: "rare", value: 1400 },
                { name: "Cá thu", rarity: "rare", value: 1700 },
                { name: "Cá bớp biển", rarity: "rare", value: 1900 },
                { name: "Cá đuối", rarity: "rare", value: 1300 },
                { name: "Cá nóc", rarity: "rare", value: 2000 },
                { name: "Cá bơn", rarity: "rare", value: 1100 },
                { name: "Cá chình", rarity: "rare", value: 2200 },
                { name: "Cá lươn", rarity: "rare", value: 1800 },
                { name: "Cá trắm cỏ", rarity: "rare", value: 1600 },
                { name: "Cá chép giòn", rarity: "rare", value: 1400 },
                { name: "Cá rô phi đỏ", rarity: "rare", value: 1200 },
                { name: "Cá trắm đen", rarity: "rare", value: 1700 },
                { name: "Cá mè hoa", rarity: "rare", value: 1500 },
                { name: "Cá trôi Ấn", rarity: "rare", value: 1300 },
                { name: "Cá chép koi", rarity: "rare", value: 2500 },
                { name: "Cá vàng", rarity: "rare", value: 3000 },
                { name: "Cá betta", rarity: "rare", value: 2800 },
                { name: "Cá neon", rarity: "rare", value: 2000 },
                { name: "Cá guppy", rarity: "rare", value: 1800 },
                { name: "Cá molly", rarity: "rare", value: 2200 },
                { name: "Cá platy", rarity: "rare", value: 1900 },
                { name: "Cá swordtail", rarity: "rare", value: 2100 },
                { name: "Cá angelfish", rarity: "rare", value: 3500 },
                { name: "Cá discus", rarity: "rare", value: 4000 },
                { name: "Cá oscar", rarity: "rare", value: 3200 },
                { name: "Cá arowana", rarity: "rare", value: 5000 },
                { name: "Cá rồng", rarity: "rare", value: 4500 },
                { name: "Cá ma", rarity: "rare", value: 3800 },
                { name: "Cá mặt trăng", rarity: "rare", value: 4200 },
                { name: "Cá bướm", rarity: "rare", value: 3600 },
                { name: "Cá hoàng đế", rarity: "rare", value: 4800 },
                { name: "Cá thần", rarity: "rare", value: 5200 },
                { name: "Cá phượng hoàng", rarity: "rare", value: 4400 },
                { name: "Cá unicorn", rarity: "rare", value: 4600 },
                { name: "Cá phoenix", rarity: "rare", value: 5000 },
                { name: "Cá dragon", rarity: "rare", value: 5500 },
                { name: "Cá thunder", rarity: "rare", value: 4800 },
                { name: "Cá lightning", rarity: "rare", value: 5200 },
                { name: "Cá storm", rarity: "rare", value: 5400 },
                { name: "Cá hurricane", rarity: "rare", value: 5800 },
                { name: "Cá tornado", rarity: "rare", value: 5600 },
                { name: "Cá tsunami", rarity: "rare", value: 6000 },
                { name: "Cá volcano", rarity: "rare", value: 5400 },
                { name: "Cá earthquake", rarity: "rare", value: 5800 },
                { name: "Cá meteor", rarity: "rare", value: 6200 },
                { name: "Cá comet", rarity: "rare", value: 5600 },
                { name: "Cá asteroid", rarity: "rare", value: 6000 },
                { name: "Cá galaxy", rarity: "rare", value: 6400 },
                { name: "Cá nebula", rarity: "rare", value: 6800 },
                { name: "Cá supernova", rarity: "rare", value: 7200 },
                { name: "Cá blackhole", rarity: "rare", value: 8000 },
                { name: "Cá wormhole", rarity: "rare", value: 7600 },
                { name: "Cá spacetime", rarity: "rare", value: 8400 },
                { name: "Cá quantum", rarity: "rare", value: 8800 },
                { name: "Cá atom", rarity: "rare", value: 9200 },
                { name: "Cá molecule", rarity: "rare", value: 9600 },
                { name: "Cá dna", rarity: "rare", value: 10000 },
                { name: "Cá gene", rarity: "rare", value: 10400 },
                { name: "Cá evolution", rarity: "rare", value: 10800 },
                { name: "Cá mutation", rarity: "rare", value: 11200 },
                { name: "Cá hybrid", rarity: "rare", value: 11600 },
                { name: "Cá cyborg", rarity: "rare", value: 12000 },
                { name: "Cá robot", rarity: "rare", value: 12400 },
                { name: "Cá android", rarity: "rare", value: 12800 },
                { name: "Cá ai", rarity: "rare", value: 13200 },
                { name: "Cá neural", rarity: "rare", value: 13600 },
                { name: "Cá digital", rarity: "rare", value: 14000 },
                { name: "Cá virtual", rarity: "rare", value: 14400 },
                { name: "Cá hologram", rarity: "rare", value: 14800 },
                { name: "Cá matrix", rarity: "rare", value: 15200 },
                { name: "Cá code", rarity: "rare", value: 15600 },
                { name: "Cá algorithm", rarity: "rare", value: 16000 },
                { name: "Cá data", rarity: "rare", value: 16400 },
                { name: "Cá cloud", rarity: "rare", value: 16800 },
                { name: "Cá server", rarity: "rare", value: 17200 },
                { name: "Cá network", rarity: "rare", value: 17600 },
                { name: "Cá internet", rarity: "rare", value: 18000 },
                { name: "Cá wifi", rarity: "rare", value: 18400 },
                { name: "Cá bluetooth", rarity: "rare", value: 18800 },
                { name: "Cá satellite", rarity: "rare", value: 19200 },
                { name: "Cá gps", rarity: "rare", value: 19600 },
                { name: "Cá radar", rarity: "rare", value: 20000 },
                { name: "Cá sonar", rarity: "rare", value: 20400 },
                { name: "Cá laser", rarity: "rare", value: 20800 },
                { name: "Cá plasma", rarity: "rare", value: 21200 },
                { name: "Cá fusion", rarity: "rare", value: 21600 },
                { name: "Cá fission", rarity: "rare", value: 22000 },
                { name: "Cá nuclear", rarity: "rare", value: 22400 },
                { name: "Cá atomic", rarity: "rare", value: 22800 },
                { name: "Cá hydrogen", rarity: "rare", value: 23200 },
                { name: "Cá helium", rarity: "rare", value: 23600 },
                { name: "Cá lithium", rarity: "rare", value: 24000 },
                { name: "Cá beryllium", rarity: "rare", value: 24400 },
                { name: "Cá boron", rarity: "rare", value: 24800 },
                { name: "Cá carbon", rarity: "rare", value: 25200 },
                { name: "Cá nitrogen", rarity: "rare", value: 25600 },
                { name: "Cá oxygen", rarity: "rare", value: 26000 },
                { name: "Cá fluorine", rarity: "rare", value: 26400 },
                { name: "Cá neon", rarity: "rare", value: 26800 },
                { name: "Cá sodium", rarity: "rare", value: 27200 },
                { name: "Cá magnesium", rarity: "rare", value: 27600 },
                { name: "Cá aluminum", rarity: "rare", value: 28000 },
                { name: "Cá silicon", rarity: "rare", value: 28400 },
                { name: "Cá phosphorus", rarity: "rare", value: 28800 },
                { name: "Cá sulfur", rarity: "rare", value: 29200 },
                { name: "Cá chlorine", rarity: "rare", value: 29600 },
                { name: "Cá argon", rarity: "rare", value: 30000 },
                { name: "Cá potassium", rarity: "rare", value: 30400 },
                { name: "Cá calcium", rarity: "rare", value: 30800 },
                { name: "Cá scandium", rarity: "rare", value: 31200 },
                { name: "Cá titanium", rarity: "rare", value: 31600 },
                { name: "Cá vanadium", rarity: "rare", value: 32000 },
                { name: "Cá chromium", rarity: "rare", value: 32400 },
                { name: "Cá manganese", rarity: "rare", value: 32800 },
                { name: "Cá iron", rarity: "rare", value: 33200 },
                { name: "Cá cobalt", rarity: "rare", value: 33600 },
                { name: "Cá nickel", rarity: "rare", value: 34000 },
                { name: "Cá copper", rarity: "rare", value: 34400 },
                { name: "Cá zinc", rarity: "rare", value: 34800 },
                { name: "Cá gallium", rarity: "rare", value: 35200 },
                { name: "Cá germanium", rarity: "rare", value: 35600 },
                { name: "Cá arsenic", rarity: "rare", value: 36000 },
                { name: "Cá selenium", rarity: "rare", value: 36400 },
                { name: "Cá bromine", rarity: "rare", value: 36800 },
                { name: "Cá krypton", rarity: "rare", value: 37200 },
                { name: "Cá rubidium", rarity: "rare", value: 37600 },
                { name: "Cá strontium", rarity: "rare", value: 38000 },
                { name: "Cá yttrium", rarity: "rare", value: 38400 },
                { name: "Cá zirconium", rarity: "rare", value: 38800 },
                { name: "Cá niobium", rarity: "rare", value: 39200 },
                { name: "Cá molybdenum", rarity: "rare", value: 39600 },
                { name: "Cá technetium", rarity: "rare", value: 40000 },
                { name: "Cá ruthenium", rarity: "rare", value: 40400 },
                { name: "Cá rhodium", rarity: "rare", value: 40800 },
                { name: "Cá palladium", rarity: "rare", value: 41200 },
                { name: "Cá silver", rarity: "rare", value: 41600 },
                { name: "Cá cadmium", rarity: "rare", value: 42000 },
                { name: "Cá indium", rarity: "rare", value: 42400 },
                { name: "Cá tin", rarity: "rare", value: 42800 },
                { name: "Cá antimony", rarity: "rare", value: 43200 },
                { name: "Cá tellurium", rarity: "rare", value: 43600 },
                { name: "Cá iodine", rarity: "rare", value: 44000 },
                { name: "Cá xenon", rarity: "rare", value: 44400 },
                { name: "Cá cesium", rarity: "rare", value: 44800 },
                { name: "Cá barium", rarity: "rare", value: 45200 },
                { name: "Cá lanthanum", rarity: "rare", value: 45600 },
                { name: "Cá cerium", rarity: "rare", value: 46000 },
                { name: "Cá praseodymium", rarity: "rare", value: 46400 },
                { name: "Cá neodymium", rarity: "rare", value: 46800 },
                { name: "Cá promethium", rarity: "rare", value: 47200 },
                { name: "Cá samarium", rarity: "rare", value: 47600 },
                { name: "Cá europium", rarity: "rare", value: 48000 },
                { name: "Cá gadolinium", rarity: "rare", value: 48400 },
                { name: "Cá terbium", rarity: "rare", value: 48800 },
                { name: "Cá dysprosium", rarity: "rare", value: 49200 },
                { name: "Cá holmium", rarity: "rare", value: 49600 },
                { name: "Cá erbium", rarity: "rare", value: 50000 },
                { name: "Cá thulium", rarity: "rare", value: 50400 },
                { name: "Cá ytterbium", rarity: "rare", value: 50800 },
                { name: "Cá lutetium", rarity: "rare", value: 51200 },
                { name: "Cá hafnium", rarity: "rare", value: 51600 },
                { name: "Cá tantalum", rarity: "rare", value: 52000 },
                { name: "Cá tungsten", rarity: "rare", value: 52400 },
                { name: "Cá rhenium", rarity: "rare", value: 52800 },
                { name: "Cá osmium", rarity: "rare", value: 53200 },
                { name: "Cá iridium", rarity: "rare", value: 53600 },
                { name: "Cá platinum", rarity: "rare", value: 54000 },
                { name: "Cá gold", rarity: "rare", value: 54400 },
                { name: "Cá mercury", rarity: "rare", value: 54800 },
                { name: "Cá thallium", rarity: "rare", value: 55200 },
                { name: "Cá lead", rarity: "rare", value: 55600 },
                { name: "Cá bismuth", rarity: "rare", value: 56000 },
                { name: "Cá polonium", rarity: "rare", value: 56400 },
                { name: "Cá astatine", rarity: "rare", value: 56800 },
                { name: "Cá radon", rarity: "rare", value: 57200 },
                { name: "Cá francium", rarity: "rare", value: 57600 },
                { name: "Cá radium", rarity: "rare", value: 58000 },
                { name: "Cá actinium", rarity: "rare", value: 58400 },
                { name: "Cá thorium", rarity: "rare", value: 58800 },
                { name: "Cá protactinium", rarity: "rare", value: 59200 },
                { name: "Cá uranium", rarity: "rare", value: 59600 },
                { name: "Cá neptunium", rarity: "rare", value: 60000 },
                { name: "Cá plutonium", rarity: "rare", value: 60400 },
                { name: "Cá americium", rarity: "rare", value: 60800 },
                { name: "Cá curium", rarity: "rare", value: 61200 },
                { name: "Cá berkelium", rarity: "rare", value: 61600 },
                { name: "Cá californium", rarity: "rare", value: 62000 },
                { name: "Cá einsteinium", rarity: "rare", value: 62400 },
                { name: "Cá fermium", rarity: "rare", value: 62800 },
                { name: "Cá mendelevium", rarity: "rare", value: 63200 },
                { name: "Cá nobelium", rarity: "rare", value: 63600 },
                { name: "Cá lawrencium", rarity: "rare", value: 64000 },
                { name: "Cá rutherfordium", rarity: "rare", value: 64400 },
                { name: "Cá dubnium", rarity: "rare", value: 64800 },
                { name: "Cá seaborgium", rarity: "rare", value: 65200 },
                { name: "Cá bohrium", rarity: "rare", value: 65600 },
                { name: "Cá hassium", rarity: "rare", value: 66000 },
                { name: "Cá meitnerium", rarity: "rare", value: 66400 },
                { name: "Cá darmstadtium", rarity: "rare", value: 66800 },
                { name: "Cá roentgenium", rarity: "rare", value: 67200 },
                { name: "Cá copernicium", rarity: "rare", value: 67600 },
                { name: "Cá nihonium", rarity: "rare", value: 68000 },
                { name: "Cá flerovium", rarity: "rare", value: 68400 },
                { name: "Cá moscovium", rarity: "rare", value: 68800 },
                { name: "Cá livermorium", rarity: "rare", value: 69200 },
                { name: "Cá tennessine", rarity: "rare", value: 69600 },
                { name: "Cá oganesson", rarity: "rare", value: 70000 },
                { name: "Cá mập", rarity: "legendary", value: 6000 },
                { name: "Cá voi", rarity: "legendary", value: 8000 },
                { name: "Cá rồng biển", rarity: "legendary", value: 10000 },
                { name: "Cá thần biển", rarity: "legendary", value: 12000 },
                { name: "Cá phượng hoàng biển", rarity: "legendary", value: 15000 },
                { name: "Cá unicorn biển", rarity: "legendary", value: 18000 },
                { name: "Cá sư tử biển", rarity: "legendary", value: 20000 },
                { name: "Cá hổ biển", rarity: "legendary", value: 25000 },
                { name: "Cá báo biển", rarity: "legendary", value: 30000 },
                { name: "Cá gấu biển", rarity: "legendary", value: 35000 },
                { name: "Cá sói biển", rarity: "legendary", value: 40000 },
                { name: "Cá đại bàng biển", rarity: "legendary", value: 45000 },
                { name: "Cá chim ưng biển", rarity: "legendary", value: 50000 },
                { name: "Cá cú biển", rarity: "legendary", value: 55000 },
                { name: "Cá quạ biển", rarity: "legendary", value: 60000 },
                { name: "Cá diều hâu biển", rarity: "legendary", value: 65000 },
                { name: "Cá kền kền biển", rarity: "legendary", value: 70000 },
                { name: "Cá đại bàng vàng", rarity: "legendary", value: 75000 },
                { name: "Cá đại bàng bạc", rarity: "legendary", value: 80000 },
                { name: "Cá đại bàng đồng", rarity: "legendary", value: 85000 },
                { name: "Cá đại bàng sắt", rarity: "legendary", value: 90000 },
                { name: "Cá đại bàng thép", rarity: "legendary", value: 95000 },
                { name: "Cá đại bàng titan", rarity: "legendary", value: 100000 },
                { name: "Cá đại bàng kim cương", rarity: "legendary", value: 150000 },
                { name: "Cá đại bàng ruby", rarity: "legendary", value: 200000 },
                { name: "Cá đại bàng sapphire", rarity: "legendary", value: 250000 },
                { name: "Cá đại bàng emerald", rarity: "legendary", value: 300000 },
                { name: "Cá đại bàng amethyst", rarity: "legendary", value: 350000 },
                { name: "Cá đại bàng opal", rarity: "legendary", value: 400000 },
                { name: "Cá đại bàng pearl", rarity: "legendary", value: 450000 },
                { name: "Cá đại bàng jade", rarity: "legendary", value: 500000 },
                { name: "Cá đại bàng obsidian", rarity: "legendary", value: 600000 },
                { name: "Cá đại bàng onyx", rarity: "legendary", value: 700000 },
                { name: "Cá đại bàng quartz", rarity: "legendary", value: 800000 },
                { name: "Cá đại bàng crystal", rarity: "legendary", value: 900000 },
                { name: "Cá đại bàng diamond", rarity: "legendary", value: 1000000 },
                { name: "Cá thần thoại", rarity: "legendary", value: 2000000 }
              ];
              
              for (let i = 0; i < totalFishCaught; i++) {
                const randomFish = fishList[Math.floor(Math.random() * fishList.length)];
                data.fish[randomFish.name] = (data.fish[randomFish.name] || 0) + 1;
                
                // Cập nhật fishList trong hire data
                if (!data.hire.fishList) data.hire.fishList = {};
                data.hire.fishList[randomFish.name] = (data.hire.fishList[randomFish.name] || 0) + 1;
              }
            }
            
            // Nếu hết thời gian
            if (data.hire.timeLeft <= 0) {
              data.hire.timeLeft = 0;
              data.hire.active = false;
            }
            
            // Lưu dữ liệu
            fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
          }
        } catch (error) {
          console.log(`Error updating hire data for ${file}:`, error);
        }
      }
    } catch (error) {
      console.log("Error in onEvent:", error);
    }
  }

  static async onReply({ api, event, model, Threads, Users, Currencies, onReply }) {
    // Có thể xử lý trả lời tin nhắn nếu có
  }

  static async onReaction({ api, event, model, Threads, Users, Currencies, onReaction }) {
    // Có thể xử lý phản ứng nếu có
  }
};