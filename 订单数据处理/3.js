var data = {
  "costInfo-loanNo-LA20180605000001": "LA20180605000001",
  "repayRecordList-loanNo-LA20180605000003": "LA20180605000003",
  "costInfo-loanNo-LA20180605000002": "LA20180605000002",
  "repayRecordList-amount-LA20180605000002": "2000.00",
  "costInfo-sum-LA20180605000001": "12580.00",
  "costInfo-sum-LA20180605000002": "12306.00",
  "repayRecordList-loanNo-LA20180605000001": "LA20180605000001",
  "repayRecordList-loanNo-LA20180605000002": "LA20180605000002",
  "repayRecordList-amount-LA20180605000001": "1000.00",
  "repayRecordList-amount-LA20180605000003": "3000.00"
}

let res = {};
let lastRes = {};
for(let key in data) {
    const ks = key.split('-');
    const t = ks[0];
    const subt = ks[1];
    const subsubt = ks[2];
    if (!res[t]) {
        res[t] = {};
    }
    if (!res[t][subsubt]) {
        res[t][subsubt] = [];
    }
    res[t][subsubt].push({[subt]: data[key]});
}
for(let k in res) {
    if (!lastRes[k]) {
        lastRes[k] = [];
    }
    for(let m in res[k]) {
        let l = {};
        res[k][m].forEach(e => {
            l = {...l, ...e}
        });
        lastRes[k].push(l);
    }
}
console.log(lastRes)