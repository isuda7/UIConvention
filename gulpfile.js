/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2020 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.11.0-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */
const gulp                      = require('gulp'),
      fs                        = require('fs'),
      del                       = require('del'),
      sourcemaps                = require('gulp-sourcemaps'),
      plumber                   = require('gulp-plumber'),
      sass                      = require('gulp-dart-sass'),
      less                      = require('gulp-less'),
      stylus                    = require('gulp-stylus'),
      autoprefixer              = require('gulp-autoprefixer'),
      minifyCss                 = require('gulp-clean-css'),
      babel                     = require('gulp-babel'),
      webpack                   = require('webpack-stream'),
      uglify                    = require('gulp-uglify'),
      concat                    = require('gulp-concat'),
      imagemin                  = require('gulp-imagemin'),
      browserSync               = require('browser-sync').create(),
      ejs                       = require('gulp-ejs'),
      rename                    = require('gulp-rename'),
      dependents                = require('gulp-dependents'),
      ghPages                   = require('gulp-gh-pages'),

      src_folder                = './src/',
      src_assets_folder         = src_folder + 'assets/',
      dist_folder               = './dist/',
      dist_assets_folder        = dist_folder + 'assets/',
      node_modules_folder       = './node_modules/',
      dist_node_modules_folder  = dist_folder + 'node_modules/',

      node_dependencies         = Object.keys(require('./package.json').dependencies || {});


gulp.task('clear', () => del([ dist_folder ]));

gulp.task('html', () => {
  return gulp.src([ src_folder + '**/*.html' ], {
    base: src_folder,
    since: gulp.lastRun('html')
  })
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task('ejs', () => {
	return gulp.src(src_folder + '**/*.ejs')
	.pipe(ejs({ title: 'gulp-ejs' }))
	.pipe(rename({ extname: '.html' }))
	.pipe(gulp.dest(dist_folder));
});

gulp.task('sass', () => {
  return gulp.src([
    src_assets_folder + 'sass/**/*.sass',
    src_assets_folder + 'scss/**/*.scss'
  ], { since: gulp.lastRun('sass') })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(dependents())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('less', () => {
  return gulp.src([ src_assets_folder + 'less/**/!(_)*.less'], { since: gulp.lastRun('less') })
    .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(less())
      .pipe(autoprefixer())
      .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('stylus', () => {
  return gulp.src([ src_assets_folder + 'stylus/**/!(_)*.styl'], { since: gulp.lastRun('stylus') })
    .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(stylus())
      .pipe(autoprefixer())
      .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
	return gulp.src([ src_assets_folder + 'js/*.js' ], { since: gulp.lastRun('js') })
  // .pipe(sourcemaps.init())
	// .pipe(babel({
	// 	presets: [ '@babel/env' ]
	// }))
  // .pipe(concat('module.all.js'))
	// .pipe(uglify())
  // .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(dist_assets_folder + 'js'))
	.pipe(browserSync.stream());
});

gulp.task('jsall', () => {
  return gulp.src([ src_assets_folder + 'jsall/*.js' ], { since: gulp.lastRun('jsall') })
    .pipe(plumber())
    .pipe(webpack({
      mode: 'production'
    }))
    .pipe(sourcemaps.init())
      .pipe(babel({
        presets: [ '@babel/env' ]
      }))
      .pipe(concat('all.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'jsall'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src([ src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|ico)' ], { since: gulp.lastRun('images') })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist_assets_folder + 'images'))
    .pipe(browserSync.stream());
});

gulp.task('svg', () => {
  return gulp.src([ src_assets_folder + 'images/**/*.svg' ], { since: gulp.lastRun('svg') })
    .pipe(gulp.dest(dist_assets_folder + 'images'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
  return gulp.src([ src_assets_folder + 'fonts/**/*.+(eot|otf|svg|ttf|woff|woff2)' ], { since: gulp.lastRun('fonts') })
    .pipe(gulp.dest(dist_assets_folder + 'fonts'))
    .pipe(browserSync.stream());
});

gulp.task('json', () => {
	return gulp.src([ src_assets_folder + 'data/**/*.json' ], { since: gulp.lastRun('json') })
	.pipe(gulp.dest(dist_assets_folder + 'data'))
	.pipe(browserSync.stream());
});

gulp.task('vendor', () => {
  if (node_dependencies.length === 0) {
    return new Promise((resolve) => {
      console.log("No dependencies specified");
      resolve();
    });
  }

  return gulp.src(node_dependencies.map(dependency => node_modules_folder + dependency + '/**/*.*'), {
    base: node_modules_folder,
    since: gulp.lastRun('vendor')
  })
    .pipe(gulp.dest(dist_node_modules_folder))
    .pipe(browserSync.stream());
});

gulp.task('build', gulp.series('clear', 'html', 'ejs', 'sass', 'less', 'stylus', 'js', 'jsall', 'json', 'images', 'svg', 'fonts', 'vendor'));
gulp.task('dev', gulp.series('html', 'ejs', 'sass', 'less', 'stylus', 'js', 'jsall', 'json'));
gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: [ 'dist' ]
    },
    port: 3000,
    open: false
  });
});

gulp.task('watch', () => {
  const watchImages = [
    src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)'
  ];

  const watchVendor = [];

  node_dependencies.forEach(dependency => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  const watch = [
    src_folder + '**/*.html',
    src_folder + '**/*.ejs',
    src_assets_folder + 'sass/**/*.sass',
    src_assets_folder + 'scss/**/*.scss',
    src_assets_folder + 'less/**/*.less',
    src_assets_folder + 'stylus/**/*.styl',
    src_assets_folder + 'js/**/*.js',
    src_assets_folder + 'jsall/*.js',
    src_assets_folder + 'data/*.json',
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
  gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload);
  gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});