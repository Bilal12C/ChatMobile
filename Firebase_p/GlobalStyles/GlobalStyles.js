import { StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

module.exports = StyleSheet.create({
    KeyboardAvoidingView:{
        flex:1,
        paddingHorizontal:20,
        backgroundColor:'black'
    },
    SectionStyle:{
        flexDirection: 'row',
        marginTop: 10,
        margin: 5,
        justifyContent:'center'
    },
    inputStyle: {
        height:'80%',
        width:'100%',
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
      },
      
      buttonStyle: {
        backgroundColor: '#7DE24E',
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        alignItems: 'center',
        justifyContent:'center',
        borderRadius: 30,
        marginTop: 20,
        marginBottom: 8,
        height:heightPercentageToDP('6'),
        width:widthPercentageToDP('70'),
      },
      buttonTextStyle: {
        color: '#FFFFFF',
        fontSize: 16,
      },
      MainView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:10,
        backgroundColor:'black'
      }
});