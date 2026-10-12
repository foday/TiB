import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const rootlayout = () => {
  return (
   <Stack screenOptions={{
    headerStyle: {backgroundColor: '#091728'},
    headerTintColor: "#fff"
   }}>
     <Stack.Screen name='index' options={{title: "TiB Distribution Center 1"}} />
     <Stack.Screen name="auth" options={{title: "Auth"}}/>

    <Stack.Screen name="warningDetails" options={{title: "Warning Details"}}/>
    <Stack.Screen name="criticalAlert" options={{title: "Critical Alerts"}}/>
    <Stack.Screen name="reRouteInventory" options={{title: "Re-route Inventory"}} />
    <Stack.Screen name="workOrder" options={{title: "Work Order"}}/>
    <Stack.Screen name="alerts" options={{title: "Alerts"}}/>
   </Stack>
   
      )
}

export default rootlayout

const styles = StyleSheet.create({})