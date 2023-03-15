/**
 * Detecting whether url is blocked inside WeChat
 * @param url - url to detect
 *
 * @see https://mp.weixinbridge.com/mp/wapredirect?url=https://wx2142195ea9758f48-x.mp.zhongwenxiaoshuo.com/index.html
 */
export async function domainDetect(url: string) {
  const response = await fetch(
    `https://mp.weixinbridge.com/mp/wapredirect?url=${encodeURIComponent(url)}`,
    { redirect: "follow" }
  );
  const html = await response.text();
  // parse html get `cgiData` in script tag
  const match = html.match(/var cgiData = (\{.*?\});/s);
  if (match) {
    const jsonString = match[1];
    const { title, desc: description } = JSON.parse(jsonString);
    return {
      blocked: true,
      title,
      description,
    };
  }

  return {
    blocked: false,
  };
}
