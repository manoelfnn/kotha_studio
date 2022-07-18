export default class TBD {

    constructor(nome) {
        this.nome = nome;
        this.base = JSON.parse(localStorage.getItem(this.nome) || '{}');
    }

    ler(chave) {
        return this.base[chave];
    }

    gravar(chave, valor) {
        this.base[chave] = valor;
        localStorage.setItem(this.nome, JSON.stringify(this.base));
    }

    apagar(chave) {
        delete this.base[chave];
        localStorage.setItem(this.nome, JSON.stringify(this.base));
    }    
}
