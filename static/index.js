let isBuilding = false;
let lastBuildStatus = "";
let buildHistoryList = [];

const buildHistory = document.getElementById("buildHistory");
const buildProject = document.getElementById("buildProject");

const buildProjectList = [];

async function getProject() {
  if (document.hidden) return;
  const res = await fetch("/project");
  console.log(res);
  if (res.state === "ok") {
    res.project.forEach((item) => {
      buildProjectList.push(...item.branch);
    });
    console.log("buildProjectList", buildProjectList);
    return true;
  }
}

async function checkStatus() {
  if (document.hidden) return;
  const res = fetch("/status");
  console.log(res);
  try {
    buildHistoryList = JSON.parse(res.history);
  } catch (e) {
    console.log(e);
  }
  isBuilding = /building/.test(res.status);
  lastBuildStatus = res.status;
  updateDom();
}

async function build(project, branch) {
  const res = await fetch(`/publish?project=${project}&branch=${branch}`);
  if (res.state === "ok") {
    checkStatus();
  } else {
    alert(res.data);
  }
}

function updateDom() {
  buildHistory.innerHTML = buildHistoryList
    .map((item) => {
      return `<div class="item">${item.projectName}#${item.branch}, build at ${item.buildAt}，编译时间：【${item.buildTime}s】</div>`;
    })
    .join("");

  buildProject.innerHTML = buildProjectList
    .map((item) => {
      let log = "";
      if (lastBuildStatus.includes(item.project + "#" + item.branch)) {
        log = lastBuildStatus;
      }
      return `<div class="item"> <div class="name">${
        item.name
      }</div> <div class="log" data="${log}">${log}</div> <button ${
        isBuilding ? "disabled" : ""
      } onclick="build('${item.project}','${item.branch}')">编译</button> </div>`;
    })
    .join("");
}

window.onload = async function () {
  const res = await getProject();
  if (!res) return;
  checkStatus();
  setInterval(checkStatus, 30000);
  document.addEventListener("visibilitychange", () => {
    console.log("visibilitychange hidden=", document.hidden);
    !document.hidden && checkStatus();
  });
};
