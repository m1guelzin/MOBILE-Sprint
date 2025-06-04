import React, { useState } from "react";
import {
  Modal,
  View,
  Text, // Certifique-se que está importado
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import api from "../axios/axios";

const ReservasByIdModal = ({ visible, onClose, reservas, onReservaDeletada }) => {
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);

  const handleOpenConfirmDelete = (reserva) => {
    setReservaToDelete(reserva);
    setConfirmDeleteModalVisible(true);
  };

  const handleDeleteReserva = async () => {
    if (reservaToDelete) {
      try {
        await api.deletarReserva(reservaToDelete.id_reserva);
        Alert.alert("Sucesso", "Reserva cancelada com sucesso!");
        setConfirmDeleteModalVisible(false);

        // Chame onReservaDeletada passando o ID da reserva deletada
        if (onReservaDeletada) {
          onReservaDeletada(reservaToDelete.id_reserva);
        }
        setReservaToDelete(null); // Limpe a reserva para deletar
      } catch (error) {
        //console.log("Erro ao deletar reserva:", error);
        Alert.alert(
          "Erro",
          error.response?.data?.error || "Não foi possível cancelar a reserva."
        );
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Minhas Reservas</Text>
          <ScrollView style={styles.scrollView}>
            {reservas.length > 0 ? (
              reservas.map((reserva, index) => (
                <View key={reserva.id_reserva || index} style={styles.reservaItem}>
                  <View>
                    <Text>Nome da Sala: {reserva.nome_da_sala}</Text>
                    <Text>Data: {reserva.data_reserva}</Text>
                    <Text>Horário: {reserva.horario_inicio} ás {reserva.horario_fim}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleOpenConfirmDelete(reserva)}
                    style={styles.deleteButton}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={34} color="red" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              // >>> POTENCIAL CAUSA DO ERRO AQUI <<<
              // Certifique-se de que "Você não possui reservas." está dentro de <Text>
              <Text>Você não possui reservas.</Text>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: "white", fontSize: 18 }}>Fechar</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de Confirmação de Exclusão */}
        <Modal
          visible={confirmDeleteModalVisible}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.confirmModalOverlay}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmTitle}>Confirmar Cancelamento</Text>
              {/* >>> POTENCIAL CAUSA DO ERRO AQUI <<< */}
              {/* Certifique-se de que "Tem certeza que deseja cancelar esta reserva?" está dentro de <Text> */}
              <Text style={styles.confirmText}>
                Tem certeza que deseja cancelar esta reserva?
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
                  onPress={handleDeleteReserva}
                >
                  <Text style={styles.confirmButtonText}>Sim</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ... (seus estilos)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: '80%',
  },
  reservaItem: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    padding: 5,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  confirmTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  confirmButtonCancel: {
    backgroundColor: "red",
  },
  confirmButtonDelete: {
    backgroundColor: "#008000",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ReservasByIdModal;