import { fileURLToPath } from "url";
import path from "path";
import xlsx from "node-xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析得到文档中的所有 sheet
const sheets = xlsx.parse(`${__dirname}/pacs008.xlsx`);
// 遍历 sheet
sheets.forEach((sheet) => {
  console.log(sheet["name"]);
  // 读取每行内容
  for (var rowId in sheet["data"]) {
    console.log(rowId);
    var row = sheet["data"][rowId];
    console.log(row);
  }
});
