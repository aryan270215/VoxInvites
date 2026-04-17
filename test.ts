import { initializeApp } from 'firebase/app';
import { getFirestore, getDocFromServer, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("SUCCESS");
  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}
testConnection();
