import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { APIKEY } from '@babel/core';

const openWeatherKey =  APIKEY;

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // "a1cd95af7f3524240c00c116e9261781"
  const loadForecast = async () => {
    setRefreshing(true);
    // PREGUNTA POR PERMISOS DE UBICACION
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permiso de ubicación denegada");
      setRefreshing(false);
      return;
    }
    // TOMA LA UBICACION ACTUAL
    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    // Construye la URL con la ubicación actual
    const fullUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&exclude=minutely&APPID=${openWeatherKey}`;

    console.log("API Key:", openWeatherKey);
    console.log("URL:", fullUrl);
    // Toma la informacion de la api de openWeatherMap
    const response = await fetch(fullUrl);
    const data = await response.json(); // convierte la respuesta en un json
    console.log("response", data.main);

    if (!response.ok) {
      Alert.alert("Error", "Algo salió mal :("); // si no esta todo ok, muestra la alerta
    } else {
      setForecast(data); // setea la informacion en el estado
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="xlarge" color="lightblue" />
      </SafeAreaView>
    );
  }

  const currentWeather = forecast.weather[0];

  const iconUrl = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadForecast()}
          />
        }
        style={{ marginTop: 50 }}
      >
        <Text style={styles.title}>{forecast.name}</Text>
        <Text
          style={{ alignItems: "center", textAlign: "center", color: "#fff" }}
        >
          {forecast.sys.country}
        </Text>
        <View style={styles.current}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Image source={{ uri: iconUrl }} style={styles.largeIcon} />
          </View>
          <View>
            <Text style={styles.currentTemp}>
              {Math.round(forecast.main.temp)}°C
            </Text>
            <View style={styles.tiempoCont}>
              <Text style={styles.tiempo}>
                Mín {Math.round(forecast.main.temp_min)}°C
              </Text>
              <Text style={styles.tiempo}>
                Máx {Math.round(forecast.main.temp_max)}°C
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.descriptionCont}>
          <Text style={styles.description}>{currentWeather.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Weather;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "lightblue" },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  // loading: { paddingTop: 550, height: 200 },
  current: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-around",
  },
  largeIcon: {
    width: 300,
    height: 250,
  },
  currentTemp: {
    fontSize: 42,
    // height:250,
    // width:'auto',
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  tiempoCont: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 250,
  },
  tiempo: {
    fontSize: 20,
    color: "white",
  },
  description: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign:"center"
  },
  descriptionCont: {
    marginBottom: 25,
  },
});
