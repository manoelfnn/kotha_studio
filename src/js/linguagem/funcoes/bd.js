import TBD from '../bd/bd';

export default [
    {
        nome: 'tbd',
        min: 1,
        parametros: ['base'],
        descricao: 'Cria um objeto TBD',
        categoria: 'Banco de Dados',
        func(args, interpreter) {
            return new TBD(args[0]);
        },
    },
];
