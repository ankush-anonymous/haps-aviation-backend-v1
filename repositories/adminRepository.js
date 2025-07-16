const { pool } = require("../db/connect");

const adminRepository = {
   loginByPhoneNumber: async (phoneNumber) => {
    try {
      const result = await pool.query(
        `SELECT * FROM admins WHERE phone_number = $1`,
        [phoneNumber]
      );
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: loginByPhoneNumber", error);
      throw error;
    }
  },
  createAdmin: async (data) => {
    try {
      const { name, email, phone_number } = data;
      const result = await pool.query(
        `INSERT INTO admins (name, email, phone_number)
         VALUES ($1, $2, $3) RETURNING *`,
        [name, email, phone_number]
      );
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: createAdmin", error);
      throw error;
    }
  },

  getAllAdmins: async (limit = 10, offset = 0) => {
    try {
      const result = await pool.query(
        `SELECT * FROM admins ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error("repository failed: getAllAdmins", error);
      throw error;
    }
  },

  getAdminById: async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM admins WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: getAdminById", error);
      throw error;
    }
  },

  updateAdminById: async (id, data) => {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);

      const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(", ");
      const query = `UPDATE admins SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

      const result = await pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: updateAdminById", error);
      throw error;
    }
  },

  deleteAdminById: async (id) => {
    try {
      const result = await pool.query(`DELETE FROM admins WHERE id = $1 RETURNING *`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: deleteAdminById", error);
      throw error;
    }
  },
};

module.exports = adminRepository;
