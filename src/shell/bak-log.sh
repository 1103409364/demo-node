#!/bin/bash

# $() 取命令结果
file=/tmp/log-$(date "+%Y%m%d").tar.gz

# 把备份文件放到 tmp。-f 判断文件存在，! 取反
if [ ! -f "$file" ]; then # [ ] 和命令之间要保留空格，否则报错
  tar -czf "$file" /var/log/
fi
# 把脚本放到定时任务，每天执行备份
