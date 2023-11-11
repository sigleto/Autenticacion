import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';

export default function ConsultarCitas() {
  const [citas, setCitas] = useState([]);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;

  useEffect(() => {
    const consultarCitas = async () => {
      try {
        const eventosCollection = collection(db, 'eventos');
        const eventosSnapshot = await getDocs(eventosCollection);

        const citasData = [];
        eventosSnapshot.forEach((doc) => {
          const eventData = doc.data();
          if (eventData.userId === userId) {
            citasData.push(eventData);
          }
        });

        setCitas(citasData);
      } catch (error) {
        console.error('Error al consultar citas: ', error);
      }
    };

    consultarCitas();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Citas concertadas</Text>
      <FlatList
        data={citas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.citaItem}>
            <Text>Fecha: {item.date.toDate().toDateString()}</Text>
            <Text>Evento: {item.text}</Text>
          </View>
        )}
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
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  citaItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
