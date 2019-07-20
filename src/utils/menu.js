export var adminMenu = [
  {
    name: "银行卡",
    icon: "user",
    children: [
      { name: "银行卡1", path: "/card" },
      { name: "银行卡2", path: "/card2" }
    ]
  },
  {
    name: "订单",
    icon: "shopping-cart",
    children: [
      { name: "商品类别", path: "/itemCategory" },
      { name: "商品", path: "/item" },
      { name: "订单", path: "/order" },
      { name: "订单2", path: "/order2" },
      { name: "文章", path: "/article" }
    ]
  },
  {
    name: "系统",
    icon: "laptop",
    children: [
      { name: "找不到页面", path: "/404" },
      { name: "控制台", path: "/dashboard" },
      { name: "订单详情", path: "/order/detail?orderId=10001&hasBack=true" }
    ]
  },
  {
    name: "长列表",
    icon: "table",
    path: "/virtual"
  },
  {
    name: "笔记",
    icon: "table",
    path: "/note"
  }
];

export var userMenu = [
  {
    name: "银行卡",
    icon: "user",
    children: [
      { name: "银行卡1", path: "/card" },
      { name: "银行卡2", path: "/card2" }
    ]
  },
  {
    name: "系统",
    icon: "laptop",
    children: [
      { name: "控制台", path: "/dashboard" },
      { name: "找不到页面", path: "/404" }
    ]
  }
];
