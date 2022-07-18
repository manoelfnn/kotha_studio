export default {
    nome: 'Vetores',
    exemplos: [
        {
            nome: 'Valor existe',
            descricao: 'Verifica se um valor existe em um vetor',
            codigo: `
funcao valor_existe(ve, busca) {
    para(i = 0; i < tamanho(ve); i++){
        se ve[i] == busca entao 
            retorno verdade
    }
    retorno falso
}

var vet = [1, 55, 254, 33, 18, 39, 2, 14]
se valor_existe(vet, 254) entao
    mensagem('Existe')
else
    mensagem('Não existe')
        `},
        {
            nome: 'Inverter valores',
            descricao: 'Inverte os valores de um vetor e retorna um novo',
            codigo: `
funcao inverter (ve) {
    var tam = tamanho(ve);
    var novo = vetor(tam)    
    para(i = 0; i < tam; i++){
        novo[i] = ve[tam - i - 1]
    }
    retorno novo
}

var original = [1, 55, 254, 33, 18, 39, 2, 14]
var invertido = inverter(original)

saida('Original: ')
cada v em original
    saida(' ' + v)
saidal()
saida('Invertido: ')
cada v em invertido
    saida(' ' + v)    
        `},   
        {
            nome: 'Conta valor',
            descricao: 'Conta quantos valores existem',
            codigo: `
funcao conta (ve, valor) {
    var tam = tamanho(ve);
    var total = 0
    para(i = 0; i < tam; i++){
        se ve[i] == valor entao total++
    }
    retorno total
}

var ve = [1, 55, 39, 254, 18, 18, 39, 2, 14, 55, 33, 18, 18, 39, 2, 14, 55, 39, 254, 18, 18, 39, 2]
var busca = 39
saida('Existem ' + conta(ve, busca) + ' número(s) ' + busca + ' no vetor')        
        `},               
    ]
};