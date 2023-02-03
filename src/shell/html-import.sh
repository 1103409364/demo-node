#!/bin/bash
# 批处理 html 引入 js css

# 递归遍历判断是否是目录。是目录执行 importFile
# param path 目录
# param type 文件类型 1 js 2 css
function traverseDir {
  for item in "$1"/*; do
    if [ -d "$item" ]; then
      # echo "$item is a directory"
      importFile "$item" "$2"
      traverseDir "$item" "$2"
      # else
      # echo "$item is not a directory"
    fi
  done
}

# 给 html 引入文件参数
# param path 目录
# param type 文件类型 1 js 2 css
function importFile {
  # 查找 html 文件
  # Don't use ls | grep. Use a glob or a for loop with a condition to allow non-alphanumeric filenames.
  # 建议使用 "$(ls "$1"/*.html)" 没找到会报错 ls: cannot access  'xx/lang/*.html': No such file or directory
  # 或者使用 find。结果是完整路径
  # htmlFile=$(find "$1" -maxdepth 1 -name "*.html")
  # echo "html 文件 $htmlFile"
  htmlFile="$(ls "$1" | grep .html)"
  if [ -z "$htmlFile" ]; then
    # echo "没有 hmtl"
    return
  fi

  htmlFile="$1/$htmlFile" # 拼接 html 路径
  echo "$htmlFile 已修改"

  if [ "$2" -eq 1 ]; then
    # 查找 .js 文件
    jsFile="./$(ls "$1" | grep .js)" # 组装 src= 的内容
    # sed Stream Editor：流式编辑器，可以非交互式的编辑文档
    # -i: 直接修改源文件。默认不修改源文件
    # sed [选项] '[定位符]指令' 文件
    # s (substitution) 替换关键词，替换为空就是删除。  #替换 </body> 为     <script src='$jsFile'></script>\n</body>
    # unterminated `s' command 斜杠/ 反斜杠\ 混用报错
    sed -i "s#</body>#    <script src='$jsFile'></script>\n</body>#" "$htmlFile"
  elif [ "$2" -eq 2 ]; then
    # 查找 .css 文件
    cssFile="./$(ls "$1" | grep .css)" # 组装 href= 的内容
    sed -i "s#</head>#    <link rel=\"stylesheet\" href='$cssFile'></link>\n</head>#" "$htmlFile"
  fi
}

echo -e "#\e[32m html 文件引入 css js \e[0m" # \e 同 \033
echo

# -r 防止将 \ 识别为转义
read -r -p "请输入绝对路径，当前路径直接回车：" path
read -r -p "请输入文件类型 1:js 2: css：" t
# 未输入 取当前路径
if [ -z "$path" ]; then
  path=$(pwd)
fi

if [ "$t" -eq 1 ]; then
  echo "1: 引入 js"
elif [ "$t" -eq 2 ]; then
  echo "2: 引入 css"
else
  echo "输入不合法"
  exit
fi

traverseDir "$path" "$t" # 调用不需要括号
