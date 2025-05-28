import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';

const ConfirmacaoModal = ({
  visible,
  onClose,
  sala,
  dia,
  horarios, // Agora é um ARRAY de horários
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
        <Text style={[styles.title, {fontWeight: 'bold' }]}>Confirmar Reserva(s)?</Text>
        <ScrollView style={styles.scrollContent}>
          <Text style={[styles.info, {fontWeight: 'bold' }]}>DETALHES DA SALA</Text>
          <Text style={styles.info}>Sala: {sala?.nome_da_sala}</Text>
          <Text style={styles.info}>Localização: {sala?.localizacao}</Text>
          <Text style={styles.info}>Capacidade: {sala?.capacidade} pessoas</Text>
          <Text style={styles.info}>Equipamentos: {sala?.equipamentos}</Text>
          <Text style={styles.info}>
            Data:{' '}
            {dia ? `${dia.getDate()}/${dia.getMonth() + 1}/${dia.getFullYear()}` : ''}
          </Text>

          <Text style={[styles.info, { marginTop: 15, fontWeight: 'bold' }]}>
            HORÁRIO(S) SELECIONADO(S)
          </Text>
          {horarios && horarios.length > 0 ? (
            horarios.map((horario, index) => (
              <Text key={index} style={styles.infoHorario}>
                {horario.inicio} - {horario.fim}
              </Text>
            ))
          ) : (
            <Text style={styles.info}>Nenhum horário selecionado.</Text>
          )}
        </ScrollView>

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
    width: '85%', // Aumentado um pouco para acomodar mais texto
    maxHeight: '75%', // Limita a altura do modal
  },
  scrollContent: {
    width: '100%',
    maxHeight: 250, // Altura máxima para a área de rolagem
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left', // Alinhado à esquerda para melhor leitura
    width: '100%',
  },
  infoHorario: {
    fontSize: 15,
    marginBottom: 3,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 10, // Indentação para os horários
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