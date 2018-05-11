import { MenuItems, ItemCSSStyles } from "../../dom_manipulators/menu-items";

import { BaseComponent } from "../base.component";
import { TestUI } from "../ui.test/ui.test";

// import template from 'template.html!text'
//var template = '<div><h1>RSS main</h1><p>This is our planet: {{planet}}</p></div>';
// https://stackoverflow.com/questions/40296692/typescript-2-0-and-webpack-importing-of-html-as-string
import template from "./ui.main.html";
import css from "./ui.main.scss";

export class MainUI extends BaseComponent {
    private oppened: boolean = false;
    elements: HTMLCollection;
    styles: ItemCSSStyles = {};

    name: string = "Willy";
    index: number = 1;

    constructor(el: Element, data: object) {
        super(template, css, el, data, [TestUI], false);
        this.addData(this);
        this.add();
    }

    update(): void {
        this.addData(this); // to update variables
        this.reGen();
        // this one has an 'oppened' flag
        if (this.oppened) this.show(); else this.hide();
    }

    public close(): void {
        this.hide();
        this.oppened = false;
    }

    public changeName(): void {
        this.name = 'Nuno';
        this.update();
    }

    public changePlanet(): void {
        this['planet'] = 'Earth N.' + this.index;
        this.index++;
        this.update();
    }

    public wrapped(): void {
        return function(text, render) {
            return "<b>"+text+"</b>";
        }.bind(this)
    }
}