// Mock database for demo purposes
const users = [
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j1',
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'demo123', // In real app this would be hashed
    role: 'admin',
    isActive: true,
    joinedProjects: [],
    __v: 0,
    toJSON: function() {
      const user = { ...this };
      delete user.password;
      return user;
    }
  }
];

const findUserByEmail = async (email) => {
  return users.find(user => user.email === email) || null;
};

const findUserById = async (id) => {
  return users.find(user => user._id === id) || null;
};

const updateUser = async (id, updateData) => {
  const index = users.findIndex(user => user._id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updateData };
  return users[index];
};

const createUser = async (userData) => {
  const newUser = {
    _id: Date.now().toString(),
    ...userData,
    isActive: true,
    joinedProjects: [],
    __v: 0,
    toJSON: function() {
      const user = { ...this };
      delete user.password;
      return user;
    }
  };
  users.push(newUser);
  return newUser;
};

module.exports = {
  users,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser
};
