/**
 * User Model — JSON File Storage
 * Users are stored in backend/data/users.json
 * Each user: { id, username, email, password (hashed), createdAt }
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function findByEmail(email) {
    const users = readUsers();
    return users.find((u) => u.email === email) || null;
}

function findById(id) {
    const users = readUsers();
    return users.find((u) => u.id === id) || null;
}

function createUser({ username, email, password }) {
    const users = readUsers();
    const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
}

module.exports = { findByEmail, findById, createUser };
