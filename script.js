// ======= ESTADO =======
const state = {
  title: "RESUMEN DE PROPUESTA ECONÓMICA",
  note: "",
  clientLogo: null,
  ownLogo: null,
  // Orden correcto por defecto:
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
const fileToDataURL = file => new Promise(res => { const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(file); });

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
    clientImg.style.display = state.clientLogo ? "block" : "none";
    ownImg.style.display = state.ownLogo ? "block" : "none";
    if (state.clientLogo) clientImg.src = state.clientLogo;
    if (state.ownLogo) ownImg.src = state.ownLogo;
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
      <div class="table-actions">
        <button class="add-row">+ Fila</button>
        <button class="download-single">Descargar PNG de esta tabla</button>
        <button class="dup-table">Duplicar</button>
        <button class="move-up">↑ Subir</button>
        <button class="move-down">↓ Bajar</button>
        <button class="delete-table">Eliminar</button>
      </div>
    `;

    // fila inputs
    const rows = box.querySelector(".rows");
    table.rows.forEach(([desc, amt], rIndex) => {
      const r = document.createElement("div");
      r.className = "row-form";
      r.innerHTML = `
        <input class="desc" type="text" value="${desc}" />
        <input class="amt" type="number" value="${amt}" step="0.01" />
        <button class="icon-btn dup-row" title="Duplicar fila">⧉</button>
        <button class="icon-btn up-row"  title="Fila arriba">▲</button>
        <button class="icon-btn down-row" title="Fila abajo">▼</button>
        <button class="icon-btn del-row" title="Eliminar fila">✕</button>
      `;
      // eventos fila
      const descInput = r.querySelector(".desc");
      const amtInput  = r.querySelector(".amt");
      const dupBtn    = r.querySelector(".dup-row");
      const upBtn     = r.querySelector(".up-row");
      const downBtn   = r.querySelector(".down-row");
      const delBtn    = r.querySelector(".del-row");

      descInput.oninput = e => { state.tables[tIndex].rows[rIndex][0] = e.target.value; renderPreview(); };
      amtInput.oninput  = e => { state.tables[tIndex].rows[rIndex][1] = parseFloat(e.target.value || 0); renderPreview(); };

      dupBtn.onclick  = () => { state.tables[tIndex].rows.splice(rIndex+1,0,[...state.tables[tIndex].rows[rIndex]]); renderForms(); renderPreview(); };
      upBtn.onclick   = () => { if(rIndex>0){ const arr=state.tables[tIndex].rows; [arr[rIndex-1],arr[rIndex]]=[arr[rIndex],arr[rIndex-1]]; renderForms(); renderPreview(); } };
      downBtn.onclick = () => { const arr=state.tables[tIndex].rows; if(rIndex<arr.length-1){ [arr[rIndex+1],arr[rIndex]]=[arr[rIndex],arr[rIndex+1]]; renderForms(); renderPreview(); } };
      delBtn.onclick  = () => { state.tables[tIndex].rows.splice(rIndex,1); renderForms(); renderPreview(); };

      rows.appendChild(r);
    });

    // acciones de tabla
    const titleInput = box.querySelector(".table-title");
    titleInput.oninput = e => { state.tables[tIndex].title = e.target.value; renderPreview(); };

    box.querySelector(".add-row").onclick = () => { state.tables[tIndex].rows.push(["Nuevo item",0]); renderForms(); renderPreview(); };
    box.querySelector(".download-single").onclick = () => downloadSingle(tIndex);
    box.querySelector(".dup-table").onclick = () => { state.tables.splice(tIndex+1,0, structuredClone(state.tables[tIndex])); renderForms(); renderPreview(); };
    box.querySelector(".move-up").onclick = () => { if(tIndex>0){ const a=state.tables; [a[tIndex-1],a[tIndex]]=[a[tIndex],a[tIndex-1]]; renderForms(); renderPreview(); } };
    box.querySelector(".move-down").onclick = () => { const a=state.tables; if(tIndex<a.length-1){ [a[tIndex+1],a[tIndex]]=[a[tIndex],a[tIndex+1]]; renderForms(); renderPreview(); } };
    box.querySelector(".delete-table").onclick = () => { state.tables.splice(tIndex,1); renderForms(); renderPreview(); };

    tableForms.appendChild(box);
  });
}

// ======= DESCARGAS =======
async function downloadSingle(index){
  const wrap = document.getElementById(`wrap-${index}`);
  // Clon con padding propio para incluir halo/sombra sin corte y transparencia
  const clone = wrap.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = "-99999px";
  clone.style.top = "0";
  document.body.appendChild(clone);
  const canvas = await html2canvas(clone, { scale: 2, backgroundColor: null });
  document.body.removeChild(clone);

  const a = document.createElement("a");
  a.download = `${state.tables[index].title.replace(/\s+/g,"_")}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

document.getElementById("downloadPNG").onclick = async () => {
  const node = document.getElementById("capture");
  const canvas = await html2canvas(node, { scale: 2, backgroundColor: null });
  const a = document.createElement("a");
  a.download = "cotizacion-elconix.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
};

// ======= LOGOS =======
document.getElementById("logoClient").onchange = async e => {
  if(e.target.files?.[0]) { state.clientLogo = await fileToDataURL(e.target.files[0]); renderPreview(); }
};
document.getElementById("logoOwn").onchange = async e => {
  if(e.target.files?.[0]) { state.ownLogo = await fileToDataURL(e.target.files[0]); renderPreview(); }
};

// ======= CONTEXT MENU (aplica a selección) =======
function applyStyleToSelection(styleObj){
  const sel = window.getSelection();
  if(!sel || sel.rangeCount===0) return;
  const range = sel.getRangeAt(0);
  if(range.collapsed) {
    // sin selección: aplicar al nodo contenteditable contenedor
    const parent = range.startContainer.parentElement.closest('[contenteditable="true"]');
    if(parent){ Object.assign(parent.style, styleObj); }
    return;
  }
  // con selección: envolver en <span>
  const span = document.createElement('span');
  Object.assign(span.style, styleObj);
  try {
    // divide y envuelve la selección
    span.appendChild(range.extractContents());
    range.insertNode(span);
    // limpiar selección
    sel.removeAllRanges();
  } catch(e) {
    // fallback: aplicar al contenedor
    const parent = range.commonAncestorContainer.parentElement.closest('[contenteditable="true"]');
    if(parent){ Object.assign(parent.style, styleObj); }
  }
}

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
        if(type==="font") applyStyleToSelection({ fontFamily: `"${val}", Arial, sans-serif` });
        if(type==="size") applyStyleToSelection({ fontSize: `${val}px` });
        menu.remove();
      };
    });
    document.addEventListener("click", ()=>menu.remove(), { once:true });
  }
});

// ======= CONTROLES GENERALES =======
document.getElementById("addTable").onclick = () => {
  state.tables.push({ title:"Nueva Tabla", rows:[] });
  renderForms(); renderPreview();
};
titleInput.oninput = e => { state.title = e.target.value; renderPreview(); };
noteInput.oninput  = e => { state.note  = e.target.value;  renderPreview(); };

// ======= INIT =======
renderForms();
renderPreview();
