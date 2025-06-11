const db = require("../database");
const bcrypt = require("bcryptjs");

const registerUser = (user, callback) => {
    const { username, email, phone, password, user_type } = user;
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if user already exists
    const checkQuery = "SELECT * FROM Register_data WHERE username = ? OR email = ? OR phone = ?";
    db.query(checkQuery, [username, email, phone], (err, results) => {
        if (err) return callback(err, null);

        if (results.length > 0) {
            return callback({ message: "Username, email, or phone already exists!" }, null);
        }

        // Insert new user
        const insertQuery = "INSERT INTO Register_data (username, email, phone, password, user_type) VALUES (?, ?, ?, ?, ?)";
        db.query(insertQuery, [username, email, phone, hashedPassword, user_type], (err, result) => {
            if (err) return callback(err, null);
            return callback(null, { message: "User registered successfully!" });
        });
    });
};

module.exports = { registerUser };
