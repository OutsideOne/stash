// 汽油价格查询解析(Stash脚本)
//
// @author RS0485
// @repo [https://github.com/RS0485/network-rules](https://github.com/RS0485/network-rules)
// @version 1.0.5
//
// Change Logs:
//   - v1.0.3 支持油价调整趋势提示
//   - v1.0.4 修复油价趋势解析
//   - v1.0.5 默认查询成都油价，并将查询地区保存到PersistentStore
//

// 指定查询地区，可通过argument或persistentStore设置，后者优先级高
var region = 'chengdu';

const region_pref = <span class="math-inline">persistentStore\.read\("gas\_price\_region"\);
if \(typeof region\_pref \!\=\= 'undefined' && region\_pref \!\=\= ''\) \{
region \= region\_pref;
\}
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
                    value: `<span class="math-inline">\{m\[2\]\} 元/L\`
\}\);
\}
// 解析油价调整趋势
var adjust\_date \= '';
var adjust\_trend \= '';
var adjust\_value \= '';
const reg\_adjust\_tips \= /<div class\="tishi"\> <span\>\(\.\*\)<\\/span\><br\\/\>\(\[\\s\\S\]\+?\)<br\\/\>/;
const adjust\_tips\_match \= data\.match\(reg\_adjust\_tips\);
if \(adjust\_tips\_match && adjust\_tips\_match\.length \=\=\= 3\) \{
adjust\_date \= adjust\_tips\_match\[1\]\.split\('价'\)\[1\]\.slice\(0, \-2\);
adjust\_value \= adjust\_tips\_match\[2\];
adjust\_trend \= \(adjust\_value\.indexOf\('下调'\) \> \-1 \|\| adjust\_value\.indexOf\('下跌'\) \> \-1\) ? '↓' \: '↑';
const adjust\_value\_re \= /\(\[\\d\\\.\]\+\)元\\/升\-\(\[\\d\\\.\]\+\)元\\/升/;
const adjust\_value\_re2 \= /\[\\d\\\.\]\+元\\/吨/;
const adjust\_value\_match \= adjust\_value\.match\(adjust\_value\_re\);
if \(adjust\_value\_match && adjust\_value\_match\.length \=\=\= 3\) \{
adjust\_value \= \`</span>{adjust_value_match[1]}-${adjust_value_match[2]}元/L`;
                }
                else {
                    const adjust_value_match2 = adjust_value.match(adjust_value_re2);

   
