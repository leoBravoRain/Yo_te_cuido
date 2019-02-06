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

  renderSwitch(param){

    switch(param) {

      // Add photo
      case 0:

        return (

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
                  <Text> Agrega una foto del peligro </Text>
                ) 

                : 

                (
                  <Image style={styles.avatar} source={this.state.avatarSource} />
                )
              }

            </View>

          </TouchableOpacity>

        );

      // Add comment
      case 1: 

        return(

          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder = "Agregar algún comentario sobre el peligro"
            style={{textAlign: "center", borderRadius: 50, height: 100, width: "80%", borderColor: 'gray', borderWidth: 1, margin: 40, padding: 5}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            maxLength={2000}
          />

        )

      // Add map
      case 2:

        return (

          // {

              this.state.initialPosition === null 

            ?

              (<ProgressBarAndroid /> )

            :

              // <View style = {styles.container_flex}>

                <MapView

                  mapType = "satellite"

                  initialRegion={{
                    latitude: this.state.initialPosition.latitude,
                    longitude: this.state.initialPosition.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                  }}

                  // showUserLocation
                  region = { this.state.initial_region }
                  style = {{width: '100%', height: '85%'}}

                >

                  <MapView.Marker
                    draggable
                    coordinate = {this.state.initialPosition}
                    pinColor = {"#474744"}
                    onDragEnd={(e) => this.setState({ initialPosition: e.nativeEvent.coordinate })}
                    // style = {{zindex: -1}}
                  />

                  <Text style={{ color: "white", "textAlign": 'center', margin: 50,"fontWeight": 'bold', 'textDecorationStyle':'solid'}}>

                    Manten presionado el marcador amarillo para poder moverlo

                  </Text>

                </MapView>

                

            // </View>

        );

      // Add danger button
      case 3:

        return(

          <Button

              outline

              title = {"Agregar peligro"}

              onPress = {this.manage_click.bind(this)}

              buttonStyle={{

                backgroundColor: "#3f5fe0",
                // backgroundColor: 'rgba(255, 184, 0, 0.5)',
                width: 300,
                height: 80,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 25,
                margin: 80,
                borderColor: "black",
                borderWidth: 2,

              }}

            />

        )

    }

  }

  next_index(){

    // define new index
    var new_index = this.state.index >= 3 ? 3 : this.state.index + 1;

    // Set state
    this.setState({

      // Set state to photo
      index: new_index,

    });

  }

  previous_index(){

    // define new index
    var new_index = this.state.index <= 0 ? 0 : this.state.index - 1;

    // Set state
    this.setState({

      // Set state to photo
      index: new_index,

    });

  }
  // Render method
  render() {

    return (

        <View style = {styles.container_flex}>

          {this.renderSwitch(this.state.index)}

        

          <View style = {{flex: 0, flexDirection: "row"}}>

            <Button
              outline
              title = "Anterior"
              onPress = {this.previous_index.bind(this)}
              buttonStyle={{ 
                backgroundColor: "#3f5fe0",
                borderRadius: 20,
                // width: 300,
                // height: 45
                margin: 10,
              }}
            />

            <Button
              outline
              title = "Siguiente"
              onPress = {this.next_index.bind(this)}
              buttonStyle={{ 
                backgroundColor: "#3f5fe0",
                borderRadius: 20,
                // width: 300,
                // height: 45
                margin: 10,
              }}
            />

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
    // margin: 50,
  },
  avatar: {
    borderRadius: 30,
    width: 300,
    height: 300,
  },

})

export default withNavigation(Add_Danger);