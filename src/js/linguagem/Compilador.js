import Saida from './Saida';

export default class Compilador {
    constructor(saida) {
        this.saida = new Saida(saida);
    }

    compilar(estrutura, debug = false) {
        //    this.arvore.bytecodes = [];

        if (!estrutura) {
            return null;
        }

        this.debug = debug;
        this.estrutura = estrutura;
        this.estrutura.bytecodes = [];
        this.loops = [];
        this.loopsUltimo = [];

        estrutura.funcoes.forEach((funcao) => {
            const f = funcao;
            f.inicio = this.estrutura.bytecodes.length <= 0 ? 0 : this.estrutura.bytecodes.length;
            this.compilarInstrucoes(f.arvore);
        });
        this.estrutura.inicio = this.estrutura.bytecodes.length <= 0 ? 0 : this.estrutura.bytecodes.length;
        this.compilarInstrucoes(this.estrutura.arvore);
        this.loops.forEach((loop) => {
            if (loop.breaks.length) {
                loop.breaks.forEach((breakk) => {
                    this.estrutura.bytecodes[breakk] = loop.fim;
                });
            }
            if (loop.continues.length) {
                loop.continues.forEach((continuee) => {
                    this.estrutura.bytecodes[continuee] = loop.inicio;
                });
            }
        });
        return this.estrutura;
    }

