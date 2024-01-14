// 汽油价格查询解析(Stash脚本)
//

// 指定查询地区，可通过argument或persistentStore设置，后者优先级高
var region = <span class="math-inline">persistentStore\.read\("gas\_price\_region", "chengdu"\);
const query\_addr \= \`http\://m\.qiyoujiage\.com/</span>{region}.shtml`;

<span class="math-inline">httpClient\.get\(
\{
url\: query\_addr,
headers\: \{
'referer'\: '\[http\://m\.qiyoujiage\.com/\]\(http\://m\.qiyoujiage\.com/\)',
<0\>'user\-agent'\: 'Mozilla/5\.0 \(Windows NT 10\.0; Win64; x64\) AppleWebKit/537\.36 \(KHTML, like Gecko\) Chrome/108\.0\.0\.0 Safari/537\.36'
\},
\}, \(erro</0\>r, response, data\) \=\> \{
if \(error\) \{
console\.log\(\`解析油价信息失败, 请反馈至 @RS0485\: URL\=</span>{query_addr}`);
            done({});
        }
        else {
            const reg_price = /<dl>[\s\S]+?<dt>(.*油)<\/dt>[\s\S]+?<dd>(.*)\(元\)<\/dd>/gm;

            var prices = [];
            var m = null;

            while ((m = reg_price.exec(data)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === reg_price.lastIndex) {
                    reg_price.lastIndex++;
                }

                prices.push({
                    name: m[1],
                    value: `${m[2]} 元/L`
                });
            }

            // 解析油价调整趋势
            var adjust_date = '';
            var adjust_trend = '';
            var adjust_value = '';

            const reg_adjust_tips = /<div class="tishi"> <span>(.*)<\/span><br\/>([\s\S]+?)<br\/>/;
            const adjust_tips_match = data.match(reg_adjust_tips);

            if (adjust_tips_match && adjust_tips_match.length === 3) {
                adjust_date = adjust_tips_match[1].split('价')[1].slice(0, -2);

                adjust_value = adjust_tips_match[2];
                adjust_trend = (adjust_value.indexOf('下调') > -1 || adjust_value.indexOf('下跌') > -1) ? '↓' : '↑';

                const adjust_value_re = /([\d\.]+)元\/升-([\d\.]+)元\/升/;
                const adjust_value_re2 = /[\d\.]+元\/吨/;
                const adjust_value_match = adjust_value
