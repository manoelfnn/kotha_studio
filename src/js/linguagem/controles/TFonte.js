export default class TFonte {
    constructor(jq) {
        this.jq = jq;
        this.tm = '80';
    }

    get tamanho() {
        return this.jq.css('font-size');
    }

    set tamanho(v) {
        return this.jq.css('font-size', `${v}px`);
    }

    get negrito() {
        return this.jq.css('font-weight') === 'bold';
    }

    set negrito(v) {
        this.jq.css('font-weight', v ? 'bold' : 'normal');
    }

    get cor() {
        return this.jq.css('cor');
    }

    set cor(v) {
        this.jq.css('color', v);
    }

    get centro() {
        return this.jq.css('text-align') === 'center';
    }

    set centro(v) {
        this.jq.css('text-align', v ? 'center' : 'left');
    }
}