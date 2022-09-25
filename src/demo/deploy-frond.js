import path from "path";
import { Client } from "ssh2";
import { exec } from "child_process";
// import compressing from "compressing"; // npm install compressing

const config = {
  host: "182.43.179.137", // 服务器地址
  port: 22, // 端口号
  username: "root", // 用户名
  password: "xxxxxx", // 密码
};

async function deploy() {
  // git pull
  await new Promise((resolve, reject) => {
    console.log("git pull...");
    exec("git pull", (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`error: ${error || stderr}`);
        reject();
        return;
      }
      console.log(stdout);
      resolve();
    });
  }).catch((error) => console.error(error));
  // 构建项目
  await new Promise((resolve, reject) => {
    exec("npm run build", (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`error: ${error || stderr}`);
        reject();
        return;
      }
      console.log(stdout);
      resolve();
    });
  });

  // 第二步，压缩目录 可以在第一步中完成，压缩为 tgz
  // await new Promise((resolve, reject) => {
  //   const dir = path.resolve(process.cwd(), "./dist/"); // 待压缩目录
  //   const dest = path.resolve(process.cwd(), "./dist.zip"); // 压缩后存放目录和文件名称
  //   compressing.zip.compressDir(dir, dest).then(
  //     (rs) => {
  //       console.log("压缩成功:" + rs);
  //       resolve();
  //     },
  //     (err) => {
  //       reject(err);
  //     }
  //   );
  // });

  // 第三步，上传linux服务器
  !(() => {
    const connect = new Client();
    // 连接成功
    connect
      .on("ready", async () => {
        // 上传文件到linux服务器
        // 先连接sftp
        await new Promise((resolve, reject) => {
          connect.sftp((err, sftp) => {
            // sftp连接失败，退出
            if (err) {
              reject(err);
              return;
            }

            // sftp连接成功，发起上传
            const file = path.resolve(process.cwd(), "./dist.zip"); // 要上传的文件
            const dest = "/home/fff/dist.zip"; //  linux下存放目录和文件名称。
            sftp.fastPut(file, dest, (err, res) => {
              if (err) {
                reject(err); // 上传失败
              } else {
                resolve(); // 上传成功
              }
            });
          });
        });

        // 执行shell脚本
        // 对上传的文件进行解压
        await new Promise((resolve, reject) => {
          // 先进行shell连接
          connect.shell((err, stream) => {
            console.log("解压中");

            // 连接失败退出
            if (err) {
              reject(err);
              return;
            }

            // 到目录下解压文件，再删除掉zip包 可以使用部署脚本 deploy.sh 完成解压备份
            stream.write("cd /home/fff/ && unzip dist.zip \nnext\n");
            stream.write("rm -r -f dist.zip \nexit\n");

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
              console.log(111, buf);
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

// 执行一键部署
deploy();
