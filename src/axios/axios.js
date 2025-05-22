// axios/axios.js
import axios from "axios";
import * as SecureStore from 'expo-secure-store';


const api = axios.create({
  baseURL: "http://10.89.240.6:3000/project-senai/api/v1",
  headers: {
    "accept": "application/json",
  },
});

const sheets = {
  postLogin: (user) => api.post("login/", user),
  postCadastro: (user) => api.post("user/", user),
  getAllSalas: () => api.get("salas/"),
  getSalasDisponiveisPorData: (data) => api.get(`salas/disponiveis/${data}`),
  getSalasHorariosDisponiveis: (data) => api.get(`salas/horarios-disponiveis/${data}`),
  criarReserva: (reservaData) => api.post("reservas/", reservaData),
  getUsuario: (id_usuario) => api.get(`user/${id_usuario}`),
  getReservaById: (id_usuario) => api.get(`reservas/user/${id_usuario}`),
  atualizarUsuario: async (dados) => {
    const token = await SecureStore.getItemAsync("token");
    return api.put("user", dados, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default sheets;
