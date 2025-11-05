function showPreview() {
  const name = document.getElementById("name").value;
  const quote = document.getElementById("quote").value;
  const previewText = `الاسم: ${name}\n\nالمقولة:\n${quote}`;
  document.getElementById("previewContent").innerText = previewText;
  document.getElementById("previewModal").style.display = "block";
}

function closePreview() {
  document.getElementById("previewModal").style.display = "none";
}

function exportConfirmed() {
  closePreview();
  generatePDF();
}

function generatePDF() {
  const name = document.getElementById("name").value;
  const quote = document.getElementById("quote").value;
  const doc = new window.jspdf.jsPDF();
  doc.setFont("Amiri");
  doc.setFontSize(16);
  doc.text(`الاسم: ${name}`, 20, 30, { align: "right" });
  doc.text(`المقولة:\n${quote}`, 20, 50, { align: "right" });
  doc.save("quote.pdf");
}

function generateWord() {
  const name = document.getElementById("name").value;
  const quote = document.getElementById("quote").value;
  const content = `الاسم: ${name}\n\nالمقولة:\n${quote}`;
  const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quote.docx";
  link.click();
}