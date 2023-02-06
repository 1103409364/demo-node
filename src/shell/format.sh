#!/bin/bash
# 格式化输出
# BEGIN开始的时候打印标题，打印 1 3 6 列，直到最后一行。column -t 排版命令 -t 就是 tab
awk -F: 'BEGIN{print "用户名 UID home目录"} {print $1, $3, $6}' /etc/passwd | column -t
# 用户名           UID    home目录
# root             0      /root
# bin              1      /bin
# daemon           2      /sbin
# adm              3      /var/adm
# lp               4      /var/spool/lpd
# sync             5      /sbin

# 在 awk 指令{}中可以通过 -v 选项定义中转变量，-v 就是 variable 让指令内可以访问外部定义的变量
hello="你好"
awk -v x=$hello 'BEGIN{print x}'
# 你好

# 过滤系统账户对应的密码
# 从/etc/passwd中将所有能登陆的账户名提取出来
# 从/etc/shadow中提取账户对应的密码
USER=$(awk -F: '/bash$/{print $1}' /etc/passwd) # bash 结尾的是可以登录的用户，保存到 USER
for i in $USER; do
  awk -F: -v username="$i" '$1==username {print $1,$2}' /etc/shadow # 第一列是 root 打出第二列 密码
done
