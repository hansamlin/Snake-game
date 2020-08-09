import { useState, useEffect } from 'react';

export default function useWindows() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    function resize(e) {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
    };
  }, []);

  return size;
}
