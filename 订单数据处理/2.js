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

data = Array.from(Object.keys(data), x => {return {[x]: data[x]}});
let dataCompare = () => (a, b) => Object.keys(a)[0].split('-')[1] !== Object.keys(b)[0].split('-')[1];
data.sort(dataCompare()).reverse();

let end = {}, tem = [];
data.forEach(val => {
  let key = Object.keys(val)[0], value = val[Object.keys(val)[0]], keyArr = key.split('-');

  if (!end[keyArr[0]]) end[keyArr[0]] = [];
  
  let endArr = end[keyArr[0]], codeArr = [];
  for (let i = 0, len = endArr.length; i < len; i++) {
    codeArr.push(endArr[i][Object.keys(endArr[i])[0]]);
  }

  if (endArr.length > 0 && keyArr[1] === Object.keys(endArr[0])[0]) {
    let obj = {};
    obj[keyArr[1]] = value;
    end[keyArr[0]].push(obj);
  } else {
    let sub = endArr.length === 0 ? 0 : codeArr.indexOf(keyArr[2]);
    if (endArr.length === 0) end[keyArr[0]].push({});
    end[keyArr[0]][sub][keyArr[1]] = value;
  }
});
console.log(end);