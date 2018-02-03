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
import {getAqi} from "./InfoPointer";
import {locationService} from "../../location/LocationService";
import {dataSource} from "../../data/dataService";
import {Dimensions} from "react-native";
import {PointInfo} from "./PointInfo";
import {Platform} from "react-native";


let dataPoints = (require('GeoPrototype/assets/changedData.json'));
//     .docs.map(point => {
//   point.geometry.coordinates[0] = 180 * Math.random() - 90;
//   point.geometry.coordinates[1] = 360 * Math.random() - 180;
//   point.properties.no2 = 400 * Math.random();
//   point.properties.pm10 = 430 * Math.random();
//   return point;
// }));
// console.log(JSON.stringify(dataPoints));

const {width, height} = Dimensions.get('window');

export default class Maps extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            data: [],
            activeMarker: null,
            filterData: [0, 500],
            points: [],
            // latitude: 49.05053875348836,
            // longitude: 31.361325569450855,
            latitudeDelta: 40.0000467769713,
            longitudeDelta: 40.0421,
            error: null,
            markerLoaded: false,
            imageLoaded: false,
            favourites: false,
            favText: "Add to favourites",
            isParkingModalVisible: false,
            parkingToShow: null,
            pointToShow: null,
            ready: false,

        };
        //holding old position
        if(dataSource.getState().mapsLocation){
            let region = dataSource.getState().mapsLocation;
            this.state.latitudeDelta = region.latitudeDelta;
            this.state.longitudeDelta = region.longitudeDelta;
            this.state.latitude = region.latitude;
            this.state.longitude = region.longitude;
            console.log("exist old position")
        }
    }

    async componentDidMount() {
        let callbacks = [];
        if (dataSource.getState().currentPosition) {
            this.setState({
                usersLongitude: dataSource.getState().currentPosition.longitude,
                usersLatitude: dataSource.getState().currentPosition.latitude,
                ready: true,
            });
        } else {
            callbacks.push(locationService.addEventListener("newPosition", () => this.setState({
                usersLongitude: dataSource.getState().currentPosition.longitude,
                usersLatitude: dataSource.getState().currentPosition.latitude,
                latitude: dataSource.getState().currentPosition.latitude,
                longitude: dataSource.getState().currentPosition.longitude,
                ready: true
            })));
        }
        if (dataSource.mapsLocation) {
            this.setState({...dataSource.getState().mapsLocation});
        }
        this.setState({callbacksToClear: callbacks});

    }

    _handleChangeRegion = (region) => {
        // let longitudeDelta = region

        let minLatitude = region.latitude - region.latitudeDelta / 2;
        let maxLatitude = region.latitude + region.latitudeDelta / 2;
        let minLongitude = region.longitude - region.longitudeDelta / 2;
        let maxLongitude = region.longitude + region.longitudeDelta / 2;

        // console.log(`minLatitude = ${minLatitude}`);
        // console.log(`maxLatitude = ${maxLatitude}`);
        // console.log(`minLongitude = ${minLongitude}`);
        // console.log(`maxLongitude = ${maxLongitude}`);
        // console.log(region);
        let points = dataPoints.filter(point => {
            return (
                minLatitude < point.geometry.coordinates[0] && point.geometry.coordinates[0] < maxLatitude
                &&
                minLongitude < point.geometry.coordinates[1] && point.geometry.coordinates[1] < maxLongitude
            )
        });
        console.log("points length", points.length);
        this.setState({points, ...region})
        dataSource.updateState({mapsLocation: region});
    };

    _showPoint(item) {
        console.log("showing point");
        this.setState({pointToShow: item});
        this._showPointModal();
    }

    _showPointModal = () => this.setState({isPointModalVisible: true});
    _changeFilter = (filterData) => {
        this.setState({filterData: filterData})
    };

    handleMapClick() {
        console.log("handleMapClick");
        if (this.state.activeMarker)
            this.hideBottomContent();
    }

    setActiveMarker(marker) {
        console.log("setting active marker");
        this.setState({
            activeMarker: marker,
            showbottomContent: true
        });
    }

    hideBottomContent() {
        // this.setState({activeMarker: null});
        this.setState({showbottomContent: false});
    }

    animateToCoordinate(coord) {
        this._map.animateToCoordinate(coord, 1);

    }

    render() {

        let markerContent;
        let bottomContent = null;
        let mapStyle = {};
        if (this.state.showbottomContent) {
            bottomContent = (
                <View style={styles.bottomContent}>
                    <View style={styles.exit}><Button onPress={() => this.hideBottomContent()} rounded
                                                      danger><Text>X</Text></Button></View>
                    <PointInfo point={this.state.activeMarker}/>
                </View>);
            mapStyle = {
                bottom: height - 350
            };

        }

            markerContent = this.state.points
                .filter(point => {
                    const aqi = getAqi(point);
                    return aqi > this.state.filterData[0] && aqi < this.state.filterData[1];
                })
                .map((point, index) => {
                    return (<InfoPointer
                        setActiveMarker={(marker) => this.setActiveMarker(marker)}
                        removeActiveMarker={() => this.hideBottomContent()}
                        animateToCoordinate={(coord) => this.animateToCoordinate(coord)}
                        key={point._id} pointData={point}/>)
                });
        let content;


        if (this.state.ready) {
            content = (
                <View style={styles.container}>
                    <MapView
                        style={[styles.map, mapStyle]}
                        showsUserLocation={false}
                        showsMyLocationButton={true}
                        mapType={"standard"}
                        onRegionChangeComplete={this._handleChangeRegion}
                        onPress={() => this.handleMapClick()}
                        ref={component => this._map = component}
                        initialRegion={{
                            latitude: parseFloat(this.state.latitude),
                            longitude: parseFloat(this.state.longitude),
                            latitudeDelta: parseFloat(this.state.latitudeDelta),
                            longitudeDelta: parseFloat(this.state.longitudeDelta),
                        }}>
                        <MapView.Marker
                            image={require('GeoPrototype/assets/location/marker.png')}
                            coordinate={{
                                latitude: this.state.usersLatitude,
                                longitude: this.state.usersLongitude,
                            }}
                        />
                        {markerContent}
                    </MapView>
                    <Gradient style={mapStyle} currentFilter={this.state.filterData}
                              onFilterChange={this._changeFilter}/>
                    {bottomContent}
                </View>
            );
        }
        else
            content = (
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <Spinner color='blue'/>
                </View>);
        return (<Template title={"AQI category"} content={content} {...this.props}/>)
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
    },
    exit: {
        zIndex:10,
        position: "absolute",
        top: 10,
        right: 10,
    },
    bottomContent: {
        position: 'absolute',
        top:(Platform.OS === 'ios' ? height - 350 : height - 375),
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor:"red"
    },
});
