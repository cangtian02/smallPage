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

function mapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

array_s = Array.from(Object.keys(data), x => [...(x.split("-")), data[x]])
array_s = array_s.map(([a, b, c, d]) => {
    if (b != "loanNo") {
        return new Map([["x", a], ["loanNo", c], [b, d]])
    }
})
array_s = array_s.filter(item => item != undefined)

result = 
    array_s.reduce(
    (sum, item) => {
        let groupByVal = item.get("x");
        groupedItems = sum.get(groupByVal) || [];
        item.delete("x")
        groupedItems.push(JSON.parse(JSON.stringify(mapToObj(item))));
        return sum.set(groupByVal, groupedItems);
    },
    new Map()
)
result = JSON.parse(JSON.stringify(mapToObj(result)))
console.log(result)