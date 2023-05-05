import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native';
import { PixelRatio } from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Pratice = () => {
  return (
    <View>
      <Text style={{fontSize:65}}>{"Pratice"}</Text>
    </View>
  )
}

export default Pratice

const styles = StyleSheet.create({})