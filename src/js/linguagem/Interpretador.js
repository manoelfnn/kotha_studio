import Parser from './Parser';
import Scanner from './Scanner';
import Saida from './Saida';
import Compilador from './Compilador';
import funcoes from './funcoes';

export default class Interpretador {
    constructor(container, saida, eventoErro) {
        this.saidaId = saida;
        this.saidaEventoErro = eventoErro;
        this.container = container;
        this.disparadores = [];
    }

    carregar(codigo, debug, imprimirEstrutura = true) {
        this.saida = new Saida(this.saidaId, this.saidaEventoErro);
        this.saida.limpar();
        this.debug = debug;
        this.erro = false;
        this.usoGeral = {};
        this.magico = false;

        this.destruirDisparadores();

        const scanner = new Scanner(this.saida);
        const parser = new Parser(this.saida);
        const compilador = new Compilador(this.saida);

        this.tokens = scanner.getTokens(codigo);
        this.estrutura = parser.getEstrutura(this.tokens);

        if (!this.estrutura) {
            this.erro = true;
            return null;
        }

        compilador.compilar(this.estrutura, debug);

        if (!this.estrutura) {
            this.erro = true;
            return null;
        }

        if (imprimirEstrutura) {
            console.log(this.estrutura);
        }

        this.contextos = [];
        this.posicao = this.estrutura.inicio;
        this.pilha = [];
        this.variaveis = new Array(this.estrutura.globais);
        this.variaveisGlobais = this.variaveis;
        this.bytecodes = this.estrutura.bytecodes;
        this.linhaAtual = 0;
        this.ultimaLinha = 0;
        return true;
        //  this.passo();
    }

    destruirDisparadores() {
        this.disparadores.forEach((d) => clearInterval(d));
    }

    executarTudo(magico = false) {
        const start = +new Date();
        this.magico = magico;
        if (this.erro) return false;
        let executado = this.executarInstrucao();
        while (executado) {
            executado = this.executarInstrucao();
            if (this.erro) return false;
        }
        if (this.erro) return false;
        const end = +new Date();
        this.saida.sucesso(`Executado com sucesso em ${end - start}ms`);
        return true;
    }

    executarProximaLinha() {
        if (this.erro) return false;
        if (!this.debug) throw new Error('É preciso ativar o modo debug para executarProximaLinha()');
        while (this.linhaAtual === this.ultimaLinha) {
            if (!this.executarInstrucao()) return false;
            if (this.erro) return false;
        }
        this.ultimaLinha = this.linhaAtual;
        return true;
    }

    getBytecodes() {
        if (this.erro) return null;
        return this.bytecodes;
    }

    getDebug() {
        return this.debug;
    }

    getContainer() {
        return this.container;
    }

