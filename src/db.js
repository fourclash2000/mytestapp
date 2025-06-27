import { db } from './firebase';
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc, query, where, updateDoc } from 'firebase/firestore';

// === ТЕСТЫ ===
export async function getAllTests() {
  const testsCol = collection(db, 'tests');
  const testsSnapshot = await getDocs(testsCol);
  return testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addTest(test) {
  const testsCol = collection(db, 'tests');
  await addDoc(testsCol, test);
}

export async function updateTest(id, data) {
  const testRef = doc(db, 'tests', id);
  await updateDoc(testRef, data);
}

export async function deleteTest(id) {
  const testRef = doc(db, 'tests', id);
  await deleteDoc(testRef);
}

// === ПОЛЬЗОВАТЕЛИ ===
export async function getAllUsers() {
  const usersCol = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCol);
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addUser(user) {
  const usersCol = collection(db, 'users');
  await addDoc(usersCol, user);
}

// === РЕЗУЛЬТАТЫ ===
export async function getAllResults() {
  const resultsCol = collection(db, 'results');
  const resultsSnapshot = await getDocs(resultsCol);
  return resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addResult(result) {
  const resultsCol = collection(db, 'results');
  await addDoc(resultsCol, result);
}

export async function updateResult(id, data) {
  const resultRef = doc(db, 'results', id);
  await updateDoc(resultRef, data);
}

export async function deleteResult(id) {
  const resultRef = doc(db, 'results', id);
  await deleteDoc(resultRef);
} 