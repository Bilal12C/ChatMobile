import { StyleSheet, Text, View ,Image,TextInput,TouchableOpacity, Dimensions, Pressable, KeyboardAvoidingView,Alert} from 'react-native'
import React ,{useState} from 'react';
import GlobalStyles from '../GlobalStyles/GlobalStyles';
import { Height } from '../Dimensions/ProjectDimension';
import { loginRoute } from '../utils/Apiroutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import tailwind from 'twrnc'
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
    <View style={tailwind`flex-1 items-center justify-center bg-black`}>
    <View style={tailwind`p-8 w-full max-w-sm`}>
      <Text style={tailwind`text-5xl font-bold mb-6 text-white`}>Login</Text>

      <TextInput
        style={tailwind`w-full bg-white rounded-md h-12 px-4 mb-4 text-black`}
        placeholderTextColor="#000"
        placeholder="Enter Name"
        value={User.name}
        onChangeText={(val)=>SetHandleText('name',val)}

      />

      <TextInput
        style={tailwind`w-full bg-white rounded-md h-12 px-4 mb-6 text-black`}
        placeholderTextColor="#000"
        placeholder="Enter password"
        value={User.Password}
        onChangeText={(val)=>SetHandleText('Password',val)}
      />

    
      <Pressable
        style={tailwind`h-12 border-2 border-white rounded-md flex flex-row justify-center items-center px-6 `}
        onPress={Loginfun}
      >
        <View style={tailwind`flex-1 flex items-center`}>
          <Text style={tailwind`text-white text-base font-medium`}>Login</Text>
        </View>
      </Pressable>
    </View>
  </View>
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