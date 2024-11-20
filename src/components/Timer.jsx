import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [time, setTime] = useState(180); // 180 sekund = 3 daqiqa
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const timerId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          setTime(180); 
          return 180;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId); // Cleanup
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <p className='text-center dark:text-white text-xl'>{formatTime(time)}</p>

    </div>
  );
};

export default Timer;
