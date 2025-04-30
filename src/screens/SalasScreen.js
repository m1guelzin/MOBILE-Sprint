import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../axios/axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Salas() {
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);
  const [modalHorariosVisible, setModalHorariosVisible] = useState(false);
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  async function buscarSalasDisponiveis(data) {
    if (!data) {
      setSalasDisponiveis([]);
      return;
    }
    try {
      const dataFormatada = `${data.getFullYear()}-${String(
        data.getMonth() + 1
      ).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
      const response = await api.getSalasDisponiveisPorData(dataFormatada);
      setSalasDisponiveis(response.data.salas_disponiveis);
    } catch (error) {
      console.log("Erro ao buscar salas disponíveis:", error.response?.data?.error || "Erro ao buscar salas");
      setSalasDisponiveis([]);
    }
  }

  async function buscarHorariosDisponiveis(sala, data) {
    if (!sala || !data) {
      setHorariosDisponiveis([]);
      return;
    }
    try {
      const dataFormatada = `${data.getFullYear()}-${String(
        data.getMonth() + 1
      ).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
      const response = await api.getSalasHorariosDisponiveis(dataFormatada);
      const salaHorarios = response.data.salas.find((s) => s.id_sala === sala.id_salas);
      setHorariosDisponiveis(salaHorarios?.horarios_disponiveis || []);
    } catch (error) {
      console.log(error.response?.data?.error || "Erro ao buscar horários");
      setHorariosDisponiveis([]);
    }
  }

  function abrirModalComHorarios(sala) {
    setSalaSelecionada(sala);
    buscarHorariosDisponiveis(sala, diaSelecionado);
    setModalHorariosVisible(true);
  }

  function onDateSelected(event, selectedDate) {
    const currentDate = selectedDate || diaSelecionado;
    setShowDatePicker(false);
    if (currentDate) {
      setDiaSelecionado(currentDate);
      buscarSalasDisponiveis(currentDate);
    }
  }

  function selecionarHorario(horario) {
    setHorarioSelecionado(horario);
    setModalHorariosVisible(false);
    setModalConfirmacaoVisible(true);
  }

  async function criarNovaReserva() {

    const [horaInicio, minutoInicio] = horarioSelecionado.inicio.split(':').map(Number);
    const horaFim = String(horaInicio + 1).padStart(2, '0');
    const dataFormatada = `${diaSelecionado.getFullYear()}-${String(
      diaSelecionado.getMonth() + 1
    ).padStart(2, "0")}-${String(diaSelecionado.getDate()).padStart(2, "0")}`;

    try {
      const reserva = {
        id_usuario: 1, // Substitua pelo ID do usuário logado
        fkid_salas: salaSelecionada.id_salas,
        data_reserva: dataFormatada,
        horario_inicio: `${horarioSelecionado.inicio}:00`,
        horario_fim: `${horaFim}:${String(minutoInicio).padStart(2, '0')}:00`,
      };
      const response = await api.criarReserva(reserva);
      Alert.alert(response.data.message);
      setModalConfirmacaoVisible(false);
      setSalaSelecionada(null);
      setDiaSelecionado(null);
      setHorariosDisponiveis([]);
      setHorarioSelecionado(null);
    } catch (error) {
      console.log(error.response?.data?.error);
      Alert.alert(error.response.data.error);
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header da tela */}
      <View style={styles.header}>
        <Image source={require("../img/logo-senai1.png")} style={styles.logo} resizeMode="contain" />
        <View>
          <View>
            <MaterialCommunityIcons name="account-circle" size={45} color="#555" />
          </View>
        </View>
      </View>

      {/* Seção para selecionar a data */}
      <View style={styles.selectDateContainer}>
        <TouchableOpacity style={styles.selectDateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.selectDateButtonText}>
            {diaSelecionado
              ? `Selecionado: ${diaSelecionado.getDate()}/${
                  diaSelecionado.getMonth() + 1
                }/${diaSelecionado.getFullYear()}`
              : "Escolher Data 📅"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={diaSelecionado || new Date()}
          mode="date"
          onChange={onDateSelected}
        />
      )}

      {/* Lista de salas disponíveis */}
      <View style={styles.container}>
        {!diaSelecionado ? (
          <Text style={styles.Messages}>
            Selecione uma data para ver as salas disponíveis.
          </Text>
        ) : salasDisponiveis.length === 0 ? (
          <Text style={styles.Messages}>
            Nenhuma sala disponível para esta data.
          </Text>
        ) : (
          <FlatList
            data={salasDisponiveis}
            keyExtractor={(item) => item.id_salas.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.salaCard}
                onPress={() => abrirModalComHorarios(item)}
              >
                <View style={styles.salaIconContainer}>
                  <MaterialCommunityIcons name="google-classroom" size={40} color="black" />
                </View>
                <View>
                  <Text style={styles.salaNome}>{item.nome_da_sala}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Modal para exibir os horários disponíveis da sala selecionada */}
      <Modal
        visible={modalHorariosVisible}
        onRequestClose={() => setModalHorariosVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {salaSelecionada?.nome_da_sala || "Sala"} -{" "}
                {diaSelecionado
                  ? `${diaSelecionado.getDate()}/${
                      diaSelecionado.getMonth() + 1
                    }/${diaSelecionado.getFullYear()}`
                  : ""}
              </Text>
            </View>

            <Text style={styles.horariosTitulo}>Horários Disponíveis</Text>

            {horariosDisponiveis.length === 0 ? (
              <Text style={styles.emptyMessage}>
                Nenhum horário disponível para esta sala neste dia.
              </Text>
            ) : (
              <View style={styles.horariosGrid}>
                {horariosDisponiveis.map((horario, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.horarioItem}
                    onPress={() => selecionarHorario(horario)}
                  >
                    <Text style={styles.horarioText}>
                      {horario.inicio} - {horario.fim}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Botão para fechar o modal de horários */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalHorariosVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação de reserva */}
      <Modal
        visible={modalConfirmacaoVisible}
        onRequestClose={() => setModalConfirmacaoVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalConfirmacaoContainer}>
            <Text style={styles.modalConfirmacaoTitle}>Confirmar Reserva?</Text>
            <Text style={styles.modalConfirmacaoInfo}>
              Sala: {salaSelecionada?.nome_da_sala || "N/A"}
            </Text>
            <Text style={styles.modalConfirmacaoInfo}>
              Localização: {salaSelecionada?.localizacao || "N/A"}
            </Text>
            <Text style={styles.modalConfirmacaoInfo}>
              Capacidade: {salaSelecionada?.capacidade || "N/A"} pessoas
            </Text>
            <Text style={styles.modalConfirmacaoInfo}>
              Equipamentos: {salaSelecionada?.equipamentos || "N/A"}
            </Text>
            <Text style={styles.modalConfirmacaoInfo}>
              Data: {diaSelecionado
                ? `${diaSelecionado.getDate()}/${
                    diaSelecionado.getMonth() + 1
                  }/${diaSelecionado.getFullYear()}`
                : "N/A"}
            </Text>
            <Text style={styles.modalConfirmacaoInfo}>
              Horário: {horarioSelecionado?.inicio} - {horarioSelecionado?.fim}
            </Text>

            <View style={styles.modalConfirmacaoButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.button]}
                onPress={criarNovaReserva}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, styles.button]}
                onPress={() => setModalConfirmacaoVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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
    height: 70,
    backgroundColor: "#D3D3D3",
    flexDirection: "row", // Para alinhar a imagem e o ícone
    justifyContent: "space-between", // Espaço entre os elementos
    alignItems: "center",
    paddingHorizontal: 10, // Adicionei um pouco de padding horizontal
  },
  logo: {
    width: 250, // largura da logo
    height: 500, // altura da logo
    resizeMode: "contain", // Garante que a imagem caiba dentro das dimensões
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
  },
  selectDateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  Messages: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    fontWeight: "bold",
    color: "#FFF",
  },
  salaCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    alignItems: "center", // Alinhar os itens verticalmente
  },
  salaIconContainer: {
    marginRight: 15,
    justifyContent: "center",
  },
  salaNome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
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
    width: "48%",
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
  modalConfirmacaoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    width: "80%", // Largura do modal de confirmação
  },
  modalConfirmacaoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalConfirmacaoInfo: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  modalConfirmacaoButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});