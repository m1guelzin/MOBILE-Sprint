import React from "react";
import { View, StyleSheet, Text } from "react-native";


export default function HeaderPrincipal({ children }) {
  return (
    <View style = {{flex:1}}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>
      </View>
     
      {/* Conteudo Principal */}
      <View>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#D3D3D3",
    width: "100%",
    height: 80,
    justifyContent: "center",      
    alignItems: "center", 
    
  },
  headerText:{
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical:10,
  },
});