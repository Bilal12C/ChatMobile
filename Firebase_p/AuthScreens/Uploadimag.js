import { StyleSheet, Text, View , Image,Pressable, Platform} from 'react-native'
import React from 'react'
import { Button } from 'react-native'
import {  launchImageLibrary } from 'react-native-image-picker'
import { useEffect } from 'react'
import { host } from '../utils/Apiroutes'
import { useState } from 'react'
const Uploadimag = () => {
    
  const [Imagte,setImageUri]=useState('')
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = host + "/api/images/98463ccd5b8c8c6d9c4fb265918c4740"
        console.log("url",url)
        const response = await fetch(url);
        if (response.ok) {
          const imageBlob = await response.blob();
          console.log("image",imageBlob)
          const uri = URL.createObjectURL(imageBlob);
          setImageUri(uri);
        } else {
          console.log('Error fetching image:', response.status);
        }
      } catch (error) {
        console.log('Error fetching image:', error);
      }
    };
    fetchImage();
  }, []);
    const [photo, setPhoto] = React.useState(null);

    // const createFormData = (photo, body = {}) => {
    //     const data = new FormData();
    //     console.log(body)
    //     console.log("phor",photo)
    //     data.append('photo', {
    //       name: photo.fileName,
    //       type: photo.type,
    //       uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    //     });
           
    //     Object.keys(body).forEach((key) => {
    //       console.log("key",key)
    //       data.append(key, body[key]);
    //     });
    //     console.log("data",data)
    //     return data;
    //   };

    const handleChoosePhoto = () => {
        launchImageLibrary({ noData: true }, (response) => {
            console.log(response.assets[0].uri);
            if (response) {
              setPhoto(response.assets[0]);
            }
          });
      };
    
    //   const handleUploadPhoto = () => {
    //     fetch(`${host}/api/upload`, {
    //       method: 'POST',
    //       body: createFormData(photo, { userId: '123' }),
    //     })
    //       .then((response) => response.json())
    //       .then((response) => {
    //         console.log('response', response);
    //       })
    //       .catch((error) => {
    //         console.log('error', error);
    //       });
    //   };
    
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    {photo && (
      <>
        <Image
          source={{ uri: photo.uri }}
          style={{ width: 150, height: 150, borderRadius:50 }}
        />
        {/* <Button  title="Upload Photo" onPress={handleUploadPhoto} /> */}
      </>
    )}
    <Button title="Choose Photo" onPress={handleChoosePhoto} />
  </View>
  )
}

export default Uploadimag

const styles = StyleSheet.create({})