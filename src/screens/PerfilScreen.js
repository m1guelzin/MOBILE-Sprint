import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from "react-native";
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import ReservasByIdModal from "../components/ReservasByUserModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getUser, getToken } from "../utils/SecureStore";

const PerfilScreen = () => {
  const [usuario, setUsuario] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({});
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservas, setReservas] = useState([]);
  const navigation = useNavigation();

  async function carregarPerfil() {
    try {
      const usuario = await getUser();
      if (!usuario) {
        Alert.alert("Erro", "Usuário não encontrado.");
        navigation.navigate("Login");
        return;
      }

      const response = await api.getUsuario(usuario.id_usuario);
      setUsuario(response.data.user);
      setDadosEditados(response.data.user);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }

  async function abrirModalReservas() {
    setModalVisible(true);
    try {
      const usuario = await getUser();
      const response = await api.getReservaById(usuario.id_usuario);
      setReservas(response.data.reservas || []);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    }
  }

  async function salvarEdicao() {
    try {
      const usuarioArmazenado = await getUser();
      const token = await getToken();

      if (!usuarioArmazenado || !token) {
        Alert.alert("Erro", "Sessão expirada ou inválida.");
        return;
      }

      const payload = {
        id_usuario: usuarioArmazenado.id_usuario,
        nome: dadosEditados.nome,
        telefone: dadosEditados.telefone,
        email: dadosEditados.email,
        senha: usuarioArmazenado.senha, // senha recuperada no login
        cpf: dadosEditados.cpf,
      };

      await api.atualizarUsuario(payload, token);

      setUsuario(dadosEditados); // Atualiza na tela
      setModoEdicao(false);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      Alert.alert("Erro", error.response?.data?.error || "Erro ao salvar os dados");
    }
  }

  useEffect(() => {
    carregarPerfil();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "white" }}>Perfil não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../img/logo-senai1.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonHeader}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHeader}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>PERFIL DE USUÁRIO</Text>
      </View>

      <View style={styles.card}>
        {modoEdicao ? (
          <>
            <TextInput
              style={styles.input}
              value={dadosEditados.nome}
              onChangeText={(text) => setDadosEditados({ ...dadosEditados, nome: text })}
              placeholder="Nome"
            />
            <TextInput
              style={styles.input}
              value={dadosEditados.email}
              onChangeText={(text) => setDadosEditados({ ...dadosEditados, email: text })}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={dadosEditados.telefone}
              onChangeText={(text) => setDadosEditados({ ...dadosEditados, telefone: text })}
              placeholder="Telefone"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={dadosEditados.cpf}
              onChangeText={(text) => setDadosEditados({ ...dadosEditados, cpf: text })}
              placeholder="CPF"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={dadosEditados.senha}
              onChangeText={(text) => setDadosEditados({ ...dadosEditados, senha: text })}
              placeholder="SENHA"
            />

            <TouchableOpacity style={styles.button} onPress={salvarEdicao}>
              <Text style={{ color: "white" }}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#888" }]} onPress={() => setModoEdicao(false)}>
              <Text style={{ color: "white" }}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.fieldLarge}><Text>Nome: {usuario.nome}</Text></View>
            <View style={styles.fieldLarge}><Text>Email: {usuario.email}</Text></View>
            <View style={styles.fieldSmall}><Text>Telefone: {usuario.telefone}</Text></View>
            <View style={styles.fieldSmall}><Text>CPF: {usuario.cpf}</Text></View>

            <TouchableOpacity style={styles.button} onPress={abrirModalReservas}>
              <MaterialCommunityIcons name="google-classroom" size={20} color="black" />
              <Text>  MINHAS RESERVAS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: "#007AFF", marginTop: 20 }]} onPress={() => setModoEdicao(true)}>
              <Text style={{ color: "white" }}>Editar Perfil</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ReservasByIdModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        reservas={reservas}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "red",
    padding: 20,
    alignItems: "stretch",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    marginTop: 10,
  },
  titleContainer: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 25,
    alignSelf: "flex-start",
    marginTop: 50,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  fieldLarge: {
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
  },
  fieldSmall: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: "60%",
  },
  input: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FF2420",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 10,
  },
  header: {
    margin: -20,
    height: 70,
    backgroundColor: "#D3D3D3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 220,
    height: 500,
    resizeMode: "contain",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonHeader: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PerfilScreen;
