import React, { useEffect, useState, useCallback } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import ReservasByIdModal from "../components/ReservasByUserModal"; // Verifique o nome do arquivo, está como 'ReservasByUserModal'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const PerfilScreen = () => {
  const [usuario, setUsuario] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({});
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservas, setReservas] = useState([]);
  const navigation = useNavigation();

  // Funções locais para obter dados do AsyncStorage
  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("usuarioLogado");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error);
      return null;
    }
  };

  // Não precisamos de getToken aqui, pois o interceptor do Axios já injeta o token automaticamente.
  // const getToken = async () => { /* ... */ };

  // Função para carregar as reservas do usuário
  const carregarReservas = useCallback(async () => {
    // console.log("carregarReservas: Recarregando lista de reservas..."); // Desativei para reduzir logs
    try {
      const user = await getUser();
      if (user && user.id_usuario) {
        const response = await api.getReservaById(user.id_usuario);
        setReservas(response.data.reservas || []);
      }
    } catch (error) {
      console.log("carregarReservas: Erro ao carregar reservas:", error.response?.data?.message || error.message);
      
    }
  }, []); // Dependências vazias: esta função não depende de nada que mude entre renders

  // Função para carregar o perfil do usuário
  const carregarPerfil = useCallback(async () => {
    // console.log("carregarPerfil: Carregando dados do perfil..."); // Desativei para reduzir logs
    try {
      const usuario = await getUser();
      if (!usuario) {
        Alert.alert("Erro", "Usuário não encontrado. Redirecionando para login.");
        navigation.navigate("Login");
        return;
      }

      const response = await api.getUsuario(usuario.id_usuario);
      setUsuario(response.data.user);
      setDadosEditados(response.data.user);

      await carregarReservas(); // Carrega as reservas junto com o perfil
    } catch (error) {
      console.error("carregarPerfil: Erro ao carregar perfil:", error.response?.data?.message || error.message);
      Alert.alert("Erro", "Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  }, [carregarReservas, navigation]); // Depende de carregarReservas e navigation

  async function abrirModalReservas() {
    setModalVisible(true);
    // Garante que a lista de reservas está atualizada ao ABRIR o modal
    await carregarReservas();
  }

  async function salvarEdicao() {
    try {
      const usuarioArmazenado = await getUser();

      if (!usuarioArmazenado) {
        Alert.alert(
          "Erro",
          "Sessão expirada ou inválida. Por favor, faça login novamente."
        );
        navigation.navigate("Login");
        return;
      }

      const payload = {
        id_usuario: usuarioArmazenado.id_usuario,
        nome: dadosEditados.nome,
        telefone: dadosEditados.telefone,
        email: dadosEditados.email,
        senha: dadosEditados.senha || usuarioArmazenado.senha,
        cpf: dadosEditados.cpf,
      };

      // console.log("Dados enviados para atualização:", payload); // Desativei para reduzir logs

      await api.atualizarUsuario(payload);

      setUsuario(dadosEditados);
      setModoEdicao(false);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar edição:", error.response?.data?.error || error.message);
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          "Erro ao salvar os dados. Verifique sua conexão ou tente novamente."
      );
    }
  }

  // Efeito para carregar o perfil (e as reservas) na montagem do componente
  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]); // A dependência agora é a função carregarPerfil (estável devido ao useCallback)

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
              onChangeText={(text) =>
                setDadosEditados({ ...dadosEditados, nome: text })
              }
              placeholder="Nome"
            />
            <TextInput
              style={styles.input}
              value={dadosEditados.email}
              onChangeText={(text) =>
                setDadosEditados({ ...dadosEditados, email: text })
              }
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={dadosEditados.telefone}
              onChangeText={(text) =>
                setDadosEditados({ ...dadosEditados, telefone: text })
              }
              placeholder="Telefone"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={dadosEditados.cpf}
              onChangeText={(text) =>
                setDadosEditados({ ...dadosEditados, cpf: text })
              }
              placeholder="CPF"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={dadosEditados.senha}
              onChangeText={(text) =>
                setDadosEditados({ ...dadosEditados, senha: text })
              }
              placeholder="SENHA"
              secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={salvarEdicao}>
              <Text style={{ color: "white" }}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#888" }]}
              onPress={() => setModoEdicao(false)}
            >
              <Text style={{ color: "white" }}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.fieldLarge}>
              <Text>Nome: {usuario.nome}</Text>
            </View>
            <View style={styles.fieldLarge}>
              <Text>Email: {usuario.email}</Text>
            </View>
            <View style={styles.fieldSmall}>
              <Text>Telefone: {usuario.telefone}</Text>
            </View>
            <View style={styles.fieldSmall}>
              <Text>CPF: {usuario.cpf}</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={abrirModalReservas}
            >
              <MaterialCommunityIcons
                name="google-classroom"
                size={20}
                color="white"
              />
              <Text style={{ color: "white" }}> MINHAS RESERVAS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red", marginTop: 5 }]}
              onPress={() => setModoEdicao(true)}
            >
              <Text style={{ color: "white" }}>Editar Perfil</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ReservasByIdModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        reservas={reservas}
        onReservaDeletada={carregarReservas}
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
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
  },
  input: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "red",
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