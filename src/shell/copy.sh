#!/bin/bash

# 进度条
progress() {
  while :; do                   # 死循环
    echo -en "\033[42m \033[0m" # 输出色块。\e033 简写\e
    sleep 0.5
  done
}

progress &  # 调用 &放到后台，不影响后续命令执行
cp -r $1 $2 # 拷贝命令 -r 递归。参数：拷贝源 目标，结束才会继续往下
kill $!     # 杀死进程，$! 最后一个【后台进程&】的进程号，杀死进度条
echo end    # 换行
