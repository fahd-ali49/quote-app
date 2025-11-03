const approvedUsers = [
  { email: "admin@example.com", password: "admin123", approved: true },
  { email: "fahd@example.com", password: "fahd123", approved: true },
  { email: "sjil@hotmail.com", password: "sjil2025", approved: true }
];

const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");
const loginSection = document.getElementById("loginSection");
const formSection = document.getElementById("formSection");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const user = approvedUsers.find(u => u.email === email && u.password === password);

  if (user && user.approved) {
    loginSection.classList.add("hidden");
    formSection.classList.remove("hidden");
  } else {
    loginMsg.textContent = "بيانات الدخول غير صحيحة أو لم تتم الموافقة.";
  }
});

function collectData() {
  return {
    entity: document.getElementById("entity").value,
    totalPrice: document.getElementById("totalPrice").value,
    vat: document.getElementById("vat").value,
    unitPrice: document.getElementById("unitPrice").value,
    boards: document.getElementById("boards").value,
    color: document.getElementById("color").value,
    specs: document.getElementById("specs").value,
    totalText: document.getElementById("totalText").value,
    warranty: document.getElementById("warranty").value,
    campaign: document.getElementById("campaign").value,
    seller: document.getElementById("seller").value,
    phone: document.getElementById("phone").value
  };
}

// تصدير PDF
document.getElementById("exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const data = collectData();
  let y = 20;

  doc.setFont("helvetica");
  doc.setFontSize(14);

  for (const [key, value] of Object.entries(data)) {
    doc.text(`${translateKey(key)}: ${value}`, 20, y, { align: "right" });
    y += 10;
  }

  doc.save("quote.pdf");
});

function translateKey(key) {
  const map = {
    entity: "الجهة",
    totalPrice: "السعر الإجمالي",
    vat: "القيمة المضافة",
    unitPrice: "السعر الإفرادي",
    boards: "اللوحات",
    color: "اللون",
    specs: "المواصفات",
    totalText: "الإجمالي كتابة",
    warranty: "الضمان",
    campaign: "الحملة",
    seller: "البائع",
    phone: "رقم الجوال"
  };
  return map[key] || key;
}

// تصدير Word
document.getElementById("exportDocx").addEventListener("click", async () => {
  const response = await fetch("template.docx");
  const arrayBuffer = await response.arrayBuffer();
  const zip = new PizZip(arrayBuffer);
  const doc = new window.docxtemplater().loadZip(zip);

  doc.setData(collectData());

  try {
    doc.render();
  } catch (error) {
    console.error(error);
    alert("خطأ في تعبئة القالب");
    return;
  }

  const out = doc.getZip().generate({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(out);
  link.download = "quote.docx";
  link.click();
});