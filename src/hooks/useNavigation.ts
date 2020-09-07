import {
  useNavigation as useNavigationHook,
  NavigationProp,
} from '@react-navigation/native';

export default function useNavigation() {
  return useNavigationHook<NavigationProp<MainStackParams>>();
}
