// Navigation.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import EventCalendar from './EventCalendar';
import ConsultarCitas from './ConsultarCitas';
import Autentication from './Autenticacion';

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Autentication">
      
        <Stack.Screen name="Autentication" component={Autentication}options={{ headerShown: false }} />
        <Stack.Screen name="EventCalendar" component={EventCalendar}options={{ headerShown: false }} />
        <Stack.Screen name="ConsultarCitas" component={ConsultarCitas}options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
