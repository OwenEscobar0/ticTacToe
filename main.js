let tablero = ["", "", "", "", "", "", "", "", ""];
let jugadorActual = {
  nombre: "Usuario",
  simbolo: "X",
};
let juegoTerminado = false;

const combinacionesGanadoras = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const casillas = document.querySelectorAll(".casilla");
const mensaje = document.getElementById("mensaje");
const jugadorNombre = document.getElementById("jugador-nombre");
const jugadorSimbolo = document.getElementById("jugador-simbolo");
const usuarioSimbolo = document.getElementById("usuario-simbolo");
const cpuSimbolo = document.getElementById("cpu-simbolo");
casillas.forEach((casilla, indice) => {
  casilla.addEventListener("click", () => realizarMovimiento(indice));
});

function realizarMovimiento(indice) { 
  if (!juegoTerminado && tablero[indice] === "") {
    tablero[indice] = jugadorActual.simbolo;
    casillas[indice].textContent = jugadorActual.simbolo;
    casillas[indice].classList.add(jugadorActual.simbolo);
    comprobarEstadoJuego();
    if (!juegoTerminado) {
      jugadorActual =
        jugadorActual.simbolo === "X"
          ? { nombre: "CPU", simbolo: "O" }
          : { nombre: "Usuario", simbolo: "X" };
      if (jugadorActual.nombre === "CPU") {
        realizarMovimientoCPU();
      }

      mostrarJugadorActual();
    }
  }
}

function realizarMovimientoCPU() { 
  let mejorPuntaje = -Infinity;
  let mejorMovimiento;
  for (let i = 0; i < tablero.length; i++) {
    if (tablero[i] === "") {
      tablero[i] = "O";
      let puntaje = minimax(tablero, 0, false);
      tablero[i] = "";
      if (puntaje > mejorPuntaje) {
        mejorPuntaje = puntaje;
        mejorMovimiento = i;
      }
    }
  }

  tablero[mejorMovimiento] = "O";
  casillas[mejorMovimiento].textContent = "O";
  casillas[mejorMovimiento].classList.add("O");
  comprobarEstadoJuego();
  jugadorActual = { nombre: "Usuario", simbolo: "X" };
  mostrarJugadorActual();
}

function minimax(tablero, profundidad, esMaximizador) {
  let resultado = comprobarGanador();

  if (resultado !== null) {
    return resultado === "X" ? -1 : 1;
  } else if (tableroCompleto()) {
    return 0;
  }

  if (esMaximizador) {
    let mejorPuntaje = -Infinity;

    for (let i = 0; i < tablero.length; i++) {
      if (tablero[i] === "") {
        tablero[i] = "O";
        let puntaje = minimax(tablero, profundidad + 1, false);
        tablero[i] = "";
        mejorPuntaje = Math.max(puntaje, mejorPuntaje);
      }
    }

    return mejorPuntaje;
  } else {
    let mejorPuntaje = Infinity;

    for (let i = 0; i < tablero.length; i++) {
      if (tablero[i] === "") {
        tablero[i] = "X";
        let puntaje = minimax(tablero, profundidad + 1, true);
        tablero[i] = "";
        mejorPuntaje = Math.min(puntaje, mejorPuntaje);
      }
    }

    return mejorPuntaje;
  }
}

function comprobarGanador() {
  for (let i = 0; i < combinacionesGanadoras.length; i++) {
    const [a, b, c] = combinacionesGanadoras[i];
    if (
      tablero[a] !== "" &&
      tablero[a] === tablero[b] &&
      tablero[a] === tablero[c]
    ) {
      return tablero[a];
    }
  }
  return null;
}

function tableroCompleto() {
  return tablero.every((casilla) => casilla !== "");
}

function comprobarEstadoJuego() {
  const ganador = comprobarGanador();
  if (ganador) {
    juegoTerminado = true;
    mensaje.textContent =
      jugadorActual.nombre + "(" + jugadorActual.simbolo + ") gana!";
  } else if (tableroCompleto()) {
    juegoTerminado = true;
    mensaje.textContent = "El juego queda empate!";
  }
}

function reiniciarJuego() {
  tablero = ["", "", "", "", "", "", "", "", ""];
  jugadorActual = { nombre: "Usuario", simbolo: "X" };
  juegoTerminado = false;

  casillas.forEach((casilla) => {
    casilla.textContent = "";
    casilla.classList.remove("X", "O");
  });

  mensaje.textContent = "";
  mostrarJugadorActual();
}

function mostrarJugadorActual() {
  jugadorNombre.textContent = jugadorActual.nombre;
  jugadorSimbolo.textContent = jugadorActual.simbolo;
}

usuarioSimbolo.textContent = "X";
cpuSimbolo.textContent = "O";
