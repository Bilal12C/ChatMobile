import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Pressable, FlatList } from 'react-native'
import { useEffect } from 'react'
import React from 'react'
import { Platform, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recieveMessageRoute, sendMessageRoute } from '../utils/Apiroutes';
import axios from 'axios';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useState, useRef } from 'react';
import IonicIcon from 'react-native-vector-icons/Ionicons';
const screenWidth = Dimensions.get('screen').width;
const audioRecorderPlayer = new AudioRecorderPlayer();
const Chat = ({ route, navigation }) => {


  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chat = route.params.user;
  const socket = route.params.socket;
  const [arrivalmessages, setArrivalmsg] = useState(undefined)
  const [icon, SetIcon] = useState(false)

  const [State, SetState] = useState({
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  })
  const [path, setPath] = useState([])
  const [isRecording, setRecording] = useState(false)
  let [PlayWidth, setPlaywidth] = useState(0)


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
        console.log("respose", respose)
        setMessages(respose.data)
      }

    }
    // GetAllMessages();
  }, [chat])



  const handleSendMsg = async () => {
    const data = await AsyncStorage.getItem('key')
    const userdata = JSON.parse(data)
    // const Info = await axios.post(sendMessageRoute, {
    //   from: userdata._id,
    //   to: chat._id,
    //   message: msg,
    // });

    socket.current.emit('send-msg', {
      to: chat._id,
      from: userdata._id,
      message: msg,
      type: 'msg'
    })
    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg, type: 'msg' })
    setMessages(msgs)
    console.log("messages", messages)
    setMsg('')
    SetIcon(false)
  };



  const SendVoice = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    SetState({
      ...State,
      recordSecs: 0,
    });
    setRecording(false)
    const data = await AsyncStorage.getItem('key')
    const userdata = JSON.parse(data)
    socket.current.emit('send-msg', {
      to: chat._id,
      from: userdata._id,
      message: path,
      type: 'audio'
    })
    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: path, type: 'audio' })
    console.log("message", msgs)
    setMessages(msgs)
  }


  const flatListRef = useRef(null);

  const handleContentSizeChange = () => {
    flatListRef.current.scrollToEnd();
  };

  useEffect(() => {
    if (!PlayWidth) {
      PlayWidth = 0;
    }
  }, [])

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on("msg-recieve", (data) => {
  //       console.log("arrived msg", data)
  //       setArrivalmsg({ fromSelf: false, message: data.message, type: data.type });
  //     })
  //   }
  // }, [])

  const onStartPlay = async (audio) => {
    try {
      console.log("path",audio)
      const msg = await audioRecorderPlayer.startPlayer(audio.message);
      audioRecorderPlayer.setVolume(1.0)
      console.log("adad", msg);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          console.log('finished');
          audioRecorderPlayer.stopPlayer();
        }
        SetState({
          currentPositionSec: e.currentPosition,
          currentDurationSec: e.duration,
          playTime: audioRecorderPlayer.mmssss(e.currentPosition),
          duration: audioRecorderPlayer.mmssss(e.duration),
        });
      });

    } catch (error) {
      alert("error", error)
    }

  };

  const onStartRecord = async () => {
    setRecording(true)
    const uri = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      SetState({
        ...State,
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        ),
      });
      console.log(`uri: ${uri}`);
      setPath(uri)
      // setMessages({ fromSelf: true, message: uri, type: 'audio' })
      // let ScreenPlay = (e.currentPosition / e.duration) * (screenWidth - 20);
      // setPlaywidth(ScreenPlay);
    });

  }



  useEffect(() => {
    arrivalmessages && setMessages((prev) => [...prev, arrivalmessages])
  }, [arrivalmessages])

  const onchangevalue = (val) => {
    if (val != '') {
      setMsg(val)
      SetIcon(true)
    }
    else {
      setMsg('')
      SetIcon(false)
    }

  }


  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={styles.Header}>
        <IonicIcon onPress={() => navigation.navigate('Home')} style={{ paddingRight: 10 }} name='arrow-back-outline' size={20} color={'white'} />
        <Text style={{ color: 'white', fontSize: 20 }}>{chat.name}</Text>
        <Pressable onPress={() => navigation.navigate('Audio', { user: chat, socket: socket })} style={{ justifyContent: 'flex-end' }}>
          <Text style={{ color: 'white' }}>Send Voice note</Text>
        </Pressable>
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

                {
                  item.message != '' ? (
                    item.type == 'msg' ? (
                      <View style={item.fromSelf == true ? { alignSelf: 'flex-start' } : { alignSelf: 'flex-end' }}>
                        <Text style={item.fromSelf == true ? styles.sendmessage : styles.recievemessage}>{item.message}</Text>
                      </View>
                    ) : (
                      <View style={item.fromSelf == true ? { alignSelf: 'flex-start', backgroundColor: '#075E54', height: 40, width: 150, flexDirection: 'row', margin: 20, justifyContent: 'space-around', alignItems: 'center' } : { alignSelf: 'flex-end', backgroundColor: '#075E54', height: 40, width: 150, flexDirection: 'row', margin: 20, justifyContent: 'space-around', alignItems: 'center' }}>
                        <IonicIcon onPress ={()=>onStartPlay(item)} style={{ paddingRight: 10 }} name='play' size={20} color={'white'} />
                        <Text>{State.playTime} / {State.duration}</Text>
                      </View>
                    )
                  ) : (null)}

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
          placeholder={isRecording ? State.recordTime : 'send message'}
          placeholderTextColor={'white'}
          onChangeText={(value) => { onchangevalue(value) }}
        />
        <Pressable style={isRecording ? styles.VoiceSend : styles.SendIcon} onLongPress={onStartRecord} onPressOut={isRecording ? SendVoice : handleSendMsg}  >
          <IonicIcon name={icon ? 'send-sharp' : 'mic'} size={20} color={'white'} />
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
    height: Dimensions.get('screen').height * 0.07,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    backgroundColor: '#075E54',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    padding: 10,
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
    borderRadius: 20
  },
  recievemessage: {
    backgroundColor: '#202C33',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  ChatInputtext: {
    backgroundColor: '#455A64',
    paddingHorizontal: 12,
    color: 'white',
    borderColor: 'black',
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