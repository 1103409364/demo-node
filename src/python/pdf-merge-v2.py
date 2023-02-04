#!/usr/bin/python3
import os
import html
from PyPDF2 import PdfReader, PdfWriter, PdfMerger
# 合并 pdf 添加大纲，支持父级大纲：使用目录名生成父级大纲

# 需要安装 PyPDF2 $pip3 install PyPDF2
fileWriter = PdfWriter()
merger = PdfMerger()

rootDir = './pdf'  # pdf 文件目录
parentOutline = None  # 父级大纲
oldTitle = ''  # 旧标题，对比标题变化才添加父级大纲
num = 0

for root, dirs, files in os.walk(rootDir):
    dirs.sort()
    files.sort()  # 排序
    for i, name in enumerate(files):
        if name.endswith(".pdf"):
            parentTitle = root.replace(rootDir + '/', '')
            print(root + '/' + name)
            fileReader = PdfReader(f"{root + '/' + name}")
            if oldTitle != parentTitle:
                parentOutline = fileWriter.add_outline_item(
                    parentTitle,
                    num,
                    parent=None
                )
            oldTitle = parentTitle
            fileWriter.add_outline_item(
                html.unescape(name)
                .replace('.pdf', '')
                .replace('_For_vip_user_001', ''),
                num,
                parentOutline
            )
            for page in range(len(fileReader.pages)):
                num += 1
                fileWriter.add_page(fileReader.pages[page])

with open(r"合并.pdf", 'wb') as f:
    fileWriter.write(f)
