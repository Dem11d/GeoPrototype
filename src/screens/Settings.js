import React from 'react';
import {AsyncStorage, Slider, StyleSheet,} from 'react-native';
import {
  Body,
  Card,
  Container,
  Content, H2,
  Header,
  Icon,
  Left,
  List,
  ListItem,
  Radio,
  Right,
  Switch,
  Text,
  View,
  Button
} from "native-base";
import {dataSource} from "../data/dataService";
import Template from "./Template";
import {polutionService} from "../polution/PolutionService";


export default class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      radius: Number.parseInt(dataSource.getState().radius),
      polutionType: polutionService.getCurrentPolution(),
      polutionTypeArray: [
        {label: 'pm10', value: "pm10"},
        // {label: 'pm2.5', value: "pm2.5"},
        {label: 'No2', value: "No2"}
      ]
    }
    console.log(this.state);
  }

  setRadius(val) {
    dataSource.updateState({radius: JSON.stringify(val)});
    AsyncStorage.setItem("radius", JSON.stringify(val));
    this.setState({"radius": val});
  }

  setPolution(value) {
    console.log("setting polution",value);
    console.log("setting language");
    polutionService.setPolution(value, "lala");
    this.setState({"polutionType": value,polutionTypeArray:this.state.polutionTypeArray});
  }

  render() {
    let content = (
        <Container>
          <Content>

            <H2 style={[styles.text__indents, styles.text__center]}>Prefered polution type</H2>
            <List>
              {this.state.polutionTypeArray.map((item, index) =>{
                return (
                    <ListItem
                        key = {index}
                        button={true}
                        onPress={() => this.setPolution(item.value)}
                    >
                      <Body>
                      <Text>{item.label}</Text>
                      </Body>
                      <Right>
                        <Radio
                            selected={item.value === this.state.polutionType}
                        />
                      </Right>
                    </ListItem>
                )
              })}
            </List>
          </Content>
        </Container>
    );
    return (<Template {...this.props} content={content} title={"Settings"}/>);

  }
}


const styles = StyleSheet.create({
  text__indents:{
    margin:15,
  },
  text__center:{
    textAlign:"center",
  },

  container: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  name: {
    textAlign: 'center',
    marginBottom: 25
  },
});