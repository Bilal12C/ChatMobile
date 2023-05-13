import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../AuthScreens/Login';
import Signup from '../AuthScreens/Signup';
import Chat from '../HomeScreens/Chat';
import Home from '../HomeScreens/Home';
import Audio from '../HomeScreens/Audio';
import UserProfile from '../HomeScreens/Profile';

const HomeS = createNativeStackNavigator();
const Auth = createNativeStackNavigator();

const Index = () => {
  const [isLoggedin, SetLoggedin] = useState(false)
  useEffect(() => {
    const FetchToken = async () => {
      const data = await AsyncStorage.getItem('key')
      const Parsestring = JSON.parse(data)
      console.log("oa",Parsestring)
       if(data!==undefined || data !== null){
        SetLoggedin(Parsestring)
       }
    }
    FetchToken();
  }, [])
  return (
    <NavigationContainer>
        {
          isLoggedin?(
            <Homestack/>
          ):(
            <AuthStack/>
          )
        }
    </NavigationContainer>
  )
}

export default Index;

const AuthStack =  () => {
    return(
      <Auth.Navigator initialRouteName='Signup' screenOptions={{headerShown:false}}>  
        <Auth.Screen name='Login' component={Login} />
        <Auth.Screen name='Signup' component={Signup} />
        <Auth.Screen name='Home' component={Homestack} />
      </Auth.Navigator>
    )
}

const Homestack =  () => {
   return (
    <HomeS.Navigator initialRouteName='Home'  screenOptions={{headerShown:false}}>
      <HomeS.Screen name='Home' component={Home}/>
      <HomeS.Screen name='Chat' component={Chat}/>
      <HomeS.Screen name='Audio' component={Audio}/>
      <HomeS.Screen name='UserProfile' component={UserProfile}/>
      <HomeS.Screen name='Auth' component={AuthStack}/>
    </HomeS.Navigator>
   )
}