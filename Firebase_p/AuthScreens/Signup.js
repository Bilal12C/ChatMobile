import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Alert, Pressable,
  TouchableOpacity,
  Animated
} from 'react-native';
import React, { useState } from 'react';
import { registerRoute } from '../utils/Apiroutes';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import SocialIcons from './SocialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Signup = () => {


   
  const [User, SetUser] = useState({ name: '', email: '', Password: '' })
  const [photo, setPhoto] = React.useState(null);
  let navigation = useNavigation();
  const[hide,setHide] = useState(true)
  const HandleInput = (name, val) => {
    SetUser({
      ...User,
      [name]: val
    })
  }


  const SignupB = async () => {
    if (User.name != '') {
      if (User.email != '') {
        if (User.Password != '') {
          try {
            console.log("photo data is", photo)
            const formData = new FormData();
            formData.append('name', User.name);
            formData.append('email', User.email);
            formData.append('password', User.Password);
            formData.append('image', {
              uri: photo.uri,
              name: photo.fileName,
              type: photo.type,
            });
            const response = await axios.post(registerRoute, formData, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              }
            });
            if (response.status == true) {
              alert("User Has Been Registered")
              SetUser({ name: '', email: '', Password: '' })
            }
            else {
              alert(response.data.msg)
            }

          } catch (error) {
            console.log('Signup error:', error);
            // Handle error
          }

        }
      }
    }


    //       const {name , email , Password } = User;
    //       console.log("usee n",name,email,Password)
    //       const { data } = await axios.post(registerRoute, {
    //         name,
    //         email,
    //         Password,
    //       });

    //       console.log("daata",data)
    //       if(data.status === true){
    //         alert(data.msg)
    //         SetUser({name:'',email:'',Password:''})
    //         navigation.navigate('Login')
    //       }
    //       else if (data.status == false){
    //         alert(data.msg)
    //       }
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }

    else {
      alert("All the Fields should be filled")
    }
  }


  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      console.log(response.assets[0].uri);
      if (response) {
        setPhoto(response.assets[0]);
      }
    });
  };


  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20, marginBottom: 20,  justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={photo == null ? require('../Assets/download.png') : { uri: photo.uri }}
          style={{ height: 90, width: 90, borderRadius: 50,position: 'relative', resizeMode: 'contain' }}
        />
        <Icon
          name="plus"
          color={'black'}
          size={30}
          onPress={handleChoosePhoto}
          style={{ position: 'absolute', bottom: 0, right: 0 }}
        />
      </View>
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText}
          placeholder="Name..."
          value={User.name}
          placeholderTextColor="#003f5c"
          onChangeText={text => HandleInput('name', text)} />
      </View>
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText}
          value={User.email}
          placeholder="email..."
          placeholderTextColor="#003f5c"
          onChangeText={text => HandleInput('email', text)} />
      </View>

      <View style={styles.inputView} >
        <TextInput
          secureTextEntry={hide ? true : false}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          style={styles.inputText}
          value={User.Password}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          onChangeText={text => HandleInput('Password', text)} />
            <Ionicons onPress={()=>setHide(!hide)}  style={{paddingRight:10}} name={hide ? 'ios-eye-off-outline' :'ios-eye-outline'} size={25} color={'white'} />
      </View>


      <TouchableOpacity onPress={SignupB} style={styles.loginBtn}>
        <Text style={styles.loginText}>Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.loginText, { marginRight: 20 }]}>Already Have an Account ?</Text>
        <Text onPress={() => navigation.navigate('Login')} style={[styles.loginText, { fontWeight: '900', fontSize: 22 }]}>Login</Text>
      </TouchableOpacity>
      <Text style={[styles.loginText,{marginTop:10}]}>Or Sign up with</Text>
      <SocialIcons/>
      {/* </View> */}
    </View>
  );
}

export default Signup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'space-between',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:10,
    // padding: 20
  },
  inputText: {
    height: 50,
    color: "white"
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "white",
    fontSize: 18
  }
})