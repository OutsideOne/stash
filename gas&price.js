const region = 'sichuan/chengdu';
const queryAddr = `http://m.qiyoujiage.com/${region}.shtml`;

$httpClient.get({
    url: queryAddr,
    headers: {
        'referer': 'http://m.qiyoujiage.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    }
}, (error, response, data) => {
    if (error) return;

    const gas92Price = parseGasPrice(data);

    if (!gas92Price) return;

    const adjustment = parseAdjustment(data);

    const friendlyTips = `${adjustment.date} ${adjustment.trend} ${adjustment.value}`;
    const content = `${gas92Price.name}  ${gas92Price.value}\n${friendlyTips}`;

    const body = {
        title: "成都实时油价信息",
        content: content,
        icon: "fuelpump.fill"
    };

    $done(body);
});

function parseGasPrice(data) {
    const regPrice = /<dt>92#油<\/dt>[\s\S]+?<dd>(.*?)元\/升<\/dd>/;
    const match = data.match(regPrice);

    return match ? { name: '92#油', value: `${match[1]} 元/L` } : null;
}

function parseAdjustment(data) {
    const regAdjustTips = /<div class="tishi"> <span>(.*)<\/span><br\/>([\s\S]+?)<br\/>/;
    const match = data.match(regAdjustTips);

    if (!match || match.length !== 3) return {};

    const date = match[1].split('价')[1].slice(0, -2);
    const value = parseAdjustmentValue(match[2]);
    const trend = (value.includes('下调') || value.includes('下跌')) ? '↓' : '↑';

    return { date, trend, value };
}

function parseAdjustmentValue(value) {
    const re = /([\d.]+)元\/升-([\d.]+)元\/升/;
    const match = value.match(re);

    return match ? `${match[1]}-${match[2]}元/L` : (value.match(/[\d.]+元\/吨/) || [value])[0];
}
