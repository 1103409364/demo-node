import path from "path";
import { Client } from "ssh2"; // 引入ssh客户端
import { exec } from "child_process"; // 引入子进程 exec

// 服务器配置
const config = {
  host: "xx.161.2.xx",
  port: 22,
  username: "xx",
  password: "xx",
};

async function deploy() {
  const PATH = "D:/workspace/xxx"; //项目路径
  const PWD = "pwd"; //print the name of current directory
  const PKG = "mvn package -Dmaven.test.skip=true";
  process.chdir(PATH);
  const fileName = "xxx-1.0.0.jar";
  const localPath = path.resolve(process.cwd(), "./xxx/target/" + fileName);
  const remotePath = "/mnt/java/fxps/";
  // 打包
  await new Promise((resolve, reject) => {
    exec(`${PWD} && ${PKG}`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`error: ${error.message || stderr}`);
        reject();
        return;
      }
      console.log(`${stdout}`);
      resolve();
    });
  });

  // 第三步，上传linux服务器
  !(() => {
    const connect = new Client();

    // 连接服务器
    connect
      .on("ready", async () => {
        console.log("connect ready");
        await new Promise((resolve, reject) => {
          connect.sftp((err, sftp) => {
            if (err) {
              console.log("sftp连接失败，退出");
              reject(err);
              return;
            }
            console.log("sftp连接成功，发起上传");
            sftp.fastPut(localPath, remotePath + fileName, (err, res) => {
              if (err) {
                console.log("上传失败");
                reject(err); // 上传失败
              } else {
                resolve(); // 上传成功
              }
            });
          });
        });

        // 执行shell部署脚本
        await new Promise((resolve, reject) => {
          // 先进行shell连接
          connect.shell((err, stream) => {
            console.log("deploy");
            // 连接失败退出
            if (err) {
              reject(err);
              return;
            }

            stream.write(`cd ${remotePath}\n`);
            stream.write("./restart.sh\n"); // 重启服务

            stream.on("close", (err) => {
              connect.end();
              if (err) {
                console.error(err);
                return;
              }
              console.info("******* SUCCESS!! *******");
            });

            let buf = "";
            stream.on("data", (data) => {
              buf += data;
              console.log(buf); // 服务器 log
            });
          });
        });
      })
      .connect(config);

    // 连接错误
    connect.on("error", (err) => {
      console.log("*******连接出错*******", err);
    });

    // 连接关闭
    connect.on("end", () => {
      console.log("*******连接关闭*******");
    });

    // 连接异常关闭
    connect.on("close", (err) => {
      if (err) console.log("*******连接出错*******", err);
    });
  })();
}

deploy();
