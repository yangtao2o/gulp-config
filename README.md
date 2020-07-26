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

## Packages

```js
"devDependencies": {
  "@babel/core": "^7.10.4",
  "@babel/preset-env": "^7.10.4",
  "autoprefixer": "^9.8.5",
  "browser-sync": "^2.26.7",
  "cross-env": "^7.0.2",
  "cssnano": "^4.1.10",
  "gulp": "^4.0.2",
  "gulp-babel": "^8.0.0-beta.2",
  "gulp-clean": "^0.4.0",
  "gulp-htmlmin": "^5.0.1",
  "gulp-imagemin": "^7.1.0",
  "gulp-nodemon": "^2.5.0",
  "gulp-postcss": "^8.0.0",
  "gulp-rename": "^2.0.0",
  "gulp-sass": "^4.1.0",
  "gulp-typescript": "^6.0.0-alpha.1",
  "gulp-uglify": "^3.0.2",
  "gulp-zip": "^5.0.2",
  "moment": "^2.27.0",
  "node-sass": "^4.14.1",
  "source-map": "^0.7.3",
  "typescript": "^3.9.6"
}
```
