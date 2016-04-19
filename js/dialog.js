/*
* @Author: tengfeisu
* @Date:   2016-04-19 10:58:10
* @Last Modified by:   tengfeisu
* @Last Modified time: 2016-04-19 14:35:27
*/

 'use strict';

    var HTML = '<div class="ui-dialog-header" data-id="header">' +
        '<div class="ui-dialog-title" data-id="title"></div>' +
        '<button class="ui-dialog-close" data-id="closeBtn" title="关闭">×</button>' +
        '</div>' +
        '<div class="ui-dialog-body">' +
        '<div class="ui-dialog-content" data-id="content"></div>' +
        '</div>' +
        '<div class="ui-dialog-footer" data-id="footer">' +
        '<div class="ui-dialog-button">' +
        '<button type="button" data-id="ok"></button>' +
        '<button type="button" data-id="cancel"></button>' +
        '</div>' +
        '</div>';

    var CONFIG = {
        'id': '',
        'z-index': 999,
        'ok': null, //确定按钮回调
        'cancel': null, //取消按钮回调
        'title': '提示信息', //标题
        'content': '', //内容
        'okTxt': '确 定', //确定按钮文字
        'cancelTxt': '取 消', //取消按钮文字
        'showCancel': true, //显示取消按钮
        'customClass': '', //自定义class
        'outerClose': false, //是否允许点击外部遮罩层关闭
        'showHeaderBar': true, //是否显示标题栏
        'showFooterBar': true, //是否显示底部按钮栏
        'showCover': false, //是否使用遮罩层
        'coverBgColor': 'rgba(0, 0, 0, .2)', //遮罩层颜色及透明度
        'cssUrl': '' //控件css文件路径，留空则需自行加载
    };

    var COUNT = 0;

    function MDialog(settings) {
        var options = $.extend({},CONFIG);
        if (settings.length === 1 && typeof settings[0] === 'object') {
            options = $.extend(CONFIG, settings[0]);
        } else {
            if (settings[0] && typeof settings[0] === 'string') {
                options.content = settings[0];
            }
            if (settings[1] && typeof settings[1] === 'function') {
                options.ok = settings[1];
            }
            if (settings[2] && typeof settings[2] === 'function') {
                options.cancel = settings[2];
            }
            if (settings.length < 3) {
                options.showCancel = false;
            }
            if (settings.length < 2) {
                options.showFooterBar = false;
            }
        }

        if(options.cssUrl){
            this.loadCss(options.cssUrl);
        }

        this.$D = null;
        this.$C = null;

        this.createDom(options);
    }

    MDialog.prototype = {
        createDom: function(options) {
            var id = options.id || 'mDialog-' + Date.parse(new Date()) + '-' + COUNT++;
            this.$D = $('<div class="ui-dialog" id="' + id + '-d" style="display:none"></div>').html(HTML);
            this._$('title').text(options.title);
            this._$('content').html(options.content);

            if (options.showCover) {
                this.$C = $('<div class="ui-dialog-mask" id="' + id + '-c" style="display:none"></div>');
                options.coverBgColor && this.$C.css('background-color', options.coverBgColor);
            }

            if (options['z-index'] !== 999) {
                this.$D.css('z-index', options['z-index']);
                this.$C && this.$C.css('z-index', options['z-index'] - 1);
            }

            if (options.customClass) {
                this.$D.addClass(options.customClass);
            }

            if (!options.showHeaderBar) {
                this._$('header').hide();
            }

            if (!options.showFooterBar) {
                this._$('footer').hide();
            } else {
                this.createBtn(options);
            }

            this.closeEvt(options);

            $('body').append(this.$D, this.$C);
        },
        createBtn: function(options) {
            this._$('ok').text(options.okTxt);
            this._$('cancel').text(options.cancelTxt);
            if (options.ok && typeof options.ok === 'function') {
                this._$('ok').on('click', options.ok.bind(this));
            }
            if (!options.showCancel) {
                this._$('cancel').hide();
            } else {
                if (options.cancel && typeof options.cancel === 'function') {
                    this._$('cancel').on('click', options.cancel.bind(this));
                }
                this._$('cancel').on('click', this.close.bind(this));
            }
        },
        closeEvt: function(options) {
            if (options.showHeaderBar) {
                this._$('closeBtn').on('click', this.close.bind(this));
            }
            if (options.outerClose) {
                this.$C.on('click', this.close.bind(this));
                this.$D.on('click', function(event) {
                    event.stopPropagation();
                });
            }
        },
        loadCss: function(cssUrl) {
            $('head').append('<link rel="stylesheet" href="' + cssUrl + '" />');
        },
        show: function() {
            this.$D.show();
            this.$C && this.$C.show();
            return this;
        },
        close: function() {
            this.$D.hide();
            this.$C && this.$C.hide();
            return this;
        },
        remove: function() {
            this.$D.remove();
            this.$C && this.$C.remove();
        },
        _$: function(ele) {
            return this.$D.find('[data-id=' + ele + ']');
        }
    };

    var entry = function() {
        return new MDialog(arguments);
    };

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(function() {
            return entry;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = entry;
    } else {
        window.dialog = entry;
    }