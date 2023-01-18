const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Dogukan Mr',
    email: 'dogukan@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Andrea Garcia',
    email: 'andrea@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

module.exports = users;
