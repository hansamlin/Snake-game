import { useState, useEffect } from 'react';

export default function useWindows() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    function resize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return size;
}
