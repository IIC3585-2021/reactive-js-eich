// import { width, height } from './constants';

const players = [{}]

$(document).ready(async function() {
  // const output = document.querySelector('output');  
  var canvas = document.getElementById("myCanvas");
  var snakeboard_ctx = canvas.getContext("2d");
  let pixels = [{x: 200, y: 300, power: false}, {x:300, y:400, power: false}];
  let players = [{location: [200, 300], color: 'red', controls:['ArrowLeft', 'ArrowRight'], direction:'up'}, 
               {location: [300, 400], color: 'blue', controls:['a', 'd'], direction:'up'}];
  const width = 900
  const height = 600
  drawMenu()
  
  // Menu
  var menu = Rx.Observable.fromEvent(document, 'click');
  menu.subscribe((click) => {
    // Click in Start
    if (click.x > 347 && click.x < 573 && click.y < 237 && click.y > 205){
      alert("Start Game");

    // Click in New Player
    } else if (click.x > 347 && click.x < 573 && click.y < 309 && click.y > 278) {
      alert("New player");
    }
  })

  function drawMenu() {
    snakeboard_ctx.font = "30px Arial";
    snakeboard_ctx.fillText(`Total Players: ${players.length}`,30,30);
    // Nuevo jugador ()
    snakeboard_ctx.beginPath();
    snakeboard_ctx.rect(width * 3/8, height * 3/8 - 30, width / 4, 30);
    snakeboard_ctx.stroke();
    snakeboard_ctx.font = "30px Arial";
    snakeboard_ctx.fillText("Start",width * 3/8 ,height * 3/8);
    // Empezar
    snakeboard_ctx.beginPath();
    snakeboard_ctx.rect(width * 3/8, height * 4/8 - 30, width / 4, 30);
    snakeboard_ctx.stroke();
    snakeboard_ctx.font = "30px Arial";
    snakeboard_ctx.fillText("New Player", width * 3/8 ,height * 4/8);
  }
 
  function drawSnakePart(snakePart) 
  {  
    //snake.push(snakePart)
    snakeboard_ctx.fillStyle = snakePart.color || 'lightblue';  
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);  
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
  }
  
  /*Function that prints the parts*/
  // That's how you update the canvas, so that your //
  // modification are taken in consideration //
  let key = ''
  let key2 = ''

  var keyDowns = Rx.Observable.fromEvent(document, 'keydown');
  keyDowns.subscribe((e) => {
    // output.textContent = e.key;
    players.forEach((player)=>{
      if (player.controls.includes(e.key)) {
        if (player.controls[0] === e.key){ // Apreto tecla Izquierda
          if (player.direction === 'up'){
            player.direction = 'left'
          } else if (player.direction === 'left') {
            player.direction = 'down'
          } else if (player.direction === 'down') {
            player.direction = 'right'
          } else if (player.direction === 'right') {
            player.direction = 'up'
          }
        } else {                         // Apreto tecla Derecha
          if (player.direction === 'up'){
            player.direction = 'right'
          } else if (player.direction === 'left') {
            player.direction = 'up'
          } else if (player.direction === 'down') {
            player.direction = 'left'
          } else if (player.direction === 'right'){
            player.direction = 'down'
          }
        }
      }
    })  
  })
  const {interval} = Rx.Observable
  let superPowers = interval(9000);
  let superPowers2 = superPowers.scan((acc, curr) => {acc + curr}, 0).filter(x => x % 2 !== 0);

  superPowers2.subscribe((e) => {
    let x_index = Math.floor(Math.random()* (width/10 + 1)) * 10
    let y_index = Math.floor(Math.random()* (height/10 + 1)) * 10
    while (pixels.some(obj => obj.x === x_index && obj.y === y_index && (obj.power === true || obj.power === false))) {
      x_index = Math.floor(Math.random()* (width/10 + 1)) * 10
      y_index = Math.floor(Math.random()* (height/10 + 1)) * 10
    }
    console.log("VEAMOS", x_index, y_index)
    pixels.push({x: x_index, y: y_index, power: true})
    drawSnakePart({color: "purple", x: x_index, y: y_index})
  });

  players.forEach((player) => {
    const {timer} = Rx.Observable
    const source = timer(1, 100)
    source.subscribe({
    next(event) {
      if (player.direction == 'right') {
        player.location[0] = player.location[0] + 10 > width - 10 ? width - 10 : player.location[0] + 10
      } else if (player.direction == 'left'){
        player.location[0] = player.location[0] - 10 < 0 ? 0 : player.location[0] - 10
      }
      else if (player.direction == 'down'){
        player.location[1] = player.location[1] + 10 > height - 10 ? height- 10 : player.location[1] + 10
      } else if(player.direction == 'up'){
        player.location[1] = player.location[1] - 10 < 0 ? 0 : player.location[1] - 10
      }
        pixels.push({x: player.location[0], y: player.location[1], power: false})        
        if (pixels.some(obj => obj.x == player.location[0] && obj.y == player.location[1] && obj.power == true)) {
          let left = player.controls[0]
          player.controls[0] = player.controls[1]
          player.controls[1] = left
        }
        drawSnakePart({x: player.location[0], y:  player.location[1], color: player.color})
    },
    error(err) {
      console.error('something wrong occurred: ' + err);
    },
    complete() {
       console.log('done');
    }
    });
  })
})

