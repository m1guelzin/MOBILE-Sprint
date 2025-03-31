import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import api from "../axios/axios";
import { Ionicons } from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native"

export default function Cadastro() {
  const navigation = useNavigation();
  const [usuario, setUser] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    showPassword: true,
  });

  async function handleCadastro() {
    await api.postCadastro(usuario).then(
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
      
      <View style={styles.body}>
        <Image source={require("../img/logo-senai1.png")} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="NOME"
          value={usuario.nome}
          onChangeText={(value) => setUser({ ...usuario, nome: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          value={usuario.email}
          onChangeText={(value) => setUser({ ...usuario, email: value })}
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
            onPress={() =>
              setUser({ ...usuario, showPassword: !usuario.showPassword })
            }
          >
            <Ionicons
              name={usuario.showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={usuario.cpf}
          keyboardType="numeric" // Exibe apenas o teclado numérico
          maxLength={11} // CPF tem 11 dígitos
          onChangeText={(value) => {
            setUser({ ...usuario, cpf: value});
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="TELEFONE"
          value={usuario.telefone}
          keyboardType="numeric" // Exibe apenas o teclado numérico
          maxLength={11} // CPF tem 11 dígitos
          onChangeText={(value) => {
            setUser({ ...usuario, telefone: value });
          }}
        />
        <TouchableOpacity onPress={handleCadastro} style={styles.button}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>
        <Text style={styles.Possuiconta}>
          Ja tem conta?{" "}
          <Text
            style={styles.PossuicontaLink}
            onPress={() => navigation.navigate("Login")}
          >
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
    backgroundColor: "#D3D3D3",
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
    backgroundColor: "#D3D3D3",
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 88,
    bottom: 0,
    position: "absolute",
  },
  footerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#D3D3D3",
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 7,
    height: 40,
  },
  passwordInput: {
    flex: 1,
  },
});
