import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import sftp from "ssh2-sftp-client";
import download from "download-git-repo";
import fse from "fs-extra";
import dayjs from "dayjs";
import { Config } from "../config/config.js";
import("colors");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE = path.join(__dirname, "../../workspace");
const BUILD_HISTORY = path.join(WORKSPACE, "build-history.txt");

class Release {
  repo: string;
  projectName: string;
  branch: string;
  srcPath: string;
  buildCommand: string[];
  outputPath: string;
  remotePath: string;
  host: string;
  username: string;
  password: string;
  clearRemoteDir: boolean;
  constructor(option: Config) {
    this.repo = option.repo;
    this.projectName = /\/([^/]+)?.git$/.exec(this.repo)?.[1] ?? "project";
    this.branch = option.branch;
    this.srcPath = option.srcPath;
    this.buildCommand = option.buildCommand;
    this.outputPath = option.outputPath;
    this.remotePath = option.remotePath;
    this.host = option.host;
    this.username = option.username;
    this.password = option.password;
    this.clearRemoteDir = option.clearRemoteDir;
  }

  async publish() {
    let lastBuildTime = this.getLastBuildTime();
    let time = +new Date();
    console.log("publish start at", dayjs().format("YYYY-MM-DD HH:mm:ss"));
    if (lastBuildTime > 0) {
      console.log(`预计编译时间为${lastBuildTime}s!!!`);
    }
    await this.downloadRepo();
    for (const command of this.buildCommand) {
      await this.exec(command);
    }
    await this.sleep(1000);
    let sourcePath = path.join(WORKSPACE, this.projectName, this.outputPath); // 编译后的本地dist目录
    if (this.host && this.username && this.password && this.remotePath) {
      if (!/^(\/[^/]+){3}/.test(this.remotePath)) {
        throw new Error(
          "为了安全考虑，不允许使用根目录、一级目录、二级目录做发布目录！！！"
        );
      }
      let client = new sftp();
      console.log("连接web服务器".yellow);
      await client.connect({
        host: this.host,
        username: this.username,
        password: this.password,
      });
      if (this.clearRemoteDir) {
        console.log(`rmdir ${this.remotePath}`.green);
        await client.rmdir(this.remotePath, true);
      }
      console.log(`mkdir ${this.remotePath}`.green);
      await client.mkdir(this.remotePath, true);
      console.log(`传输文件【${sourcePath}】===>【${this.remotePath}】`.green);
      await client.uploadDir(sourcePath, this.remotePath); // 将本地文件夹传输到远程
      console.log("文件传输完毕".green);
      client.end();
    } else if (this.remotePath) {
      /**
       * 如果编译和发布在同一台服务器，进入当前逻辑
       * 不过不建议这样，建议直接修改vue.config.js里边的output
       */
      if (!/^(\/[^/]+){3}/.test(this.remotePath)) {
        throw new Error(
          "为了安全考虑，不允许使用根目录、一级目录、二级目录做发布目录！！！"
        );
      }
      fse.removeSync(this.remotePath);
      fse.moveSync(sourcePath, this.remotePath);
    }
    time = ~~((+new Date() - time) / 1000);
    console.log(
      "publish end at",
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
      `used ${time} sceond!`
    );
    this.saveBuildInfo(time);
  }
  // 下载代码
  downloadRepo() {
    return new Promise(async (resolve, reject) => {
      let tempPath = path.join(WORKSPACE, `temp/${this.projectName}`); // 代码临时目录
      let workPath = path.join(WORKSPACE, this.projectName); // 代码工作区域目录
      let dependPath = path.join(
        WORKSPACE,
        this.projectName,
        this.srcPath,
        "node_modules"
      ); // 工作区中node_modules目录
      let tempDependPath = path.join(
        WORKSPACE,
        `depned/${this.projectName}/node_modules`
      ); // 缓存node_modules目录

      if (fse.pathExistsSync(tempPath)) {
        console.log(`清除临时代码目录:${tempPath}`.yellow);
        fse.removeSync(tempPath);
      }
      let repo = `direct:${this.repo}#${this.branch}`;
      console.log(`request ${repo}`.green);
      download(repo, tempPath, { clone: true }, async (err: Error) => {
        if (err) {
          console.log(err);
          reject(false);
        } else {
          try {
            console.log(`拉取文件成功！`.green);
            if (fse.pathExistsSync(workPath)) {
              if (fse.pathExistsSync(dependPath)) {
                console.log("保存node_modules");
                fse.removeSync(tempDependPath);
                fse.moveSync(dependPath, tempDependPath);
              }
              console.log("清空工作区目录".yellow);
              fse.removeSync(workPath);
            }
            console.log("构建工作目录".green);
            await this.sleep(1000);
            fse.moveSync(tempPath, workPath);
            if (fse.pathExistsSync(tempDependPath)) {
              console.log("恢复node_modules");
              fse.moveSync(tempDependPath, dependPath);
            }
            resolve(true);
          } catch {
            reject(false);
          }
        }
      });
    });
  }

  // 执行编译命令
  exec(cmd: string, cwdPath?: string) {
    console.log(cmd.green);
    let options = {
      cwd: cwdPath || path.join(WORKSPACE, this.projectName, this.srcPath),
    };
    return new Promise((resolve, reject) => {
      const handler = exec(cmd, options);
      handler?.stdout?.on("data", (data) => console.log(data.yellow));
      handler?.stderr?.on("data", (data) => console.log(data));
      handler.on("close", (code) => resolve(code));
      handler.on("error", (err) => reject(err));
    });
  }

  saveBuildInfo(time: number) {
    let buildList = [];
    if (fse.pathExistsSync(BUILD_HISTORY)) {
      buildList = JSON.parse(fse.readFileSync(BUILD_HISTORY, "utf8"));
    }
    buildList.unshift({
      buildAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      repo: this.repo,
      branch: this.branch,
      projectName: this.projectName,
      buildTime: time,
    });
    buildList = buildList.slice(0, 10);
    fse.writeFileSync(BUILD_HISTORY, JSON.stringify(buildList), "utf8");
  }

  getLastBuildTime() {
    let buildTime = -1;
    if (fse.pathExistsSync(BUILD_HISTORY)) {
      let buildList = JSON.parse(fse.readFileSync(BUILD_HISTORY, "utf8"));
      buildList.find((item: any) => {
        buildTime = item.buildTime;
        return item.projectName === this.projectName;
      });
    }
    return buildTime;
  }

  sleep(time: number) {
    time = Math.max(time, 10); // 最少sleep 10ms
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }
}

export default Release;
