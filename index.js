 //import { WIDTH, HEIGHT } from './constants';

let PLAYER_OPTIONS = [
  {location: [200, 300], color: 'red', controls:['ArrowLeft', 'ArrowRight'], direction:'up', name:"1"}, 
  {location: [300, 400], color: 'blue', controls:['a', 'd'], direction:'up', name:"2"},
  {location: [400, 500], color: 'yellow', controls:['v', 'n'], direction:'up', name:"3"},
  {location: [500, 600], color: 'green', controls:['i', 'p'], direction:'up', name:"4"}
];

const copy = JSON.parse(JSON.stringify(PLAYER_OPTIONS))

$(document).ready(async function() {
  // const output = document.querySelector('output');  
  var canvas = document.getElementById("myCanvas");
  var snakeboard_ctx = canvas.getContext("2d");
  let pixels = [];
  let players = [];
  let deaths = 0
  const width = 900
  const height = 600
  let inMenu = true
  drawMainMenu()
  
  // Start Button
  var startbutton = Rx.Observable.fromEvent(document, 'click');
  startbutton
  .filter(click => (players.length != 0) && inMenu && click.x > 347 && click.x < 573 && click.y < 237 && click.y > 205)
  .subscribe(() => {
    snakeboard_ctx.clearRect(0,0,width,height);
    startGame();
    inMenu = false;
  });

  // New Player
  var newplayerbutton = Rx.Observable.fromEvent(document, 'click');
  newplayerbutton
  .filter(click => inMenu && click.x > 347 && click.x < 573 && click.y < 309 && click.y > 278)
  .subscribe(() => {
    if(PLAYER_OPTIONS.length != 0){
      players.push(PLAYER_OPTIONS.pop());
      console.log(players)
    }
    snakeboard_ctx.clearRect(0,0,width,height);
    pixels = [];

    drawMainMenu();
  });

  function drawMainMenu() {
    snakeboard_ctx.font = "30px Arial";
    snakeboard_ctx.fillText(`Total Players: ${players.length} of ${players.length + PLAYER_OPTIONS.length}`,30,30);
    // Players
    for(var i = 0; i < players.length; i++){
      snakeboard_ctx.fillStyle = players[i].color;  
      snakeboard_ctx.fillRect(30, 50 * (2+i), 10, 10);  
      snakeboard_ctx.fillStyle = 'black'
      snakeboard_ctx.strokeRect(30, 50 * (2+i), 10, 10);
      snakeboard_ctx.font = "20px Arial";
      snakeboard_ctx.fillText( `${players[i].controls}`, 50, 10 + 50 * (2+i));
    }
    // Start
    snakeboard_ctx.beginPath();
    snakeboard_ctx.rect(width * 3/8, height * 4/8 - 30, width / 4, 30);
    snakeboard_ctx.stroke();
    snakeboard_ctx.font = "30px Arial";
    snakeboard_ctx.fillText("New Player", width * 3/8 ,height * 4/8);
    // New Player
    snakeboard_ctx.beginPath();
    snakeboard_ctx.rect(width * 3/8, height * 3/8 - 30, width / 4, 30);
    snakeboard_ctx.stroke();
    snakeboard_ctx.font = "30px Arial";
    snakeboard_ctx.fillText("Start",width * 3/8 ,height * 3/8);
  }
 
  function drawSnakePart(snakePart) 
  {  
    //snake.push(snakePart)
    snakeboard_ctx.fillStyle = snakePart.color || 'lightblue';  
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);  
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
  }
  
  // Keys Events, Controls player movements, sets direction of snake
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

  function startGame() {

    // Powers
    const {interval} = Rx.Observable
    let superPowers = interval(9000);
    let superPowers2 = superPowers.scan((acc, curr) => {acc + curr}, 0).filter(x => x % 2 !== 0);

    const superUnsub = superPowers2.subscribe((e) => {

      let x_index = Math.floor(Math.random()* (width/10 + 1)) * 10
      let y_index = Math.floor(Math.random()* (height/10 + 1)) * 10
      while (pixels.some(obj => obj.x === x_index && obj.y === y_index && (obj.power === true || obj.power === false))) {
        x_index = Math.floor(Math.random()* (width/10 + 1)) * 10
        y_index = Math.floor(Math.random()* (height/10 + 1)) * 10
      }
      pixels.push({x: x_index, y: y_index, power: true})
      drawSnakePart({color: "purple", x: x_index, y: y_index})
    });

    // Snake Movement
    players.forEach((player) => {
      const {timer} = Rx.Observable
      const source = timer(1, 100)
      const unsub = source.subscribe({
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
          if (pixels.some(obj => obj.x == player.location[0] && obj.y == player.location[1] && obj.power == true)) {
            let left = player.controls[0]
            player.controls[0] = player.controls[1]
            player.controls[1] = left
          }
          if (!pixels.some(obj => obj.x == player.location[0] && obj.y == player.location[1] && obj.power == false)) {
            drawSnakePart({x: player.location[0], y:  player.location[1], color: player.color})
          } else {
            player.unsub.unsubscribe()
            deaths +=1 
            if (deaths >= players.length - 1) {
              players.forEach((player)=>player.unsub.unsubscribe())
              inMenu = true
              pixels = [];
              players = []
              PLAYER_OPTIONS =  JSON.parse(JSON.stringify(copy))
              snakeboard_ctx.fillStyle = 'black'
              deaths = 0
              drawMainMenu()
              console.log(superUnsub.unsubscribe())
            }
          }
          pixels.push({x: player.location[0], y: player.location[1], power: false})        

      },
      error(err) {
        console.error('something wrong occurred2: ' + err);
      },
      complete() {
         console.log('done');
      }
      });
      player["unsub"] = unsub
    })
  }
})

