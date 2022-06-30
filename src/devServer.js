// 通过快捷键，在 vscode 中打开页面 html。参考 https://github.com/zhouwei1994/code-link-plugin
// 前端 get 请求当前服务发送文件路径
const http = require("http");
const urlParser = require("url");
const path = require("path");
const child_process = require("child_process");

const port = 3000;
const hostname = "localhost";

const server = http.createServer((req, res) => {
  const { url } = req;
  setHeader(res);
  const urlObj = urlParser.parse(url, true);
  const pathname = urlObj.query.pathname;
  const srcRoot = urlObj.query.srcRoot || "src";
  if (!pathname) {
    res.end("pathname 参数没有传递");
    return;
  }
  child_process.exec(`code -r -g  ${path.join(srcRoot + pathname)}`);
  res.statusCode = 200;
  res.end("success");
});

function setHeader(res) {
  res.setHeader("Content-Type", "text/plain;charset=utf8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "customer-header, customer-header2");
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT");
}

server.listen(port, () => {
  console.log(`devServer running on http://${hostname}:${port}`);
});

// client ctrl + 鼠标中键打开 html
// function devHelper() {
//   var pathname = window.location.pathname;

//   if (window.location.host.indexOf('localhost') === -1) return;

//   function handleKeyDown(event) {
//     event.ctrlKey && document.addEventListener("mousedown", openFile);
//   }

//   function removeEvent() {
//     document.removeEventListener("mousedown", openFile);
//   }

//   function openFile(e) {
//     if (+e.button !== 1) {
//       return removeEvent()
//     }

//     e.preventDefault()

//     fetch("http://localhost:3000/?pathname=" + encodeURIComponent(pathname))
//       .then(function (response) {
//         return response.text();
//       })
//       .then(function (response) {
//         console.log(response);
//       })
//       .catch(function (err) {
//         console.warn(
//           "path:" + pathname + "打开失败" + err.message + "；devServer 未启动"
//         );
//       });
//   }

//   document.addEventListener("keydown", handleKeyDown);
//   document.addEventListener("keyup", removeEvent);
// }
