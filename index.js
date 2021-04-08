$(document).ready(async function() {
  // const output = document.querySelector('output');  

  var canvas = document.getElementById("myCanvas");
  var snakeboard_ctx = canvas.getContext("2d");
  let snake = [  {x: 200, y: 200, color: "red"},  {x: 190, y: 200},  {x: 180, y: 200},  {x: 170, y: 200},  {x: 160, y: 200},];
  let x1 = 200
  let y1 = 200
  let x2 = 200
  let y2 = 200
  const width = 900
  const height = 600
  // That's how you define the value of a pixel //
 
  function drawSnakePart(snakePart) 
  {  
    snake.push(snakePart)
    snakeboard_ctx.fillStyle = snakePart.color || 'lightblue';  
    snakeboard_ctx.strokestyle = 'darkblue';
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);  
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
  }
  
  /*Function that prints the parts*/
  function drawSnake() 
  {  
    snake.forEach(drawSnakePart);
  }
  // That's how you update the canvas, so that your //
  // modification are taken in consideration //
  let key = ''
  let key2 = ''

  var keyDowns = Rx.Observable.fromEvent(document, 'keydown');
  keyDowns.subscribe((e) => {
    // output.textContent = e.key;
    console.log(e.key)
    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)){
      key = e.key
    } else if (['d', 'a', 's', 'w'].includes(e.key)) {
      key2 = e.key
    }
    console.log(key, key2)    
  })

  const {timer} = Rx.Observable
  const source = timer(1, 100)
  const subscribe = source.subscribe({
  next(event) {
    if (key == 'ArrowRight') {
      x1 = x1 + 20 > width ? width - 10 : x1 + 10
    } else if (key == 'ArrowLeft'){
      x1 = x1 - 10 < 0 ? 0 : x1 - 10
    }
    else if (key == 'ArrowDown'){
      y1 = y1 + 10 > height - 10 ? height- 10 : y1 + 10
    } else if (key == 'ArrowUp'){
      y1 = y1 - 10 < 0 ? 0 : y1 - 10
    }
    if (key !== ''){
      drawSnakePart({x: x1, y:  y1})
    }
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
     console.log('done');
  }
  });

  const source2 = timer(1, 100)
  const subscribe2 = source2.subscribe({
  next(x) {
    if (key2 == 'd') {
      x2 = x2 + 20 > width ? width - 10 : x2 + 10
    } else if (key2 == 'a'){
      x2 = x2 - 10 < 0 ? 0 : x2 - 10
    }
    else if (key2 == 's'){
      y2 = y2 + 10 > height - 10 ? height- 10 : y2 + 10
    } else if (key2 == 'w'){
      y2 = y2 - 10 < 0 ? 0 : y2 - 10
    }
    if (key2 !== ''){
      drawSnakePart({x: x2, y:  y2, color: 'red'})
    }
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
     console.log('done');
  }
});


})

