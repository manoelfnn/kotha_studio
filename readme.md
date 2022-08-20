
# Kotha Studio
Linguagem de programação destinada ao ensino de programação.

<a href="https://manoelfnn.github.io/kotha_studio/">Demo</a>

## Características

*   É permitido o uso de acentuação e cedilha, tanto para identificadores (nomes de variáveis e funções) e palavras reservadas.
*   Não é case-sensitive, ou seja **açaí**, **AÇAÍ** e **aÇaÍ** referenciam a mesma variável.
*   A linguagem é dinâmicamente tipada.
*   Não é orientada objetos, porém consegue trabalhar obter ou atribuir valores em atributos em dados do tipo 'Object'.
*   Variáveis não precisam ser declaradas.
*   Não é preciso criar uma estrutura básica.
*   Não é preciso fazer quebra de linhas para iniciar uma nova instrução.
*   O uso de ponto de virgula é opcional.
*   Funções não podem ser declaradas em qualquer parte do código exceto dentro da declaração de outras funções.

## Tipos de dados suportados
~~~javascript
v = 1               // decimal
v = 1.0             // ponto flutuante
v = 0xFF            // hexadecimal
v = 0b1111          // binário
v = 0o20            // octal
v = 'amarelo'       // texto
v = verdade         // lógico
v = falso           // lógico
v = nulo            // nulo
v = [1, 2, 3]       // vetor
~~~


## Como fazer comentários
~~~javascript
// uma linha, primeiro modo
/* múltiplas linhas */
~~~
ou
~~~python
# uma linha, segundo modo
~~~

## Declaração e atribuição de variáveis
~~~javascript
const idade   
var idade   
const idade = 34
var idade = 34   
idade = 34   
idade recebe 34   
idade <- 34   
idade += 1   
idade -= 1   
idade *= 2   
idade /= 2   
idade %= 2
~~~

## Acesso à atributos de objetos

~~~javascript
var obj = ObjetoTeste()
obj.cor = 'red'
obj.fonte.tamanho = '14px'
~~~

## Estruturas da linguagem

### Operador ternário
~~~javascript
idade = idade > 18 ? 'Maior' : 'Menor'
~~~

### Controle de fluxo (if-else)


~~~javascript
se idade > 18 entao
    saida('verdade')
~~~

ou

~~~javascript
se idade > 18 entao
    saida('verdade')
senao
    saida('falso')
~~~
### Controle de fluxo com múltiplas opções (switch-case)
~~~javascript
escolha idade {
    caso 18: {
        saida('dezoito anos')
        pare
    }
    caso 20: {
        saida('vinte anos')
        pare
    }
    padrao: {
        saida('outra idade')
        pare
    }
}
~~~

### Laços de repetição (while, foreach, for, do)

~~~javascript
enquanto i < 5 faca
    i++
    saida(i)
}
~~~

~~~javascript
// while(i < 5) { ... }
enquanto i < 5
    numeros = [1, 2, 3, 4]
~~~

~~~javascript
// foreach(numero in numeros) { ... }
cada numero em numeros
    saida(numero)
~~~

~~~javascript
// for(i = 1; i < 10; i++) { ... }
para i de 1 ate 10 [passo 2] faca {
    saida(i)
}
~~~

~~~javascript
// for(i = 1; i < 10; i++) { ... }
para(i = 0; i < 10; i++) {
    saida(i)
}
~~~

~~~javascript
// for($ = 0; $ <= 100; $++) { ... }
faca 100 {
    saida(i)
}
~~~

## Funções

~~~javascript
funcao somar(a, b){   
    retorno a + b   
}   
somar(10, 20) 
~~~

## Operadores de Incremento e Decremento
~~~javascript
// primeiro obtém o valor
i = 1   
i++ // i = 2
i = 1
i-- // i = 0

// primeiro evolui o incremento ou decremento
++i
--i
~~~

## Funções do sistema

### Função

~~~javascript
vetor(tamanho)
// Cria um vetor

