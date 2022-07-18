import TControle from "./TControle";

export default class TImagem extends TControle {
    set src(valor) {
        this.jq.attr('src', valor);
    }
}
