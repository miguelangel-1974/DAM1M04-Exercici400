"use strict"

const midaCasella = 150
const numFiles = 3
const numColumnes = 3

// El tauler és un array 2D: 0 = casella buida, 1..8 = peces
let tauler = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
]

// Estat resolt per comprovar si el puzle està acabat
const taulerResolt = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
]

let moviments = 0

// Referència a cada div de fitxa, indexat per número de peça (1..8)
const refFitxes = {}

function init() {

  // Definir els valors de les variables CSS
  const refCSSRoot = document.documentElement
  refCSSRoot.style.setProperty("--mida", midaCasella + "px")
  refCSSRoot.style.setProperty("--files", numFiles)
  refCSSRoot.style.setProperty("--columnes", numColumnes)

  // Obtenir referència al tauler
  const refTauler = document.getElementById("tauler")

  // Crear les caselles (zones de clic) amb dos bucles, igual que l'exemple
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {

      const refCasella = document.createElement("div")
      refCasella.classList.add("casella")
      refCasella.addEventListener("click", () => clicCasella(fila, columna))
      refCasella.style.left = `${columna * midaCasella}px`
      refCasella.style.top = `${fila * midaCasella}px`
      refTauler.appendChild(refCasella)

    }
  }

  // Crear les fitxes (1..8), una per cada peça
  for (let num = 1; num <= 8; num++) {

    const refFitxa = document.createElement("div")
    refFitxa.classList.add("fitxa")
    refFitxa.style.transition = "transform 300ms ease"

    // Posar la imatge corresponent
    const refImg = document.createElement("img")
    refImg.src = `img/${num}.png`
    refImg.alt = `Peça ${num}`
    refFitxa.appendChild(refImg)

    refTauler.appendChild(refFitxa)

    // Guardar referència per poder moure-la després
    refFitxes[num] = refFitxa

  }

  // Afegir event al botó de reset
  const refReset = document.getElementById("btnReinici")
  refReset.addEventListener("click", reinicia)

  reinicia()
}

function clicCasella(fila, columna) {

  // Buscar on és el buit
  const posicioBuit = trobaBuit()

  // Calcular la distància Manhattan
  const df = Math.abs(fila - posicioBuit.fila)
  const dc = Math.abs(columna - posicioBuit.columna)

  // Si la peça és adjacent al buit (distància Manhattan = 1), es pot moure
  if (df + dc === 1) {

    // Intercanviar els valors al tauler
    const temp = tauler[fila][columna]
    tauler[fila][columna] = tauler[posicioBuit.fila][posicioBuit.columna]
    tauler[posicioBuit.fila][posicioBuit.columna] = temp

    // Incrementar el comptador de moviments
    moviments++

    // Actualitzar la UI
    actualitzaDOM()

    // Comprovar si el puzle està resolt
    if (estaResolt()) {
      const refMissatge = document.getElementById("missatge")
      refMissatge.textContent = `Puzle resolt en ${moviments} moviments! 🎉`
    }
  }
}

function trobaBuit() {
  // Buscar la posició del 0 al tauler
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      if (tauler[fila][columna] === 0) {
        return { fila, columna }
      }
    }
  }
}

function actualitzaDOM() {

  // Recórrer el tauler i col·locar cada fitxa a la seva posició
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {

      const num = tauler[fila][columna]

      // El 0 és el buit, no té fitxa
      if (num === 0) continue

      // Calcular la posició en píxels, igual que l'exemple
      const posicioX = columna * midaCasella
      const posicioY = fila * midaCasella

      // Moure la fitxa amb transform/translate (animació suau)
      refFitxes[num].style.transform = `translate(${posicioX}px, ${posicioY}px)`

    }
  }

  // Actualitzar el comptador de moviments
  const refInfo = document.getElementById("info")
  refInfo.textContent = `Moviments: ${moviments}`
}

function estaResolt() {
  // Comparar el tauler actual amb l'estat resolt
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      if (tauler[fila][columna] !== taulerResolt[fila][columna]) {
        return false
      }
    }
  }
  return true
}

function barreja() {
  // Fer 100 moviments aleatoris des de l'estat resolt per garantir que és jugable
  tauler = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ]

  for (let i = 0; i < 100; i++) {
    const posicioBuit = trobaBuit()

    // Possibles moviments: amunt, avall, esquerra, dreta
    const direccions = [
      { fila: posicioBuit.fila - 1, columna: posicioBuit.columna },
      { fila: posicioBuit.fila + 1, columna: posicioBuit.columna },
      { fila: posicioBuit.fila, columna: posicioBuit.columna - 1 },
      { fila: posicioBuit.fila, columna: posicioBuit.columna + 1 }
    ]

    // Filtrar els que estiguin dins del tauler
    const valids = direccions.filter(d =>
      d.fila >= 0 && d.fila < numFiles &&
      d.columna >= 0 && d.columna < numColumnes
    )

    // Escollir un moviment aleatori
    const mov = valids[Math.floor(Math.random() * valids.length)]

    // Fer l'intercanvi
    const temp = tauler[posicioBuit.fila][posicioBuit.columna]
    tauler[posicioBuit.fila][posicioBuit.columna] = tauler[mov.fila][mov.columna]
    tauler[mov.fila][mov.columna] = temp
  }
}

function reinicia() {
  // Barrejar el tauler
  barreja()

  // Posar el comptador a 0
  moviments = 0

  // Netejar el missatge de resolt
  const refMissatge = document.getElementById("missatge")
  refMissatge.textContent = ""

  // Actualitzar la UI
  actualitzaDOM()
}