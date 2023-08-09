import pkg from 'gulp';
const { src, dest, watch, series } = pkg;

import image from 'gulp-image';
//import gutil from 'gulp-util';
import through2 from 'through2';
import minimist from 'minimist';
import fs from 'fs';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import autoprefix from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import { default as uglify } from 'gulp-uglify';
import notify from 'gulp-notify';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

const argv = minimist(process.argv.slice(2));

const watchScss = (done) => {
  if (argv.type === 'development') {
      watch('src/styles/**/*.scss', gulp.series('sass'));
  }
  done();
};

const clean = () => {
  if (!fs.existsSync('dist')) {
      console.log('Folder does not exist.');
      return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
      try {
          fs.rmSync('dist', { recursive: true });
          console.log('Folder deleted successfully.');
          resolve();
      } catch (error) {
          console.error('Error deleting folder:', error);
          reject(error);
      }
  });
}

const imagesPng = () => {
  return src([
      //"src/img/*.svg",
      "./src/img/**/*.png",
      //"src/img/**/*.jpg",
      //"src/img/**/*.jpeg"
  ])
  .pipe(through2.obj(function (file, enc, cb) {
    //console.log('Processing file:', file.path); // Добавьте эту строку для отладки
    //if (argv.type === 'production') {
      this.push(file); // Pass the file through in production
    //}
    cb();
  }))
  .pipe(image()) // Process images using gulp-image
  .pipe(dest('dist/img')) // Output to destination folder
  .pipe(browserSync.stream()); // Stream changes to browserSync
};

const imagesSvg = () => {
  return src([
      "src/img/**/*.svg",
  ])
  .pipe(through2.obj(function (file, enc, cb) {
    if (argv.type === 'production') {
      this.push(file); // Pass the file through in production
    }
    cb();
  }))
  .pipe(image()) // Process images using gulp-image
  .pipe(dest('dist/img/')) // Output to destination folder
  .pipe(browserSync.stream()); // Stream changes to browserSync
};

// const scripts = () => {
//   return src([
//       'src/js/**/*.js',
//       //'src/js/main.js'
//   ])
//       .pipe(sourcemaps.init())
//       .pipe(babel({
//           presets: ['@babel/env']
//       }))
//       //.pipe(concat('main.js'))
//       .pipe(argv.type === 'production' ? uglify().on('error', notify.onError()) : through2.obj())
//       .pipe(sourcemaps.write())
//       .pipe(dest('dist/js'))
//       .pipe(browserSync.stream());
// }

const bundleScripts = () => {
  return browserify({
    entries: 'src/js/MemoryGame.js', // Замените на путь к вашему главному файлу
    debug: true
  })
    .transform(babelify.configure({
      presets : ["@babel/env"]
  }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(argv.type === 'production' ? uglify().on('error', notify.onError()) : through2.obj())
    .pipe(dest('dist/scripts'));
};

const styles = () => {
  return src('src/styles/**/*.css')
      .pipe(sourcemaps.init())
      .pipe(concat('main.css'))
      .pipe(autoprefix({ cascade: false }))
      .pipe(cleanCSS({ level: 2 }))
      .pipe(sourcemaps.write())
      .pipe(dest('dist/styles'))
      .pipe(browserSync.stream());
}

const htmlMinify = () => {
  return src('src/**/*index.html')
      .pipe(argv.type === 'production' ? htmlmin({ collapseWhitespace: true }) : through2.obj())
      .pipe(dest('dist'))
      .pipe(browserSync.stream());
};

const fonts = () => {
  return src(['src/Fonts/*.woff',
      'src/Fonts/*.woff2'
  ])
      .pipe(dest('dist/Fonts'))
      .pipe(browserSync.stream());
}


const warchFiles = () => {
  browserSync.init({
      server: {
          baseDir: 'dist/'
      }
  })
}

export default series(clean, watchScss, imagesPng, imagesSvg, styles, htmlMinify,fonts, bundleScripts, warchFiles);

////gulp --type production
