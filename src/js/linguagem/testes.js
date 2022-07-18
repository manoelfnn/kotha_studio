import Interpretador from './Interpretador';

const lista = [
    { nome: 'ERRO {}}', codigo: '{}}', erro: true },

    { nome: 'ERRO a a', codigo: 'a a;', erro: true },
    { nome: 'ERRO a=1;;', codigo: 'a=1;;', erro: true },
    { nome: 'ERRO a=b;', codigo: 'a=b;', erro: true },
    { nome: 'ERRO a=;', codigo: 'a=;', erro: true },
    { nome: 'ERRO funcao f(a,){}', codigo: 'funcao f(a,){}', erro: true },
    { nome: 'ERRO funcao f(,){}', codigo: 'funcao f(,){}', erro: true },
    { nome: 'ERRO const', codigo: 'const a; a=1;', erro: true },
    { nome: 'ERRO ?:', codigo: 'a=1>2?', erro: true },
    { nome: 'ERRO ?:', codigo: 'a=1>2??', erro: true },
    { nome: 'ERRO ?:', codigo: 'a=1>2?::', erro: true },
    { nome: 'ERRO ?:', codigo: 'a=1>2:', erro: true },
    { nome: 'ERRO Prop Objeto', codigo: 'a=objetoteste();tosystem(a.ss)', erro: true },
    { nome: 'ERRO Prop Objeto', codigo: 'a=objetoteste();tosystem(a.cor.ss)', erro: true },
    { nome: 'ERRO Prop Objeto', codigo: 'a=1;tosystem(a.ss)', erro: true },


    { nome: 'Expressão 15+9', codigo: 'tosystem(15+9);', espera: 24 },
    { nome: 'Expressão 15+9+155', codigo: 'tosystem(15+9+155);', espera: 179 },
    { nome: 'Expressão 15+9*10', codigo: 'tosystem(15+9*10);', espera: 105 },
    { nome: 'Expressão 15+9*10*5', codigo: 'tosystem(15+9*10*5);', espera: 465 },
    { nome: 'Expressão (7+3)*10', codigo: 'tosystem((7+5)*10);', espera: 120 },
    { nome: 'Expressão 1==1', codigo: 'tosystem(1==1);', espera: true },
    { nome: 'Expressão 1==2', codigo: 'tosystem(1==2);', espera: false },
    { nome: 'Expressão 4>=2+2', codigo: 'tosystem(4>=2+2);', espera: true },
    { nome: 'Expressão 3<=2+2', codigo: 'tosystem(4>=2+2);', espera: true },

    { nome: 'Atribuição', codigo: 'a=10;tosystem(a);', espera: 10 },
    { nome: 'Atribuição', codigo: 'a=10;b=88;tosystem(a+b);', espera: 98 },
    { nome: 'Atribuição', codigo: 'a=10;a+=1;tosystem(a);', espera: 11 },
    { nome: 'Atribuição', codigo: 'var a=10;tosystem(a);', espera: 10 },
    { nome: 'Atribuição', codigo: 'var a;a=10;tosystem(a);', espera: 10 },
    { nome: 'Atribuição', codigo: 'const a=10;tosystem(a);', espera: 10 },

    { nome: 'Vetor []', codigo: 'a=[];tosystem(a);', espera: [] },
    { nome: 'Vetor vetor(10)', codigo: 'a=vetor(10);tosystem(tamanho(a));', espera: 10 },
    { nome: 'Vetor', codigo: 'a=vetor(5);a[1]="teste";tosystem(a[1]);', espera: 'teste' },
    { nome: 'Matriz', codigo: 'a=matriz(5,5);a[1][2]="teste";tosystem(a[1][2]);', espera: 'teste' },
    { nome: 'Prop Objeto', codigo: 'a=objetoteste();tosystem(a.cor)', espera: 'black' },
    { nome: 'Prop Prop Objeto', codigo: 'a=objetoteste();tosystem(a.fonte.tamanho)', espera: '12px' },        
    { nome: 'Método Objeto', codigo: 'o=objetoteste();tosystem(o.fun1(12, 17))', espera: 'fun1() a: 12, b: 17' },        

    { nome: 'Inc', codigo: 'a=10;a++;tosystem(a);', espera: 11 },
    { nome: 'Inc', codigo: 'a=10;tosystem(a++);', espera: 10 },
    { nome: 'Inc', codigo: 'a=10;tosystem(++a);', espera: 11 },
    { nome: 'Inc Vetor', codigo: 'a=vetor(2);a[1]=1;tosystem(a[1]++);', espera: 1 },
    { nome: 'Inc Vetor', codigo: 'a=vetor(2);a[1]=1;tosystem(++a[1]);', espera: 2 },

    { nome: 'Ternário', codigo: 'a=1>2?56:3;tosystem(a);', espera: 3 },
    
    { nome: 'Função', codigo: 'a=77;funcao f(){retorno a+15;}tosystem(f());', espera: 92 },
    { nome: 'Função', codigo: 'funcao f(a,b){retorno a+b;}tosystem(f(15,14));', espera: 29 },

    { nome: 'if', codigo: 'a=1;if(10>9)a=a+2;tosystem(a);', espera: 3 },
    { nome: 'if', codigo: 'a=1;if(10>99)a=a+2;tosystem(a);', espera: 1 },
    { nome: 'if', codigo: 'if(10>99)tosystem(true);else tosystem(false);', espera: false },

    { nome: 'para', codigo: 'a=0;para i de 1 ate 5 faca {a++;tosystem(a);}', espera: 5 },

    { nome: 'for', codigo: 'i=0;for(i=1;i<=5;i++){}tosystem(i);', espera: 6 },

    {
        nome: 'escolha',
        codigo:
            'a="b";tosystem(700);escolha a {caso "a":{tosystem(1);break;}caso "b":{tosystem(2);break;}caso "c":{tosystem(3);break;}padrao:{tosystem(100);break;}}',
        espera: 2,
    },
    {
        nome: 'escolha-padrao',
        codigo:
            'a="baa";tosystem(700);escolha a {caso "a":{tosystem(1);break;}caso "b":{tosystem(2);break;}caso "c":{tosystem(3);break;}padrao:{tosystem(100);break;}}',
        espera: 100,
    },
    {
        nome: 'escolha-padrao(sem)',
        codigo:
            'a="baa";tosystem(700);escolha a {caso "a":{tosystem(1);break;}caso "b":{tosystem(2);break;}caso "c":{tosystem(3);break;}}',
        espera: 700,
    },

    { nome: 'while', codigo: 'a=1;while(a<10)a++;tosystem(a);', espera: 10 },

    { nome: 'while-break', codigo: 'a=1;while(a<10){if(a==5)break;a++;}tosystem(a);', espera: 5 },
    {
        nome: 'while-continue',
        codigo: 'a=1;b="t";while(a<5){a++;if(a==2||a==4)continue;b+=a;}tosystem(b);',
        espera: 't35',
    },


];

export default function () {
    const inter2 = new Interpretador(null, null, null);
    lista.forEach((t) => {
        inter2.carregar(t.codigo, false, false);
        inter2.executarTudo();
        const r = inter2.obterResultado();
        if (typeof t.erro !== 'undefined') {
            if (inter2.erro) {
                console.log(`${t.nome}: %cOK`, 'color:green;');
            } else {
                console.log(`${t.nome}: %c(E: ${t.codigo}, O: ${r}) PASSOU`, 'color:red;');
            }
        } else if (r === t.espera || typeof(r) === "object") {
            console.log(`${t.nome}: %c(${t.espera}) OK`, 'color:green;');
        } else if (inter2.erro) {
            console.log(`${t.nome}: %c${t.codigo} ERRO`, 'color:red;');
        } else {
            console.log(`${t.nome}: %c(E: ${t.espera}, O: ${r}) ERRO`, 'color:red;');
        }
    });
}
