'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xeeUtils = require('xee-utils');

var _xeeUtils2 = _interopRequireDefault(_xeeUtils);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = _xeeUtils2["default"].Base,
    Events = _xeeUtils2["default"].Events;


var $ = _jquery2["default"];

var DEFAULT_SHOW_CLASSNAME = 'show';
var DEFAULT_HIDE_CLASSNAME = 'hide';

var TYPE_SHOW = 1;
var TYPE_HIDE = 2;

/*
    @constructor Wrapper
    @params {Element} ele
    @params {Object} opt
    @params {String} [optional] opt.showClassName 默认值为 show
    @params {String} [optional] opt.hideClassName 默认值为 hide
    @params {Boolean | Function} [optional] opt.showDetect 是否需要监听显示结束事件 默认值为 true
    @params {Boolean | Function} [optional] opt.hideDetect 是否需要监听隐藏结束事件 默认值为 true
*/

var Wrapper = function (_Base) {
    _inherits(Wrapper, _Base);

    function Wrapper(ele) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Wrapper);

        if (!_jquery2["default"]) {
            var _ret;

            console.log('xee-wrapper 依赖于 jquery.js, 请提前载入该模块!');
            return _ret = false, _possibleConstructorReturn(_this2, _ret);
        }

        var _this2 = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this));

        _this2.ele = $(ele);

        _this2.__showClassName__ = opt.showClassName || DEFAULT_SHOW_CLASSNAME;
        _this2.__hideClassName__ = opt.hideClassName || DEFAULT_HIDE_CLASSNAME;
        _this2.__callbacksArr__ = [];

        _this2.__bindListeners__(opt.showDetect, opt.hideDetect);
        return _this2;
    }

    _createClass(Wrapper, [{
        key: '__bindListeners__',
        value: function __bindListeners__() {
            var showDetect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var hideDetect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var _this = this;

            this.__events__ = new Events();

            if (!!_xeeUtils2["default"].TRANSITION_NAME && !!_xeeUtils2["default"].ANIMATION_NAME) {
                var _applyCallbacks = function _applyCallbacks(e) {
                    var temp = _this.__callbacksArr__[0];

                    if (temp && temp.test(e)) {
                        temp.callback();
                        _this.__callbacksArr__.shift();
                    }
                };

                var _getListener = function _getListener(target, type) {
                    if (_xeeUtils2["default"].isFunction(target)) {
                        // 如果传入方法，则校验该方法，校验通过则调用回单函数
                        return function (callback) {
                            _this.__callbacksArr__.push({
                                test: target,
                                callback: callback
                            });
                        };
                    } else if (_xeeUtils2["default"].isBoolean(target) && target) {
                        // 如果传入布尔值为真，则校验默认方法，校验通过则调用回单函数
                        var className = type == TYPE_SHOW ? _this.__showClassName__ : _this.__hideClassName__;

                        return function (callback) {
                            _this.__callbacksArr__.push({
                                test: function test(e) {
                                    var $target = $(e.target);

                                    if (e.target === _this.ele[0] && $target.hasClass(className)) {
                                        return true;
                                    }
                                },
                                callback: callback
                            });
                        };
                    }

                    // 如果没有传入或者传入值为布尔值为假，则直接调用回调函数
                    return function (callback) {
                        callback();
                    };
                };

                this.__events__.on('applyShowAfter', _getListener(showDetect, TYPE_SHOW)).on('applyHideAfter', _getListener(hideDetect, TYPE_HIDE));

                this.ele.on('transitionend', _applyCallbacks).on('animationend', _applyCallbacks);
            } else {
                // 不支持transitionend和animationend事件，则直接调用回调函数
                this.__events__.on('applyShowAfter', function (callback) {
                    callback();
                }).on('applyHideAfter', function (callback) {
                    callback();
                });
            }
        }
    }, {
        key: 'show',
        value: function show() {
            var _this3 = this;

            var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.__callbacksArr__ = [];

            var before = _xeeUtils2["default"].isFunction(opt.before) ? opt.before.bind(this) : _beforeCallback;
            var after = _xeeUtils2["default"].isFunction(opt.after) ? opt.after.bind(this) : _xeeUtils2["default"].noop;

            before(function () {
                _this3.ele.removeClass(_this3.__hideClassName__).addClass(_this3.__showClassName__);

                _this3.__events__.emit('applyShowAfter', after);
            });
        }
    }, {
        key: 'hide',
        value: function hide() {
            var _this4 = this;

            var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.__callbacksArr__ = [];

            var before = _xeeUtils2["default"].isFunction(opt.before) ? opt.before.bind(this) : _beforeCallback;
            var after = _xeeUtils2["default"].isFunction(opt.after) ? opt.after.bind(this) : _xeeUtils2["default"].noop;

            before(function () {
                _this4.ele.removeClass(_this4.__showClassName__).addClass(_this4.__hideClassName__);

                _this4.__events__.emit('applyHideAfter', after);
            });
        }
    }]);

    return Wrapper;
}(Base);

exports["default"] = Wrapper;


function _beforeCallback(done) {
    return done();
}
module.exports = exports['default'];