const { src, dest, watch, series, parallel } = require('gulp')
const moment = require('moment')
const gulpZip = require('gulp-zip')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

const imagemin = require('gulp-imagemin')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const browserSync = require('browser-sync').create()
const nodemon = require('gulp-nodemon')

const config = {
  input: {
    src: 'src/**/*',
    plugin: ['src/assets/plugin/*.js'],
    css: ['src/assets/css/*.css'],
    sass: ['src/assets/sass/*.scss'],
    img: ['src/assets/img/*'],
    js: ['src/assets/js/*.js'],
    html: ['src/*.html']
  },
  output: {
    dist: 'dist/',
    css: 'dist/assets/css/',
    img: 'dist/assets/img/',
    plugin: 'dist/assets/plugin/',
    js: ['dist/assets/js/'],
    ts: 'dist/assets/ts/'
  }
}

// html 压缩
function html() {
  var options = {
    collapseWhitespace: true,
    removeComments: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    js: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true
  }
  return src(config.input.html)
    .pipe(htmlmin(options))
    .pipe(dest(config.output.dist))
}

// javascript 压缩
function js() {
  return src(config.input.js)
    .pipe(
      babel({
        presets: ['@babel/preset-env']
      })
    )
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest(config.output.js))
}

function typescript() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(dest(config.output.ts))
}

function css() {
  const plugins = [autoprefixer(), cssnano()]
  return src(config.input.sass)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest(config.output.css))
}

function img() {
  return src(config.input.img)
    .pipe(imagemin())
    .pipe(dest(config.output.img))
}

// 压缩为 zip 结尾
function zip() {
  var timeStamp = moment().format('YYYY-MM-D_HH-mm-ss_')
  return src(config.output.dist + '**/*')
    .pipe(gulpZip('gulp_project_' + timeStamp + '.zip'))
    .pipe(dest('zip'))
}

// 直接复制不需要打包的文件
function move() {
  // js
  src(config.input.plugin).pipe(dest(config.output.plugin))
  // img
  return src(config.input.img).pipe(dest(config.output.img))
}

// 清空 dist 目录下文件
function remove() {
  return src(config.output.dist, { read: false, allowEmpty: true }).pipe(
    clean()
  )
}

function devServe(cb) {
  nodemon({ script: 'app.js', env: { NODE_ENV: 'development' }, done: cb })
  // browserSync.init({
  //   server: {
  //     baseDir: './src',
  //     // https: true,
  //     // directory: true,   //从与目录列表的应用程序目录中的文件即成
  //     index: 'index.html' //从应用程序目录中提供文件，指定特定文件名为索引
  //   },
  //   port: 8080,
  //   notify: false // 开启静默模式
  // })

  watch(config.input.js, js)
  watch(config.input.sass, css)
  watch(config.input.html).on('change', browserSync.reload)
  watch(config.input.src).on('change', (path, stats) =>
    console.log(`File ${path} was changed`)
  )
  watch(config.input.src).on('add', (path, stats) =>
    console.log(`File ${path} was added`)
  )
  watch(config.input.src).on('unlink', (path, stats) =>
    console.log(`File ${path} was removed`)
  )

  cb()
}

if (process.env.NODE_ENV === 'dev') {
  exports.html = html
  exports.js = js
  exports.css = css
  exports.img = img
  exports.ts = typescript
  exports.remove = remove
  exports.zip = zip
  exports.serve = devServe
  exports.build = series(remove, parallel(html, css, js, move))
}
