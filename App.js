import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';

export default function App() {
  const [books, setBooks] = useState([]); // เริ่มต้นไม่มีหนังสือ

  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', year: '', description: '' });

  const createBook = () => {
    if (!form.title.trim()) {
      Alert.alert('กรอกชื่อหนังสือ');
      return;
    }
    const newBook = {
      id: String(Date.now()),
      title: form.title,
      author: form.author,
      year: form.year,
      description: form.description,
    };
    setBooks(prev => [newBook, ...prev]);
    resetForm();
    setModalVisible(false);
  };

  const updateBook = () => {
    if (!editingBook) return;
    setBooks(prev => prev.map(b => (b.id === editingBook.id ? { ...b, ...form } : b)));
    resetForm();
    setEditingBook(null);
    setModalVisible(false);
  };

  const removeBook = id => {
    Alert.alert('ลบหนังสือ', 'คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือนี้?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบ', style: 'destructive', onPress: () => setBooks(prev => prev.filter(b => b.id !== id)) },
    ]);
  };

  const viewBook = book => {
    setEditingBook(null);
    setForm({ title: book.title, author: book.author, year: book.year, description: book.description });
    setViewModalVisible(true);
  };

  const startEdit = book => {
    setEditingBook(book);
    setForm({ title: book.title, author: book.author, year: book.year, description: book.description });
    setModalVisible(true);
  };

  const resetForm = () => setForm({ title: '', author: '', year: '', description: '' });

  const renderBook = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => viewBook(item)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.author} • {item.year}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => startEdit(item)}>
            <Text style={styles.iconText}>แก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]} onPress={() => removeBook(item.id)}>
            <Text style={[styles.iconText, { color: '#ff4d4f' }]}>ลบ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY BOOKSHELF</Text>
      </View>

      {books.length > 0 && (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => { resetForm(); setEditingBook(null); setModalVisible(true); }}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { setModalVisible(false); setEditingBook(null); }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingBook ? 'แก้ไขหนังสือ' : 'สร้างหนังสือใหม่'}</Text>
            <TextInput placeholder="ชื่อหนังสือ" value={form.title} onChangeText={t => setForm({ ...form, title: t })} style={styles.input} />
            <TextInput placeholder="ผู้แต่ง" value={form.author} onChangeText={t => setForm({ ...form, author: t })} style={styles.input} />
            <TextInput placeholder="ปีที่พิมพ์" value={form.year} onChangeText={t => setForm({ ...form, year: t })} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="คำอธิบาย" value={form.description} onChangeText={t => setForm({ ...form, description: t })} multiline numberOfLines={3} style={[styles.input, { height: 80 }]} />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={styles.btnSecondary} onPress={() => { setModalVisible(false); setEditingBook(null); }}><Text>ยกเลิก</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { marginLeft: 8 }]} onPress={() => (editingBook ? updateBook() : createBook())}>
                <Text style={{ color: 'white', fontWeight: '600' }}>{editingBook ? 'บันทึก' : 'สร้าง'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{form.title}</Text>
            <Text style={styles.meta}>{form.author} • {form.year}</Text>
            <Text style={{ marginTop: 12 }}>{form.description || '(ไม่มีคำอธิบาย)'}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity style={styles.btnSecondary} onPress={() => setViewModalVisible(false)}><Text>ปิด</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { marginLeft: 8 }]} onPress={() => { setViewModalVisible(false); startEdit({ id: editingBook?.id, ...form }); }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>แก้ไข</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: { paddingTop: Platform.OS === 'android' ? 20 : 0, padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '900', textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 12, color: '#666', marginTop: 4 },
  iconBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#f0f3f5' },
  iconText: { fontSize: 13, fontWeight: '600' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#2b8aef', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 8, elevation: 5 },
  fabText: { color: 'white', fontSize: 28, lineHeight: 28 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 640, backgroundColor: 'white', padding: 18, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e6e9ed', padding: 10, borderRadius: 8, marginBottom: 10 },
  btnPrimary: { backgroundColor: '#2b8aef', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignItems: 'center' },
  btnSecondary: { backgroundColor: '#f0f3f5', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignItems: 'center' },
});
