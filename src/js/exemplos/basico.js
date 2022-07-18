export default {
    nome: 'Básico',
    exemplos: [
        {
            nome: 'Olá mundo!',
            descricao: 'Seu primeiro programa',
            codigo: `
saida("Olá mundo!");
        `},
        {
            nome: 'Entrada e saída',
            descricao: 'Seu primeiro programa',
            codigo: `
valor = entrar('Informe um nome', 'nome') 
// 'nome': gera um nome aleatório, 100 gera um número aleatório de 0 à 100
mensagem('Você informou: ' + valor);
// Obs. Se você executar clicando na varinha mágica o valor será preenchido automaticamente
        `},
        {
            nome: 'Entrada e saída2',
            descricao: 'Seu primeiro programa',
            codigo: `
valor = entrar('Informe qualquer coisa', 'Seu nome')
mensagem('Você informou: #valor#');
        `},  
        {
            nome: 'Troca de valores!',
            descricao: 'Troca os valores de 2 variáveis',
            codigo: `
var v1 = entrar('Informe um número', 100)            
var v2 = entrar('Informe outro número', 100)            
saidal("O valores das variáveis são: v1 = " + v1 + " e v2 = " + v2);
saidal("Trocando...");
var aux = v2
v2 = v1
v1 = aux
saidal("Agora: v1 = " + v1 + " e v2 = " + v2);
        `},              

    ]
};