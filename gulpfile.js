const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const path = require("path");
const cssNano = require("gulp-cssnano");
const gulpRev = require("gulp-rev");
const uglfiy = require("gulp-uglify");
const del = require("del")

gulp.task("min-css",function(){
    return gulp.src("./public/scss/**/*.scss")
    .pipe(sass())
    .pipe(cssNano())
    .pipe(gulp.dest("./public/assets/css"))
    .pipe(gulpRev())
    .pipe(gulp.dest("./public/hashed/css"))
    .pipe(gulpRev.manifest({
        merge:true,
        // cwd:"public"
    }))
    .pipe(gulp.dest("./"))
})

gulp.task("min-js",function(done){
    gulp.src("./public/js/**/*.js")
    .pipe(uglfiy())
    .pipe(gulp.dest("./public/assets/js"))
    .pipe(gulpRev())
    .pipe(gulp.dest("./public/hashed/js"))
    .pipe(gulpRev.manifest({
        merge:true
    }))
    .pipe(gulp.dest("./"));
    done();
})

gulp.task("clean:assets",function(done){
    del.sync("./public/assets/css");
    del.sync("./public/assets/js");
    del.sync("./public/hashed/css");
    del.sync("./public/hashed/js");
    done();
})

gulp.task("build",gulp.series("clean:assets","min-css","min-js"),function(done){
    console.log("Building Assets");
    done();
})