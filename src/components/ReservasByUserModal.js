import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const ReservasByIdModal = ({ visible, onClose, reservas }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Minhas Reservas</Text>
          <ScrollView>
            {reservas.length > 0 ? (
              reservas.map((reservas, index) => (
                <View key={index} style={styles.reservaItem}>
                  <Text>Nome da Sala: {reservas.nome_da_sala}</Text>
                  <Text>Data: {reservas.data_reserva}</Text>
                  <Text>Horário: {reservas.horario_inicio}</Text>
                </View>
              ))
            ) : (
              <Text>Você não possui reservas.</Text>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: "white" }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  reservaItem: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
});

export default ReservasByIdModal;
