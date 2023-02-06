#!/bin/bash
# Useless cat. Consider 'cmd < file | ..' or 'cmd file | ..' instead.shellcheckSC2002
cat test.txt | sed -E -e 's/^“//g' | sed -E -e 's/”$//g' | sed -E -e '/^(摘录来自)/,$d'
