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
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../axios/axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SalaCard from "../components/SalaCard";
import HorariosModal from "../components/HorariosModal";
import ConfirmacaoModal from "../components/ConfirmacaoModal";
import HeaderPrincipal from "../components/HeaderPrincipal";
import {useNavigation} from "@react-navigation/native"

export default function Salas() {
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);
  const [modalHorariosVisible, setModalHorariosVisible] = useState(false);
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  
  const formatDateForAPI = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  async function buscarSalasDisponiveis(data) {
    if (!data) {
      setSalasDisponiveis([]);
      return;
    }
    try {
      const dataFormatada = formatDateForAPI(data);
      const response = await api.getSalasDisponiveisPorData(dataFormatada);
      setSalasDisponiveis(response.data.salas_disponiveis);
    } catch (error) {
      console.log(
        "Erro ao buscar salas disponíveis:",
        error.response.data.error
      );
      setSalasDisponiveis([]);
    }
  }

  async function buscarHorariosDisponiveis(sala, data) {
    if (!sala || !data) {
      setHorariosDisponiveis([]);
      return;
    }
    try {
      const dataFormatada = formatDateForAPI(data);
      const response = await api.getSalasHorariosDisponiveis(dataFormatada);
      const salaHorarios = response.data.salas.find(
        (s) => s.id_sala === sala.id_salas
      );
      setHorariosDisponiveis(salaHorarios.horarios_disponiveis || []);
    } catch (error) {
      console.log(error.response.data.error);
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
    const [horaInicio, minutoInicio] = horarioSelecionado.inicio
      .split(":")
      .map(Number);
    const horaFim = String(horaInicio + 1).padStart(2, "0");
    const dataFormatada = formatDateForAPI(diaSelecionado);
    try {
      const usuarioLogado = await AsyncStorage.getItem("usuarioLogado");
      const usuario = JSON.parse(usuarioLogado);
      const reserva = {
        id_usuario: usuario.id_usuario, //AsyncStorage
        fkid_salas: salaSelecionada.id_salas,
        data_reserva: dataFormatada,
        horario_inicio: `${horarioSelecionado.inicio}:00`,
        horario_fim: `${horaFim}:${String(minutoInicio).padStart(2, "0")}:00`,
      };

      const response = await api.criarReserva(reserva);
      Alert.alert(response.data.message);
      setModalConfirmacaoVisible(false);
      setSalaSelecionada(null);
      setDiaSelecionado(null);
      setHorariosDisponiveis([]);
      setHorarioSelecionado(null);
    } catch (error) {
      console.log(error.response.data.error);
      Alert.alert(error.response.data.error);
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header da tela */}
      <HeaderPrincipal/>

      {/* Seção para selecionar a data */}
      <View style={styles.selectDateContainer}>
        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.selectDateButtonText}>
            {diaSelecionado
              ? `Selecionado: ${formatDate(diaSelecionado)}`
              : "Escolher Data 📅"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={diaSelecionado || new Date()}
          mode="date"
          minimumDate={new Date()}
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
              <SalaCard sala={item} onPress={abrirModalComHorarios} />
            )}
          />
        )}
      </View>

      <HorariosModal
        visible={modalHorariosVisible}
        onClose={() => setModalHorariosVisible(false)}
        sala={salaSelecionada}
        dia={diaSelecionado}
        horarios={horariosDisponiveis}
        onSelecionarHorario={selecionarHorario}
      />

      <ConfirmacaoModal
        visible={modalConfirmacaoVisible}
        onClose={() => setModalConfirmacaoVisible(false)}
        sala={salaSelecionada}
        dia={diaSelecionado}
        horario={horarioSelecionado}
        onConfirmar={criarNovaReserva}
        onCancelar={() => setModalConfirmacaoVisible(false)}
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 250,
    height: 500,
    resizeMode: "contain",
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
});
