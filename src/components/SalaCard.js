import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SalaCard = ({ sala, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(sala)}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="google-classroom" size={40} color="black" />
    </View>
    <View>
      <Text style={styles.nome}>{sala.nome_da_sala}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SalaCard;