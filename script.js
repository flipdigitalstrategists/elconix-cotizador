// ======= STATE =======
const state = {
  title: "RESUMEN DE PROPUESTA ECONÓMICA",
  note: "Precios no incluye ITBMS, sumar el 7%",
  clientLogo: null,
  ownLogo: null,
  tables: [
    {
      title: "PAGOS ÚNICOS ERP Y POS",
      rows: [
        ["Set up CLOUD Elconix PLATAFORMA ELCONIX", 7500],
        [
          "Implementación x 250 hrs\nHoras para llevar todo el proceso de puesta en marcha.",
          25000,
        ],
        ["Entrenamientos x10 hrs", 1500],
        ["Adecuaciones menores x 100 hrs", 9500],
        ["Integración con PAC WEB POS", 3000],
        ["Aplicativo PDT ELCONIX", 5000],
        ["Licencias 21 POS SERVER", 12600],
      ],
    },
    {
      title: "FORMA DE PAGO ERP Y POS",
      rows: [
        ["50% CONTRA FIRMA", 43017.5],
        [
          "50% EN DOCE (12) MENSUALIDADES de $3,584.79, PAGADERAS TREINTA (30) DÍAS DESPUÉS DEL APGO DEL ABONO INICIAL.",
          43017.5,
        ],
      ],
    },
    {
      title: "ANUALIDAD ERP Y POS",
      rows: [
        ["Licencias 15 Usuarios ERP PRO", 13500],
        ["Licencias POS 39 usuarios punto de venta", 6435],
        ["Anualidad de Mantenimiento API de Integración ENX", 1000],
        ["ARPIA CREDITS", 1000],
      ],
    },
  ],
};

// ===== UTIL =====
const fmt = (n) =>
  "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
const fileToDataURL = (file) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });

// ELEMENTOS
const titleInput = document.getElementById("titleInput");
const noteInput = document.getElementById("noteInput");
const tableForms = document.getElementById("tableForms");
const tablesContainer = document.getElementById("tablesContainer");
const titleDisplay = document.getElementById("titleDisplay");
const noteDisplay = document.getElementById("noteDisplay");
const logosBar = document.getElementById("logosBar");
const clientImg = document.getElementById("clientImg");
const ownImg = document.getElementById("ownImg");

// ===== RENDER PREVIEW =====
function renderPreview() {
  titleDisplay.textContent = state.title;
  noteDisplay.textContent = state.note;

  // Logos
  if (state.clientLogo || state.ownLogo) {
    logosBar.classList.remove("hidden");
    if (state.clientLogo) {
      clientImg.src = state.clientLogo;
      clientImg.style.display = "block";
    } else clientImg.style.display = "none";
    if (state.ownLogo) {
      ownImg.src = state.ownLogo;
      ownImg.style.display = "block";
    } else ownImg.style.display = "none";
  } else logosBar.classList.add("hidden");

  tablesContainer.innerHTML = "";
  state.tables.forEach((table, i) => {
    const wrap = document.createElement("div");
    wrap.className = "tableWrap";
    const card = document.createElement("div");
    card.className = "table";

    const head = document.createElement("div");
    head.className = "table-header";
    head.innerHTML = `<div>${table.title}</div><div style="text-align:right">MONTO</div>`;

    const body = document.createElement("div");
    body.className = "table-body";
    let subtotal = 0;
    table.rows.forEach(([d, a]) => {
      const row = document.createElement("div");
      row.className = "row";
      const c1 = document.createElement("div");
      c1.className = "cell-desc";
      c1.setAttribute("contenteditable", "true");
      c1.textContent = d;
      const c2 = document.createElement("div");
      c2.className = "cell-amt";
      c2.setAttribute("contenteditable", "true");
      c2.textContent = fmt(a);
      row.append(c1, c2);
      body.append(row);
      subtotal += Number(a || 0);
    });
    const foot = document.createElement("div");
    foot.className = "subtotal";
    foot.innerHTML = `<div style="text-align:right">Subtotal:</div><div style="text-align:right">${fmt(
      subtotal
    )}</div>`;
    card.append(head, body, foot);
    wrap.append(card);
    tablesContainer.append(wrap);
  });

  scaleToFitA4();
}

