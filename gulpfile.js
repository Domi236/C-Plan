var syntax        = 'scss', // Syntax: sass oder scss;
		gulpversion   = '4'; // Gulp version: 3 oder 4

var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		babel         = require('gulp-babel');
		browserify    = require('gulp-browserify');

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional., beim Debuggen auskommentieren
	.pipe(gulp.dest('app/css'))
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/js/common.js', // Immer am Ende
		])
	.pipe(concat('scripts.min.js'))
		.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(browserify({
		insertGlobals : true,
		debug : !gulp.env
	  }))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
});  

if (gulpversion == 3) {
	gulp.task('watch', ['styles', 'scripts'], function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
		gulp.watch('app/*.html', ['code'])
	});
	gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
	gulp.task('watch', function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
		gulp.watch('app/*.html', gulp.parallel('code'))
	});
	gulp.task('default', gulp.parallel('styles', 'scripts', 'watch'));
}
