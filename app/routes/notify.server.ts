/**
 * WeCom bot notify webhook
 *
 * @see https://developer.work.weixin.qq.com/document/path/91770
 */
export async function notifyWeCom({
  token,
  content,
}: {
  token: string;
  content: string;
}) {
  // `693axxx6-7aoc-4bc4-97a0-0ec2sifa5aaa`
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
          mentioned_mobile_list: ["13522711983"],
        },
      }),
    }
  );
  const { data } = await response.json();
  return data;
}
