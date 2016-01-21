import gulp from 'gulp';

import config from '../config';


export function copycss(done) {
  return gulp.src(`${config.src}/vendor/static/*.css`)
    .pipe(gulp.dest(`${config.dist}/styles`));
}

export function copyfonts(done) {
  return gulp.src(`${config.src}/fonts/*.*`)
    .pipe(gulp.dest(`${config.dist}/fonts`));
}


