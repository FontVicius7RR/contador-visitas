const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la base de datos
const db = new sqlite3.Database("/tmp/visitas.db", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Base de datos conectada");
    db.run(`CREATE TABLE IF NOT EXISTS contador (id INTEGER PRIMARY KEY, visitas INTEGER)`, (err) => {
      if (err) console.error("Error al crear tabla:", err.message);
    });
  }
});

// Ruta para obtener el contador
app.get("/contador", (req, res) => {
  db.get("SELECT visitas FROM contador WHERE id = 1", (err, row) => {
    if (err) {
      res.status(500).send("Error al leer el contador");
    } else {
      res.send({ visitas: row ? row.visitas : 0 });
    }
  });
});

// Ruta para incrementar el contador
app.get("/incrementar", (req, res) => {
  db.run("INSERT OR IGNORE INTO contador (id, visitas) VALUES (1, 0)");
  db.run("UPDATE contador SET visitas = visitas + 1 WHERE id = 1", (err) => {
    if (err) {
      res.status(500).send("Error al incrementar el contador");
    } else {
      res.send({ mensaje: "Visita incrementada" });
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
