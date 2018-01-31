import React from 'react';
import MainContent from './src/routes/Router';
import {locationService} from "./src/location/LocationService";
import {dataSource} from "./src/data/dataService";
import {polutionService} from "./src/polution/PolutionService";



export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  // loading fonts
  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });

    await dataSource.initStorage();
    await locationService.init();
    await polutionService.initPolutionService();
    locationService.startWatch();

    this.setState({isReady: true});
  }


  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading/>;
    }
    return <MainContent/>;
  }
}

