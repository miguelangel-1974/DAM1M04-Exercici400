"use strict";

const midaCasella = 150;
const numFiles = 3;
const numColumnes = 3;

// Matriu del joc: 0 és el buit, 1..8 són les peces
let tauler = [];
let moviments = 0;
let jocAcabat = false;

// Estat resolt de referència
const resolt = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
];

function init() {
  // Sincronitzar variables CSS amb les constants JS
  const root = document.documentElement;
  root.style.setProperty("--mida", midaCasella + "px");
  root.style.setProperty("--files", numFiles);
  root.style.setProperty("--columnes", numColumnes);

  const refTauler = document.getElementById("tauler");

  // Crear els divs de les peces (1..8), cadascun amb la seva imatge PNG
  for (let i = 1; i <= 8; i++) {
    const refPeca = document.createElement("div");
    refPeca.classList.add("peca");
    refPeca.setAttribute("id", `peca-${i}`);

    // Imatge corresponent a la peça
    const img = document.createElement("img");
    img.src = `img/${i}.png`;
    img.alt = `Peça ${i}`;
    refPeca.appendChild(img);

    // Clic: intentar moure la peça amb número "i"
    refPeca.addEventListener("click", () => intentarMoure(i));

    refTauler.appendChild(refPeca);
  }

  // Botó de reset
  document.getElementById("btnReinici").addEventListener("click", reinicia);

  // Iniciar el joc barrejat
  reinicia();
}

// Retorna { fila, columna } del valor buscat dins la matriu
function trobarPosicio(valor) {
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === valor) {
        return { fila: f, columna: c };
      }
    }
  }
}

// Intenta moure la peça amb el número "valor"
function intentarMoure(valor) {
  if (jocAcabat) return;

  const posPeca = trobarPosicio(valor);
  const posBuit = trobarPosicio(0);

  // Distància Manhattan: ha de ser exactament 1 per ser adjacent
  const df = Math.abs(posPeca.fila - posBuit.fila);
  const dc = Math.abs(posPeca.columna - posBuit.columna);

  if (df + dc === 1) {
    // Intercanviar la peça amb el buit a la matriu
    tauler[posBuit.fila][posBuit.columna] = valor;
    tauler[posPeca.fila][posPeca.columna] = 0;

    moviments++;
    actualitzaDOM();
    comprovarVictoria();
  }
}

// Actualitza el DOM: mou visualment cada peça a la seva posició actual
function actualitzaDOM() {
  document.getElementById("comptador").textContent = moviments;

  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      const valor = tauler[f][c];

      if (valor !== 0) {
        const refPeca = document.getElementById(`peca-${valor}`);
        const x = c * midaCasella;
        const y = f * midaCasella;
        // Animació suau via transform/translate (CSS transition ja ho gestiona)
        refPeca.style.transform = `translate(${x}px, ${y}px)`;
      }
    }
  }
}

// Comprova si el tauler actual coincideix amb l'estat resolt
function comprovarVictoria() {
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] !== resolt[f][c]) return;
    }
  }

  // Puzzle resolt!
  jocAcabat = true;
  const msg = document.getElementById("missatgeVictoria");
  msg.textContent = `Puzzle Resolt en ${moviments} moviment${moviments === 1 ? "" : "s"}!`;
  msg.classList.remove("ocult");
}

// Reinicia el joc: parteix de l'estat resolt i fa 200 moviments vàlids aleatoris
function reinicia() {
  tauler = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];

  jocAcabat = false;
  moviments = 0;
  document.getElementById("missatgeVictoria").classList.add("ocult");

  // Barrejar fent moviments vàlids aleatoris (garanteix que el puzzle és resoluble)
  let ultimMoviment = -1; // Evita desfer l'últim moviment immediatament
  for (let i = 0; i < 200; i++) {
    const posBuit = trobarPosicio(0);
    const veins = [];

    if (posBuit.fila > 0)           veins.push(tauler[posBuit.fila - 1][posBuit.columna]);
    if (posBuit.fila < numFiles - 1) veins.push(tauler[posBuit.fila + 1][posBuit.columna]);
    if (posBuit.columna > 0)                veins.push(tauler[posBuit.fila][posBuit.columna - 1]);
    if (posBuit.columna < numColumnes - 1)  veins.push(tauler[posBuit.fila][posBuit.columna + 1]);

    // Filtrar l'últim moviment per evitar anar i tornar
    const candidats = veins.filter(v => v !== ultimMoviment);
    const escollit = candidats.length > 0
      ? candidats[Math.floor(Math.random() * candidats.length)]
      : veins[Math.floor(Math.random() * veins.length)];

    const posEscollit = trobarPosicio(escollit);
    tauler[posBuit.fila][posBuit.columna] = escollit;
    tauler[posEscollit.fila][posEscollit.columna] = 0;
    ultimMoviment = escollit;
  }

  actualitzaDOM();
}