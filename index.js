const players = [{}]

$(document).ready(async function() {
  // const output = document.querySelector('output');  
  var canvas = document.getElementById("myCanvas");
  var snakeboard_ctx = canvas.getContext("2d");
  let players = [{location: [200, 300], color: 'red', controls:['ArrowLeft', 'ArrowRight'], direction:'up'}, 
               {location: [300, 400], color: 'blue', controls:['a', 'd'], direction:'up'}];

  const width = 900
  const height = 600
  // That's how you define the value of a pixel //
 
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
        if (player.controls[0] === e.key){
          if (player.direction === 'up'){
            player.direction = 'left'
          } else if (player.direction === 'left') {
            player.direction = 'down'
          } else if (player.direction === 'down') {
            player.direction = 'right'
          } else {
            player.direction = 'up'
          }
        } else {
          if (player.direction === 'up'){
            player.direction = 'right'
          } else if (player.direction === 'left') {
            player.direction = 'up'
          } else if (player.direction === 'down') {
            player.direction = 'left'
          } else {
            player.direction = 'down'
          }
        }
      }
    })  
  })

  players.forEach((player) => {
    const {timer} = Rx.Observable
    const source = timer(1, 100)
    source.subscribe({
    next(event) {
      if (player.direction == 'right') {
        player.location[0] = player.location[0] + 20 > width ? width - 10 : player.location[0] + 10
      } else if (player.direction == 'left'){
        player.location[0] = player.location[0] - 10 < 0 ? 0 : player.location[0] - 10
      }
      else if (player.direction == 'down'){
        player.location[1] = player.location[1] + 10 > height - 10 ? height- 10 : player.location[1] + 10
      } else if(player.direction == 'up'){
        player.location[1] = player.location[1] - 10 < 0 ? 0 : player.location[1] - 10
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

