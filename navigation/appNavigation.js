import { LogBox, Text, View } from "react-native";
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Screens/HomeScreen";

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name= 'Home' options={{headerShow:false}} component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
