const { pool } = require("../db/connect");

const menteesRepository = {
   loginByPhoneNumber: async (phone_number) => {
    try {
      const result = await pool.query(
        `SELECT * FROM mentees WHERE phone_number = $1`,
        [phone_number]
      );
      return result.rows[0]; // return null if not found
    } catch (error) {
      console.error("repository failed: loginByPhoneNumber", error);
      throw error;
    }
  },
  createMentee: async (data) => {
    try {
      const {
        full_name, email, phone_number, age_group, current_stage,
        key_goal, preferred_language, preferred_mentor_domain,
        availability, budget, questions_for_mentor, previous_attempts
      } = data;

      const result = await pool.query(
        `INSERT INTO mentees (
          full_name, email, phone_number, age_group, current_stage,
          key_goal, preferred_language, preferred_mentor_domain,
          availability, budget, questions_for_mentor, previous_attempts
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *`,
        [
          full_name, email, phone_number, age_group, current_stage,
          key_goal, preferred_language, preferred_mentor_domain,
          availability, budget, questions_for_mentor, previous_attempts
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error("repository failed: createMentee", error);
      throw error;
    }
  },

  getAllMentees: async (limit = 10, offset = 0) => {
    try {
      const result = await pool.query(
        `SELECT * FROM mentees ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error("repository failed: getAllMentees", error);
      throw error;
    }
  },

  getMenteeById: async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM mentees WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: getMenteeById", error);
      throw error;
    }
  },

  updateMenteeById: async (id, data) => {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);
      const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(", ");
      const query = `UPDATE mentees SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

      const result = await pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: updateMenteeById", error);
      throw error;
    }
  },

  deleteMenteeById: async (id) => {
    try {
      const result = await pool.query(`DELETE FROM mentees WHERE id = $1 RETURNING *`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: deleteMenteeById", error);
      throw error;
    }
  }
};

module.exports = menteesRepository;
