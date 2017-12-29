import React from 'react';
import {Button, Content, Text, View} from "native-base";
import {LinearGradient} from "expo";
import Slider from "@ptomasroos/react-native-multi-slider";
import {
  StyleSheet,
} from 'react-native';

export default class Gradient extends React.Component {

  _onValuesChange(values) {
    console.log(values);
  }

  render() {
    const width = 250;
    const marker = (...props) => {
      return (    <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: "#0f5", marginTop: 20}}/>);
    };
    const slider = (<View style={{
      // position: "absolute",
      // flex: 1,
      // top: 0,
      // bottom: 0,
      height: 50,
      // left: 0,
      // right: 0,
      paddingLeft:10,
      paddingRight:10,
      // marginLeft:5,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "transparent"
    }}>
      <Slider
          onValuesChangeFinish={this.props.onFilterChange}
          customMarker={marker}
          unselectedStyle={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            height: 20,
          }}
          selectedStyle={{
            backgroundColor: 'transparent',
          }}
          containerStyle={{marginTop: 5}}
          values={this.props.currentFilter}
          min={0}
          max={500}

          sliderLength={width-20}/>
    </View>);

    return (
        <View style={{
          position: 'absolute',
          // top: 0,
          bottom: 0,
          left: 20,
          right: 20,
          height: 40,
          justifyContent: "center",
          alignItems:"center",

          // paddingLeft: 6
        }}>
          <View style={{
            width:width,
            justifyContent: "space-between",
            flexDirection: "row",
          }}>
            <LinearGradient
                colors={['#79BC6A', '#BBCF4C', '#FFCF00', '#FF9A00', '#FF0000', '#A52A2A']}
                start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  // bottom: 0,
                  height: 20,
                  marginTop: 5,
                  marginBottom: 18,
                  marginLeft: 10,
                  marginRight: 10,
                  backgroundColor: "transparent"
                }}
            />
            <Text style={styles.text}>0</Text>
            {/*<Text>50</Text>*/}
            <Text style={styles.text}>100</Text>
            <Text style={styles.text}>200</Text>
            <Text style={styles.text}>300</Text>
            <Text style={styles.text}>400</Text>
            <Text style={styles.text}>500</Text>

            <View style={{
              position: 'absolute',
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}>
              {slider}
            </View>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    marginTop: 3,
    backgroundColor: "transparent",
  }
})
