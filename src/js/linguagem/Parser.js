import tokensTipos from './tokens';
import funcoes from './funcoes';

const precedenciaOperadores = [
    { tipo: ['OR'] },
    { tipo: ['AND'] },
    { tipo: ['XOR'] },
    { tipo: ['EQUAL', 'DIFF'] },
    { tipo: ['LTE', 'LT', 'GTE', 'GT'] },
    { tipo: ['ADD', 'SUB'] },
    { tipo: ['POW', 'MULT', 'DIV', 'MOD'] },
    // { tipo: "POW", func: ruleUnary }];
    { func: true },
];

export default class Parser {
    constructor(saida) {
        this.saida = saida;
    }

    getEstrutura(tokens) {
        if (!tokens) {
            return null;
        }
        this.erro = false;

        this.tokens = tokens;
        this.estrutura = { funcoes: [], arvore: [], globais: 0, globaisNomes: [] };

        this.totalTokens = this.tokens.length;
        this.tokenIndice = -1;
        this.token = null;

        this.funcao = false;

        this.loop = false;

        this.globais = [];
        this.locais = [];

        this.globaisConstantes = [];
        this.locaisConstantes = [];

        this.avancar();

        this.bloco(this.estrutura.arvore, true);
        this.estrutura.globais = this.globais.length;
        this.estrutura.globaisNomes = this.globais;

        if (this.erro) {
            return null;
        }

        return this.estrutura;
    }

    ultimo() {
        return this.tokens[this.tokenIndice - 1];
    }

    proximo() {
        return this.tokenIndice + 1 < this.totalTokens ? this.tokens[this.tokenIndice + 1] : { tipo: '' };
    }

    avancar() {
        this.tokenIndice += 1;
        if (this.tokenIndice < this.totalTokens) {
            this.token = this.tokens[this.tokenIndice];
            return this.token;
        }
        this.token = null;
        return this.token;
    }

    descricao(tipo = null) {
        if (tipo) {
            // return tipo === 'IDENTIFICATOR'
            //     ? tokensTipos.find((e) => e.nome === tipo).valor
            //     : tokensTipos.find((e) => e.nome === tipo).descricao;
            return tokensTipos.find((e) => e.nome === tipo).descricao;
        }
        if (this.token && this.token.tipo) {
            return this.token.tipo === 'IDENTIFICATOR'
                ? this.token.valor
                : tokensTipos.find((e) => e.nome === this.token.tipo).descricao;
        }
        return 'fim do código';
    }

    espera(tipo) {
        if (this.token && this.token.tipo === tipo) {
            this.avancar();
            return true;
        }

        if (!this.token) {
            this.saida.erro(`Esperado '${this.descricao(tipo)}' porém nada mais foi encontrado`);
        } else {
            this.saida.erro(
                `Esperado '${this.descricao(tipo)}' porém foi encontrado '${this.token.valor}'`,
                this.token.posicao
            );
        }
        this.erro = true;
        return false;
    }

    aceita(tipo) {
        if (this.token && this.token.tipo === tipo) {
            this.avancar();
            return true;
        }
        return false;
    }

    getVariavel(nome, criar = true, constante) {
        // nome pode vir vázio, pois são variáveis anônimas usadas no foreach para contador e items
        if (this.funcao) {
            if (this.locais.includes(nome) && nome) return { indice: this.locais.indexOf(nome), local: true };
            if (this.globais.includes(nome) && nome) return { indice: this.globais.indexOf(nome), local: false };
            if (criar) {
                this.locais.push(nome);
                if (constante) this.locaisConstantes.push(nome);
                return { indice: this.locais.length - 1, local: true };
            }
            return false;
        }
        if (this.globais.includes(nome) && nome) return { indice: this.globais.indexOf(nome), local: false };
        if (criar) {
            this.globais.push(nome);
            if (constante) this.globaisConstantes.push(nome);
            return { indice: this.globais.length - 1, local: false };
        }
        return false;
    }

    existeConstante(nome) {
        if (this.funcao) {
            if (this.locaisConstantes.includes(nome)) return true;
            if (this.globaisConstantes.includes(nome)) return true;
            return false;
        }
        if (this.globaisConstantes.includes(nome)) return true;
        return false;
    }

