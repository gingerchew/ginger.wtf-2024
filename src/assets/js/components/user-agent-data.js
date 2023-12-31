
if (!navigator.userAgentData) {
    (await import('../polyfills/useragentdata.js')).polyfill()
}

class UADHelper {
    keys = [
        'architecture',
        'bitness',
        'formFactor',
        'fullVersionList',
        'model',
        'platformVersion',
        'wow64',
        'brands',
        'mobile',
        'platform'
    ]
    data = navigator.userAgentData;

    get brands() {
        return this.data.brands;
    }

    get mobile() {
        return this.data.mobile;
    }

    get platform() {
        return this.data.platform
    }

    get json() {
        const json = this.data.toJSON();

        const str = JSON.stringify(json, null, 4);
        return `<pre><code>
${str}
</code></pre>`;
    }

    async includeHighEntropyValues() {
        const hints = [
            'architecture',
            'bitness',
            'formFactor',
            'fullVersionList',
            'model',
            'platformVersion',
            'wow64'
        ];
        const data = await this.data.getHighEntropyValues(hints);

        Object.entries(data).forEach(([ key, value ]) => {
            Object.defineProperty(this, key, {
                get() { return value },
            });
        });

        console.log(this);
    }
}

class UAD extends HTMLElement {
    static name = 'user-agent-data';
    static define() {
        window.customElements.define(this.name, this);
    }

    constructor() {
        super();
        this.uad = new UADHelper();
    }

    get useJSON() {
        return this.hasAttribute('use-json');
    }

    get useHighEntropy() {
        return this.hasAttribute('use-high-entropy');
    }

    async connectedCallback() {
        console.log(this.uad.brands);
        if (this.useHighEntropy) {
            await this.uad.includeHighEntropyValues();
        }
        if (this.useJSON) {
            this.innerHTML = this.uad.json;
        } else {
            
            const keys = this.uad.keys;

            let content = `<ul class="uad-list" role="list" style="padding: 0;display: flex;flex-flow: column; gap:0.5em;">${keys.map(key => {
                let v = this.uad[key];
                if (v === undefined) return '';
                if (typeof v !== 'string' || typeof v !== 'number') {
                    v = JSON.stringify(v, null, 4);
                }
                return `<li>${key}: <code>${v}</code></li>`
            }).join('')}</ul>`;
            this.innerHTML = content;
        }
    }
}

UAD.define();