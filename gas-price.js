var region = $argument || $persistentStore.read("gas_price_region") || 'sichuan';
const queryAddr = `http://m.qiyoujiage.com/${region}.shtml`;

$httpClient.get({
    url: queryAddr,
    headers: {
        'referer': 'http://m.qiyoujiage.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    }
}, (error, response, data) => {
    if (error) {
        // 如果发生错误，直接结束脚本
        return;
    }

    const gas92Price = parseGasPrice(data, '92#');

    if (!gas92Price) {
        // 如果无法解析92号汽油价格，直接结束脚本
        return;
    }

    const adjustment = parseAdjustment(data);

    const friendlyTips = `${adjustment.date} ${adjustment.trend} ${adjustment.value}`;
    const content = `${gas92Price.name}  ${gas92Price.value}\n${friendlyTips}`;

    const body = {
        title: "实时油价信息",
        content: content,
        icon: "fuelpump.fill"
    };

    $done(body);
});

function parseGasPrice(data, gasType) {
    const regPrice = new RegExp(`<dl>[\\s\\S]+?<dt>${gasType}油<\\/dt>[\\s\\S]+?<dd>(.*)\$begin:math:text$元\\$end:math:text$<\\/dd>`, 'gm');
    const match = regPrice.exec(data);

    if (match && match.length === 2) {
        return {
            name: `${gasType}油`,
            value: `${match[1]} 元/L`
        };
    }

    return null;
}

function parseAdjustment(data) {
    const regAdjustTips = /<div class="tishi"> <span>(.*)<\/span><br\/>([\s\S]+?)<br\/>/;
    const match = data.match(regAdjustTips);

    if (match && match.length === 3) {
        const date = match[1].split('价')[1].slice(0, -2);
        const value = parseAdjustmentValue(match[2]);
        const trend = (value.indexOf('下调') > -1 || value.indexOf('下跌') > -1) ? '↓' : '↑';

        return {
            date,
            trend,
            value
        };
    }

    return {};
}

function parseAdjustmentValue(value) {
    const re = /([\d\.]+)元\/升-([\d\.]+)元\/升/;
    const match = value.match(re);

    if (match && match.length === 3) {
        return `${match[1]}-${match[2]}元/L`;
    } else {
        const re2 = /[\d\.]+元\/吨/;
        const match2 = value.match(re2);
        return match2 ? match2[0] : value;
    }
}
