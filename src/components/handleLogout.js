import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native'; // Importe CommonActions

// A função de logout pode ser um export nomeado para fácil importação em outros lugares.
export const handleLogout = async (navigation) => {
  try {
    // 1. Remover o token de autenticação
    await AsyncStorage.removeItem('userToken');
    //console.log('Token removido do AsyncStorage.');

    // 2. Remover os dados do usuário logado
    await AsyncStorage.removeItem('usuarioLogado');
    //console.log('Dados do usuário removidos do AsyncStorage.');

    // 3. Redirecionar o usuário para a tela de Login
    // Usamos CommonActions.reset para garantir que o histórico de navegação seja limpo,
    // impedindo que o usuário volte para telas protegidas após o logout.
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Certifique-se de que 'Login' é o nome da sua rota de login
      })
    );
    //console.log('Redirecionado para a tela de Login.');

  } catch (error) {
    //console.log('Erro ao fazer logout:', error);
    // Você pode adicionar um Alert.alert para informar o usuário sobre o erro.
    // Alert.alert('Erro', 'Ocorreu um erro ao tentar sair. Tente novamente.');
  }
};