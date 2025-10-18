const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function _ensureUsersFile() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
        await fs.access(USERS_FILE);
    } catch {
        await fs.writeFile(USERS_FILE, '[]', 'utf8');
    }
}

async function _readUsers() {
    await _ensureUsersFile();
    const content = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(content || '[]');
}

async function _writeUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

/**
 * registerUser(data)
 * data: { name?, email, password }
 * - valida campos mínimos
 * - evita emails duplicados
 * - guarda usuario con salt + hash de la contraseña
 * - devuelve el usuario creado (sin hash/salt)
 */
async function registerUser(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Datos de usuario inválidos');
    }
    const email = (data.email || '').toLowerCase().trim();
    const password = String(data.password || '');

    if (!email || !password) {
        throw new Error('Email y contraseña son obligatorios');
    }

    const users = await _readUsers();
    if (users.find(u => u.email === email)) {
        throw new Error('Ya existe un usuario con ese email');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

    const newUser = {
        id: Date.now().toString(),
        name: data.name || '',
        email,
        passwordHash: hash,
        salt,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await _writeUsers(users);

    // devolver sin datos sensibles
    const { passwordHash, salt: _s, ...publicUser } = newUser;
    return publicUser;
}

module.exports = { registerUser };