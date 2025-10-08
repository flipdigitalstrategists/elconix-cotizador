// ======= ESTADO =======
const state = {
  title: "RESUMEN DE PROPUESTA ECONÓMICA",
  note: "",
  clientLogo: null,
  ownLogo: null,
  tables: [
    {
      title: "PAGOS ÚNICOS ERP Y POS",
      rows: [
        ["Set up CLOUD Elconix PLATAFORMA ELCONIX", 7500],
        ["Implementación x 250 hrs\nHoras para llevar todo el proceso de puesta en marcha.", 25000],
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
        ["50% CONTRA FIRMA", 43017.50],
        ["50% EN DOCE (12) MENSUALIDADES de $3,584.79, PAGADERAS TREINTA (30) DÍAS DESPUÉS DEL APGO DEL ABONO INICIAL.", 43017.50],
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

// ======= UTIL =======
const fmt = n => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

// ======= ELEMENTOS =======
const titleInput = document.getElementById("titleInput");
const noteInput = document.getElementById("noteInput");
const tableForms = document.getElementById("tableForms");
const tablesContainer = document.getElementById("tablesContainer");
const titleDisplay = document.getElementById("titleDisplay");
const noteDisplay = document.getElementById("noteDisplay");
const logosBar = document.getElementById("logosBar");
const clientImg = document.getElementById("clientImg");
const ownImg = document.getElementById("ownImg");
const logoClientInput = document.getElementById("logoClient");
const logoOwnInput = document.getElementById("logoOwn");

// ======= RENDER PREVIEW =======
function renderPreview() {
  titleDisplay.textContent = state.title;
  noteDisplay.textContent = state.note;

  // Logos
  if (state.clientLogo || state.ownLogo) {
    logosBar.classList.remove("hidden");
    if (state.clientLogo) clientImg.src = state.clientLogo; else clientImg.removeAttribute("src");
    if (state.ownLogo) ownImg.src = state.ownLogo; else ownImg.removeAttribute("src");
  } else {
    logosBar.classList.add("hidden");
  }

  // Tablas
  tablesContainer.innerHTML = "";
  state.tables.forEach((table, i) => {
    const wrap = document.createElement("div");
    wrap.className = "tableWrap";
    wrap.id = `wrap-${i}`;

    const card = document.createElement("div");
    card.className = "table";
    card.id = `table-${i}`;

    // Header
    const header = document.createElement("div");
    header.className = "table-header";
    const left = document.createElement("div");
    left.textContent = table.title;
    const right = document.createElement("div");
    right.className = "header-right";
    right.textContent = "MONTO";
    header.append(left, right);

    const body = document.createElement("div");
    body.className = "table-body";

    let subtotal = 0;
    table.rows.forEach(([desc, amount]) => {
      const row = document.createElement("div");
      row.className = "row";

      const c1 = document.createElement("div");
      c1.className = "cell-desc";
      c1.setAttribute("contenteditable", "true");
      c1.textContent = desc;

      const c2 = document.createElement("div");
      c2.className = "cell-amt";
      c2.setAttribute("contenteditable", "true");
      c2.textContent = fmt(amount);

      row.append(c1, c2);
      body.appendChild(row);

      subtotal += Number(amount || 0);
    });

    const foot = document.createElement("div");
    foot.className = "subtotal";
    foot.innerHTML = `<div style="text-align:right">Subtotal:</div><div style="text-align:right">${fmt(subtotal)}</div>`;

    card.append(header, body, foot);
    wrap.appendChild(card);
    tablesContainer.appendChild(wrap);
  });
}

// ======= FORM EDITOR =======
function renderForms() {
  tableForms.innerHTML = "";
  state.tables.forEach((table, tIndex) => {
    const box = document.createElement("div");
    box.className = "form-section";
    box.innerHTML = `
      <input class="table-title" type="text" value="${table.title}" data-tindex="${tIndex}" />
      <div class="rows"></div>
      <button class="add-row" data-tindex="${tIndex}">+ Fila</button>
      <button class="download-single" data-index="${tIndex}">Descargar PNG de esta tabla</button>
      <button class="delete-table" data-index="${tIndex}">Eliminar tabla</button>
    `;

    const rows = box.querySelector(".rows");
    table.rows.forEach(([desc, amt], rIndex) => {
      const r = document.createElement("div");
      r.className = "row-form";
      r.innerHTML = `
        <input class="desc" type="text" value="${desc}" data-tindex="${tIndex}" data-rindex="${rIndex}" />
        <input class="amt" type="number" value="${amt}" step="0.01" data-tindex="${tIndex}" data-rindex="${rIndex}" />
        <button class="del-row" data-tindex="${tIndex}" data-rindex="${rIndex}">✕</button>
      `;
      rows.appendChild(r);
    });

    tableForms.appendChild(box);
  });
  attachFormEvents();
}

function attachFormEvents() {
  // Título de tabla
  document.querySelectorAll(".table-title").forEach(el=>{
    el.oninput = e => { const i = +e.target.dataset.tindex; state.tables[i].title = e.target.value; renderPreview(); };
  });
  // Descripciones
  document.querySelectorAll(".desc").forEach(el=>{
    el.oninput = e => { const t = +e.target.dataset.tindex; const r = +e.target.dataset.rindex; state.tables[t].rows[r][0] = e.target.value; renderPreview(); };
  });
  // Montos
  document.querySelectorAll(".amt").forEach(el=>{
    el.oninput = e => { const t = +e.target.dataset.tindex; const r = +e.target.dataset.rindex; state.tables[t].rows[r][1] = parseFloat(e.target.value||0); renderPreview(); };
  });
  // Borrar fila
  document.querySelectorAll(".del-row").forEach(btn=>{
    btn.onclick = e => { const t=+btn.dataset.tindex, r=+btn.dataset.rindex; state.tables[t].rows.splice(r,1); renderForms(); renderPreview(); };
  });
  // Añadir fila
  document.querySelectorAll(".add-row").forEach(btn=>{
    btn.onclick = e => { const t=+btn.dataset.tindex; state.tables[t].rows.push(["Nuevo item",0]); renderForms(); renderPreview(); };
  });
  // Eliminar tabla
  document.querySelectorAll(".delete-table").forEach(btn=>{
    btn.onclick = () => { const t=+btn.dataset.index; state.tables.splice(t,1); renderForms(); renderPreview(); };
  });
  // Descargar individual (con sombra, padding extra y transparencia)
  document.querySelectorAll(".download-single").forEach(btn=>{
    btn.onclick = async () => {
      const t = +btn.dataset.index;
      const wrap = document.getElementById(`wrap-${t}`);
      // Clon temporal con padding extra para asegurar buen recorte de sombras
      const clone = wrap.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.left = "-99999px";
      clone.style.top = "0";
      document.body.appendChild(clone);
      const canvas = await html2canvas(clone, {scale:2, backgroundColor:null});
      document.body.removeChild(clone);

      const a = document.createElement("a");
      a.download = `${state.tables[t].title.replace(/\s+/g,"_")}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
  });
}

// ======= EVENTOS GENERALES =======
document.getElementById("addTable").onclick = () => {
  state.tables.push({ title:"Nueva Tabla", rows:[] });
  renderForms(); renderPreview();
};

titleInput.oninput = e => { state.title = e.target.value; renderPreview(); };
noteInput.oninput  = e => { state.note  = e.target.value;  renderPreview(); };

// Subir logos
const fileToDataURL = file => new Promise(res => { const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(file); });
logoClientInput.onchange = async e => {
  if(e.target.files && e.target.files[0]) { state.clientLogo = await fileToDataURL(e.target.files[0]); renderPreview(); }
};
logoOwnInput.onchange = async e => {
  if(e.target.files && e.target.files[0]) { state.ownLogo = await fileToDataURL(e.target.files[0]); renderPreview(); }
};

// Descarga global (con logos si existen)
document.getElementById("downloadPNG").onclick = async () => {
  const node = document.getElementById("capture");
  const canvas = await html2canvas(node, { scale: 2, backgroundColor:null });
  const a = document.createElement("a");
  a.download = "cotizacion-elconix.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
};

// ======= CONTEXT MENU (fuente y tamaño) =======
document.addEventListener("contextmenu", (e)=>{
  const t = e.target;
  if(t && t.isContentEditable){
    e.preventDefault();
    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.innerHTML = `
      <div><strong style="padding:6px 10px; display:block">Formato</strong></div>
      <div class="group">
        <button data-type="font" data-val="ClanOT-NarrowBook">Fuente: Book</button>
        <button data-type="font" data-val="ClanOT-NarrowMedium">Fuente: Medium</button>
      </div>
      <div class="group">
        <button data-type="size" data-val="12">Tamaño: 12</button>
        <button data-type="size" data-val="14">Tamaño: 14</button>
        <button data-type="size" data-val="16">Tamaño: 16</button>
      </div>
    `;
    document.body.appendChild(menu);
    menu.style.left = `${e.pageX}px`;
    menu.style.top  = `${e.pageY}px`;

    menu.querySelectorAll("button").forEach(btn=>{
      btn.onclick = ()=>{
        const type = btn.dataset.type, val = btn.dataset.val;
        if(type==="font")  t.style.fontFamily = `"${val}", Arial, sans-serif`;
        if(type==="size")  t.style.fontSize   = `${val}px`;
        menu.remove();
      };
    });
    document.addEventListener("click", ()=>menu.remove(), { once:true });
  }
});

// ======= INICIO =======
renderForms();
renderPreview();
