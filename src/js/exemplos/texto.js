
export default {
    nome: 'Texto',
    exemplos: [
        {
            nome: 'Caracteres loucos',
            descricao: 'Converte os caracteres em maiúsculo e minusculo aleatóriamente',
            codigo: `
var texto = 'Converte os caracteres em maiúsculo e minusculo aleatóriamente'
var novo = '';
cada caracter em texto {
    novo += aleatorio(1) == 1 ? maiuscula(caracter) : minuscula(caracter)
}
saida(novo)
        `},   
        {
            nome: 'Conta letras',
            descricao: 'Conta o número de letras existentes em um texto',
            codigo: `
var texto = 'Programação é o processo de escrita, teste e manutenção de um programa de computador. O programa é escrito em uma linguagem de programação, embora seja possível, com alguma dificuldade, escrevê-lo diretamente em linguagem de máquina. Diferentes partes de um programa podem ser escritas em diferentes linguagens.'

var letra = 'a';
var total = 0;
cada caracter em texto {
    se caracter == letra entao total++
}
saida('Existem ' + total + ' letras "' + letra + '" no texto');
        `},                 
    ]
};