import React, { useEffect, useState } from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Alert,
  LogBox,
} from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, navigation, isConnected }) => {
  const { name, _id, theme } = route.params;
  const [messages, setMessages] = useState([]);

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("messages");
      console.log("Cached Messages:", cachedMessages);
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error("Error loading cached messages:", error.message);
    }
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
      console.log("Messages cached successfully");
    } catch (error) {
      console.error("Error caching messages:", error.message);
    }
  };

  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });

    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), where("uid", "==", _id));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          const messageData = doc.data();
          const message = {
            _id: messageData.messageId,
            text: messageData.text,
            createdAt: new Date(),
            user: {
              _id: messageData.senderId,
              name: name,
            },
          };
          newMessages.push(message);
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  //customizes the chat bubble color
  const renderBubble = (props) => {
    const bubbleStyles = {
      // User's messages
      right: {
        backgroundColor:
          theme === "theme1"
            ? "black"
            : theme === "theme2"
            ? "#72BD7B"
            : theme === "theme3"
            ? "#E1A66B"
            : theme === "theme4"
            ? "#EC8FEE"
            : "#FFA726",
      },
      // User's received messages
      left: {
        backgroundColor: theme === "theme1" ? "#FFF" : "#FFE082",
      },
    };

    return <Bubble {...props} wrapperStyle={bubbleStyles} />;
  };

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{ _id: _id, name: name }}
        renderInputToolbar={renderInputToolbar}
      />
      {/*keyboard adjustments for androids */}
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
});

export default Chat;
