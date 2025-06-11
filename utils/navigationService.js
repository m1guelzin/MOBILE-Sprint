// src/services/navigationService.js
import { CommonActions } from '@react-navigation/native';

let navigator;

// Função para configurar o navegador (chamada no componente raiz, como App.js)
export function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

// Função para navegar para a tela de login, limpando a pilha de navegação
export function navigateToLogin() {
  if (navigator) {
    navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Certifique-se de que 'Login' é o nome da sua rota de login
      })
    );
  } else {
    console.warn("Navegador não configurado para redirecionamento. O usuário pode precisar reiniciar o app.");
    // Opcional: Você pode tentar limpar o AsyncStorage aqui se o navegador não estiver pronto
    // AsyncStorage.clear();
  }
}