#!/bin/bash

echo -e "#\e[32m 导出 git 增量代码，参数1：bug 编号，参数2：commit hash\e[0m           #" # \e 同 \033
echo

read -p "请输入 bug 编号：" bugNo
read -p "请输入 Commit Hash：" commitHash
git archive -o ./$bugNo.zip $commitHash $(git diff --name-only "$commitHash^!")
