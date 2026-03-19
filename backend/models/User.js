class User {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    try {
      const [rows] = await this.db.execute(`
        SELECT id, nom, prenom, email, telephone, date_naissance, 
               adresse, ville, code_postal, pays, role, is_active, created_at, updated_at
        FROM users 
        ORDER BY created_at DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const [rows] = await this.db.execute(`
        SELECT id, nom, prenom, email, telephone, date_naissance, 
               adresse, ville, code_postal, pays, role, is_active, created_at, updated_at
        FROM users 
        WHERE id = ?
      `, [id]);
      
      if (rows.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const bcrypt = require('bcryptjs');
      const { nom, prenom, email, password, telephone, date_naissance, adresse, ville, code_postal, pays } = userData;
      
      // Hasher le mot de passe s'il est fourni
      let password_hash = null;
      if (password) {
        const saltRounds = 10;
        password_hash = await bcrypt.hash(password, saltRounds);
      }
      
      const [result] = await this.db.execute(`
        INSERT INTO users (nom, prenom, email, password_hash, telephone, date_naissance, adresse, ville, code_postal, pays, role)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user')
      `, [nom, prenom, email, password_hash, telephone, date_naissance, adresse, ville, code_postal, pays]);
      
      return await this.getById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Cet email existe déjà');
      }
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    }
  }

  async update(id, userData) {
    try {
      const { nom, prenom, email, telephone, date_naissance, adresse, ville, code_postal, pays } = userData;
      
      const [result] = await this.db.execute(`
        UPDATE users 
        SET nom = ?, prenom = ?, email = ?, telephone = ?, date_naissance = ?, 
            adresse = ?, ville = ?, code_postal = ?, pays = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [nom, prenom, email, telephone, date_naissance, adresse, ville, code_postal, pays, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      return await this.getById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Cet email existe déjà');
      }
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const [result] = await this.db.execute('DELETE FROM users WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
    }
  }

  async updateProfile(id, userData) {
    try {
      const { nom, prenom, telephone, date_naissance, adresse, ville, code_postal, pays } = userData;
      const [result] = await this.db.execute(`
        UPDATE users 
        SET nom = ?, prenom = ?, telephone = ?, date_naissance = ?, adresse = ?, ville = ?, code_postal = ?, pays = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [nom, prenom, telephone, date_naissance, adresse, ville, code_postal, pays, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const [rows] = await this.db.execute(`
        SELECT id, nom, prenom, telephone, date_naissance, adresse, ville, code_postal, pays, role, created_at, updated_at 
        FROM users 
        WHERE id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    }
  }

  async changePassword(id, currentPassword, newPassword) {
    try {
      const [rows] = await this.db.execute(`
        SELECT password_hash 
        FROM users 
        WHERE id = ?
      `, [id]);
      
      if (rows.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(currentPassword, rows[0].password_hash);
      
      if (!isValidPassword) {
        throw new Error('Mot de passe actuel incorrect');
      }

      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      await this.db.execute(`
        UPDATE users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [newPasswordHash, id]);

      return true;
    } catch (error) {
      throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
  }

  async changePasswordByAdmin(id, newPassword) {
    try {
      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      await this.db.execute(`
        UPDATE users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [newPasswordHash, id]);

      return true;
    } catch (error) {
      throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const [rows] = await this.db.execute(`
        SELECT id, nom, prenom, email, password_hash, role, is_active 
        FROM users 
        WHERE email = ?
      `, [email]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error.message}`);
    }
  }
}

module.exports = User;
