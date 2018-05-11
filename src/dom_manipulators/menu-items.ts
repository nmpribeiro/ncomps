export interface ItemCSSStyles {
    maxWidth?: number,
    maxHeight?: number,
    marginTop?: number,
    marginRight?: number,
    marginBottom?: number,
    marginLeft?: number,
    top?: number
}

export class MenuItems {

    public items: HTMLCollection;

    constructor(items: HTMLCollection) {
        this.items = items;
    }

    createItem(index: number, value: string, styles: ItemCSSStyles) {
        if (index != null && this.items[index]) {
            var anchor=document.createElement('a');
            anchor.href='#';
            const stylesArray: Array<Object> = Object.keys(styles).map(key => {
                return { key: key, value: styles[key] }
            });
            if (value) {
                // check if it starts with
                var pattern: string = 'data:image';
                if (value.substring(0, pattern.length) === pattern) {
                    // anchor.innerHTML='';
                    var image = document.createElement("img");
                    image.setAttribute("src", value);

                    for (var i in stylesArray) {
                        const s: any = stylesArray[i];
                        // not everything finishes with px
                        if (s.key === 'maxWidth') image.style[s.key] = s.value+'px';
                    }
                    anchor.appendChild(image);
                } else {
                    anchor.innerHTML = value;
                }
                anchor.style.position = 'relative';
                for (var i in stylesArray) {
                    const s: any = stylesArray[i];
                    // not everything finishes with px
                    if (s.key === 'maxWidth' || s.key === 'maxHeight'|| s.key === 'marginTop' ||
                        s.key === 'marginRight' || s.key === 'marginBottom' || s.key === 'marginLeft' ||
                        s.key === 'top'
                    ) {
                        anchor.style[s.key] = s.value+'px';
                    }
                }
            }
            this.items[index].appendChild(anchor);
            return anchor;
        }
    }
}