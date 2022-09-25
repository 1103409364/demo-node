/*
 * @Description:  项目分支配置
 */
const registry = "https://registry.npmmirror.com/";
export const port = 3001;
export const hostname = "localhost";

export const config = {
  project1: {
    master: {
      /** build config */
      name: "项目1-master",
      repo: "https://github.com/xxx/xx.git", // 仓库地址
      branch: "master", // 编译分支 默认master
      srcPath: "xx", // 项目编译目录，一般是vue.config.js所在目录
      buildCommand: [
        `pnpm config set registry ${registry}`,
        "pnpm install",
        "pnpm run build",
      ],
      outputPath: "server/static/html", // 编译目录 默认是srcPath下 dist
      /* host config */
      remotePath: "/usr/local/nginx/html/html", //YOUR_REMOTE  web项目远程目录 注意，由于会提前清空远程目录。请慎重填写地址
      host: "", // YOUR_HOST  web服务器IP地址
      username: "", // YOUR_NAME
      password: "", // YOUR_PWD
      clearRemoteDir: true,
    },
    test: {
      name: "项目1-test",
      repo: "https://github.com/xxx/xx.git", // 仓库地址
      branch: "test", // 编译分支
      srcPath: "xx", // 项目编译目录，一般是vue.config.js所在目录
      buildCommand: [
        `pnpm config set registry ${registry}`,
        "pnpm install",
        "pnpm run build",
      ],
      outputPath: "server/static/html", // 编译目录 默认是srcPath下 dist
      /* host config */
      remotePath: "/usr/local/nginx/html/html", //YOUR_REMOTE  web项目远程目录 注意，由于会提前清空远程目录。请慎重填写地址
      host: "", // YOUR_HOST  web服务器IP地址
      username: "", // YOUR_NAME
      password: "", // YOUR_PWD
      clearRemoteDir: true,
    },
  },
  // project2
};
export type Project = keyof typeof config;
export type Branch = keyof typeof config[Project];
export type Config = typeof config[Project][Branch];

export const projects = Object.keys(config) as Project[];
export const branches = Object.keys(config).reduce(
  (res: Branch[], cur) => (
    Object.keys(config[cur as Project]).forEach(
      (branch) => !res.includes(branch as Branch) && res.push(branch as Branch)
    ),
    res
  ),
  []
);
