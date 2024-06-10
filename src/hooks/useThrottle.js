import { useRef, useCallback } from 'react';

const useThrottle = (fn, wait) => {
  const timerId = useRef(null); // Track the timer

  const throttle = useCallback(
    function (...args) {
      if (!timerId.current) {
        // Call the function and set the timer
        fn.apply(this, args);
        timerId.current = setTimeout(() => {
          timerId.current = null; // Clear the timer after the wait period
        }, wait);
      }
    },
    [fn, wait]
  );

  return throttle;
};

export default useThrottle;