    executarInstrucao() {
        if (this.erro) return false;

        const codigo = this.bytecodes[this.posicao];

        try {
            switch (codigo) {
                case 'DEBUG_L': {
                    this.posicao += 1;
                    this.linhaAtual = this.bytecodes[this.posicao];
                    this.posicao += 1;
                    break;
                }
                case 'SWAP': {
                    this.posicao += 1;
                    const valor1 = this.pilha.pop();
                    const valor2 = this.pilha.pop();
                    this.pilha.push(valor1);
                    this.pilha.push(valor2);
                    break;
                }
                case 'DUP':
                    this.posicao += 1;
                    this.pilha.push(this.pilha[this.pilha.length - 1]);
                    break;
                case 'NEWARRAY': {
                    this.posicao += 1;
                    const tamanho = this.bytecodes[this.posicao];
                    const a = new Array(tamanho);
                    for (let i = 0; i < tamanho; i += 1) {
                        a[i] = this.pilha.pop();
                    }
                    this.pilha.push(a);
                    this.posicao += 1;
                    break;
                }
                case 'ARRAYLENGTH': {
                    this.posicao += 1;
                    const tamanho = this.pilha[this.pilha.length - 1].length;
                    this.pilha.pop();
                    this.pilha.push(tamanho);
                    break;
                }
                case 'ALOAD': {
                    this.posicao += 1;
                    const array = this.pilha[this.pilha.length - 2];
                    const indice = this.pilha[this.pilha.length - 1];
                    const valor = array[indice];
                    if (typeof array !== 'object' && typeof array !== 'string') {
                        this.erro = true;
                        // this.saida.erro(`Não é possivel acessar o índice ${indice} do vetor`);
                        this.saida.erro(`Não é possível acessar o índice '${indice}'`);
                        return false;
                    }
                    this.pilha.pop();
                    this.pilha.pop();
                    this.pilha.push(valor);
                    break;
                }
                case 'ASTORE': {
                    this.posicao += 1;
                    let array = this.pilha[this.pilha.length - 2];
                    const indice = this.pilha[this.pilha.length - 1];
                    this.pilha.pop();
                    this.pilha.pop();
                    // resolvido pra não dar erro, porém não funciona, string não é um objeto
                    if (typeof array === 'string') {
                        array = array.substr(indice, this.pilha.pop());
                    } else {
                        if (typeof array !== 'object') {
                            this.erro = true;
                            this.saida.erro(`Não é possível acessar o índice '${indice}' de '${array || 'Vázio'}'`);
                            return false;
                        }
                        array[indice] = this.pilha.pop();
                    }
                    break;
                }
                case 'INVOKE_VIRTUAL': {
                    this.posicao += 1;
                    const nome = this.bytecodes[this.posicao];
                    this.posicao += 1;
                    const numero = this.bytecodes[this.posicao];
                    this.posicao += 1;
                    const args = [];
                    for (let i = 0; i < numero; i += 1) {
                        args.push(this.pilha.pop());
                    }
                    const objeto = this.pilha[this.pilha.length - 1];
                    if (typeof objeto !== 'object') {
                        this.erro = true;
                        this.saida.erro(`'${objeto}' não é um objeto`);
                        return false;
                    }
                    if (!(nome in objeto)) {
                        this.erro = true;
                        this.saida.erro(`Método '${nome}' não existe`);
                        return false;
                    }
                    const valor = objeto[nome](...args);
                    this.pilha.pop();
                    this.pilha.push(valor);
                    break;
                }
                case 'GETFIELD': {
                    this.posicao += 1;
                    const objeto = this.pilha[this.pilha.length - 1];
                    const campo = this.bytecodes[this.posicao];
                    this.posicao += 1;
                    if (typeof objeto !== 'object') {
                        this.erro = true;
                        this.saida.erro(`'${objeto}' não é um objeto`);
                        return false;
                    }
                    if (!(campo in objeto)) {
                        this.erro = true;
                        this.saida.erro(`Propriedade '${campo}' não existe`);
                        return false;
                    }
                    const valor = objeto[campo];
                    this.pilha.pop();
                    this.pilha.push(valor);
                    break;
                }
                case 'PUTFIELD': {
                    this.posicao += 1;
                    const objeto = this.pilha[this.pilha.length - 1];
                    const campo = this.bytecodes[this.posicao];
                    const valor = this.pilha[this.pilha.length - 2];
                    this.posicao += 1;
                    if (typeof objeto !== 'object') {
                        this.erro = true;
                        this.saida.erro(`'${objeto}' não é um objeto`);
                        return false;
                    }
                    if (!(campo in objeto)) {
                        this.erro = true;
                        this.saida.erro(`Propriedade '${campo}' não existe`);
                        return false;
                    }
                    objeto[campo] = valor;
                    this.pilha.pop();
                    this.pilha.pop();
                    break;
                }
                case 'PUSH':
                    this.posicao += 1;
                    this.pilha.push(this.bytecodes[this.posicao]);
                    this.posicao += 1;
                    break;
                case 'POP':
                    this.posicao += 1;
                    this.pilha.pop();
                    break;
                case 'GT':
                case 'GTE':
                case 'LT':
                case 'LTE':
                case 'DIFF':
                case 'EQUAL':
                case 'OR':
                case 'XOR':
                case 'AND':
                case 'ADD':
                case 'SUB':
                case 'MULT':
                case 'DIV':
                case 'POW':
                case 'MOD': {
                    this.posicao += 1;
                    let A = this.pilha[this.pilha.length - 2];
                    let B = this.pilha[this.pilha.length - 1];
                    if (typeof A === 'string') {
                        B = B !== undefined ? B.toString() : '';
                    }
                    if (typeof A === 'number') {
                        // eslint-disable-next-line radix
                        //B = B !== undefined ? Number(B) : 0;
                    }
                    // eslint-disable-next-line default-case
                    switch (codigo) {
                        case 'GT':
                            A = A > B;
                            break;
                        case 'GTE':
                            A = A >= B;
                            break;
                        case 'LT':
                            A = A < B;
                            break;
                        case 'LTE':
                            A = A <= B;
                            break;
                        case 'DIFF':
                            A = A !== B;
                            break;
                        case 'EQUAL':
                            A = A === B;
                            break;
                        case 'OR':
                            A = A || B;
                            break;
                        case 'XOR':
                            A = A ^ B;
                            break;
                        case 'AND':
                            A = A && B;
                            break;
                        case 'ADD':
                            A += B;
                            break;
                        case 'SUB':
                            A -= B;
                            break;
                        case 'MULT':
                            A *= B;
                            break;
                        case 'DIV':
                            A /= B;
                            break;
                        case 'MOD':
                            A %= B;
                            break;
                        case 'POW':
                            A **= B;
                            break;
                    }

                    this.pilha[this.pilha.length - 2] = A;
                    this.pilha.pop();
                    break;
                }
                case 'NOT': {
                    this.posicao += 1;
                    this.pilha[this.pilha.length - 1] = !this.pilha[this.pilha.length - 1];
                    break;
                }
                case 'LOAD':
                case 'LOAD_G':
                case 'STORE':
                case 'STORE_G': {
                    this.posicao += 1;
                    const variaveis =
                        codigo === 'LOAD_G' || codigo === 'STORE_G' ? this.variaveisGlobais : this.variaveis;
                    if (codigo === 'STORE' || codigo === 'STORE_G') {
                        variaveis[this.bytecodes[this.posicao]] = this.pilha.pop();
                    } else {
                        this.pilha.push(variaveis[this.bytecodes[this.posicao]]);
                    }
                    this.posicao += 1;
                    break;
                }
                case 'GOTO':
                    this.posicao += 1;
                    this.posicao = this.bytecodes[this.posicao];
                    break;
                case 'IF_TRUE':
                    this.posicao += 1;
                    this.posicao = this.pilha[this.pilha.length - 1] ? this.bytecodes[this.posicao] : this.posicao + 1;
                    this.pilha.pop();
                    break;
                case 'IF_FALSE':
                    this.posicao += 1;
                    this.posicao = this.pilha[this.pilha.length - 1] ? this.posicao + 1 : this.bytecodes[this.posicao];
                    this.pilha.pop();
                    break;
                case 'SWITCH': {
                    this.posicao += 1;

                    const expressao = this.pilha[this.pilha.length - 1];
                    this.pilha.pop();
                    const padrao = this.bytecodes[this.posicao];
                    this.posicao += 1;
                    const total = this.bytecodes[this.posicao];
                    this.posicao += 1;
                    let localizou = false;

                    for (let i = 0; i < total; i += 1) {
                        if (expressao === this.bytecodes[this.posicao]) {
                            this.posicao = this.bytecodes[this.posicao + 1];
                            localizou = true;
                            break;
                        }
                        this.posicao += 2;
                    }
                    if (!localizou) {
                        this.posicao = padrao;
                    }
                    break;
                }
                case 'INVOKE_S': {
                    this.posicao += 1;
                    const indice = this.bytecodes[this.posicao];
                    this.posicao += 1;
                    const numero = this.bytecodes[this.posicao];
                    const args = [];
                    for (let i = 0; i < numero; i += 1) {
                        args.push(this.pilha.pop());
                    }
                    this.pilha.push(funcoes[indice].func(args, this));
                    this.posicao += 1;
                    break;
                }
                case 'INVOKE_U': {
                    this.posicao += 1;
                    const indice = this.bytecodes[this.posicao];
                    this.posicao += 1;
                    const numero = this.bytecodes[this.posicao];
                    const args = [];
                    for (let i = 0; i < numero; i += 1) {
                        args.push(this.pilha.pop());
                    }
                    this.posicao += 1;
                    this.contextos.push({
                        posicao: this.posicao,
                        pilha: this.pilha,
                        variaveis: this.variaveis,
                        funcao: indice,
                    });
                    this.posicao = this.estrutura.funcoes[indice].inicio;
                    this.variaveis = new Array(this.estrutura.funcoes[indice].locais);
                    for (let i = 0; i < args.length; i += 1) {
                        this.variaveis[i] = args[i];
                    }
                    this.pilha = [];
                    break;
                }
                case 'RETURN': {
                    const retorno = this.pilha[this.pilha.length - 1];
                    this.posicao = this.contextos[this.contextos.length - 1].posicao;
                    this.pilha = this.contextos[this.contextos.length - 1].pilha;
                    this.variaveis = this.contextos[this.contextos.length - 1].variaveis;
                    this.pilha.push(retorno);
                    this.contextos.pop();
                    break;
                }
                default: {
                    return false;
                }
            }
        } catch (erro) {
            this.erro = true;
            this.saida.erro(`Erro: '${erro.message}'`);
            return false;
        }
        return true;
    }

