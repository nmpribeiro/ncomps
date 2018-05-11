import { BaseComponent } from "../base.component";
// import template from 'template.html!text'
//var template = '<div><h1>RSS main</h1><p>This is our planet: {{planet}}</p></div>';
// https://stackoverflow.com/questions/40296692/typescript-2-0-and-webpack-importing-of-html-as-string
import template from "./ui.test.html";
import css from "./ui.test.scss";

import * as hogan from 'hogan.js';


export class TestUI extends BaseComponent {
    oppened: boolean = false;

    constructor(el: Element, data: object) {
        super(template, css, el, data, [], false);
        this.addData(this);
        this.add();
        this.show();
        // setTimeout(() => this.toggle(), 0)
    }

    public toggle() {
        if (this.oppened) {
            this.hide();
            this.oppened = false;
        } else {
            this.show();
            this.oppened = true;
        }
    }
}