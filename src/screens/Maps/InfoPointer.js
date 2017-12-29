import React from 'react';
import {
  Animated, Easing,
  StyleSheet,
  Image,
} from 'react-native';
import MapView from 'react-native-maps';
import {
  View,
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  H3
} from 'native-base';
import {PointInfo} from "./PointInfo";


const aqi = [
  [0, 50],
  [51, 100],
  [101, 200],
  [201, 300],
  [301, 400],
  [401, 500],
];
const no2 = [
  [0, 40],
  [41, 80],
  [81, 180],
  [181, 280],
  [281, 400],
  [401, 500],
];
const pm10 = [
  [0, 50],
  [51, 100],
  [101, 250],
  [251, 350],
  [351, 430],
  [431, 500],
];


const checkConcentration = (arr, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (value > arr[i][0] && value < arr[i][1])
      return aqi[i][0] + (arr[i][1] - arr[i][0]) / (aqi[i][1] - aqi[i][0]) * arr[i][1] - value;
  }
  return 0;
}

const getAqi = (point) => getMaxValue(point);

export {getAqi};

const getMaxValue = (point) => {
  if (point.properties) {
    const prop = point.properties;
    const no2Contentration = checkConcentration(no2, prop.no2);
    const pm10Concentration = checkConcentration(pm10, prop.pm10);

    const max = Math.max(no2Contentration, pm10Concentration);
    const result = Math.floor(max);
    if (Number.isNaN(result)) {
      console.log("NaN", this.props.pointData);
      console.log(no2Contentration);
      console.log(pm10Concentration);
    }
    return Math.floor(max);
  }
}

export class InfoPointer extends React.Component {
  constructor(props) {
    super(props);
    const max = getMaxValue(this.props.pointData);

    this.state = {
      symbolWidth: new Animated.Value(30),
      color: this.getColor(max),
      maxValue: max,
      detailView: false,
      zIndex: 1
    }
    // console.log(this.state.symbolWidth);
  }


  getColor(max) {
    if (max > aqi[5][0]) {
      return "#A52A2A";
    } else if (max > aqi[4][0]) {
      return "#FF0000";
    } else if (max > aqi[3][0]) {
      return "#FF9A00";
    } else if (max > aqi[2][0]) {
      return "#608E03";
    } else if (max > aqi[1][0]) {
      return "#BBCF4C";
    } else {
      return "#79BC6A";
    }
  }

  handleClick() {
    console.log("handleClick");
    this.setState({detailView: !this.state.detailView, zIndex: !this.state.detailView ? 9999 : 1});
    this.props.setActiveMarker(this.props.pointData);
    // this.props.animateToCoordinate({
    //   latitude: this.props.pointData.geometry.coordinates[0],
    //   longitude: this.props.pointData.geometry.coordinates[1],
    // });
  }

  onDeselect() {
    console.log("handleDeselect");
    this.setState({detailView: !this.state.detailView, zIndex: !this.state.detailView ? 9999 : 1});
  }

  render() {
    function random(max) {
      return Math.round(Math.random() * max);
    }

    const color = this.state.color;

    const markerWidth = 50;
    let markerView;
    if (this.state.detailView) {
      markerView = (
          <PointInfo point={this.props.pointData}/>
      )
    } else {
      markerView = (
          <View>
            {/*<Image source={require('GeoPrototype/assets/location/info-marker.png')} style={styles.infoPoint_image}/>*/}
            <View style={[styles.infoPoint_view, {backgroundColor: this.state.color}]}>
              <Text style={styles.infoPoint_text}>{this.state.maxValue}</Text>
            </View>
          </View>
      )
    }
    // console.log(this.props.pointData);
    if (this.props.pointData)
      return ([
        <MapView.Circle
            key={0}
            onPress={this.props.onPress}
            radius={20000}
            center={{
              latitude: this.props.pointData.geometry.coordinates[0],
              longitude: this.props.pointData.geometry.coordinates[1],
            }}
            strokeColor={"rgba(0,0,0,1)"}
            fillColor={"rgba(200,0,0,0.3)"}
        />
        ,
        <MapView.Marker
            key={1}
            zIndex={this.state.zIndex}
            // image = {require('ParkingWatcher/assets/location/info-marker.png')} style={{width:25}}
            onPress={() => this.handleClick()}
            onDeselect={() => this.onDeselect()}
            // onPress={this.props.onPress}
            coordinate={{
              latitude: this.props.pointData.geometry.coordinates[0],
              longitude: this.props.pointData.geometry.coordinates[1],
            }}
        >
          {/*{markerView}*/}
          <View style={[styles.infoPoint_view, {backgroundColor: this.state.color}]}>
            <Text style={styles.infoPoint_text}>{this.state.maxValue}</Text>
          </View>
          <MapView.Callout style={{
            width:230,

          }}>
          <PointInfo point={this.props.pointData}/>
          </MapView.Callout>
        </MapView.Marker>
      ]);
    else return null;
  }
}

const styles = StyleSheet.create({
  infoPoint_image: {
    width: 50,
    height: 50
  },
  infoPoint_text: {},
  infoPoint_view: {
    // position: "absolute",
    // marginTop: 6,
    // marginLeft: 6,
    // marginBottom: 0,
    // marginRight: 5,
    borderColor: "black",
    // flex: 1,
    width: 38,
    height: 22,
    borderRadius: 4,
    backgroundColor: "#51ff4c",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  }
})



