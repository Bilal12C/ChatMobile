import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Alert, Pressable,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { registerRoute } from '../utils/Apiroutes';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { launchImageLibrary } from 'react-native-image-picker';
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
            const data = {
              name:User.name,
              email:User.email,
              Password:User.Password,
              pic:photo
            }
            const response = await axios.post(registerRoute,data);
            if (response.status == true) {
              alert("User Has Been Registered")
              navigation.navigate('Login')
            }
            else {
              alert(response.data.msg)
            }

          } catch (error) {
            console.log('Signup error:', error);
          }

        }
      }
    }

    else {
      alert("All the Fields should be filled")
    }
  }


  const cloudinaryUpload = (photo) => {
    const data = new FormData()
    data.append('file', photo)
    data.append('upload_preset', 'ImageFroChat')
    data.append("cloud_name", "chatapp1")
    fetch("https://api.cloudinary.com/v1_1/chatapp1/upload", {
      method: "post",
      body: data
    }).then(res => res.json()).
      then(data => {
        console.log("da",data)
        setPhoto(data?.secure_url)
      }).catch(err => {
        Alert.alert("An Error Occured While Uploading")
      })
  }
  
  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      console.log(response.assets[0].uri);
      if (response) {
        const uri = response.assets[0].uri;
        const type = response.assets[0].type;
        const name = response.assets[0].fileName;
        const source = {
          uri,
          type,
          name,
        }
        cloudinaryUpload(source)
      }
    });
  };


  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20, marginBottom: 20,  justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={photo == null ? require('../Assets/download.png') : { uri: photo }}
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