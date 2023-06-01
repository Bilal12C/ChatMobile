import { View, Text } from 'react-native'
import React from 'react'
import { SocialIcon } from '@rneui/base'

const SocialIcons = () => {
    return (
        <View style={{marginTop:30}}>
            <View style={{ flexDirection: 'row' , justifyContent:'space-evenly' , width:'100%'  }}>
                <SocialIcon
                    type='twitter'
                />

                <SocialIcon
                    raised={false}
                    type='linkedin'
                />

                <SocialIcon
                    type='facebook'
                />

                <SocialIcon
                    type='instagram'
                />
            </View>
        </View>
    )
}

export default SocialIcons