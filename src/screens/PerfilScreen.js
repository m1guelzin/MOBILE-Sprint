import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axios/axios'; // seu axios configurado

const PerfilScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  async function carregarPerfil() {
    let id_usuario = null;

    // Buscar ID do AsyncStorage
    try {
      const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
      if (usuarioLogado) {
        const parsed = JSON.parse(usuarioLogado);
        id_usuario = parsed.id_usuario;
      } else {
        Alert.alert("Erro", "Usuário não encontrado.");
        navigation.navigate("Login");
        return;
      }
    } catch (storageError) {
      console.error("Erro ao ler AsyncStorage:", storageError);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      navigation.navigate("Login");
      return;
    }

    // Chamada da API via getUsuario
    await api.getUsuario(id_usuario).then(
      (response) => {
        setUsuario(response.data.user);
      },
      (error) => {
        console.error('Erro ao carregar perfil:', error);
        Alert.alert("Erro", error.response?.data?.error || "Erro ao carregar perfil");
      }
    ).finally(() => {
      setLoading(false);
    });
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
        <Text style={{ color: 'white' }}>Perfil não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PERFIL DE USUÁRIO</Text>
        </View>

      <View style={styles.card}>

        <View style={styles.fieldLarge}>
          <Text>{usuario.nome}</Text>
        </View>

        <View style={styles.fieldLarge}>
          <Text>{usuario.email}</Text>
        </View>

        <View style={styles.fieldSmall}>
          <Text>{usuario.telefone}</Text>
        </View>

        <View style={styles.fieldSmall}>
          <Text>{usuario.cpf}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MinhasReservas')}>
          <Text>MINHAS RESERVAS ▼</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'red',
    padding: 20,
    alignItems: 'stretch', // Deixa ele ocupar 100% horizontalmente
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center', // Mantém o card no centro
  },
  titleContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 25,
    alignSelf: 'flex-start', // Joga o título pra esquerda
    marginTop: 30,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  fieldLarge: {
    backgroundColor: '#ddd',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
  },
  fieldSmall: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '60%',
  },
  button: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
     width: '60%',
  },
});


export default PerfilScreen;
