/*
 * 汽油价格查询解析(Stash脚本)
 */

// 指定查询地区，可通过argument或persistentStore设置，后者优先级高
var region = 'hainan';
if (typeof $argument !== 'undefined' && $argument !== '') {
    region = $argument;
}

const region_pref = $persistentStore.read("gas_price_region");
if (typeof region_pref !== 'undefined' && region_pref !== '') {
    region = region_pref;
}

const query_addr = `http://m.qiyoujiage.com/${region}.shtml`;

$httpClient.get(
    {
        url: query_addr,
        headers: {
            'referer': 'http://m.qiyoujiage.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
    }, (error, response, data) => {
        if (error) {
            // 删除解析油价失败反馈
            done();
        }
        else {
            const reg_price = /<dl>[\s\S]+?<dt>(.*油)<\/dt>[\s\S]+?<dd>(.*)\(元\)<\/dd>/gm;

            var prices = [];
            var m = null;

            while ((m = reg_price.exec(data)) !== null) {
                // 只显示92号汽油
                if (m[1] === '92') {
                    prices.push({
                        name: m[1],
                        value: `${m[2]} 元/L`
                    });
                }
            }

            if (prices.length !== 1) {
                console.log(`解析油价信息失败, 数量=${prices.length}, 请反馈至 @RS0485: URL=${query_addr}`);
                done();
            }
            else {
                body = {
                    title: "实时油价信息",
                    content: `${prices[0].name}  ${prices[0].value}`,
                    icon: "fuelpump.fill"
                };

                $done(body);
            }
        }
    });
