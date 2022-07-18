/* eslint-disable no-use-before-define */
import Interpretador from '../linguagem/Interpretador';
import funcoes from '../linguagem/funcoes';
import TokensTipos from '../linguagem/tokens';

import exemplos from '../exemplos';
import testes from '../linguagem/testes';
import Config from './config';
import TControle from '../linguagem/controles/TControle';

// Preenchemos dinamicamente o menu dos exemplos
let contador = 0;

if (!localStorage.getItem('primeiro')) {
    $('#sobreModal').modal();
}
const config = new Config();
config.carregar();

exemplos.forEach((categoria) => {
    const exemplosMenus = categoria.exemplos.map((exemplo) => {
        contador += 1;
        return `<div>
        <a data-dismiss="modal" acao="carregar-exemplo" href="#" categoria="${categoria.nome}" exemplo="${exemplo.nome}" title="${exemplo.descricao}">
            <i class="fa fa-fw fa-file-o"></i>    
            ${contador}. 
            ${exemplo.nome}</a>
        </div>`;
    });
    $('#exemplosModalLista').append(`
        <div class="mb-3">
            <a>${categoria.nome}</a>
            <div>${exemplosMenus.join('')}</div>
        </div>`);
});

let editor;
// let erroLinha = null;

const inter = new Interpretador('secao-janela', 'saida', (i, m, p) => {
    if (p) {
        editor.addLineClass(p.linha - 1, '', 'linha-erro');
        // erroLinha = p.linha - 1;
    }
});

/* Criamos variáveis globais no objeto window contendo as palavras reservadas da linguagem,
as funções do sistema, as funções do usuário e as variáveis globais. 
Isso serve para que o algorítimo de coloração de sintaxe do CodeMirror consiga
saber dinamicamente o que colorir. */
window.global = {
    palavrasReservadas: [],
    funcoesDoSistema: funcoes.map((funcao) => funcao.nome),
    funcoesDoUsuario: [],
    variaveisGlobais: [],
};
TokensTipos.forEach((token) => window.global.palavrasReservadas.push(...token.variacoes));

// let printFuncoes = '';
// eslint-disable-next-line no-console
console.log(`Total de funções: ${funcoes.length}`);
funcoes.forEach((funcao) => {
    const parametros = funcao.parametros.join(', ');
    $('#ajudaFuncoesSistema tbody').append(
        `<tr><td><span class="categoria">${funcao.categoria}</span><br><span class="nome">${funcao.nome}</span>(<i>${parametros}</i>)<br><span class="descricao">${funcao.descricao}</span></td></tr>`
    );

    //  printFuncoes += `${funcao.categoria} & \\textbf{${funcao.nome}}(\\textit{\\footnotesize ${parametros}}) & ${funcao.descricao} \\\\ \\hline\n`;
});
// console.log(printFuncoes.replaceAll('_', '\\_'));

// Adicionamos as funções ao autocomplete do CodeMirror.actions
CodeMirror.registerHelper('hint', 'anyword', (editor, options) => {
    const WORD = /[\w$_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
    const word = (options && options.word) || WORD;

    const cur = editor.getCursor();
    const curLine = editor.getLine(cur.line);
    let start = cur.ch;
    let end = start;
    while (end < curLine.length && word.test(curLine.charAt(end))) end += 1;
    while (start && word.test(curLine.charAt(start - 1))) start -= 1;
    const curWord = start !== end && curLine.slice(start, end);

    const list1 = window.global.funcoesDoSistema.sort();
    const list2 = window.global.funcoesDoUsuario.sort();
    let list = list2.concat(list1);

    if (curWord) {
        list = list.filter((e) => e.indexOf(curWord) !== -1);
    }

    return { list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end) };
});

let carregado = false;
let intervalo = null;

