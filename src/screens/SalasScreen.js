import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import api from "../axios/axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [horarios, setHorarios] = useState([
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ]);

  async function getAllSalas() {
    try {
      setLoading(true);
      const response = await api.getAllSalas();  
      setSalas(response.data.salas);
    } catch (error) {
      console.log(error.response?.data?.error || "Erro ao buscar salas");
    } finally {
      setLoading(false);
    }
  }

  function abrirModalComHorarios(sala) {
    setSalaSelecionada(sala);
    setModalVisible(true);
  }

  function onDateSelected(event, selectedDate) {
    const currentDate = selectedDate || diaSelecionado;
    setShowDatePicker(false);
    if (currentDate) {
      setDiaSelecionado(currentDate);
      getAllSalas(); // Só busca as salas depois de escolher o dia
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../img/logo-senai1.png")} style={styles.logo} />
        <Text style={styles.headerText}>Salas da Instituição</Text>
      </View>

      {/* Botão para selecionar data */}
      <View style={styles.selectDateContainer}>
        <TouchableOpacity 
          style={styles.selectDateButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.selectDateButtonText}>
            {diaSelecionado 
              ? `Selecionado: ${diaSelecionado.getDate()}/${diaSelecionado.getMonth()+1}/${diaSelecionado.getFullYear()}`
              : "Escolher Data 📅"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={diaSelecionado || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={onDateSelected}
        />
      )}

      {/* Lista de Salas */}
      <View style={styles.container}>
        {!diaSelecionado ? (
          <Text style={styles.selectDateMessage}>Selecione uma data para ver as salas.</Text>
        ) : loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : salas.length === 0 ? (
          <Text style={styles.emptyMessage}>Nenhuma sala disponível.</Text>
        ) : (
          <FlatList
            data={salas}
            keyExtractor={(item) => item.id_salas.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.salaCard}
                onPress={() => abrirModalComHorarios(item)}
              >
                <View style={styles.salaIconContainer}>
                  <MaterialCommunityIcons
                    name="google-classroom"
                    size={40}
                    color="black"
                  />
                </View>
                <View style={styles.salaInfo}>
                  <Text style={styles.salaNome}>{item.nome_da_sala}</Text>
                  <Text style={styles.salaDetalhe}>Capacidade: {item.capacidade} pessoas</Text>
                  <Text style={styles.salaDetalhe}>Local: {item.localizacao}</Text>
                  <Text style={styles.salaDetalhe}>Equipamentos: {item.equipamentos}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Modal de Horários */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {salaSelecionada?.nome_da_sala || "Sala"} - {diaSelecionado ? 
                  `${diaSelecionado.getDate()}/${diaSelecionado.getMonth()+1}/${diaSelecionado.getFullYear()}` : ""}
              </Text>
            </View>
            
            <Text style={styles.horariosTitulo}>Horários Disponíveis</Text>
            
            <View style={styles.horariosGrid}>
              {horarios.map((horario, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.horarioItem}
                  onPress={() => {
                    alert(`Horário ${horario} selecionado para reserva`);
                  }}
                >
                  <Text style={styles.horarioText}>{horario}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FF0000",
  },
  header: {
    height: 80,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  selectDateContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  selectDateButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  selectDateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  selectDateMessage: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    color: "#FFF",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    color: "#FFF",
  },
  salaCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },
  salaIconContainer: {
    marginRight: 15,
    justifyContent: "center",
  },
  salaInfo: {
    flex: 1,
  },
  salaNome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  salaDetalhe: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: "80%",
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  horariosTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  horariosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  horarioItem: {
    width: "30%",
    backgroundColor: "#e1f5fe",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  horarioText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#D32F2F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  logo: {
    width: 250,
    height: 150,
  },
});
