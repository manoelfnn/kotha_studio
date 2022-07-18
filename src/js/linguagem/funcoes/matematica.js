export default [
    {
        nome: 'piso',
        min: 1,
        descricao: 'Arredonda um número para baixo',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.floor(args[0]);
        },
    },
    {
        nome: 'teto',
        min: 1,
        descricao: 'Arredonda um número para cima',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.ceil(args[0]);
        },
    },
    {
        nome: 'arredondar',
        min: 1,
        descricao: 'Arredonda um número',
        parametros: ['numero', 'casas'],
        categoria: 'Matemática',
        func(args, interpreter) {
            const casas = args[1] !== undefined ? parseInt(args[1]) : 2;
            return parseFloat(args[0].toFixed(casas));
        },
    },
    {
        nome: 'aleatorio',
        min: 0,
        descricao: 'Gera um número aleatório',
        parametros: ['maximo'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.floor(Math.random() * parseInt(args[0] ? args[0] + 1 : 100, 10));
        },
    },
    {
        nome: 'abs',
        min: 1,
        descricao: 'Retorna o valor absoluto de um número',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.abs(args[0]);
        },
    },
    {
        nome: 'potencia',
        min: 2,
        descricao: 'Retorna a potencia de um número',
        parametros: ['numero', 'potencia'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.pow(args[0], args[1]);
        },
    },
    {
        nome: 'sinal',
        min: 1,
        descricao: 'Retorna o sinal de um número',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.sign(args[0]);
        },
    },
    {
        nome: 'inteiro',
        min: 1,
        descricao: 'Retorna a parte inteira de um número',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.trunc(args[0]);
        },
    },
    {
        nome: 'raiz',
        min: 1,
        descricao: 'Retorna a raiz de um número',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.sqrt(args[0]);
        },
    },
    {
        nome: 'min',
        min: 1,
        descricao: 'Retorna o menor valor de um vetor',
        parametros: ['valor'],
        categoria: 'Matemática',
        func(args, interpreter) {
            if (Array.isArray(args[0])) {
                return Math.min.apply(null, args[0]);
            }
            return Math.min(args[0]);
        },
    },

    {
        nome: 'max',
        min: 1,
        descricao: 'Retorna o maior valor de um vetor',
        parametros: ['valor'],
        categoria: 'Matemática',
        func(args, interpreter) {
            if (Array.isArray(args[0])) {
                return Math.max.apply(null, args[0]);
            }
            return Math.max(args[0]);
        },
    },

    {
        nome: 'sen',
        min: 1,
        descricao: 'Retorna o seno do angulo',
        parametros: ['angulo'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.sin(args[0]);
        },
    },    

    {
        nome: 'cos',
        min: 1,
        descricao: 'Retorna o co-seno do angulo',
        parametros: ['angulo'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.cos(args[0]);
        },
    },       

    {
        nome: 'tan',
        min: 1,
        descricao: 'Retorna a tangente do angulo',
        parametros: ['angulo'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.tan(args[0]);
        },
    },    
    
    {
        nome: 'arcsin ',
        min: 1,
        descricao: 'Retorna o ângulo do seno',
        parametros: ['seno'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.asin(args[0]);
        },
    },    
    
    {
        nome: 'arccos ',
        min: 1,
        descricao: 'Retorna o ângulo do co-seno',
        parametros: ['coseno'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.acos(args[0]);
        },
    },    
    
    {
        nome: 'arctan ',
        min: 1,
        descricao: 'Retorna o ângulo da tangente',
        parametros: ['tangente'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.atan(args[0]);
        },
    },   
    
    {
        nome: 'log',
        min: 1,
        descricao: 'Retorna o logaritmo de um número',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.log(args[0]);
        },
    },    

    {
        nome: 'log2',
        min: 1,
        descricao: 'Retorna o logaritmo de base 2 de um número',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.log2(args[0]);
        },
    },       
    
    {
        nome: 'log10',
        min: 1,
        descricao: 'Retorna o logaritmo de base 10 de um número',
        parametros: ['numero'],
        categoria: 'Matemática',
        func(args, interpreter) {
            return Math.log10(args[0]);
        },
    },     

];