function executarComando(comando, elemento = null) {
    switch (comando) {
        case 'caracter': {
            let caracter = elemento.attr('caracter');
            const voltar = elemento.attr('posicao') ? parseInt(elemento.attr('posicao'), 10) : null;
            if (caracter === 'tab') {
                caracter = '    ';
            }
            editor.focus();
            editor.replaceSelection(caracter);
            if (voltar !== null) {
                const cursor = editor.getCursor();
                editor.setCursor({ line: cursor.line, ch: cursor.ch + voltar });
            }
            break;
        }
        case 'maximizar-saida': {
            $('.CodeMirror').toggle();
            $('.secao-saida').css('flex-grow', $('.secao-saida').css('flex-grow') === '1' ? 'initial' : '1');
            break;
        }
        case 'alternar-saida': {
            $('.secao-saida').toggle();
            break;
        }
        case 'fechar-saida': {
            $('.secao-saida').hide();
            $('.CodeMirror').show();
            $('.secao-saida').css('flex-grow', 'initial');
            break;
        }
        case 'fechar-caracteres': {
            $('.secao-caracteres').hide();
            break;
        }
        case 'fechar-variaveis': {
            $('.secao-variaveis').hide();
            break;
        }
        case 'abrir-caracteres': {
            $('.secao-caracteres').show();
            break;
        }
        case 'abrir-menu': {
            $('#menuModal').modal('show');
            break;
        }
        case 'abrir-saida': {
            $('.secao-saida').show();
            break;
        }
        case 'abrir-variaveis': {
            $('.secao-variaveis').show();
            break;
        }
        case 'abrir-config': {
            $('#menuModal').modal('hide');
            config.carregar();
            $('#configModal').modal('show');
            break;
        }
        case 'abrir-exemplos': {
            $('#menuModal').modal('hide');
            $('#exemplosModal').modal('show');
            break;
        }
        case 'abrir-bytecode':
        case 'abrir-tokens': {
            inter.carregar(editor.getValue(), false);
            if (comando === 'abrir-bytecode') {
                $('#codigoModalTitle').text('Bytecode do código');
                $('#codigoModalCodigo').html(inter.getBytecodesEmTexto());
            } else {
                $('#codigoModalTitle').text('Tokens do código');
                $('#codigoModalCodigo').html(inter.getTokensEmTexto());
            }
            $('#menuModal').modal('hide');
            $('#codigoModal').modal('show');
            break;
        }
        case 'abrir-ajuda': {
            $('#menuModal').modal('hide');
            $('#ajudaModal').modal('show');
            break;
        }
        case 'abrir-tour': {
            // eslint-disable-next-line no-undef
            $('#menuModal').modal('hide');
            hopscotch.startTour(myTour);
            break;
        }
        case 'abrir-sobre': {
            $('#menuModal').modal('hide');
            $('#sobreModal').modal('show');
            break;
        }        
        case 'novo': {
            // eslint-disable-next-line no-alert
            $('#menuModal').modal('hide');
            if (window.confirm('Deseja realmente criar um novo código?')) {
                editor.setValue('');
            }
            break;
        }
        case 'abrir': {
            $('#menuModal').modal('hide');
            $('#arquivo').click();
            break;
        }
        case 'salvar': {
            $('#menuModal').modal('hide');
            const bb = new Blob([editor.getValue()], { type: 'text/plain' });
            const a = document.createElement('a');
            const data = new Date();
            const agora = `d${data.getDate()}${data.getMonth()}${data.getFullYear()}h${data.getHours()}${data.getMinutes()}${data.getSeconds()}`;
            a.download = `${agora}.cota`;
            a.href = window.URL.createObjectURL(bb);
            a.click();
            break;
        }
        case 'carregar-exemplo': {
            $('#menuModal').modal('hide');
            const categoria = elemento.attr('categoria');
            const exemplo = elemento.attr('exemplo');
            const { codigo } = exemplos.find((e) => e.nome === categoria).exemplos.find((e) => e.nome === exemplo);
            // console.log(exemplos.find(exemplo));
            editor.setValue(codigo);
            break;
        }
        case 'config-salvar': {
            config.salvar();
            break;
        }
        case 'executar-rapido': {
            desmarcarTodasLinhas();
            const magico = elemento && elemento.attr('magico') === 'true';
            executando(true, 'rapido');
            if (inter.carregar(editor.getValue(), false)) {
                inter.executarTudo(magico);
            }
            executando(false, 'rapido');
            break;
        }
        case 'executar-linha': {
            if (!carregado && inter.carregar(editor.getValue(), true)) {
                carregado = true;
            }
            executando(true, 'linha');
            if (carregado) {
                const execucao = inter.executarProximaLinha();
                $('.secao-variaveis .variaveis').html(inter.verVariaveis());
                desmarcarTodasLinhas();
                marcarLinha(inter.linhaAtual - 1, 'atual');
                if (!execucao) {
                    carregado = false;
                    executando(false, 'linha');
                }
            } else {
                executando(false, 'linha');
            }
            break;
        }
        case 'executar-lento': {
            executando(true, 'lento');
            if (inter.carregar(editor.getValue(), true)) {
                intervalo = setInterval(
                    () => {
                        const execucao = inter.executarProximaLinha();
                        $('.secao-variaveis .variaveis').html(inter.verVariaveis());
                        desmarcarTodasLinhas();
                        marcarLinha(inter.linhaAtual - 1, 'atual');
                        if (!execucao) {
                            clearInterval(intervalo);
                            executando(false, 'lento');
                        }
                    },
                    localStorage.getItem('execucao-automatica') ? localStorage.getItem('execucao-automatica') : 150
                );
            } else {
                executando(false, 'lento');
            }
            break;
        }
        case 'executar-parar': {
            executando(false, 'parar');
            if (intervalo) {
                clearInterval(intervalo);
            }
            inter.carregar(editor.getValue(), inter.getDebug());
            carregado = false;
            break;
        }
        case 'fechar-janela': {
            inter.destruirDisparadores();
            $('#secao-janela').html('');
            break;
        }
        case 'testes': {
            testes();
            break;
        }
        default: {
            return false;
        }
    }
    return true;
}

