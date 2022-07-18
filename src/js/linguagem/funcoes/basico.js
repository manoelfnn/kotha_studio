export default [
    {
        nome: 'entrar',
        descricao: 'Solicita a entrada de uma informação',
        min: 1,
        parametros: ['titulo', 'tipo'],
        categoria: 'Básica',
        func(args, interpreter) {
            let magico = args[1];
            if (interpreter.magico && typeof magico !== 'undefined') {
                if (magico === 'nome' || magico === 'nomes') {
                    magico = magico.toLowerCase();
                    const nomes = [
                        'João',
                        'Maria',
                        'Manoel',
                        'Tais',
                        'Vladimir',
                        'Julia',
                        'Gerson',
                        'Soraia',
                        'Angélica',
                        'Diego',
                        'Igor',
                        'Tiago',
                        'Isabely',
                        'Marcia',
                        'Rafael',
                    ];
                    return nomes[Math.floor(Math.random() * nomes.length)];
                }
                if (magico === 'numeros' || magico === 'numero') {
                    return Math.floor(Math.random() * parseInt(magico, 10));
                }
                //split (-)
                // if (typeof magico === '-') {
                //     return Math.floor(Math.random() * parseInt(magico, 10));
                // }                
            }
            const valor = prompt(args[0]);
            return valor === null ? '' : valor;
        },
    },

    {
        nome: 'mensagem',
        descricao: 'Exibe uma caixa de dialogo',
        min: 1,
        parametros: ['mensagem'],
        categoria: 'Básica',
        func(args, interpreter) {
            alert(args[0]);
        },
    },
    {
        nome: 'limpar',
        min: 0,
        descricao: 'Limpa a seção de saída',
        parametros: [],
        categoria: 'Básica',
        func(args, interpreter) {
            interpreter.saida.limpar();
        },
    },
    {
        nome: 'saida',
        min: 0,
        descricao: 'Escreve na seção de saída',
        parametros: ['texto'],
        categoria: 'Básica',
        func(args, interpreter) {
            if (typeof args[0] === 'object') {
                Object.keys(args[0]).forEach((k) => {
                    interpreter.saida.mensagem(null, 'gray', `${k} = ${args[0][k]}<br>`, null, false);
                });
            } else {
                interpreter.saida.mensagem(null, 'gray', args[0] !== null ? args[0] : '', null, false);
            }
        },
    },
    {
        nome: 'saidal',
        min: 0,
        descricao: 'Escreve na seção de saída e quebra a linha',
        parametros: ['texto'],
        categoria: 'Básica',
        func(args, interpreter) {
            interpreter.saida.mensagem(null, 'gray', `${args[0] ? args[0] : ''}<br>`, null, false);
        },
    },
    {
        nome: 'console',
        min: 1,
        parametros: ['texto'],
        descricao: 'Escreve no console do navegador',
        categoria: 'Básica',
        func(args, interpreter) {
            console.log(args[0]);
        },
    },
    {
        nome: 'tamanho',
        min: 1,
        descricao: 'Retorna o tamanho da variável',
        parametros: ['variavel'],
        categoria: 'Básica',
        func(args, interpreter) {
            if (typeof args[0] === 'string') {
                return args[0].length;
            }
            if (Array.isArray(args[0])) {
                return args[0].length;
            }
            return 0;
        },
    },
    {
        nome: 'numero',
        min: 1,
        parametros: ['texto'],
        descricao: 'Transforma um texto em número',
        categoria: 'Básica',
        func(args, interpreter) {
            return parseInt(args[0]);
        },
    },
    {
        nome: 'disparar',
        min: 2,
        descricao: 'Chama uma funçao a cada n segundos',
        parametros: ['funcao', 'segundos'],
        categoria: 'Básica',
        func(args, interpreter) {
            const intervalo = setInterval(function () {
                interpreter.chamarFuncao(args[0], []);
            }, args[1]);
            interpreter.disparadores.push(intervalo);
            return intervalo;
        },
    },
    {
        nome: 'destruir_disparadores',
        min: 0,
        descricao: 'Destroi todos os disparadores ativos',
        parametros: [],
        categoria: 'Básica',
        func(args, interpreter) {
            interpreter.destruirDisparadores();
            return true;
        },
    },
    {
        nome: 'animacao',
        min: 1,
        descricao: 'Chama uma função de animação',
        parametros: ['funcao'],
        categoria: 'Básica',
        func(args, interpreter) {
            function animacao() {
                interpreter.chamarFuncao(args[0], []);
                window.requestAnimationFrame(animacao);
            }
            window.requestAnimationFrame(animacao);
        },
    },

    {
        nome: 'api',
        min: 1,
        parametros: ['url'],
        descricao: 'Faz um requisição GET à uma URL',

        categoria: 'Básica',
        func(args, interpreter) {
            let r;
            $.ajax({
                url: args[0],
                async: false,
                dataType: 'json',
                type: 'GET',
                success: (data) => {
                    r = { url: args[0], ...data };
                },
                error: () => {
                    r = false;
                },
            });
            return r;
        },
    },
    {
        nome: 'tipo',
        min: 1,
        descricao: 'Retorna o tipo de dado',
        parametros: ['expressao'],
        categoria: 'Básica',
        func(args, interpreter) {
            return typeof args[0];
        },
    },
    {
        nome: 'tosystem',
        min: 1,
        descricao: 'Função do sistema',
        parametros: ['texto'],
        categoria: 'Básica',
        func(args, interpreter) {
            interpreter.usoGeral.tosystem = args[0];
        },
    },
    {
        nome: 'objetoteste',
        min: 0,
        descricao: 'Retorna um objeto teste',
        parametros: [],

        categoria: 'Básica',
        func(args, interpreter) {
            return {
                cor: 'black',
                fonte: { tamanho: '12px' },
                fun1: (a, b) => {
                    return `fun1() a: ${a}, b: ${b}`;
                },
            };
        },
    },
];
