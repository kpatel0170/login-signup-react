// // UserRepository.js

// import pool from "./db.js"; // Import your PostgreSQL connection pool or client here

// class UserRepository {
//   async createUser(userBody) {
//     const { name, email } = userBody;
//     const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
//     const values = [name, email];

//     const { rows } = await pool.query(query, values);
//     return rows[0]; // Return the created user
//   }

//   async getAllUsers() {
//     const query = "SELECT * FROM users";

//     const { rows } = await pool.query(query);
//     return rows; // Return all users
//   }

//   async getUserById(userId) {
//     const query = "SELECT * FROM users WHERE id = $1";
//     const values = [userId];

//     const { rows } = await pool.query(query, values);
//     return rows[0]; // Return the user
//   }

//   async updateUserById(userId, updateBody) {
//     const { name, email } = updateBody;
//     const query =
//       "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *";
//     const values = [name, email, userId];

//     const { rows } = await pool.query(query, values);
//     return rows[0]; // Return the updated user
//   }

//   async deleteUserById(userId) {
//     const query = "DELETE FROM users WHERE id = $1 RETURNING *";
//     const values = [userId];

//     const { rows } = await pool.query(query, values);
//     return rows[0]; // Return the deleted user
//   }
// }

// export default UserRepository;
