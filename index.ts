import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from '@modi/app';
import { name as appName } from './app.json';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
