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

export default function Login({ navigation }) {
  const [usuario, setUser] = useState({
    cpf: "",
    senha: "",
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
      <View style={styles.formWrapper}>
        <Image source={require("../img/logo-senai1.png")} style={styles.logo} />
        <TextInput 
          style={styles.input}
          placeholder="CPF"
          value={usuario.cpf}
          onChangeText={(value) => {
            setUser({ ...usuario, cpf: value });
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="SENHA"
          secureTextEntry
          value={usuario.senha}
          onChangeText={(value) => {
            setUser({ ...usuario, senha: value });
          }}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>
          Não tem conta?  <Text style={styles.registerLink} onPress={() => navigation.navigate("Cadastro")}>
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
    marginTop: -270,
    marginBottom: 230,
    top: 0,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  formWrapper: {
    width: "60%",
    backgroundColor: "#fff",
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
  registerText: {
    marginTop: 10,
    fontSize: 14,
  },
  registerLink: {
    textDecorationLine: "underline",
    color: "#D32F2F",
    fontWeight: "bold",
  },
  footer: {
    width: "100%",
    backgroundColor: "#ccc",
    paddingVertical: 40,
    alignItems: "center",
  marginTop:120,
    marginBottom: -265,
  },
  footerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
