import './App.css';
import { db } from './firebase';
import { uid } from 'uid';
import { set, ref, onValue } from "firebase/database";
import { useState, useEffect } from 'react';
import { storage } from './firebase';

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [entries, setEntries] = useState([]);
  const [editedEntryId, setEditedEntryId] = useState(null);
  const [loading, setLoading] = useState(true); 

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleContactNumberChange = (e) => {
    setContactNumber(e.target.value);
  };

  const writeToDatabase = () => {
    setLoading(true); // Set loading to true when writing to the database

    const uuid = uid();
    set(ref(db, `/${uuid}`), {
      name,
      uuid,
      contactNumber,
      email,
    });
    setName("");
    setEmail("");
    setContactNumber("");
  };

  const editEntry = (entry) => {
    setName(entry.name);
    setEmail(entry.email);
    setContactNumber(entry.contactNumber);
    setEditedEntryId(entry.id);
  };

  const updateEntry = () => {
    if (editedEntryId) {
      setLoading(true); // Set loading to true when updating the entry

      const updatedEntry = {
        name,
        email,
        contactNumber,
      };
      set(ref(db, `/${editedEntryId}`), updatedEntry);
      setName("");
      setEmail("");
      setContactNumber("");
      setEditedEntryId(null);
    }
  };

  const deleteEntry = (uuid) => {
    setLoading(true); // Set loading to true when deleting the entry

    set(ref(db, `/${uuid}`), null);
  };

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data

    const entriesRef = ref(db);
    onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entriesArray = Object.keys(data).map((key) => ({ ...data[key], id: key }));
        setEntries(entriesArray);
      } else {
        setEntries([]);
      }
      setTimeout(() => {
        setLoading(false); 
      }, 1000);
    });
  }, []);

  return (
    <div className="App">
      <h1>Contact List</h1>
      <div className="form-container">
        <input type="text" value={name} onChange={handleNameChange} placeholder="Name" />
        <input type="text" value={email} onChange={handleEmailChange} placeholder="Email" />
        <input type="text" value={contactNumber} onChange={handleContactNumberChange} placeholder="Contact Number" />
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <>
            {editedEntryId ? (
              <button onClick={updateEntry}>Update</button>
            ) : (
              <button onClick={writeToDatabase}>Submit</button>
            )}
          </>
        )}
      </div>

      <div className="entries-container">
        {entries.map((entry) => (
          <div key={entry.id} className="entry">
            <h3>Contact</h3>
            <p><strong>Name:</strong> {entry.name}</p>
            <p><strong>Email:</strong> {entry.email}</p>
            <p><strong>Contact Number:</strong> {entry.contactNumber}</p>
            <button onClick={() => editEntry(entry)}>Edit</button>
            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
