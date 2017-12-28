import React from 'react';
import {
  StyleSheet
} from 'react-native';
import Template from "./Template";
import {Body, Button, Content, Text, View} from "native-base";
import Slider from "@ptomasroos/react-native-multi-slider";
import {Svg} from "expo";

export default class Help extends React.Component {
  render() {



    const content = (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: "center",
        }}>
          <Text>{"Help content"}</Text>
        </View>
    )
    return (
        <Template {...this.props} title={"Help"} content={content}/>
    )
  }
}
