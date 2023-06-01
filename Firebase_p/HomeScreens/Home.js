import { Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { allUsersRoute, host,  } from '../utils/Apiroutes';
import axios from 'axios';
import { io } from 'socket.io-client';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
const Home = () => {
  let naviagtion   = useNavigation();
  const [currentuser, setcurrentuser] = useState(undefined);
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentchat, setCurrentChat] = useState(undefined);
  const[showUser,SetUser]=useState(false)

  useEffect(() => {
    const fecthdata = async () => {
      const data = await AsyncStorage.getItem('key');
      const NEWDATA = JSON.parse(data)
      if (NEWDATA) {
        setcurrentuser(NEWDATA)
      }
    }
    fecthdata();

  }, [])


  const SetCurrentchat = () => {
    console.log("ss",currentchat)
    naviagtion.navigate('Chat',{user:currentchat,socket:socket})
    
  }
  useEffect(() => {
    if (currentuser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentuser._id);
    }
  }, [currentuser])

  useEffect(() => {
    getAllusers();
  }, [currentuser])

  const getAllusers = async () => {
    if (currentuser) {
      const data = await axios.get(`${allUsersRoute}/${currentuser._id}`);
      setContacts(data.data)
    }
  }

 


  const setProfileuser = (item,index) => {
    SetUser(!showUser)
    console.log(item,index)
    setCurrentChat(item)
  }

  const ViewProfile = () => {
    if(showUser){
      naviagtion.navigate('UserProfile',{user:currentchat,title:'chatuser'})
    }
    else{
      naviagtion.navigate('UserProfile',{user:currentuser,title:'user'})
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.loginBtn}>
        <Text style={{ fontSize: 23, color: 'white'}}>ChatApp</Text>
        <Pressable onPress={ViewProfile} style={{backgroundColor:'#202C33',padding:10,borderRadius:50}}>
        <IonicIcon name='power-outline' size={20} color={'white'} />
        </Pressable>
      </View>
     
     {
      showUser ? (
        <View style={{paddingHorizontal:20,marginTop:20,marginBottom:20,backgroundColor:'#465881', paddingVertical:20,marginHorizontal:10}}>
          <View style={{flexDirection:'row',alignItems:'center',paddingLeft:20}}>
            <View style={[styles.ProfileView,{height:80,width:80}]}>
                  <Text style={{color:'white',fontSize:30}}>{currentchat.name[0]}</Text>
                </View>
            <Text style={[styles.name,{color:'#FFFFFF'}]}>{currentchat.name}</Text>
            </View>
            <View style={styles.HorizontalLine} />

            <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
              <Pressable onPress={SetCurrentchat} style={[styles.loginBtn,{width:'45%',backgroundColor:'silver',height:40,borderRadius:20}]}>
                <Text style={[styles.name,{color:'black',fontSize:18}]}>Text Him</Text>
              </Pressable>
              <Pressable onPress={ViewProfile} style={[styles.loginBtn,{width:'45%',height:40,borderRadius:20}]}>
                <Text style={[styles.name,{color:'#FFFFFF',fontSize:14}]}>View Profile</Text>
              </Pressable>
              </View>
          </View>
      ):null
     }

      {
        contacts.length > 0 ? (
          <FlatList
            data={contacts}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => { setProfileuser(item, index) }} style={styles.FlatListview}>
                <View style={styles.ProfileView}>
                  <Text style={{color:'white'}}>{item.name[0]}</Text>
                </View>
                <Text style={styles.name}>{item.name}</Text>
              </Pressable>
            )}
          />
        ) : (
          null
        )
      }
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  FlatListview: {
    backgroundColor:'#465881',
    marginVertical: 15,
    alignItems:'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    // marginHorizontal:15,
    borderRadius:10,
    // height:heightPercentageToDP('12')
  },
  ProfileView: {
    backgroundColor: 'black',
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    marginRight: 20,
    fontSize: 22,
    marginLeft: 20,
    color:'black'
  },
  Header:{
    height: Dimensions.get('screen').height * 0.08,
     backgroundColor: 'black', 
     justifyContent: 'space-between',
     flexDirection:'row',
     alignItems:'center',
     paddingHorizontal:10
  },
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
  },
  loginBtn:{
    backgroundColor:"#fb5b5a",
    height:60,
    alignItems:"center",
    justifyContent:'space-between',
    marginBottom:10,
    flexDirection:'row',
    paddingHorizontal:10
  },
  HorizontalLine: {
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    opacity: 0.2,
    width: '90%',
    marginTop: Dimensions.get('screen').height * 0.02,
    // marginBottom: Dimensions.get('screen').height * 0.02,
    alignSelf: 'center',
  },
 
})