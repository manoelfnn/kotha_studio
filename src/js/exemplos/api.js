export default {
    nome: 'API',
    exemplos: [
        {
            nome: 'Busca Cidade',
            descricao: 'Mostra a cidade através do CEP informado',
            codigo: `
TJanela('Cidade', 195, 140)

entrada = TEntrada()
entrada.y = 10
entrada.margem = 10

botao = TBotao('Buscar')
botao.y = 50;
botao.margem = 10
botao.clique = 'buscar'

texto = TTexto('')
texto.margem = 10
texto.y = 85
texto.fonte.negrito = true

funcao buscar(ee){
    cep = entrada.valor;
    resposta = api('https://viacep.com.br/ws/' + cep + '/json');
    texto.valor = resposta ? resposta.localidade : 'Cep inválido'   
}
        
        `,
        },
        {
            nome: 'Cachorro',
            descricao: 'Gera uma imagem aleátoria de um cachorro',
            codigo: `

TJanela('Cão', 200)
url = '';
img = TImagem(url, '100%', '100%')
img.clique = 'gerar'
funcao gerar(ee){
    resposta = api('https://dog.ceo/api/breeds/image/random');
    img.src = resposta.message;
}
gerar(nulo)
        
        `,
        },        
        {
            nome: 'API Publicas',
            descricao: 'API públicas',
            codigo: `
/*
*/

/*
r = api('https://dog.ceo/api/breeds/image/random');
janela('Animal', 250, 250)
imagem(r.message, '100%');
*/

/* r = api('https://www.receitaws.com.br/v1/cnpj/13430842000125');
console(r) */
        
        `,
        },        
    ],
};
