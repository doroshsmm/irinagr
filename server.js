const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const COMMENTS_FILE = 'comments.txt';

// Чтение комментариев из файла
function readComments() {
    if (fs.existsSync(COMMENTS_FILE)) {
        const commentsData = fs.readFileSync(COMMENTS_FILE, 'utf8');
        return JSON.parse(commentsData || '[]');
    }
    return [];
}

// Запись комментариев в файл
function writeComments(comments) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// Получение всех комментариев
app.get('/comments', (req, res) => {
    const comments = readComments();
    res.json(comments);
});

// Добавление нового комментария
app.post('/comments', (req, res) => {
    const { email, comment } = req.body;
    if (email && comment) {
        const comments = readComments();
        comments.push({ id: Date.now(), email, comment, date: new Date().toISOString() });
        writeComments(comments);
        res.status(200).json({ message: 'Комментарий добавлен успешно' });
    } else {
        res.status(400).json({ error: 'Поля email и comment обязательны' });
    }
});

// Удаление комментария по ID
app.delete('/comments/:id', (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const comments = readComments();
    const updatedComments = comments.filter(comment => comment.id !== commentId);

    if (comments.length !== updatedComments.length) {
        writeComments(updatedComments);
        res.status(200).json({ message: 'Комментарий удалён успешно' });
    } else {
        res.status(404).json({ error: 'Комментарий не найден' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});