const gulp = require('gulp');
const gts = require('gulp-typescript');
const pug = require('gulp-pug');
const OTHER_FILES = ['src/*.json', 'src/**/*.json', 'src/views/*.pug'];

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

gulp.task('watch', ['scripts', 'views'], () => {
  gulp.watch('src/**/*.ts', ['scripts', 'views']);
});

gulp.task('assets', function () {
  return gulp.src(OTHER_FILES)
    .pipe(gulp.dest('dist'));
});
gulp.task('views', function buildHTML() {
  return gulp.src('views/*.pug')
    .pipe(pug({
      // Your options in here.
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);