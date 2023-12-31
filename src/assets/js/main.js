// Focus Visible Polyfill
// import 'focus-visible'
const def = (name, el) => customElements.define(name, el),
    $ = document.querySelector.bind(document),
    setCookie = (name) => document.cookie = `${name}; SameSite=Lax; HTTPOnly=true; Secure=true;`,
    umtc = () => document.getElementById('$themeColor').content = getComputedStyle(document.documentElement).getPropertyValue('--accentColor'),
    sendBeacon = (data) => {
        try {
            navigator.sendBeacon('/style/', new URLSearchParams(data))
        } finally {}
    },
    noop = () => {};

def('toggle-mode', class extends HTMLElement {
    constructor() {
        super()
        this.btn = this.querySelector('button');
    }

    set mode(v) {
        this.dataset.mode = v;
        setCookie('mode='+v);
        umtc();
    }
    get mode() {
        return this.dataset.mode;
    }
    connectedCallback() {
        this.btn.addEventListener('click', () => {
            this.mode = this.mode === 'light' ? 'dark' : 'light';
            sendBeacon({ mode: this.mode });
        });
    }
});

def('theme-select', class extends HTMLElement {
    constructor() {
        super();
        this.select = this.querySelector('select');
    }

    set theme(v) {
        this.dataset.theme = v;
        setCookie('theme='+v);
        umtc();
    }

    get theme() {
        return this.dataset.theme;
    }

    connectedCallback() {
        this.select.addEventListener('change', ({ target }) => {
            this.theme = target.value;
            sendBeacon({ theme: this.theme });
        })
    }
});

let emoji = ['🌸','🍋', '✨','🏳️‍⚧️','🫀','🧠','🌼','🛸','💻','❤️'],
    i = Math.floor(Math.random() * emoji.length)
def('rand-emoji', class extends HTMLElement {
    connectedCallback() {
        this.textContent = emoji[i];
    }
});

if ($('user-agent')) await import('./components/user-agent.js');
if ($('user-agent-data')) await import('./components/user-agent-data.js');