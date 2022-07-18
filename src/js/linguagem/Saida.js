export default class Saida {
    constructor(saida, evento = null) {
        this.evento = evento;
        this.saida = saida;
        this.erroLancado = false;
        if (this.saida !== null) {
            this.saidaElemento = document.getElementById(this.saida);
        }
    }

    mensagem(tipo, cor, mensagem, posicao = null, formatado = true) {
        let p = '';
        let posicaoAtributos = '';
        if (posicao) {
            posicaoAtributos = `linha="${posicao.linha}" coluna="${posicao.coluna}"`;
            p = ` (${posicao.linha}:${posicao.coluna})`;
        }
        let m = mensagem;
        if (formatado) {
            m = `<div style="color: ${cor};" ${posicaoAtributos}>${m}${p}</div>`;
        }
        if (this.saida) {
            this.saidaElemento.insertAdjacentHTML('beforeend', m);
            this.saidaElemento.scrollTop = this.saidaElemento.scrollHeight - this.saidaElemento.clientHeight;            
        }
    }

    limpar() {
        if (this.saida) {
            this.saidaElemento.innerHTML = '';
        }
    }

    erro(mensagem, posicao = null) {
        if (this.erroLancado) return;
        this.mensagem('ERRO', 'red', mensagem, posicao);
        this.erroLancado = true;
        if (this.evento) {
            this.evento(this, mensagem, posicao);
        }
    }

    aviso(mensagem, posicao = null) {
        this.mensagem('AVISO', 'yellow', mensagem, posicao);
    }

    info(mensagem, posicao = null) {
        this.mensagem('INFO', 'gray', mensagem, posicao);
    }

    sucesso(mensagem, posicao = null) {
        this.mensagem('OK', 'green', mensagem, posicao);
    }
}
