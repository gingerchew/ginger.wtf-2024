//import '/assets/css/main.scss'

// Focus Visible Polyfill
import 'focus-visible'

// Internal Modules
// import './modules/nav'



const root = document.documentElement;
const { mode } = localStorage;
if (root.dataset.mode !== 'light' && !mode) {
    const mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    root.dataset.mode = localStorage.mode = mode;
}

toggleDarkMode?.addEventListener('click', () => localStorage.mode = root.dataset.mode = root.dataset.mode === 'light' ? 'dark' : 'light');

const updateTheme = ({ value }) => localStorage.theme = root.dataset.theme = value;


class ThemeSelect extends HTMLElement {
    constructor() { 
        super();

        /* derived from HTMLElementPlus */
        this.refs = new Proxy({}, {
            get: (_, refName) => this.querySelector(`[ref="${refName}"]`),
        });

        const previousTheme = localStorage.theme;
        if (previousTheme) {
            updateTheme({ value: previousTheme });
            this.refs.select.value = previousTheme;
        }
    }
    connectedCallback() {
        const select = this.refs.select;

        if (root.dataset.theme === '') {
            const defaultValue = this.refs.default.value;
            root.dataset.theme = defaultValue; // just use the default value if none has been set
            select.value = defaultValue;
        }
        // Add a listener to update the theme on change.
        select.addEventListener('change', ({ target }) => updateTheme(target))
    }
}

customElements.define('theme-select', ThemeSelect);