// ===== SCALE A4 =====
function scaleToFitA4() {
  const content = document.getElementById("capture");
  const page = document.getElementById("a4page");
  const scale = Math.min(1, page.clientHeight / content.scrollHeight);
  content.style.transform = `scale(${scale})`;
}

// ===== RENDER FORM =====
function renderForms() {
  tableForms.innerHTML = "";
  state.tables.forEach((table, tIndex) => {
    const box = document.createElement("div");
    box.className = "form-section";
    box.innerHTML = `
      <input class="table-title" type="text" value="${table.title}" />
      <div class="rows"></div>
      <div class="table-actions">
        <button class="add-row">+ Fila</button>
        <button class="download-single">PNG</button>
        <button class="dup-table">📄</button>
        <button class="move-up">🔼</button>
        <button class="move-down">🔽</button>
        <button class="delete-table">🗑️</button>
      </div>`;
    const rows = box.querySelector(".rows");
    table.rows.forEach(([desc, amt], rIndex) => {
      const r = document.createElement("div");
      r.className = "row-form";
      r.innerHTML = `
        <input class="desc" type="text" value="${desc}"/>
        <input class="amt" type="number" value="${amt}"/>
        <button class="dup-row">🟩</button>
        <button class="up-row">🔼</button>
        <button class="down-row">🔽</button>
        <button class="del-row">❌</button>`;
      const d = r.querySelector(".desc"),
        a = r.querySelector(".amt");
      d.oninput = (e) => {
        state.tables[tIndex].rows[rIndex][0] = e.target.value;
        renderPreview();
      };
      a.oninput = (e) => {
        state.tables[tIndex].rows[rIndex][1] = parseFloat(e.target.value || 0);
        renderPreview();
      };
      r.querySelector(".dup-row").onclick = () => {
        state.tables[tIndex].rows.splice(rIndex + 1, 0, [
          ...state.tables[tIndex].rows[rIndex],
        ]);
        renderForms();
        renderPreview();
      };
      r.querySelector(".up-row").onclick = () => {
        const arr = state.tables[tIndex].rows;
        if (rIndex > 0)
          [arr[rIndex - 1], arr[rIndex]] = [arr[rIndex], arr[rIndex - 1]];
        renderForms();
        renderPreview();
      };
      r.querySelector(".down-row").onclick = () => {
        const arr = state.tables[tIndex].rows;
        if (rIndex < arr.length - 1)
          [arr[rIndex + 1], arr[rIndex]] = [arr[rIndex], arr[rIndex + 1]];
        renderForms();
        renderPreview();
      };
      r.querySelector(".del-row").onclick = () => {
        state.tables[tIndex].rows.splice(rIndex, 1);
        renderForms();
        renderPreview();
      };
      rows.append(r);
    });
    box.querySelector(".table-title").oninput = (e) => {
      state.tables[tIndex].title = e.target.value;
      renderPreview();
    };
    box.querySelector(".add-row").onclick = () => {
      state.tables[tIndex].rows.push(["Nuevo item", 0]);
      renderForms();
      renderPreview();
    };
    box.querySelector(".download-single").onclick = () => downloadSingle(tIndex);
    box.querySelector(".dup-table").onclick = () => {
      state.tables.splice(
        tIndex + 1,
        0,
        structuredClone(state.tables[tIndex])
      );
      renderForms();
      renderPreview();
    };
    box.querySelector(".move-up").onclick = () => {
      if (tIndex > 0) {
        const a = state.tables;
        [a[tIndex - 1], a[tIndex]] = [a[tIndex], a[tIndex - 1]];
        renderForms();
        renderPreview();
      }
    };
    box.querySelector(".move-down").onclick = () => {
      const a = state.tables;
      if (tIndex < a.length - 1) {
        [a[tIndex + 1], a[tIndex]] = [a[tIndex], a[tIndex + 1]];
        renderForms();
        renderPreview();
      }
    };
    box.querySelector(".delete-table").onclick = () => {
      state.tables.splice(tIndex, 1);
      renderForms();
      renderPreview();
    };
    tableForms.append(box);
  });
}

