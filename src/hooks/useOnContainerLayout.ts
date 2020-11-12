import { useCallback, useState } from 'react';
import { LayoutRectangle, LayoutChangeEvent } from 'react-native';

type OnLayoutCallback = (event: LayoutChangeEvent) => void;

function useOnContainerLayout(): [LayoutRectangle, OnLayoutCallback] {
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  return [layout, onLayout];
}

export default useOnContainerLayout;
