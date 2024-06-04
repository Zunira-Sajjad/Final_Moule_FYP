import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const MySplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const init = async () => {
      // Simulate any asynchronous initialization tasks here
      await someAsyncInitializationTask();

      // After initialization, hide the splash screen and call the onFinish callback
      SplashScreen.hide();
      onFinish();
    };

    init();
  }, [onFinish]);

  const someAsyncInitializationTask = async () => {
    // Simulate a 2-second initialization task
    return new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../main/res/drawable/launch_screen2_bg.png')}
        style={styles.splashImage}
        resizeMode="contain"
      />
      <Text style={styles.overlayText}>Welcome to your personal Virtual Try On</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Set the background color to white
  },
  splashImage: {
    width: '50%', // Adjust the width as needed
    height: '40%', // Adjust the height as needed
  },
  overlayText: {
    position: 'absolute',
    color: 'white',
    fontSize:15,
    textAlign: 'center',
    bottom: 80,// Position the text at the bottom
  },
});

export default MySplashScreen;
