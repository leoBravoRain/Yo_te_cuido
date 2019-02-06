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
  ProgressBarAndroid
} from 'react-native';

import { Button, Icon } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps'

// Index for item form
index = 0;

class Add_Danger extends Component {

  // Initial state
  state = {
    avatarSource: null,
    videoSource: null,
    index: index,
  };

  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Informar peligro",
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

  //Constructor
  constructor(props) {

    super(props);

    this.state = {

      initialPosition: null,
      avatarSource: null,
      text: null, 
      index: index,

    };

    // Add select photo method
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  
  }

  componentDidMount(){

  }

  // Componente will mount
  componentWillMount(){

    // Get user position
    navigator.geolocation.getCurrentPosition(
      
        (position) => {

            // Position has altitude!!! Maybe we can add altitude to location on map for distinguis between floors in a factory
            this.setState({ initialPosition: {latitude: position.coords.latitude, longitude: position.coords.longitude }})

        },
        (error) => console.log(new Date(), error),
        // {enableHighAccuracy: true, timeout: 100000}
        // If gps is not working, so uncomment next line
        // {timeout: 10000, enableHighAccuracy: true}
        {timeout: 100000000}
    ); 

  }

  // Select photo taped
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    // Take image
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        // Take image
        let source = response;

        // Set state
        this.setState({

          // Set state to photo
          avatarSource: source,

        });
      }
    });
  }

  // manage click on button 
  manage_click(){

    // Variable for send danger to server
    var every_data_filled = true;

    // Message for user because there is a problem
    var message;

    // Add danger to server
    // Add video of place to server
    const url_server = "http://yotecuido.pythonanywhere.com/dangers/";

    // Crete form for post
    const form = new FormData();

    // Add parameters to post request

    // If there is photo
    if(this.state.avatarSource != null){

      // Add photo
      form.append('photo', {

          uri: this.state.avatarSource.uri,
          type: this.state.avatarSource.type,
          name: this.state.avatarSource.fileName,
          data: this.state.avatarSource.data

      });

    }

    // If there is not photo
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Debes agregar una foto"

    }
  
    // If location is defined
    if(this.state.initialPosition != null ){

      // Add latitude
      form.append('latitude', this.state.initialPosition.latitude);

      // Add longitude
      form.append('longitude', this.state.initialPosition.longitude);    

    }

    // If location is null
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Tenemos problemas para obtener tu ubicación";

    }

    // If there is a comment
    if(this.state.text != null){

      // Add comment
      form.append('comment', this.state.text);

    }

    // If there isn't comment
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Debes agregar un comentario";

    }

    // It there are all data
    if(every_data_filled){

      // Add state
      form.append('state', true);

      // Send data to server
      fetch(url_server, {

        method: 'POST',

        body: form

      })

      .catch((error) => {

        console.error(error);

      })

      // Alert for response user
      Alert.alert(
        'Alerta de peligro',
        'Acabas de agregar un peligro al mapa',
        [
          {text: 'Seguiré atento a otros posibles peligros', onPress: () => console.log('Ask me later pressed')},
        ],
        { cancelable: false }
      )

      // Back to home
      this.props.navigation.push("Home");

    }

    // IF there is a problem
    else{

      // Alert for user response
      Alert.alert(

        'Tuvimos un problema',
        message,

        [
          {text: 'Intentarlo de nuevo', onPress: () => console.log('Ask me later pressed')},
        ],

        { cancelable: false }

      )

    }

  }

  // Render method
  render() {

    return (

        <ScrollView >

          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>

            <View
              style={[
                styles.avatar,
                styles.avatarContainer,
                { marginBottom: 20 },
              ]}
            >
              {

                this.state.avatarSource === null 

                ? 

                (
                  <Text> Agrega una foto </Text>
                ) 

                : 

                (
                  <Image style={styles.avatar} source={this.state.avatarSource} />
                )
              }

            </View>

          </TouchableOpacity>

          {

            this.state.initialPosition === null 

            ?

            (<ProgressBarAndroid /> )

            :

            <MapView

              // showsUserLocation
              // followsUserLocation
              // showsMyLocationButton
              // ref = {ref => { this.map0 = ref; }}
              // ref={(element) => this.map = element} 

              mapType = "satellite"

              initialRegion={{
                latitude: this.state.initialPosition.latitude,
                longitude: this.state.initialPosition.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }}

              // showUserLocation
              region = { this.state.initial_region }
              style = {{width: '100%', height: '30%'}}

            >

              <MapView.Marker
                draggable
                coordinate = {this.state.initialPosition}
                pinColor = {"#474744"}
                onDragEnd={(e) => this.setState({ initialPosition: e.nativeEvent.coordinate })}
              />

            </MapView>

          }

          <Text>

            Manten presionado el marcador amarillo para cambiarlo de ubicación

          </Text>

          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder = "Agregar algún comentario"
            style={{height: 100, width: "80%", borderColor: 'gray', borderWidth: 1, margin: 40}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            maxLength={2000}
          />

          <Button

            raised

            title = {"Agregar peligro"}

            onPress = {this.manage_click.bind(this)}

            buttonStyle={styles.buttonStyle}

          />

        </ScrollView>

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
    borderColor: "transparent",
    borderWidth: 0,
    // borderRadius: 5
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

export default withNavigation(Add_Danger);