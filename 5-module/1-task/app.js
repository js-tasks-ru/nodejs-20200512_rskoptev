const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subs = new Set();

//Logger

// app.use(async (ctx, next) => {
//   await next();
//   const rt = ctx.response.get('X-Response-Time');
//   console.log(`${ctx.method} ${ctx.url} - ${rt}`);
// });

router.get('/subscribe', async (ctx, next) => {
  const message = new Promise(async (resolve, reject) => {
    try {
      subs.add(resolve);

      ctx.res.on('close', () => {
       subs.delete(resolve);
     });
    } catch (err) {
      reject(err);
      console.error('err', err);
      ctx.status = 500;
      ctx.body = 'Server error';
      }
  });
  ctx.body = await message;
  return next();
});

router.post('/publish', async (ctx, next) => {
  const nMessage = ctx.request.body.message;
  if (!nMessage) {
    ctx.throw(400, 'No message!');
    return next();
  }                                               //todo сделать проверку на длину! Возможно попробовать try catch

  subs.forEach(item => item(nMessage));
  subs.clear();

  ctx.body = nMessage;
  return next();
});

app.use(router.routes());

module.exports = app;
