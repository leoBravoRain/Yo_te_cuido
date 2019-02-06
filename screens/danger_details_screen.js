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
  ActivityIndicator
} from 'react-native';

import { Button, Icon, Card } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';


class Danger_Details extends Component {

  // Initial state
  state = {
    avatarSource: null,
    videoSource: null,
  };

  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Detalles del peligro",
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
      text: null

    };

    // Add select photo method
    this.deactivate_danger = this.deactivate_danger.bind(this)
    this.deactivate_danger_server = this.deactivate_danger_server.bind(this);
  }

  componentWillMount(){

  }


  deactivate_danger_server(){

    // Comunicate to server for deactivate
    // Add danger to server
    // Add video of place to server
    const url_server = "http://yotecuido.pythonanywhere.com/update_danger/" + this.props.navigation.state.params.marker.id;

    // console.log(url_server);

    fetch(url_server, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => 

      // Alert for response user
      Alert.alert(
        'Peligro arreglado',
        'El peligro ya no aparecerá en el mapa',
        [
          {text: 'Entendido', onPress: () => console.log('Ask me later pressed')},
        ],
        { cancelable: false }
      )

    )
    .catch((error) => {
      console.error(error);
    }); ;

    // Go no map page
    this.props.navigation.push("Home"); 

  }
  // Manage danger map
  deactivate_danger(){

    Alert.alert(
      'Desactivar Peligro',
      '¿Estas seguro que quieres desactivar el peligro? \n \n ¡Ya no aparecerá en el mapa!'
      ,
      [
        {
          text: 'Cancelar',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },

        {text: 'Estoy seguro', onPress: 

          () => this.deactivate_danger_server()

        },
      ],
      {cancelable: false},
    );

  }

  // Render method
  render() {

    return (

        <View style = {styles.container_flex}>

          <Image
            source={{ uri: this.props.navigation.state.params.marker.photo }}
            style={{ 
              // width: 400, 
              // height: 400,
              flex: 3,
              alignSelf: 'stretch',
              width: undefined,
              height: undefined,
              margin: 10
              // borderRadius: 10,
            }}
            PlaceholderContent={<ActivityIndicator />}
            resizeMode="contain"
          />

          <Text style = {{margin: 10, fontSize: 20}} > 

           { this.props.navigation.state.params.marker.comment }

          </Text>

          <Button

            outline

            title = {"Desactivar peligro"}

            onPress = {this.deactivate_danger.bind(this)}

            buttonStyle={styles.buttonStyle}
          />

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
    margin: 30,
    borderRadius: 50
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

export default withNavigation(Danger_Details);