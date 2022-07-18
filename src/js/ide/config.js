export default class Config {
    constructor() {
        const primeiro = localStorage.getItem('primeiro');
        if (!primeiro) {
            localStorage.setItem('primeiro', true);

            localStorage.setItem('tamanho-fonte', '13px');
            localStorage.setItem('modo', 'escuro');
            localStorage.setItem('exibir-variaveis', true);
            localStorage.setItem('execucao-automatica', 150);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    atualizar(cm = null) {
        $('.CodeMirror').css('font-size', localStorage.getItem('tamanho-fonte'));
        if (cm) {
            if (localStorage.getItem('codigo')) cm.setValue(localStorage.getItem('codigo'));
        }
    }

    carregar() {
        const keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length - 1; i += 1) {
            const e = $(`#config-item-${keys[i]}`);
            const t = e.attr('type');
            const v = localStorage.getItem(keys[i]);
            if (t === 'text' || e.is('select')) {
                e.val(v);
            } else if (t === 'checkbox' && v === 'true') {
                e.prop('checked', true);
            }
        }
        this.atualizar();
    }

    salvar() {
        $("#configModal [id^='config-item-']").each(function () {
            const e = $(this);
            const id = e.attr('id');
            const t = e.attr('type');
            const configItem = id.substring(12, 100);

            if (t === 'text' || e.is('select')) {
                localStorage.setItem(configItem, e.val());
            } else if (t === 'checkbox') {
                localStorage.setItem(configItem, e.is(':checked'));
            }
        });
        this.atualizar();
    }
}