    instrucao(arvore, permitirFuncoes = true) {
        if (!this.token || this.erro) {
            return false;
        }

        switch (this.token.tipo) {
            case 'FUNCTION': {
                if (!permitirFuncoes) {
                    this.saida.erro('Não é permitido declarar funções dentro de funções');
                    this.erro = true;
                    return false;
                }
                this.avancar();
                this.funcao = true;
                this.locais = [];
                const nome = this.token.valor.toLowerCase();
                const { posicao } = this.token;
                const parametros = [];
                if (this.espera('IDENTIFICATOR')) {
                    if (this.espera('OPEN_PARENTHESIS')) {
                        if (this.aceita('IDENTIFICATOR')) {
                            this.getVariavel(this.ultimo().valor);
                            parametros.push(this.ultimo().valor);
                            while (!this.erro && this.aceita('COMMA')) {
                                if (!this.espera('IDENTIFICATOR')) return false;
                                this.getVariavel(this.ultimo().valor);
                                parametros.push(this.ultimo().valor);
                            }
                        }

                        // fn()
                        // fn(a)
                        // fn(a,b)
                        // fn(1)
                        // fn(,)
                        // fn(a,)

                        if (this.espera('CLOSE_PARENTHESIS')) {
                            const arvoreFuncao = [];

                            // adicionamos a função antes de chamar o bloco, pois se ela fizer uma chamada recursiva
                            // ela precisa encontrar ela mesmo.
                            const funcao = { nome, posicao, parametros: [], locais: [], locaisNomes: [] };
                            funcao.parametros = parametros;
                            this.estrutura.funcoes.push(funcao);

                            if (this.bloco(arvoreFuncao)) {
                                arvoreFuncao.push({ op: 'RETURN' });
                                funcao.arvore = arvoreFuncao;
                                funcao.locais = this.locais.length;
                                funcao.locaisNomes = this.locais;

                                this.funcao = false;
                                return true;
                            }
                        }
                    }
                }
                break;
            }

            case 'IF': {
                const { posicao } = this.token;
                this.avancar();
                const condicao = this.expressao();
                this.aceita('THEN');
                const instrucoes = { verdadeiro: [], falso: [] };
                if (this.bloco(instrucoes.verdadeiro)) {
                    if (this.aceita('ELSE')) {
                        if (!this.bloco(instrucoes.falso)) {
                            break;
                        }
                    }

                    arvore.push({ op: 'IF', posicao, condicao, instrucoes });
                    return true;
                }
                break;
            }

            case 'WHILE': {
                const { posicao } = this.token;
                this.avancar();
                const condicao = this.expressao(0);
                if (condicao) {
                    const situacaoLoop = this.loop;
                    this.loop = true;
                    const instrucoes = [];
                    if (this.bloco(instrucoes)) {
                        arvore.push({ op: 'WHILE', posicao, condicao, instrucoes });
                        this.loop = situacaoLoop;
                        return true;
                    }
                }
                break;
            }

            case 'FOR': {
                const { posicao } = this.token;
                if (this.proximo().tipo === 'IDENTIFICATOR') {
                    this.avancar();
                    const variavel = this.variavel();
                    if (variavel) {
                        if (this.espera('FROM')) {
                            const expressao1 = this.expressao();
                            if (expressao1) {
                                if (this.espera('TO')) {
                                    const expressao2 = this.expressao();
                                    if (expressao2) {
                                        let passo = null;
                                        if (this.aceita('STEP')) {
                                            passo = this.expressao();
                                            if (!passo) break;
                                        }
                                        if (this.espera('DO')) {
                                            const situacaoLoop = this.loop;
                                            this.loop = true;
                                            const instrucoes = [];
                                            if (this.bloco(instrucoes)) {
                                                arvore.push({
                                                    op: 'FOR',
                                                    variavel,
                                                    expressao1,
                                                    expressao2,
                                                    instrucoes,
                                                    posicao,
                                                    passo,
                                                });
                                                this.loop = situacaoLoop;
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    this.avancar();
                    if (this.espera('OPEN_PARENTHESIS')) {
                        if (this.token && this.token.tipo === 'IDENTIFICATOR') {
                            const variavel = this.variavel();
                            if (variavel) {
                                if (this.espera('ASSIGN') && this.ultimo().valor === '=') {
                                    const expressao1 = this.expressao();
                                    if (expressao1) {
                                        if (this.espera('SEMICOLON')) {
                                            const expressao2 = this.expressao();
                                            if (expressao2) {
                                                if (this.espera('SEMICOLON')) {
                                                    const expressao3 = this.expressao();
                                                    if (expressao3) {
                                                        if (this.espera('CLOSE_PARENTHESIS')) {
                                                            const situacaoLoop = this.loop;
                                                            this.loop = true;
                                                            const instrucoes = [];
                                                            if (this.bloco(instrucoes)) {
                                                                arvore.push({
                                                                    op: 'FOR2',
                                                                    variavel,
                                                                    expressao1,
                                                                    expressao2,
                                                                    expressao3,
                                                                    instrucoes,
                                                                    posicao,
                                                                });
                                                                this.loop = situacaoLoop;
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            }

            case 'FOREACH': {
                const { posicao } = this.token;
                this.avancar();
                if (this.espera('IDENTIFICATOR')) {
                    const variavel = this.getVariavel(this.ultimo().valor);
                    const items = this.getVariavel('');
                    let contador;
                    if (this.aceita('COMMA')) {
                        if (this.espera('IDENTIFICATOR')) {
                            contador = this.getVariavel(this.ultimo().valor);
                        } else {
                            break;
                        }
                    } else {
                        contador = this.getVariavel('');
                    }
                    if (variavel) {
                        if (this.espera('IN')) {
                            const expressao = this.expressao();
                            if (expressao) {
                                const situacaoLoop = this.loop;
                                this.loop = true;
                                const instrucoes = [];
                                if (this.bloco(instrucoes)) {
                                    arvore.push({
                                        op: 'FOREACH',
                                        variavel,
                                        contador,
                                        items,
                                        expressao,
                                        instrucoes,
                                        posicao,
                                    });
                                    this.loop = situacaoLoop;
                                    return true;
                                }
                            }
                        }
                    }
                }

                break;
            }

            case 'DO': {
                const { posicao } = this.token;
                this.avancar();
                const situacaoLoop = this.loop;
                this.loop = true;
                const instrucoes = [];
                if (this.bloco(instrucoes)) {
                    if (this.espera('WHILE')) {
                        const condicao = this.expressao(0);
                        this.aceita('SEMICOLON');
                        if (condicao) {
                            arvore.push({ op: 'DO', posicao, condicao, instrucoes });
                            this.loop = situacaoLoop;
                            return true;
                        }
                    }
                }
                break;
            }

            case 'SWITCH': {
                const { posicao } = this.token;
                this.avancar();
                const expressao = this.expressao(0);
                if (expressao) {
                    if (this.espera('OPEN_CURLY')) {
                        const casos = [];
                        while (!this.erro && (this.aceita('CASE') || this.aceita('DEFAULT'))) {
                            const padrao = this.ultimo().tipo === 'DEFAULT';
                            const casoPosicao = this.ultimo().posicao;
                            let valor = null;
                            if (!padrao) {
                                if (this.aceita('NUMBER') || this.aceita('STRING')) {
                                    valor =
                                        this.ultimo().tipo === 'NUMBER'
                                            ? parseInt(this.ultimo().valor, 10)
                                            : this.ultimo().valor;
                                } else {
                                    this.saida.erro('Esperado um número ou um texto', posicao);
                                    this.erro = true;
                                    return false;
                                }
                            }
                            if (this.espera('COLON')) {
                                const situacaoLoop = this.loop;
                                this.loop = true;
                                const instrucoes = [];
                                if (this.bloco(instrucoes)) {
                                    casos.push({
                                        op: padrao ? 'DEFAULT' : 'CASE',
                                        valor,
                                        posicao: casoPosicao,
                                        instrucoes,
                                    });
                                    this.loop = situacaoLoop;
                                } else {
                                    this.erro = true;
                                    return false;
                                }
                            } else {
                                this.erro = true;
                                return false;
                            }
                        }
                        if (this.espera('CLOSE_CURLY')) {
                            arvore.push({ op: 'SWITCH', expressao, casos });
                            return true;
                        }
                    }
                }
                break;
            }

            case 'CONST':
            case 'VAR': {
                const constante = this.token.tipo === 'CONST';
                this.avancar();
                if (this.espera('IDENTIFICATOR')) {
                    const { valor, posicao } = this.ultimo();
                    if (!this.getVariavel(valor, false)) {
                        const variavel = this.getVariavel(valor, true, constante);

                        if (this.token && this.token.tipo === 'ASSIGN' && this.token.valor === '=') {
                            this.avancar();
                            const expressao = this.expressao();
                            if (expressao) {
                                arvore.push({ op: 'DECLARATION', variavel, expressao, posicao });
                            } else {
                                return false;
                            }
                        }

                        this.aceita('SEMICOLON');
                        // arvore.push({ op: 'DECLARATION', variavel, posicao });
                        return true;
                    }
                    this.erro = true;
                    this.saida.erro(`Variável '${valor}' redeclarada`, posicao);
                    return false;
                }
                break;
            }

            case 'CONTINUE':
            case 'BREAK': {
                if (!this.loop) {
                    this.saida.erro(
                        `Não é possível usar '${this.token.valor}' fora de um laço de repetição`,
                        this.token.posicao
                    );
                    this.erro = true;
                    return false;
                }
                const { posicao, tipo } = this.token;
                this.avancar();
                this.aceita('SEMICOLON');
                arvore.push({ op: tipo, posicao });
                return true;
            }

            case 'IDENTIFICATOR': {
                const { posicao, valor } = this.token;

                if (this.proximo().tipo === 'OPEN_PARENTHESIS') {
                    const invocacao = this.invocacao();
                    if (invocacao) {
                        arvore.push(invocacao);
                        this.aceita('SEMICOLON');
                        return true;
                    }
                }


                const variavel = this.variavel();
                if (variavel) {
                    if (this.aceita('ASSIGN')) {
                        if (this.existeConstante(valor)) {
                            this.erro = true;
                            this.saida.erro(`Não é possível atribuir um valor a constante ${valor}`, posicao);
                            return false;
                        }

                        const tipo = this.ultimo().valor;
                        const expressao = this.expressao(0);
                        if (expressao) {
                            arvore.push({ op: 'ASSIGN', variavel, tipo, expressao, posicao });
                            this.aceita('SEMICOLON');
                            return true;
                        }
                        return false;
                    }
                    if (this.aceita('INC') || this.aceita('DEC')) {
                        const { tipo } = this.ultimo();
                        // quando não é dentro de uma expressão também criamos um L, apesar de ter que ser um R. R deixa uma valor na pilha.
                        arvore.push({ op: `L${tipo}`, variavel, posicao });
                        this.aceita('SEMICOLON');
                        return true;
                    }

                    if (!variavel.indices.length ||
                        (variavel.indices.length && variavel.indices[variavel.indices.length - 1].op !== 'INVOKE_VIRTUAL')) {
                        this.saida.erro(`Não é possivel invocar ${this.ultimo().valor}`, this.ultimo().posicao);
                        this.erro = true;
                        return false;
                    }

                    arvore.push({ op: 'VARIABLE', variavel, posicao });
                    this.aceita('SEMICOLON');
                    return true;
                }

                // this.saida.erro(`Instrução não reconhecida ${this.ultimo().valor}`, this.ultimo().posicao);
                // this.erro = true;
                // return false;
            }

            case 'INC':
            case 'DEC': {
                const { posicao, tipo } = this.token;
                this.avancar();
                const variavel = this.variavel(false);
                if (variavel) {
                    // quando não é dentro de uma expressão também criamos um L, apesar de ter que ser um R. R deixa uma valor na pilha.
                    arvore.push({ op: `L${tipo}`, variavel, posicao });
                    this.avancar();
                    this.aceita('SEMICOLON');
                    return true;
                }

                return false;
            }

            case 'RETURN': {
                this.avancar();
                const expressao = this.expressao(0);
                if (expressao) {
                    arvore.push({ op: 'RETURN', expressao });
                    this.aceita('SEMICOLON');
                    return true;
                }
                break;
            }

            default: {
                if (!this.erro) {
                    this.saida.erro(
                        `Instrução não reconhecida ${this.descricao()}`,
                        this.token ? this.token.posicao : null
                    );
                    this.erro = true;
                    return false;
                }
            }
        }
        return false;
    }

    bloco(arvore, principal = false) {
        if (principal) {
            let instrucao = this.instrucao(arvore, true);
            while (!this.erro && this.token && instrucao) {
                instrucao = this.instrucao(arvore, true);
            }
            if (this.erro || !instrucao) {
                this.erro = true;
                return false;
            }
            return true;
        }

        if (this.aceita('OPEN_CURLY')) {
            if (this.token && this.token.tipo !== 'CLOSE_CURLY') {
                let instrucao = this.instrucao(arvore, true);
                while (!this.erro && this.token && this.token.tipo !== 'CLOSE_CURLY' && instrucao) {
                    instrucao = this.instrucao(arvore, true);
                }
            }
            if (!this.espera('CLOSE_CURLY') || this.erro) {
                this.erro = true;
                return false;
            }
            return true;
        }

        if (this.instrucao(arvore, principal)) {
            return true;
        }

        this.erro = true;
        return false;
    }

    expressaoElemento() {
        if (this.erro) return false;
        if (!this.token) {
            this.erro = true;
            this.saida.erro('Esperado uma expressão');
            return false;
        }

        const { tipo, valor, posicao } = this.token;

        switch (this.token.tipo) {
            case 'INC':
            case 'DEC': {
                this.avancar();
                const variavel = this.variavel(false);
                if (variavel) {
                    return { op: `L${tipo}`, variavel, posicao };
                }
                return false;
            }
            case 'IDENTIFICATOR': {
                if (this.proximo().tipo === 'OPEN_PARENTHESIS') return this.invocacao();
                const variavel = this.variavel(false);
                if (variavel) {
                    if (this.aceita('INC') || this.aceita('DEC')) {
                        return { op: `R${this.ultimo().tipo}`, variavel, posicao };
                    }
                    return { op: 'VARIABLE', variavel, posicao };
                }
                return false;
            }
            case 'NULL':
                this.avancar();
                return { op: 'NULL', valor, posicao };
            case 'BOOLEAN':
                this.avancar();
                return { op: 'BOOLEAN', valor, posicao };
            case 'SUB':
                this.avancar();
                if (this.espera('NUMBER')) {
                    return { op: 'NUMBER', valor: `-${this.ultimo().valor}`, posicao };
                }
                return false;
            case 'ADD':
                this.avancar();
                if (this.espera('NUMBER')) {
                    return { op: 'NUMBER', valor: `+${this.ultimo().valor}`, posicao };
                }
                return false;
            case 'NUMBER':
                this.avancar();
                return { op: 'NUMBER', valor, posicao };
            case 'STRING':
                this.avancar();
                return { op: 'STRING', valor, posicao };
            case 'NOT': {
                this.avancar();
                const expressao = this.expressao(0);
                if (!expressao) {
                    return false;
                }
                return { op: 'NOT', expressao, posicao };
            }
            case 'OPEN_PARENTHESIS': {
                this.avancar();
                const expressao = this.expressao(0);
                if (!expressao) {
                    return false;
                }
                if (!this.espera('CLOSE_PARENTHESIS')) return false;
                return expressao;
            }
            case 'OPEN_SQUARE': {
                this.avancar();
                const valores = [];
                if (this.aceita('CLOSE_SQUARE')) {
                    return { op: 'ARRAY', valores, posicao };
                }
                let expressao = this.expressao(0);
                valores.push(expressao);
                while (expressao && this.aceita('COMMA')) {
                    expressao = this.expressao(0);
                    valores.push(expressao);
                }
                if (!this.espera('CLOSE_SQUARE')) return false;
                valores.reverse();
                return { op: 'ARRAY', valores, posicao };
            }
            default: {
                this.saida.erro('Erro na expressão', posicao);
                this.erro = true;
                return false;
            }
        }
    }

    subexpressao(id = 0) {
        if (this.erro) return false;

        let no;
        let pai;
        let tmp;
        // 1 + 2 * 5
        // 1 + (2 * 5)
        no = precedenciaOperadores[id].func ? this.expressaoElemento() : this.subexpressao(id + 1);
        if (!no) return false;

        while (
            !this.erro &&
            !precedenciaOperadores[id].func &&
            this.token &&
            precedenciaOperadores[id].tipo.indexOf(this.token.tipo) > -1
        ) {
            pai = { op: this.token.tipo, expressao: [no] };
            this.avancar();
            tmp = precedenciaOperadores[id].func ? this.expressaoElemento() : this.subexpressao(id + 1);
            if (!tmp) {
                return false;
            }
            pai.expressao.push(tmp);
            no = pai;
        }
        if (this.erro) {
            return false;
        }

        return no;
    }

    expressao() {
        const exp = this.subexpressao();

        if (exp) {
            if (this.aceita('QUESTION')) {
                const instrucoes = { verdadeiro: [], falso: [] };
                instrucoes.verdadeiro = this.subexpressao();
                if (instrucoes.verdadeiro && this.espera('COLON')) {
                    instrucoes.falso = this.subexpressao();
                    if (instrucoes.falso) {
                        return { op: 'TERNARY', condicao: exp, instrucoes };
                    }
                }
                return false;
            }
        }

        return exp;
    }

    variavel(criar = true) {
        // quem chama já deve ter verificado se é um identificator
        const { posicao, valor } = this.token;
        const variavelInfo = this.getVariavel(valor, criar);
        const indices = [];

        if (!criar && !variavelInfo) {
            this.saida.erro(`Variável "${valor}" não definida`, posicao);
            this.erro = true;
            return false;
        }
        if (this.proximo().tipo === 'OPEN_SQUARE' || this.proximo().tipo === 'DOT') {
            this.avancar();
            while (this.token && (this.token.tipo === 'OPEN_SQUARE' || this.token.tipo === 'DOT')) {
                if (this.token.tipo === 'OPEN_SQUARE') {
                    this.avancar();
                    const expressao = this.expressao();
                    if (expressao) {
                        if (this.espera('CLOSE_SQUARE')) {
                            indices.push(expressao);
                        } else return false;
                    } else return false;
                } else if (this.token.tipo === 'DOT') {
                    this.avancar();
                    if (this.espera('IDENTIFICATOR')) {
                        const nome = this.ultimo().valor;
                        if (this.aceita('OPEN_PARENTHESIS')) {
                            const argumentos = [];

                            while (!this.erro && this.token && this.token.tipo !== 'CLOSE_PARENTHESIS') {
                                let expressao = this.expressao();
                                if (expressao) {
                                    argumentos.push(expressao);
                                    while (this.aceita('COMMA')) {
                                        expressao = this.expressao();
                                        argumentos.push(expressao);
                                    }
                                }
                            }

                            this.espera('CLOSE_PARENTHESIS');
                            argumentos.reverse();
                            indices.push({ op: 'INVOKE_VIRTUAL', valor: nome, argumentos });
                        } else {
                            indices.push({ op: 'FIELD', valor: nome });
                        }
                    } else return false;
                }
            }
            if (this.erro) return false;
            return { ...variavelInfo, posicao, indices };
        }
        this.avancar();
        return { ...variavelInfo, posicao, indices };

        return false;
    }

    invocacao() {
        if (this.erro) return false;

        const { posicao } = this.token;
        const nome = this.token.valor.toLowerCase();
        const argumentos = [];
        this.avancar();

        // (exp,exp,exp,exp)

        if (this.espera('OPEN_PARENTHESIS')) {
            while (!this.erro && this.token && this.token.tipo !== 'CLOSE_PARENTHESIS') {
                let expressao = this.expressao();
                if (expressao) {
                    argumentos.push(expressao);
                    while (this.aceita('COMMA')) {
                        expressao = this.expressao();
                        argumentos.push(expressao);
                    }
                }
            }

            if (this.espera('CLOSE_PARENTHESIS')) {
                let funcao;
                let indice;
                let tipo = 'S';

                funcao = funcoes.find((e, i) => {
                    indice = i;
                    return e.nome === nome;
                });
                if (!funcao) {
                    funcao = this.estrutura.funcoes.find((e, i) => {
                        indice = i;
                        return e.nome === nome;
                    });
                    tipo = 'U';
                }

                if (funcao) {
                    const totalParametros = funcao.parametros.length;
                    const totalArgumentos = argumentos.length;

                    if (totalArgumentos > totalParametros || totalArgumentos < funcao.min) {
                        this.saida.erro(
                            `Número de parâmetros inválido para chamar a função '${nome}(${funcao.parametros
                                .map((e) => (e.opcional === true ? `[${e.nome}]` : e.nome))
                                .join(', ')})'. São esperados ${funcao.parametros.length
                            } parâmetro(s), porém foram encontrados ${argumentos.length} parâmetros`,
                            posicao
                        );
                        this.erro = true;
                        return false;
                    }
                    argumentos.reverse();
                    return { op: 'CALL', nome, indice, tipo, argumentos, posicao };
                }
                this.erro = true;
                this.saida.erro(`A função '${nome}()' não existe`, posicao);
            }
        }

        return false;
    }
}
