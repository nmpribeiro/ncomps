import { ItemCSSStyles } from "../../dom_manipulators/menu-items";
import { BaseComponent } from "../base.component";
export declare class MainUI extends BaseComponent {
    private oppened;
    elements: HTMLCollection;
    styles: ItemCSSStyles;
    name: string;
    index: number;
    constructor(el: Element, data: object);
    update(): void;
    close(): void;
    changeName(): void;
    changePlanet(): void;
    wrapped(): void;
}
