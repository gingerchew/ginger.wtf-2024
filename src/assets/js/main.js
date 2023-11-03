// Focus Visible Polyfill
// import 'focus-visible'
const setCookie = (name) => document.cookie = `${name}; SameSite=Lax; HTTPOnly=true; Secure=true;`,
    umtc = () => document.getElementById('$themeColor').content = getComputedStyle(document.documentElement).getPropertyValue('--backgroundColor');
document.getElementById('$toggleDarkMode')?.addEventListener('click', ({ target }) => {
    const mode = target.dataset.mode === 'light' ? 'dark' : 'light';
    try {
        navigator.sendBeacon('/style/', new URLSearchParams({
            mode,
        }));
    } finally {}
    setCookie('mode='+mode);
    target.dataset.mode = mode
    umtc();
})
document.getElementById('$themeSelect')?.addEventListener('change', ({ target }) => {
    const theme = target.value;

    try {
        navigator.sendBeacon('/style/', new URLSearchParams({ theme }))
    } finally {}

    target.dataset.theme = theme;
    setCookie('theme='+theme);
    umtc();
})