// Focus Visible Polyfill
// import 'focus-visible'
const def = (name, el) => customElements.define(name, el),
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
/*
const labels = [
    'Spicyyy!', 'Hot Dog!', 'Woah!', 'Read Me!', 'Yowza!', 'Featured', 'Oh Boy!', 'Gold Star!', 'Whoopee!'
];
def('featured-label', class extends HTMLElement {
    connectedCallback() {
        let i = Math.floor(Math.random() * labels.length);
        this.textContent = labels[i];
    }
});
*/

def('rss-report', class extends HTMLElement {
    constructor() {
        super();
        this.ua = navigator.userAgent;
        this.ip = (async () => {
            return await this.getIp();
        })()
    }
    /**
     * This gets the ip on the front end, and does not save it. Only sends it to Plausible analytics to generate a "unique visitor" id
     * 
     * Documentation: https://plausible.io/docs/events-api
     */
    async getIp() {
        const pc = new RTCPeerConnection({ iceServers: [] });
        
        pc.createDataChannel('');
        const offer = await pc.createOffer();
        
        pc.setLocalDescription(offer);
        // pc.createOffer(pc.setLocalDescription.bind(pc), noop);
        pc.onicecandidate = (ice) => {
            if (!(ice?.candidate?.candidate)) return;

            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
            try {
                if (ice.candidate.candidate.match(ipRegex)) {
                    this.ip = ice.candidate.candidate;
                }
            } finally {
                pc.onicecandidate = noop;
            }
        }
    }

    connectedCallback() {
        this.querySelector('a').addEventListener('click', async () => {
            // debugger;
            const {
                ua,
                ip
            } = this;
            navigator.sendBeacon('/api/event', {
                headers: {
                    'Content-Type': 'application/json',
                    "User-Agent": ua,
                    'X-Forwarded-For': ip || ''
                },
                body: JSON.stringify({
                    name: 'pageview',
                    domain: 'ginger.wtf',
                    url: 'https://ginger.wtf/feed.xml'
                })
            })
        })
    }
})