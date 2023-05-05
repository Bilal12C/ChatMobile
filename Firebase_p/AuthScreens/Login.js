import { StyleSheet, Text, View ,Image,TextInput,TouchableOpacity, Dimensions, Pressable, KeyboardAvoidingView,Alert} from 'react-native'
import React ,{useState} from 'react';
import GlobalStyles from '../GlobalStyles/GlobalStyles';
import { Height } from '../Dimensions/ProjectDimension';
import { loginRoute } from '../utils/Apiroutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const Login = ({navigation}) => {
  
  
  const [User , SetUser]=useState({name:'',Password:''})
  const SetHandleText = (name,value) => {
    SetUser({
      ...User,
      [name]:value
    })
  }

  const Loginfun = async () => {
     if(User.name!='' && User.Password!=''){
      console.log("dad"
      )
      try {
        const {name , Password } = User;
        console.log("name",name,Password)
        const { data } = await axios.post(loginRoute, {
          name,
          Password,
        });
        console.log("data  jghjg",typeof(data.user))
        const newstring =  JSON.stringify(data?.user)
        console.log("nes ",newstring)
        if(data.status === true){
          const data =  await AsyncStorage.setItem('key',newstring)
          navigation.navigate('Home')
        }
        else if (data.status == false){
          alert(data.msg)
        }
      } catch (error) {
        console.error(error);
      }
     }
     else{
      alert("Username or Password cannot be empty")
     }
  }

  return (
    <KeyboardAvoidingView style={GlobalStyles.KeyboardAvoidingView} behavior='height'>
       <View style={GlobalStyles.MainView}>
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
              placeholder="Enter Username"
              placeholderTextColor="white" 
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
              value={User.name}
              onChangeText={(val)=>SetHandleText('name',val)}
            />
          </View>
          <View style={GlobalStyles.SectionStyle}>
            <TextInput
              style={GlobalStyles.inputStyle}
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="white"
              blurOnSubmit={false}
              secureTextEntry={true}
              value={User.Password}
              onChangeText={(val)=>SetHandleText('Password',val)}
            />
          </View>
          <TouchableOpacity
            style={GlobalStyles.buttonStyle}
            activeOpacity={0.5}
            onPress={Loginfun}
            >
            <Text style={GlobalStyles.buttonTextStyle}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.buttonStyle}
            activeOpacity={0.5}
            onPress={()=>navigation.navigate('Signup')}
            >
            <Text style={GlobalStyles.buttonTextStyle}>Sign Up</Text>
          </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
   ForgetPasswordView:{
    height:Height/8,
    justifyContent:'center',
    alignItems:'center'
   },
   ForgetPasswordText:{
    fontWeight:'700',
    fontSize:Height*0.02
   }
})