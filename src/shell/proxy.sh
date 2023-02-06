#!/system/bin/sh
# 让安卓设备作为旁路由

tun='tun0'  #虚拟接口名称
dev='wlan0' #物理接口名称，eth0、wlan0
interval=3  #检测网络状态间隔(秒)
pref=18000  #路由策略优先级
# 开启 IP 转发功能
sysctl -w net.ipv4.ip_forward=1

# 清除filter表转发链规则
iptables -F FORWARD

# 添加NAT转换，部分第三方VPN需要此设置否则无法上网，若要关闭请注释掉
iptables -t nat -A POSTROUTING -o $tun -j MASQUERADE

# 添加路由策略
ip rule add from all table main pref $pref
# expr is antiquated. Consider rewriting this using $((..)), ${} or [[ ]].shellcheckSC2003
# $/${} is unnecessary on arithmetic variables.shellcheckSC2004。算术变量不需要 $
ip rule add from all iif $dev table $tun pref $((pref - 1))
contain="from all iif $dev lookup $tun"

while true; do
  # In POSIX sh, [[ ]] is undefined.shellcheckSC3010
  if [ "$(ip rule)" != "*$contain*" ]; then
    if [ "$(ip ad | grep 'state UP')" != "*$dev*" ]; then
      # -e 让 echo 启用解释反斜杠转义。例如 echo "a\nb" 没有加 -e 并不会换行。echo历史上在不同的系统上表现不同。改为使用printf以确保 shell 之间的兼容性。
      echo -e "[$(date "+%H:%M:%S")]dev has been lost."
    else
      ip rule add from all iif $dev table $tun pref $((pref - 1))
      echo -e "[$(date "+%H:%M:%S")]network changed, reset the routing policy."
    fi
  fi
  sleep $interval
done
