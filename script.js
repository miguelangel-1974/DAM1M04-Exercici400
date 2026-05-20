//  VARIABLES GLOBALS

// Mida de cada casella en píxels
var MIDA = 100;

// Estat resolt: les peces del 1 al 8 en ordre, i el 0 és el buit
var ESTAT_RESOLT = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

// El tauler actual (array 2D). Comença igual que l'estat resolt
// i després es barreja
var tauler = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

// Comptador de moviments
var moviments = 0;

//  FUNCIÓ: trobarBuit
//  Busca on és la casella buida (el valor 0) al tauler
//  Retorna un objecte amb { fila, columna }
function trobarBuit() {
    var fila = 0;
    // Recorrem totes les files
    while (fila < 3) {
        var columna = 0;
        // Recorrem totes les columnes d'aquesta fila
        while (columna < 3) {
            // Si trobem el 0, aquest és el buit
            if (tauler[fila][columna] === 0) {
                return { fila: fila, columna: columna };
            }
            columna = columna + 1;
        }
        fila = fila + 1;
    }
}

//  FUNCIÓ: estaResolt
//  Comprova si el tauler actual és igual a l'estat resolt
//  Retorna true o false
function estaResolt() {
    var fila = 0;
    while (fila < 3) {
        var columna = 0;
        while (columna < 3) {
            // Si alguna casella no coincideix, no està resolt
            if (tauler[fila][columna] !== ESTAT_RESOLT[fila][columna]) {
                return false;
            }
            columna = columna + 1;
        }
        fila = fila + 1;
    }
    // Si hem passat tots els checks, està resolt
    return true;
}

//  FUNCIÓ: barrejar
//  Fa 200 moviments aleatoris vàlids per barrejar el tauler
//  Així garantim que el puzle sempre té solució
function barrejar() {
    var i = 0;
    while (i < 200) {
        // Trobem on és el buit
        var buit = trobarBuit();

        // Les 4 direccions possibles: amunt, avall, esquerra, dreta
        var direccions = [
            { df: -1, dc: 0 },
            { df: 1,  dc: 0 },
            { df: 0,  dc: -1 },
            { df: 0,  dc: 1 }
        ];

        // Escollim una direcció aleatòria
        var index = Math.floor(Math.random() * 4);
        var dir = direccions[index];

        // Calculem la posició de la peça que mouríem al buit
        var filaPeca = buit.fila + dir.df;
        var colPeca  = buit.columna + dir.dc;

        // Comprovem que la peça estigui dins del tauler (0..2)
        if (filaPeca >= 0 && filaPeca < 3 && colPeca >= 0 && colPeca < 3) {
            // Intercanviem la peça amb el buit
            var temp = tauler[filaPeca][colPeca];
            tauler[filaPeca][colPeca] = 0;
            tauler[buit.fila][buit.columna] = temp;
        }

        i = i + 1;
    }
}

//  FUNCIÓ: actualitzarUI
//  Mou cada div de peça a la seva posició correcta al tauler
//  usant transform: translate(x, y) per tenir animació suau
function actualitzarUI() {
    var fila = 0;
    while (fila < 3) {
        var columna = 0;
        while (columna < 3) {
            // El valor de la matriu en aquesta posició
            var valor = tauler[fila][columna];

            // Busquem el div que representa aquesta peça
            // Cada div té id="peca-N" on N és el número de peça (1..8)
            // La peça buida té id="peca-0"
            var div = document.getElementById("peca-" + valor);

            // Calculem on ha d'anar visualment (en píxels)
            var x = columna * MIDA;
            var y = fila * MIDA;

            // Movem el div amb transform (animació suau gràcies al CSS transition)
            div.style.transform = "translate(" + x + "px, " + y + "px)";

            columna = columna + 1;
        }
        fila = fila + 1;
    }

    // Actualitzem el comptador de moviments a la pàgina
    document.getElementById("comptador").textContent = moviments;
}

//  FUNCIÓ: clicCasella
//  S'executa quan l'usuari clica una peça
//  fila i columna: posició clicada al tauler lògic
function clicCasella(fila, columna) {
    // Si el puzle ja està resolt, no fem res
    if (estaResolt()) {
        return;
    }

    // Trobem on és el buit
    var buit = trobarBuit();

    // Calculem la distància Manhattan entre la peça i el buit
    var df = Math.abs(fila - buit.fila);
    var dc = Math.abs(columna - buit.columna);

    // Només és un moviment vàlid si la distància és exactament 1
    if (df + dc === 1) {
        // Intercanviem la peça amb el buit al tauler lògic
        var temp = tauler[fila][columna];
        tauler[fila][columna] = 0;
        tauler[buit.fila][buit.columna] = temp;

        // Sumem un moviment
        moviments = moviments + 1;

        // Actualitzem la pantalla
        actualitzarUI();

        // Comprovem si hem guanyat
        if (estaResolt()) {
            document.getElementById("missatgeResolt").textContent =
                "Puzle resolt! Has fet " + moviments + " moviments.";
        }
    }
    // Si no és adjacent, no fem res (la peça no es mou)
}

//  FUNCIÓ: init
//  Crea tots els divs de les peces al DOM
//  S'executa només una vegada a l'inici
function init() {
    var contenidor = document.getElementById("tauler");

    // Creem la peça buida (valor 0)
    var divBuit = document.createElement("div");
    divBuit.id = "peca-0";
    divBuit.classList.add("peca");
    divBuit.classList.add("peca-buida");
    contenidor.appendChild(divBuit);

    // Creem les 8 peces (valors 1..8)
    var n = 1;
    while (n <= 8) {
        var div = document.createElement("div");
        div.id = "peca-" + n;
        div.classList.add("peca");

        // Assignem la imatge de fons corresponent (estan dins la carpeta img/)
        div.style.backgroundImage = "url('img/" + n + ".png')";

        // Guardem en una variable el valor actual de n perquè el listener
        // el recordi correctament (problema clàssic de closures en bucles)
        (function(valor) {
            div.addEventListener("click", function () {
                // Busquem en quin fila/columna és aquesta peça ara
                var pos = trobarPeca(valor);
                clicCasella(pos.fila, pos.columna);
            });
        })(n);

        contenidor.appendChild(div);
        n = n + 1;
    }
}

//  FUNCIÓ: trobarPeca
//  Donada un valor (1..8), retorna { fila, columna } al tauler
function trobarPeca(valor) {
    var fila = 0;
    while (fila < 3) {
        var columna = 0;
        while (columna < 3) {
            if (tauler[fila][columna] === valor) {
                return { fila: fila, columna: columna };
            }
            columna = columna + 1;
        }
        fila = fila + 1;
    }
}

//  FUNCIÓ: reset
//  Barreja el tauler, posa el comptador a 0 i esborra el missatge
function reset() {
    // Barregem el tauler
    barrejar();

    // Resetegem el comptador
    moviments = 0;

    // Esborrem el missatge de victòria
    document.getElementById("missatgeResolt").textContent = "";

    // Actualitzem la pantalla amb la nova posició
    actualitzarUI();
}

//  ARRENCADA: quan el HTML està carregat del tot
window.addEventListener("DOMContentLoaded", function () {
    // Creem els divs de les peces
    init();

    // Barregem per primera vegada
    barrejar();

    // Pintem les peces a la pantalla
    actualitzarUI();

    // El botó Reset crida la funció reset()
    document.getElementById("btnReset").addEventListener("click", function () {
        reset();
    });
});
