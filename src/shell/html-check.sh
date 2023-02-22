#!/bin/bash
# 批处理检查 html 中是否使用了未定义的方法

# 递归遍历判断是否是目录。是目录执行 checkHtml
# param path 目录
function traverseDir {
  checkHtml "$1"
  for item in "$1"/*; do
    if [ -d "$item" ]; then
      # echo "$item is a directory"
      traverseDir "$item"
      # else
      # echo "$item is not a directory"
    fi
  done
}

# 匹配模板中的方法 xxx @event="xxx"
PATTERN='@\w+\s?=\s?"(\w+)\s?"'

function checkHtml {
  # 查找 html 文件
  htmlFile="$(ls "$1" | grep .html)"
  # echo $htmlFile
  if [ -z "$htmlFile" ]; then
    return # echo "没有 hmtl"
  fi
  # html 绝对路径
  htmlFile="$1/$htmlFile"

  # 查找 .js 文件
  jsFiles="$(ls "$1" | grep -oE '.+\.\js$')"
  # 多个 js 转为数组
  jsFiles=($jsFiles)

  jsLen="${#jsFiles[@]}"
  # echo "${jsFiles[@]}"

  if [ "$jsLen" -eq 0 ]; then
    echo "没有 js"
    return #
  fi

  # 查找匹配的字符串并保存到数组
  htmlFns=($(grep -oE "$PATTERN" "$htmlFile"))

  htmlFnsLen="${#htmlFns[@]}"
  # echo "$htmlFnsLen"

  if [ "$htmlFnsLen" -eq 0 ]; then
    return
  fi

  for match in "${htmlFns[@]}"; do
    fn=$(echo "$match" | grep -oP '\w+(?=")') # 取方法名
    fnCount=0
    for item in "${jsFiles[@]}"; do
      jsFile="$1/$item" # 绝对路径
      # echo $jsFile
      matchFns=($(grep -oE "\"?$fn\s*\"?:" "$jsFile"))
      len="${#matchFns[@]}"
      fnCount=$(("$fnCount" + "$len"))
    done
    # echo "$fn = $fnCount"
    if [ "$fnCount" -eq 0 ]; then
      echo "$htmlFile ==方法未定义==> $fn"
    fi
  done
}

echo -e "#\e[32m html 文件代码检查，是否使用了未定义的方法 \e[0m" # \e 同 \033
echo

# -r 防止将 \ 识别为转义
read -r -p "请输入绝对路径，当前路径直接回车：" path
# 未输入 取当前路径
if [ -z "$path" ]; then
  path=$(pwd)
fi

traverseDir "$path" # 调用不需要括号
