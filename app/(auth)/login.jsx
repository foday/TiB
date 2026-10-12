import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'

const login = () => {
  return (
    <ImageBackground
        source={require('../../assets/bkg_image.png')}
        style={{flex: 1}}
        resizeMode='cover'
    >
        <View style={styles.container}>
      <Text>login</Text>
    </View>
    </ImageBackground>
    
  )
}

export default login

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        // alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'

    }
})