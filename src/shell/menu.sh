#!/bin/bash
clear
echo -e "\033[42m-------------------------\033[0m"
echo -e "#\e[32m 1.查看网卡信息\e[0m           #" # \e 同 \033
echo -e "#\e[33m 2.查看内存信息\e[0m           #"
echo -e "#\e[34m 3.查看磁盘信息\e[0m           #"
echo -e "#\e[35m 4.查看CPU信息\e[0m           #"
echo -e "#\e[36m 5.查看账户信息\e[0m           #"
echo -e "\033[42m-------------------------\033[0m"
echo

read -p "请选择[1-5]：" i
case $i in
1)
  ifconfig | head -2
  ;; # case 命令序列最后必须以双分号结尾
2)
  mem=$(free | grep Mem | tr -s " " | cut -d" " -f7) # tr 删除空格
  echo "剩余内存：${men}K."
  ;;
3)
  free=$(df | grep /$ | tr -s "" | cut -d "" -f4)
  echo "根分区剩余容量：${free}K."
  ;;
4)
  cpu=$(uptime | tr -s " " | cut -d" " -f11) # -f11 过滤11列
  echo "本机cpu 15分钟平均负载：$cpu."
  ;;
5)
  login_num=$(who | wc -l)
  total_num=$(cat /ect/passwd | wc -l)
  echo "当前系统账户为：$USER"
  echo "当前登录系统账户数：$login_num"
  echo "当前系统总用户数：$total_num"
  ;;
*)
  echo "输入有误"
  ;;
esac #case 结尾
