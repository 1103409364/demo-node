import Koa from "koa";
import KoaRouter from "koa-router";
import KoaStatic from "koa-static";
import fse from "fs-extra";
import {
  Branch,
  branches,
  config,
  hostname,
  port,
  Project,
  projects,
} from "./config/config.js";
import publish from "./module/publish.js";

const app = new Koa();
const router = new KoaRouter();

router.get("/publish", async (ctx) => {
  const { project, branch } = ctx.query as { project: Project; branch: Branch };
  if (!project || !branch) {
    return (ctx.body = {
      state: "err",
      data: "需要传项目名和分支，参数不能为数组",
    });
  }

  if (!projects.includes(project)) {
    return (ctx.body = {
      state: "err",
      data: "项目不存在，请检查项目名称",
    });
  }

  if (!branches.includes(branch)) {
    return (ctx.body = {
      state: "err",
      data: "项目不存在，请检查项目名称",
    });
  }

  let status = "";
  try {
    status = fse.readFileSync("./log.txt", "utf-8");
  } catch (e) {}
  let history = "";
  try {
    history = fse.readFileSync("./workspace/build-history.txt", "utf-8");
  } catch (e) {}
  if (status && /building/.test(status)) {
    ctx.body = {
      state: "err",
      status,
      history,
      project,
      branch,
      data: "正在编译，请稍后再试！",
    };
  } else {
    publish(project, branch);
    ctx.body = { state: "ok", history, project, branch };
  }
});

router.get("/status", async (ctx) => {
  let status = "";
  try {
    status = fse.readFileSync("./db.txt", "utf-8");
  } catch (error) {
    console.log(error);
  }
  let history = "";
  try {
    history = fse.readFileSync("./workspace/build-history.txt", "utf-8");
  } catch (error) {
    console.log(error);
  }
  ctx.body = { state: "ok", status, history };
});

router.get("/project", async (ctx) => {
  ctx.body = {
    state: "ok",
    project: projects.map((project) => ({
      project,
      branch: Object.keys(config[project]).map((branch) => ({
        name: config[project][branch as Branch].name,
        project,
        branch,
      })),
    })),
  };
});

app.use(KoaStatic("./views"));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port, () =>
  console.log(`app running on http://${hostname}:${port}`)
);
