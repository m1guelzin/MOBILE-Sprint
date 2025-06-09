// src/components/DeleteAccountButton.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, Modal, View, StyleSheet } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axios/axios'; // Verifique se o caminho para o seu axios está correto

// Função handleLogout. Se você já tem uma no '../utils/auth', use-a:
// import { handleLogout } from '../utils/auth';
const handleLogout = async (navigationInstance) => {
  try {
    await AsyncStorage.clear(); // Limpa todos os dados do AsyncStorage
    navigationInstance.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Redireciona para a tela de Login
      })
    );
  } catch (error) {
    console.log("Erro ao fazer logout:", error);
    Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
  }
};


const DeleteAccountButton = ({ style }) => {
  const navigation = useNavigation();
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

  // Lógica para deletar a conta, agora chamada APÓS a confirmação do modal
  const handleDeleteAccountConfirmed = async () => {
    setConfirmDeleteModalVisible(false); // Fecha o modal de confirmação

    try {
      const usuarioLogadoString = await AsyncStorage.getItem("usuarioLogado");
      const usuarioData = JSON.parse(usuarioLogadoString);
      const userId = usuarioData?.id_usuario; 

      if (!userId) {
        Alert.alert("Erro", "ID do usuário não encontrado para exclusão.");
        return;
      }

      await api.deleteUser(userId); 

      Alert.alert("Sucesso", "Sua conta foi deletada com sucesso!");

      handleLogout(navigation); 

    } catch (error) {
      console.log("Erro ao deletar conta:", error.response?.data || error.message);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível deletar sua conta."
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={style}
        onPress={() => setConfirmDeleteModalVisible(true)} // Abre o modal ao pressionar
      >
        <Text style={{ color: "white", fontSize: 16 }}>Deletar Conta</Text>
      </TouchableOpacity>

      {/* Modal de Confirmação para Deletar Conta */}
      <Modal
        visible={confirmDeleteModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmTitle}>Confirmar Exclusão</Text>
            <Text style={styles.confirmText}>
              Tem certeza que deseja DELETAR sua conta? Esta ação é irreversível.
            </Text>
            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonCancel]}
                onPress={() => setConfirmDeleteModalVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonDelete]}
                onPress={handleDeleteAccountConfirmed}
              >
                <Text style={styles.confirmButtonText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Estilos para o Modal de Confirmação - Você pode mover isso para um arquivo de estilos global
// ou para o arquivo de estilos do seu PerfilScreen se preferir,
// mas é bom ter eles definidos onde o modal é usado.
const styles = StyleSheet.create({
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButtonCancel: {
    backgroundColor: 'red',
  },
  confirmButtonDelete: {
    backgroundColor: 'green',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DeleteAccountButton;