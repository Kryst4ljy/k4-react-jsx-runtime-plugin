const swc = require('@swc/core');
const { formatId } = require('../utils/index');
const { merge } = require('lodash');

module.exports = async function compilationLoader(source, map) {
  const options = this.getOptions();
  const callback = this.async();
  const { mode } = options;

  const getJsxTransformOptions = ({ suffix, mode }) => {
    const reactTransformConfig = {
      // Swc won't enable fast refresh when development is false in the latest version.
      development: mode === 'development',
      refresh: false,
      runtime: 'automatic',
      importSource: '@k4/jsx-runtime/react', // The exact import source is '@k4/jsx-runtime/react/jsx-runtime'
    };

    const commonOptions = {
      jsc: {
        transform: {
          react: reactTransformConfig,
          legacyDecorator: true,
        },
        // This option will greatly reduce your file size while bundling.
        // This option depends on `@swc/helpers`.
        externalHelpers: true,
        target: 'es2022',
      },
      module: {
        type: 'es6',
        noInterop: false,
      },
    };

    const syntaxFeatures = {
      dynamicImport: true,
      decorators: true,
      privateMethod: true,
      importMeta: true,
      exportNamespaceFrom: true,
    };
    const jsOptions = merge(
      {
        jsc: {
          parser: {
            jsx: true,
            ...syntaxFeatures,
            syntax: 'ecmascript',
          },
        },
      },
      commonOptions
    );

    const tsOptions = merge(
      {
        jsc: {
          parser: {
            tsx: true,
            ...syntaxFeatures,
            syntax: 'typescript',
          },
        },
      },
      commonOptions
    );

    if (suffix === 'jsx') {
      return jsOptions;
    } else if (suffix === 'tsx') {
      return tsOptions;
    }
    return commonOptions;
  };

  const transform = async (source, fileId) => {
    const id = formatId(fileId);
    const suffix = ['jsx', 'tsx'].find((suffix) => new RegExp(`\\.${suffix}?$`).test(id));

    const programmaticOptions = {
      swcrc: false,
      filename: id,
      sourceMaps: false,
    };
    const commonOptions = getJsxTransformOptions({ suffix, mode });

    // auto detect development mode
    if (mode && commonOptions?.jsc?.transform?.react && !Object.prototype.hasOwnProperty.call(commonOptions.jsc.transform.react, 'development')) {
      commonOptions.jsc.transform.react.development = mode === 'development';
    }

    merge(programmaticOptions, commonOptions);

    try {
      const output = await swc.transform(source, programmaticOptions);
      const { code, map } = output;

      return {
        code,
        map,
      };
    } catch (error) {
      // Catch error for unhandled promise rejection.
      if (this) {
        // Handled by unplugin.
        this.error(error);
        return { code: null, map: null };
      } else {
        // Handled by webpack.
        throw error;
      }
    }
  };

  try {
    const result = await transform(source, this.resourcePath);
    if (result) {
      const { code, map } = result;
      callback(null, code, map);
    } else {
      callback(null, source, map);
    }
  } catch (error) {
    callback(error);
  }
};
