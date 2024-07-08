const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const Debt = require('./models/Debt');

const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/debtmanager', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuración de Multer para la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para registrar deuda
app.post('/api/debts', async (req, res) => {
    const { documentNumber, company, amount, dueDate } = req.body;
    const debt = new Debt({ documentNumber, company, amount, dueDate });
    await debt.save();
    res.send(debt);
});

// Ruta para obtener deudas
app.get('/api/debts', async (req, res) => {
    const debts = await Debt.find();
    res.send(debts);
});

// Ruta para marcar deuda como pagada
app.put('/api/debts/:id', async (req, res) => {
    const debt = await Debt.findById(req.params.id);
    debt.paid = true;
    await debt.save();
    res.send(debt);
});

// Ruta para subir y procesar el archivo Excel
app.post('/api/upload', upload.single('file'), (req, res) => {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    data.forEach(async (row) => {
        const { documentNumber, company, amount, dueDate } = row;
        const debt = new Debt({ documentNumber, company, amount, dueDate: new Date(dueDate) });
        await debt.save();
    });

    res.send({ message: 'Deudas registradas exitosamente' });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

