import translate from "google-translate-api-x";
import tunnel from "tunnel";

export default async function (text: string) {
  const res = (await translate(
    text,
    { to: "zh-CN" },
    {
      httpsAgent: tunnel.httpsOverHttp({
        proxy: {
          host: "127.0.0.1",
          port: 10811,
        },
      }),
    }
  )) as { text: string };
  return res.text;
}
