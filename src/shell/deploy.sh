#!/bin/sh
echo '删除 dist'
rm -rf dist
echo '解压 dist.gz'
tar -zxvf dist.gz
echo '备份 dist.gz'
rename dist.gz "dist-$(date "+%Y%m%d-%H%M%S").gz" dist.gz
