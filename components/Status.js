import React from "react";
import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";

export default class Status extends React.Component {
  state = {
    isConnected: true,
  };

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      const connected =
        state.isConnected && state.isInternetReachable !== false;
      this.setState({ isConnected: connected });
    });
    NetInfo.fetch().then((state) => {
      const connected =
        state.isConnected && state.isInternetReachable !== false;
      this.setState({ isConnected: connected });
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    const { isConnected } = this.state;
    const backgroundColor = isConnected ? "white" : "red";

    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? "dark-content" : "light-content"}
        animated={false}
      />
    );

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents="none">
        {statusBar}
        <View
          style={[
            styles.bubble,
            { backgroundColor: isConnected ? "green" : "red" },
          ]}
        >
          <Text style={styles.text}>
            {isConnected ? "Connected to Internet" : "No network connection"}
          </Text>
        </View>
      </View>
    );

    if (Platform.OS === "ios") {
      return (
        <View style={[styles.status, { backgroundColor }]}>
          {messageContainer}
        </View>
      );
    }

    return messageContainer;
  }
}

const statusHeight = Platform.OS === "ios" ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: "absolute",
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: "center",
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
