# 🎣 HỆ THỐNG CÂU CÁ - HƯỚNG DẪN ĐẦY ĐỦ

## 📋 **DANH SÁCH LỆNH CHÍNH**

### 🎯 **Lệnh cơ bản:**
- **`.fish`** - Hiển thị menu chính
- **`.fish cauca`** - Câu cá (lệnh chính)

### 📊 **Lệnh thông tin:**
- **`.fish info`** - Xem thông tin người chơi
- **`.fish inv`** - Xem túi đồ (cá + vật phẩm)
- **`.fish dex`** - Xem bộ sưu tập cá
- **`.fish top`** - Bảng xếp hạng ngư dân

### 🛒 **Lệnh mua bán:**
- **`.fish shop`** - Xem cửa hàng
- **`.fish shop buy [tên] [số lượng]`** - Mua vật phẩm
- **`.fish sell`** - Bán tất cả cá

### 🎣 **Lệnh trang bị:**
- **`.fish craft [tên cần]`** - Chế tạo cần đặc biệt
- **`.fish upgrade rod`** - Nâng cấp cần câu
- **`.fish bait`** - Xem thông tin mồi
- **`.fish bait use [tên mồi]`** - Sử dụng mồi
- **`.fish line`** - Xem thông tin dây
- **`.fish line use [tên dây]`** - Sử dụng dây

### 🗺️ **Lệnh khu vực:**
- **`.fish khu`** - Xem danh sách khu vực
- **`.fish khu go [tên khu]`** - Chuyển đến khu vực

### 🎮 **Lệnh tính năng (đang phát triển):**
- **`.fish duel`** - PvP đấu cá
- **`.fish boss`** - Boss cá
- **`.fish market`** - Chợ cá
- **`.fish quest`** - Nhiệm vụ hàng ngày
- **`.fish hire`** - Thuê ngư dân câu hộ

---

## 🛒 **CỬA HÀNG VẬT PHẨM**

### 🎣 **Cần câu:**
- **Cần Gỗ** (+0) - 0 xu (có sẵn)
- **Cần Bạc** (+0) - 5,000 xu
- **Cần Vàng** (+0) - 15,000 xu

### 🧵 **Dây câu:**
- **Dây thường** - 200 xu (20 lần dùng)
- **Dây bền** - 500 xu (40 lần dùng)

### 💎 **Vật phẩm:**
- **Đá nâng cấp** - 1,000 xu
- **Mồi thơm** - 800 xu
- **Mồi hiếm** - 2,000 xu

---

## ⚒️ **CHẾ TẠO CẦN ĐẶC BIỆT**

### 🐉 **Cần Rồng** (+1):
- Yêu cầu: Cần Bạc + 3x Đá nâng cấp
- Lệnh: `.fish craft cần rồng`

### 🌑 **Cần Bóng Tối** (+2):
- Yêu cầu: Cần Vàng + 5x Đá nâng cấp
- Lệnh: `.fish craft cần bóng tối`

---

## 📈 **HỆ THỐNG NÂNG CẤP**

### 🎣 **Nâng cấp cần câu:**
- Dùng Đá nâng cấp để tăng +1 tier
- Tối đa: +5 tier
- Mỗi tier tăng 10% giá trị cá
- Lệnh: `.fish upgrade rod`

### 🪱 **Ảnh hưởng của mồi:**
- **Mồi thường**: Cơ bản
- **Mồi thơm**: +10% tỉ lệ cá rare
- **Mồi hiếm**: +25% tỉ lệ cá rare & legendary

---

## 🗺️ **KHU VỰC CÂU CÁ**

### 📍 **Danh sách khu vực:**
1. **Sông Lặng** - Level 1 (mở sẵn)
2. **Hồ Lớn** - Level 3
3. **Rừng Thiêng** - Level 5
4. **Núi Lửa** - Level 8 🔥 Boss cá!
5. **Hang Băng** - Level 12

### 🎯 **Ảnh hưởng khu vực:**
- Mỗi khu vực có bonus tỉ lệ cá hiếm khác nhau
- Khu vực cao hơn = tỉ lệ cá hiếm cao hơn

---

## 🐟 **HỆ THỐNG CÁ**

### ⚪ **Cá thường (Common):**
- Cá diếc (300 xu)
- Cá lóc (400 xu)
- Cá mồi (250 xu)

### 🔵 **Cá hiếm (Rare):**
- Cá heo (1,500 xu)
- Cá mặt trăng (2,500 xu)

### 🟡 **Cá huyền thoại (Legendary):**
- Cá mập (6,000 xu)
- Cá rồng (10,000 xu)
- Cá ma (12,000 xu)
- Cá thần thoại (20,000 xu)

---

## 🎮 **TÍNH NĂNG ĐẶC BIỆT**

### 💎 **Random Drops:**
- 5% chance: +1 Đá nâng cấp
- 10% chance: +1 Mồi thơm

### 📊 **Level System:**
- Mỗi 10,000 xu = 1 level
- Level cao hơn = mở khóa khu vực mới

### 🏆 **Bảng xếp hạng:**
- Xếp hạng theo tổng xu
- Top 10 người chơi

---

## 💡 **LỆNH MẪU**

```
.fish                    # Xem menu chính
.fish cauca             # Câu cá
.fish shop buy "dây bền" 1    # Mua 1 dây bền
.fish craft "cần rồng"        # Chế tạo cần rồng
.fish upgrade rod             # Nâng cấp cần
.fish bait use "mồi thơm"     # Sử dụng mồi thơm
.fish khu go "Núi Lửa"        # Chuyển đến Núi Lửa
.fish inv                     # Xem túi đồ
.fish sell                    # Bán tất cả cá
```

---

## ⚠️ **LƯU Ý QUAN TRỌNG**

1. **Dây câu sẽ đứt** sau khi hết durability
2. **Mồi đặc biệt** sẽ bị tiêu hao khi sử dụng
3. **Khu vực cao** yêu cầu level tương ứng
4. **Cần câu tốt** tăng tỉ lệ cá hiếm và giá trị
5. **Boss cá** xuất hiện ngẫu nhiên ở Núi Lửa

---

## 🎯 **CHIẾN LƯỢC CHƠI**

1. **Bắt đầu**: Câu cá cơ bản để kiếm xu
2. **Nâng cấp**: Mua cần và dây tốt hơn
3. **Chế tạo**: Tạo cần đặc biệt từ nguyên liệu
4. **Mở rộng**: Chuyển đến khu vực cao hơn
5. **Tối ưu**: Sử dụng mồi và trang bị phù hợp

**Chúc bạn câu được nhiều cá quý! 🎣✨**