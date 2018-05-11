import { MainUI } from './components/ui.main/ui.main';
export declare class InitComp {
    private static _instance;
    entryComponent: MainUI;
    static readonly Instance: InitComp;
    init(el: Element, mode?: boolean): void;
}
export declare let NComps: InitComp;
