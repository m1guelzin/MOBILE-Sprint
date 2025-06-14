import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { handleLogout } from "../components/handleLogout";
import { Alert } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Página Home</Text>
        <TouchableOpacity
          style={styles.buttonContainer}
          // Chame a função handleLogout aqui e passe a instância 'navigation'
          onPress={() => {
            handleLogout(navigation);
            Alert.alert("Sucesso", "Você foi desconectado com sucesso!");
          }}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.body}
          onPress={() => navigation.navigate("Salas")}
        >
          <MaterialCommunityIcons
            name="google-classroom"
            size={54}
            color="black"
          />
          <Text style={styles.text}>Salas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.body}
        onPress={()=> navigation.navigate("Perfil")}>
          <Image
            source={require("../img/icone-reserva.png")}
            style={styles.icone}
          />
          <Text style={styles.text}>Minhas Reservas</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>SENAI Franca-SP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "red",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1,
  },
  body: {
    backgroundColor: "#D3D3D3",
    width: 160,
    height: 160,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: -80,
  },
  icone: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  text: {
    marginTop: 5,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#D3D3D3",
    width: "100%",
    height: 80,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginLeft: 50,
  },
  buttonContainer: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    width: "100%",
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    marginTop: 190,
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
  },
  footerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