    compilarInstrucoes(instrucoes) {
        instrucoes.forEach((instrucao) => {
            if (this.debug && instrucao.posicao) {
                this.estrutura.bytecodes.push('DEBUG_L');
                this.estrutura.bytecodes.push(instrucao.posicao.linha);
            }

            switch (instrucao.op) {
                case 'DECLARATION': {
                    this.expressao(instrucao.expressao);
                    this.estrutura.bytecodes.push(
                        instrucao.variavel.local ? 'STORE' : 'STORE_G',
                        instrucao.variavel.indice
                    );
                    break;
                }
                case 'VARIABLE': {

                    this.subexpressao(instrucao);
                    break;
                }
                case 'ASSIGN': {
                    if (['=', '<-', 'recebe'].indexOf(instrucao.tipo) === -1) {
                        this.estrutura.bytecodes.push(
                            instrucao.variavel.local ? 'LOAD' : 'LOAD_G',
                            instrucao.variavel.indice
                        );
                        if (instrucao.variavel.indices.length) {
                            instrucao.variavel.indices.forEach((e) => {
                                if (e.op === 'FIELD') {
                                    this.estrutura.bytecodes.push('GETFIELD', e.valor);
                                } else {
                                    this.expressao(e);
                                    this.estrutura.bytecodes.push('ALOAD');
                                }
                            });
                        }
                        this.expressao(instrucao.expressao);
                        // eslint-disable-next-line default-case
                        switch (instrucao.tipo) {
                            case '+=':
                                this.estrutura.bytecodes.push('ADD');
                                break;
                            case '-=':
                                this.estrutura.bytecodes.push('SUB');
                                break;
                            case '/=':
                                this.estrutura.bytecodes.push('DIV');
                                break;
                            case '*=':
                                this.estrutura.bytecodes.push('MULT');
                                break;
                            case '%=':
                                this.estrutura.bytecodes.push('MOD');
                                break;
                            case '**=':
                                this.estrutura.bytecodes.push('POW');
                                break;
                        }
                    } else {
                        this.expressao(instrucao.expressao);
                    }

                    /*
                    
                    console(a[77])
                    LOAD A
                    PUSH 77
                    ALOAD

                    console(a[77][103])
                    LOAD A
                    PUSH 77
                    ALOAD             
                    PUSH 103
                    ALOAD       

                    a[77] = 88
                    LOAD a
                    PUSH 77
                    ASTORE

                    a[77][103] = 88
                    LOAD a
                    PUSH 77
                    ALOAD
                    PUSH 103
                    ASTORE                    



                    console(a.campo)
                    LOAD a
                    PUSH campo
                    GETFIELD

                    a.campo = 77
                    LOAD a
                    PUSH campo
                    ASTORE



                    */
                    if (instrucao.variavel.indices.length) {
                        this.estrutura.bytecodes.push(
                            instrucao.variavel.local ? 'LOAD' : 'LOAD_G',
                            instrucao.variavel.indice
                        );
                        let campo = null;
                        instrucao.variavel.indices.forEach((e, i) => {
                            if (e.op === 'FIELD') {
                                campo = e.valor;
                                if (i < instrucao.variavel.indices.length - 1) {
                                    this.estrutura.bytecodes.push('GETFIELD', e.valor);
                                }
                            } else {
                                campo = null;
                                this.expressao(e);
                                if (i < instrucao.variavel.indices.length - 1) {
                                    this.estrutura.bytecodes.push('ALOAD');
                                }
                            }
                        });
                        if (campo) {
                            this.estrutura.bytecodes.push('PUTFIELD', campo);
                        } else {
                            this.estrutura.bytecodes.push('ASTORE');
                        }
                        break;
                    } else {
                        this.estrutura.bytecodes.push(
                            instrucao.variavel.local ? 'STORE' : 'STORE_G',
                            instrucao.variavel.indice
                        );
                    }
                    break;
                }
                case 'CALL': {
                    this.chamar(instrucao);
                    this.estrutura.bytecodes.push('POP');
                    break;
                }
                case 'RETURN': {
                    if (instrucao.expressao) {
                        this.expressao(instrucao.expressao);
                    } else {
                        this.estrutura.bytecodes.push('PUSH', 0);
                    }
                    this.estrutura.bytecodes.push('RETURN');
                    break;
                }
                // quando não for dentro de expressão só vai ser L
                // case 'RINC':
                // case 'RDEC':
                case 'LINC':
                case 'LDEC': {
                    this.estrutura.bytecodes.push(instrucao.variavel.local ? 'LOAD' : 'LOAD_G');
                    this.estrutura.bytecodes.push(instrucao.variavel.indice);
                    if (instrucao.variavel.indices.length) {
                        instrucao.variavel.indices.forEach((e) => {
                            if (e.op === 'FIELD') {
                                this.estrutura.bytecodes.push('GETFIELD', e.valor);
                            } else {
                                this.expressao(e);
                                this.estrutura.bytecodes.push('ALOAD');
                            }
                        });
                    }
                    this.estrutura.bytecodes.push('PUSH', 1);
                    this.estrutura.bytecodes.push(instrucao.op === 'RINC' || instrucao.op === 'LINC' ? 'ADD' : 'SUB');

                    if (instrucao.variavel.indices.length) {
                        this.estrutura.bytecodes.push(
                            instrucao.variavel.local ? 'LOAD' : 'LOAD_G',
                            instrucao.variavel.indice
                        );
                        let campo = null;
                        instrucao.variavel.indices.forEach((e, i) => {
                            if (e.op === 'FIELD') {
                                campo = e.valor;
                                if (i < instrucao.variavel.indices.length - 1) {
                                    this.estrutura.bytecodes.push('GETFIELD', e.valor);
                                }
                            } else {
                                campo = null;
                                this.expressao(e);
                                if (i < instrucao.variavel.indices.length - 1) {
                                    this.estrutura.bytecodes.push('ALOAD');
                                }
                            }
                        });
                        if (campo) {
                            this.estrutura.bytecodes.push('PUTFIELD', campo);
                        } else {
                            this.estrutura.bytecodes.push('ASTORE');
                        }
                    } else {
                        this.estrutura.bytecodes.push(
                            instrucao.variavel.local ? 'STORE' : 'STORE_G',
                            instrucao.variavel.indice
                        );
                    }
                    break;
                }
                case 'IF': {
                    this.expressao(instrucao.condicao);
                    const pBCFalso = this.estrutura.bytecodes.push('IF_FALSE', 0) - 1;
                    this.compilarInstrucoes(instrucao.instrucoes.verdadeiro);
                    const pBCFim = this.estrutura.bytecodes.push('GOTO', 0) - 1;
                    this.estrutura.bytecodes[pBCFalso] = this.estrutura.bytecodes.length;
                    this.compilarInstrucoes(instrucao.instrucoes.falso);
                    this.estrutura.bytecodes[pBCFim] = this.estrutura.bytecodes.length;
                    break;
                }
                case 'FOR': {
                    this.expressao(instrucao.expressao1);

                    this.estrutura.bytecodes.push(
                        instrucao.variavel.local ? 'STORE' : 'STORE_G',
                        instrucao.variavel.indice
                    );

                    const posicaoGotoInicio = this.estrutura.bytecodes.length;
                    const loop = this.loops.push({ inicio: posicaoGotoInicio, fim: 0, breaks: [], continues: [] });
                    this.loopsUltimo.push(this.loops.length - 1);

                    this.estrutura.bytecodes.push(
                        instrucao.variavel.local ? 'LOAD' : 'LOAD_G',
                        instrucao.variavel.indice
                    );
                    this.expressao(instrucao.expressao2);
                    this.estrutura.bytecodes.push('LTE');
                    const pBCFim = this.estrutura.bytecodes.push('IF_FALSE', 0) - 1;
                    this.compilarInstrucoes(instrucao.instrucoes);

                    this.estrutura.bytecodes.push(instrucao.variavel.local ? 'LOAD' : 'LOAD_G');
                    this.estrutura.bytecodes.push(instrucao.variavel.indice);
                    if (instrucao.passo) {
                        this.expressao(instrucao.passo);
                    } else {
                        this.estrutura.bytecodes.push('PUSH', 1);
                    }
                    this.estrutura.bytecodes.push('ADD');
                    this.estrutura.bytecodes.push(instrucao.variavel.local ? 'STORE' : 'STORE_G');
                    this.estrutura.bytecodes.push(instrucao.variavel.indice);

                    this.estrutura.bytecodes[pBCFim] = this.estrutura.bytecodes.push('GOTO', posicaoGotoInicio);
                    this.loops[loop - 1].fim = this.estrutura.bytecodes.length;
                    this.loopsUltimo.pop();
                    break;
                }
                case 'FOR2': {
                    this.expressao(instrucao.expressao1);

                    this.estrutura.bytecodes.push(
                        instrucao.variavel.local ? 'STORE' : 'STORE_G',
                        instrucao.variavel.indice
                    );

                    const posicaoGotoInicio = this.estrutura.bytecodes.length;
                    const loop = this.loops.push({ inicio: posicaoGotoInicio, fim: 0, breaks: [], continues: [] });
                    this.loopsUltimo.push(this.loops.length - 1);

                    this.expressao(instrucao.expressao2);
                    const pBCFim = this.estrutura.bytecodes.push('IF_FALSE', 0) - 1;
                    this.compilarInstrucoes(instrucao.instrucoes);

                    this.estrutura.bytecodes.push(instrucao.variavel.local ? 'LOAD' : 'LOAD_G');
                    this.estrutura.bytecodes.push(instrucao.variavel.indice);
                    this.expressao(instrucao.expressao3);

                    this.estrutura.bytecodes[pBCFim] = this.estrutura.bytecodes.push('GOTO', posicaoGotoInicio);
                    this.loops[loop - 1].fim = this.estrutura.bytecodes.length;
                    this.loopsUltimo.pop();
                    break;
                }
                case 'FOREACH': {
                    /*
                                                pilha
                    PUSH -1                     -1
                    STORE contador              
                    EXP                         []
                    STORE items                    
                    LOAD contador               -1               inicio
                    PUSH 1                      -1, 0
                    ADD                         0
                    DUP                         0, 0
                    DUP                         0, 0, 0
                    STORE contador              0, 0                    
                    LOAD items                  0, 0, []
                    ARRAYLENGTH                 0, 0, 3
                    LT                          0, true
                    IF_FALSE                    0, 
                    LOAD items                  0, []
                    ARRAYVALUE                  'x'
                    STORE item                  
                    ...             
                    GOTO inicio
                
                    */

                    this.estrutura.bytecodes.push('PUSH', -1);
                    this.estrutura.bytecodes.push(
                        instrucao.contador.local ? 'STORE' : 'STORE_G',
                        instrucao.contador.indice
                    );
                    this.expressao(instrucao.expressao);
                    this.estrutura.bytecodes.push(instrucao.items.local ? 'STORE' : 'STORE_G', instrucao.items.indice);

                    const posicaoGotoInicio = this.estrutura.bytecodes.length;
                    const loop = this.loops.push({ inicio: posicaoGotoInicio, fim: 0, breaks: [], continues: [] });
                    this.loopsUltimo.push(this.loops.length - 1);

                    if (this.debug) {
                        this.estrutura.bytecodes.push('DEBUG_L', instrucao.posicao.linha);
                    }

                    this.estrutura.bytecodes.push(
                        instrucao.contador.local ? 'LOAD' : 'LOAD_G',
                        instrucao.contador.indice
                    );
                    this.estrutura.bytecodes.push('PUSH', 1);
                    this.estrutura.bytecodes.push('ADD');
                    this.estrutura.bytecodes.push('DUP');
                    this.estrutura.bytecodes.push('DUP');
                    this.estrutura.bytecodes.push(
                        instrucao.contador.local ? 'STORE' : 'STORE_G',
                        instrucao.contador.indice
                    );
                    this.estrutura.bytecodes.push(instrucao.items.local ? 'LOAD' : 'LOAD_G', instrucao.items.indice);
                    this.estrutura.bytecodes.push('ARRAYLENGTH');
                    this.estrutura.bytecodes.push('LT');
                    const pBCFim = this.estrutura.bytecodes.push('IF_FALSE', 0) - 1;
                    this.estrutura.bytecodes.push(instrucao.items.local ? 'LOAD' : 'LOAD_G', instrucao.items.indice);
                    this.estrutura.bytecodes.push('SWAP');
                    this.estrutura.bytecodes.push('ALOAD');
                    this.estrutura.bytecodes.push(
                        instrucao.variavel.local ? 'STORE' : 'STORE_G',
                        instrucao.variavel.indice
                    );
                    this.compilarInstrucoes(instrucao.instrucoes);

                    this.estrutura.bytecodes[pBCFim] = this.estrutura.bytecodes.push('GOTO', posicaoGotoInicio);
                    this.loops[loop - 1].fim = this.estrutura.bytecodes.length;
                    this.loopsUltimo.pop();
                    break;
                }
                case 'WHILE': {
                    const posicaoGotoInicio = this.estrutura.bytecodes.length - (this.debug ? 2 : 0); // menos 2 pra ir até o DEBUG_L
                    const loop = this.loops.push({ inicio: posicaoGotoInicio, fim: 0, breaks: [], continues: [] });
                    this.loopsUltimo.push(this.loops.length - 1);

                    this.expressao(instrucao.condicao);
                    const pBCFim = this.estrutura.bytecodes.push('IF_FALSE', 0) - 1;
                    this.compilarInstrucoes(instrucao.instrucoes);
                    this.estrutura.bytecodes[pBCFim] = this.estrutura.bytecodes.push('GOTO', posicaoGotoInicio);
                    this.loops[loop - 1].fim = this.estrutura.bytecodes.length;
                    this.loopsUltimo.pop();
                    break;
                }
                case 'DO': {
                    const posicaoGotoInicio = this.estrutura.bytecodes.length;
                    const loop = this.loops.push({ inicio: posicaoGotoInicio, fim: 0, breaks: [], continues: [] });
                    this.loopsUltimo.push(this.loops.length - 1);

                    this.compilarInstrucoes(instrucao.instrucoes);
                    this.expressao(instrucao.condicao);
                    this.estrutura.bytecodes.push('IF_TRUE', posicaoGotoInicio);

                    this.loops[loop - 1].fim = this.estrutura.bytecodes.length;
                    this.loopsUltimo.pop();
                    break;
                }
                case 'SWITCH': {
                    const posicaoGotoInicio = this.estrutura.bytecodes.length;
                    const loop = this.loops.push({ inicio: posicaoGotoInicio, fim: 0, breaks: [], continues: [] });
                    this.loopsUltimo.push(this.loops.length - 1);

                    this.expressao(instrucao.expressao);
                    const pBCDefault = this.estrutura.bytecodes.push('SWITCH', 0) - 1;
                    this.estrutura.bytecodes.push(instrucao.casos.length);
                    instrucao.casos.forEach((c) => {
                        const caso = c;
                        caso.pBCValor = this.estrutura.bytecodes.push(caso.valor, 0) - 1;
                    });

                    let temPadrao = false;
                    instrucao.casos.forEach((c) => {
                        const caso = c;
                        if (caso.op === 'DEFAULT') {
                            temPadrao = true;
                            this.estrutura.bytecodes[pBCDefault] = this.estrutura.bytecodes.length;
                        }
                        this.estrutura.bytecodes[caso.pBCValor] = this.estrutura.bytecodes.length;
                        this.compilarInstrucoes(caso.instrucoes);
                    });
                    if (!temPadrao) {
                        this.estrutura.bytecodes[pBCDefault] = this.estrutura.bytecodes.length;
                    }

                    //  this.estrutura.bytecodes.push('SWITCH', instrucao.casos.length);

                    this.loops[loop - 1].fim = this.estrutura.bytecodes.length;
                    this.loopsUltimo.pop();
                    break;
                }
                case 'BREAK':
                case 'CONTINUE': {
                    this.estrutura.bytecodes.push('GOTO');
                    this.estrutura.bytecodes.push(0);
                    if (instrucao.op === 'CONTINUE') {
                        this.loops[this.loopsUltimo[this.loopsUltimo.length - 1]].continues.push(
                            this.estrutura.bytecodes.length - 1
                        );
                    } else {
                        this.loops[this.loopsUltimo[this.loopsUltimo.length - 1]].breaks.push(
                            this.estrutura.bytecodes.length - 1
                        );
                    }
                    break;
                }
                default: {
                    return false;
                }
            }
            return true;
        });
    }

