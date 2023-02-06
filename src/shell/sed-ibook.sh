#!/bin/bash
# Useless cat. Consider 'cmd < file | ..' or 'cmd file | ..' instead.shellcheckSC2002
# s/查找的内容/替换的内容/ 这里空表示删除。分隔符号也可以用 # 代替
sed -E -e 's#^“##g' test.txt | sed -E -e 's/”$//g' | sed -E -e '/^(摘录来自)/,$d'
