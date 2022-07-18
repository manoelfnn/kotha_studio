export default [
    {
        nome: 'carregar_imagem',
        min: 1,
        descricao: 'Carrega uma imagem',
        parametros: ['url', 'canvas'],
        categoria: 'Desenho',
        func(args, interpreter) {
            const imagem = new Image();
            imagem.src = args[0];
            return imagem;
        },
    },

    {
        nome: 'desenhar_imagem',
        min: 3,
        descricao: 'Desenha uma imagem',
        parametros: ['imagem', 'x', 'y', 'largura', 'altura'],
        categoria: 'Desenho',
        func(args, interpreter) {
            const imagem = args[0];
            const x = args[1];
            const y = args[2] !== undefined ? args[2] : x;
            if (x === undefined || y === undefined) {
                return false;
            }
            const largura = args[3] !== undefined ? args[3] : imagem.naturalWidth;
            const altura = args[4] !== undefined ? args[4] : imagem.naturalHeight;
            const graus = args[9] !== undefined ? args[9] : null;
            if (!interpreter.usoGeral.contextoPrincipal) {
                interpreter.saida.erro('O modo pintura não foi iniciado');
                return false;
            }
            if (graus) {
                interpreter.usoGeral.contextoPrincipal.save();
                interpreter.usoGeral.contextoPrincipal.translate(x + largura / 2, y + altura / 2);
                interpreter.usoGeral.contextoPrincipal.rotate((graus * Math.PI) / 180);
                interpreter.usoGeral.contextoPrincipal.drawImage(
                    imagem,
                    -(largura / 2),
                    -(altura / 2),
                    largura,
                    altura
                );
                interpreter.usoGeral.contextoPrincipal.restore();
            } else {
                interpreter.usoGeral.contextoPrincipal.drawImage(imagem, x, y, largura, altura);
            }
        },
    },

    {
        nome: 'desenhar_subimagem',
        min: 7,
        descricao: 'Desenha uma parte de imagem',
        parametros: ['imagem', 'ox', 'oy', 'olargura', 'oaltura', 'dx', 'dy', 'dlargura', 'daltura', 'graus'],
        categoria: 'Desenho',
        func(args, interpreter) {
            const imagem = args[0];
            const ox = args[1];
            const oy = args[2];
            const olargura = args[3];
            const oaltura = args[4];

            const dx = args[5];
            const dy = args[6];
            if (dx === undefined || dy === undefined) {
                return false;
            }
            const dlargura = args[7] !== undefined ? args[7] : olargura;
            const daltura = args[8] !== undefined ? args[8] : oaltura;
            const graus = args[9] !== undefined ? args[9] : null;
            if (!interpreter.usoGeral.contextoPrincipal) {
                interpreter.saida.erro('O modo pintura não foi iniciado');
                return false;
            }

            if (graus) {
                interpreter.usoGeral.contextoPrincipal.save();
                interpreter.usoGeral.contextoPrincipal.translate(dx + dlargura / 2, dy + daltura / 2);
                interpreter.usoGeral.contextoPrincipal.rotate((graus * Math.PI) / 180);
                interpreter.usoGeral.contextoPrincipal.drawImage(
                    imagem,
                    ox,
                    oy,
                    olargura,
                    oaltura,
                    -(dlargura / 2),
                    -(daltura / 2),
                    dlargura,
                    daltura
                );
                interpreter.usoGeral.contextoPrincipal.restore();
            } else {
                interpreter.usoGeral.contextoPrincipal.drawImage(
                    imagem,
                    ox,
                    oy,
                    olargura,
                    oaltura,
                    dx,
                    dy,
                    dlargura,
                    daltura
                );
            }
        },
    },

    {
        nome: 'desenhar_retangulo',
        descricao: 'Desenha um retângulo',
        min: 1,
        parametros: ['x', 'y', 'largura', 'altura'],
        categoria: 'Desenho',
        func(args, interpreter) {
            if (args[0] === undefined) {
                return false;
            }
            const x = args[0];
            const y = args[1] !== undefined ? args[1] : x;
            const largura = args[2] !== undefined ? args[2] : 0;
            const altura = args[3] !== undefined ? args[3] : largura;
            if (!interpreter.usoGeral.contextoPrincipal) {
                interpreter.saida.erro('O modo pintura não foi iniciado');
                return false;
            }
            interpreter.usoGeral.contextoPrincipal.fillRect(x, y, largura, altura);
        },
    },

    {
        nome: 'desenhar_circulo',
        min: 3,
        descricao: 'Desenha um círculo',
        parametros: ['x', 'y', 'raio'],
        categoria: 'Desenho',
        func(args, interpreter) {
            if (args[0] === undefined) {
                return false;
            }
            const x = args[0];
            const y = args[1] !== undefined ? args[1] : x;
            const raio = args[2] !== undefined ? args[2] : 60;
            if (!interpreter.usoGeral.contextoPrincipal) {
                interpreter.saida.erro('O modo pintura não foi iniciado');
                return false;
            }
            interpreter.usoGeral.contextoPrincipal.beginPath();

            interpreter.usoGeral.contextoPrincipal.arc(x, y, raio, 0, 2 * Math.PI);
            interpreter.usoGeral.contextoPrincipal.stroke();
        },
    },

    {
        nome: 'desenhar_texto',
        min: 3,
        descricao: 'Desenha um texto',
        parametros: ['texto', 'x', 'y', 'font'],
        categoria: 'Desenho',
        func(args, interpreter) {
            if (args[0] === undefined) {
                return false;
            }
            const texto = args[0];
            const x = args[1];
            const y = args[2] !== undefined ? args[2] : x;
            const font = args[3] !== undefined ? args[3] : '';
            if (!interpreter.usoGeral.contextoPrincipal) {
                interpreter.saida.erro('O modo pintura não foi iniciado');
                return false;
            }
            interpreter.usoGeral.contextoPrincipal.font = font;
            interpreter.usoGeral.contextoPrincipal.fillText(texto, x, y);
        },
    },    

    {
        nome: 'definir_estilo',
        descricao: 'Define o estilo de desenho ',
        min: 1,
        parametros: ['estilo'],
        categoria: 'Desenho',
        func(args, interpreter) {
            const estilo = args[0];
            if (!interpreter.usoGeral.contextoPrincipal) {
                interpreter.saida.erro('O modo pintura não foi iniciado');
                return false;
            }
            interpreter.usoGeral.contextoPrincipal.fillStyle = estilo;
        },
    },

    {
        nome: 'rotacionar',
        min: 1,
        descricao: 'Rotaciona a área de desenho ',
        parametros: ['x', 'y', 'largura', 'altura'],
        categoria: 'Desenho',
        func(args, interpreter) {
            if (args[0] === undefined) {
                return false;
            }
            const x = args[0];
            const y = args[1] !== undefined ? args[1] : x;
            const largura = args[2] !== undefined ? args[2] : 0;
            const altura = args[3] !== undefined ? args[3] : largura;
            if (!interpreter.usoGeral.contextoPrincipal) {
                interpreter.saida.erro('O modo pintura não foi iniciado');
                return false;
            }
            interpreter.usoGeral.contextoPrincipal.fillRect(x, y, largura, altura);
        },
    },

    {
        nome: 'limpar_desenho',
        descricao: 'Limpa a area de desenho',
        min: 0,
        parametros: [],
        categoria: 'Desenho',
        func(args, interpreter) {
            if (!interpreter.usoGeral.contextoPrincipal) {
                interpreter.saida.erro('O modo pintura não foi iniciado');
                return false;
            }
            interpreter.usoGeral.contextoPrincipal.clearRect(
                0,
                0,
                interpreter.usoGeral.canvasPrincipal.clientWidth,
                interpreter.usoGeral.canvasPrincipal.clientHeight
            );
            return true;
        },
    },
];