matriz(tamanho, tamanho
// Cria uma matriz

push(vetor, items)
// Adiciona um valor no fim do vetor

pop(vetor)  
// Retira o último elemento do vetor

shift(vetor)  
// Retira o primeiro elemento do vetor

unshift(vetor, valor)  
// Adiciona um valor no início do vetor

juntar(vetor, separador)  
// Junta os elementos de um vetor

ordenar(vetor)  
// Ordena um vetor

inverter(vetor)  
// Inverte um vetor

alcance(inicio, parada, passo)  
// Cria um vetor

entrar(titulo, tipo)  
// Solicita a entrada de uma informação

mensagem(mensagem)  
// Exibe uma caixa de dialogo

limpar()  
// Limpa a seção de saída

saida(texto)  
// Escreve na seção de saída

saidal(texto)  
// Escreve na seção de saída e quebra a linha

console(texto)  
// Escreve no console do navegador

tamanho(variavel)  
// Retorna o tamanho da variável

numero(texto)  
// Transforma um texto em número

disparar(funcao, segundos)  
// Chama uma funçao a cada n segundos

destruirdisparadores()  
// Destroi todos os disparadores ativos

animacao(funcao)  
// Chama uma função de animação

api(url)  
// Faz um requisição GET à uma URL

tipo(expressao)  
// Retorna o tipo de dado

tosystem(texto)  
// Função do sistema

objetoteste()  
// Retorna um objeto teste

carregarimagem(url, canvas)  
// Carrega uma imagem

desenharimagem(imagem, x, y, largura, altura)  
// Desenha uma imagem

desenharsubimagem(imagem, ox, oy, olargura, oaltura, dx, dy, dlargura, daltura, graus)  
// Desenha uma parte de imagem

desenharretangulo(x, y, largura, altura)  
// Desenha um retângulo

desenharcirculo(x, y, raio)  
// Desenha um círculo

desenhartexto(texto, x, y, font)  
// Desenha um texto

definirestilo(estilo)  
// Define o estilo de desenho

rotacionar(x, y, largura, altura)  
// Rotaciona a área de desenho

limpardesenho()  
// Limpa a area de desenho

tjanela(titulo, largura, altura, pintura)  
// Cria um objeto TJanela

tbotao(texto, funcao)  
// Cria um objeto TBotao

tentrada(tipo, padrao)  
// Cria um objeto TEntrada

ttexto(texto)  
// Cria um objeto TTexto

timagem(origem, largura, altura, funcao)  
// Cria um objeto TImagem

tcaixa(nome, largura, altura, cor, container)  
// Cria um objeto TCaixa

remover(elemento)  
// Cria um controle

piso(numero)  
// Arredonda um número para baixo

teto(numero)  
// Arredonda um número para cima

arredondar(numero, casas)  
// Arredonda um número

aleatorio(maximo)  
// Gera um número aleatório

abs(numero)  
// Retorna o valor absoluto de um número

potencia(numero, potencia)  
// Retorna a potencia de um número

sinal(numero)  
// Retorna o sinal de um número

inteiro(numero)  
// Retorna a parte inteira de um número

raiz(numero)  
// Retorna a raiz de um número

min(valor)  
// Retorna o menor valor de um vetor

max(valor)  
// Retorna o maior valor de um vetor

sen(angulo)  
// Retorna o seno do angulo

cos(angulo)  
// Retorna o co-seno do angulo

tan(angulo)  
// Retorna a tangente do angulo

arcsin (seno)  
// Retorna o ângulo do seno

arccos (coseno)  
// Retorna o ângulo do co-seno

arctan (tangente)  
// Retorna o ângulo da tangente

log(numero)  
// Retorna o logaritmo de um número

log2(numero)  
// Retorna o logaritmo de base 2 de um número

log10(numero)  
// Retorna o logaritmo de base 10 de um número

substituir(texto, substituir, nova)  
// Substitui um texto

maiuscula(texto)  
// Transforma um texto em letras maiúsculas

minuscula(texto)  
// Transforma um texto em letras minúsculas

repetir(texto, vezes)  
// Retorna uma novo texto com um determinado número de cópias

dividir(texto, delimitador)  
// Divide um texto em subtexto

preencherinicio(texto, vezes, texto)  
// Preenche o início de um texto com determinado caractere

preencherfim(texto, vezes, texto)  
// Preenche o fim de um texto com determinado caractere

aparar(texto)  
// Remove espaços em branco do início e do fim de texto

subtexto(texto, inicio, tamanho)  
// Retorna um subtexto de um texto

caracter(numero)  
// Retorna um caracter a partir de um número

asc(caracter)  
// Retorna o código do caracter

posicao(numero, busca)  
// Procurar um texto dentro de um texto

tbd(base)  
// Cria um objeto TBD

tsom()  
// Retorno um objeto TSom
