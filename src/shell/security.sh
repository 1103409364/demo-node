#!/bin/bash

# 安全相关脚本
# HASH 值
# HASH值与文件名称、时间、大小等信息无关，仅与内容有关
# MD5 使用 md5sum 命令计算
md5sum bak-log.sh
# bb3e13e7deed68cca38adc59be77e59b  bak-log.sh
# SHA256 sha256sum 命令计算
sha256sum ./bak-log.sh
# 3be128e41fe940d545f7669f705be1844e3454390e743310c91c99df501a9199 ./bak-log.sh

# 数据安全检测脚本，列出所有配置文件，计算 hash值导出
for i in $(ls /etc/*conf); do
  md5sum "$i" >>/tmp/data.log
done

# 假设电脑被攻击，不知道哪些文件被篡改了。重新生成文件 hash 值，进行对比

# SSH 配置
# 为了安全，更改 ssh 配置
# sshd 主配置文件：/etc/ssh/sshd_config
# Port 22 改用非标准端口
# PermitRootLogin no 禁止 root 登录
# UseDNS no 不解析客户机地址
# AllowUser 账户名 设置远程连接的白名单， 多个用户空格分割
conf="/etc/ssh/sshd_config"

sed -i '/^Port/s/22/1122' $conf # s 替换 改端口22 为 1122
sed -i '/^PermitRootLogin/s/yes/no' $conf
sed -i '/^UseDNS/s/yes/no/' $conf
sed -i '$a AllowUser tom' $conf # $a 最后一行插入新行，只允许 tom 连接服务器
# 重启服务
systemctl restart sshd
# 安全，但是连接麻烦

# systemctl命令 – 管理系统服务
# https://www.linuxcool.com/systemctl
