import { SafeAreaView, View, Text, Pressable, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import tailwind from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutRoute } from '../utils/Apiroutes';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
export default function UserProfile({ route }) {



  let navigation = useNavigation();

  const Logout = async () => {
      const id = route?.params?.user?._id;
      console.log("sdkfnkj", id)
      const data = await axios.get(`${logoutRoute}/${id}`);
      console.log("data", data)
      if (data.status == 200) {
        AsyncStorage.clear();
        navigation.navigate("Auth")
    }
  }





  return (

    <View style={styles.container}>
      {
        route?.params?.title == 'user' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
            <Image
              source={{ uri: route?.params?.user?.Image }}
              style={{ width: 80, height: 80, borderRadius: 180 / 2, marginTop: 30 }}
            />
            <View style={tailwind`gap-1 ml-5`}>
              <Text style={tailwind`text-white text-xl font-bold`}>{route?.params?.user?.name}</Text>
              <Text style={tailwind`text-white mt-1 text-lg`}>{route?.params?.user?.email}</Text>
            </View>
          </View>
        ) : (
          <View style={{alignItems: 'center', paddingHorizontal: 20 }}>
          <Image
            source={{ uri: route?.params?.user?.Image }}
            style={{ width: 160, height: 160, borderRadius: 160 / 2, marginTop: 30 }}
          />
          <View style={{marginTop:20}} >
            <Text style={{textAlign:'center',fontSize:28,color:'#FFFFFF'}}>{route?.params?.user?.name}</Text>
            <Text style={{color:'silver',textTransform:'capitalize',fontSize:24,marginTop:10}} >{route?.params?.user?.email}</Text>
          </View>
        </View>
        )
      }

      <View style={styles.HorizontalLine} />
      {
        route?.params?.title == 'user' ? (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <Pressable onPress={Logout} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18 }}>
                  <Icon name='ios-log-out-outline' color={'#FFFFFF'} size={25} />
                  <View style={{ marginLeft: 20 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Logout</Text>
                    <Text style={{ color: 'silver', fontSize: 12 }}>byee Comback later!</Text>
                  </View>
                </Pressable>
      </View>

        ) : null
      }

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    // alignItems: 'center',
    // justifyContent: 'center',
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