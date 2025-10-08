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

function fmt(n) {
  return "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

// === ELEMENTOS ===
const titleInput = document.getElementById("titleInput");
const noteInput = document.getElementById("noteInput");
const titleDisplay = document.getElementById("titleDisplay");
const noteDisplay = document.getElementById("noteDisplay");
const tablesContainer = document.getElementById("tablesContainer");
const tableForms = document.getElementById("tableForms");

// === RENDER PREVIEW ===
function renderPreview() {
  titleDisplay.textContent = state.title;
  noteDisplay.textContent = state.note;
  tablesContainer.innerHTML = "";

  state.tables.forEach((table, index) => {
    const div = document.createElement("div");
    div.className = "table";
    div.id = `table-${index}`;

    const header = document.createElement("div");
    header.className = "table-header";
    header.innerHTML = `
      <span>${table.title}</span>
      <button class="download-single" data-index="${index}">↓ PNG</button>
    `;
    div.appendChild(header);

    let subtotal = 0;
    table.rows.forEach(([desc, amt]) => {
      const row = document.createElement("div");
      row.className = "table-row editable";
      row.innerHTML = `<span contenteditable="true">${desc}</span><span contenteditable="true">${fmt(amt)}</span>`;
      div.appendChild(row);
      subtotal += Number(amt);
    });

    const sub = document.createElement("div");
    sub.className = "subtotal";
    sub.innerHTML = `Subtotal: ${fmt(subtotal)}`;
    div.appendChild(sub);

    tablesContainer.appendChild(div);
  });

  // === DESCARGA INDIVIDUAL ===
  document.querySelectorAll(".download-single").forEach((btn) => {
    btn.onclick = async (e) => {
      const idx = e.target.dataset.index;
      const el = document.getElementById(`table-${idx}`);
      const canvas = await html2canvas(el, { scale: 2 });
      const link = document.createElement("a");
      link.download = `${state.tables[idx].title.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  });
}

// === FORMULARIO DE TABLAS ===
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

// === BOTONES ===
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

// === DESCARGA GLOBAL ===
document.getElementById("downloadPNG").onclick = async () => {
  const el = document.getElementById("capture");
  const canvas = await html2canvas(el, { scale: 2 });
  const link = document.createElement("a");
  link.download = "cotizacion-elconix.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

// === CONTEXT MENU CAMBIO DE FUENTE ===
document.addEventListener("contextmenu", function (event) {
  const target = event.target;
  if (target.isContentEditable) {
    event.preventDefault();

    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.innerHTML = `
      <button data-font="ClanOT-NarrowBook">Book</button>
      <button data-font="ClanOT-NarrowMedium">Medium</button>
    `;
    document.body.appendChild(menu);

    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;

    menu.querySelectorAll("button").forEach((btn) => {
      btn.onclick = () => {
        target.style.fontFamily = `"${btn.dataset.font}", sans-serif`;
        menu.remove();
      };
    });

    document.addEventListener("click", () => menu.remove(), { once: true });
  }
});

// === INICIO ===
renderForms();
renderPreview();
