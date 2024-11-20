const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const COMMENTS_FILE = 'comments.txt';

// ������ ������������ �� �����
function readComments() {
    if (fs.existsSync(COMMENTS_FILE)) {
        const commentsData = fs.readFileSync(COMMENTS_FILE, 'utf8');
        return JSON.parse(commentsData || '[]');
    }
    return [];
}

// ������ ������������ � ����
function writeComments(comments) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// ��������� ���� ������������
app.get('/comments', (req, res) => {
    const comments = readComments();
    res.json(comments);
});

// ���������� ������ �����������
app.post('/comments', (req, res) => {
    const { email, comment } = req.body;
    if (email && comment) {
        const comments = readComments();
        comments.push({ id: Date.now(), email, comment, date: new Date().toISOString() });
        writeComments(comments);
        res.status(200).json({ message: '����������� �������� �������' });
    } else {
        res.status(400).json({ error: '���� email � comment �����������' });
    }
});

// �������� ����������� �� ID
app.delete('/comments/:id', (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const comments = readComments();
    const updatedComments = comments.filter(comment => comment.id !== commentId);

    if (comments.length !== updatedComments.length) {
        writeComments(updatedComments);
        res.status(200).json({ message: '����������� ����� �������' });
    } else {
        res.status(404).json({ error: '����������� �� ������' });
    }
});

app.listen(PORT, () => {
    console.log(`������ ������� �� http://localhost:${PORT}`);
});