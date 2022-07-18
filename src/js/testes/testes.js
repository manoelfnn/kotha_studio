import Interpretador from "./Interpretador";

export default function () {
    
    this.testeErro = false;
    this.inter = new Interpretador(null);

    this.teste = function (codigo, esperado) {
        if (this.testeErro) return;
        var retorno = this.inter.executar(codigo);
        if (retorno == esperado) {
            console.log('.');
        } else {
            console.log('Esperado: ' + esperado + ', retornado: ' + retorno);
            console.log('Código: ' + codigo);
            console.log(this.inter.executar(codigo, false));
            this.testeErro = true;
        }
    }

    this.testarTudo = function () {
        console.clear();
        this.teste('', null);
        this.teste(';', null);
        this.teste('a = 10', null);
        this.teste('a = 10 + 1', null);
        this.teste('a = 10  retorno a', '10');
        this.teste('a = 10  retorno a + 8', '18');

        this.teste('retorno 1 + 1', '2');
        this.teste('retorno 2 * 2', '4');
        this.teste('retorno 2 * (2 + 3)', 10);
        this.teste('retorno 2 * 2 + 3', 7);

        this.teste('function somar(a,b){retorno a+b}retorno somar(70,45)', 115);
        this.teste('a = 12 repita 23 { a = a + 1} retorno a', 35);
        this.teste('se 1 entao retorno 1 senao retorno 2', 1);
        this.teste('se 1 == 1 entao retorno 1 senao retorno 2', 1);
        this.teste('se 2 == 1 entao retorno 1 senao retorno 2', 2);
        this.teste('se 10 > 11 entao retorno 1 senao retorno 2', 2);
        this.teste('se 10 < 11 entao retorno 1 senao retorno 2', 1);
        this.teste('a = 0 enquanto a < 10 {a = a + 1} retorno a', 10);
    }
};

