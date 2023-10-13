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
if (theme) {
    themeSelect.value = theme;
}
toggleDarkMode.onclick = () => localStorage.mode = root.dataset.mode = document.documentElement.dataset.mode === 'light' ? 'dark' : 'light';

themeSelect.onchange = () => localStorage.theme = root.dataset.theme = themeSelect.value;