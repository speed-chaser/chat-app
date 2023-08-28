import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import navigation screens
import Start from "./components/Start";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();

// The app's main Chat component that renders the chat UI
const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAV-lKqnKMBaylrV9oAW4Gvpoe3eTgddiQ",
    authDomain: "chat-app-42f6c.firebaseapp.com",
    projectId: "chat-app-42f6c",
    storageBucket: "chat-app-42f6c.appspot.com",
    messagingSenderId: "848131849559",
    appId: "1:848131849559:web:eba086c23f684b19cdd212",
    measurementId: "G-KJSRPP5QTW",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
