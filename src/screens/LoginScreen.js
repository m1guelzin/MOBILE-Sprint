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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();
  const [usuario, setUser] = useState({
    cpf: "",
    senha: "",
    showPassword: true,
  });

  async function handleLogin() {
    try {
      const response = await api.postLogin(usuario);
      const { token, user, message } = response.data;
      // Salvar token e dados do usuário no AsyncStorage
      console.log("Token:", token);
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(user));
      Alert.alert("Sucesso", message || "Login realizado com sucesso!");
      navigation.navigate("Home");
    } catch (error) {
      console.log("Erro ao fazer login:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          "Erro ao fazer login. Verifique suas credenciais."
      );
    } 
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Image source={require("../img/logo-senai1.png")} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={usuario.cpf}
          keyboardType="numeric" // Exibe apenas o teclado numérico
          maxLength={11} // CPF tem 11 dígitos
          onChangeText={(value) => {
            setUser({ ...usuario, cpf: value });
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
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        <Text style={styles.naoPossuiConta}>
          Não tem conta?{" "}
          <Text
            style={styles.naoPossuiContaLink}
            onPress={() => navigation.navigate("Cadastro")}
          >
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

  body: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20  ,
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
    borderRadius: 10,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#D3D3D3",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 7,
    height: 40,
  },
  passwordInput: {
    flex: 1,
  },
});
