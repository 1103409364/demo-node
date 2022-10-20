// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
import tencentcloud from "tencentcloud-sdk-nodejs";

const TmtClient = tencentcloud.tmt.v20180321.Client;
// https://console.cloud.tencent.com/api/explorer?Product=tmt&Version=2018-03-21&Action=TextTranslate
// 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey,此处还需注意密钥对的保密
// 密钥可前往https://console.cloud.tencent.com/cam/capi 网站进行获取
const clientConfig = {
  credential: {
    secretId: "SecretId",
    secretKey: "SecretKey",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "tmt.tencentcloudapi.com",
    },
  },
};

// 实例化要请求产品的client对象,clientProfile是可选的
const client = new TmtClient(clientConfig);

export default client.TextTranslate;

// const params = {
//   SourceText: "hello",
//   Source: "en",
//   Target: "zh",
//   ProjectId: 1276699,
// };
// client.TextTranslate(params).then(
//   (data) => {
//     console.log(data);
//   },
//   (err) => {
//     console.error("error", err);
//   }
// );
