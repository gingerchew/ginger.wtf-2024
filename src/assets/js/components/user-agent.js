class UserAgent extends HTMLElement {
    constructor() { super() };
    connectedCallback() { this.innerHTML = `<code>${navigator.userAgent}</code>` }
    static define() {
        window.customElements.define('user-agent', this);
    }
}

UserAgent.define();