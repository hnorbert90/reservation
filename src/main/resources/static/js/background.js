var ctx = document.querySelector("canvas").getContext("2d");
var ctx2 = document.querySelector("canvas").getContext("2d");
function resize(canvas) {
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;
  if (width != canvas.width || height != canvas.height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function render(time) {
  time *= 0.001;
  resize(ctx.canvas);
  ctx.save();
  var x = ctx.canvas.width;
  var y = ctx.canvas.height;
  var hw = x / 2;
  var hh = y / 2;
  var pointPositionX=0;
  var pointPositionY=y/5;


 
  
  ctx.strokeStyle = "#4CAF50";
  ctx.beginPath();
  ctx.moveTo(0,y/5);
  ctx.lineTo(x/2,y/5);
  ctx.lineTo(x/2,y*2/5);

  ctx.moveTo(x/2,y*3/5);
  ctx.lineTo(x/2,y*4/5);
  ctx.lineTo(x,y*4/5);
  ctx.stroke()
  ctx.restore();

  requestAnimationFrame(render);
}
requestAnimationFrame(render);