webpackHotUpdate(0,[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NComps_1 = __webpack_require__(1);
exports.NComps = NComps_1.NComps;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Components
var ui_main_1 = __webpack_require__(2);
var InitComp = /** @class */ (function () {
    function InitComp() {
    }
    Object.defineProperty(InitComp, "Instance", {
        get: function () {
            // Do you need arguments? Make it a regular method instead.
            return this._instance || (this._instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    InitComp.prototype.init = function (el, mode) {
        if (mode === void 0) { mode = false; }
        if (!el)
            return;
        // decides wheather or not we replace entry div. Only possible in entry Comp
        if (mode)
            el.innerHTML = '';
        this.entryComponent = new ui_main_1.MainUI(el, { planet: 'Planet Earth' });
        this.entryComponent.add();
    };
    return InitComp;
}());
exports.InitComp = InitComp;
exports.NComps = InitComp.Instance;
// module works as NPM already. Let's add to window as well (easier to use on HTML scripts)
window.NComps = exports.NComps;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_component_1 = __webpack_require__(3);
var ui_test_1 = __webpack_require__(7);
// import template from 'template.html!text'
//var template = '<div><h1>RSS main</h1><p>This is our planet: {{planet}}</p></div>';
// https://stackoverflow.com/questions/40296692/typescript-2-0-and-webpack-importing-of-html-as-string
var ui_main_html_1 = __webpack_require__(10);
var ui_main_scss_1 = __webpack_require__(11);
var MainUI = /** @class */ (function (_super) {
    __extends(MainUI, _super);
    function MainUI(el, data) {
        var _this = _super.call(this, ui_main_html_1.default, ui_main_scss_1.default, el, data, [ui_test_1.TestUI], false) || this;
        _this.oppened = false;
        _this.styles = {};
        _this.name = "Willy";
        _this.index = 1;
        _this.addData(_this);
        _this.add();
        return _this;
    }
    MainUI.prototype.update = function () {
        this.addData(this); // to update variables
        this.reGen();
        // this one has an 'oppened' flag
        if (this.oppened)
            this.show();
        else
            this.hide();
    };
    MainUI.prototype.close = function () {
        this.hide();
        this.oppened = false;
    };
    MainUI.prototype.changeName = function () {
        this.name = 'Nuno';
        this.update();
    };
    MainUI.prototype.changePlanet = function () {
        this['planet'] = 'Earth N.' + this.index;
        this.index++;
        this.update();
    };
    MainUI.prototype.wrapped = function () {
        return function (text, render) {
            return "<b>" + text + "</b>";
        }.bind(this);
    };
    return MainUI;
}(base_component_1.BaseComponent));
exports.MainUI = MainUI;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hogan = __webpack_require__(4);
var BaseComponent = /** @class */ (function () {
    /**
     * This is the constructor of a Component.
     * @param template this is the html template
     * @param css this is the css/scss file
     * @param el element to inject component
     * @param data any data
     * @param childComponentClasses any child component classes to be used
     * @param mode whether or not the component will be generated right away
     */
    function BaseComponent(template, css, el, data, childComponentClasses, mode) {
        if (childComponentClasses === void 0) { childComponentClasses = []; }
        if (mode === void 0) { mode = false; }
        this.el = el;
        this.data = data;
        this.childComponentClasses = childComponentClasses;
        this.uuid = this.uuidv4();
        this.functions = {};
        this.components = [];
        this.created = false;
        this.preProcessHTML(template, css);
        // check if mode is true (forcing the addition of the component right away)
        if (mode) {
            this.add();
        }
        this.register();
    }
    /**
     * We need to access Component later, through window
     */
    BaseComponent.prototype.register = function () {
        if (window['NComps']) {
            window['NComps'][this.uuid] = this;
            return;
        }
        else {
            window['NComps'] = [];
            this.register();
        }
    };
    BaseComponent.prototype.unregister = function () {
        if (window['NComps']) {
            delete window['NComps'][this.uuid];
        }
    };
    BaseComponent.prototype.delete = function () {
        this.remove();
        this.el.remove;
        this.unregister();
        if (this['unbind'] && typeof this['unbind'] == 'function') {
            this['unbind']();
        }
    };
    BaseComponent.prototype.preProcessHTML = function (t, css) {
        // first, let's grab functions and populate to data
        this.getFunctionsFromTemplate(t);
        // this.getChildComponentsAndInitThem(t);
        var template = this.indent(t);
        this.template = '<div class="' + this.classes + '">\n' +
            template + '\n' +
            '</div>\n' +
            '<style>' + this.preProcessCSS(css) + '</style>\n';
        // compile template
        this.hoganTemplate = hogan.compile(this.template);
    };
    BaseComponent.prototype.preProcessCSS = function (css) {
        return this.replaceAll(css, '.component', "#rss-injected-" + this.uuid + " ." + this.className + '-component');
    };
    /**
     * Let functions work on template
     * @param fnct
     */
    BaseComponent.prototype.getFunction = function (fnct) {
        var _this = this;
        return function () {
            return function (text, render) {
                return "window['NComps']['" + this.uuid + "']." + fnct;
            }.bind(_this);
        };
    };
    BaseComponent.prototype.getFunctionsFromTemplate = function (t) {
        var functs;
        functs = this.getStartingWith(this.getInterpolations(t), 'functions.');
        for (var i in functs) {
            this.functions[functs[i]] = this.getFunction(functs[i]);
        }
    };
    BaseComponent.prototype.component = function () {
        return function (compClass) {
            // console.log('yup', this.components, compClass);
            // we get new compClass
            // create div
            var div = document.createElement("div");
            var compDiv = document.createElement("div");
            var found = false;
            var _loop_1 = function () {
                if (comp.name == compClass) {
                    found = true;
                    // console.log('Hey! class ' + compClass + ' exists');
                    var component_1 = new comp(compDiv, {});
                    this_1.components.push(component_1);
                    // DOM is not yet activated!
                    setTimeout(function () {
                        component_1.el = document.getElementById("rss-injected-" + component_1.uuid);
                        component_1.setComponentEl();
                    });
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.childComponentClasses; _i < _a.length; _i++) {
                var comp = _a[_i];
                _loop_1();
            }
            div.appendChild(compDiv);
            if (found) {
                return div.innerHTML;
            }
            console.error('Please import ' + compClass);
            return "<p style=\"color: red;font-weight: bold;border: 1px solid red;\">Component "
                + compClass + " not found.</p>";
        }.bind(this);
    };
    /**
     * This function retrieves all {{ content }} from template
     * @param t template
     */
    BaseComponent.prototype.getInterpolations = function (t) {
        var matches;
        var result = t.match(/{{(.*?)}}/g);
        if (result)
            matches = result;
        else
            matches = [];
        return matches.join(' ');
    };
    BaseComponent.prototype.getStartingWith = function (s, search) {
        var items;
        if (search === '{{') {
            items = s.match(/{{[a-z\d| |.|(|)|"|'|,]+/ig);
        }
        else if (search === 'functions.') {
            items = s.match(/functions.[a-z\d| |.|(|)|"|'|,]+/ig);
        }
        else if (search === 'components.') {
            items = s.match(/components.[a-z\d| |.|(|)|"|'|,]+/ig);
        }
        // other stuff here
        for (var i in items) {
            items[i] = items[i].replace(search, '').trim();
        }
        return items;
    };
    /**
     * Let's create data variable for access from templates
     */
    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    BaseComponent.prototype.merge_options = function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    };
    BaseComponent.prototype.addData = function (data) {
        this.data = this.merge_options(this.data, data);
        this.data['functions'] = this.functions;
        this.data['comp'] = this.component;
    };
    BaseComponent.prototype.setComponentEl = function (force) {
        if (force === void 0) { force = false; }
        // only if this.componentEl exists AND force is false
        if (this.componentEl && !force)
            return;
        this.componentEl = document.getElementsByClassName(this.className + '-component ' + this.uuid)[0];
    };
    BaseComponent.prototype.reGen = function () {
        // get com id #rss-injected-[UUID]
        var el = document.getElementById('rss-injected-' + this.uuid);
        el.innerHTML = this.hoganTemplate.render(this.data);
        // console.log(this.hoganTemplate);
        this.setComponentEl(true);
    };
    /**
     * INSERT and REMOVE
     */
    BaseComponent.prototype.add = function () {
        if (this.created)
            return;
        this.el.innerHTML += '<div id="rss-injected-' + this.uuid + '">'
            + this.hoganTemplate.render(this.data) + '</div>';
        this.setComponentEl();
        this.created = true;
    };
    BaseComponent.prototype.remove = function () {
        if (this.created) {
            console.log('Remove');
            // delete it
            this.setComponentEl();
            this.componentEl.remove;
            // this.el.removeChild( this.componentEl );
        }
        this.created = false;
    };
    BaseComponent.prototype.show = function () {
        this.setComponentEl();
        this.addClass(this.componentEl, 'oppened');
    };
    BaseComponent.prototype.hide = function () {
        this.setComponentEl();
        this.removeClass(this.componentEl, 'oppened');
    };
    Object.defineProperty(BaseComponent.prototype, "className", {
        /**
         * Getters and Setters
         */
        get: function () {
            return this.constructor.toString().match(/\w+/g)[1].toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseComponent.prototype, "classes", {
        get: function () {
            return this.className + '-component ' + this.uuid;
        },
        enumerable: true,
        configurable: true
    });
    // UTILITIES
    BaseComponent.prototype.uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    BaseComponent.prototype.indent = function (t) {
        var templateArray = t.split('\n');
        var newArray = [];
        for (var _i = 0, templateArray_1 = templateArray; _i < templateArray_1.length; _i++) {
            var line = templateArray_1[_i];
            newArray.push('    ' + line);
        }
        return newArray.join('\n');
    };
    BaseComponent.prototype.replaceAll = function (string, search, replacement) {
        return string.replace(new RegExp(search, 'g'), replacement);
    };
    ;
    // DOM UTILITIES ===========================================================
    // CLASSES
    BaseComponent.prototype.addClass = function (element, className) {
        if (!element || !className)
            return;
        if (element.classList) {
            element.classList.add(className);
        }
        else {
            var arr = element.className.split(" ");
            if (arr.indexOf(name) == -1) {
                element.className += " " + className;
            }
        }
    };
    BaseComponent.prototype.toggleClass = function (element, className) {
        if (element) {
            if (element.classList) {
                element.classList.toggle(className);
            }
            else {
                // For IE9
                var classes = element.className.split(" ");
                var i = classes.indexOf(className);
                if (i >= 0)
                    classes.splice(i, 1);
                else
                    classes.push(className);
                element.className = classes.join(" ");
            }
        }
    };
    BaseComponent.prototype.removeClass = function (element, className) {
        if (element) {
            if (element.classList) {
                element.classList.remove(className);
            }
            else {
                element.className = element.className.replace(new RegExp(className, 'g'), "");
            }
        }
    };
    return BaseComponent;
}());
exports.BaseComponent = BaseComponent;


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_component_1 = __webpack_require__(3);
// import template from 'template.html!text'
//var template = '<div><h1>RSS main</h1><p>This is our planet: {{planet}}</p></div>';
// https://stackoverflow.com/questions/40296692/typescript-2-0-and-webpack-importing-of-html-as-string
var ui_test_html_1 = __webpack_require__(8);
var ui_test_scss_1 = __webpack_require__(9);
var TestUI = /** @class */ (function (_super) {
    __extends(TestUI, _super);
    function TestUI(el, data) {
        var _this = _super.call(this, ui_test_html_1.default, ui_test_scss_1.default, el, data, [], false) || this;
        _this.oppened = false;
        _this.addData(_this);
        _this.add();
        _this.show();
        return _this;
        // setTimeout(() => this.toggle(), 0)
    }
    TestUI.prototype.toggle = function () {
        if (this.oppened) {
            this.hide();
            this.oppened = false;
        }
        else {
            this.show();
            this.oppened = true;
        }
    };
    return TestUI;
}(base_component_1.BaseComponent));
exports.TestUI = TestUI;


/***/ })
])