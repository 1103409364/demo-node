declare module "youdao-fanyi" {
  // const Youdao: any;
  // export default Youdao;
  export default function Youdao<T = any>(params: {
    appkey: string;
    secret: string;
  }): (txt: string) => Promise<T>;
}
