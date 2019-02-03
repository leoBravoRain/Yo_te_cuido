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
  // Button,
  Picker
} from 'react-native';

import { Button } from 'react-native-elements';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { NavigationActions, withNavigation } from 'react-navigation';
import GPSState from 'react-native-gps-state';


// Permissions
async function requestLocationPermission() {

  try {

    // const granted = await PermissionsAndroid.request(
    const granted = await PermissionsAndroid.requestMultiple(

      [

        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // {
        //   'title': 'Permiso para localización',
        //   'message': 'Para entregarte el mejor servicio, necesitas darnos el permiso para acceder a tu posición actual'
        // },

        PermissionsAndroid.PERMISSIONS.CAMERA,
        // {
        //   'title': 'Cool Photo App Camera Permission',
        //   'message': 'Cool Photo App needs access to your camera '
        // }

      ]

    )

  } catch (err) {
    console.warn(err)
  }
}

// ask for permissions
requestLocationPermission();

class HelloWorldApp extends Component {

  // hide nav bar
  static navigationOptions = {

    header: null,

  }

  //Constructor
  constructor(props) {

    super(props);
  
  }

  componentDidMount(){

    // url server
    const url_server = "http://yotecuido.pythonanywhere.com/dangers/";

    // connect to server for wake up server
    fetch(url_server, {

      method: 'GET',

    });

  }

  // Manage danger map
  dangers_map(){

    // Navitage to next page
    this.props.navigation.push("Dangers_Map"); 

  }

  // manage click on button 
  manage_click(){

    // initialize network connection variable
    var connection_state = false;

    // Get network connection
    NetInfo.getConnectionInfo().then((connectionInfo) => {

      // get connection state
      connection_state = connectionInfo.type != "none" ? true : false;

      // If isn't connected to internet
      if(!connection_state){

        // Alert message for user
        Alert.alert(
          'Conección a internet',
          'Para poder usar nuestra app, debes estar conectado a internet',
          [
            {text: 'Me conectaré'},
          ],
          { cancelable: false }
        )

      }

    });

    // Get gps state
    GPSState.getStatus().then((status)=>{

      // Initialize variable
      var gps_state = false;

      // If gps is activated
      if(status == 3 || status == 4){

        // Set state
        gps_state = true;

        // push to next page
        if(connection_state && gps_state){

          // Navitage to next page
          this.props.navigation.push("Add_Danger");     

        };

      }

      // If gps is not activated
      else{

        // Dialog for accesor to user location
        LocationServicesDialogBox.checkLocationServicesIsEnabled({

          message: "<h2>Tu ubicación</h2> Para poder mostrarte los mejores lugares, necesitamos saber tu ubicación actual.",
          ok: "Activar ubicación",
          cancel: "No permitir",
          
        });

      }
     
    });

  }

  // Render method
  render() {

    return (

      <View style = {styles.container_flex}>

        <ImageBackground 
          // source={{uri: 'https://previews.123rf.com/images/stocking/stocking1209/stocking120900044/15271577-portrait-of-an-happy-worker-in-a-factory.jpg'}}
          source = {{uri: "https://image1.masterfile.com/getImage/NjExMy0wODgwNTU1NmVuLjAwMDAwMDAw=AJv0-3/6113-08805556en_Masterfile.jpg"}}
          style={styles.image_background}
          resizeMode='cover' 
          >

          <Button

            raised

            title = {"Informar peligro"}

            onPress = {this.manage_click.bind(this)}

            buttonStyle={styles.buttonStyle}
          />

          <Button

            raised

            title = {"Ver mapa de peligros"}

            onPress = {this.dangers_map.bind(this)}

            buttonStyle={styles.buttonStyle}
          />

        </ImageBackground>

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
    width: 300,
    height: 45,
    // borderColor: "transparent",
    borderWidth: 0,
    // borderRadius: 5
    margin: 2,
    // borderColor: "red"
  }

})

export default withNavigation(HelloWorldApp);