import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { agregarEventoFirestore,firebaseConfig } from '../Firebase';
import { useNavigation } from '@react-navigation/native';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';
import { getAuth } from '@firebase/auth';
import { initializeApp } from 'firebase/app';

export default function EventCalendar() {

  const navigation=useNavigation()

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [eventText, setEventText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userId = user.uid;


  const addEvent = () => {
    if (selectedDate && eventText) {
      const newEvent = {
        date: selectedDate,
        text: eventText,
        userId: userId,
      };
      setEventos([...eventos, newEvent]);
      setEventText('');
      setShowDatePicker(false);
      agregarEventoFirestore(newEvent);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendario de Citas</Text>
      {showDatePicker && (
        <DateTimePicker
          style={styles.datePicker}
          value={selectedDate}
          mode="date"
          format="DD-MM-YYYY"
          onChange={(event, date) => {
            if (event.type === 'set') {
              setSelectedDate(date);
              setShowDatePicker(false);
            }
          }}
        />
      )}
      {!showDatePicker && (
        <Button
          title="Seleccionar Fecha"
          onPress={() => setShowDatePicker(true)}
          style={[styles.selectDateButton]}
        />
      )}
      <View style={{ marginBottom: 20 }} />
      <View style={styles.eventForm}>
        <Text style={styles.selectedDateText}>Fecha seleccionada: {format(selectedDate, "dd 'de' LLLL 'de' yyyy", { locale: es })}</Text>
        <TextInput
          style={styles.eventInput}
          placeholder="Evento"
          value={eventText}
          onChangeText={(text) => setEventText(text)}
        />
        <Button title="Agrega la cita" onPress={addEvent} />
        <FlatList
          data={eventos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.eventItem}>
              {item.date.toString()}: {item.text}
            </Text>
          )}
        />
      </View>
      
      
       <View style={{ marginBottom: 40 }} />
      <Button
        title="Consulta las citas concertadas"
        onPress={() => navigation.navigate('ConsultarCitas')}
        style={styles.selectCitaButton}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'olive', // Cambia el color de fondo
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Cambia el color del texto
  },
  datePicker: {
    width: '100%',
  },
  eventForm: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 10,
  },
  eventInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  eventItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  selectDateButton: {
    backgroundColor: '#e74c3c', // Cambia el color del botón
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop:20,
    
  },
  selectCitaButton: {
    backgroundColor: '#e74c3c', // Cambia el color del botón
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    
  },
});
