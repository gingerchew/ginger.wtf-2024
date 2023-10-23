//import '/assets/css/main.scss'

// Focus Visible Polyfill
import 'focus-visible'

// Internal Modules
// import './modules/nav'



const root = document.documentElement;
const { mode, theme } = localStorage;
if (root.dataset.mode !== 'light' && !mode) {
    const mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    root.dataset.mode = localStorage.mode = mode;
}
if (window.themeSelect) {

    themeSelect.value = theme ?? 'blue';
    themeSelect?.addEventListener('change', () => localStorage.theme = root.dataset.theme = themeSelect.value) ;
}

window.toggleDarkMode && toggleDarkMode?.addEventListener('click', () => localStorage.mode = root.dataset.mode = document.documentElement.dataset.mode === 'light' ? 'dark' : 'light');
