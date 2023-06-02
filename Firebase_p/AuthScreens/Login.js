import { StyleSheet, Text, View ,Image,TextInput,TouchableOpacity, Dimensions, Pressable, KeyboardAvoidingView,Alert} from 'react-native'
import React ,{useState} from 'react';
import { loginRoute } from '../utils/Apiroutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
const Login = () => {
  
  let navigation = useNavigation();
  const [User , SetUser]=useState({name:'',Password:''})
  const[hide,setHide] = useState(true)
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
    <View style={styles.container}>
        <Text style={styles.logo}>ChatApp</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Name..." 
            value={User.name}
            placeholderTextColor="#003f5c"
            onChangeText={text => SetHandleText('name',text)}/>
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
            onChangeText={text => SetHandleText('Password',text)}/>
            <Icon onPress={()=>setHide(!hide)}  style={{paddingRight:10}} name={hide ? 'ios-eye-off-outline' :'ios-eye-outline'} size={25} color={'white'} />
        </View>
        
        <TouchableOpacity onPress={Loginfun} style={styles.loginBtn}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={{marginTop:20,flexDirection:'row',alignItems:'center'}}>
          <Text style={[styles.loginText,{marginRight:20}]}>Dont Have an Account ?</Text>
          <Text onPress={()=>navigation.navigate('Signup')} style={[styles.loginText,{fontWeight:'900',fontSize:22}]}>Signup</Text>
        </TouchableOpacity>
        <Text style={[styles.loginText,{marginTop:20}]}>Or Sign in with</Text>
      </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    alignItems:'center',
    justifyContent:'space-between',
    paddingHorizontal:10,
    // justifyContent:"center",
    // padding:20,
    flexDirection:'row'
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    // marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white",
    fontSize:18
  }
})