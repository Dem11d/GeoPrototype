import {Button, Text, View} from "native-base";
import {ScrollView} from "react-native";
import * as React from "react";
import {Bar} from "react-native-pathjs-charts";


const chartOptions = {
  width: 200,
  height: 100,
  color: '#ffffff',
  margin: {
    top: 20,
    left: 20,
    bottom: 30,
    right: 0
  },
  color: '#2980B9',
  animate: {
    type: 'delayed',
    duration: 200
  },
  axisX: {
    showAxis: true,
    showLines: true,
    showLabels: true,
    showTicks: true,
    zeroAxis: false,
    orient: 'bottom',
    tickValues: [],
    label: {
      fontFamily: 'Arial',
      fontSize: 8,
      fontWeight: true,
      fill: '#34495E'
    }
  },
  axisY: {
    showAxis: true,
    showLines: true,
    showLabels: true,
    showTicks: true,
    zeroAxis: false,
    orient: 'left',
    tickValues: [],
    label: {
      fontFamily: 'Arial',
      fontSize: 8,
      fontWeight: true,
      fill: '#34495E'
    }
  }
};

export class PointInfo extends React.Component {

  render() {

    const chartData = [Object.keys(this.props.point.properties)
        .filter(key=>Number.isFinite(this.props.point.properties[key]))
        .map(key=>{
      return {v:this.props.point.properties[key],
        name:key};
    })];
    // console.log(chartData);
    let content = this.props.point ?
        <View>
          <Bar data={chartData} options={chartOptions} accessorKey='v'/>
        </View>
        :
        <View></View>;
    return (
          <View style={{
            justifyContent: "center",
            alignItems: "center",
          }}
                onPress={() => console.log("pressed")}
          >
            <View style={{
              // width: 300,
              backgroundColor: "white",
              borderRadius: 7,
              padding: 3
            }}>
              <ScrollView>
                {content}
              </ScrollView>
            </View>
          </View>);
  }
}
