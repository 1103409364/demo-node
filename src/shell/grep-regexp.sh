#!/bin/bash

# 正则
# PATTERN="[0-9]+"
# PATTERN='^[A-Z].*[.,]$'

# 匹配 @xxx="xxx" 需要转义
PATTERN='@\w+\s?=\s?"(\w+)\s?"'
# 文件名
FILE_HTML="./test-file/example.txt"
FILE_JS="./test-file/example.txt"

# 查找匹配的字符串并保存到数组
MATCHES=($(grep -oE "$PATTERN" $FILE_HTML))

# 遍历数组并输出匹配结果，使用 @ 或 * 可以获取数组中的所有元素
for match in "${MATCHES[@]}"; do
  fn=$(echo "$match" | grep -oP '\w+(?=")') # 取方法名
  MATCHES_M=($(grep -oE "$fn:" $FILE_JS))
  # 数组长度使用 #
  len="${#MATCHES_M[@]}"
  if [ "$len" -eq 0 ]; then
    echo "方法未定义：$fn"
  fi
done
