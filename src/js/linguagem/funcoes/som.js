import TSom from '../som/som';

export default [
    {
        nome: 'tsom',
        min: 0,
        descricao: 'Retorno um objeto TSom',
        parametros: [],
        categoria: 'Som',
        func(args, interpreter) {
            return new TSom();
        },
    },
];
