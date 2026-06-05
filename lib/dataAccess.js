import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'mockDB.json');

export function getDB() {
  const fileContent = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(fileContent);
}

export function authenticate(username, password) {
  const db = getDB();
  return db.matchmakers.find(m => m.username === username && m.password === password);
}

export function getAssignedCustomers(matchmakerId) {
  const db = getDB();
  const assignedIds = db.assignments[matchmakerId] || [];
  return db.profiles.filter(p => assignedIds.includes(p.id));
}

export function getCustomerById(id) {
  const db = getDB();
  return db.profiles.find(p => p.id === id);
}

export function getAllProfiles() {
  const db = getDB();
  return db.profiles;
}
