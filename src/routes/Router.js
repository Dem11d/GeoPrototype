import React, {Component} from 'react';
import {DrawerNavigator, StackNavigator} from "react-navigation";
import {
  Button,
  Text,
  Container,
  Content,
} from "native-base";
import Maps from "../screens/Maps/Maps";
import Help from "../screens/Help";
import {SideBar} from "./sidebar";

export default DrawerNavigator({
      "AQI category": {screen: Maps},
    }
);


