const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cssnano = require('gulp-cssnano');
const del = require('del');
const eslint = require('gulp-eslint');
const extReplace = require('gulp-ext-replace');
const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const onError = (error) => {
  // Create desktop notifications.
  notify.onError({
    title: error.name,
    message: '<%= error.message %> (<%= error.fileName %>:<%= error.lineNumber %>)',
    emitError: true,
  })(error);

  this.emit('end');
};

gulp.task('clean', () => del('./dist/*'));

// Copy images.
gulp.task('images', () => gulp
    .src(['./img/**/*'])
    .pipe(gulp.dest('./dist/images/')));

// Copy font files.
gulp.task('font', () => gulp
    .src(['./font/**/*'])
    .pipe(gulp.dest('./dist/font/')));

// Copy xml files.
gulp.task('xml', () => gulp
    .src('./xml/**/*')
    .pipe(gulp.dest('./dist/xml/')));

// Compile SCSS.
gulp.task('scss', () => gulp.src(
    [
      './scss/main.scss',
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
      ],
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/')));

// ESLint.
gulp.task('eslint', () => gulp
    .src(['./js/**/*.js'])
    .pipe(plumber({ errorHandler: onError }))
    .pipe(eslint({
      configFile: '.eslintrc.json',
    }))
    .pipe(eslint.format()));

// Compile JS.
gulp.task('js', () => gulp
    .src('./js/**/*.js')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(uglify())
    .pipe(extReplace('.js', '.es6.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/')));

// Copy JS files.
gulp.task('vendor-js', () => gulp
    .src([
    ])
    .pipe(gulp.dest('./dist/js/')));

// Copy CSS files.
gulp.task('vendor-css', () => gulp
    .src([
    ])
    .pipe(gulp.dest('./dist/css/')));

gulp.task('sass-lint', () => gulp.src('./scss/**/*.scss')
    .pipe(sassLint({
      rules: {
        'no-css-comments': 0,
        'variable-name-format': 0,
        'force-element-nesting': 0,
        'class-name-format': 0,
      },
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError()));

gulp.task('watch', () => {
  gulp.watch('./xml/**/*.xml', ['xml']);
  gulp.watch('./scss/**/*.scss', ['scss']);
  gulp.watch('./js/**/*.js', ['js']);
});

gulp.task('default', ['images', 'font', 'xml', 'scss', 'js', 'vendor-js', 'vendor-css', 'watch']);
