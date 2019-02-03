import React from 'react';
import { 
  Text, 
  View
} from 'react-native';
import {
      createStackNavigator,
      createAppContainer
    } from 'react-navigation';

import Home from "./screens/home_screen.js"
import Add_Danger from "./screens/add_danger_screen.js"
import Dangers_Map from "./screens/dangers_map.js"
import Location_Details from "./screens/location_details.js"
import Danger_Details from "./screens/danger_details_screen.js"

const AppStackNavigator = createStackNavigator(

  {

    Home: Home,
    Add_Danger: Add_Danger,
    Dangers_Map: Dangers_Map,
    Location_Details: Location_Details,
    Danger_Details: Danger_Details

  },

  { 
    headerMode: 'screen' 
  },

  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      //  headerStyle: {
      //   backgroundColor: '#3f5fe0',
      // },
      // headerTintColor: '#3f5fe0',
      // headerTitleStyle: {
      //   fontWeight: 'bold',
      // },
      headerStyle: { backgroundColor: 'red' },
      headerTitleStyle: { color: 'green' },
    }
  },


);


const App = createAppContainer(AppStackNavigator);

export default App;