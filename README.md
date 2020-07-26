# Gulp config

将平时项目中用到的配置汇总，方便以后直接拿来使用

## Getting Stated

### 环境依赖

```text
node 12.16.3 及以上
```

### 本地开发

克隆到本地，并进入目录

```sh
yarn
```

### 打包压缩

- 打包目录 `dist`

```sh
yarn build
```

- 压缩目录 `zip`

```sh
yarn zip
```

## Feature

### SASS

-[如何安装 Sass](https://www.sass.hk/install/)

```sh
yarn add node-sass gulp-sass --save-dev
```

`gulpfile.js` 文件主要配置如下：

```js
const { src, dest, watch } = require('gulp')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

function scss() {
  return src(scssGlobSrc)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(dest('dist/sass'))
}

exports.scss = scss
```

启动：`gulp scss`。

## Browsersync

- [Browsersync + Gulp.js](http://www.browsersync.cn/docs/gulp/)

下载：

```bash
yarn add browser-sync gulp --save-dev
```

使用：

```js
const { task, watch } = require('gulp')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

const serve = function(cb) {
  browserSync.init({
    server: {
      baseDir: './src',
      https: true,
      directory: true //从与目录列表的应用程序目录中的文件即成
      // index: "index.html"  //从应用程序目录中提供文件，指定特定文件名为索引
    },
    port: 8080,
    notify: false // 开启静默模式
  })

  watch('src/*.html').on('change', reload)
}

exports.serve = serve
```

运行：

```sh
gulp serve
```

## TypeScript

根目录下初始化：`tsc --init`。

安装依赖：

```sh
npm i -D typescript gulp-typescript
```

配置：

```js
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')

function typescript() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(dest('dist/ts'))
}

exports.typescript = typescript
```

src 目录下新建文件 `main.ts`：

```ts
class Student {
  fullName: string
  constructor(public firstName: string, public lastName: string) {
    this.fullName = `${firstName} ${lastName} `
  }
}

interface Person {
  firstName: string
  lastName: string
}

function greeter(person: Person) {
  console.log(`hello, ${person.firstName} ${person.lastName}`)
}

let user = new Student('Yang', 'Tao')

greeter(user)
console.log(user.fullName)
```

运行：

```sh
gulp typescript
```

## Koa2

### 启动

Koa 版本：`"koa": "^2.13.0"`

```js
const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000)
```

`ctx.body = 'Hello World'`相当于：

```js
res.statusCode = 200
res.end('Hello World')
```

### 静态文件服务

使用 [koa-static](https://www.npmjs.com/package/koa-static)，版本：`"koa-static": "^5.0.0"`：

```js
const Koa = require('koa')
const serve = require('koa-static')
const app = new Koa()

// 静态文件服务
app.use(serve('.', { extensions: ['html'] })) // 根目录设置，extensions 可省略文件后缀访问
app.use(serve(__dirname + '/static', { extensions: ['html'] })) // static 目录下
app.use(serve(__dirname + '/static/assets')) // static 目录下

app.listen(3000)
```

可设置根目录或者其他目录（如 static），`extensions`可以指定文件的后缀，这样我们访问时就可以省略其后缀。

### 路由服务

- 使用 [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser))，版本：`"koa-bodyparser": "^4.3.0"`
- 使用 [@koa/router](https://www.npmjs.com/package/@koa/router)，版本：`"@koa/router": "^9.3.1"`

```js
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = `
    <form action="/login" method="post">
    <p>
      <label for="username">Username: </label>
      <input type="text" id="username" name="username" required>
    </p>
    <p>
      <label for="username">Passwrod: </label>
      <input type="password" id="password" name="password" required>
    </p>
    <input type="submit" value="submit">
  </form>
  `
})

router.post('/login', async (ctx, next) => {
  let { username, password } = ctx.request.body
  if (username === 'yangtao' && password === '123456') {
    ctx.body = 'Success!'
  } else {
    ctx.body = 'Login error!'
  }
})
// http://localhost:3000/article/vue/20200712  -->
// 文章分类是：vue，ID：20200712
router.get('/article/:category/:articleId', async (ctx, next) => {
  const { category, articleId } = ctx.params
  ctx.body = `文章分类是：${category}，ID：${articleId}`
})

// body 解析，需要在 router 之前 use
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
```

### 页面渲染

使用前端渲染，通常需要一个一面引擎，比如 ejs，需要分别安装 [ejs](https://www.npmjs.com/package/ejs) 以及 [koa-views](https://www.npmjs.com/package/koa-views) 模块：

```js
const Koa = require('koa')
const views = require('koa-views')
let ejs = require('ejs')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

const render = views(__dirname + '/static', {
  extension: 'ejs'
})

// Must be used before any router is used
app.use(render)

router.get('/list', async (ctx, next) => {
  return ctx.render('list', {
    title: '列表页'
  })
})

// 路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
```
