import TBotao from '../controles/TBotao';
import TEntrada from '../controles/TEntrada';
import TImagem from '../controles/TImagem';
import TJanela from '../controles/TJanela';
import TTexto from '../controles/TTexto';

export default [
    {
        nome: 'tjanela',
        descricao: 'Cria um objeto TJanela',
        min: 1,
        parametros: ['titulo', 'largura', 'altura', 'pintura'],
        categoria: 'Janela',
        func(args, interpreter) {
            const janelaId = `janela-${Math.floor(Math.random() * 1000)}`;
            const titulo = args[0];
            const largura = args[1] !== undefined ? `${args[1]}px` : '250px';
            const altura = args[2] !== undefined ? `${args[2]}px` : largura;
            const canvasId = `canvas-${Math.floor(Math.random() * 1000)}`;
            const html = args[3] === true ? `<canvas id="${canvasId}" width="${largura}" height="${altura}">` : '';
            const janelaHtml = ` \
                    <div class="janela">\
                        <div class="cabecalho d-flex justify-content-between">
                            <span class="titulo">${titulo}</span>\
                            <span class="fechar" acao="fechar-janela">\
                                <i class="fa fa-remove"></i>\
                            </span>\
                        </div>\
                        <div class="conteudo" id="${janelaId}" style="width: ${largura}; height: ${altura}; outline: none !important;" tabindex="0">${html}</div>\
                    </div>\
                </div>`;

            const container = interpreter.getContainer();
            $(`#${container}`).html('');
            $(`#${container}`).append(janelaHtml);
            $(`#${container} #${janelaId}`).focus();

            interpreter.usoGeral.janelaPrincipal = $(`#${janelaId}`);
            interpreter.usoGeral.destinoPrincipal = interpreter.usoGeral.janelaPrincipal;

            if (args[3] === true) {
                interpreter.usoGeral.canvasPrincipal = $(`#${canvasId}`).get(0);
                const canvas = interpreter.usoGeral.canvasPrincipal;
                if (!canvas.getContext) return false;
                interpreter.usoGeral.contextoPrincipal = canvas.getContext('2d');
            }

            //    return interpreter.usoGeral.janelaPrincipal;
            return new TJanela($(`#${janelaId}`));
        },
    },

    {
        nome: 'tbotao',
        min: 1,
        descricao: 'Cria um objeto TBotao',
        parametros: ['texto', 'funcao'],
        categoria: 'Janela',
        func(args, interpreter) {
            const id = `btn-${Math.floor(Math.random() * 1000)}`;
            const titulo = args[0];
            const funcao = args[1] !== undefined ? args[1] : null;
            const html = `<button id="${id}">${titulo}</button>`;
            interpreter.usoGeral.destinoPrincipal.append(html);
            if (funcao) {
                $(`#${id}`).attr(`evento-clique`, funcao);
            }
            return new TBotao($(`#${id}`));
        },
    },

    {
        nome: 'tentrada',
        descricao: 'Cria um objeto TEntrada',
        min: 0,
        parametros: ['tipo', 'padrao'],
        categoria: 'Janela',
        func(args, interpreter) {
            const id = `ct-${Math.floor(Math.random() * 1000)}`;
            const tipo = args[0] !== undefined ? args[0] : 'text';
            const padrao = args[1] !== undefined ? args[1] : '';
            const html = `<input id="${id}" type="${tipo}" value="${padrao}">`;
            interpreter.usoGeral.destinoPrincipal.append(html);
            return new TEntrada($(`#${id}`));
        },
    },

    {
        nome: 'ttexto',
        descricao: 'Cria um objeto TTexto',
        min: 0,
        parametros: ['texto'],
        categoria: 'Janela',
        func(args, interpreter) {
            const id = `ct-${Math.floor(Math.random() * 1000)}`;
            const texto = args[0] !== undefined ? args[0] : '';
            const html = `<span id="${id}">${texto}</span>`;
            interpreter.usoGeral.destinoPrincipal.append(html);
            return new TTexto($(`#${id}`));
        },
    },

    {
        nome: 'timagem',
        min: 1,
        descricao: 'Cria um objeto TImagem',
        parametros: ['origem', 'largura', 'altura', 'funcao'],
        categoria: 'Janela',
        func(args, interpreter) {
            const id = `img-${Math.floor(Math.random() * 1000)}`;
            const src = args[0];
            const largura = args[1] !== undefined ? args[1] : 0;
            const altura = args[2] !== undefined ? args[2] : largura;
            const funcao = args[3] !== undefined ? args[3] : null;
            const html = `<img id="${id}" src="${src}" crossorigin="anonymous" width="${largura}" height="${altura}">`;
            interpreter.usoGeral.destinoPrincipal.append(html);
            if (funcao) {
                $(`#${id}`).attr(`evento-clique`, funcao);
            }
            return new TImagem($(`#${id}`));
        },
    },

    {
        nome: 'tcaixa',
        min: 1,
        descricao: 'Cria um objeto TCaixa',
        parametros: ['nome', 'largura', 'altura', 'cor', 'container'],
        categoria: 'Janela',
        func(args, interpreter) {
            const containerId = args[4] !== undefined ? args[4] : interpreter.componentePadrao;
            const id = args[0];
            const largura = args[1] !== undefined ? args[1] : 0;
            const altura = args[2] !== undefined ? args[2] : largura;
            const cor = args[3] !== undefined ? args[3] : 'black';
            const html = `<div id="${id}" style="width: ${largura}px; height: ${altura}px; background-color: ${cor};"></div>`;
            const selector = $(`#${interpreter.obterContainer()} #${containerId}`);
            selector.append(html);
            return new TCaixa($(`#${id}`));
        },
    },
    {
        nome: 'remover',
        min: 1,
        descricao: 'Cria um controle',
        parametros: ['elemento'],
        categoria: 'Janela',
        func(args, interpreter) {
            const id = args[0];
            id.remove();
            return true;
        },
    },
];
