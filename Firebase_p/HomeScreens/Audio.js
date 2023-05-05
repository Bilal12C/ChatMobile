import { StyleSheet, Text, View, Button, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Platform, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const audioRecorderPlayer = new AudioRecorderPlayer();

const Audio = ({route}) => {
    const [State, SetState] = useState({
        recordSecs: 0,
        recordTime: '00:00:00',
        currentPositionSec: 0,
        currentDurationSec: 0,
        playTime: '00:00:00',
        duration: '00:00:00',
    })
    const [path  , setPath]=useState([])
  const chat = route.params.user;
  const socket = route.params.socket;
   const data = async () =>{
    const data = await AsyncStorage.getItem('key')
    const userdata = JSON.parse(data)
    console.log("chat is",chat._id)
    console.log("userdata",userdata._id)
    console.log("file  to sent",path)
    const result = await socket.current.emit('send-msg',{
        to:chat._id,
        from:userdata._id,
        message:path
    })
    setPath(0)
   }
      
    const onStartRecord = async () => {
        const uri = await audioRecorderPlayer.startRecorder();
        audioRecorderPlayer.addRecordBackListener((e) => {
          SetState({
            ...State,
            recordSecs: e.currentPosition,
            recordTime: audioRecorderPlayer.mmssss(
              Math.floor(e.currentPosition),
            ),
          });
        });
        console.log(`uri: ${uri}`);
        setPath(uri)

    }


    const onStopRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        SetState({
            ...State,
            recordSecs: 0,
        });
        console.log(result);
    };

    const onpauedRecoder = async () => {
        const result = await audioRecorderPlayer.pausePlayer();
        audioRecorderPlayer.removeRecordBackListener();
        console.log("result",result)
    }
    
    useEffect(()=>{
        if(socket.current){
          socket.current.on("msg-recieve",(data)=>{
              console.log("arrived msg",data)
            //   setPath(data)
          })}
      },[path])

    const onStartPlay = async (e) => {
        console.log("on start play",path)
        const msg = await audioRecorderPlayer.startPlayer( );
        audioRecorderPlayer.setVolume(1.0);
        console.log("fsf",msg);
        audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration) {
                audioRecorderPlayer.stopPlayer();
                
            }
            SetState({
                currentPositionSec: e.currentPosition,
                currentDurationSec: e.duration,
                playTime: audioRecorderPlayer.mmssss(e.currentPosition),
                duration: audioRecorderPlayer.mmssss(e.duration),
            });
        });
    };

    
    const onPausePlay = async () => {
        await audioRecorderPlayer.pausePlayer();
    };

    const onStopPlay = async () => {
        console.log('onStopPlay');
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
    };


    return (
        <View style={{ flex: 1,backgroundColor:'black',justifyContent:'center' }}>
            <Text style={{textAlign:'center'}}>{State.recordTime}</Text>
            <Pressable style={{ margin: 10, padding: 20, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={onStartRecord}>
                <Text style={{ color: 'white' }}>Record</Text>
            </Pressable>
            <Pressable
            style={{ margin: 10, padding: 20, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}
                onPress={onStopRecord}
            >
                <Text>Stop</Text>
            </Pressable>
            <Pressable
            style={{ margin: 10, padding: 20, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}
                onPress={onpauedRecoder}
            >
                <Text>onpauedRecoderr</Text>
            </Pressable>
            <Text style={{textAlign:'center'}}>{State.playTime} / {State.duration}</Text>
            <Pressable style={{ margin: 10, padding: 10, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={onStartPlay}>
                <Text>PLAY</Text>
            </Pressable>
            <Pressable
            style={{ margin: 10, padding: 20, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}
                onPress={onPausePlay}
            >
                <Text>Pause</Text>
            </Pressable>
            <Pressable
            style={{ margin: 10, padding: 20, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}
                onPress={onStopPlay}
            >
                <Text>Stop</Text>
            </Pressable>
            <Pressable
            style={{ margin: 10, padding: 20, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}
                onPress={data}
            >
            <Text>send msg</Text>
            </Pressable>

            
        </View>
    )
}

export default Audio

const styles = StyleSheet.create({
    loadingIndicatorContainer: {
        padding: 7,
      },
      container: {
        padding: 5,
        width: 250,
      },
      audioPlayerContainer: {flexDirection: 'row', alignItems: 'center'},
      progressDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      progressDetailsText: {
        paddingHorizontal: 5,
        color: 'grey',
        fontSize: 10,
      },
      progressIndicatorContainer: {
        flex: 1,
        backgroundColor: '#e2e2e2',
      },
      progressLine: {
        borderWidth: 1,
        borderColor: 'black',
      },
})