import { useEffect, useRef, useState } from 'react';

function useStateQueue<T>(state: T, shouldPopQueue: boolean): [T, T] {
  const stateQueue = useRef<T[]>([]).current;
  const lastState = useRef(state);

  const [hasMoreInQueue, setHasMoreInQueue] = useState(false);
  const [currState, setCurrState] = useState(state);

  // Register new state changes into state queue
  useEffect(() => {
    if (
      !stateQueue.length ||
      JSON.stringify(stateQueue[stateQueue.length - 1]) !==
        JSON.stringify(state)
    ) {
      stateQueue.push(state);
      setHasMoreInQueue(true);
    }
  }, [JSON.stringify(state)]);

  const [canPopState, setCanPopState] = useState(true);
  useEffect(() => {
    if (shouldPopQueue && hasMoreInQueue && canPopState) {
      lastState.current = currState;
      setCanPopState(false);
      setCurrState(stateQueue.shift()!);

      // Alot some time for currState to change so shouldPopQueue
      // can be recalculated
      setTimeout(() => setCanPopState(true), 100);
    }
    if (stateQueue.length === 0) {
      setHasMoreInQueue(false);
    }
  }, [currState, hasMoreInQueue, shouldPopQueue, canPopState]);

  return [lastState.current, currState];
}

export default useStateQueue;
