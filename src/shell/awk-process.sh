# !/bin/bash
# awk 支持 for if 等。他们也是指令
# 单分支 if 判断。if 也是指令，指令必须放在花括号中
# awk '{指令}' 文件
# {if(){指令} else if(){}...else{}}
awk -F: '{if($3>=1000){i++; print $3}} END{print i}' /etc/passwd
# 65534
# 1
# uptime 供系统启动（或运行）的时间。当前时间、运行会话的用户数以及过去 1、5 和 15 分钟的系统平均负载。
uptime | awk '{if($NF > 0.01){print "cpu load" $NF}}'
# 统计用户。太长可以用 \ 换行
awk -F: '{if($3>=1000){i++} else{j++}} END{print "普通用户："i, "系统用户："j}' /etc/passwd
# 普通用户：1 系统用户：21
# 文件统计 权限非 -开头是文件，d 开头是目录，剩下是其他如快捷方式等
ls -l /etc/ | awk '{if($1~/^-/){x++}else if($1~/^d/){y++}else{z++}} END{print "普通文件："x, "目录个数："y,"其他："z}'
# 普通文件：90 目录个数：75 其他：17

# for 循环
# for(表达式1;表达式2;表达式3) {指令}
awk 'BEGIN{for(i=1;i<=5;i++){print i}}'
