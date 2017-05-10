'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _package = require('../package.json');

var _Wrapper = require('./Wrapper');

var _Wrapper2 = _interopRequireDefault(_Wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Wrapper2.default.version = _package.version;

exports.default = _Wrapper2.default;
module.exports = exports['default'];