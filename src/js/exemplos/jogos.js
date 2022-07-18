export default {
    nome: 'Jogos',
    exemplos: [
        {
            nome: 'Cobrinha',
            descricao: 'Jogo da cobrinha',
            codigo: `

const tela = 300;					// tamanho da tela do jogo
const tamanho = tela / 10;	    // largura e altura da cobra e comida
velocidadeX = 0;					
velocidadeY = 0;					
cobraX = 0;					        
cobraY = 0;					        
comidaX = 0; 				        
comidaY = 0; 				        
listaCaudas = vetor(); 			 
som = tsom() 

janela1 = TJanela("Cobrinha", tela, tela, true);   
janela1.pressionar = 'mover'

função mover(el, tecla){
    tecla = substituir(tecla, 'Arrow', '');
    escolha tecla {
        caso 'Up': {
            velocidadeY = (0 - tamanho);
            velocidadeX = 0;
            pare;
        }
        caso 'Down': {
            velocidadeY = tamanho;
            velocidadeX = 0;
            pare;
        }
        caso 'Left': {
            velocidadeY = 0;
            velocidadeX = 0 - tamanho;
            pare;
        }
        caso 'Right': {
            velocidadeY = 0;
            velocidadeX = tamanho;
            pare;
        }
        padrão: {
            saida("Tecla inválida");
        }        
    }  
}

função criarComida(){
    comidaX = aleatorio(9) * tamanho;
    comidaY = aleatorio(9) * tamanho;
}

função desenhar(){     
    limpar_desenho();
    definir_estilo('red');
    desenhar_retangulo(comidaX, comidaY, tamanho);   
    definir_estilo('black');
    cada cauda em listaCaudas {
        se(cobraX == cauda['x'] e cobraY == cauda['y']) entao {
            listaCaudas = vetor();
            saida("morreu");
            som.tocar(2000, 'AFFFAADDDBDD');
            
        }
        desenhar_retangulo(cauda['x'], cauda['y'], tamanho);        
    }
    desenhar_retangulo(cobraX, cobraY, tamanho);
}

função atualizar(){
    tamanhoCauda = tamanho(listaCaudas);
    // cada cauda terá a posição da próxima cauda
    para i de 0 ate tamanhoCauda - 2 faca {
            listaCaudas[i]['x'] = listaCaudas[i+1]['x']
            listaCaudas[i]['y'] = listaCaudas[i+1]['y']     
    }
    // a ultima cauda terá a posição da cobra atual
    se tamanhoCauda > 0 entao {
        ultimaCauda = tamanhoCauda - 1;
        listaCaudas[ultimaCauda]['x'] = cobraX;
        listaCaudas[ultimaCauda]['y'] = cobraY;
    }
    cobraY += velocidadeY;
    cobraX += velocidadeX;

    // verifica se a cobra passou os limites da tela
    cobraX = cobraX >= tela ? 0 : cobraX;   
    cobraX = cobraX < 0 ? tela - tamanho : cobraX
    cobraY = cobraY >= tela ? 0 : cobraY     
    cobraY = cobraY < 0 ? tela - tamanho : cobraY
        
    se (cobraX == comidaX e cobraY == comidaY) entao {
        push(listaCaudas, vetor());
        som.tocar(300, 'g');
        criarComida();
    }        
}

disparar('rodar', 1000 / 10);
função rodar(){
    atualizar();
    desenhar();
}
criarComida();
        
        
        `,
        },
        {
            nome: 'PingPong',
            descricao: 'Jogo de basquete',
            codigo: `
const tela = 300
const larRaquete = tela / 20
const altRaquete = larRaquete * 4
var velEsquerdaY = 0					
var velDireitaY = 0
var esquerdaX = 30
var esquerdaY = tela / 2 - (altRaquete / 2)
var direitaX = (tela - 30 - larRaquete)
var direitaY = esquerdaY
var bola = larRaquete
var bolaX = tela / 2 - (bola / 2)
var bolaY = bolaX
var velBolaX = bola / 5
var velBolaY = bola / 5

janela1 = TJanela('Ping Pong', tela, tela, verdade)
var ePontos = 0
var dPontos = 0
var placar = TTexto('0 x 0')
placar.fonte.negrito = true
placar.fonte.tamanho = 16
placar.y = 10
placar.x = (tela / 2) - (placar.largura / 2)


janela1.pressionar = 'movimento'
funcao movimento(el, tecla){
    tecla = substituir(tecla, 'Arrow', '')
    escolha tecla {
        caso 'Up': {
            velEsquerdaY = (0 - larRaquete)
            velDireitaY = (0 - larRaquete)
            pare;
        }
        caso 'Down': {
            velDireitaY = larRaquete
            velEsquerdaY = larRaquete
            pare;
        }
        padrao: {
            saida('Tecla inválida')
        }        
    }  
}

funcao desenhar(){     
    limpar_desenho()
    desenhar_retangulo(esquerdaX, esquerdaY, larRaquete, altRaquete)
    desenhar_retangulo(direitaX, direitaY, larRaquete, altRaquete)
    desenhar_circulo(bolaX, bolaY, bola)
}

função atualizar(){
    esquerdaY += velEsquerdaY    
    direitaY += velDireitaY	
    
    esquerdaY = esquerdaY + altRaquete > tela ? tela - altRaquete : esquerdaY
    esquerdaY = esquerdaY <= 0 ? 0 : esquerdaY
    
    direitaY = direitaY + altRaquete > tela ? tela - altRaquete  : direitaY
    direitaY = direitaY <= 0 ? 0 : direitaY
    
    bolaX += velBolaX
    bolaY += velBolaY
        
    velBolaY = bolaY <= 0 ? bola / 5 : velBolaY
    velBolaY = bolaY + bola >= tela ? 0-(bola / 5) : velBolaY
    
    se (bolaX <= 0 ou  bolaX + bola >= tela) entao {
        se (bolaX <= 0){
            dPontos++;
        } senao {
            ePontos++;
        }
        placar.valor = '' + ePontos + ' X ' + dPontos
        bolaX = tela / 2 - (bola / 2)
        bolaY = bolaX                            
    }    
                
    se 
        (bolaY + bola > esquerdaY) e 
        (bolaY < esquerdaY + altRaquete) e 
        (bolaX - bola <= esquerdaX + bola) entao {		
        velBolaX = bola / 5
    }     
    se 
        (bolaY + bola > direitaY) e 
        (bolaY < direitaY + altRaquete) e 
        (bolaX + bola >= direitaX) entao {    	
        velBolaX = (0 - bola / 5)
    }       
}

função rodar(){
    atualizar()
    desenhar()
    velEsquerdaY = 0
    velDireitaY = 0
}
disparar('rodar', 30)
        
        `,
        },
        {
            nome: 'Jogo da velha',
            descricao: 'Jogo da velha',
            codigo: `                        
var casas = vetor(10)
var xVitorias = 0
var oVitorias = 0
var jogadas = 0
var vez = 'X'
var placar;

const vitorias = [
    // verticais
    [0,1,2], [3,4,5], [6,7,8],    
    // horizontais
    [0,3,6], [1,4,7], [2,5,8],
    // diagonais
    [0,4,8], [2,4,6]
];

funcao desenhar(){
    var janela1 = TJanela('Jogo da velha', 180, 170)  
    var x = 20
    var y = 30
    var coluna = 0
    placar = TTexto();  
    placar.y = 4
    placar.x = 42
    placar.fonte.tamanho = 16;
    placar.fonte.negrito = true;  
    para i de 0 ate 8 faca {
        casas[i] = TTexto('')
        casas[i].fonte.tamanho = 40
        casas[i].fonte.negrito = verdade    
        casas[i].fonte.centro = verdade    
        casas[i].largura = 40  
        casas[i].altura = 40
        casas[i].x = x
        casas[i].y = y
        casas[i].nome = i
        casas[i].fundo = '#DDD'
        casas[i].clique = 'jogar'
        x += 45
        se(++coluna == 3){
            coluna = 0
            x = 20
            y += 45
        }
    }
}

funcao zerar(){
    placar.valor = '(X) ' + xVitorias + ' x ' + oVitorias + ' (O)';
    para i de 0 ate 8 faca {
        p = casas[i];
        p.valor = '';
        p.fonte.cor = 'black'
    }
}

funcao verificar(jogador){
    cada v em vitorias {
        se casas[v[0]].valor == jogador e 
            casas[v[1]].valor == jogador e 
            casas[v[2]].valor == jogador entao {
            mensagem('"' + jogador + '" ganhou!!!')
            se jogador == 'X' entao 
                xVitorias++ 
            senao 
                oVitorias++
            jogadas = 0;            
            zerar()
        }
    }
}

funcao jogar(ee){
    se ee.valor != '' entao 
        retorno falso;
    jogadas++;
    ee.valor = vez;
    ee.fonte.cor = vez == 'X' ? 'black' : 'red'
    vez = vez == 'X' ? 'O' : 'X'    
    verificar('X')
    verificar('O')
    se jogadas == 9 entao {
        mensagem('Ninguém ganhou!!!')  
        zerar()
    }    
}

desenhar()
zerar()            
 ` }
    ],
};
