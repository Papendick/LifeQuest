import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function QuestForm({ onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function save() {
    if (!title) {
      Alert.alert('Fehler', 'Titel darf nicht leer sein');
      return;
    }
    onSave({ title, description, startDate, endDate });
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Titel" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Beschreibung" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Startdatum" value={startDate} onChangeText={setStartDate} style={styles.input} />
      <TextInput placeholder="Enddatum" value={endDate} onChangeText={setEndDate} style={styles.input} />
      <Button title="Speichern" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderWidth: 1, marginBottom: 8, padding: 8 },
});
