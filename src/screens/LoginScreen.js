import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image
} from "react-native";
import api from "../axios/axios";
import {Ionicons} from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [usuario, setUser] = useState({
    cpf: "",
    senha: "",
    showPassword:true,
  });

  async function handleLogin() {
    await api.postLogin(usuario).then(
      (response) => {
        Alert.alert("OK", response.data.message);
        navigation.navigate("Home");
      },
      (error) => {
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Página Login</Text>
      </View>
      <View style={styles.body}>
        <Image source={require("../img/logo-senai1.png")} style={styles.logo} />
        <TextInput 
          style={styles.input}
          placeholder="CPF"
          value={usuario.cpf}
          keyboardType="numeric" // Exibe apenas o teclado numérico
          maxLength={11} // CPF tem 11 dígitos
          onChangeText={(value) => {
            setUser({ ...usuario, cpf: value.replace(/[^0-9]/g, "") });
          }}
        />
         <View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="SENHA"
    secureTextEntry={usuario.showPassword}
    value={usuario.senha}
    onChangeText={(value) => {
      setUser({ ...usuario, senha: value });
    }}
  />
  <TouchableOpacity
    onPress={() => setUser({ ...usuario, showPassword: !usuario.showPassword })}
    
  >
    <Ionicons name={usuario.showPassword ? "eye-off" : "eye"} size={24} color="gray" />
  </TouchableOpacity>
</View>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        <Text style={styles.naoPossuiConta}>
          Não tem conta?  <Text style={styles.naoPossuiContaLink} onPress={() => navigation.navigate("Cadastro")}>
          Cadastre-se
          </Text>
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>SENAI Franca-SP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  header: {
    width: "100%",
    backgroundColor: "#ccc",
    paddingVertical: 40,
    alignItems: "center",
    marginTop: -400,
    marginBottom: 180,
    top: 0,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  body: {
    width: "60%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 100,

  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  naoPossuiConta: {
    marginTop: 10,
    fontSize: 14,
  },
  naoPossuiContaLink: {
    textDecorationLine: "underline",
    color: "#D32F2F",
    fontWeight: "bold",
  },
  footer: {
    width: "100%",
    backgroundColor: "#ccc",
    paddingVertical: 40,
    alignItems: "center",
  marginTop:190,
    marginBottom: -395,
  },
  footerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    position: "relative", // Permite o posicionamento absoluto do ícone
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingRight: 40, // Garante espaço para o ícone dentro do input
  },
});
