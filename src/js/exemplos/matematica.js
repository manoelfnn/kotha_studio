export default {
    nome: 'Matemática',
    exemplos: [
        {
            nome: 'Fatorial e Fibonacci',
            descricao: 'Fatorial e Fibonacci de um número',
            codigo: `
var n = 55

funcao fatorial(x) {
    se x <= 1 entao
        retorno 1
        senao
            retorno x * fatorial(x - 1);
}

funcao fibonacci(x){
    var penultimo = 0
    var ultimo = 1
    var nn
    se x <= 2 entao
        nn = x - 1
    else
            para(i = 3; i <= x; i++){
            nn = ultimo + penultimo;
            penultimo = ultimo;
            ultimo = nn;
            }
    retorno nn
}

mensagem('Fatorial de ' + n + ': ' + fatorial(n))
mensagem('Fibonacci de ' + n + ': ' + fibonacci(n))
        `},
  

    ]
};