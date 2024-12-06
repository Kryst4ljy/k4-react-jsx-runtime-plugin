const RPX_REG = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rpx/g;
const __viewport_width__ = 750;
const unitPrecision = 4;

const CustomMap = /*#__PURE__*/ (function () {
  function CustomMap() {
    this.__store = {};
  }

  var _proto = CustomMap.prototype;

  _proto.set = function set(key, value) {
    this.__store[key + '_' + typeof key] = value;
  };

  _proto.get = function get(key) {
    return this.__store[key + '_' + typeof key];
  };

  _proto.has = function has(key) {
    return Object.prototype.hasOwnProperty.call(this.__store, key + '_' + typeof key);
  };

  return CustomMap;
})();

function cached(fn) {
  var cache = new CustomMap();
  return function cachedFn() {
    var key = arguments.length <= 0 ? undefined : arguments[0];
    if (!cache.has(key)) cache.set(key, fn.apply(void 0, arguments));
    return cache.get(key);
  };
}

function isRpx(str) {
  return typeof str === 'string' && RPX_REG.test(str);
}

var toFixed = function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1);
  var wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}; // Dedault decimal px transformer.

var convertUnit = cached(function (value) {
  return isRpx(value) ? calcRpx(value) : value;
});

function getViewportWidth() {
  return __viewport_width__;
}

var decimalVWTransformer = function decimalVWTransformer(rpx, $1) {
  return $1 ? toFixed(parseFloat(rpx) / (getViewportWidth() / 100), unitPrecision) + 'vw' : rpx;
}; // Default 1 rpx to 1 px

function calcRpx(str) {
  return str.replace(RPX_REG, decimalVWTransformer);
}

export { convertUnit };
