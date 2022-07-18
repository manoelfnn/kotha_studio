export default {
    nome: 'Eventos',
    exemplos: [
        {
            nome: 'Clique', descricao: 'Dispara uma função quando houver um clique', codigo: `
j = TJanela("teste")
j.clique = 'acao'
funcao acao(elemento){
    mensagem('Clicou!')
}
        ` },
    ]
};