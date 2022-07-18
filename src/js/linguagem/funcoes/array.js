export default [
    {
        nome: 'vetor',
        descricao: 'Cria um vetor',
        min: 0,
        parametros: ['tamanho'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return args[0] !== undefined ? Array(args[0]) : Array();
        },
    },
    {
        nome: 'matriz',
        descricao: 'Cria uma matriz',
        min: 2,
        parametros: ['tamanho', 'tamanho'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return Array(args[0])
                .fill()
                .map((a) => Array(args[1]));
        },
    },
    {
        nome: 'push',
        min: 2,
        descricao: 'Adiciona um valor no fim do vetor',
        parametros: ['vetor', 'items'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return args[0].push(args[1]);
        },
    },
    {
        nome: 'pop',
        descricao: 'Retira o último elemento do vetor',
        min: 1,
        parametros: ['vetor'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return args[0].pop();
        },
    },
    {
        nome: 'shift',
        descricao: 'Retira o primeiro elemento do vetor',
        min: 1,
        parametros: ['vetor'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return args[0].shift();
        },
    },
    {
        nome: 'unshift',
        descricao: 'Adiciona um valor no início do vetor',
        min: 2,
        parametros: ['vetor', 'valor'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return args[0].unshift(args[1]);
        },
    },
    {
        nome: 'juntar',
        descricao: 'Junta os elementos de um vetor',
        min: 1,
        parametros: ['vetor', 'separador'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return args[0].join(args[1] !== undefined ? args[1] : ', ');
        },
    },
    {
        nome: 'ordenar',
        descricao: 'Ordena um vetor',
        min: 1,
        parametros: ['vetor'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return args[0].sort();
        },
    },
    {
        nome: 'inverter',
        descricao: 'Inverte um vetor',
        min: 1,
        parametros: ['vetor'],
        categoria: 'Vetor',
        func(args, interpreter) {
            return args[0].reverse();
        },
    },
    {
        nome: 'alcance',
        descricao: 'Cria um vetor',
        min: 1,
        parametros: ['inicio', 'parada', 'passo'],
        categoria: 'Vetor',
        func(args, interpreter) {
            const start = args[0];
            const stop = args[1];
            let step = args[2] !== undefined ? args[2] : 1;

            if (args[1] === undefined && args[2] === undefined) {
                return [...Array(start).keys()];
            }

            if ((start > stop && !(step < 0)) || (start < stop && !(step > 0))) {
                step *= -1;
            }

            const returnArray = [];
            for (let i = start; (i - start) * (i - stop) <= 0; i += step) {
                returnArray.push(i);
            }

            return returnArray;
        },
    },
];
