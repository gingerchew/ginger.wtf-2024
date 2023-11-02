// Focus Visible Polyfill
// import 'focus-visible'
const setCookie = (name) => document.cookie = `${name}; SameSite=Lax; HTTPOnly=true; Secure=true;`,
    umtc = () => document.getElementById('$themeColor').content = getComputedStyle(document.documentElement).getPropertyValue('--backgroundColor');
$toggleDarkMode.onclick = async ({ target }) => {
    const mode = target.dataset.mode === 'light' ? 'dark' : 'light';
    try {
        navigator.sendBeacon('/style/', new URLSearchParams({
            mode,
        }));
    } catch(e) {
        console.log('Error: ', e.message);
    }
    setCookie('mode='+mode);
    target.dataset.mode = mode
    umtc();
}
$themeSelect.onchange = ({ target }) => {
    const theme = target.value;

    try {
        navigator.sendBeacon('/style/', new URLSearchParams({ theme }))
    } catch(e) {
        console.log('Error: ', e.message);
    }

    target.dataset.theme = theme;
    setCookie('theme='+theme);
    umtc();
}