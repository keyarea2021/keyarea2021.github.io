var gulp = require('gulp');
var pleeease = require('gulp-pleeease');//CSSのベンダープレフィックスの付与、圧縮、メディアクエリを一つにまとめる等
var plumber = require('gulp-plumber');//エラーが出た時に止めないため
var sass = require('gulp-sass');
var autoprefixer = require( 'gulp-autoprefixer' );//プリフィックスをいい感じにつけてくれます
var sourcemaps   = require( 'gulp-sourcemaps' );//ソースマップを作ってくれるやつ
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var htmlhint = require("gulp-htmlhint");
var progeny = require("gulp-progeny");//パーシャルしたSCSSファイルを変更して保存した際にも親SCSSファイルをコンパイルするようにしています



gulp.task('default', function(callback) {//defaultって打ったらやってほしいタスク名をここに書いてるっぽい
runSequence('sass', 'browserSync', 'watch' , callback);
});

gulp.task('sass', function() {//sassがタスク名
return gulp.src([ 'scss/*.scss', '!_scss/_*.scss'])//参照するコードの場所を指定
.pipe(plumber())//エラーが発生してもタスクを止めない
.pipe(sass({//ここでSassコンパイルを行う
outputStyle:'expanded'//outputStyleでコンパイルした後の形式を設定することができます。
}))
.pipe(autoprefixer({//最新ブラウザ2バージョン、iOS8.1以上、Android4.4以上に必要なものをつけてもらうようにしています。
browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
cascade: false
}))
.pipe(gulp.dest('./css/'));//処理が終了したCSSファイルを場所を指定して書き出します。
});

gulp.task('browserSync', function() {
return browserSync.init({
server: {
baseDir: 'htdocs/'
}
});
});

gulp.task('reload', browserSync.reload);

gulp.task('watch', function() {
gulp.watch(['_scss/**/*.scss'], ['sass']);
gulp.watch(['htdocs/**/*.+(jpg|jpeg|png|gif|svg)'], ['reload']);
gulp.watch('htdocs/**/*.html').on('change',function(e){
gulp.src(e.path)
.pipe(htmlhint())
.pipe(htmlhint.reporter()
)
});
gulp.watch('htdocs/**/*.+(html|css|js)').on('change', browserSync.reload);
});
