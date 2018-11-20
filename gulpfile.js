var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('default', function(){
    console.log("gulp is running successfully");
});

gulp.task('watch',function(){
    var watcher = gulp.watch('routes/*.js');
    watcher.on('change', function(event){
        console.log('File :' + event.path + " was changed");
    });
});

gulp.task('uglify', function(){
    gulp.src('routes/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('routes1/'));
});