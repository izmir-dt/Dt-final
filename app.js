/* ALTIN KURAL: Veri çekme motoru korunuyor */

// Mevcut processGviz fonksiyonun varsa, sonuna şu satırı ekle veya fonksiyonu güncelle:
const originalProcessGviz = window.processGviz;
window.processGviz = function(data) {
    // 1. Orijinal veri çekme mantığı çalışsın
    if(originalProcessGviz) originalProcessGviz(data);

    // 2. Veri bittiği an Yoğunluk sekmesini otomatik hazırla (Kopmayı önleyen yer)
    if(window.renderYoğunlukTablosu) {
        window.renderYoğunlukTablosu();
    }

    // 3. Sayaçları güncelle
    if(typeof idtUpdateStats === 'function') idtUpdateStats();
    
    console.log("⚓ Sistematik: Veri motoru senkronize edildi.");
};
/* === İDT FİNAL VERİ KÖPRÜSÜ === */
// Orijinal stats güncellemesinin yanına tabloyu da tetikler
const originalStats = window.idtUpdateStats;
window.idtUpdateStats = function() {
    if(originalStats) originalStats();
    if(window.renderYoğunlukTablosu) window.renderYoğunlukTablosu();
};
