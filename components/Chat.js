import React, { useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";

import bgImage from "../assets/backgroundImage.jpg";

const Chat = ({ route, navigation }) => {
  const { name, theme } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View
      style={[
        styles.container,
        styles.theme,
        theme === "theme1"
          ? styles.theme1
          : theme === "theme2"
          ? styles.theme2
          : theme === "theme3"
          ? styles.theme3
          : styles.theme4,
      ]}
    >
      <Text
        style={
          theme === "theme1" ? styles.textThemeLight : styles.textThemeDark
        }
      >
        Chat screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  theme: {
    flex: 1,
    width: "100%",
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
  textThemeLight: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  textThemeDark: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Chat;
