// https://www.jianshu.com/p/dd435cd9c3b9
const net = require("net");

function findUnusedPort(port) {
  const server = net.createServer().listen(port);
  return new Promise((resolve, reject) => {
    server.on("listening", () => {
      console.log(`the server is runnint on port ${port}`);
      server.close();
      resolve(port);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(findUnusedPort(++port)); //如占用端口号+1
        console.log(`this port ${port} is occupied.try another.`);
      } else {
        reject(err);
      }
    });
  });
}
// 测试
async function main() {
  try {
    const port = await findUnusedPort(3000);
    console.log(port);
  } catch (err) {
    console.error(err);
  }
}

main();

module.exports = findUnusedPort;
