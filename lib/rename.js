"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
/**
 * 重命名
 * @param {*} url 文件路径 D:\Downloads\test\
 * @param {*} prefix 文件名前缀
 */
function renameFiles(url, prefix) {
    fs_1.default.readdir(url, "utf8", function (err, fileList) {
        if (err)
            throw err;
        // console.log(fileList, prefix);
        fileList.forEach(function (item, index) {
            var _a, _b;
            var oldName = item;
            var type = (_b = (_a = item.match(/(\.\w+)$/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ""; // 获取文件后缀名 包括 .
            // 新名称,根据需求修改名称，可以使用正则等；后缀可用之前的type 也可统一自定义
            var newName = prefix + index + type;
            console.log(url + oldName, url + newName);
            fs_1.default.rename(url + oldName, url + newName, function (err) {
                if (err)
                    throw err;
            });
        });
    });
}
/**
 * readline 回调转 promise
 * @param question
 * @returns
 */
function readlinePromise(question) {
    return new Promise(function (resolve, reject) {
        readline.question("".concat(question, "\n"), function (input) {
            if (input) {
                resolve(input);
            }
            else {
                reject("请输入");
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var p, n;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readlinePromise("\u8BF7\u8F93\u5165\u6587\u4EF6\u76EE\u5F55\uFF1A").catch(function (e) {
                        console.error(e);
                    })];
                case 1:
                    p = _a.sent();
                    return [4 /*yield*/, readlinePromise("\u8BF7\u8F93\u5165\u6587\u4EF6\u540D\u524D\u7F00\uFF1A").catch(function (e) {
                            console.error(e);
                        })];
                case 2:
                    n = _a.sent();
                    readline.close();
                    try {
                        renameFiles(path_1.default.join(p + "/"), n || ""); // 补最后一级补 /。两个 // 不会报错。没有 / 路径少一级
                    }
                    catch (error) {
                        console.log(error);
                        process.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();
