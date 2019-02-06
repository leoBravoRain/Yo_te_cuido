import React, { Component } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  PermissionsAndroid,
  NetInfo,
  ScrollView,
  Picker,
   // AppRegistry,
  PixelRatio,
  TouchableOpacity,
  TextInput,
  Vibration,
} from 'react-native';

import { Button, Icon } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps'
import haversine from "haversine";

// Limit to risk
// Meters
const limit_dist_to_risk = 10;

// Vibration pattern
const PATTERN = [300, 500] // wait, vibrate, wait, vibrate, ...

// Initial region for map
// It's necesary for load map
initial_position = {

  latitude: -39.565604,

  longitude: -72.899991,

}

// Initial places marker
places_markers = []

initial_region = {

  latitude: initial_position.latitude,
  longitude: initial_position.longitude,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,

}

class Dangers_Map extends Component {

  //Constructor
  constructor(props) {

    super(props);

    this.state = {

      initialPosition: initial_position,

      places_markers: places_markers,

      region: initial_region

    };

    //Add function for use in this component
    this.get_current_position_and_analize_risk = this.get_current_position_and_analize_risk.bind(this);

  }

  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Mapa de peligros",
      headerRight: (
        <Icon
          raised
          name='map'
          type='font-awesome'  
          onPress={() => navigation.navigate('Dangers_Map')}
          color='#3f5fe0'
        />
      ),
      headerLeft: (
        <Icon
          raised 
          name='home'
          type='font-awesome'  
          onPress={() => navigation.navigate('Home')}
          color='#3f5fe0'
        />
      ),
    };
  };

  componentDidMount() {

    // get markers for map

    const url_server = "http://yotecuido.pythonanywhere.com/dangers/";
    
    fetch(url_server)
          .then((response) => response.json())
          .then((responseJson) => {

            // places with activated dangers
            var places_markers_from_server = [];

            // console.log(responseJson.length)

            // Iterate over each danger
            for(var i = 0; i < responseJson.length; i++){

              // If danger is active
              if(responseJson[i].state == true){

                // add danger to marler to display on map
                places_markers_from_server.push(responseJson[i]);

              }

            }

            // Update places markers (dangers)
            this.setState({

              places_markers: places_markers_from_server,

            });

            // Get current position and analize risk
            this.get_current_position_and_analize_risk();

          })
          .catch((error) => {
            console.error(error);
          });  

  }

  // Function for get current position and analize risk
  get_current_position_and_analize_risk(){

    // Get current position (it changes). Use navigator.geolocation.watchPosition
    navigator.geolocation.getCurrentPosition(

        (position) => {

            // List for store if user is near of risk
            user_is_near_risk_list = [];

            // Get user position
            // Position has altitude!!! Maybe we can add altitude to location on map for distinguis between floors in a factory
            this.setState({ 

              initialPosition: {

                latitude: position.coords.latitude, 
                longitude: position.coords.longitude

              },

              region: {

                latitude: position.coords.latitude, 
                longitude: position.coords.longitude, 
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,

              }

            })


            // Calculate the distance to risk_makers
            // If there is a marker
            if(this.state.places_markers.length > 0){

              // iterat for each place marker
              for(var i = 0; i < this.state.places_markers.length; i++ ){

                // Get user and risk distance for each place_marker
                dist_user_risk = haversine(this.state.initialPosition, this.state.places_markers[i], {unit: 'meter'});

                // Analize if user is near. boolean var
                user_is_near_risk = dist_user_risk <= limit_dist_to_risk ? true : false;

                // Create list for save user_is_near_risk
                user_is_near_risk_list[i] = user_is_near_risk;

              }


              // If exist any true (if user is near some danger)
              if(user_is_near_risk_list.includes(true)){

                // Vibrate if user is near marker
                Vibration.vibrate(PATTERN, true);

                // Create alert to user
                Alert.alert(
                  'Cuidado',
                  'Estás muy cerca de un peligro ¡Cuidate!',
                  [
                    {text: 'Me cuidaré', onPress: () => Vibration.cancel()},
                  ]
                );

              };

            }
        },
        (error) => console.log(new Date(), error),
        // {enableHighAccuracy: true, timeout: 100000}
        // If gps is not working, so uncomment next line
        // {timeout: 10000, enableHighAccuracy: true}
        {timeout: 100000000}
    ); 

  }


  // Render method
  render() {

    return (

        <View style = {styles.container_flex}>

            <MapView

              showsUserLocation
              followsUserLocation
              showsMyLocationButton = {true}

              initialRegion = {this.state.region}

              mapType = "satellite"
              region = { this.state.region }
              style = {{width: '100%', height: '100%'}}

            >

              { 

                this.state.places_markers.map( (marker, index) => (

                    <MapView.Marker

                      key = {index}

                      coordinate = {{latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude) }}

                      onPress = {() => this.props.navigation.push("Danger_Details", {marker: marker})}

                    >
                    </MapView.Marker>

                  ))

              }

            </MapView>

        </View>

    );

  }

}

const styles = StyleSheet.create({

  image_background: {

    flex: 1,
    // remove width and height to override fixed static size
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center'

  },

  container_flex : {

    flex:1 ,
    justifyContent: 'center', 
    alignItems: 'center'
  },

  buttonStyle: {
    backgroundColor: "#3f5fe0",
    width: 30,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    // borderRadius: 5
    elevation: 1,
  },

  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },

})

export default withNavigation(Dangers_Map);