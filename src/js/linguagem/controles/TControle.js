import TFonte from './TFonte';

export default class TControle {
    constructor(jq) {
        this.jq = jq;
        this.fnt = new TFonte(this.jq);
    }

    get jquery() {
        return this.jq;
    }

    get valor() {
        if (this.jq.is('span')) {
            return this.jq.html();
        }
        return this.jq.val();
    }

    set valor(v) {
        if (this.jq.is('span')) {
            this.jq.html(v);
        } else {
            this.jq.val(v);
        }
    }

    get nome() {
        return this.jq.attr('name');
    }

    set nome(v) {
        this.jq.attr('name', v);
    }

    set clique(v) {
        this.jq.attr('evento-clique', v);
    }

    set pressionar(v) {
        this.jq.attr('evento-pressionar-tecla', v);
    }

    get margem() {
        return this.jq.css('margin');
    }

    set margem(v) {
        this.jq.css('margin', v);
    }

    get espaco() {
        return this.jq.css('padding');
    }

    set espaco(v) {
        this.jq.css('padding', v);
    }

    get fundo() {
        return this.jq.css('background-color');
    }

    set fundo(v) {
        this.jq.css('background-color', v);
    }

    get x() {
        return parseInt(this.jq.css('left'), 10);
    }

    set x(v) {
        this.jq.css('left', `${v}px`);
    }

    get y() {
        return parseInt(this.jq.css('top'), 10);
    }

    set y(v) {
        this.jq.css('top', `${v}px`);
    }

    get largura() {
        return parseInt(this.jq.css('width'), 10);
    }

    set largura(v) {
        this.jq.css('width', `${v}px`);
    }

    get altura() {
        return parseInt(this.jq.css('height'), 10);
    }

    set altura(v) {
        this.jq.css('height', `${v}px`);
    }

    get fonte() {
        return this.fnt;
    }
}
