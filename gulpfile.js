const gulp = require("gulp");
// 文件合并
const concat = require("gulp-concat");
// gulp和webpack联合发布的插件
const named = require("vinyl-named");
// config.json文件用来配置入口文件
const fileConfigs = require("./config.json");
const webpack = require("webpack-stream")
// 文件压缩
const uglify = require("gulp-uglify");
// 解析less文件
const less = require("gulp-less");
// css添加厂商前缀
const autoprefix = require("gulp-autoprefixer");
// 启动服务器
const connect = require("gulp-connect");
// 编译sass文件
const sass = require("gulp-sass");
// 压缩css文件
const minifyCSS = require("gulp-minify-css");
// 图片优化
const imagemin = require("gulp-imagemin");


// 创建html任务
gulp.task("html",function(){
    gulp.src("src/html/*.html")
    .pipe(gulp.dest("dist/html"));
});

// 创建iconfont任务
gulp.task("iconfont",function(){
    gulp.src("src/css/iconfont/*")
    .pipe(gulp.dest("dist/css/iconfont"))
    // 重启服务器，保证服务器上是最新的代码
    .pipe(connect.reload());
});

// 创建img任务
gulp.task("imgs",function(){
    gulp.src("src/img/*")
    // 取值范围：0-7（优化等级）,是否无损压缩jpg图片，是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
    .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true, multipass: true}))
    .pipe(gulp.dest("dist/img"))
});

// 创建js合并任务
gulp.task("bundleCommonJS",function(){
    gulp.src("src/js/base/*.js")
    // 把base文件夹下的所有js文件合并成bundle.js
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    // 重启服务器，保证服务器上是最新的代码
    .pipe(connect.reload());
});

// 打包业务逻辑
gulp.task("bundleJS",function(){
    // 到fileConfig.json文件中查找 js项
    return gulp.src(fileConfigs.js)
           .pipe(named())
           // 引入webpack，用webpack处理 js 文件
           .pipe(webpack({
               output : {
                   // 定义打包后文件的名字
                   filename : "[name].js"
               },
               module : {
                   loaders : [{
                       // mustache文件是模板引擎
                       test : /\.mustache$/,
                       // 如果文件是mustache文件，用mustache.loader进行解析
                       loader : "mustache-loader"
                   },{
                       test : /\.js$/,
                       loader : "imports-loader"
                   }]
               },
               devtool : "#eval-source-map"
           }))
           // uglify 将代码进行压缩
           .pipe(uglify().on("error",function(e){
               console.log("\x07",e.lineNumber,e.message);
               return this.end()
           }))
           .pipe(gulp.dest("dist/js"));
});

// 创建less任务
gulp.task("bundleLess",function(){
    // 到fileConfig.json文件中查找 css 项
    gulp.src(fileConfigs.css)
    // 解析less
    .pipe(less())
    .pipe(autoprefix())
    .pipe(minifyCSS())
    .pipe(gulp.dest("dist/css"))
    // 重启服务器，保证服务器上是最新的代码
    .pipe(connect.reload());
});

// 创建sass任务
gulp.task("bundleSass",function(){
    gulp.src(fileConfigs.css)
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(minifyCSS())
    .pipe(gulp.dest("dist/css"))
    // 重启服务器，保证服务器上是最新的代码
    .pipe(connect.reload());
});

// 创建监听任务
gulp.task("watch",function(){
    gulp.watch("src/js/**/*",["bundleJS"]);
    gulp.watch("src/js/base/*.js",["bundleCommonJS"]);
    gulp.watch("src/css/**/*.less",["bundleLess"]);
    gulp.watch("src/css/**/*.scss",["bundleSass"]);
    gulp.watch("src/html/*.html",["html"]);
});

// 创建服务器任务
gulp.task("server",function(){
    connect.server({
        root : "dist",
        port : 8010,
        livereload : true
    })
})

// 让任务执行
gulp.task("default",["html","iconfont","imgs","bundleCommonJS","bundleJS","bundleLess","bundleSass","server","watch"]);