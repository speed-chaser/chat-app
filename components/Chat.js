import React, { useEffect, useState } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
  const { name, _id, theme } = route.params;
  const [messages, setMessages] = useState([]);

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

  useEffect(() => {
    const unsubMessages = onSnapshot(
      collection(db, "messages"),
      (querySnapshot) => {
        const newMessages = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.user._id,
              name: data.user.name,
              avatar: data.user.avatar,
            },
          };
        });

        // Sort messages by createdAt in descending order
        newMessages.sort((a, b) => b.createdAt - a.createdAt);
        setMessages(newMessages);
      }
    );

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [db]);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{ _id: _id, name: name }}
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
