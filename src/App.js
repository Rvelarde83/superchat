
import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
     import 'firebase/compat/firestore';
     import 'firebase/compat/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCvVnZAaEqKxbdHnBy-nEk1v5lW6aHXuH0",
  authDomain: "superchat-rv.firebaseapp.com",
  projectId: "superchat-rv",
  storageBucket: "superchat-rv.appspot.com",
  messagingSenderId: "245258476623",
  appId: "1:245258476623:web:231c76370a0ef555719e3a",
  measurementId: "G-TFZZX5WXP5"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
       
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}

      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }


  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>

  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>

   )
}


function ChatRoom() {

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const[formValue, setFormValue] = useState('');

  
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
  return(
    <>
    <div>
      {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg}/>)}
    </div>

    <form>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit"> Submit </button>
    <div>

    </div>
    </>
  )
}

function ChatMessage(props) {
  const{ text, uid, photoURL} =props.message;

  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p> {text}</p>

      </div>
  )
}


export default App;
 