// ===== DESCARGAS =====
async function downloadSingle(index) {
  const wrap = document.querySelectorAll(".tableWrap")[index];
  const canvas = await html2canvas(wrap, { scale: 2, backgroundColor: null });
  const a = document.createElement("a");
  a.download = `${state.tables[index].title.replace(/\s+/g, "_")}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

document.getElementById("downloadPDF").onclick = async () => {
  const node = document.getElementById("capture");
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#fff",
    x: 20,
    y: 20,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.body.scrollWidth,
    windowHeight: document.body.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });

  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  const margin = 30;
  const imgW = w - margin * 2;
  const imgH = (canvas.height * imgW) / canvas.width;

  pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
  pdf.save(`${state.title.replace(/\s+/g, "_")}.pdf`);
};

// ===== LOGOS =====
document.getElementById("logoClient").onchange = async (e) => {
  if (e.target.files[0]) {
    state.clientLogo = await fileToDataURL(e.target.files[0]);
    renderPreview();
  }
};
document.getElementById("logoOwn").onchange = async (e) => {
  if (e.target.files[0]) {
    state.ownLogo = await fileToDataURL(e.target.files[0]);
    renderPreview();
  }
};

// ===== MENÚ FORMATO =====
function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.append(el);
  requestAnimationFrame(() => (el.style.opacity = 1));
  setTimeout(() => {
    el.style.opacity = 0;
    setTimeout(() => el.remove(), 200);
  }, 1400);
}
function applyStyleToSelection(styleObj) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    showToast("Selecciona el texto para aplicar formato");
    return;
  }
  const range = sel.getRangeAt(0);
  const span = document.createElement("span");
  Object.assign(span.style, styleObj);
  span.appendChild(range.extractContents());
  range.insertNode(span);
  sel.removeAllRanges();
}
document.addEventListener("contextmenu", (e) => {
  if (e.target && e.target.isContentEditable) {
    e.preventDefault();
    const m = document.createElement("div");
    m.className = "context-menu";
    m.innerHTML = `
      <div><strong style="padding:6px 10px;display:block">Formato</strong></div>
      <div class="group">
        <button data-type="font" data-val="ClanOT-NarrowBook">Fuente: Book</button>
        <button data-type="font" data-val="ClanOT-NarrowMedium">Fuente: Medium</button>
      </div>
      <div class="group">
        <button data-type="size" data-val="12">Tamaño: 12</button>
        <button data-type="size" data-val="14">Tamaño: 14</button>
        <button data-type="size" data-val="16">Tamaño: 16</button>
      </div>`;
    document.body.append(m);
    m.style.left = e.pageX + "px";
    m.style.top = e.pageY + "px";
    m.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        const t = b.dataset.type,
          v = b.dataset.val;
        if (t === "font")
          applyStyleToSelection({ fontFamily: `"${v}",Arial,sans-serif` });
        if (t === "size") applyStyleToSelection({ fontSize: `${v}px` });
        m.remove();
      };
    });
    document.addEventListener("click", () => m.remove(), { once: true });
  }
});

// ===== GENERAL =====
titleInput.oninput = (e) => {
  state.title = e.target.value;
  renderPreview();
};
noteInput.oninput = (e) => {
  state.note = e.target.value;
  renderPreview();
};
document.getElementById("addTable").onclick = () => {
  state.tables.push({ title: "Nueva Tabla", rows: [] });
  renderForms();
  renderPreview();
};
window.addEventListener("resize", scaleToFitA4);

// ===== INIT =====
renderForms();
renderPreview();
