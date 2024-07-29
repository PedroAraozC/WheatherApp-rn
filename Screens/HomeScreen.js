import { Text, StyleSheet, View, SafeAreaView } from 'react-native'
import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar'

export default function HomeScreen () {
    return (
      <View style={styles.contendorHome}>
        <StatusBar style='dark'/>
        <Text>HomeScreen</Text>
      </View>
    )
  }

const styles = StyleSheet.create({
    contendorHome:{
        flex:1,
        position:'relative'
    }
})