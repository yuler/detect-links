import path from "path";
import express from "express";
import schedule from "node-schedule";
import { createRequestHandler } from "@remix-run/express";
import { prisma } from "~/db.server";
import { domainDetect } from "~/domain-detect.server";

// Note: Simple schedule job for every minute
// TODO: Move to queue
const rule = process.env.NODE_ENV === 'production'
  ? '*/5 * * * *' // every 5m
  : '*/10 * * * * *' // every 10s
schedule.scheduleJob(rule, async () => {
  console.log("execute global job");
  const domains = await prisma.domain.findMany({
    select: { id: true, url: true},
    // where: {
    // }
  })
  for (const domain of domains) {
    const { id, url } = domain
    
    domainDetect(url)
      .then(result => {
        if (result.blocked) {
          console.warn(`${id}: ${url} is blocked`)
        }
      })
  }
});

const app = express();

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

const port = process.env.PORT || 3000;

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
