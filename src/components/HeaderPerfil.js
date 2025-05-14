import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";


const HeaderPerfil = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Image
        source={require("../img/logo-senai1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "#D3D3D3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 250,
    height: 500,
    resizeMode: "contain",
  },
    buttonsContainer: {
    flexDirection: "row", // Alinha os botões em linha reta
    alignItems: "center", // Alinha verticalmente os botões no centro
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 10, // Espaço entre os botões
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },  
});

export default HeaderPerfil;
