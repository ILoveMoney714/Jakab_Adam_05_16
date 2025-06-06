
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Lokális JSON fájl elérési útja
const dataFilePath = path.join(__dirname, 'users.json');

// JSON fájl beolvasása
function readUsers() {
  if (!fs.existsSync(dataFilePath)) return [];
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data || '[]');
}

// JSON fájlba írás
function writeUsers(users) {
  fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

// Összes felhasználó lekérdezése
app.get('/', (req, res) => {
  const users = readUsers();
  res.json(users);
});

// Egy felhasználó lekérdezése ID alapján
app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'Felhasználó nem található.' });
  res.json(user);
});

// Új felhasználó hozzáadása
app.post('/ujuser', (req, res) => {
  const users = readUsers();
  const newUser = req.body;

  if (!newUser.id) {
    return res.status(400).json({ error: 'Az "id" megadása kötelező!' });
  }

  if (users.find(u => u.id == newUser.id)) {
    return res.status(409).json({ error: 'Már létezik ilyen ID-val felhasználó!' });
  }

  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// Felhasználó törlése ID alapján
app.delete('/delete/:id', (req, res) => {
  const users = readUsers();
  const id = parseInt(req.params.id);
  const newUsers = users.filter(u => u.id !== id);

  if (users.length === newUsers.length) {
    return res.status(404).json({ error: 'Felhasználó nem található.' });
  }

  writeUsers(newUsers);
  res.json({ message: `Felhasználó (ID: ${id}) törölve.` });
});

// Szerver indítása
app.listen(3000, () => {
  console.log('Szerver fut a http://localhost:3000 címen');
});