// Criamos o editor do CodeMirror
editor = CodeMirror.fromTextArea($('#editor')[0], {
    lineNumbers: true,
    mode: 'vgpp',
    theme: 'monokai',
    lineWrapping: true,
    autoRefresh: true,
    extraKeys: {
        'Ctrl-Space': 'autocomplete',
        F1: () => executarComando('abrir-ajuda'),
        F2: () => executarComando('abrir'),
        F3: () => executarComando('salvar'),
        F4: () => executarComando('alternar-saida'),
        F7: () => executarComando('executar-linha'),
        F8: () => executarComando('executar-lento'),
        F9: () => executarComando('executar-rapido'),
        F10: () => executarComando('abrir-tokens'),
        F11: () => executarComando('abrir-bytecode'),
    },
});
config.atualizar(editor);

// A cada alteração do código, realizamos um parser no código atual em busca das funções e variáveis globais.
editor.on('change', () => {
    //  const p = new Parser();
    //  p.parser(editor.getValue(), false);
    //  window.global.funcoesDoUsuario = p.obterFuncoesUsuario().map((funcao) => funcao.nome);
    // window.global.variaveisGlobais = p.obterVariaveisGlobais().map((variavel) => variavel);
    localStorage.setItem('codigo', editor.getValue());
    desmarcarTodasLinhas();
});
editor.on('focus', () => {
    executarComando('fechar-saida');
    executarComando('abrir-caracteres');
    desmarcarTodasLinhas();
});
editor.on('blur', (e) => {
    //    executarComando('fechar-caracteres');
});

editor.focus();

[
    ['contextmenu', 'botao-direito'],
    ['click', 'clique'],
    ['dblclick', 'duplo-clique'],

    ['keypress', 'teclar'],
    ['keydown', 'pressionar-tecla'],
    ['keyup', 'soltar-tecla'],

    ['mousemove', 'mover-mouse'],
    ['mouseenter', 'entrar-mouse'],
    ['mouseover', 'mouse-acima'],
    ['mouseleave', 'mouse-deixar'],
    ['mouseout', 'mouse-saiu'],
    ['mousedown', 'mouse-pressionar'],
    ['mouseup', 'mouse-soltar'],
].forEach((e) => {
    $(document).on(e[0], `[evento-${e[1]}]`, function (evento) {
        if (e[0] === 'mousemove') {
            inter.chamarFuncao($(this).attr(`evento-${e[1]}`), [
                new TControle($(this)),
                evento.clientX,
                evento.clientY,
            ]);
        } else if (['keypress', 'keydown', 'keyup'].indexOf(e[0]) > -1) {
            inter.chamarFuncao($(this).attr(`evento-${e[1]}`), [new TControle($(this)), evento.key]);
        } else {
            inter.chamarFuncao($(this).attr(`evento-${e[1]}`), [new TControle($(this))]);
        }
    });
});

function marcarLinha(linha, tipo) {
    editor.addLineClass(linha, '', `linha-${tipo}`);
}

function desmarcarTodasLinhas() {
    const linhas = editor.lineCount();
    for (let i = 0; i < linhas; i += 1) {
        editor.removeLineClass(i, '', 'linha-atual');
        editor.removeLineClass(i, '', 'linha-erro');
    }
}

