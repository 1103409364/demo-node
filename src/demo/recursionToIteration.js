// 递归计算选中数量，有子节点算百分比。用于展示半选全选
const d = {
  checkedPercent: 0,
  checked: false,
  halfChecked: false,
  children: [
    {
      id: "1",
      msgName: "",
      children: [
        {
          id: "2",
          name: "",
          level: "1",
          children: [
            {
              id: "3",
              name: "",
              level: "2",
              checked: true,
              children: [],
            },
            {
              id: "4",
              name: "",
              level: "2",
              children: [
                {
                  id: "7",
                  name: "",
                  level: "2",
                  checked: true,
                  children: [],
                },
              ],
            },
            {
              id: "5",
              name: "",
              level: "2",
              checked: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "6",
      msgName: "",
      children: [],
    },
  ],
};
// 递归计算
function computeChecked1(d) {
  let sum = 0;
  d.children.forEach((item) => {
    if (!item.children || item.children.length === 0) {
      if (item.checked) {
        item.checkedPercent = 1;
        sum++;
      } else {
        item.checkedPercent = 0;
      }
    } else {
      computeChecked1(item);
      sum += item.checkedPercent;
    }
  });
  d.checkedPercent = sum / d.children.length;
}

// 递归转非递归 使用队列
function computeChecked2(d) {
  let stack = [d];
  let temp = [d];
  // 入队
  while (temp.length) {
    temp.pop().children.forEach((item) => {
      stack.push(item);
      temp.push(item);
    });
  }
  // 出队
  while (stack.length) {
    const current = stack.pop();
    if (!current.children || current.children.length === 0) {
      current.checkedPercent = +current.checked;
      continue;
    }
    let sum = 0;
    current.children.forEach((item) => (sum += item.checkedPercent));
    current.checkedPercent = sum / current.children.length;
  }
  // console.log(Date.now() - start);
}
console.time();
computeChecked1(d);
console.timeEnd();

console.time();
computeChecked2(d);
console.timeEnd();
// console.log(JSON.stringify(d));
