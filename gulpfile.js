const gulp = require('gulp');
const gts = require('gulp-typescript');
const pug = require('gulp-pug');
const OTHER_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const ts = gts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  return ts
    .src()
    .pipe(ts()).js
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts', 'pug', 'styles'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
  gulp.watch('src/views/*.pug', ['pug']);
  gulp.watch('src/public', ['styles']);
});

gulp.task('assets', function () {
  return gulp.src(OTHER_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('pug', function buildHTML() {
  return gulp.src('src/views/*.pug')
    .pipe(gulp.dest('dist/views'));
});

gulp.task('styles', function buildCSS() {
  return gulp.src('src/public/**/*.css')
    .pipe(gulp.dest('dist/public'));
});

gulp.task('default', ['watch', 'assets']);