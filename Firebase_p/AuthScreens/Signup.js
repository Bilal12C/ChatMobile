import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,Pressable
  } from 'react-native';
import React, { useState } from 'react';
import { registerRoute } from '../utils/Apiroutes';
import axios from 'axios';
import tailwind from 'twrnc';
import { useNavigation } from '@react-navigation/native';
const Signup = () => {
  const[User,SetUser]=useState({name:'',email:'',Password:'',ConfirmPassword:''})
  let navigation = useNavigation();
  const HandleInput = (name,val) => {
    SetUser({
      ...User,
      [name]:val
    })   
  }

 
  const SignupB = async () => {
    if(User.name!=''){
      if(User.email!=''){
        if(User.Password && User.ConfirmPassword!=''){
          try {
            const {name , email , Password } = User;
            console.log("usee n",name,email,Password)
            const { data } = await axios.post(registerRoute, {
              name,
              email,
              Password,
            });

            console.log("daata",data)
            if(data.status === true){
              alert(data.msg)
              SetUser({name:'',email:'',Password:'',ConfirmPassword:''})
              navigation.navigate('Login')
            }
            else if (data.status == false){
              alert(data.msg)
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
      else{
        alert("All the Fields should be filled")
       }
  }

 
  return (
    <View style={tailwind`flex-1 items-center justify-center bg-black`}>
    <View style={tailwind`p-8 w-full max-w-sm`}>
      <Text style={tailwind`text-5xl font-bold mb-6 text-white`}>Signup</Text>

      <TextInput
        style={tailwind`w-full bg-white rounded-md h-12 px-4 mb-4 text-black`}
        placeholderTextColor="#000"
        placeholder="Enter Name"
        value={User.name}
        onChangeText={(val)=>HandleInput('name',val)}
      />

      <TextInput
        style={tailwind`w-full bg-white rounded-md h-12 px-4  mb-4 text-black`}
        placeholderTextColor="#000"
        placeholder="Enter Email"
        value={User.email}
        onChangeText={(val)=>HandleInput('email',val)}
      />

<TextInput
        style={tailwind`w-full bg-white rounded-md h-12 px-4 mb-4 text-black`}
        placeholderTextColor="#000"
        placeholder="Password"
        value={User.Password}
        onChangeText={(val)=>HandleInput('Password',val)}
      />

<TextInput
        style={tailwind`w-full bg-white rounded-md h-12 px-4 mb-6 text-black `}
        placeholderTextColor="#000"
        placeholder="Confirm Password"
        value={User.ConfirmPassword}
        onChangeText={(val)=>HandleInput('ConfirmPassword',val)}
      />

      

      <Pressable
        onPress={SignupB}
        style={tailwind`h-12 border-2 border-white rounded-md flex flex-row justify-center items-center px-6 mb-6 text-black `}
      >
        <View style={tailwind`flex-1 flex items-center`}>
          <Text style={tailwind`text-white text-base font-medium`}>Signup</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={()=>navigation.navigate('Login')}
        style={tailwind`h-12 border-2 border-white rounded-md flex flex-row justify-center items-center px-6 `}
      >
        <View style={tailwind`flex-1 flex items-center`}>
          <Text style={tailwind`text-white text-base font-medium`}>Login</Text>
        </View>
      </Pressable>
    </View>
  </View>
);
}

export default Signup

const styles = StyleSheet.create({
      MainViewa:{
        flex:1,
        justifyContent:'center',
        paddingHorizontal:10,
        alignItems:'center',
        // backgroundColor:'red'
      }
    
})