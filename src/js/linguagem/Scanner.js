import TokensTipos from './tokens';
import Posicao from './Posicao';
import Token from './Token';

export default class Scanner {
    constructor(saida) {
        this.saida = saida;
    }

    getTokens(codigo) {
        this.codigo = codigo || '';
        this.tamanho = this.codigo.length;
        this.caracter = this.codigo[this.posicao];
        this.posicao = -1;
        this.linha = 1;
        this.coluna = 0;
        this.colunaToken = 0;
        this.erro = false;

        const tokens = [];
        this.getProximoCaracter();
        let token = this.getProximoToken();
        while (token && !this.erro) {
            tokens.push(token);
            token = this.getProximoToken();
        }

        if (this.erro) {
            return null;
        }

        return tokens;
    }

    criarToken(tipo, valor = null) {
        const posicao = new Posicao(this.linhaToken, this.colunaToken);
        return new Token(tipo, valor, posicao);
    }

    getProximoCaracter(previa = false) {
        if (this.posicao + 1 < this.tamanho) {
            if (previa) {
                return this.codigo[this.posicao + 1];
            }
            this.coluna += 1;
            this.posicao += 1;
            this.caracter = this.codigo[this.posicao];

            if (this.caracter === '\n') {
                this.linha += 1;
                this.coluna = 0;
            }

            return this.caracter;
        }
        this.caracter = null;
        return this.caracter;
    }

    getProximoToken() {
        while (this.caracter) {
            // removemos caracteres em branco
            if (/\s/.test(this.caracter)) {
                while (this.caracter && /\s/.test(this.caracter)) {
                    this.getProximoCaracter();
                }
                continue;
            }

            // salvamos a coluna do início do token
            this.linhaToken = this.linha;
            this.colunaToken = this.coluna - 1;

            // strings
            if (this.caracter === '"' || this.caracter === "'") {
                const aspas = this.caracter === '"' ? '"' : "'";
                let string = '';
                let caracterAnterior = this.caracter;
                this.getProximoCaracter();
                while (
                    this.caracter &&
                    (this.caracter !== aspas || (this.caracter === aspas && caracterAnterior === '\\'))
                ) {
                    string += this.caracter;
                    caracterAnterior = this.caracter;
                    this.getProximoCaracter();
                }
                if (!this.caracter) {
                    this.saida.erro(
                        'Final do texto não foi encontrado',
                        new Posicao(this.linhaToken, this.colunaToken)
                    );
                    this.error = true;
                    return null;
                }
                this.getProximoCaracter();
                return this.criarToken('STRING', string);
            }

            // identificadores
            if (/[a-zA-Z$_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/.test(this.caracter)) {
                let identificador = '';
                while (this.caracter && /[a-zA-Z0-9_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/.test(this.caracter)) {
                    identificador += this.caracter;
                    this.getProximoCaracter();
                }

                // palavra reservada
                const identificadorM = identificador.toLowerCase();

                for (let i = 0; i < TokensTipos.length; i += 1) {
                    if (TokensTipos[i].variacoes.find((v) => v === identificadorM)) {
                        return this.criarToken(TokensTipos[i].nome, identificador);
                    }
                }
                // se não é uma palavra reservada então é um identificador, uma variável ou uma função
                return this.criarToken('IDENTIFICATOR', identificador);
            }

            // números
            if (/\d/.test(this.caracter)) {
                let numero = this.caracter;
                let ponto = false;
                let tipoNumero = false;
                this.getProximoCaracter();
                while (this.caracter && /[0-9a-fA-F.xXbBoO]/.test(this.caracter)) {
                    if (this.caracter === '.') {
                        if (ponto) {
                            break;
                        }
                        ponto = true;
                    }
                    if (/[xXbBoO]/.test(this.caracter)) {
                        if (tipoNumero || ponto) {
                            break;
                        }
                        tipoNumero = true;
                    }
                    numero += this.caracter;
                    this.getProximoCaracter();
                }
                return this.criarToken('NUMBER', numero);
            }

            // comentários de uma linha
            if (this.caracter === '#' || (this.caracter === '/' && this.getProximoCaracter(true) === '/')) {
                while (this.caracter && this.caracter !== '\n') {
                    this.getProximoCaracter();
                }
                continue;
            }

            // comentários de múltiplas linhas
            if (this.caracter === '/' && this.getProximoCaracter(true) === '*') {
                this.getProximoCaracter();
                this.getProximoCaracter();
                while (this.caracter && !(this.caracter === '*' && this.getProximoCaracter(true) === '/')) {
                    this.getProximoCaracter();
                }
                this.getProximoCaracter();
                this.getProximoCaracter();
                continue;
            }

            if (/[(){}[\]+*|^.\\/\-=!&%<>,;:?]/.test(this.caracter)) {
                const primeiroCaracter = this.caracter;
                const segundoCaracter = this.posicao + 1 > this.tamanho ? '' : this.codigo[this.posicao + 1];
                const terceiroCaracter = this.posicao + 2 > this.tamanho ? '' : this.codigo[this.posicao + 2];
                let tresCaracteres = primeiroCaracter + segundoCaracter + terceiroCaracter;
                const doisCaracteres = primeiroCaracter + segundoCaracter;
                const umCaracter = primeiroCaracter;
                if (tresCaracteres.length !== 3) tresCaracteres = null;
                if (doisCaracteres.length !== 2) tresCaracteres = null;

                let achouTres;
                let achouDois;
                let achouUm;

                for (let i = 0; i < TokensTipos.length; i += 1) {
                    for (let v = 0; v < TokensTipos[i].variacoes.length; v += 1) {
                        if (tresCaracteres && TokensTipos[i].variacoes[v] === tresCaracteres) {
                            achouTres = TokensTipos[i].nome;
                            break;
                        }
                        if (doisCaracteres && TokensTipos[i].variacoes[v] === doisCaracteres) {
                            achouDois = TokensTipos[i].nome;
                        }
                        if (umCaracter && TokensTipos[i].variacoes[v] === umCaracter) {
                            achouUm = TokensTipos[i].nome;
                        }
                    }
                }

                if (achouTres) {
                    this.getProximoCaracter();
                    this.getProximoCaracter();
                    this.getProximoCaracter();
                    return this.criarToken(achouTres, tresCaracteres);
                }
                if (achouDois) {
                    this.getProximoCaracter();
                    this.getProximoCaracter();
                    return this.criarToken(achouDois, doisCaracteres);
                }
                if (achouUm) {
                    this.getProximoCaracter();
                    return this.criarToken(achouUm, umCaracter);
                }
                this.saida.erro(`Símbolo '${this.caracter}' inválido`, new Posicao(this.linhaToken, this.colunaToken));
                this.erro = true;
            }

            if (this.posicao >= this.tamanho) {
                return null;
            }
            this.saida.erro(`Caracter '${this.caracter}' inválido`, new Posicao(this.linhaToken, this.colunaToken));
            this.erro = true;
            return null;
        }
        return null;
    }
}
