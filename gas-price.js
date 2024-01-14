const region = "成都";

const query_addr = `http://m.qiyoujiage.com/${region}.shtml`;

const xhr = new XMLHttpRequest();
xhr.open("GET", query_addr);
xhr.responseType = "text";
xhr.onload = function() {
  if (xhr.status === 200) {
    const data = xhr.responseText;

    const reg_price = /<dl>[\s\S]+?<dt>(.*油)<\/dt>[\s\S]+?<dd>(.*)\(元\/升\)<\/dd>/gm;

    const prices = [];
    let m;

    while ((m = reg_price.exec(data)) !== null) {
      prices.push({
        name: m[1],
        value: `${m[2]} 元/升`
      });
    }

    // 解析油价调整趋势
    const adjust_date = "";
    const adjust_trend = "";
    const adjust_value = "";

    const reg_adjust_tips = /<div class="tishi"> <span>(.*)<\/span><br\/>([\s\S]+?)<\/dd>/;
    const adjust_tips_match = data.match(reg_adjust_tips);

    if (adjust_tips_match && adjust_tips_match.length === 3) {
      adjust_date = adjust_tips_match[1].split("价")[1].slice(0, -2);

      adjust_value = adjust_tips_match[2];
      adjust_trend = (adjust_value.indexOf("下调") > -1 || adjust_value.indexOf("下跌") > -1) ? "↓" : "↑";

      // 提取调整幅度
      const adjust_value_re = /([\d\.]+)元\/升-([\d\.]+)元\/升/;
      const adjust_value_re2 = /[\d\.]+元\/升/; // 仅匹配单一升价
      const adjust_value_match = adjust_value.match(adjust_value_re);

      if (adjust_value_match && adjust_value_match.length === 3) {
        adjust_value = `${adjust_value_match[1]}-${adjust_value_match[2]} 元/升`;
      } else {
        adjust_value_match2 = adjust_value.match(adjust_value_re2);
        if (adjust_value_match2) {
          adjust_value = adjust_value_match2[0];
        }
      }
    }

    done({
      prices,
      adjust_date,
      adjust_trend,
      adjust_value,
    });
  } else {
    done({});
  }
};
xhr.send();
