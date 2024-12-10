const { transformInclude } = require('./src/utils');

class ReactJSXTransferPlugin {
  mode = 'production';
  runtime = '';

  constructor(options = {}) {
    const { mode, runtime } = options;

    if (['production', 'development'].includes(mode)) {
      this.mode = mode;
    }

    if (['automatic', 'classic'].includes(runtime)) {
      this.runtime = runtime;
    }
  }

  apply(compiler) {
    // jsx-runtime
    if (this.runtime !== 'automatic') {
      console.log('当前react版本不支持jsx-runtime');
      return;
    }

    const { options } = compiler;

    // add jsx-runtime loader
    const runtimeOption = {
      test: transformInclude,
      use: {
        loader: require.resolve('./src/loader/compilationLoader'),
        options: {
          mode: this.mode,
        },
      },
    };
    options.module.rules.push(runtimeOption);
  }
}

module.exports = ReactJSXTransferPlugin;
