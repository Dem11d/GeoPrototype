import React, {Component} from 'react';
import {DrawerNavigator, StackNavigator} from "react-navigation";
import {
  Button,
  Text,
  Container,
  Content,
} from "native-base";
import Maps from "../screens/Maps/Maps";
import Chart from "../screens/Chart";
import {SideBar} from "./sidebar";
import Settings from "../screens/Settings";
import Help from "../screens/Help";

export default DrawerNavigator({
      "AQI category": {screen: Maps},
      "Settings": {screen: Settings},
    }
);


