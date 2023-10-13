//import '/assets/css/main.scss'

// Focus Visible Polyfill
import 'focus-visible'

// Internal Modules
// import './modules/nav'



const root = document.documentElement;

if (root.dataset.mode !== 'light' && !localStorage.mode) {
    const mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    localStorage.mode = mode;
    root.dataset.mode = mode;
}
if (localStorage.theme) {
    themeSelect.value = localStorage.theme;
}
toggleDarkMode.onclick = () => localStorage.mode = root.dataset.mode = document.documentElement.dataset.mode === 'light' ? 'dark' : 'light';

themeSelect.onchange = () => localStorage.theme = root.dataset.theme = themeSelect.value;