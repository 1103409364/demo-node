#!/bin/bash

echo -e "\033[42m-------------------------\033[0m"
echo -e "#\e[32m 1.查看剩余内存（MB）\e[0m           #" # \e 同 \033
echo -e "#\e[33m 2.查看根分区剩余容量（MB）\e[0m           #"
echo -e "#\e[34m 3.查看 CPU 十五分钟负载\e[0m           #"
echo -e "#\e[35m 4.查看系统进程数量\e[0m           #"
echo -e "#\e[36m 5.查看 JAVA 进程\e[0m           #"
echo -e "#\e[36m 6.查看系统账户数量\e[0m           #"
echo -e "#\e[36m 7.退出\e[0m           #"
echo -e "\033[42m-------------------------\033[0m"
echo

while :; do
  read -r -p "请选择 [1-7]：" i
  case $i in
  1)
    free -m | awk '/Mem/{print $NF " MB"}'
    ;; # case 命令序列最后必须以双分号结尾
  2)
    df -m | awk '/\/$/{print $4 " MB"}' # 根分区 斜线结尾的行
    ;;
  3)
    uptime | awk '{print $NF}'
    ;;
  4)
    ps aux | wc -l # wc 统计
    ;;
  5)
    pgrep java
    ;;
  6)
    sed -n '$=' /etc/passwd # 最后一行行号。$ 最后一行，= 打印
    ;;
  7)
    exit
    ;;
  *)
    echo "输入有误"
    ;;
  esac
done
