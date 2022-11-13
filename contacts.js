const fs = require("fs/promises");
const path = require("path");
const ObjectID = require("bson-objectid");

const contactsPath = path.join(__dirname, "db/contacts.json");

const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
  const result = await fs.readFile(contactsPath);
  return JSON.parse(result);
};

const getById = async (contactId) => {
  const contacts = await listContacts();
  const result = await contacts.find((contact) => contact.id == contactId);
  if (!result) {
    return null;
  }
  return result;
};

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
  const newContact = {
    id: ObjectID(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  updateContacts(contacts);
  return newContact;
};

const removeById = async (id) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((item) => item.id == id);
  if (idx === -1) {
    return null;
  }

  const [result] = contacts.splice(idx, 1);
  updateContacts(contacts);
  return result;
};

module.exports = {
  listContacts,
  getById,
  addContact,
  removeById,
};
