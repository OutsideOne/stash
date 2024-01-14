// 导入所需的库
import axios from "axios";

// 定义请求 URL
const url = "http://m.qiyoujiage.com/sichuan/chengdu.shtml";

// 发送请求
axios.get(url).then((response) => {
  // 检查响应是否成功
  if (response.status === 200) {
    // 解析响应数据
    const data = response.data;

    // 获取油价信息
    const oilPrices = data.data.list;

    // 过滤油价信息
    const filteredOilPrices = oilPrices.filter((oilPrice) => {
      return oilPrice.oil === "92#汽油";
    });

    // 遍历油价信息
    filteredOilPrices.forEach((oilPrice) => {
      // 打印油价信息
      console.log(`
          油品：${oilPrice.oil}
          价格：${oilPrice.price}
          单位：${oilPrice.unit}
        `);
    });
  } else {
    // 响应失败
    console.log("请求失败");
  }
});
