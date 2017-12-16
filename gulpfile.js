"use-strict";
var gulp = require('gulp');
var connect = require('gulp-connect');
var opn = require('opn');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


//local server
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true,
    port: 9000
  });
  opn('http://localhost:9000');
});
 //source
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});


 gulp.task('js', function () {
  gulp.src('./app/js/*.js')
    .pipe(connect.reload());
});
 
 
// sass to css and  convert CSS
gulp.task('convert-css', function() {
    return gulp.src('./app/css/main.scss')
      .pipe(sass())
      .pipe(autoprefixer({
            browsers: ['last 2 versions', "ie 10"],
            cascade: false
        }))
      .pipe(rename('main.css'))
      .pipe(gulp.dest('./app/css/'))
      .pipe(connect.reload())
});



 //folowing
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']); 
  // gulp.watch(['./app/minicss/main.min.css'], ['css']); 
  gulp.watch(['./app/js/*.js'], ['js']); 
  gulp.watch(['./app/css/*.scss'], ['convert-css']); 
});

 //task by default
gulp.task('default', ['connect', 'watch','convert-css']);

