import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  refreshControl
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

const openWeatherKey = "a1cd95af7f3524240c00c116e9261781";
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`;

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  let location;

  const loadForecast = async () => {
    setRefreshing(true);
    // PREGUNTA POR PERMISOS DE UBICACION
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== ""(Alert.alert("Permiso de ubicación denegada")))
      // TOMA LA UBICACION ACTUAL

      location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

    //Toma la informacion de la api de openWeatherMap
    const response = await fetch(
      `${url}&alt=${location.coords.latitude}&lon=${location.coords.longitude}`
    );
    const data = await response.json(); //convierte la respuesta en un json

    if (!response.ok) {
      Alert.alert("Error", "Algo salió mal :("); // si no esta todo ok, muestra la alerta
    } else {
      setForecast(data); //setea la informacion en el estado
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }


  const current = forecast.current.weather[0]

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView refreshControl={}>

    </ScrollView>
  </SafeAreaView>
  );
};

export default Weather;
