import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Pressable, FlatList } from 'react-native'
import { useEffect } from 'react'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recieveMessageRoute, sendMessageRoute } from '../utils/Apiroutes';
import axios from 'axios';
import { useState, useRef } from 'react';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native-elements';
const Chat = ({ route, navigation , setchecstate }) => {


  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chat = route.params.user;
  const socket = route.params.socket;
  const [arrivalmessages, setArrivalmsg] = useState(undefined)

  useEffect(() => {
    const GetAllMessages = async () => {
      if (chat) {
        const sggh = JSON.stringify(chat)
        const data = await AsyncStorage.getItem('key')
        const userdata = JSON.parse(data)
        const respose = await axios.post(recieveMessageRoute, {
          from: userdata._id,
          to: chat._id
        })
        setMessages(respose.data)
      }

    }
    GetAllMessages();
  }, [chat])



  const handleSendMsg = async () => {
    const data = await AsyncStorage.getItem('key')
    const userdata = JSON.parse(data)
    const Info = await axios.post(sendMessageRoute, {
      from: userdata._id,
      to: chat._id,
      message: msg,
    });

    socket.current.emit('send-msg', {
      to: chat._id,
      from: userdata._id,
      message: msg,
    })
    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg, })
    setMessages(msgs)
    setMsg('')
  };







  const flatListRef = useRef(null);

  const handleContentSizeChange = () => {
    flatListRef.current.scrollToEnd();
  };


 


  










  

  useEffect(() => {
    arrivalmessages && setMessages((prev) => [...prev, arrivalmessages])
  }, [arrivalmessages])

  const onchangevalue = (val) => {
    if (val != '') {
    setMsg(val)
    }
    else {
      setMsg('')
    }

  }


  const navigateProfile = () => {
    navigation.navigate('UserProfile', { user: chat, title: 'chatuser' })
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        console.log("arrived msg", data)
        setArrivalmsg({ fromSelf: false, message: data });
      })
    }
  }, [])


  return (
    <View style={{ flex: 1, backgroundColor: '#003f5c' }}>
      <View style={styles.Header}>
        <View style={{flexDirection:'row'}}>
          <Image
            source={{ uri: chat.Image }}
            style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
          />
          <View style={{marginLeft:20}}>
            <Text style={{ color: 'white', fontSize: 20, }}>{chat.name}</Text>
          </View>
        </View>

        <IonicIcon onPress={navigateProfile} name='information-circle-outline' size={20} color={'#FFFFFF'} />
      </View>


      {
        messages.length > 0 ? (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={messages}
            style={{ marginBottom: 40 }}
            onContentSizeChange={handleContentSizeChange}
            ref={flatListRef}
            renderItem={({ item, index }) => (
              <Pressable key={item.id}>
                <View style={item.fromSelf == true ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }}>
                  <Text style={item.fromSelf == true ? styles.sendmessage : styles.recievemessage}>{item.message}</Text>
                </View>
              </Pressable>
            )}
          />

        ) : (
          null
        )

      }


      <View style={styles.ChatInputView}>
        <TextInput
          onFocus={() => console.log("dfsf")}
          value={msg}
          style={styles.ChatInputtext}
          placeholder={'send message'}
          placeholderTextColor={'white'}
          onChangeText={(value) => { onchangevalue(value) }}
        />
        <Pressable onPress={handleSendMsg} style={styles.SendIcon}  >
          <IonicIcon name={'send-sharp'} size={20} color={'white'} />
        </Pressable>
      </View>
      <View>
      </View>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
  Header: {
    backgroundColor: '#202C33',
    height: Dimensions.get('screen').height * 0.08,
    width: '100%',
    paddingHorizontal: 10,
    // paddingVertical: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ChatInputView: {
    paddingVertical: 10,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',

  },
  SendIcon: {
    backgroundColor: 'black',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    padding: 10,
    marginRight: 10,
    height: 40,
  },
  VoiceSend: {
    backgroundColor: '#075E54',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    height: 50,
    width: 50,
  },
  sendmessage: {
    backgroundColor: '#075E54',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    color: 'white'
  },
  recievemessage: {
    backgroundColor: '#202C33',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    color: 'white'
  },
  ChatInputtext: {
    backgroundColor: '#465881',
    paddingHorizontal: 12,
    color: 'white',
    borderColor: '#465881',
    borderWidth: 1,
    borderRadius: 20,
    height: 40,
    flex: 1,
  },
  viewBar: {
    backgroundColor: 'red',
    height: 30,
    width: Dimensions.get('screen').width - 20
  },
  viewBarPlay: {
    backgroundColor: 'black',
    height: 30,
    width: 50,
  },
  viewBarWrapper: {
    marginTop: 28,
  },
})