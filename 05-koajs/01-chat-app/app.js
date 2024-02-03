const path = require('path');
const Koa = require('koa');
const app = new Koa();
const { randomUUID } = require('crypto')

app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = {};

async function waitMessage(id) {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (subscribers[id]) {
    await waitMessage(id);
  }
}

router.get('/subscribe', async (ctx) => {
  const id = randomUUID();
  subscribers[id] = ctx;
  await waitMessage(id);
});

router.post('/publish', async (ctx) => {
  if (ctx.request.body.message) {
    for (const id in subscribers) {
      subscribers[id].body = ctx.request.body.message;
      delete subscribers[id];
    }
  }

  ctx.body = '';
});

app.use(router.routes());

app.use(require('koa-static')(path.join(__dirname, 'public')));

module.exports = app;
