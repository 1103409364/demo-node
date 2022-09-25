import Release from "./release.js";
import fse from "fs-extra";
import moment from "dayjs";
import { Branch, config, Project } from "../config/config.js";
/**
 * 编译
 */
export default async (project: Project, branch: Branch) => {
  let time = +new Date();
  let release = new Release(config[project][branch]);
  // 运行目录为根目录，路径从运行目录开始
  fse.writeFileSync(
    "./db.txt",
    `building [${project}#${branch}] start at ${moment().format(
      "YYYY-MM-DD HH:mm:ss"
    )}`
  );

  try {
    await release.publish();
    fse.writeFileSync(
      "./db.txt",
      `build success [${project}#${branch}] end at ${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}`
    );
  } catch (e) {
    console.log(e);
    console.log("构建错误", moment().format("YYYY-MM-DD HH:mm:ss"));
    fse.writeFileSync(
      "./db.txt",
      `build error [${project}#${branch}] start at ${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}`
    );
  }
  time = +new Date() - time;
};
