// utils/secureStorage.js
import * as SecureStore from 'expo-secure-store';

// Nome das chaves para reutilização segura e padronizada
const TOKEN_KEY = 'userToken';
const USER_DATA_KEY = 'usuarioLogado';

/**
 * Salva o token JWT de forma segura.
 * @param {string} token - Token JWT retornado no login.
 */
export async function saveToken(token) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Erro ao salvar o token no SecureStore:", error);
  }
}

/**
 * Recupera o token JWT salvo.
 * @returns {Promise<string|null>} - Token ou null se não existir.
 */
export async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao recuperar o token do SecureStore:", error);
    return null;
  }
}

/**
 * Remove o token do armazenamento seguro.
 */
export async function deleteToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao deletar o token do SecureStore:", error);
  }
}

/**
 * Salva os dados do usuário logado de forma segura (opcional).
 * @param {Object} user - Dados do usuário logado.
 */
export async function saveUser(user) {
  try {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Erro ao salvar o usuário no SecureStore:", error);
  }
}

/**
 * Recupera os dados do usuário logado.
 * @returns {Promise<Object|null>} - Objeto do usuário ou null se não existir.
 */
export async function getUser() {
  try {
    const userJson = await SecureStore.getItemAsync(USER_DATA_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Erro ao recuperar o usuário do SecureStore:", error);
    return null;
  }
}

/**
 * Remove os dados do usuário do armazenamento seguro.
 */
export async function deleteUser() {
  try {
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
    console.error("Erro ao deletar o usuário do SecureStore:", error);
  }
}

/**
 * Limpa tudo do usuário (token + dados).
 */
export async function clearSecureData() {
  await deleteToken();
  await deleteUser();
}
