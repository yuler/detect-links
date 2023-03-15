/**
 * WeCom bot notify webhook
 *
 * @see https://developer.work.weixin.qq.com/document/path/91770
 */
export async function notifyWeCom({
  token,
  content,
  mentiones = ''
}: {
  token: string;
  content: string;
  mentiones?: string;
}) {
  const response = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msgtype: "text",
        text: {
          content,
          mentioned_mobile_list: mentiones.split(','),
        },
      }),
    }
  );
  const { data } = await response.json();
  return data;
}
