import * as hogan from 'hogan.js';

export class BaseComponent {
    private hoganTemplate;
    private template: string;
    public uuid: string = this.uuidv4();

    public componentEl: Element;
    functions: object = {};

    private components: any[] = [];

    private created: boolean = false;

    /**
     * This is the constructor of a Component.
     * @param template this is the html template
     * @param css this is the css/scss file
     * @param el element to inject component
     * @param data any data
     * @param childComponentClasses any child component classes to be used
     * @param mode whether or not the component will be generated right away
     */
    constructor(
        template: string, css: string, 
        public el: Element, public data: any,
        private childComponentClasses=[], mode=false
    ) {
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
    register() {
        if (window['NComps']) {
            window['NComps'][this.uuid] = this;
            return;
        }
        else {
            window['NComps'] = [];
            this.register();
        }
    }
    unregister() {
        if (window['NComps']) {
            delete window['NComps'][this.uuid];
        }
    }
    delete() {
        this.remove();
        this.el.remove;
        this.unregister();
        if (this['unbind'] && typeof this['unbind'] == 'function') {
            this['unbind']();
        }
    }

    private preProcessHTML(t: string, css: string): void {
        // first, let's grab functions and populate to data
        this.getFunctionsFromTemplate(t);
        // this.getChildComponentsAndInitThem(t);

        let template: string = this.indent(t);
        this.template = '<div class="' + this.classes + '">\n' +
            template + '\n' +
            '</div>\n' +
            '<style>' + this.preProcessCSS(css) + '</style>\n';
        // compile template
        this.hoganTemplate = hogan.compile(this.template);
    }

    private preProcessCSS(css: string): string {
        return this.replaceAll(css, '.component', "#rss-injected-" + this.uuid + " ." + this.className + '-component');
    }

    
    /**
     * Let functions work on template
     * @param fnct 
     */
    private getFunction(fnct: string) {
        return () => {
            return function(text, render) {
                return "window['NComps']['" + this.uuid + "']." + fnct;
            }.bind(this)
        };
    }
    private getFunctionsFromTemplate(t: string) {
        let functs: string[];
        functs = this.getStartingWith(this.getInterpolations(t), 'functions.');
        for (var i in functs) {
            this.functions[functs[i]] = this.getFunction(functs[i]);
        }
    }

    public component() {
        
        return function(compClass: string) {
            // console.log('yup', this.components, compClass);
            // we get new compClass
            // create div
            let div = document.createElement("div");
            let compDiv = document.createElement("div");

            let found = false;
            for (var comp of this.childComponentClasses) {
                if (comp.name == compClass) {
                    found = true;
                    // console.log('Hey! class ' + compClass + ' exists');
                    let component = new comp(compDiv, {});
                    this.components.push( component );
                    // DOM is not yet activated!
                    setTimeout(()=>{
                        component.el = document.getElementById("rss-injected-" + component.uuid);
                        component.setComponentEl();
                    });
                }
            }
            div.appendChild(compDiv);
            if (found) {
                return div.innerHTML;
            }
            console.error('Please import ' + compClass);
            return "<p style=\"color: red;font-weight: bold;border: 1px solid red;\">Component "
                +compClass+" not found.</p>";
        }.bind(this)
    }

    /**
     * This function retrieves all {{ content }} from template
     * @param t template
     */
    getInterpolations(t: string) {
        let matches: string[];
        let result = t.match(/{{(.*?)}}/g);
        if (result) matches = result;
        else matches = [];
        return matches.join(' ');
    }

    getStartingWith(s: string, search: string): string[] {
        let items: any[];
        if (search === '{{') {
            items = s.match( /{{[a-z\d| |.|(|)|"|'|,]+/ig);
        } else if (search === 'functions.') {
            items = s.match(/functions.[a-z\d| |.|(|)|"|'|,]+/ig);
        } else if (search === 'components.') {
            items = s.match(/components.[a-z\d| |.|(|)|"|'|,]+/ig);
        }
        // other stuff here
        for (var i in items) {
            items[i] = items[i].replace(search, '').trim();
        }
        return items;
    }

    /**
     * Let's create data variable for access from templates
     */

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    merge_options(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }
    addData(data) {
        this.data = this.merge_options(this.data, data);
        this.data['functions'] = this.functions;
        this.data['comp'] = this.component;
    }

    setComponentEl(force: boolean = false) {
        // only if this.componentEl exists AND force is false
        if (this.componentEl && !force) return;
        this.componentEl = document.getElementsByClassName(this.className + '-component ' + this.uuid)[0];
    }

    public reGen() {
        // get com id #rss-injected-[UUID]
        let el = document.getElementById('rss-injected-' + this.uuid );
        el.innerHTML = this.hoganTemplate.render(this.data);
        // console.log(this.hoganTemplate);
        this.setComponentEl(true);
    }

    /**
     * INSERT and REMOVE
     */
    public add(): void {
        if (this.created) return;
        this.el.innerHTML += '<div id="rss-injected-' + this.uuid +'">' 
            + this.hoganTemplate.render(this.data) + '</div>';
        this.setComponentEl();
        this.created = true;
    }
    public remove() {
        if (this.created)
        {
            console.log('Remove')
            // delete it
            this.setComponentEl();
            this.componentEl.remove;
            // this.el.removeChild( this.componentEl );
        }
        this.created = false;
    }

    public show() {
        this.setComponentEl();
        this.addClass(this.componentEl, 'oppened');
    }
    
    public hide() {
        this.setComponentEl();
        this.removeClass(this.componentEl, 'oppened');
    }

    /**
     * Getters and Setters
     */
    get className(): string {
        return this.constructor.toString().match(/\w+/g)[1].toLowerCase();
    }

    get classes(): string {
        return this.className + '-component ' + this.uuid;
    }


    // UTILITIES
    private uuidv4(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    private indent(t: string) {
        let templateArray = t.split('\n');
        let newArray = [];
        for (let line of templateArray) {
            newArray.push('    ' + line);
        }
        return newArray.join('\n');
    }

    private replaceAll(string, search, replacement): string {
        return string.replace(new RegExp(search, 'g'), replacement);
    };

    // DOM UTILITIES ===========================================================

    // CLASSES
    addClass(element: Element, className: string) {
        if (!element || !className) return;
        if (element.classList) {
            element.classList.add(className);
        } else {
            let arr = element.className.split(" ");
            if (arr.indexOf(name) == -1) {
                element.className += " " + className;
            }
        }
    }
    toggleClass(element: Element, className: string) {
        if (element){
            if (element.classList) { 
                element.classList.toggle(className);
            } else {
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
    }
    removeClass(element: Element, className: string) {
        if (element) {
            if (element.classList) {
                element.classList.remove(className);
            } else {
                element.className = element.className.replace(new RegExp(className, 'g'), "");
            }
        }
    }
}