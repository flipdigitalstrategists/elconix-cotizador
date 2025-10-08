const state = {
  title: "RESUMEN DE PROPUESTA ECONÓMICA",
  note: "",
  tables: [
    {
      title: "PAGOS ÚNICOS ERP Y POS",
      rows: [
        ["Set up CLOUD Elconix PLATAFORMA ELCONIX", 7500],
        ["Implementación x 250 hrs", 25000],
        ["Entrenamientos x10 hrs", 1500],
        ["Adecuaciones menores x 100 hrs", 9500],
      ],
    },
    {
      title: "FORMA DE PAGO ERP Y POS",
      rows: [
        ["50% contra firma", 43017.5],
        ["50% en 12 mensualidades", 43017.5],
      ],
    },
    {
      title: "ANUALIDAD ERP Y POS",
      rows: [
        ["Licencias 15 usuarios ERP PRO", 13500],
        ["Licencias POS 39 usuarios", 6435],
        ["ARPIA CREDITS", 1000],
      ],
    },
  ],
};

// === ELEMENTOS ===
const titleInput = document.getElementById("titleInput");
const noteInput = document.getElementById("noteInput");
const titleDisplay = document.getElementById("titleDisplay");
const noteDisplay = document.getElementById("noteDisplay");
const tablesContainer = document.getElementById("tablesContainer");
const tableForms = document.getElementById("tableForms");

// === FORMATEADOR DE MONEDA ===
function fmt(n) {
  return "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

// === RENDER DE PREVISUALIZACIÓN ===
function renderPreview() {
  titleDisplay.textContent = state.title;
  noteDisplay.textContent = state.note;
  tablesContainer.innerHTML = "";

  state.tables.forEach((table) => {
    const div = document.createElement("div");
    div.className = "table";

    const header = document.createElement("div");
    header.className = "table-header";
    header.textContent = table.title;
    div.appendChild(header);

    let subtotal = 0;
    table.rows.forEach(([desc, amt]) => {
      const row = document.createElement("div");
      row.className = "table-row";
      row.innerHTML = `<span>${desc}</span><span>${fmt(amt)}</span>`;
      div.appendChild(row);
      subtotal += Number(amt);
    });

    const sub = document.createElement("div");
    sub.className = "subtotal";
    sub.innerHTML = `Subtotal: ${fmt(subtotal)}`;
    div.appendChild(sub);

    tablesContainer.appendChild(div);
  });
}

// === RENDER DEL FORMULARIO ===
function renderForms() {
  tableForms.innerHTML = "";
  state.tables.forEach((table, tIndex) => {
    const section = document.createElement("div");
    section.className = "form-section";

    section.innerHTML = `
      <input class="table-title" type="text" value="${table.title}" data-tindex="${tIndex}" />
      <div class="rows"></div>
      <button class="add-row" data-tindex="${tIndex}">+ Fila</button>
    `;

    const rowsContainer = section.querySelector(".rows");

    table.rows.forEach(([desc, amt], rIndex) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row-form";
      rowDiv.innerHTML = `
        <input class="desc" type="text" value="${desc}" data-tindex="${tIndex}" data-rindex="${rIndex}" />
        <input class="amt" type="number" value="${amt}" data-tindex="${tIndex}" data-rindex="${rIndex}" />
        <button class="del-row" data-tindex="${tIndex}" data-rindex="${rIndex}">✕</button>
      `;
      rowsContainer.appendChild(rowDiv);
    });

    tableForms.appendChild(section);
  });
  addListeners();
}

// === EVENTOS ===
function addListeners() {
  document.querySelectorAll(".table-title").forEach((el) => {
    el.oninput = (e) => {
      const idx = e.target.dataset.tindex;
      state.tables[idx].title = e.target.value;
      renderPreview();
    };
  });

  document.querySelectorAll(".desc").forEach((el) => {
    el.oninput = (e) => {
      const { tindex, rindex } = e.target.dataset;
      state.tables[tindex].rows[rindex][0] = e.target.value;
      renderPreview();
    };
  });

  document.querySelectorAll(".amt").forEach((el) => {
    el.oninput = (e) => {
      const { tindex, rindex } = e.target.dataset;
      state.tables[tindex].rows[rindex][1] = parseFloat(e.target.value || 0);
      renderPreview();
    };
  });

  document.querySelectorAll(".del-row").forEach((btn) => {
    btn.onclick = (e) => {
      const { tindex, rindex } = e.target.dataset;
      state.tables[tindex].rows.splice(rindex, 1);
      renderForms();
      renderPreview();
    };
  });

  document.querySelectorAll(".add-row").forEach((btn) => {
    btn.onclick = (e) => {
      const { tindex } = e.target.dataset;
      state.tables[tindex].rows.push(["Nuevo item", 0]);
      renderForms();
      renderPreview();
    };
  });
}

// === BOTONES PRINCIPALES ===
document.getElementById("addTable").onclick = () => {
  state.tables.push({ title: "Nueva Tabla", rows: [] });
  renderForms();
  renderPreview();
};

titleInput.oninput = (e) => {
  state.title = e.target.value;
  renderPreview();
};

noteInput.oninput = (e) => {
  state.note = e.target.value;
  renderPreview();
};

// === DESCARGAR PNG ===
document.getElementById("downloadPNG").onclick = async () => {
  const el = document.getElementById("capture");
  const canvas = await html2canvas(el, { scale: 2 });
  const link = document.createElement("a");
  link.download = "cotizacion-elconix.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

// === INICIO ===
renderForms();
renderPreview();
