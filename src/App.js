import Login from "./screens/LoginScreen";
import Cadastro from "./screens/CadastroScreen";
import Home from "./screens/HomeScreen";
import TelaInicial from "./screens/Telainicial";
import Header from "./components/Header";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaInicial">
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
        
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
