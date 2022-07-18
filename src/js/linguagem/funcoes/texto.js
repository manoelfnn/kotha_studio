export default [
    {
        nome: 'substituir',
        descricao: 'Substitui um texto',
        min: 3,
        parametros: ['texto', 'substituir', 'nova'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].replace(args[1], args[2]);
        },
    },
    {
        nome: 'maiuscula',
        min: 1,
        descricao: 'Transforma um texto em letras maiúsculas',
        parametros: ['texto'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].toUpperCase();
        },
    },
    {
        nome: 'minuscula',
        min: 1,
        descricao: 'Transforma um texto em letras minúsculas',
        parametros: ['texto'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].toLowerCase();
        },
    },
    {
        nome: 'repetir',
        min: 2,
        descricao: 'Retorna uma novo texto com um determinado número de cópias',
        parametros: ['texto', 'vezes'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].repeat(args[1]);
        },
    },
    {
        nome: 'dividir',
        min: 1,
        descricao: 'Divide um texto em subtexto',
        parametros: ['texto', 'delimitador'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].split(args[1] !== undefined ? args[1] : ' ');
        },
    },
    {
        nome: 'preencher_inicio',
        min: 3,
        descricao: 'Preenche o início de um texto com determinado caractere',
        parametros: ['texto', 'vezes', 'texto'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].padStart(args[1], args[2]);
        },
    },
    {
        nome: 'preencher_fim',
        min: 3,
        descricao: 'Preenche o fim de um texto com determinado caractere',
        parametros: ['texto', 'vezes', 'texto'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].padEnd(args[1], args[2]);
        },
    },
    {
        nome: 'aparar',
        min: 1,
        descricao: 'Remove espaços em branco do início e do fim de texto',
        parametros: ['texto'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].trim();
        },
    },

    {
        nome: 'subtexto',
        min: 3,
        descricao: 'Retorna um subtexto de um texto',
        parametros: ['texto', 'inicio', 'tamanho'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].substr(args[1], args[2]);
        },
    },


    {
        nome: 'caracter',
        min: 1,
        descricao: 'Retorna um caracter a partir de um número',
        parametros: ['numero'],
        categoria: 'Texto',
        func(args, interpreter) {
            return String.fromCharCode(args[0]);
        },
    },

    {
        nome: 'asc',
        min: 1,
        descricao: 'Retorna o código do caracter',
        parametros: ['caracter'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].charCodeAt(0);
        },
    },    

    {
        nome: 'posicao',
        min: 2,
        descricao: 'Procurar um texto dentro de um texto',
        parametros: ['numero', 'busca'],
        categoria: 'Texto',
        func(args, interpreter) {
            return args[0].search(args[1]);
        },
    },
];
