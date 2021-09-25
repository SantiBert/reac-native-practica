import React, { useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, TouchableWithoutFeedbackBase, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from "expo-sharing";
import uploadToAnonymousFilesAsync from 'anonymous-files';
import superman from './assets/supermanlogo.png';

const App = () => {

  const [selectedImage, setSelectedImage] = useState(null)

  let openImagePickerAsych = async () => {
    let persissionresult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (persissionresult.granted === false) {
      alert('Requiere permiso');
      return
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync()

    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
      setSelectedImage({ localUri: pickerResult.uri, remoteUri })
    } else {
      setSelectedImage({ localUri: pickerResult.uri })
    }

  }

  const openSharedDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('No es compatible con esta aplicación');
      return;
    }

    Sharing.shareAsync(selectedImage.localUri);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Elige una imagen
      </Text>
      <TouchableOpacity
        onPress={openImagePickerAsych}>
        <Image
          source={{
            uri:
              selectedImage !== null
                ? selectedImage.localUri
                : "https://picsum.photos/200/200",
          }}
          style={styles.image}
        />
      </TouchableOpacity>
      {
        selectedImage ?
          <TouchableOpacity
            onPress={openSharedDialog}
            style={styles.button}
          >
            <Text style={styles.butontext}>
              Compartir
            </Text>
          </TouchableOpacity>
          : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "#3C1679" },
  title: { fontSize: 30, color: "#FFB84E", textAlign: "center", padding: 13 },
  butontext: { color: 'white', textAlign: "center" },
  image: { height: 180, width: 240, alignSelf: "center", resizeMode: "contain", },
  button: { alignSelf: "center", backgroundColor: "#D73964", padding: 10, width: 120, marginTop: 10 }
});

export default App;
