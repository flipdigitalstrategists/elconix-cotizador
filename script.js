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

const titleInput = document.getElementById("titleInput");
const noteInput = document.getElementById("noteInput");
const titleDisplay = document.getElementById("titleDisplay");
const noteDisplay = document.getElementById("noteDisplay");
const container = document.getElementById("tablesContainer");

titleInput.oninput = (e) => {
  state.title = e.target.value;
  render();
};
noteInput.oninput = (e) => {
  state.note = e.target.value;
  render();
};

function fmt(n) {
  return "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function render() {
  titleDisplay.textContent = state.title;
  noteDisplay.textContent = state.note;
  container.innerHTML = "";

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

    container.appendChild(div);
  });
}

document.getElementById("downloadPNG").onclick = async () => {
  const el = document.getElementById("capture");
  const canvas = await html2canvas(el, { scale: 2 });
  const link = document.createElement("a");
  link.download = "cotizacion-elconix.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

render();
