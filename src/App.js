import React, { useEffect } from 'react';
import app from './App.module.css';
import { Helmet } from 'react-helmet';
import useWindows from './components/useWindows';
import { Swipeable } from 'react-touch';

function App() {
  const [speed, setSpeed] = React.useState(15);
  const [count, setCount] = React.useState(0);
  const size = useWindows();
  const ref = React.useRef();
  const [w, h] = size;
  const params = React.useRef({ xd: 1, yd: 0 });

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
    const width = w > 600 ? 600 : Math.ceil(w);
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext('2d');
    const interval = setInterval(game, 1000 / speed);
    window.addEventListener('keydown', keyDown);

    let a = (width / 100) * 2.5,
      x = 8,
      y = 3,
      tx = 30,
      ty = 28;
    const snake = { tail: 5, body: [] };

    function game() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'lime';

      for (let i = 0; i < snake.body.length; i += 1) {
        ctx.fillRect(snake.body[i].x * a, snake.body[i].y * a, a - 2, a - 2);
        if (snake.body[i].x === x && snake.body[i].y === y) {
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

      ctx.fillStyle = 'red';
      ctx.fillRect(tx * a, ty * a, a - 1, a - 1);

      if (tx === x && ty === y) {
        snake.tail += 1;
        setCount((prev) => ++prev);
        tx = getRandom();
        ty = getRandom();
      }
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
  }, [speed, w]);

  return (
    <div className={app.conatiner} style={{ height: h }}>
      <Helmet>
        <title>Snake game</title>
      </Helmet>
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
      <Swipeable
        onSwipeLeft={() => direction('left')}
        onSwipeRight={() => direction('right')}
        onSwipeUp={() => direction('up')}
        onSwipeDown={() => direction('down')}
      >
        <canvas ref={ref} />
      </Swipeable>
      <div className={app.score}>Score: {count}</div>
    </div>
  );
}

export default App;
