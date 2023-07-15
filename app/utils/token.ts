var CryptoJS = require("crypto-js");

const secret = "saltsalt";

interface Data {
  username: string
  password: string
}

interface Payload {
  data: Data
  created: number
  exp: number
}

interface Token {
  payload: Payload
  signature: string
  checkSignature: string
}

const EXP_M_SEC = 24 * 60 * 60 * 1000 // 过期时间 1天

const createToken = (data: Data): string => {
  const payload: Payload = {
    data,
    created: +Date.now(), // token生成的时间的，单位秒
    exp: EXP_M_SEC
  };

  // payload信息
  const base64Str = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64"
  );

  const hash = CryptoJS.HmacSHA256(base64Str, secret);

  return base64Str + "." + hash;
}

const decodeToken = (token: string): Token | null => {
  const decArr = token.split(".");
  if (decArr.length < 2) {
    // token不合法
    return null
  }
  let payload: Payload;
  // 将payload json字符串 解析为对象
  try {
    payload = JSON.parse(Buffer.from(decArr[0], "base64").toString("utf8"));
  } catch (e) {
    return null;
  }
  // 检验签名
  return {
    payload,
    signature: decArr[1],
    checkSignature: CryptoJS.HmacSHA256(decArr[0], secret).toString()
  };
}

const checkToken = (token: string): boolean => {
  let resDecode = decodeToken(token);
  if (!resDecode) {
    // token不合法
    console.log('token不合法')
    return false;
  }

  // 是否过期
  let expired = Number(Date.now()) - resDecode.payload.created > resDecode.payload.exp
  if (expired) {
    console.log('token过期')
  }

  if (resDecode.signature !== resDecode.checkSignature) {
    console.log('token错误: ',resDecode )
  }

  return resDecode.signature === resDecode.checkSignature && !expired
}

export default {
  createToken,
  decodeToken,
  checkToken
}