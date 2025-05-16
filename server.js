
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const link = 'https://jsonplaceholder.typicode.com/users';

function readUsers() {
  return JSON.parse(fs.readFileSync(link));
}
function writeUsers(users) {
  fs.writeFileSync(link, JSON.stringify(users, null, 2));
}

app.get('/', (req, res) => {
  const users = readUsers();
  res.json(users);
});


app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'Felhasználó nem található.' });
  res.json(user);
});


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


app.delete('/delete/:id', (req, res) => {
  let users = readUsers();
  const id = parseInt(req.params.id);
  const newUsers = users.filter(u => u.id !== id);

  if (users.length === newUsers.length) {
    return res.status(404).json({ error: 'Felhasználó nem található.' });
  }

  writeUsers(newUsers);
  res.json({ message: `Felhasználó (ID: ${id}) törölve.` });
});

app.listen(3000, () => {
  console.log('Szerver fut a http://localhost:3000 címen');
});