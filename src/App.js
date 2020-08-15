import React, { useEffect, useRef } from 'react';
import app from './App.module.css';
import { Helmet } from 'react-helmet';
import useWindows from './components/useWindows';
import fruitSrc from './images/kiwi-fruit.svg';
import bombSrc from './images/bomb.svg';

function App() {
  const [speed, setSpeed] = React.useState(15);
  const [count, setCount] = React.useState(0);
  const size = useWindows();
  const ref = React.useRef();
  const [w, h] = size;
  const params = useRef({ xd: 1, yd: 0 });
  const touch = useRef();
  const bomb = useRef();
  const fruit = useRef();

  function direction(d) {
    switch (d) {
      case 'left':
        params.current = { xd: -1, yd: 0 };
        break;
      case 'right':
        params.current = { xd: 1, yd: 0 };
        break;
      case 'up':
        params.current = { xd: 0, yd: -1 };
        break;
      case 'down':
        params.current = { xd: 0, yd: 1 };
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const canvas = ref.current;
    const side = w > h ? h : w;
    const width = side > 600 ? 600 : Math.ceil(side);
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext('2d');
    const interval = setInterval(game, 1000 / speed);
    window.addEventListener('keydown', keyDown);

    let a = (width / 100) * 2.5,
      x = 8,
      y = 3,
      tx = getRandom(),
      ty = getRandom(),
      bp = [{ x: getRandom(), y: getRandom() }];

    const snake = { tail: 5, body: [] };

    bomb.current = new Image();
    bomb.current.src = bombSrc;
    fruit.current = new Image();
    fruit.current.src = fruitSrc;

    function game() {
      ctx.fillStyle = 'lightgrey';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'lime';

      for (let i = 0; i < snake.body.length; i += 1) {
        ctx.fillRect(snake.body[i].x * a, snake.body[i].y * a, a - 2, a - 2);

        const body = snake.body[i];
        if (body.x === x && body.y === y) {
          setCount(0);
          snake.tail = 5;
        }
      }

      snake.body.push({ x, y });
      while (snake.body.length > snake.tail) {
        snake.body.shift();
      }

      x += params.current.xd;
      y += params.current.yd;

      const s = (width - a) / a;
      if (x > s) x = 0;
      if (x < 0) x = s;
      if (y > s) y = 0;
      if (y < 0) y = s;

      bp.forEach(({ x, y }) => {
        ctx.drawImage(bomb.current, x * a, y * a, a - 1, a - 1);
      });

      ctx.drawImage(fruit.current, tx * a, ty * a, a - 1, a - 1);

      if (tx === x && ty === y) {
        snake.tail += 1;
        setCount((prev) => ++prev);
        bp.push({ x: getRandom(), y: getRandom() });
        tx = getRandom();
        ty = getRandom();
      }

      bp.forEach((bomb) => {
        if (bomb.x === x && bomb.y === y) {
          snake.tail = 5;
          setCount(0);
          bp = [{ x: getRandom(), y: getRandom() }];
        }
      });
    }

    function getRandom() {
      return Math.floor(Math.random() * 39);
    }

    function keyDown(e) {
      switch (e.keyCode) {
        case 38: // up
          direction('up');
          break;
        case 40: // down
          direction('down');
          break;
        case 37: // left
          direction('left');
          break;
        case 39: // right
          direction('right');
          break;
        default:
          break;
      }
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', keyDown);
    };
  }, [h, speed, w]);

  const handleTouchStart = (e) => {
    const [{ clientX, clientY }] = e.touches;
    touch.current = { clientX, clientY };
  };

  const handleTouchMove = (e) => {
    const [{ clientX, clientY }] = e.touches;
    const init = touch.current;
    const distance = {
      x: clientX - init.clientX,
      y: clientY - init.clientY,
    };
    if (Math.abs(distance.x) > Math.abs(distance.y)) {
      if (distance.x > 0) {
        direction('right');
      } else {
        direction('left');
      }
    } else {
      if (distance.y > 0) {
        direction('down');
      } else {
        direction('up');
      }
    }
  };

  return (
    <div className={app.container} style={{ height: h }}>
      <Helmet>
        <title>Snake game</title>
      </Helmet>
      <div className={app.func}>
        <div className={app.toolbar}>
          <label className={app.slidelabel} htmlFor="slide">
            Speed
          </label>
          <input
            type="range"
            min="1"
            max="50"
            id="slide"
            defaultValue={speed}
            className={app.slidebar}
            onChange={(e) => {
              setSpeed(e.target.value);
              setCount(0);
            }}
          />
        </div>
        <div className={app.score}>Score: {count}</div>
      </div>
      <canvas
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
}

export default App;
