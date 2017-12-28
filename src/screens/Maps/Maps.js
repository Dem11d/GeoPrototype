import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import Template from "../Template";
import MapView from 'react-native-maps';
import {
  Button,
  Spinner,
  Text,
  View,
  H3, Content
} from "native-base";
import {InfoPointer} from "./InfoPointer";
import Gradient from "./Gradient";

let dataPoints = (require('GeoPrototype/assets/testdata.json').docs.map(point => {
  point.geometry.coordinates[0] = 180 * Math.random() - 90;
  point.geometry.coordinates[1] = 360 * Math.random() - 180;
  return point;
}));

export default class Maps extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      data: [],

      points: [],
      latitudeDelta: 0.0000467769713,
      longitudeDelta: 0.0421,
      error: null,
      markerLoaded: false,
      imageLoaded: false,
      favourites: false,
      favText: "Add to favourites",
      isParkingModalVisible: false,
      parkingToShow: null,
      pointToShow: null,
      ready: true,

    };
  }

  async componentDidMount() {
  }

  _handleChangeRegion = (region) => {
    // let longitudeDelta = region

    let minLatitude = region.latitude - region.latitudeDelta / 2;
    let maxLatitude = region.latitude + region.latitudeDelta / 2;
    let minLongitude = region.longitude - region.longitudeDelta / 2;
    let maxLongitude = region.longitude + region.longitudeDelta / 2;

    console.log(`minLatitude = ${minLatitude}`);
    console.log(`maxLatitude = ${maxLatitude}`);
    console.log(`minLongitude = ${minLongitude}`);
    console.log(`maxLongitude = ${maxLongitude}`);
    console.log(region);
    let points = dataPoints.filter(point => {
      return (
          minLatitude < point.geometry.coordinates[0] && point.geometry.coordinates[0] < maxLatitude
          &&
          minLongitude < point.geometry.coordinates[1] && point.geometry.coordinates[1] < maxLongitude
      )
    });
    console.log("points length", points.length);
    this.setState({points, ...region})
  };

  _showPoint(item) {
    console.log("showing point");
    this.setState({pointToShow: item});
    this._showPointModal();
  }

  _showPointModal = () => this.setState({isPointModalVisible: true});

  render() {
    let content;
    if (this.state.ready) {
      content = (
          <View style={styles.container}>
            <MapView style={styles.map}
                     showsScale={true}
                     showsPointsOfInterest={true}
                // showsUserLocation={true}
                     showsMyLocationButton={true}
                //followUserLocation
                     mapType={"standard"}
                     onRegionChangeComplete={this._handleChangeRegion}
                     region={{
                       latitude: parseFloat(this.state.latitude),
                       longitude: parseFloat(this.state.longitude),
                       latitudeDelta: parseFloat(this.state.latitudeDelta),
                       longitudeDelta: parseFloat(this.state.longitudeDelta),
                     }}>


              {this.state.points.map((point, index) => {
                return (<InfoPointer onPress={() => this._showPoint(point)} key={point._id} pointData={point}/>)
              })}

            </MapView>
            <Gradient/>
          </View>
      );
    }
    else
      content = (
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Spinner color='blue'/>
          </View>);
    return (<Template title={"Map"} content={content} {...this.props}/>)
  }

  onRegionChange(region) {
    console.log("changed region");
    // this.console.log(...region);
    console.log(...region);
  }

  componentWillUnmount() {
    this.state.callbacksToClear.forEach(callback => callback());
  }


}


let styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    borderWidth: 1,
    padding: 25,
    borderColor: 'black'
  },
  buttonPress: {
    backgroundColor: 'white'
  },
  buttonFavourites: {
    backgroundColor: 'lightgreen',
    width: 240,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonStyle: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F00',
    borderRadius: 5
  },
  textButtonStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  name: {
    textAlign: 'center',
  },
  address: {
    textAlign: 'center',
  }
});
