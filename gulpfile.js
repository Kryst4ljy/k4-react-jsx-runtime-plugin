const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const del = require('del');

const resolve = function (moduleName) {
  return require.resolve(moduleName);
};

const getBabelConfig = function () {
  const plugins = [[resolve('@babel/plugin-transform-runtime')]];
  return {
    presets: [resolve('@babel/preset-react'), [resolve('@babel/preset-env')]],
    plugins,
  };
};

// 清空打包产物
gulp.task('clean', async function () {
  await del('lib');
  await del('es');
  await del('dist');
});

// 输出 commonjs 产物 -> lib
gulp.task('cjs', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    module: 'CommonJS',
  });
  const babelConfig = getBabelConfig();

  return tsProject.src().pipe(tsProject()).pipe(babel(babelConfig)).pipe(gulp.dest('lib/'));
});

// 输出 esmodule 产物 -> es
gulp.task('es', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    module: 'ESNext',
  });
  return tsProject.src().pipe(tsProject()).pipe(babel()).pipe(gulp.dest('es/'));
});

// 输出 .d.ts -> es & lib
gulp.task('declaration', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    declaration: true,
    emitDeclarationOnly: true,
  });
  return tsProject.src().pipe(tsProject()).pipe(gulp.dest('es/')).pipe(gulp.dest('lib/'));
});
