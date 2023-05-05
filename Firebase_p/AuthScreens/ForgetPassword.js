import { KeyboardAvoidingView, StyleSheet, Text, View ,Image ,TextInput,TouchableOpacity} from 'react-native'
import React, { useState } from 'react';
import GlobalStyles from '../GlobalStyles/GlobalStyles';
import auth from '@react-native-firebase/auth'; 
import { Height } from '../Dimensions/ProjectDimension';
const ForgetPassword = ({navigation}) => {
  
  const[Email,SetEmail]=useState('')

  const Forget = async ( ) => {
    if(Email!=''){
     await auth().sendPasswordResetEmail(Email).then((verification)=>{
        alert("Link Sent to Your Email")
        SetEmail('')
      }).then((error)=>{
        console.log(error)
      })
    }
  }


  return (
    <KeyboardAvoidingView behavior='padding' style={GlobalStyles.KeyboardAvoidingView}>
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
              placeholder="Enter Email"
              placeholderTextColor="white" 
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
              value={Email}
              onChangeText={(val)=>SetEmail(val)}
            />
          </View>
          <TouchableOpacity
            style={GlobalStyles.buttonStyle}
            activeOpacity={0.5}
            onPress={Forget}
            >
            <Text style={GlobalStyles.buttonTextStyle}>Send Link</Text>
          </TouchableOpacity>
          <Text style={{fontSize:Height*0.023,textAlign:'center',marginTop:20}}>Dont Have any Account ? </Text>
          <Text style={{fontSize:Height*0.03,textAlign:'center',marginTop:10}} onPress={()=>navigation.navigate('Signup')}>Sign Up</Text>
      </View>

    </KeyboardAvoidingView>
  )
}

export default ForgetPassword

const styles = StyleSheet.create({})