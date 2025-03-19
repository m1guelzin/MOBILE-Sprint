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

export default function Cadastro({ navigation }) {
  const [user, setUser] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
  });

  async function handleCadastro() {
    await api.postCadastro(user).then(
      (response) => {
        Alert.alert("Sucesso", response.data.message);
        navigation.navigate("Login");
      },
      (error) => {
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Página Cadastro</Text>
      </View>
      <View style={styles.body}>
        <Image source={require("../img/logo-senai1.png")} style={styles.logo} />
        <TextInput 
          style={styles.input}
          placeholder="NOME"
          value={user.nome}
          onChangeText={(value) => setUser({ ...user, nome: value })}
        />
        <TextInput 
          style={styles.input}
          placeholder="EMAIL"
          value={user.email}
          onChangeText={(value) => setUser({ ...user, email: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="SENHA"
          secureTextEntry
          value={user.senha}
          onChangeText={(value) => setUser({ ...user, senha: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={user.cpf}
          keyboardType="numeric" // Exibe apenas o teclado numérico
          maxLength={11} // CPF tem 11 dígitos
          onChangeText={(value) => {
            setUser({ ...user, cpf: value.replace(/[^0-9]/g, "") });
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="TELEFONE"
          value={user.telefone}
          keyboardType="numeric" // Exibe apenas o teclado numérico
          maxLength={11} // CPF tem 11 dígitos
          onChangeText={(value) => {
            setUser({ ...user, telefone: value.replace(/[^0-9]/g, "") });
          }}
        />
        <TouchableOpacity onPress={handleCadastro} style={styles.button}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>
        <Text style={styles.Possuiconta}>
          Ja tem conta?  <Text style={styles.PossuicontaLink} onPress={() => navigation.navigate("Login")}>
          Login
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
    marginTop: -250,
    marginBottom: 129,
    top: 0,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  body: {
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
  Possuiconta: {
    marginTop: 10,
    fontSize: 14,
  },
  PossuicontaLink: {
    textDecorationLine: "underline",
    color: "#D32F2F",
    fontWeight: "bold",
  },
  footer: {
    width: "100%",
    backgroundColor: "#ccc",
    paddingVertical: 40,
    alignItems: "center",
  marginTop:88
,    marginBottom: -245,
  },
  footerText: {
    fontSize: 30,
    fontWeight: "bold",
  },

});