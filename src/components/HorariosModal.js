import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList // Usaremos FlatList para melhor desempenho com muitos horários
} from 'react-native';

const HorariosModal = ({
  visible,
  onClose,
  sala,
  dia,
  horarios, // Horários disponíveis para a sala/data
  onConfirmarSelecao, // Novo prop: função para enviar os horários selecionados de volta para Salas.js
}) => {
  const [horariosSelecionadosInternos, setHorariosSelecionadosInternos] = useState([]);

  // Limpa os horários selecionados internos sempre que o modal é aberto ou a sala/data muda
  useEffect(() => {
    if (visible) {
      setHorariosSelecionadosInternos([]);
    }
  }, [visible, sala, dia]);

  const toggleSelecaoHorario = (horario) => {
    // Verifica se o horário já está selecionado
    const isSelected = horariosSelecionadosInternos.some(
      (h) => h.inicio === horario.inicio && h.fim === horario.fim
    );

    if (isSelected) {
      // Remove o horário se já estiver selecionado
      setHorariosSelecionadosInternos((prev) =>
        prev.filter((h) => h.inicio !== horario.inicio || h.fim !== horario.fim)
      );
    } else {
      // Adiciona o horário se não estiver selecionado
      setHorariosSelecionadosInternos((prev) => [...prev, horario]);
    }
  };

  const handleConfirmar = () => {
    onConfirmarSelecao(horariosSelecionadosInternos);
    onClose(); // Fecha o modal após a confirmação
  };

  const renderHorarioItem = ({ item: horario }) => {
    const isSelected = horariosSelecionadosInternos.some(
      (h) => h.inicio === horario.inicio && h.fim === horario.fim
    );
    return (
      <TouchableOpacity
        style={[styles.horarioItem, isSelected && styles.horarioItemSelected]}
        onPress={() => toggleSelecaoHorario(horario)}
      >
        <Text style={[styles.horarioText, isSelected && styles.horarioTextSelected]}>
          {horario.inicio} - {horario.fim}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {sala?.nome_da_sala || 'Sala'} -{' '}
              {dia ? `${dia.getDate()}/${dia.getMonth() + 1}/${dia.getFullYear()}` : ''}
            </Text>
          </View>

          <Text style={styles.horariosTitulo}>Horários Disponíveis (selecione 1 ou mais)</Text>

          {horarios.length === 0 ? (
            <Text style={styles.emptyMessage}>
              Nenhum horário disponível para esta sala neste dia.
            </Text>
          ) : (
            <FlatList
              data={horarios}
              keyExtractor={(item, index) => `${item.inicio}-${index}`} // Key única para FlatList
              renderItem={renderHorarioItem}
              numColumns={2} // Duas colunas para o grid
              columnWrapperStyle={styles.horariosGrid}
            />
          )}

          {horariosSelecionadosInternos.length > 0 && (
            <TouchableOpacity style={[styles.confirmButton, {backgroundColor: '#4CAF50'}]} onPress={handleConfirmar}>
              <Text style={styles.confirmButtonText}>
                Confirmar Seleção ({horariosSelecionadosInternos.length})
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  horariosTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  horariosGrid: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  horarioItem: {
    width: '48%', // Ajustado para duas colunas com espaçamento
    backgroundColor: '#e1f5fe',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e1f5fe',
  },
  horarioItemSelected: {
    backgroundColor: '#4CAF50', // Cor para horário selecionado
    borderColor: '#388E3C',
  },
  horarioText: {
    fontSize: 16,
    color: '#000',
  },
  horarioTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#007bff', // Cor para o botão de confirmação
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HorariosModal;