    chamarFuncao(nome, argumentos = []) {
        const funcao = this.estrutura.funcoes.find((f) => f.nome === nome);
        if (funcao) {
            this.contextos.push({
                posicao: this.posicao,
                pilha: this.pilha,
                variaveis: this.variaveis,
            });
            this.posicao = funcao.inicio;
            this.variaveis = new Array(funcao.locais);
            for (let i = 0; i < argumentos.length; i += 1) {
                this.variaveis[i] = argumentos[i];
            }
            this.pilha = [];
            let executado = this.executarInstrucao();
            while (executado) {
                executado = this.executarInstrucao();
            }
            return true;
        }
        return false;
    }

    obterResultado() {
        return this.usoGeral.tosystem;
    }

    verVariaveis() {
        let texto = '<div class="contexto">Global</div>';
        this.estrutura.globaisNomes.forEach((nome, i) => {
            if (nome)
                texto += `
            <span class="variavel">
                <span class="nome">${nome}</span>${
                    this.variaveisGlobais[i] === undefined
                        ? ''
                        : `: <span class="valor">${this.variaveisGlobais[i]}</span>`
                }</span>
            </span>`;
        });
        if (this.contextos.length) {
            const funcao = this.estrutura.funcoes[this.contextos[this.contextos.length - 1].funcao];
            texto += '<div class="contexto">Local</div>';
            funcao.locaisNomes.forEach((nome, i) => {
                if (nome)
                    texto += `
            <span class="variavel local">
                <span class="nome">${nome}</span>${
                        this.variaveis[i] === undefined ? '' : `: <span class="valor">${this.variaveis[i]}</span>`
                    }
            </span>`;
            });
        }

        return texto;
    }

