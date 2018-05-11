// Components
import { MainUI } from './components/ui.main/ui.main';

export class InitComp {

	private static _instance: InitComp;
	public entryComponent: MainUI;

	public static get Instance()
	{
		// Do you need arguments? Make it a regular method instead.
		return this._instance || (this._instance = new this());
	}

	public init(el: Element, mode: boolean = false): void {
		if (!el) return;
		// decides wheather or not we replace entry div. Only possible in entry Comp
		if (mode) el.innerHTML = '';
		this.entryComponent = new MainUI(el, {planet: 'Planet Earth'});
		this.entryComponent.add();
	}
}

export let NComps: InitComp = InitComp.Instance;

// module works as NPM already. Let's add to window as well (easier to use on HTML scripts)
(<any>window).NComps = NComps;