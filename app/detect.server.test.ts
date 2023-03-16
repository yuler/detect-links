import { detect } from "./detect.server";
import isCI from 'is-ci'

// TODO: fail in GitHub Action, maybe because of the network
describe.skipIf(isCI)("detect url", () => {
  test("blocked link `https://wx2142195ea9758f48-x.mp.zhongwenxiaoshuo.com/index.html` in WeChat", async () => {
    const result = await detect(
      "https://wx2142195ea9758f48-x.mp.zhongwenxiaoshuo.com/index.html"
    );
    expect(result.blocked).toBe(true);
  });

  test("unblocked link `https://baidu.com` in WeChat", async () => {
    const result = await detect("https://baidu.com");
    expect(result.blocked).toBe(false);
  });
});
