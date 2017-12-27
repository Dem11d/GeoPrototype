import React from "react";
import {StyleSheet, Platform} from 'react-native';
import {Container, Content, Text, Button} from "native-base";

const routes = ["Maps"];

export class SideBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     routes: this.getCurrentRoutes()
    }
  }

  componentDidMount(){

  }

  getCurrentRoutes(){
      return ["Maps"];
  }

  render() {
    return (
        <Container style={styles.navigationPadding}>
          <Content>

            {this.state.routes.map((data, id) => {
              return (
                  <Button
                      style={{marginTop:10}}
                      key={id}
                      block
                      light
                      onPress={() => {
                        this.props.navigation.navigate(data);
                      }}
                  >
                    <Text>{data}</Text>
                  </Button>
              );
            })
            }

          </Content>
        </Container>
    );
  }

}
const styles = StyleSheet.create({
  navigationPadding: {
    paddingTop: (Platform.OS === 'ios' ? 0 : 25),
    backgroundColor: "#ccc",
    // height: Expo.Constants.statusBarHeight + 56,
  },
  bodyContent: {
    backgroundColor: "#fff",
  }
});