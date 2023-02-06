#!/bin/bash

# awk 条件判断
# awk 逐行处理
# 输出所有行还是输出部分行?
# 如何限制仅输出部分行的数据内容?
# 如何设置多个条件?

# 条件表达式：
# 正则表达式
# ~匹配，!~不匹配
# 列分隔符 :，找第七列不是 bash 结尾的行，执行打印第一列和第七列
awk -F: '$7!~/bash$/{print $1,$7}' /etc/passwd

# 数值/字符比较
# ==、!=、>、>=、<、<=
# 数字比较 打印第二行，逐行读取，判断行号 == 2 时打印
awk 'NR==2{print}' /etc/passwd
# 字符串比较 打印第七列不为/bin/bash 的行，条件后没有指令【默认指令是打印】打印整行
awk -F: '$7!="/bin/bash"' /etc/passwd
# bin:x:1:1:bin:/bin:/sbin/nologin
# 打印第一列为 root 的行，字符串用双引号标记
awk -F: '$1=="root"' /etc/passwd
# root:x:0:0:root:/root:/bin/bash
# 打印第三列 uid 大于等于 1000 的用户（自己创建的普通用户）
awk -F: '$3>=1000{print $1,$3}' /etc/passwd
# nfsnobody 65534

# 逻辑比较
# &&、||
# 打印 uid 大于等于 0，小于 2 的用户
awk -F: '$3>=0&&$3<2{print $1,$3}' /etc/passwd
# root 0
# bin 1
awk -F: '$3==1||$3==7{print $1,$3}' /etc/passwd
# bin 1
# halt 7

# 运算符
# +、-、*、/、%、++、--、+=、*=、/=
# 打印偶数行
awk 'NR%2==0' /etc/passwd
# 200 以内同时能被 3 和 13 整除的整数。seq 200 产生 1 到 200 的一列整数
seq 200 | awk 'BEGIN{i=0} $1%3==0&&$1%13==0{i++;print $1} END{print "结果："i}'
# 39
# 78
# 117
# 156
# 195
# 结果：5
