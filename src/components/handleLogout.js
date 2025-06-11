import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native'; // Importe CommonActions

// A função de logout pode ser um export nomeado para fácil importação em outros lugares.
export const handleLogout = async (navigation) => {
  try {

    await AsyncStorage.removeItem('userToken');
    //console.log('Token removido do AsyncStorage.');

    await AsyncStorage.removeItem('usuarioLogado');
    //console.log('Dados do usuário removidos do AsyncStorage.');

    
    // CommonActions.reset para garantir que o histórico de navegação seja limpo
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
      })
    );
    //console.log('Redirecionado para a tela de Login.');

  } catch (error) {
    //console.log('Erro ao fazer logout:', error);
    // Você pode adicionar um Alert.alert para informar o usuário sobre o erro.
    Alert.alert('Erro', 'Ocorreu um erro ao tentar sair. Tente novamente.');
  }
};