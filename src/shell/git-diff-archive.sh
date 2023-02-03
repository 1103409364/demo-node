#!/bin/bash

# 增量代码文件导出
echo -e "#\e[32m 导出 git 增量代码\e[0m" # \e 同 \033
echo

read -r -p "请输入项目路径，使用/或者\\\作为路径分隔符，当前路径直接回车：" path
# 路径非空
if [ ! -z "$path" ]; then
  cd "$path" || exit
fi

if [ $? -ne 0 ]; then
  echo -e "#\e[35m 路径 $path 不存在，请检查 \e[0m"
  exit
fi

echo -e "#\e[35m 当前路径：$(pwd)\e[0m"

while [ -z "$bugNo" ]; do
  read -r -p "请输入 bug 编号：" bugNo
done

while [ -z "$commitHash" ]; do
  read -r -p "请输入 Commit Hash：" commitHash
done

# 输出路径
file=$(pwd)/$bugNo.zip
git archive -o "$file" "$commitHash" "$(git diff --name-only "$commitHash^!")"

if [ $? -eq 0 ]; then
  echo -e "#\e[34m 导出成功：$file \e[0m"
else
  echo -e "#\e[35m 导出失败，请检查参数 \e[0m"
  rm "$file"
fi
