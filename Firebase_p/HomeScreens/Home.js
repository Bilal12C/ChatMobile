import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { allUsersRoute, host, } from '../utils/Apiroutes';
import axios from 'axios';
import { io } from 'socket.io-client';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native-elements';
const Home = () => {
  let naviagtion = useNavigation();
  const [currentuser, setcurrentuser] = useState(undefined);
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const[loading , setLoading] =  useState(false)
  const[showonline,setShowOnline]  = useState('')
  const[datetime,showdatetime] = useState()
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


  

  const SetCurrentchatfun = (item) => {
    naviagtion.navigate('Chat', { user: item, socket: socket , setShowOnline:setShowOnline})
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
      setLoading(true)
      const data = await axios.get(`${allUsersRoute}/${currentuser._id}`);
      console.log(data.data)
      setLoading(false)
      setContacts(data.data)
    }
  }



  const setProfile = () => {
    if(currentuser){
      naviagtion.navigate('UserProfile', { user: currentuser, title:'user' })
    }
    

  }




  

  return (
    <View style={styles.container}>
      <View style={styles.loginBtn}>
        <Text style={{ fontSize: 23, color: 'white' }}>ChatApp</Text>
        <Pressable onPress={setProfile}>
          <IonicIcon name='reorder-four-outline' size={20} color={'white'} />
        </Pressable>
      </View>

     
      {loading ? (
        <View style={styles.contentWait}>
          <ActivityIndicator size={20} color={'black'} />
          <Text style={styles.main}>Please Wait</Text>
        </View>
      ) : null}
      {
        contacts.length > 0 ? (
          <FlatList
            data={contacts}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => { SetCurrentchatfun(item, index) }} style={styles.FlatListview}>
                <Image
                  source={{ uri: item.Image }}
                  style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
                />
                <Text style={[styles.name,{marginLeft:20}]}>{item.name}</Text>
                <Text>{showonline._id == item.id ? showonline : ''}</Text>
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
    // backgroundColor: '#465881',
    marginVertical: 15,
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    // marginHorizontal:15,
    borderRadius: 10,
    // height:heightPercentageToDP('12')
  },
  ActivityIndicator: {
    flex: 1,
    alignSelf: 'center',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    // position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 30,
    zIndex: 1,
    opacity: 0.9,
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
    color: 'black'
  },
  Header: {
    height: Dimensions.get('screen').height * 0.08,
    backgroundColor: 'black',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
  },
  loginBtn: {
    backgroundColor: "black",
    height: 60,
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 10
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
  contentWait: {
    // flex: 1,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 0, 0, 0.43)',
    fontSize: 22,
    justifyContent: 'center',
    // marginTop: -20,
    alignItems: 'center',
  },
  main: {
    color: '#FFF',
    backgroundColor: 'transparent',
    padding: 10,
    fontSize: 16,

    paddingLeft: 0,
  },

})