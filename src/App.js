import React, { useEffect } from 'react';
import app from './App.module.css';
import { Helmet } from 'react-helmet';

function App() {
  const [speed, setSpeed] = React.useState(15);
  const [count, setCount] = React.useState(0);
  const ref = React.useRef();

  useEffect(() => {
    const canvas = ref.current;
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const interval = setInterval(game, 1000 / speed);
    window.addEventListener('keydown', keyDown);

    let a = 15,
      x = 8,
      y = 3,
      tx = 30,
      ty = 28,
      xd = 1,
      yd = 0;
    let tail = 5;
    const body = [];

    function game() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'lime';

      for (let i = 0; i < body.length; i += 1) {
        ctx.fillRect(body[i].x * a, body[i].y * a, a - 2, a - 2);
        if (body[i].x === x && body[i].y === y) {
          setCount(0);
          tail = 5;
        }
      }

      body.push({ x, y });
      while (body.length > tail) {
        body.shift();
      }

      x += xd;
      y += yd;

      if (x > 39) x = 0;
      if (x < 0) x = 39;
      if (y > 39) y = 0;
      if (y < 0) y = 39;

      ctx.fillStyle = 'red';
      ctx.fillRect(tx * a, ty * a, a - 1, a - 1);

      if (tx === x && ty === y) {
        tail += 1;
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
          yd = -1;
          xd = 0;
          break;
        case 40: // down
          yd = 1;
          xd = 0;
          break;
        case 37: // left
          xd = -1;
          yd = 0;
          break;
        case 39: // right
          xd = 1;
          yd = 0;
          break;
        default:
          break;
      }
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', keyDown);
    };
  }, [speed]);

  return (
    <div className={app.conatiner}>
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
          }}
        />
      </div>
      <canvas ref={ref} />
      <div className={app.score}>Score: {count}</div>
    </div>
  );
}

export default App;
