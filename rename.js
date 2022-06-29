const fs = require("fs");
const path = require("path");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
/**
 * 重命名
 * @param {*} url 文件路径 D:\Downloads\test\
 * @param {*} prefix 文件名前缀
 */
function renameFiles(url, prefix) {
  fs.readdir(url, "utf8", (err, fileList) => {
    if (err) throw err;
    // console.log(fileList, prefix);
    fileList.forEach((item, index) => {
      const oldName = item;
      const type = item.match(/(\.\w+)/)[1]; // 获取文件后缀名 包括 .
      // 新名称,根据需求修改名称，可以使用正则等；后缀可用之前的type 也可统一自定义
      const newName = prefix + index + type;
      console.log(url + oldName, url + newName);
      fs.rename(url + oldName, url + newName, (err) => {
        if (err) throw err;
      });
    });
  });
}

function readlinePromise(question) {
  return new Promise((resolve, reject) => {
    readline.question(`${question}\n`, (input) => {
      if (input) {
        resolve(input);
      } else {
        reject("请输入");
      }
    });
  });
}

async function main() {
  const p = await readlinePromise(`请输入文件目录：`).catch((e) => {
    console.error(e);
  });
  const n = await readlinePromise(`请输入文件名前缀：`).catch((e) => {
    console.error(e);
  });
  readline.close();
  try {
    renameFiles(path.join(p + "/"), n || ""); // 补最后一级补 /。两个 // 不会报错。没有 / 路径少一级
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
