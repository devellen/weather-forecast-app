import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Previsao from './pages/WeatherApp';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Previsao" component={Previsao}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}