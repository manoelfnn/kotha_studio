export default class TSom {

    tocar(tempo, notacao, wave = 'sawtooth', gain = 0.15, attack = 0.008, decay = 0.2, release = 0.2, cutoff = 0, cutfollow = 20, resonance = 3) {
        var inst = new Instrument();
        inst.setTimbre({wave, gain, attack, decay, release, cutoff, cutfollow, resonance});
        // eslint-disable-next-line no-undef
        inst.play({ tempo }, notacao);
    }
 
}
