window.customElements.define('random-post', class extends HTMLElement {
    constructor() {
        super();
        this.posts = JSON.parse($posts.innerHTML || '[]');
        this.l = this.posts.length;
    }

    get randIndex() {
        return Math.floor(Math.random() * this.l);
    }

    connectedCallback() {
        if (this.l > 0) {
            const post = this.posts[this.randIndex];
            this.querySelector('a').href = post.href;
        }
    }
})