import React, { Component } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  // Button,
  Linking,
  ImageBackground,
  FlatList,
  ScrollView,
  ProgressBarAndroid
} from 'react-native';

import { 
  Badge,
  Button,
} from 'react-native-elements';

// import { WebView } from "react-native-webview";

// // video list for fake data
// var videos_list = [

//   "https://www.youtube.com/watch?v=NjFCVb0f2Vk",
//   "https://www.youtube.com/watch?v=ff0z8nEppko",
//   "https://www.youtube.com/watch?v=u_l-drO8CAM",
//   "https://www.youtube.com/watch?v=MOdlp1d0PNA"

// ]

// // Take vidoes_list length
// videos_list_length = videos_list.length;

// Index for video
var index = 0;

// Home screen
export default class Location_Details extends Component {


  // Nav bar
  static navigationOptions = {

    title: "Tourist",
    headerStyle: {
      backgroundColor: '#3f5fe0',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    
  };

  constructor(props) {

    super(props);

    this.state = {

      // video: videos_list[index],
      index: index,
      get_videos: false,

    };

  }

  // Component will mount
  componentWillMount(){

    // // Fetch data from server
    // fetch('https://tourist-api.herokuapp.com/videos_location/' + this.props.navigation.state.params.marker.id)
    //       .then((response) => response.json())
    //       .then((responseJson) => {

    //         const videos_list = responseJson;

    //         this.setState({

    //           // Get list of json objects
    //           // Reverse for get the last video uploaded 
    //           // videos_list: videos_list.reverse(),
    //           videos_list: videos_list,
    //           // get_markers: true,
    //           video: videos_list[index],
    //           // videos_list_length : videos_list.lenght
    //           get_videos: true,

    //         });

    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       }); 

  }

  // Render method
  render() {

    return (

      <View style={styles.container}>

          <Text>

            this.props.navigation.state.params.marker.name

          </Text>

          <Button

            outline

            title="Próximo video"

            onPress = {()=> Alert.alert("click")}

            buttonStyle = {{

              backgroundColor: "#3f5fe0",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              margin: 30,
              borderRadius: 50

            }}
          />
       
      </View>

    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  video: {
    marginTop: 20,
    maxHeight: 200,
    width: 320,
    flex: 1
  }
});