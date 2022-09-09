#!/bin/sh
name=$name # = 两边不能有空格
echo "备份 $name"
rename $name $name-$(date "+%Y%m%d-%H%M%S").jar $name

echo "  ===== 关闭 xxx ======"
PROCESS=$(ps -ef | grep java | grep -v grep | grep /mnt/clear/java/clear/config/application.yaml | awk '{print $2}')
for i in $PROCESS; do
  echo "Kill the $1 process [ $i ]"
  kill -9 $i
done
echo "  ===== 启动 xxx ======"
nohup java -jar -Dspring.config.location="/xxx/java/clear/config/application.yaml" -Xms1024m -Xmx1024m $name >log.out 2>&1 &
echo $! >savePid.txt
cat savePid.txt
rm savePid.txt
tail -f log.out
