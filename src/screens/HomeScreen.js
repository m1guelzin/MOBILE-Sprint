import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Home() {
  return (
    
    <View style={styles.container}>
      <TouchableOpacity style={styles.body}>
        <Image source={require("../img/icone-salas.png")} style={styles.icone} />
        <Text style={styles.text}>Salas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.body}>
        <Image source={require("../img/icone-reserva.png")} style={styles.icone} />
        <Text style={styles.text}>Minhas Reservas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    padding: 20,
  },
  body: {
    backgroundColor: "#D3D3D3",
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  icone: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
