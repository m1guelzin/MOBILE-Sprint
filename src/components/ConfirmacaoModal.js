import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ConfirmacaoModal = ({
  visible,
  onClose,
  sala,
  dia,
  horario,
  onConfirmar,
  onCancelar,
}) => (
  <Modal
    visible={visible}
    onRequestClose={onClose}
    animationType="fade"
    transparent={true}
  >
    <View style={styles.backdrop}>
      <View style={styles.container}>
        <Text style={styles.title}>Confirmar Reserva?</Text>
        <Text style={styles.info}>Sala: {sala?.nome_da_sala}</Text>
        <Text style={styles.info}>
          Localização: {sala?.localizacao}
        </Text>
        <Text style={styles.info}>
          Capacidade: {sala?.capacidade} pessoas
        </Text>
        <Text style={styles.info}>
          Equipamentos: {sala?.equipamentos}
        </Text>
        <Text style={styles.info}>
          Data:{' '}
          {dia ? `${dia.getDate()}/${dia.getMonth() + 1}/${dia.getFullYear()}` : ''}
        </Text>
        <Text style={styles.info}>
          Horário: {horario?.inicio} - {horario?.fim}
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.confirmButton, styles.button]} onPress={onConfirmar}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cancelButton, styles.button]} onPress={onCancelar}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfirmacaoModal;