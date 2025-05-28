// axios/axios.js
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


const api = axios.create({
  baseURL: "http://10.89.240.86:3000/project-senai/api/v1",
  headers: {
    "accept": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
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
  atualizarUsuario: (dados) => api.put("user", dados),
  deletarReserva: (id_reserva) => api.delete(`reservas/${id_reserva}`),

};

export default sheets;
