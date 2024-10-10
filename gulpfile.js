const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

// Шляхи до файлів
const paths = {
  html: {
    src: 'src/*.html',
    watch: 'src/**/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts/'
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
}

// Серія завдань для зборки
const build = gulp.series(clean, gulp.parallel(html, styles, fonts));
const watch = gulp.series(build, watchFiles);

exports.html = html;
exports.styles = styles;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;