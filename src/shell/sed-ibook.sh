#!/bin/bash
cat test.txt | sed -E -e 's/^“//g' | sed -E -e 's/”$//g' | sed -E -e '/^(摘录来自)/,$d'
