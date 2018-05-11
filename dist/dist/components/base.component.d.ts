export declare class BaseComponent {
    el: Element;
    data: any;
    private childComponentClasses;
    private hoganTemplate;
    private template;
    uuid: string;
    componentEl: Element;
    functions: object;
    private components;
    private created;
    /**
     * This is the constructor of a Component.
     * @param template this is the html template
     * @param css this is the css/scss file
     * @param el element to inject component
     * @param data any data
     * @param childComponentClasses any child component classes to be used
     * @param mode whether or not the component will be generated right away
     */
    constructor(template: string, css: string, el: Element, data: any, childComponentClasses?: any[], mode?: boolean);
    /**
     * We need to access Component later, through window
     */
    register(): void;
    unregister(): void;
    delete(): void;
    private preProcessHTML(t, css);
    private preProcessCSS(css);
    /**
     * Let functions work on template
     * @param fnct
     */
    private getFunction(fnct);
    private getFunctionsFromTemplate(t);
    component(): any;
    /**
     * This function retrieves all {{ content }} from template
     * @param t template
     */
    getInterpolations(t: string): string;
    getStartingWith(s: string, search: string): string[];
    /**
     * Let's create data variable for access from templates
     */
    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    merge_options(obj1: any, obj2: any): {};
    addData(data: any): void;
    setComponentEl(force?: boolean): void;
    reGen(): void;
    /**
     * INSERT and REMOVE
     */
    add(): void;
    remove(): void;
    show(): void;
    hide(): void;
    /**
     * Getters and Setters
     */
    readonly className: string;
    readonly classes: string;
    private uuidv4();
    private indent(t);
    private replaceAll(string, search, replacement);
    addClass(element: Element, className: string): void;
    toggleClass(element: Element, className: string): void;
    removeClass(element: Element, className: string): void;
}
