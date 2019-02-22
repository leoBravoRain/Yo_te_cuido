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
  ProgressBarAndroid,
  Dimensions
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
var initial_position = {

  latitude: -39.565604,

  longitude: -72.899991,

}

// Initial places marker
var places_markers = [];

// Initial places marker to use like state
var initial_places_markers = [];

// Initial areas of companyss
var initial_areas_of_company = null;

// Variables for initial region (like zoom)
const initial_longitude_delta = 0.000922;
const initial_latitude_delta = 0.00421;

// Define initial region
var initial_region = {

  latitude: initial_position.latitude,
  longitude: initial_position.longitude,
  latitudeDelta: initial_longitude_delta,
  longitudeDelta: initial_latitude_delta,

}

class Dangers_Map extends Component {

  //Constructor
  constructor(props) {

    super(props);

    this.state = {

      initialPosition: initial_position,

      places_markers: places_markers,

      region: initial_region,

      danger_state_filter: "todos",

      initial_places_markers: initial_places_markers,

      // parameter for filter danger by its state
      loaded_markers: true,

      // list of areas of company
      initial_areas_of_company: initial_areas_of_company,

      area_filter: "todos",

    };

    //Add function for use in this component
    this.get_current_position_and_analize_risk = this.get_current_position_and_analize_risk.bind(this);
    this.filter_markers = this.filter_markers.bind(this);

    this.render_area_filter = this.render_area_filter.bind(this);
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
          onPress={() => navigation.push('Dangers_Map')}
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
       
    // get areas of company
    const url_area_server = "http://yotecuido.pythonanywhere.com/area_of_company";

    fetch(url_area_server)
      .then((response) => response.json())
      .then((responseJson) => {

        // console.log(responseJson);

        // create dict for acces with id area
        var areas_of_company = {};

        // Iterate over each area
        for(var i = 0; i < responseJson.length ; i++){

          // push each area
          areas_of_company[responseJson[i].id] = responseJson[i].area_name;

        };

        // console.log(areas_of_company);

        // Set state
        this.setState({

          initial_areas_of_company: areas_of_company,

        });

        // console.log(this.state.initial_areas_of_company);

      });

    // get markers for map

    const url_server = "http://yotecuido.pythonanywhere.com/dangers/";
    
    fetch(url_server)
          .then((response) => response.json())
          .then((responseJson) => {

            // places with activated dangers
            var places_markers_from_server = [];
            var initial_places_markers = responseJson;

            // console.log(responseJson.length)

            // Iterate over each danger
            for(var i = 0; i < responseJson.length; i++){

              // add danger to marler to display on map
              // places_markers_from_server.push(responseJson[i]);
              // initial_places_markers.push(responseJson[i]);


              // If danger is active
              if(responseJson[i].state != "eliminado"){

                // add danger to marler to display on map
                places_markers_from_server.push(responseJson[i]);

              }

            }

            // Update places markers (dangers)
            this.setState({

              places_markers: places_markers_from_server,
              initial_places_markers: initial_places_markers,

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
                latitudeDelta: initial_latitude_delta,
                longitudeDelta: initial_longitude_delta,


              }

            })


            // Calculate the distance to risk_makers
            // If there is a marker
            if(this.state.places_markers.length > 0){

              // iterat for each place marker
              for(var i = 0; i < this.state.places_markers.length; i++ ){

                // marker
                var marker_i = this.state.places_markers[i];

                // Get user and risk distance for each place_marker
                dist_user_risk = haversine(this.state.initialPosition, marker_i, {unit: 'meter'});

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

  // Select pin color depending of its state
  select_pin_color(marker_state){

    switch(marker_state){

      case "sin_control":

        return "red"
        break;

      case "controlado":

        return "yellow"
        break;

      case "eliminado":

        return "green"
        break;

    }

  }

  // filter marker by state
  filter_markers(source:string, value: string){

    // Define current filter value
    var current_filter_value;

    // If filter by danger state
    if(source == "danger_state_filter"){

      // Get current value
      current_filter_value = this.state.danger_state_filter;

    }

    else if(source == "area_filter"){

      // Get current value
      current_filter_value = this.state.area_filter;

    }


    if(source == "danger_state_filter"){
    
      this.setState({

        // This variable is becuase set state is asynchronous
        loaded_markers: false,

        danger_state_filter: value,

      })

    }

    else if(source = "area_filter"){

      this.setState({

        // This variable is becuase set state is asynchronous
        loaded_markers: false,

        area_filter: value,

      })
    }

    // If selected value is different from current value
    if(value != current_filter_value){

      // new markers
      var places_markers_filters = [];

      // Filter places markers
      // iterat for each INITIAL place marker (These are ALL markers from server)
      console.log(this.state.initial_places_markers);

      for(var i = 0; i < this.state.initial_places_markers.length; i++ ){

        // marker
        var marker_filter = this.state.initial_places_markers[i];

        if(source == "danger_state_filter"){

          if(value == "todos"){

            // "Todos" is considered like all activated dangers (Anyone different to "eliminado")
            if(marker_filter.state != "eliminado"){

              if(this.state.area_filter == "todos"){

                // add marker to list
                places_markers_filters.push(marker_filter);              

              }

              else if(marker_filter.area_name == this.state.area_filter){

                // add marker to list
                places_markers_filters.push(marker_filter);  

              }

            }

          }  

          // If state is specific one
          else if(marker_filter.state == value){

            if(this.state.area_filter == "todos"){

              // add marker to list
              places_markers_filters.push(marker_filter);              

            }

            else if(marker_filter.area_name == this.state.area_filter){

              // add marker to list
              places_markers_filters.push(marker_filter);  

            }

          }        

        }

        else if(source == "area_filter"){

          if(value == "todos"){

            if(this.state.danger_state_filter == "todos" && marker_filter.state != "eliminado"){

              // add marker to list
              places_markers_filters.push(marker_filter);              

            }

            else if(marker_filter.state == this.state.danger_state_filter){

              // add marker to list
              places_markers_filters.push(marker_filter);  

            }

          }  

          else if(marker_filter.area_name == value){

            if(this.state.danger_state_filter == "todos" && marker_filter.state != "eliminado"){

              // add marker to list
              places_markers_filters.push(marker_filter);              

            }

            else if(marker_filter.state == this.state.danger_state_filter){

              // add marker to list
              places_markers_filters.push(marker_filter);  

            }

          }        

        }

      }

      // setState is asynchronous
      this.setState({

        places_markers: places_markers_filters,
        // danger_state_filter: value,

      },

        // This variable is becuase set state is asynchronous
        function() { this.setState({loaded_markers: true}); console.log(this.state.places_markers) }

      );



    }

  }

  // Render area from filter
  render_area_filter(){

    // If areas is defined
    if(this.state.initial_areas_of_company != null){

      
      // Define list for areas
      var list = [];

      // Add first element for area filter list
      list.push(<Picker.Item label="Todas las areas" value="todos" />)

      // Iterate over each area of company
      Object.keys(this.state.initial_areas_of_company).map( (key_dict, index) => {
             
  
        // add picker with each area of company
        list.push(

          <Picker.Item 

            key = {index} 
            label = {this.state.initial_areas_of_company[key_dict]} 
            value = {key_dict} 

          />

        );

      });

      // return piccker items with company areas
      return list;

    };
    
  };


  // Render method
  render() {

    return (

        <View style = {styles.container_flex} >

            <Text style={{ 

              color: "white", 
              "textAlign": 'center', 
              margin: 50,
              // fontWeight: 'bold', 
              textDecorationStyle:'solid',
              backgroundColor: 'rgba(63, 95, 224,0.8)',
              position: "absolute",
              top: -30,
              borderRadius: 50, 
              padding: 15,
              justifyContent: 'center',
              elevation: 1,

            }}>

              Peligros actuales: { this.state.places_markers.length}

            </Text>

            <MapView

              showsUserLocation
              followsUserLocation
              showsMyLocationButton = {true}
              initialRegion = {this.state.region}
              mapType = "satellite"
              region = { this.state.region }
              style = {{width: '100%', height: '100%',zIndex: 0}}
              showsMyLocationButton = {true}

            >

              { 

                this.state.loaded_markers ?

                this.state.places_markers.map( (marker, index) => (
                       
                  <MapView.Marker

                    key = {index}

                    coordinate = {{latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude) }}

                    onPress = {() => this.props.navigation.push("Danger_Details", {marker: marker, area_name: this.state.initial_areas_of_company[marker.area_name]})}

                    pinColor = { this.select_pin_color(marker.state) }
                    
                  />

                ))

                :

                <MapView.Marker

                  coordinate = {{latitude: 12.2, longitude: 23.9 }}

                />

              }

            </MapView>

            <View style = {{ flex: 1, position: "absolute", bottom: 20, flexDirection: "row", flexWrap: 'wrap',justifyContent: 'center'  }}>

              <Picker

                selectedValue = {this.state.danger_state_filter}

                style = {{

                  height: 50, 
                  // width: Dimensions.get("window").width/4, 
                  width: 150,
                  // zIndex: 10, 
                  // position: "absolute",
                  // left: 1,
                  // bottom: 10,
                  backgroundColor: 'rgba(63, 95, 224,0.8)',
                  justifyContent: 'center',
                  color: "white",
                  elevation: 5,
                  margin: 10,
                

                }}

                onValueChange={

                  (itemValue, itemIndex) =>

                    this.filter_markers("danger_state_filter",itemValue)

                  }

                >

                <Picker.Item label="Todos activos" value="todos" />

                <Picker.Item label="Sin control" value="sin_control" />

                <Picker.Item label="Controlado" value="controlado" />

                <Picker.Item label="Eliminado" value="eliminado" />

              </Picker> 

              {/* picker for area filter */}
              <Picker

                selectedValue={this.state.area_filter}
                style = {{

                  height: 50, 
                  // width: Dimensions.get("window").width/4, 
                  width: 150,
                  // zIndex: 10, 
                  // position: "absolute",
                  // bottom: 80,
                  backgroundColor: 'rgba(63, 95, 224,0.8)',
                  justifyContent: 'center',
                  color: "white",
                  elevation: 5,
                  margin: 10,
                

                }}

                onValueChange={

                  (itemValue, itemIndex) =>

                    this.filter_markers("area_filter",itemValue)

                }

              >

                {

                  this.render_area_filter()

                }

              </Picker>

            </View>
            

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