function executando(estado, modo) {
    if (estado) console.clear();
    if (estado) desmarcarTodasLinhas();
    editor.setOption('readOnly', estado);
    executarComando(!estado ? 'abrir-caracteres' : 'fechar-caracteres');
    if (localStorage.getItem('exibir-variaveis') === 'true') {
        executarComando(estado && (modo === 'lento' || modo === 'linha') ? 'abrir-variaveis' : 'fechar-variaveis');
    }
    executarComando('abrir-saida');
    $('[acao=executar-parar]').prop('disabled', !estado);
    $('[acao=abrir]').prop('disabled', estado);
    $('[acao=salvar]').prop('disabled', estado);
    // $('[acao=exibir-menu]').prop('disabled', estado);
    if (estado) {
        if (modo === 'lento' || modo === 'rapido') {
            $('[acao=executar-rapido]').prop('disabled', true);
            $('[acao=executar-lento]').prop('disabled', true);
            $('[acao=executar-linha]').prop('disabled', true);
        } else {
            // se modo === linha
            $('[acao=executar-rapido]').prop('disabled', true);
            $('[acao=executar-lento]').prop('disabled', true);
            $('[acao=executar-linha]').prop('disabled', false);
        }
    } else {
        //         desmarcarTodasLinhas();
        $('[acao=executar-rapido]').prop('disabled', false);
        $('[acao=executar-lento]').prop('disabled', false);
        $('[acao=executar-linha]').prop('disabled', false);
    }
}

$('#arquivo').change(function arquivoChange(e) {
    const file = e.target.files[0];
    const fr = new FileReader();
    fr.readAsText(file);
    fr.onload = function arquivoOnLoad() {
        editor.setValue(fr.result);
    };
});

$(document).on('click', '[acao]', function () {
    executarComando($(this).attr('acao'), $(this));
});

const myTour = {
    id: 'myTour',
    bubbleWidth: 230,
    showPrevButton: true,
    showCloseButton: true,
    showNumber: false,
    i18n: {
        nextBtn: 'Próximo',
        prevBtn: 'Voltar',
        doneBtn: 'Ok',
        skipBtn: 'Pular',
    },
    steps: [
        {
            title: 'Editor de código',
            content: 'Escreva aqui o código do seu algortimo.',
            target: '#editor',
            placement: 'bottom',
        },
        {
            xOffset: -70,
            arrowOffset: 65,
            title: 'Executar código',
            content:
                'Quando terminar de escrever seu código, clique aqui <i class="btn btn-light btn-sm fa fa-play text-success"></i> para executar.',
            target: '.btn-executar-rapido',
            placement: 'top',
        },
        {
            xOffset: -40,
            arrowOffset: 35,
            title: 'Parar código',
            content:
                'Se quiser parar a execução do seu código, clique aqui <i class="btn btn-light btn-sm fa fa-stop text-danger"></i> para interromper.',
            target: '.btn-parar',
            placement: 'top',
        },
        {
            xOffset: -100,
            arrowOffset: 95,
            title: 'Executar passo a passo',
            content:
                'Ou, clique aqui <i class="btn btn-light btn-sm fa fa-step-forward"></i> para executar seu código passo a passo.',
            target: '.btn-executar-linha',
            placement: 'top',
        },
        {
            xOffset: -5,
            arrowOffset: 1,
            title: 'Novo código',
            content: 'Se quiser criar um novo código, clique aqui <i class="btn btn-light btn-sm fa fa-plus"></i>.',
            target: '.btn-novo',
            placement: 'top',
        },
        {
            xOffset: -220,
            arrowOffset: 220,
            title: 'Menu',
            content:
                'E, clique aqui <i class="btn btn-light btn-sm fa fa-ellipsis-v"></i> para acessar outras opções da ferramenta.',
            target: '.btn-menu',
            placement: 'top',
        },
    ],
    onStart() {
        $('body').append(
            '<div id="tour-fundo" style="background-color: black; opacity: .2; height: 100%; width: 100%; position: fixed; z-index: 100000; top: 0; left: 0;"></div>'
        );
    },
    onEnd() {
        $('#tour-fundo').remove();
    },
};
// remover
if (localStorage.getItem('tour') !== 'true') {
    localStorage.setItem('tour', 'true');
    // eslint-disable-next-line no-undef
    hopscotch.startTour(myTour);
}
