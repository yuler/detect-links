# detect-links

> Detecting whether the URL links in WeChat are blocked

## Tech Stacks

- from [indie-stack](https://github.com/remix-run/indie-stack)

## Deploy fly

```bash
fly apps create detect-links
fly volumes create data --size 1
fly secrets set SESSION_SECRET=$(openssl rand -hex 32)
```
