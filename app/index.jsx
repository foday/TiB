import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'

const Home = () => {
  return (
    <ImageBackground
    source={require('../assets/bkg_home.png')}
        style={{flex: 1}}
        resizeMode='cover'
    >
        <View style={styles.container}>
      <Text style={styles.title}>TiB</Text>
      <Text style={{marginTop: 1, }}>Distribution Center 01</Text>
      {/* <Label>Distribution center</Label> */}
      <View style={{container: 'center', alignContent: 'left', justifyContent: "center"}}>
        <View>
        <Text>Running</Text>
      </View>
      <View>
        <Text>Active Alerts</Text>
      </View>
      <View>
        <Text>Work Orders</Text>
      </View>
      <View>
        <Text>Downtime</Text>
      </View>
      </View>
      
    </View>
    </ImageBackground>
    
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // alignContent: 'center',
        justifyContent: 'center',
        
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    }, 
    card: {

    }
})