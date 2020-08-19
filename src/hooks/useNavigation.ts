import { useContext } from 'react';
import { NavigationContext } from 'react-navigation';

function useNavigation() {
  return useContext(NavigationContext);
}

export default useNavigation;
