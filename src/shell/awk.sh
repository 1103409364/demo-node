# !/bin/bash
# 监控操作系统信息

# 过滤内存信息
free
#                total        used        free      shared  buff/cache   available
# Mem:        24531084      448020    23508524        2916      574540    23757200
# Swap:        6291456         268     6291188
free | awk '{print $7}'
free | awk '/Mem/{print $NF}'

# 过滤磁盘信息
df
# Filesystem      1K-blocks      Used  Available Use% Mounted on
# none             12265540         4   12265536   1% /mnt/wsl
# drivers          87716200  36428080   51288120  42% /usr/lib/wsl/drivers
# none             12265540         0   12265540   0% /usr/lib/wsl/lib
# /dev/sdd       1055762868    362292 1001697104   1% /                    #根分区
# none             12265540        32   12265508   1% /mnt/wslg
# rootfs           12262220      1876   12260344   1% /init
# none             12262248         0   12262248   0% /dev
# none             12265540         4   12265536   1% /run
# none             12265540         0   12265540   0% /run/lock
# none             12265540         0   12265540   0% /run/shm
# none             12265540         0   12265540   0% /run/user
# tmpfs            12265540         0   12265540   0% /sys/fs/cgroup
# none             12265540        88   12265452   1% /mnt/wslg/versions.txt
# none             12265540        88   12265452   1% /mnt/wslg/doc
# drvfsa           87716200  36428080   51288120  42% /mnt/c
# drvfsa          230686716 122254036  108432680  53% /mnt/d
# drvfsa          171674624 101585664   70088960  60% /mnt/e

df | grep "/$" #根分区斜线结尾
# /dev/sdd       1055762868    362292 1001697104   1% /
# z@z:~$ df | grep "/$" | awk '{print $4}' # 剩余容量
# 1001697104
df | awk '/\/$/{print $4}' # 剩余容量 awk 正则

# 过滤cpu信息
# z@z:~$ LANG=C lscpu #LANG=C 以英文显示 lscpu 显示cpu信息
# Architecture:                    x86_64
# CPU op-mode(s):                  32-bit, 64-bit
# Byte Order:                      Little Endian
# Address sizes:                   39 bits physical, 48 bits virtual
# CPU(s):                          8
# On-line CPU(s) list:             0-7
# Thread(s) per core:              2
# Core(s) per socket:              4
# Socket(s):                       1
# Vendor ID:                       GenuineIntel
# CPU family:                      6
# Model:                           158
# Model name:                      Intel(R) Core(TM) i5-8300H CPU @ 2.30GHz

# z@z:~$ LANG=C lscpu | grep "Model name" | awk -F: '{print $2}' # 过滤型号
#                       Intel(R) Core(TM) i5-8300H CPU @ 2.30GHz
# z@z:~$ LANG=C lscpu | awk -F: '/^Model name/{print $2}' # 不用 grep
#                       Intel(R) Core(TM) i5-8300H CPU @ 2.30GHz
# z@z:~$ LANG=C lscpu | awk -F: '/^CPU\(s\)/{print $2}' # 核心数
#                           8
uptime #cpu 负载
#  13:42:29 up 42 min,  0 users,  load average: 0.00, 0.00, 0.00
uptime | awk '{print $NF}'
# 0.00

# 过滤网卡信息
ifconfig #网卡信息
# eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
#         inet 172.27.7.236  netmask 255.255.240.0  broadcast 172.27.15.255
#         inet6 fe80::215:5dff:fe5b:2fb8  prefixlen 64  scopeid 0x20<link>
#         ether 00:15:5d:5b:2f:b8  txqueuelen 1000  (Ethernet)
#         RX packets 11434  bytes 30911612 (29.4 MiB)
#         RX errors 0  dropped 0  overruns 0  frame 0
#         TX packets 8822  bytes 600170 (586.1 KiB)
#         TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
#         inet 127.0.0.1  netmask 255.0.0.0
#         inet6 ::1  prefixlen 128  scopeid 0x10<host>
#         loop  txqueuelen 1000  (Local Loopback)
#         RX packets 4  bytes 200 (200.0 B)                                #进站流量
#         RX errors 0  dropped 0  overruns 0  frame 0
#         TX packets 4  bytes 200 (200.0 B)                                #出站流量
#         TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# 监控暴力破解服务器的 IP 地址
grep "Failed" /var/log/secure #登录信息，失败有 Failed 查看登录方 ip 等，找到暴力破解 ip 加到防火墙
# Oct 12 13:55:43 CFXPS sshd[7486]: Failed password for root from 10.161.3.204 port 8663 ssh2
grep "Failed" /var/log/secure | awk '{print $11}'
# 10.161.3.204
# 10.161.3.204
awk '/Failed/{print $11}' /var/log/secure
# 10.161.3.204
# 10.161.3.204
