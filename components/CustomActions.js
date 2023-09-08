import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  //defines the action sheet (imported above), used to display the possible actions when pressing the button
  const ActionSheet = useActionSheet();

  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    //determines the postion of the cancel button so that ActionSheet can close the view
    const cancelButtonIndex = options.length - 1;
    ActionSheet.showActionSheetWithOptions(
      {
        options,
        // check if cancel button is working
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
        }
      }
    );
  };

  const pickImage = async () => {
    //request permission to access media library
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      //launches image library
      let result = await ImagePicker.launchImageLibraryAsync();
      //update the state if user doens`t cancel picking the image
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
    } else Alert.alert("Permissions haven't been granted.");
  };

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // sends locations
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  };

  //creates unique ref for each uploaded image
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    // combines multiple strings to create a image ref
    return `${userID}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    // creates refstring for image
    const uniqueRefString = generateReference(imageURI);
    // creates a reference to store on Firebase cloud (address for the location of the file once uploaded)
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    //converts image to Blob format
    const blob = await response.blob();
    //uploads file to cloud storage: takes refference (address to storage image) and blob (converted image) as args
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      console.log("File has been uploaded successfully");
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      {/* wrapperStyle & iconTextStyle are props that are passed from renderCustomAction fx in chat.js and extracted above */}
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    paddingTop: 1,
    fontSize: 15,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
