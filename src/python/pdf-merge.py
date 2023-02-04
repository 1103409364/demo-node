#!/usr/bin/python3
import os
import html
from PyPDF2 import PdfReader, PdfWriter, PdfMerger
# 合并 pdf 添加大纲

# 需要安装 PyPDF2 $pip3 install PyPDF2
file_writer = PdfWriter()
merger = PdfMerger()
num = 0
for root, dirs, files in os.walk('.'):
    files.sort()  # 排序，默认取到的文件是乱序
    for name in files:
        if name.endswith(".pdf"):
            print(name)
            file_reader = PdfReader(f"{name}")
            file_writer.add_outline_item(html.unescape(
                name).replace('.pdf', ''), num, parent=None)
            for page in range(len(file_reader.pages)):
                num += 1
                file_writer.add_page(file_reader.pages[page])
with open(r"合并.pdf", 'wb') as f:
    file_writer.write(f)
