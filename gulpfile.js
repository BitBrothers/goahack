var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');

var jade = require('jade');
var gulpJade = require('gulp-jade');
var katex = require('katex');

var templateCache = require('gulp-angular-templatecache');

jade.filters.katex = katex.renderToString;
jade.filters.shoutFilter = function (str) {
  return str + '!!!!';
}

gulp.task('sass', function() {
  gulp.src('public/stylesheets/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('compress', function() {
  gulp.src([
    'public/vendor/angular.js',
    'public/vendor/*.js',
    'public/app.js',
    'public/services/*.js',
    'public/controllers/*.js',
    'public/filters/*.js',
    'public/directives/*.js'
  ])
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

gulp.task('templates', function() {
  gulp.src('public/views/**/*.html')
    .pipe(templateCache({ root: 'views', module: 'MyApp' }))
    .pipe(gulp.dest('public'));
});

gulp.task('jade', function () {
  return gulp.src('public/templates/*.jade')
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('public/views'))
})

gulp.task('develop', function () {
  nodemon({ script: 'server.js' })
    .on('restart', function () {
      console.log('restarting server')
    })
})

gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.scss', ['sass']);
  gulp.watch('public/templates/*.jade', ['jade']);
  gulp.watch('public/views/**/*.html', ['templates']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/vendor'], ['compress']);
});

gulp.task('default', ['sass', 'jade', 'compress', 'templates', 'develop', 'watch']);