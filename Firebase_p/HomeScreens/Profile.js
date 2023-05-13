import { SafeAreaView, View, Text, Pressable, Image, StyleSheet } from 'react-native';
import tailwind from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useEffect , useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutRoute } from '../utils/Apiroutes';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
export default function UserProfile() {
    let navigation = useNavigation();
    const [currentuser, setcurrentuser] = useState(undefined);
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


      const Logout = async () => {
        const id = currentuser._id;
        const data = await axios.get(`${logoutRoute}/${id}`);
        if(data.status == 200){
          AsyncStorage.clear();
          navigation.navigate("Auth")
        }
      }
    
    
    
  return (

    <SafeAreaView style={tailwind`flex-1 bg-black`}>
      <View style={tailwind`flex-1 items-center justify-center gap-6`}>
        {
            currentuser != undefined && currentuser != null ? (
                <>                
                <View style={styles.ProfileView}>
                <Text style={tailwind`text-black text-5xl`}>{currentuser?.name[0]}</Text>
                </View>
                <View style={tailwind`gap-1 items-center`}>
                  <Text style={tailwind`text-white text-4xl font-bold`}>{currentuser.name}</Text>
                  <Text style={tailwind`text-white text-lg`}>{currentuser.email}</Text>
                </View>
                </>

            ):(
                null
            )
        }
     
      </View>
      <View style={tailwind`flex-1 justify-center gap-8`}>
        <Pressable style={tailwind`flex-row items-center gap-2 px-8 mb-8  `}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={tailwind`text-white text-lg ml-4`}>Settings</Text>
        </Pressable>
        <Pressable style={tailwind`flex-row items-center gap-2 px-8 mb-8`}>
          <Ionicons name="help-buoy-outline" size={24} color="#fff" />
          <Text style={tailwind`text-white text-lg ml-4`}>Help</Text>
        </Pressable>
        <Pressable onPress={Logout} style={tailwind`flex-row items-center gap-2 px-8 mb-8`}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={tailwind`text-white text-lg ml-4`}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    
    ProfileView: {
      backgroundColor: 'white',
      height: 120,
      width: 120,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20
    }
   
  })