    chamar(funcao) {
        funcao.argumentos.forEach((a) => {
            this.expressao(a);
        });
        this.estrutura.bytecodes.push(`INVOKE_${funcao.tipo}`);
        this.estrutura.bytecodes.push(funcao.indice);
        this.estrutura.bytecodes.push(funcao.argumentos.length);
    }

    subexpressao(exp) {
        if (this.debug && exp.posicao) {
            this.estrutura.bytecodes.push('DEBUG_L');
            this.estrutura.bytecodes.push(exp.posicao.linha);
        }
        //    exp.forEach((e) => {
        switch (exp.op) {
            case 'CALL': {
                this.chamar(exp);
                break;
            }
            case 'RINC':
            case 'RDEC':
            case 'LINC':
            case 'LDEC': {
                this.estrutura.bytecodes.push(exp.variavel.local ? 'LOAD' : 'LOAD_G');
                this.estrutura.bytecodes.push(exp.variavel.indice);
                if (exp.variavel.indices.length) {
                    exp.variavel.indices.forEach((e) => {
                        if (e.op === 'FIELD') {
                            this.estrutura.bytecodes.push('GETFIELD', e.valor);
                        } else {
                            this.expressao(e);
                            this.estrutura.bytecodes.push('ALOAD');
                        }
                    });
                }

                // colocamos na pilha o valor original
                if (exp.op === 'RINC' || exp.op === 'RDEC') {
                    this.estrutura.bytecodes.push('DUP');
                }
                this.estrutura.bytecodes.push('PUSH');
                this.estrutura.bytecodes.push(1);
                this.estrutura.bytecodes.push(exp.op === 'LINC' || exp.op === 'RINC' ? 'ADD' : 'SUB');

                if (exp.variavel.indices.length) {
                    this.estrutura.bytecodes.push(exp.variavel.local ? 'LOAD' : 'LOAD_G', exp.variavel.indice);
                    let campo = null;
                    exp.variavel.indices.forEach((e, i) => {
                        if (e.op === 'FIELD') {
                            campo = e.valor;
                            if (i < exp.variavel.indices.length - 1) {
                                this.estrutura.bytecodes.push('GETFIELD', e.valor);
                            }
                        } else {
                            campo = null;
                            this.expressao(e);
                            if (i < exp.variavel.indices.length - 1) {
                                this.estrutura.bytecodes.push('ALOAD');
                            }
                        }
                    });
                    if (campo) {
                        this.estrutura.bytecodes.push('PUTFIELD', campo);
                    } else {
                        this.estrutura.bytecodes.push('ASTORE');
                    }
                } else {
                    this.estrutura.bytecodes.push(exp.variavel.local ? 'STORE' : 'STORE_G', exp.variavel.indice);
                }

                if (exp.op === 'LINC' || exp.op === 'LDEC') {
                    this.estrutura.bytecodes.push(exp.variavel.local ? 'LOAD' : 'LOAD_G');
                    this.estrutura.bytecodes.push(exp.variavel.indice);
                    if (exp.variavel.indices.length) {
                        exp.variavel.indices.forEach((e) => {
                            if (e.op === 'FIELD') {
                                this.estrutura.bytecodes.push('GETFIELD', e.valor);
                            } else {
                                this.expressao(e);
                                this.estrutura.bytecodes.push('ALOAD');
                            }
                        });
                    }
                }
                break;
            }
            /*
            a[1][2]
            LOAD a
            PUSH 1
            ALOAD
            PUSH 2
            ALOAD
    
            */

            case 'VARIABLE': {
                this.estrutura.bytecodes.push(exp.variavel.local ? 'LOAD' : 'LOAD_G');
                this.estrutura.bytecodes.push(exp.variavel.indice);
                if (exp.variavel.indices.length) {
                    exp.variavel.indices.forEach((e) => {
                        if (e.op === 'INVOKE_VIRTUAL') {


                            e.argumentos.forEach((a) => {
                                this.expressao(a);
                            });

                            this.estrutura.bytecodes.push('INVOKE_VIRTUAL');
                            this.estrutura.bytecodes.push(e.valor);
                            this.estrutura.bytecodes.push(e.argumentos.length);


                        } else if (e.op === 'FIELD') {
                            this.estrutura.bytecodes.push('GETFIELD', e.valor);
                        } else {
                            this.expressao(e);
                            this.estrutura.bytecodes.push('ALOAD');
                        }
                    });
                    break;
                }
                break;
            }
            case 'NULL': {
                this.estrutura.bytecodes.push('PUSH');
                this.estrutura.bytecodes.push(null);
                break;
            }
            case 'BOOLEAN': {
                this.estrutura.bytecodes.push('PUSH');
                this.estrutura.bytecodes.push(['true', 'verdadeiro', 'verdade'].indexOf(exp.valor) > -1);
                break;
            }
            case 'NUMBER': {
                this.estrutura.bytecodes.push('PUSH');
                this.estrutura.bytecodes.push(Number(exp.valor));
                break;
            }
            case 'STRING': {
                this.estrutura.bytecodes.push('PUSH');
                this.estrutura.bytecodes.push(exp.valor);
                break;
            }
            case 'ARRAY': {
                exp.valores.forEach((e) => {
                    this.expressao(e);
                });
                this.estrutura.bytecodes.push('NEWARRAY');
                this.estrutura.bytecodes.push(exp.valores.length);
                break;
            }
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
                this.expressao(exp.expressao[0]);
                this.expressao(exp.expressao[1]);
                this.estrutura.bytecodes.push(exp.op);
                break;
            }
            case 'NOT': {
                this.expressao(exp.expressao);
                this.estrutura.bytecodes.push('NOT');
                break;
            }
            default: {
                return false;
            }
        }
        //  });

        return true;
    }

    expressao(exp) {
        if (exp.op === 'TERNARY') {
            this.expressao(exp.condicao);
            const pBCFalso = this.estrutura.bytecodes.push('IF_FALSE', 0) - 1;
            this.expressao(exp.instrucoes.verdadeiro);
            const pBCFim = this.estrutura.bytecodes.push('GOTO', 0) - 1;
            this.estrutura.bytecodes[pBCFalso] = this.estrutura.bytecodes.length;
            this.expressao(exp.instrucoes.falso);
            this.estrutura.bytecodes[pBCFim] = this.estrutura.bytecodes.length;
        } else {
            this.subexpressao(exp);
        }
    }
}
