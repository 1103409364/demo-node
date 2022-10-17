# !/bin/bash
# awk 数组，有的像 JavaScript 的对象
# 定义：数组名[下标]=值，下标不一定是数字，可以是字符串字面量，必须用双引号
# 调用：数组名[下标]
# 遍历：for(变量 in 数组){print 数组[变量]}
awk 'BEGIN{name[0]="tom";name["tom"]="jack";print name[0],name["tom"]}'
awk 'BEGIN{name[0]="tom";name["tom"]="jack";for(i in name){print name[i]}}'
# 分号分隔多个命令，逗号分隔多个变量

# 应用：统计 web 访问日志：
# 10.2.3.5
# 10.2.3.5
# 10.2.3.5
# awk 变量可以不定义直接使用，没有定义 IP 可以直接使用。没定义默认为 0
# 以第一列为 key，统计 IP 数量
awk '{o[$1]++} END{for(i in o){print i, o[i]}}' /var/log/httpd/access_log

# 所有用户
who | awk '{o[$1]++} END{for(i in o){print i, o[i]}}'
