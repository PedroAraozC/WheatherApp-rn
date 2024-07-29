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
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
// import { APIKEY } from '@babel/core';

const openWeatherKey = "a1cd95af7f3524240c00c116e9261781";

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
    console.log("data", data)

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
          <View style={styles.extraInfo}>
            <View style={styles.info}>
              <Image
                source={require("./assets/temp.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  tintColor: "lightblue",
                  // marginLeft: 50,
                }}
              />
              <Text style={styles.text}>{forecast.main.feels_like}ºC</Text>
              <Text style={styles.text}>Sensacion termica</Text>
            </View>
            <View style={styles.info}>
              <Image
                source={require("./assets/humedad.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  tintColor: "lightblue",
                  // marginLeft: 50,
                }}
              />
              <Text style={styles.text}>{forecast.main.humidity}%</Text>
              <Text style={styles.text}>Humedad</Text>
            </View>
          </View>
          {/* <View>
<Text>
  Pronóstico por hora
</Text>
          </View> */}

    {/*---------------------------Version paga---------------------------*/}
          <FlatList
            horizontal
            data={forecast.hourly?.slice(0, 24)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(hour) => {
              const weather = hour.item.weather[0];
              var dt = new Date(hour.item.dt * 1000);
              return (
                <View style={styles.hour}>
                  <Text style={{ fontWeight: "bold", color: "#346751" }}>
                    {dt.toLocaleTimeString().replace(/:\d+ /, "")}
                  </Text>
                  <Text style={{ fontWeight: "bold", color: "#346751" }}>
                    {Math.round(hour.item.temp)}ºC
                  </Text>
                  <Image style={styles.smallIcon}
                  source={{uri:`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}}/>
                  <Text style={{fontWeight:'bold', color:'#346751'}}>{weather.description}</Text>
                </View>
              );
            }}
          />
    {/*---------------------------Version paga---------------------------*/}

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
    textAlign: "center",
  },
  descriptionCont: {
    marginBottom: 25,
  },
  info: {
    width: Dimensions.get("screen").width / 2.5,
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  extraInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    alignItems: "center",
  },
  subtitle:{
    fontSize:24,
    marginVertical:12,
    marginLeft:7,
    color:'C84B31',
    fontWeight:'bold'
  },
  hour:{
    padding:6,
    alignItems:'center',
  },
  smallIcon:{
    width:100,
    height:100
  }
});
