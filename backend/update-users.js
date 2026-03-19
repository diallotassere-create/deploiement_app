const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function updatePasswords() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'user_management',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to MySQL database');

    const password = 'user123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    console.log('Updating user passwords...');
    
    const [result] = await db.execute(
      'UPDATE users SET password_hash = ? WHERE role = ?',
      [hash, 'user']
    );

    console.log(`Updated ${result.affectedRows} user records`);
    
    await db.end();
    console.log('✅ Passwords updated successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updatePasswords();
