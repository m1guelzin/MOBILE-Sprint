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
import { useNavigation, CommonActions } from "@react-navigation/native";
import ReservasByIdModal from "../components/ReservasByUserModal";
import DeleteAccountButton from '../components/DeleteAccountButton'; // <--- VERIFIQUE O CAMINHO REAL

const handleLogout = async (navigationInstance) => {
  try {
    await AsyncStorage.clear();
    navigationInstance.dispatch( // reinicia a navegação do aplicativo
      CommonActions.reset({ // novo estado de navegação
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
  }
};


const PerfilScreen = () => {
  const [usuario, setUsuario] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({});
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservas, setReservas] = useState([]);
  const navigation = useNavigation();

  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("usuarioLogado");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.log("Erro ao recuperar usuário do AsyncStorage:", error);
      return null;
    }
  };

  const carregarReservas = useCallback(async () => {
    try {
      const user = await getUser();
      if (user && user.id_usuario) {
        const response = await api.getReservaById(user.id_usuario);
        setReservas(response.data.reservas || []);
      }
    } catch (error) {
      //console.log(
      //  "Erro ao carregar reservas:",
      //  error.response?.data?.message || error.message
      //);
    }
  }, []);

  const handleReservaDeletada = useCallback((idReservaDeletada) => {
    setReservas((currentReservas) =>
      currentReservas.filter((reserva) => reserva.id_reserva !== idReservaDeletada)
    );
  }, []);

  const carregarPerfil = useCallback(async () => {
    try {
      const usuarioArmazenado = await getUser();
      if (!usuarioArmazenado) {
        Alert.alert("Erro", "Usuário não encontrado. Redirecionando para login.");
        handleLogout(navigation); // Usa handleLogout
        return;
      }

      const response = await api.getUsuario(usuarioArmazenado.id_usuario);
      setUsuario(response.data.user);
      setDadosEditados(response.data.user);

      await carregarReservas();
    } catch (error) {
      console.log(
        "Erro ao carregar perfil:",
        error.response?.data?.message || error.message
      );
      Alert.alert("Erro", "Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  }, [carregarReservas, navigation]);

  async function abrirModalReservas() {
    setModalVisible(true);
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
        handleLogout(navigation); 
        return;
      }

      const payload = {
        id_usuario: usuarioArmazenado.id_usuario,
        nome: dadosEditados.nome,
        telefone: dadosEditados.telefone,
        email: dadosEditados.email,
        senha: dadosEditados.senha || usuarioArmazenado.senha,
        cpf: usuarioArmazenado.cpf,
      };

      await api.atualizarUsuario(payload);

      const updatedUser = { ...usuarioArmazenado, ...dadosEditados };
      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(updatedUser));
      setUsuario(updatedUser);
      
      setModoEdicao(false);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      console.log(
        "Erro ao salvar edição:",
        error.response?.data?.error || error.message
      );
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          "Erro ao salvar os dados. Verifique sua conexão ou tente novamente."
      );
    }
  }

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

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
            onPress={() => handleLogout(navigation)}
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
              value={dadosEditados.senha}
              onChangeText={(text) =>
                setDadosEditados({ ...dadosEditados, senha: text })
              }
              placeholder="SENHA (deixe em branco para manter a atual)"
              secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={salvarEdicao}>
              <Text style={{ color: "white", fontSize: 18}}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#888" }]}
              onPress={() => setModoEdicao(false)}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.fieldDisplay}>
              <Text>Nome: {usuario.nome}</Text>
            </View>
            <View style={styles.fieldDisplay}>
              <Text>Email: {usuario.email}</Text>
            </View>
            <View style={styles.fieldDisplay}>
              <Text>Telefone: {usuario.telefone}</Text>
            </View>
            <View style={styles.fieldDisplay}>
              <Text>CPF: {usuario.cpf}</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={abrirModalReservas}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Minhas Reservas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red", marginTop: 5 }]}
              onPress={() => setModoEdicao(true)}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Editar Perfil</Text>
            </TouchableOpacity>
            
            
            <DeleteAccountButton 
              style={[styles.buttondeleteacc, {marginTop: 25 }]} 
            />
          </>
        )}
      </View>

      <ReservasByIdModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        reservas={reservas}
        onReservaDeletada={handleReservaDeletada}
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
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 100,
    flexGrow: 1,
    justifyContent: 'center',
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
    fontSize: 22,
  },
  fieldDisplay: {
    backgroundColor: "#ddd",
    padding: 25,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
  },
  input: {
    backgroundColor: "#ddd",
    padding: 25,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  buttondeleteacc: {
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  header: {
    margin: -20,
    height: 85,
    backgroundColor: "#D3D3D3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 250,
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
    fontSize: 17
  },
});

export default PerfilScreen;