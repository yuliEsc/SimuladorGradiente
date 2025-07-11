//1° Defino variables

//Llamo canvas al elemento del html
const canvas = document.getElementById("lienzo");
//Uso la funcion del elemento para darle la forma 2d al grafico
const ctx = canvas.getContext("2d");

const tamaño = 8;         // 8x8 cuadricula
const px = 30;         // cada "pixel" es de 30x30 píxeles
const max_color = 255; // el color máximo en rgb -> blanco
//direccion
const dirCanvas = document.getElementById("direccion");
const dirCtx = dirCanvas.getContext("2d");
const centerX = 50;
const centerY = 50;
const radio = 30;
let angulo= 0;

//Funcion de la flecha
function flecha() {
  dirCtx.clearRect(0, 0, 100, 100);
// Flecha desde el centro hacia la dirección del ángulo
  const arrowX = centerX + Math.cos(angulo) * radio;
  const arrowY = centerY + Math.sin(angulo) * radio;

  dirCtx.beginPath();
  dirCtx.moveTo(centerX, centerY);
  dirCtx.lineTo(arrowX, arrowY);
  dirCtx.strokeStyle = "blue";
  dirCtx.lineWidth = 2;
  dirCtx.stroke();

  // círculo en la punta
  dirCtx.beginPath();
  dirCtx.arc(arrowX, arrowY, 5, 0, 2 * Math.PI);
  dirCtx.fillStyle = "blue";
  dirCtx.fill();

  // también dibujar el círculo base del reloj
  dirCtx.beginPath();
  dirCtx.arc(centerX, centerY, radio, 0, 2 * Math.PI);
  dirCtx.strokeStyle = "gray";
  dirCtx.stroke();
  
}
//defino y=0. Empieza en y=0 de uno en uno hasta tamaño-1
function gradiente(puntoX,puntoY){ //direcion : (puntoX,puntoY)
    for (let y = 0; y < tamaño; y++){
    //defino x=0. Empieza en x=0 de uno en uno hasta tamaño-1
        for (let x = 0; x < tamaño; x++) {
        //
            const avance = x * puntoX + y * puntoY;
            const maxAvance = (tamaño - 1) * Math.hypot(puntoX,puntoY);
            const proporción = avance / maxAvance;
            const valor = Math.max(0, Math.min(255, Math.round(proporción * max_color)));
            ctx.fillStyle = `rgb(${valor}, ${valor}, ${valor})`; // color en escala de grises
            ctx.fillRect(x * px, y * px, px, px); // pintar el cuadrado
        }
    }
}

// Actualizar todo
let puntoX = Math.cos(angulo);
let puntoY = Math.sin(angulo);

function actualizar() {
    puntoX = Math.cos(angulo);
    puntoY = Math.sin(angulo);


  flecha();
  gradiente(puntoX,puntoY);

  document.getElementById("infoGradiente").innerHTML = `
  <strong>Derivadas parciales:</strong><br>
  ∂F/∂x = cos(θ) = ${puntoX.toFixed(2)}<br>
  ∂F/∂y = sin(θ) = ${puntoY.toFixed(2)}<br>
  <strong>Gradiente:</strong> ∇F = (${puntoX.toFixed(2)}, ${puntoY.toFixed(2)})`;


}

actualizar();

// Manejo del movimiento circular
let isDragging = false;

dirCanvas.addEventListener("mousedown", (e) => {
  isDragging = true;
});

dirCanvas.addEventListener("mouseup", () => {
  isDragging = false;
});

dirCanvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

dirCanvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const rect = dirCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const puntoX = mx - centerX;
    const puntoY = my - centerY;

    angulo = Math.atan2(puntoY, puntoX); // ← ángulo de la flecha
    actualizar();
  }
});

const tooltip = document.getElementById("tooltip");

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // ¿En qué celda está?
  const x = Math.floor(mouseX / px);
  const y = Math.floor(mouseY / px);

  if (x >= 0 && x < tamaño && y >= 0 && y < tamaño) {
    // Calculamos el valor f(x, y)
    const avance = x * puntoX + y * puntoY;
    const maxAvance = (tamaño - 1) * Math.hypot(puntoX, puntoY);
    const proporción = avance / maxAvance;
    const valor = Math.max(0, Math.min(255, Math.round(proporción * max_color)));

    tooltip.style.display = "block";
    tooltip.style.left = e.pageX + 10 + "px";
    tooltip.style.top = e.pageY + 10 + "px";
    tooltip.textContent = `F(${x}, ${y}) = ${valor}`;
  } else {
    tooltip.style.display = "none";
  }
});

canvas.addEventListener("mouseleave", () => {
  tooltip.style.display = "none";
});
