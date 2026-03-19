-- Initialisation de la base de données pour la gestion des utilisateurs

CREATE DATABASE IF NOT EXISTS user_management;

USE user_management;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    date_naissance DATE,
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    pays VARCHAR(100),
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Insertion d'un administrateur par défaut (mot de passe: admin123)
INSERT INTO users (nom, prenom, email, password_hash, telephone, date_naissance, adresse, ville, code_postal, pays, role) VALUES
('Admin', 'Système', 'admin@usermanagement.com', '$2a$10$T8T5tIEKymfKmbYHWyjLD.5wBJh0GxRLa5PV/cLzUCVq7LHXPo652', '771234567', '1990-01-01', 'Adresse Admin', 'Dakar', '10000', 'Sénégal', 'admin');

-- Insertion d'utilisateurs de test avec mots de passe hashés (mot de passe: user123)
INSERT INTO users (nom, prenom, email, password_hash, telephone, date_naissance, adresse, ville, code_postal, pays, role) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '$2a$10$T8T5tIEKymfKmbYHWyjLD.5wBJh0GxRLa5PV/cLzUCVq7LHXPo652', '0123456789', '1990-05-15', '123 Rue de la Paix', 'Paris', '75001', 'France', 'user'),
('Martin', 'Sophie', 'sophie.martin@email.com', '$2a$10$T8T5tIEKymfKmbYHWyjLD.5wBJh0GxRLa5PV/cLzUCVq7LHXPo652', '0623456789', '1985-08-22', '456 Avenue des Champs', 'Lyon', '69000', 'France', 'user'),
('Bernard', 'Pierre', 'pierre.bernard@email.com', '$2a$10$T8T5tIEKymfKmbYHWyjLD.5wBJh0GxRLa5PV/cLzUCVq7LHXPo652', '0434567890', '1978-12-03', '789 Boulevard du Soleil', 'Marseille', '13000', 'France', 'user'),
('Petit', 'Marie', 'marie.petit@email.com', '$2a$10$T8T5tIEKymfKmbYHWyjLD.5wBJh0GxRLa5PV/cLzUCVq7LHXPo652', '0567890123', '1992-03-17', '321 Place de la République', 'Bordeaux', '33000', 'France', 'user');
