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
import api from "../axios/axios"; // Certifique-se de que seu 'api' está configurado corretamente com axios
import { useNavigation } from "@react-navigation/native";
import ReservasByIdModal from "../components/ReservasByUserModal"; // Verifique se o caminho e o nome do arquivo estão corretos
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const PerfilScreen = () => {
  const [usuario, setUsuario] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({});
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservas, setReservas] = useState([]); // Estado que armazena as reservas do usuário
  const navigation = useNavigation();

  // Função para obter dados do usuário logado no AsyncStorage
  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("usuarioLogado");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Erro ao recuperar usuário do AsyncStorage:", error);
      return null;
    }
  };

  // Função para carregar as reservas do usuário através da API
  const carregarReservas = useCallback(async () => {
    try {
      const user = await getUser();
      if (user && user.id_usuario) {
        const response = await api.getReservaById(user.id_usuario);
        // Atualiza o estado 'reservas' com os dados da API
        setReservas(response.data.reservas || []);
      }
    } catch (error) {
      console.log(
        "Erro ao carregar reservas:",
        error.response?.data?.message || error.message
      );
    }
  }, []); // Dependências vazias, pois getUser é uma função auxiliar e não muda.

  // Callback que será acionado pelo modal quando uma reserva for deletada
  // Ele recebe o ID da reserva deletada e atualiza o estado 'reservas' localmente.
  const handleReservaDeletada = useCallback((idReservaDeletada) => {
    setReservas((currentReservas) =>
      currentReservas.filter((reserva) => reserva.id_reserva !== idReservaDeletada)
    );
  }, []); // Dependências vazias, pois a função não depende de variáveis externas que mudem.

  // Função para carregar os dados do perfil do usuário e suas reservas
  const carregarPerfil = useCallback(async () => {
    try {
      const usuarioArmazenado = await getUser();
      if (!usuarioArmazenado) {
        Alert.alert("Erro", "Usuário não encontrado. Redirecionando para login.");
        navigation.navigate("Login");
        return;
      }

      const response = await api.getUsuario(usuarioArmazenado.id_usuario);
      setUsuario(response.data.user);
      setDadosEditados(response.data.user);

      await carregarReservas(); // Carrega as reservas junto com o perfil
    } catch (error) {
      console.error(
        "Erro ao carregar perfil:",
        error.response?.data?.message || error.message
      );
      Alert.alert("Erro", "Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  }, [carregarReservas, navigation]); // Depende de carregarReservas e navigation

  // Função para abrir o modal de reservas
  async function abrirModalReservas() {
    setModalVisible(true);
    // Garante que a lista de reservas está atualizada ao ABRIR o modal
    await carregarReservas();
  }

  // Função para salvar as edições do perfil
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
        senha: dadosEditados.senha || usuarioArmazenado.senha, // Mantém a senha antiga se não for alterada
        cpf: dadosEditados.cpf,
      };

      await api.atualizarUsuario(payload);

      setUsuario(dadosEditados); // Atualiza o estado 'usuario' com os dados editados
      setModoEdicao(false); // Sai do modo de edição
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      console.error(
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

  // Efeito para carregar o perfil e as reservas na montagem do componente
  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]); // A dependência agora é a função carregarPerfil (que é estável devido ao useCallback)

  // Exibe um indicador de carregamento enquanto os dados são buscados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Exibe uma mensagem se o perfil não for encontrado após o carregamento
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
          // Modo de Edição
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
          // Modo de Visualização
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
                size={25}
                color="white"
              />
              <Text style={{ color: "white", fontSize: 18 }}> MINHAS RESERVAS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red", marginTop: 5 }]}
              onPress={() => setModoEdicao(true)}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Editar Perfil</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Componente Modal de Reservas */}
      <ReservasByIdModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        reservas={reservas} // As reservas passadas para o modal são as do estado 'reservas' da PerfilScreen
        onReservaDeletada={handleReservaDeletada} // Callback que será chamado ao deletar uma reserva
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