    getBytecodesEmTexto() {
        if (this.erro) return 'Existe algum erro';
        let texto = '<table class="bytecode">';
        const umOperando = [
            'GETFIELD',
            'LOAD',
            'LOAD_G',
            'STORE',
            'STORE_G',
            'PUSH',
            'DEBUG_L',
            'GOTO',
            'IF_TRUE',
            'IF_FALSE',
        ];
        const doisOperandos = ['INVOKE_U', 'INVOKE_S', 'SWITCH'];
        for (let i = 0; i < this.bytecodes.length; i += 1) {
            if (this.bytecodes[i] === 'DEBUG_L') {
                i += 1;
                continue;
            }
            let op = `<tr><td class="linha">${i}:</td>`;
            op += `<td class="instrucao">${this.bytecodes[i]}</td>`;
            if (umOperando.indexOf(this.bytecodes[i]) > -1) {
                i += 1;

                if (typeof this.bytecodes[i] === 'string') {
                    op += `<td class="operandos string">"${this.bytecodes[i]}"</td>`;
                } else {
                    op += `<td class="operandos">${this.bytecodes[i]}</td>`;
                }
                if (['LOAD_G', 'ALOAD_G', 'STORE_G', 'ASTORE_G'].indexOf(this.bytecodes[i - 1]) > -1) {
                    op += `<td class="comentario">// ${this.estrutura.globaisNomes[this.bytecodes[i]]}</td>`;
                }
            } else if (doisOperandos.indexOf(this.bytecodes[i]) > -1) {
                i += 1;
                op += `<td class="operandos">${this.bytecodes[i]}`;
                i += 1;
                op += `, ${this.bytecodes[i]}</td>`;
                if (this.bytecodes[i - 2] === 'INVOKE_U') {
                    op += `<td class="comentario">// ${this.estrutura.funcoes[this.bytecodes[i - 1]].nome}()</td>`;
                }
                if (this.bytecodes[i - 2] === 'INVOKE_S') {
                    op += `<td class="comentario">// ${funcoes[this.bytecodes[i - 1]].nome}()</td>`;
                }
            }
            texto += `${op}</tr>`;
        }
        return `${texto}</table>`;
    }

    getTokensEmTexto() {
        if (this.erro) return 'Existe algum erro';
        let texto = '<table class="tokens">';
        for (let i = 0; i < this.tokens.length; i += 1) {
            let op = `<tr><td class="linha">${i}:</td>`;
            op += `<td class="tipo">${this.tokens[i].tipo}</td>`;
            op += `<td class="valor">${this.tokens[i].valor}</td>`;
            op += `<td class="posicao">[${this.tokens[i].posicao.linha}, ${this.tokens[i].posicao.coluna}]</td>`;
            texto += `${op}</tr>`;
        }
        return `${texto}</table>`;
    }
}
