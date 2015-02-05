var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var underscore = require('underscore');
var underscoreStr = require('underscore.string');

var bower_deploy = [
    'standard-animation',
    'standard-boilerplate',
    'standard-controls',
    'standard-data',
    'standard-metrics',
    'space'
];

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('deploy-bower-scripts', function() {
    var bowerFile = require('./bower.json');
    var bowerDir = './bower_components';
    var outDir = './www/lib';
    underscore.each(bowerFile.dependencies, function(value, bowerName) {
        var srcBowerDir = bowerDir + '/' + bowerName + '/';
        var srcBowerFile = require(srcBowerDir + 'bower.json');
        var main = srcBowerFile.main;
        var srcPaths = [];
        if(underscore.isArray(main)) {
            underscore.each(main, function(path) {
                if(underscoreStr.endsWith(path, '.js')) {
                    srcPaths.push(path);
                }
            });
        }
        else {
            if(underscoreStr.endsWith(main, '.js')) {
                srcPaths.push(main);
            }
        }
        underscore.each(srcPaths, function(path) {
            var outputPath = outDir + '/' + bowerName;
            gulp.src(srcBowerDir + path).pipe(gulp.dest(outputPath));
        });
    });
});


gulp.task('deploy-bower-templates', function() {
    var bowerFile = require('./bower.json');
    var bowerDir = './bower_components';
    var outDir = './www/templates';
    underscore.each(bowerFile.dependencies, function(value, bowerName) {
        var srcBowerDir = bowerDir + '/' + bowerName + '/';
        var srcBowerFile = require(srcBowerDir + 'bower.json');
        var main = srcBowerFile.main;
        var srcPaths = [];
        if(underscore.isArray(main)) {
            underscore.each(main, function(path) {
                if(underscoreStr.endsWith(path, '.html')) {
                    srcPaths.push(path);
                }
            });
        }
        else {
            if(underscoreStr.endsWith(main, '.html')) {
                srcPaths.push(main);
            }
        }
        underscore.each(srcPaths, function(path) {
            gulp.src(srcBowerDir + path).pipe(gulp.dest(outDir));
        });
    });
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('bower', function(cb) {
    bower.commands.install([], {save: true}, {})
        .on('end', function(installed) {
            cb();
        })
});



/* dont work idk */
gulp.task('components', function () {
    var target = gulp.src('./www/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./www/components/**/*.js', './www/components/**/*.css'], {read: false});

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./www'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
