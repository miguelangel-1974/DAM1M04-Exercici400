"use strict"

const midaCasella = 100;
const numFiles = 3;
const numColumnes = 3;

// Matriu del joc on 0 és el buit
let tauler = []; // Aquí guardamos dónde está cada pieza matemáticamente
let moviments = 0;
let jocAcabat = false;

// Estat ideal per comprovar si hem guanyat
const resolt = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
];

function init() {
  const refCSSRoot = document.documentElement;
  refCSSRoot.style.setProperty("--mida", midaCasella + "px");
  refCSSRoot.style.setProperty("--files", numFiles);
  refCSSRoot.style.setProperty("--columnes", numColumnes);

  const refTauler = document.getElementById("tauler");

  // Crear els divs del DOM (només els números de l'1 al 8)
  for (let i = 1; i <= 8; i++) {
    const refPeca = document.createElement("div");
    refPeca.classList.add("peca");
    refPeca.setAttribute("id", `peca-${i}`);
    refPeca.textContent = i; // Aquí més endavant posaràs les teves imatges
    
    // Afegir l'event de clic
    refPeca.addEventListener("click", () => intentarMoure(i));
    refTauler.appendChild(refPeca);
  }

  const refReset = document.getElementById("btnReinici");
  refReset.addEventListener("click", reinicia);

  reinicia();
}

// Funció per trobar on està un número dins del tauler
function trobarPosicio(valor) {
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === valor) {
        return { fila: f, columna: c };
      }
    }
  }
}

function intentarMoure(valor) {
  if (jocAcabat) return;

  const posPeca = trobarPosicio(valor);
  const posBuit = trobarPosicio(0);

  // Calcular distància Manhattan (ha de ser exactament 1)
  const df = Math.abs(posPeca.fila - posBuit.fila);
  const dc = Math.abs(posPeca.columna - posBuit.columna);

  if (df + dc === 1) {
    // Intercanviar valors a la matriu
    tauler[posBuit.fila][posBuit.columna] = valor;
    tauler[posPeca.fila][posPeca.columna] = 0;
    
    moviments++;
    actualitzaDOM();
    comprovarVictoria();
  }
}

function actualitzaDOM() {
  document.getElementById("comptador").textContent = moviments;

  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      const valor = tauler[f][c];
      
      if (valor !== 0) {
        // Moure visualment el div corresponent
        const refPeca = document.getElementById(`peca-${valor}`);
        const x = c * midaCasella;
        const y = f * midaCasella;
        refPeca.style.transform = `translate(${x}px, ${y}px)`;
      }
    }
  }
}

function comprovarVictoria() {
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] !== resolt[f][c]) {
        return; // Encara no està resolt
      }
    }
  }
  
  // Si arriba aquí, el puzzle està resolt
  jocAcabat = true;
  document.getElementById("missatgeVictoria").classList.remove("ocult");
  document.getElementById("missatgeVictoria").textContent = `¡Puzzle Resolt en ${moviments} moviments!`;
}

function reinicia() {
  // 1. Partim de l'estat resolt
  tauler = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];
  
  jocAcabat = false;
  moviments = 0;
  document.getElementById("missatgeVictoria").classList.add("ocult");

  // 2. Barregem fent moviments vàlids aleatoris (així garantim que és jugable)
  for (let i = 0; i < 100; i++) {
    const posBuit = trobarPosicio(0);
    const movimentsPossibles = [];

    // Mirar quines caselles tenim al voltant
    if (posBuit.fila > 0) movimentsPossibles.push(tauler[posBuit.fila - 1][posBuit.columna]); // Dalt
    if (posBuit.fila < 2) movimentsPossibles.push(tauler[posBuit.fila + 1][posBuit.columna]); // Baix
    if (posBuit.columna > 0) movimentsPossibles.push(tauler[posBuit.fila][posBuit.columna - 1]); // Esquerra
    if (posBuit.columna < 2) movimentsPossibles.push(tauler[posBuit.fila][posBuit.columna + 1]); // Dreta

    // Triar un moviment a l'atzar i intercanviar
    const movimentAleatori = movimentsPossibles[Math.floor(Math.random() * movimentsPossibles.length)];
    const posPecaAleatoria = trobarPosicio(movimentAleatori);
    
    tauler[posBuit.fila][posBuit.columna] = movimentAleatori;
    tauler[posPecaAleatoria.fila][posPecaAleatoria.columna] = 0;
  }

  actualitzaDOM();
}