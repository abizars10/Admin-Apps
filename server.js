const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use("/favicon.ico", (req, res) => res.status(204));
app.use(bodyParser.json());

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Data Dummy
const users = [
  // {
  //   id: "ID-1",
  //   nama: "Budi",
  //   nominal: "100000",
  //   jenis: "Debet",
  //   tanggal: "21/01/2024",
  // },
  // {
  //   id: "ID-2",
  //   nama: "Dudi",
  //   nominal: "500000",
  //   jenis: "Kredit",
  //   tanggal: "21/01/2024",
  // },
  // {
  //   id: "ID-1",
  //   nama: "Budi",
  //   nominal: "50000",
  //   jenis: "Kredit",
  //   tanggal: "21/01/2024",
  // },
];

app.get("/api/users", (req, res) => {
  res.json(users);
});

// Endpoint untuk mengedit user berdasarkan ID
app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  users = users.map((user) => (user.id === userId ? updatedUser : user));

  res.json(updatedUser);
});

// Endpoint untuk menghapus user berdasarkan ID
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  users = users.filter((user) => user.id !== userId);

  res.json({ message: "User deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
