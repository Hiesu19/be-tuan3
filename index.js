const express = require('express');
const mongoose = require('mongoose');

const db_url =
    'mongodb+srv://20225127:Hieu123@cluster0-hiesu.55zvq7w.mongodb.net/hieu_20225127?retryWrites=true&w=majority&appName=Cluster0-Hiesu';

const app = express();
app.use(express.json());

mongoose
    .connect(db_url)
    .then(() => console.log('Đã kết nối'))
    .catch((err) => console.log('DB error:', err));

const UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
});
const User = mongoose.model('User', UserSchema);

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ message: 'Danh sách user', users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'Ko thấy user' });
        }
        res.json({ message: 'User', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        if (!req.body.name || !req.body.email) {
            return res
                .status(400)
                .json({ message: 'Tên và email là bắt buộc' });
        }
        const check = await User.findOne({ email: req.body.id });
        if (check) {
            return res.status(400).json({ message: 'ID đã tồn tại' });
        }
        const newUser = await User.create(req.body);
        res.json({ message: 'Đã tạo user', newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });

        if (!user) {
            return res.status(404).json({ message: 'Ko thấy user' });
        }
        if (req.body.name !== undefined) {
            user.name = req.body.name;
        }

        if (req.body.email !== undefined) {
            user.email = req.body.email;
        }
        await user.save();

        res.json({ message: 'Đã cập nhật', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'Ko thấy user' });
        }
        await user.deleteOne();
        res.json({ message: 'Đã xóa user' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('3000'));
