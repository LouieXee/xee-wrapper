import xeeUtils from 'xee-utils';
import jQuery from 'jquery';

const {Base, Events} = xeeUtils;

const $ = jQuery;

const DEFAULT_SHOW_CLASSNAME = 'show';
const DEFAULT_HIDE_CLASSNAME = 'hide';

const TYPE_SHOW = 1;
const TYPE_HIDE = 2;

/*
    @constructor Wrapper
    @params {Element} ele
    @params {Object} opt
    @params {String} [optional] opt.showClassName 默认值为 show
    @params {String} [optional] opt.hideClassName 默认值为 hide
    @params {Boolean | Function} [optional] opt.showDetect 是否需要监听显示结束事件 默认值为 true
    @params {Boolean | Function} [optional] opt.hideDetect 是否需要监听隐藏结束事件 默认值为 true
*/
export default class Wrapper extends Base {

    constructor (ele, opt = {}) {
        if (!jQuery) {
            console.log('xee-wrapper 依赖于 jquery.js, 请提前载入该模块!');
            return false;
        }

        super();

        this.ele = $(ele);

        this.__showClassName__ = opt.showClassName || DEFAULT_SHOW_CLASSNAME;
        this.__hideClassName__ = opt.hideClassName || DEFAULT_HIDE_CLASSNAME;
        this.__callbacksArr__ = [];

        this.__bindListeners__(opt.showDetect, opt.hideDetect);
    }

    __bindListeners__ (showDetect = true, hideDetect = true) {
        let _this = this;

        this.__events__ = new Events();

        if (!!xeeUtils.TRANSITION_NAME && !!xeeUtils.ANIMATION_NAME) {
            this.__events__
                .on('applyShowAfter', _getListener(showDetect, TYPE_SHOW))
                .on('applyHideAfter', _getListener(hideDetect, TYPE_HIDE))

            this.ele
                .on('transitionend', _applyCallbacks)
                .on('animationend', _applyCallbacks)

            function _applyCallbacks (e) {
                let temp = _this.__callbacksArr__[0];

                if (temp && temp.test(e)) {
                    temp.callback();
                    _this.__callbacksArr__.shift();
                }
            }

            function _getListener (target, type) {
                if (xeeUtils.isFunction(target)) {
                    // 如果传入方法，则校验该方法，校验通过则调用回单函数
                    return function (callback) {
                        _this.__callbacksArr__.push({
                            test: target,
                            callback: callback
                        })
                    };
                } else if (xeeUtils.isBoolean(target) && target) {
                    // 如果传入布尔值为真，则校验默认方法，校验通过则调用回单函数
                    let className = type == TYPE_SHOW ? _this.__showClassName__ : _this.__hideClassName__;

                    return function (callback) {
                        _this.__callbacksArr__.push({
                            test: function (e) {
                                let $target = $(e.target);

                                if (e.target === _this.ele[0] && $target.hasClass(className)) {
                                    return true;
                                }
                            },
                            callback: callback
                        })
                    };
                }

                // 如果没有传入或者传入值为布尔值为假，则直接调用回调函数
                return function (callback) {
                    callback();
                };
            }
        } else {
            // 不支持transitionend和animationend事件，则直接调用回调函数
            this.__events__
                .on('applyShowAfter', callback => {
                    callback();
                })
                .on('applyHideAfter', callback => {
                    callback();
                })
        }

    }

    show (opt = {}) {
        this.__callbacksArr__ = [];

        const before = xeeUtils.isFunction(opt.before) ? opt.before.bind(this) : _beforeCallback;
        const after = xeeUtils.isFunction(opt.after) ? opt.after.bind(this) : xeeUtils.noop;

        before(() => {
            this.ele.removeClass(this.__hideClassName__).addClass(this.__showClassName__);

            this.__events__.emit('applyShowAfter', after);
        })
    }

    hide (opt = {}) {
        this.__callbacksArr__ = [];

        const before = xeeUtils.isFunction(opt.before) ? opt.before.bind(this) : _beforeCallback;
        const after = xeeUtils.isFunction(opt.after) ? opt.after.bind(this) : xeeUtils.noop;

        before(() => {
            this.ele.removeClass(this.__showClassName__).addClass(this.__hideClassName__);
                
            this.__events__.emit('applyHideAfter', after);
        })
    }

}

function _beforeCallback (done) {
    return done();
}
