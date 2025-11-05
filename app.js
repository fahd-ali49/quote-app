let users = [
  { email: "admin@example.com", password: "admin123", approved: true, role: "admin" },
  { email: "fahd@example.com", password: "fahd123", approved: true, role: "user" },
  { email: "sjil@hotmail.com", password: "123", approved: true, role: "user" }
];

const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");
const loginSection = document.getElementById("loginSection");
const formSection = document.getElementById("formSection");
const adminSection = document.getElementById("adminSection");
const usersTable = document.getElementById("usersTable");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    loginMsg.textContent = "بيانات الدخول غير صحيحة.";
    return;
  }

  if (user.role === "admin") {
    loginSection.classList.add("hidden");
    adminSection.classList.remove("hidden");
    renderUsers();
  } else if (user.approved) {
    loginSection.classList.add("hidden");
    formSection.classList.remove("hidden");
  } else {
    loginMsg.textContent = "لم تتم الموافقة على دخولك بعد.";
  }
});

function renderUsers() {
  usersTable.innerHTML = "";
  users.forEach((u, idx) => {
    if (u.role !== "admin") {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${u.email}</td>
        <td>${u.approved ? "موافق" : "معلق"}</td>
        <td>
          <button onclick="approveUser(${idx})">موافقة</button>
          <button onclick="rejectUser(${idx})">رفض</button>
        </td>
      `;
      usersTable.appendChild(row);
    }
  });
}

function approveUser(idx) {
  users[idx].approved = true;
  renderUsers();
}

function rejectUser(idx) {
  users[idx].approved = false;
  renderUsers();
}

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

document.getElementById("exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  doc.setFont("helvetica"); // مؤقتاً لتفادي خطأ Amiri
  doc.setFontSize(14);

  const data = collectData();
  let y = 20;

  for (const [key, value] of Object.entries(data)) {
    doc.text(`${translateKey(key)}: ${value}`, 180, y, { align: "right" });
    y += 10;
  }

  doc.save("quote.pdf");
});

document.getElementById("exportDocx").addEventListener("click", async () => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/fahd-ali49/quote-app/main/template.docx");
    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const doc = new window.docxtemplater().loadZip(zip);

    doc.setData(collectData());
    doc.render();

    const out = doc.getZip().generate({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(out);
    link.download = "quote.docx";
    link.click();
  } catch (error) {
    console.error("خطأ في التصدير", error);
    alert("حدث خطأ أثناء تصدير الملف، يرجى التأكد من القالب والمحاولة مرة أخرى.");
  }
});