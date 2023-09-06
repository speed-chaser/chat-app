import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
} from "react-native";

import { getAuth, signInAnonymously } from "firebase/auth";

import bgImage from "../assets/backgroundImage.jpg";

const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("theme1");

  const handleThemeChange = (theme) => {
    if (theme !== selectedTheme) {
      setSelectedTheme(theme);
    }
  };

  useEffect(() => {
    console.log("Theme updated:", selectedTheme);
  }, [selectedTheme]);

  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          userID: result.user.uid,
          name: name,
          theme: selectedTheme,
        });
        Alert.alert("Signed in successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in. Please try again");
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} resizeMode="cover" style={styles.image}>
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
            />
            <Text>Choose Theme:</Text>
            <View style={styles.themeContainer}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  styles.theme1,
                  selectedTheme === "theme1" && styles.selectedThemeButton,
                ]}
                onPress={() => {
                  handleThemeChange("theme1");
                }}
              />
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  styles.theme2,
                  selectedTheme === "theme2" && styles.selectedThemeButton,
                ]}
                onPress={() => {
                  handleThemeChange("theme2");
                }}
              />
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  styles.theme3,
                  selectedTheme === "theme3" && styles.selectedThemeButton,
                ]}
                onPress={() => {
                  handleThemeChange("theme3");
                }}
              />
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  styles.theme4,
                  selectedTheme === "theme4" && styles.selectedThemeButton,
                ]}
                onPress={() => {
                  handleThemeChange("theme4");
                }}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={signInUser}>
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 0,
    height: "44%",
  },
  textInput: {
    width: "100%",
    height: 60,
    padding: 15,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 4,
    marginTop: 5,
    marginBottom: 40,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    backgroundColor: "#6B718B",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  themeButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  themeContainer: {
    flexDirection: "row",
    paddingTop: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  theme1: {
    backgroundColor: "black",
  },
  theme2: {
    backgroundColor: "#72BD7B",
  },
  theme3: {
    backgroundColor: "#E1A66B",
  },
  theme4: {
    backgroundColor: "#EC8FEE",
  },
  selectedThemeButton: {
    borderColor: "cyan",
    borderWidth: 2,
    borderRadius: 70,
    padding: 7,
  },
});

export default Start;
