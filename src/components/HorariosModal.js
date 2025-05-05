import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

const HorariosModal = ({
  visible,
  onClose,
  sala,
  dia,
  horarios,
  onSelecionarHorario,
}) => (
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

        <Text style={styles.horariosTitulo}>Horários Disponíveis</Text>

        {horarios.length === 0 ? (
          <Text style={styles.emptyMessage}>
            Nenhum horário disponível para esta sala neste dia.
          </Text>
        ) : (
          <View style={styles.horariosGrid}>
            {horarios.map((horario, index) => (
              <TouchableOpacity
                key={index}
                style={styles.horarioItem}
                onPress={() => onSelecionarHorario(horario)}
              >
                <Text style={styles.horarioText}>
                  {horario.inicio} - {horario.fim}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  horarioItem: {
    width: '48%',
    backgroundColor: '#e1f5fe',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  horarioText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
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