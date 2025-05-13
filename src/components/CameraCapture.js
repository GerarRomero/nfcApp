import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";

const SimpleCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [typeCamera, setTypeCamera] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  const toggleCameraType = () => {
    setTypeCamera((prev) =>
      prev === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false)
    return <Text>No se tiene permiso para acceder a la cámara</Text>;

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={typeCamera}
        />
      ) : (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      )}

      <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraType}>
        <Ionicons name="camera-reverse" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
        <Text style={{ color: "white" }}>Tomar Foto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  photo: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  toggleButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 30,
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 10,
  },
});

export default SimpleCamera;
