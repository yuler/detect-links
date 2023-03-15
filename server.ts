import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import schedule from "node-schedule";
import { createRequestHandler } from "@remix-run/express";
import { prisma } from "~/db.server";
import { detect } from "~/detect.server";
import { notifyWeCom } from "~/routes/notify.server";
import { log } from "~/helpers.server";

const app = express();

app.use(async (req, res, next) => {
  res.set("x-fly-region", process.env.FLY_REGION ?? "unknown");
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

  // /clean-urls/ -> /clean-urls
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
    return;
  }
  next();
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "build");

app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require(BUILD_DIR) })
    : (...args) => {
        purgeRequireCache();
        const requestHandler = createRequestHandler({
          build: require(BUILD_DIR),
          mode: MODE,
        });
        return requestHandler(...args);
      }
);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  // require the built app so we're ready when the first request comes in
  require(BUILD_DIR);
  console.log(`✅ app ready: http://localhost:${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key];
    }
  }
}

// Note: Simple schedule job for every minute
// TODO: Move to queue
const rule =
  process.env.NODE_ENV === "production"
    ? "*/5 * * * *" // every 5m
    : "*/10 * * * * *"; // every 10s
schedule.scheduleJob(rule, async () => {
  console.log("execute global job");
  const links = await prisma.link.findMany();
  for (const link of links) {
    const { id, url, blocked, notifyEmail, notifyWecomToken, notifyWecomMobile, notifyWebhook } = link;

    detect(url).then((result) => {
      if (!result.blocked) return;

      log(`${id}: ${url} is blocked`);

      if (blocked) return

      // Send Email
      if (notifyEmail) {
        // TODO:
      }
      // Send notify to wecom 
      if (notifyWecomToken) {
        notifyWeCom({
          token: notifyWecomToken,
          content: `URL: ${url} 被微信禁用`,
          mentiones: notifyWecomMobile ?? '',
        })
          .then(console.log)
          .catch(console.error);
      }
      // Send webhook
      if (notifyWebhook) {
        // TODO:
      }
      prisma.link.update({
        where: {
          id,
        },
        data: {
          blocked: true
        }
      })
    });
  }
});
