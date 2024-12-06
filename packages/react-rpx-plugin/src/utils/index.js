const path = require('path');

const formatId = (id) => id.split(path.sep).join('/');

const extensionRegex = /\.(jsx?|tsx?|mjs)$/;

const transformInclude = (id) => {
  const formatedId = formatId(id);
  const needCompile = extensionRegex.test(formatedId);
  const skipCompile = /node_modules/.test(id);
  return needCompile && !skipCompile;
};

module.exports = { formatId, transformInclude };
