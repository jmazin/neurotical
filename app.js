const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Draw a filled rectangle
ctx.fillStyle = "blue";
ctx.fillRect(20, 20, 50, 50);

// Draw a stroked rectangle
ctx.strokeStyle = "red";
ctx.strokeRect(230, 20, 50, 50);

// Draw a circle (arc)
ctx.beginPath();
ctx.arc(150, 45, 25, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
ctx.fillStyle = "orange";
ctx.fill();

// Draw a line
ctx.beginPath();
ctx.moveTo(20, 115); // Starting point
ctx.lineTo(280, 95); // Line to this point
ctx.strokeStyle = "green";
ctx.lineWidth = 15;
ctx.stroke();
