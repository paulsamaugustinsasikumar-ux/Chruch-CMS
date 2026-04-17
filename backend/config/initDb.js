const { getConnection } = require('./database');

const initDatabase = async () => {
  let connection;
  try {
    connection = await getConnection();

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log('Database connection established');

    // Create tables only if they don't exist
    await createTablesIfNotExist(connection);

    // Insert default admin user if not exists
    await createDefaultUser(connection);

    // Create division leaders if not exists
    await createDivisionLeaders(connection);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const createTablesIfNotExist = async (connection) => {
  // Create users table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100),
      role ENUM('admin', 'superadmin') DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create divisions table with leader login credentials
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS divisions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      division_name VARCHAR(100) NOT NULL,
      leader_name VARCHAR(100),
      login_username VARCHAR(50) UNIQUE,
      login_password VARCHAR(255),
      role ENUM('leader', 'youth_leader') DEFAULT 'leader',
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create families table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS families (
      id INT AUTO_INCREMENT PRIMARY KEY,
      family_name VARCHAR(100) NOT NULL,
      division_id INT,
      address TEXT,
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE SET NULL
    )
  `);

  // Create family_members table with division_id and type
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS family_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      family_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      relationship VARCHAR(50),
      date_of_birth DATE,
      gender ENUM('male', 'female'),
      phone VARCHAR(20),
      email VARCHAR(100),
      division_id INT,
      type ENUM('family', 'youth') DEFAULT 'family',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
      FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE SET NULL
    )
  `);

  // Create youth_members table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS youth_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      date_of_birth DATE,
      gender ENUM('male', 'female'),
      phone VARCHAR(20),
      email VARCHAR(100),
      address TEXT,
      division_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE SET NULL
    )
  `);
};

const createDefaultUser = async (connection) => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('HJC@007', 10);

    await connection.execute(`
      INSERT IGNORE INTO users (username, password, email, role)
      VALUES (?, ?, 'admin@church.com', 'superadmin')
    `, ['HJChosur', hashedPassword]);

    console.log('Default admin user ensured');
  } catch (error) {
    console.error('Error creating default user:', error.message);
    // Don't throw here, as this is not critical
  }
};

const createDivisionLeaders = async (connection) => {
  try {
    const bcrypt = require('bcryptjs');

    const leaders = [
      { name: 'Pr. Asher (Periyanna)', username: 'asher', password: '123456', role: 'leader' },
      { name: 'Pr. Jeba Kumar (Siva Kumar)', username: 'jebakumar', password: '123456', role: 'leader' },
      { name: 'Pr. Kiruba Karan (Sundar)', username: 'kirubakaran', password: '123456', role: 'leader' },
      { name: 'Pr. Micah (Mahalingam)', username: 'micah', password: '123456', role: 'leader' },
      { name: 'Pr. Jebastin (Thanish)', username: 'jebastin', password: '123456', role: 'youth_leader' },
      { name: 'Pr. Levi (Venkatesh)', username: 'levi', password: '123456', role: 'leader' }
    ];

    for (const leader of leaders) {
      const hashedPassword = await bcrypt.hash(leader.password, 10);

      // Insert division first
      const [divisionResult] = await connection.execute(`
        INSERT IGNORE INTO divisions (division_name, leader_name, login_username, login_password, role)
        VALUES (?, ?, ?, ?, ?)
      `, [`Division of ${leader.name}`, leader.name, leader.username, hashedPassword, leader.role]);

      console.log(`Division leader ${leader.name} ensured`);
    }
  } catch (error) {
    console.error('Error creating division leaders:', error.message);
  }
};

module.exports = initDatabase;