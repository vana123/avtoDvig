const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const replace = require('gulp-replace');

// Шляхи до файлів
const paths = {
  html: {
    src: 'src/*.html',
    watch: 'src/**/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/assets/styles/**/*.scss',
    dest: 'dist/assets/css/'
  },
  fonts: {
    src: 'src/assets/fonts/**/*',
    dest: 'dist/assets/fonts/'
  },
  scripts: {
    src: 'src/assets/scripts/**/*.js',
    dest: 'dist/assets/js/'
  },
  images: {
    src: 'src/assets/images/**/*.{png,jpg,jpeg,gif,svg}',
    dest: 'dist/assets/images/'
  }
};

// Завдання для HTML
function html() {
  return gulp
    .src(paths.html.src)
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file'
      })
    )
    .pipe(replace(/src=['"](?:\.\.\/)+assets\/images\/(.+\.(?:png|jpg|jpeg|gif|svg))['"]/g, 'src="assets/images/$1"'))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Завдання для CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Завдання для шрифтів
function fonts() {
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream());
}

// Завдання для зображень
function images() {
  return gulp
    .src(paths.images.src, { allowEmpty: true })
    .pipe(gulp.dest(paths.images.dest))
    .on('data', function(file) {
      console.log('Копіюється зображення:', file.path);
    })
    .pipe(browserSync.stream());
}

// Завдання для скриптів
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Очищення папки dist
async function clean() {
  const { deleteAsync } = await import('del');
  return deleteAsync(['dist']);
}

// Слідкування за змінами у файлах
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
  gulp.watch(paths.html.watch, html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
}

// Серія завдань для зборки
const build = gulp.series(clean, gulp.parallel(html, styles, fonts, images, scripts));
const watch = gulp.series(build, watchFiles);

exports.html = html;
exports.styles = styles;
exports.fonts = fonts;
exports.images = images;
exports.scripts = scripts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;