import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, ImageBackground , LogBox } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import SplashScreen from './android/app/src/components/MySplashScreen';

console.disableYellowBox = true;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [faceImageUri, setFaceImageUri] = useState(null);
  const [sunglassesImageUri, setSunglassesImageUri] = useState(null);
  const [watchImageUri, setWatchImageUri] = useState(null);
  const [wristImageUri, setWristImageUri] = useState(null);
  const [showSplash, setShowSplash] = useState(true); // State to control splash screen
  const [mode, setMode] = useState(null); // State to control mode (sunglasses or watch)

  useEffect(() => {
    // Simulate a loading time for the splash screen
    setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Display splash screen for 3 seconds
  }, []);

  const selectImage = (setImageUri) => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const displaySunglasses = async () => {
    try {
      if (!faceImageUri || !sunglassesImageUri) {
        alert('Please select both face and sunglasses images.');
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append('GlassesImage', {
        uri: sunglassesImageUri,
        name: 'sunglassesImage.png',
        type: 'image/jpeg',
      });
      formData.append('FaceImage', {
        uri: faceImageUri,
        name: 'faceImage.jpeg',
        type: 'image/jpeg',
      });

      const response = await fetch('https://c25d-154-80-1-40.ngrok-free.app/api/uploadGlassesImage/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        const responseText = await response.text();
        throw new Error(`JSON parse error: ${jsonError.message} - Response text: ${responseText}`);
      }

      console.log("API response:", responseData);
      setResultImageUrl(responseData.result_url);
    } catch (error) {
      console.error('Error displaying sunglasses:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayWatch = async () => {
    try {
      if (!watchImageUri || !wristImageUri) {
        alert('Please select both watch and wrist images.');
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append('watchImage', {
        uri: watchImageUri,
        name: 'watchImage.jpg',
        type: 'image/jpeg',
      });
      formData.append('wristImage', {
        uri: wristImageUri,
        name: 'wristImage.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch('https://c25d-154-80-1-40.ngrok-free.app/api/uploadWristImage/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        const responseText = await response.text();
        throw new Error(`JSON parse error: ${jsonError.message} - Response text: ${responseText}`);
      }

      console.log("API response:", responseData);
      setResultImageUrl(responseData.result_url);
    } catch (error) {
      console.error('Error displaying watch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('./android/app/src/main/res/drawable/bg.jpg')} style={styles.backgroundImage}>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <View style={styles.container}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>Welcome to our</Text>
            <Text style={styles.welcomeTextQuoted}>"VIRTUAL TRY ON"</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.tryBox}>
              <Text style={styles.tryBoxTitle}>Try Sunglasses</Text>
              <TouchableOpacity style={styles.button} onPress={() => { setMode('sunglasses'); selectImage(setFaceImageUri); }}>
                <Text style={styles.buttonText}>Select Face Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => { setMode('sunglasses'); selectImage(setSunglassesImageUri); }}>
                <Text style={styles.buttonText}>Select Sunglasses Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={displaySunglasses} disabled={loading}>
                <Text style={styles.buttonText}>Try Sunglasses</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tryBox}>
              <Text style={styles.tryBoxTitle}>Try Watch</Text>
              <TouchableOpacity style={styles.button} onPress={() => { setMode('watch'); selectImage(setWatchImageUri); }}>
                <Text style={styles.buttonText}>Select Watch Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => { setMode('watch'); selectImage(setWristImageUri); }}>
                <Text style={styles.buttonText}>Select Wrist Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={displayWatch} disabled={loading}>
                <Text style={styles.buttonText}>Try Watch</Text>
              </TouchableOpacity>
            </View>
          </View>
          {loading && <Text>Loading...</Text>}
          {resultImageUrl && <Image source={{ uri: resultImageUrl }} style={{ width: 150, height: 150, marginBottom: 9 }} />}
          {mode === 'sunglasses' && (
            <View style={styles.imageRow}>
              {faceImageUri && <Image source={{ uri: faceImageUri }} style={styles.previewImage} />}
              {sunglassesImageUri && <Image source={{ uri: sunglassesImageUri }} style={styles.previewImage} />}
            </View>
          )}
          {mode === 'watch' && (
            <View style={styles.imageRow}>
              {watchImageUri && <Image source={{ uri: watchImageUri }} style={styles.previewImage} />}
              {wristImageUri && <Image source={{ uri: wristImageUri }} style={styles.previewImage} />}
            </View>
          )}
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTextContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeTextQuoted: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  tryBox: {
    flex: 1,
    height: 330,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  tryBoxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 25, // Rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 60,
    width: 150,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginHorizontal:10
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default App;
