import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../axios/axios";
import SalaCard from "../components/SalaCard";
import HorariosModal from "../components/HorariosModal";
import ConfirmacaoModal from "../components/ConfirmacaoModal";
import HeaderPrincipal from "../components/HeaderPrincipal";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function Salas() {
  const navigation = useNavigation();

  const [salasDisponiveis, setSalasDisponiveis] = useState([]);
  const [modalHorariosVisible, setModalHorariosVisible] = useState(false);
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]); // Agora é um ARRAY!

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
        error.response?.data?.error || error.message
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
      setHorariosDisponiveis(salaHorarios?.horarios_disponiveis || []);
    } catch (error) {
      console.log(
        "Erro ao buscar horários disponíveis:",
        error.response?.data?.error || error.message
      );
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
      // Limpa horários e sala selecionados ao mudar a data
      setHorariosSelecionados([]);
      setSalaSelecionada(null);
    }
  }

  // NOVA FUNÇÃO: Recebe o array de horários selecionados do HorariosModal
  function handleHorariosConfirmados(horarios) {
    if (horarios.length === 0) {
      Alert.alert("Atenção", "Nenhum horário foi selecionado.");
      return;
    }
    setHorariosSelecionados(horarios); // Atualiza o estado com múltiplos horários
    setModalHorariosVisible(false); // Fecha o modal de horários
    setModalConfirmacaoVisible(true); // Abre o modal de confirmação
  }

  // FUNÇÃO ATUALIZADA: Cria múltiplas reservas
  async function criarMultiplasReservas() {
    if (!salaSelecionada || !diaSelecionado || horariosSelecionados.length === 0) {
      Alert.alert("Erro", "Dados incompletos para efetuar as reservas.");
      return;
    }

    const dataFormatada = formatDateForAPI(diaSelecionado);
    const usuarioLogado = await AsyncStorage.getItem("usuarioLogado");
    const usuario = JSON.parse(usuarioLogado);

    if (!usuario || !usuario.id_usuario) {
      Alert.alert("Erro", "Usuário não logado. Por favor, faça login novamente.");
      return;
    }

    let reservasComSucesso = 0;
    let reservasComErro = 0;
    const mensagensErro = [];

    // Itera sobre cada horário selecionado
    for (const horario of horariosSelecionados) {
      const [horaInicio, minutoInicio] = horario.inicio.split(":").map(Number);
      const horaFim = String(horaInicio + 1).padStart(2, "0");
      const minutoFim = String(minutoInicio).padStart(2, "0"); // Manteve o minuto para o fim

      const reservaPayload = {
        id_usuario: usuario.id_usuario,
        fkid_salas: salaSelecionada.id_salas,
        data_reserva: dataFormatada,
        horario_inicio: `${horario.inicio}:00`, // Garante segundos
        horario_fim: `${horaFim}:${minutoFim}:00`, // Garante segundos
      };

      try {
        await api.criarReserva(reservaPayload);
        reservasComSucesso++;
      } catch (error) {
        reservasComErro++;
        const errorMessage = error.response?.data?.error || "Erro desconhecido ao reservar um horário.";
        mensagensErro.push(`Erro ao reservar ${horario.inicio}: ${errorMessage}`);
        console.log(`Erro ao reservar ${horario.inicio}:`, errorMessage);
      }
    }

    setModalConfirmacaoVisible(false); // Fecha o modal de confirmação

    // Limpa todos os estados para recomeçar o processo
    setSalaSelecionada(null);
    setDiaSelecionado(null);
    setSalasDisponiveis([]);
    setHorariosDisponiveis([]);
    setHorariosSelecionados([]);

    // Mensagem de feedback final
    if (reservasComSucesso > 0 && reservasComErro === 0) {
      Alert.alert("Sucesso!", `Todas as ${reservasComSucesso} reservas foram criadas com sucesso!`);
    } else if (reservasComSucesso > 0 && reservasComErro > 0) {
      Alert.alert(
        "Reservas Concluídas (com avisos)",
        `Foram criadas ${reservasComSucesso} reservas com sucesso. ${reservasComErro} reservas falharam:\n\n${mensagensErro.join('\n')}`
      );
    } else {
      Alert.alert("Erro", `Nenhuma reserva foi criada. Detalhes: \n${mensagensErro.join('\n')}`);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <HeaderPrincipal />

      <View style={styles.selectDateContainer}>
        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.selectDateButtonText}>
            {diaSelecionado
              ? `Data Selecionada: ${formatDate(diaSelecionado)}`
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
        onConfirmarSelecao={handleHorariosConfirmados} // Novo prop para lidar com múltiplos horários
      />

      <ConfirmacaoModal
        visible={modalConfirmacaoVisible}
        onClose={() => setModalConfirmacaoVisible(false)}
        sala={salaSelecionada}
        dia={diaSelecionado}
        horarios={horariosSelecionados} // Passa o ARRAY de horários
        onConfirmar={criarMultiplasReservas} // Função que cria múltiplas reservas
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