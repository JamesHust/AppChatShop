const products = [
  {
    id: "02b5ea66-c20c-4eb6-a013-d1f54960ab4f",
    code: "SP00001",
    name: "Dưa hấu không hạt 2.5kg",
    cate: "Trái cây",
    unit: "Quả/Trái",
    price: "74750",
    rating: "4.5",
    rated: 4,
    sold: "25",
    favourite: true,
    img:
      "https://lh3.googleusercontent.com/Ax6chAFVIzfsTSXd3sCAtl9tpgXyIsBGFV39ULdwKqC46AxYhAVcUdgJyeWRKxhgkLlJU-ReRDQcOvPKiZk",
    description:
      "Bim bim Oishi đảm bảo các tiêu chuẩn về vệ sinh an toàn thực phẩm. Hàng sản xuất tại Việt Nam. Hạn sử dụng là 6 tháng kể từ ngày sản xuất in trên bao bì",
  },
  {
    id: "e1d679a1-0e0e-4482-9a00-791a4eb879ca",
    code: "SP00002",
    name: "Dứa (thơm/khóm) 1 quả",
    cate: "Trái cây",
    unit: "Quả/Trái",
    price: "13800",
    rating: "4.8",
    rated: 3,
    sold: "99",
    favourite: false,
    img:
      "https://lh3.googleusercontent.com/RKvFQdJQwsKNeLy2hYYHC1Jvr7lEqHfXr2k62GhEUbBYkivB5q0Nf3y5Xc9cbUkvBZ02vEVUfueBq4XziZaj",
    description:
      "Khối lượng 36g. Năng lượng 550 kcal/100g. Thành phần Khoai tây tươi, dầu thực vật, bột gia vị 3,4% (chất điều vị mononatri glutamat E621, muối, maltodextrine, bột whey, bột tỏi), dầu chiết xuất từ cây hương thảo. Nơi sản xuất Việt Nam. Hạn sử dụng: 6 tháng kể từ ngày sản xuất (xem thông tin chi tiết trên bao bì.",
  },
  {
    id: "26196232-bbc3-45a7-9043-6bccbd8c7c56",
    code: "SP00003",
    name: "Dưa hấu ruột vàng 2.5kg",
    cate: "Trái cây",
    unit: "Quả/Trái",
    price: "74750",
    rating: "5.0",
    rated: 5,
    sold: "122",
    favourite: true,
    img:
      "https://lh3.googleusercontent.com/Qs6aLiPHuEJKDGxdZNN7pbF68rbJV2Zr9Dsit7HrjaBcGi9yPHPUkr1betT53jEPvr7ybxuD3XjFSPwrLv3i",
    description:
      "Bim bim cánh gà vị gà cà ri bơ thơm ngon giòn. Nơi sản xuất Việt Nam. Hạn sử dụng: 6 tháng kể từ ngày sản xuất (xem thông tin chi tiết trên bao bì.",
  },
  {
    id: "eec787f3-93e7-46ed-802f-62d3c5a1fb17",
    code: "SP00004",
    name: "Táo Gala size 100 - 125 (XX Mỹ) 1kg",
    cate: "Trái cây",
    unit: "Quả/Trái",
    price: "75900",
    rating: "4.2",
    rated: 4,
    sold: "77",
    favourite: false,
    img:
      "https://lh3.googleusercontent.com/Z5gnQ1XpC0VWZyxQKzKZn2lf9l68cEmOxh937wF83CiYw6mdjaJ6h_R15y1Hcx0sFitcmMLzn2QHwNybnA",
    description:
      "Thành phần: Khoai tây, dầu thực vật, bột gia vị 5,2% (đường, maltodextrin, muối, chất điều vị (E621, E631, E627), hương tự nhiên và giống tự nhiên, gia vị (tỏi, ớt, gừng), chất điều chỉnh độ chua (E330), chất chống đông vón (E551), màu tổng hợp (E110), màu tự nhiên (E160c), chất tạo ngọt tổng hợp (E951)). Nơi sản xuất Việt Nam. Hạn sử dụng: 6 tháng kể từ ngày sản xuất (xem thông tin chi tiết trên bao bì.",
  },
  {
    id: "7fd21125-9bc7-4503-91de-01dcdb3054bd",
    code: "SP00005",
    name: "Bưởi hồng da xanh túi lưới 1.4kg",
    cate: "Trái cây",
    unit: "Quả/Trái",
    price: "53060",
    rating: "4.2",
    rated: 5,
    sold: "43",
    favourite: false,
    img:
      "https://lh3.googleusercontent.com/pY5jZXmY_jNZQNR0ss6ZKLkX56pDdejTuZhOQ-MXzPYVkAMmv-Rxqz9TmeahHkee1CR2kfVMiHTqGO_ubZlU",
    description:
      "Thành phần: Khoai tây tươi, dầu thực vật, bột gia vị, dầu chiết xuất từ cây hương thảo. Nơi sản xuất Việt Nam. Hạn sử dụng: 6 tháng kể từ ngày sản xuất (xem thông tin chi tiết trên bao bì.",
  },
  {
    id: "a8464128-2549-421c-81f3-bde763a2c729",
    code: "SP00006",
    name: "Xoài cát chu 1kg",
    cate: "Trái cây",
    unit: "Quả/Trái",
    price: "47500",
    rating: "4.7",
    rated: 5,
    sold: "12",
    favourite: false,
    img:
      "https://lh3.googleusercontent.com/eaiKWirnc6NUYDfWK4crOU0Q5eXQc8UoUPSneDjIs2qGIv3QV2ChuYcdJdeTWB2LCehWQkJiuWlJg8HCWQ",
    description:
      "Bánh snack Toonies vị phô mai, vị gà BBQ, vị cay được đóng gói trên dây chuyền công nghệ hiện đại từ các nguyên liệu an toàn, đảm bảo cho sức khỏe người sử dụng. Sản phẩm có chứa nhiều canxi giúp cho xương chắc khỏe, thành phần sắt giúp ngăn ngừa nguy cơ bị thiếu máu. Bánh snack giòn tan  mang lại cho bạn những trải nghiệm thú vị khi thưởng thức. Nơi sản xuất Việt Nam. Hạn sử dụng: 6 tháng kể từ ngày sản xuất (xem thông tin chi tiết trên bao bì.",
  },
];
export default products;
