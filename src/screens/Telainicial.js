import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const TelaInicial = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Página inicial</Text>
        <View style={styles.buttonHeader}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.buttonText}>Cadastro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          <Image source={require("../img/logo-senai1.png")} style={styles.logo} />
          <Text style={styles.welcomeText}>Bem-Vindo!!!</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>SENAI Franca-SP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 400,
    height: 100,

  },
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: '#C5C2C2',
    paddingVertical: 40,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonHeader: {
    flexDirection: 'row',
    position: 'absolute',
    right: 5,
    top: 80, // Aumente esse valor para descer os botões
  },
  button: {
    backgroundColor: 'red',
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentWrapper: {
    width: '90%',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    
    borderRadius: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',

    
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    backgroundColor: '#ccc',
    paddingVertical: 40,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  footerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default TelaInicial;
