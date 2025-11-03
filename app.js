const response = await fetch("template.docx");
const arrayBuffer = await response.arrayBuffer();
const zip = new PizZip(arrayBuffer);
const doc = new window.docxtemplater().loadZip(zip);

doc.setData(collectData());
doc.render();