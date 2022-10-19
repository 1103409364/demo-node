#!/bin/bash
# 1 逻辑备份

iuser=root
ipass=
db=mysql
file=/tmp/$db-$(date "+%Y%m%d").sql # $() 取命令结果

# 把备份文件放到 tmp。-f 判断文件存在，! 取反
if [ ! -f $file ]; then # [ ] 和命令之间要保留空格，否则报错
  # mysqldump 需要安装 mariadb 和 mariadb-server
  # yum install -y mariadb mariadb-server
  # 启动服务
  # systemctl start mariadb
  mysqldump -u$iuser -p$padd $db >$file # -p等效于--password="$pass"
fi
# 把脚本放到计划任务实现定时备份

# 2 物理备份
# 如果没有 mysqldump，可以使用把整个 mysql 目录打包
#  tar -czf 存放目录 备份目录
# var/lib/mysql

# 3 差异备份
# 要安装 inotify 和 rsync
FROM_DIR="/var/www/html/" # 备份目录
#备份路径，备份到另一台电脑
RSYNC_CMD="rsync -az --delete $FROM_DIR root@192.168.4.207:/var/www/html"
# 检测 FROM_DIR 出现了 修改一点传健删除等就循环执行$RSYNC_CMD
while inotifywait -rqq -e modify,move,create,delete,attrib $FROM_DIR; do
  $RSYNC_CMD
done &
