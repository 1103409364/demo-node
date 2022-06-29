// 通过shift+左键点击页面，在 vscode 中打开页面 html。参考 https://github.com/zhouwei1994/code-link-plugin
// 前端 get 请求当前服务发送文件路径
const http = require("http");
const urlParser = require("url");
const path = require("path");
const child_process = require("child_process");

const port = 3000;
const hostname = "localhost";

let srcRoot = "src";

const server = http.createServer(function (req, res) {
  const { method, url } = req;

  if (method === "OPTIONS") {
    setCorsHeader(res);
  } else {
    const urlObj = urlParser.parse(url, true);
    const pathname = urlObj.query.pathname;
    srcRoot = srcRoot || urlObj.query.srcRoot;
    if (!pathname) {
      res.end("pathname 参数没有传递");
      return;
    }
    // console.log(path.join(srcRoot + pathname));
    child_process.exec("code -r -g " + path.join(srcRoot + pathname));
    setHeader(res);
    res.statusCode = 200;

    res.end("success\n");
  }
});

function setHeader(res) {
  res.setHeader("Content-Type", "text/plain;charset=utf8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "customer-header, customer-header2"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT");
}

server.listen(port, function () {
  console.log("服务器运行在 http://" + hostname + ":" + port + "/");
});

// client
function devHelper() {
  if (window.location.host.indexOf("localhost") === -1) return;
  // 按下 CTRL + SHIFT 时点击页面，请求在 vscode 中打开 html
  function handleKeyDown(event) {
    event.ctrlKey &&
      event.shiftKey &&
      document.addEventListener("click", handleClick);
  }

  function handleClick() {
    var pathname = window.location.pathname;
    fetch("http://localhost:3000/?pathname=" + encodeURIComponent(pathname))
      .then(function (response) {
        document.removeEventListener("click", handleClick);
        return response.text();
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (err) {
        console.warn(
          "path:" + pathname + "打开失败" + err.message + "；devServer 未启动"
        );
      });
  }

  document.addEventListener("keydown", handleKeyDown);
}
