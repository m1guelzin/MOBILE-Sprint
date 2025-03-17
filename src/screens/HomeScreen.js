import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Home() {
  return (
    
    <View style={styles.container}>
      <TouchableOpacity style={styles.box}>
        <Image source={require("../img/icone-salas.png")} style={styles.icon} />
        <Text style={styles.text}>Salas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box}>
        <Image source={require("../img/icone-reserva.png")} style={styles.icon} />
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
  box: {
    backgroundColor: "#ccc",
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  icon: {
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
