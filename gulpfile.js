const gulp = require('gulp');
const webpack = require('webpack');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const usemin = require('gulp-usemin');
const del = require('del');
const rev = require('gulp-rev');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');

//========start of gulp task for working docs files =========//
//watching any update of the project files

//function for initializing browserSync
function browsersync(done) {
  //initializing browsersync
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'working-docs'
    }
  });

  done();
}
//function to watch changes on html file and reload the page
function watchHtml(done) {
  watch('./working-docs/**/*.html', () => {
    browserSync.reload();
  });

  done();
}
//function to watch changes on css file and reload the page
function watchCSS(done){
  //watch all scss file 
  watch('./working-docs/assets/styles/**/*.scss', () => {
    
    //convert scss file to css using gulp-sass and add prefix before saving it to temp css file
    gulp.src('./working-docs/assets/styles/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', (errorInfo) => {
      console.log(errorInfo.toString());
    })
    .pipe(sourcemaps.write())
    .pipe(autoprefixer('last 5 version'))
    .pipe(gulp.dest('./working-docs/temp/styles'));

    //if there r changes made reload html file
    gulp.src('./working-docs/temp/styles/styles.css')
    .pipe(browserSync.stream());

  });

  done();
}
//function to watch script files and reload the page
function watchScript(done){
  //watch all js file and use webpack for configuration 
  watch('./working-docs/assets/scripts/**/*.js', () => {
    //link webpack config file
    webpack(require('./webpack.config.js'), (err, stats) => {
      if (err) {
        console.log(err.toString());
      }
      console.log(stats.toString());
      
    });
    
  });
  //watch script temp file for changes and reload html files
  watch('./working-docs/temp/scripts/App.js', () => {
    browserSync.reload();
  });

  done();

}
//execute all the watch fuction 
gulp.task('watch', gulp.parallel(browsersync, watchHtml, watchCSS, watchScript));

//=====end of gulp task for working docs files ======//

//=====start of gulp task for creating final docs files ====//
//deleting folder final-docs
function deleteDistFolder() {

  return del("./final-docs");

}

//copy general files from folder working-docs to folder final-docs
function copyGeneralFiles(done) {
  const pathsToCopy = [
    './working-docs/**/*',
    '!./working-docs/*.html',
    '!./working-docs/assets/images/**',
    '!./working-docs/assets/styles/**',
    '!./working-docs/assets/scripts/**',
    '!./working-docs/temp',
    '!./working-docs/temp/**'
  ];

  gulp.src(pathsToCopy)
    .pipe(gulp.dest("./final-docs"));

  done();
}

//copying images from working-docs folder to final folder
function copyImages(done) {
   gulp.src(['./working-docs/assets/images/**/*'])
   .pipe(gulp.dest("./final-docs/assets/images"));

   done();
}

//compressing css and js save it on final-docs
function useMin(done) { 
  //minimise css and script file and save them on html files on final docs folder
  gulp.src("./working-docs/*.html")
    .pipe(usemin({
      css: [() => {return rev()}, () => {return cssnano()}],
      js: [() => {return rev()}, () => {return uglify()}]
    }))
    .pipe(gulp.dest("./final-docs"));
  done();
}

//task to build final project document
gulp.task('build', gulp.series(deleteDistFolder, copyGeneralFiles, copyImages, useMin));

//function to preview final project on a browser
function previewDist(done) {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "final-docs"
    }
  });
  done();
}

//task to build final project document
gulp.task('preview', previewDist);


