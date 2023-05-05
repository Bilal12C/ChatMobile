import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert
  } from 'react-native';
import React, { useState } from 'react';
import { registerRoute } from '../utils/Apiroutes';
import GlobalStyles from '../GlobalStyles/GlobalStyles';
import axios from 'axios';
const Signup = ({navigation}) => {
  const[User,SetUser]=useState({name:'',email:'',Password:'',ConfirmPassword:''})

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
            const { data } = await axios.post(registerRoute, {
              name,
              email,
              Password,
            });
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
  }

 
  return (
    <KeyboardAvoidingView style={GlobalStyles.KeyboardAvoidingView}  behavior='padding' >
      <View style={styles.MainViewa}>
      <View style={{alignItems:'center'}}>
          <Image
            source={require('../Assets/ReactIcon.png')}
            style={{
              width: '50%',
              resizeMode: 'contain',
            }}
          />
        </View>
          <View style={GlobalStyles.SectionStyle}>
            <TextInput
              style={GlobalStyles.inputStyle}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="white" 
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
              value={User.name}
              onChangeText={(val)=>HandleInput('name',val)}
            />
          </View>
          <View style={GlobalStyles.SectionStyle}>
            <TextInput
              style={GlobalStyles.inputStyle}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="white"
              keyboardType="email-address"
              returnKeyType="next"
              blurOnSubmit={false}
              value={User.email}
              onChangeText={(val)=>HandleInput('email',val)}
            />
          </View>
          <View style={GlobalStyles.SectionStyle}>
            <TextInput
              style={GlobalStyles.inputStyle}
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="white"
              blurOnSubmit={false}
              value={User.Password}
              onChangeText={(val)=>HandleInput('Password',val)}
            />
          </View>
          <View style={GlobalStyles.SectionStyle}>
            <TextInput
              style={GlobalStyles.inputStyle}
              placeholder="Confirmed Password"
              placeholderTextColor="white"
              blurOnSubmit={false}
              value={User.ConfirmPassword}
              onChangeText={(event)=>HandleInput('ConfirmPassword',event)}
            />
          
          </View>
          {Error!=null?(<Text style={{color:'red',paddingLeft:20}}>{Error}</Text>):null}
          <TouchableOpacity
            style={GlobalStyles.buttonStyle}
            activeOpacity={0.5}
            onPress={SignupB}
            >
            <Text style={GlobalStyles.buttonTextStyle}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.buttonStyle}
            activeOpacity={0.5}
            onPress={()=>navigation.navigate('Login')}
            >
            <Text style={GlobalStyles.buttonTextStyle}>Sign in</Text>
          </TouchableOpacity>
          </View>
    </KeyboardAvoidingView>

  )
}

export default Signup

const styles = StyleSheet.create({
      MainViewa:{
        flex:1,
        justifyContent:'center',
        paddingHorizontal:10
      }
    
})