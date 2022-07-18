export default {
    nome: 'Outros',
    exemplos: [
        {
            nome: 'Labirinto',
            descricao: 'Uso de heurísitica',
            codigo: `
const HEURISTICA = false;
const TEMPO = 100
const TAMANHO_PECA = 20;             
const MAPA = [[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [1,1,1,1,1,0,0,1,1,1,1,0,1,1,1,1,1,0],
                [0,0,1,0,1,0,0,1,1,0,1,1,1,0,1,0,1,0],
                [0,1,1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,0],
                [0,1,0,0,1,1,1,1,0,1,0,0,1,1,1,1,1,0],
                [0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0],
                [0,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,0],
                [0,0,0,0,1,0,1,0,1,1,1,0,0,0,0,1,0,0],
                [0,1,1,1,1,0,1,0,0,0,0,0,1,1,1,1,0,0],
                [0,1,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,0],
                [0,1,0,0,1,0,0,0,0,0,1,0,1,0,1,1,1,0],
                [0,1,0,1,1,1,0,0,1,1,1,0,1,1,1,0,1,0],
                [0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
                ];      
//const IMAGENS = carregar_imagem('assets/images/sprites/2.jpg');
var MapaDistancias = matriz(tamanho(MAPA), tamanho(MAPA[0]))            
var agenteLinha = 0
var agenteColuna = 0
var agenteLinhaUltima = -1
var agenteColunaUltima = -1
const FIM_LINHA = tamanho(MAPA)-1;              
const FIM_COLUNA = tamanho(MAPA[0])-1; 

const janela = TJanela("Busca", tamanho(MAPA[0]) * TAMANHO_PECA, tamanho(MAPA) * TAMANHO_PECA, verdade)
const cores = ['white', 'yellow', 'orange', 'red', 'purple','','blue','gray']

funcao desenhar(){
    limpar_desenho()
    cada linha, l em MAPA {
        cada coluna, c em linha {
        definir_estilo(coluna igual 0 ? 'black' : 'white')
        desenhar_retangulo(c * TAMANHO_PECA, l * TAMANHO_PECA, TAMANHO_PECA)        
        //desenhar_subimagem(IMAGENS, 1, 1, 1, 1, c * TAMANHO_PECA, l * TAMANHO_PECA,TAMANHO_PECA,TAMANHO_PECA);           
        // se (coluna igual 0) {
        //     desenhar_subimagem(IMAGENS, 428, 359, 47, 48, c * TAMANHO_PECA, l * TAMANHO_PECA,TAMANHO_PECA,TAMANHO_PECA);        
        // } 
        
        definir_estilo('gray')
        desenhar_texto(MapaDistancias[l][c], c*TAMANHO_PECA, l*TAMANHO_PECA+12, '8px arial');
        }
    }
    definir_estilo('blue')		
    desenhar_retangulo(agenteColuna * TAMANHO_PECA, agenteLinha * TAMANHO_PECA, TAMANHO_PECA)       
    //desenhar_subimagem(IMAGENS, 133, 85, 57, 56, agenteColuna * TAMANHO_PECA, agenteLinha * TAMANHO_PECA,TAMANHO_PECA,TAMANHO_PECA);       
    
    
}

funcao buscaarvore(){

    se (agenteLinha igual FIM_LINHA e agenteColuna igual FIM_COLUNA) {
        saida("Fim")
        destruir_disparadores()
        retorno verdade
    }     

    var livreAcima = (agenteLinha - 1 >= 0) ? MAPA[agenteLinha - 1][agenteColuna] > 0 : falso
    var livreAbaixo = (agenteLinha + 1 <= tamanho(MAPA)) ? MAPA[agenteLinha + 1][agenteColuna] > 0 : falso
        var livreEsquerda = (agenteColuna - 1 >= 0) ? MAPA[agenteLinha][agenteColuna - 1] > 0 : falso
        var livreDireita = (agenteColuna + 1 <= tamanho(MAPA[0])) ? MAPA[agenteLinha][agenteColuna + 1] > 0 : falso
        
        se(livreAcima e agenteLinha - 1 igual agenteLinhaUltima)
        livreAcima = falso
        se(livreAbaixo e agenteLinha + 1 igual agenteLinhaUltima)
        livreAbaixo = falso
        se(livreEsquerda e agenteColuna - 1 igual agenteColunaUltima)
        livreEsquerda = falso
        se(livreDireita e agenteColuna + 1 igual agenteColunaUltima)
        livreDireita = falso
    
        se(agenteColuna igual 0 e agenteLinha igual 0){
            livreAbaixo = true
        }
            
    var mover;
        se(HEURISTICA){
            var d = [];
            se(livreAcima) push(d, MapaDistancias[agenteLinha - 1][agenteColuna])
            se(livreAbaixo) push(d, MapaDistancias[agenteLinha + 1][agenteColuna])
            se(livreEsquerda) push(d, MapaDistancias[agenteLinha][agenteColuna - 1])
            se(livreDireita) push(d, MapaDistancias[agenteLinha][agenteColuna + 1])     
        var m = min(d)   
    
        se(livreAcima)
            se(MapaDistancias[agenteLinha - 1][agenteColuna] igual m){
                mover = 0;
            }
        se(livreAbaixo)
            se(MapaDistancias[agenteLinha + 1][agenteColuna] igual m){
                mover = 1;
            } 
        se(livreEsquerda)
            se(MapaDistancias[agenteLinha][agenteColuna - 1] igual m){
                mover = 2;
            }
        se(livreDireita)
            se(MapaDistancias[agenteLinha][agenteColuna + 1] igual m){
                mover = 3;
            }   
        } senao {
            mover = aleatorio(3)
        }

        se(mover igual 0 e livreAcima){
            agenteLinhaUltima = agenteLinha;
            agenteColunaUltima = -1;
            agenteLinha--;
        } senao se (mover igual 1 e livreAbaixo){
            agenteLinhaUltima = agenteLinha;
            agenteColunaUltima = -1;
            agenteLinha++;
        } senao se(mover igual 2 e livreEsquerda){
            agenteLinhaUltima = -1;
            agenteColunaUltima = agenteColuna;
            agenteColuna--;
        } senao se(mover igual 3 e livreDireita){
        agenteLinhaUltima = -1;  
            agenteColunaUltima = agenteColuna;
            agenteColuna++;
        } 
    desenhar();   
}

funcao calcularMapaDistancias(){
        cada linha, l em MAPA {
            cada coluna, c em linha {
            se(MAPA[l][c] > 0){
                dy = abs(FIM_LINHA - l);
                dx = abs(FIM_COLUNA - c);
                MapaDistancias[l][c] =  arredondar(raiz((dy * dy) + (dx * dx)), 2)
            }
        }
        }
}

calcularMapaDistancias();
console(MapaDistancias);
disparar('buscaarvore', TEMPO);
desenhar()
            
        `},
    ],
}