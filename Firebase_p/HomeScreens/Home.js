import { Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { allUsersRoute, host,  } from '../utils/Apiroutes';
import axios from 'axios';
import { io } from 'socket.io-client';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { useRef } from 'react';
import { logoutRoute } from '../utils/Apiroutes';
import { widthPercentageToDP , heightPercentageToDP } from 'react-native-responsive-screen';

const Home = ({ navigation }) => {
  const [currentuser, setcurrentuser] = useState(undefined);
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentchat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    const fecthdata = async () => {
      const data = await AsyncStorage.getItem('key');
      const NEWDATA = JSON.parse(data)
      if (NEWDATA) {
        console.log("data", NEWDATA)
        setcurrentuser(NEWDATA)
      }
    }
    fecthdata();

  }, [])


  const SetCurrentchat = (item, index) => {
    console.log("user to chat is", item)
    setCurrentChat(item)

    navigation.navigate('Chat',{user:item,socket:socket})
    
  }
  useEffect(() => {
    if (currentuser) {
      console.log("current user is", currentuser._id)
      socket.current = io(host);
      socket.current.emit("add-user", currentuser._id);
    }
  }, [currentuser])

  useEffect(() => {
    getAllusers();
  }, [currentuser])

  const getAllusers = async () => {
    if (currentuser) {
      console.log("current user is", currentuser._id)
      const data = await axios.get(`${allUsersRoute}/${currentuser._id}`);
      console.log("datasfdsdffd", data.data)
      setContacts(data.data)
    }
  }

  const Logout = async () => {
    const id = currentuser._id;
    console.log("id",id)
    const data = await axios.get(`${logoutRoute}/${id}`);
    if(data.status == 200){
      AsyncStorage.clear();
      navigation.navigate("Auth")
    }
  }




  


  return (
    <View style={{ flex: 1 , backgroundColor :'black'}}>
      <View style={styles.Header}>
        <Text style={{ fontSize: 23, color: 'white'}}>ChatApp</Text>
        <Pressable onPress={Logout} style={{backgroundColor:'#202C33',padding:10,borderRadius:50}}>
        <IonicIcon name='power-outline' size={20} color={'white'} />
        </Pressable>
      </View>
      {
        contacts.length > 0 ? (
          <FlatList
            data={contacts}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => { SetCurrentchat(item, index) }} style={styles.FlatListview}>
                <View style={styles.ProfileView}>
                  <Text>{item.name[0]}</Text>
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
    backgroundColor:'#202C33',
    marginVertical: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    height:heightPercentageToDP('12')
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
    marginLeft: 20
  },
  Header:{
    height: Dimensions.get('screen').height * 0.08,
     backgroundColor: 'black', 
     justifyContent: 'space-between',
     flexDirection:'row',
     alignItems:'center',
     paddingHorizontal:10
  }
})