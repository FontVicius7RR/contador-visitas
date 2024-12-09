const { Pool } = require('pg');

// Configura el pool con la URL de conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usa esta variable de entorno en Render
  ssl: { rejectUnauthorized: false },
});

// Crea la tabla si no existe
pool.query(`CREATE TABLE IF NOT EXISTS contador (id SERIAL PRIMARY KEY, visitas INTEGER DEFAULT 0)`, (err) => {
  if (err) {
    console.error('Error al crear tabla:', err.message);
  } else {
    console.log('Tabla creada/verificada');
  }
});

// Rutas usando PostgreSQL
app.get('/contador', async (req, res) => {
  try {
    const result = await pool.query(`SELECT visitas FROM contador WHERE id = 1`);
    const visitas = result.rows[0]?.visitas || 0;
    res.send({ visitas });
  } catch (err) {
    res.status(500).send('Error al leer el contador');
  }
});

app.get('/incrementar', async (req, res) => {
  try {
    await pool.query(`INSERT INTO contador (id, visitas) VALUES (1, 0) ON CONFLICT (id) DO NOTHING`);
    await pool.query(`UPDATE contador SET visitas = visitas + 1 WHERE id = 1`);
    res.send({ mensaje: 'Visita incrementada' });
  } catch (err) {
    res.status(500).send('Error al incrementar el contador');
  }
});
