import Login from "./screens/LoginScreen";
import Cadastro from "./screens/CadastroScreen";
import Home from "./screens/HomeScreen";
import TelaInicial from "./screens/Telainicial";
import Header from "./components/Header";
import Salas from "./screens/SalasScreen";
import Perfil from "./screens/PerfilScreen"

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShow: true}}>
        {/* Tela de Login com Header */}
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{ header: () => <Header title="Página Login" /> }}
        />

        {/* Tela de Cadastro com Header */}
        <Stack.Screen 
          name="Cadastro" 
          component={Cadastro}
          options={{ header: () => <Header title="Página Cadastro" /> }}
        />

        {/* Outras Telas */}
        
        <Stack.Screen 
        name="Perfil" 
        component={Perfil} 
        />

        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
        <Stack.Screen name="Salas" component={Salas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
