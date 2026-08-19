// WBI 签名所需的排列表
const MIXIN_KEY_ENC_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
  27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
  37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4,
  22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52
];

// 获取 img_key 和 sub_key
async function getWbiKeys() {
  const res = await fetch('https://api.bilibili.com/x/web-interface/nav', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await res.json();
  const imgUrl = data.data.wbi_img.img_url;
  const subUrl = data.data.wbi_img.sub_url;
  return {
    imgKey: imgUrl.split('/').pop().split('.')[0],
    subKey: subUrl.split('/').pop().split('.')[0]
  };
}

// 生成 mixin_key
function getMixinKey(orig) {
  return MIXIN_KEY_ENC_TAB.map(i => orig[i]).join('').slice(0, 32);
}

// 生成 WBI 签名参数
function encWbi(params, imgKey, subKey) {
  const mixinKey = getMixinKey(imgKey + subKey);
  const wts = Math.round(Date.now() / 1000);
  const sortedParams = Object.keys({ ...params, wts })
    .sort()
    .reduce((acc, key) => {
      acc[key] = key === 'wts' ? wts : params[key];
      return acc;
    }, {});
  const query = Object.keys(sortedParams)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(sortedParams[k])}`)
    .join('&');
  const w_rid = (await import('crypto')).createHash('md5')
    .update(query + mixinKey)
    .digest('hex');
  return { ...sortedParams, w_rid };
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const mid = url.searchParams.get('mid') || '你的B站UID';
  
  try {
    const { imgKey, subKey } = await getWbiKeys();
    const signedParams = await encWbi({ mid }, imgKey, subKey);
    
    const queryString = Object.keys(signedParams)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(signedParams[k])}`)
      .join('&');
    
    const biliRes = await fetch(
      `https://api.bilibili.com/x/space/wbi/acc/info?${queryString}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    
    const data = await biliRes.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

