var gulp = require('gulp');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');

var paths = {
    sass: ['./scss/**/*.scss'],
    js: ['./www/js/app.js', './www/js/**/*.js']
};

// 打包scss成css并压缩
gulp.task('sass', function (done) {
    gulp.src(paths.sass)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

// 打包app的js并压缩
gulp.task("concatJS", function (done) {
    gulp.src(paths.js)
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./www/lib/'))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./www/lib/'))
        .on('end', done);
});

// 打包其它依赖js库
// 根据bower.json中dependencies配置打包
gulp.task("bowerJS", function(){
    var bowerJss = mainBowerFiles();
    console.log(bowerJss);

    gulp.src(bowerJss)
        .pipe(concat('vender.js'))
        .pipe(gulp.dest('./www/lib/'))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./www/lib/'))
});

// 监听任务
gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['concatJS']);
});

// 打包安装任务
gulp.task('install', ['sass', 'concatJS', 'bowerJS']);