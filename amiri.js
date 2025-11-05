var font = 'AAEAAAAPAQAABAAwRFNJRwBzZbWABNCKAADcEd0Y1Im7xY8hATTAHAAAI7J1UVNCapywMA=='; // مثال مختصر
var callAddFont = function () {
    this.addFileToVFS('Amiri-Regular.ttf', font);
    this.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
};
if (window.jspdf && window.jspdf.jsPDF) {
    window.jspdf.jsPDF.API.events.push(['addFonts', callAddFont]);
}