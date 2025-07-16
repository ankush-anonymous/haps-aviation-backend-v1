const { pool } = require("../db/connect");

const mentorsRepository = {
    loginMentorByPhone: async (phone_number) => {
    try {
      const result = await pool.query("SELECT * FROM mentors WHERE phone_number = $1", [phone_number]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: loginMentorByPhone", error);
      throw error;
    }
  },
  createMentor: async (mentorData) => {
    try {
      const {
        first_name, last_name, email, phone_number, linkedin_url, current_occ_role,
        years_of_experience, area_of_expertise, availability_slots, profile_bio,
        languages_spoken, mentoring_fee, level_comfortable, documents, requirements_from_mentees
      } = mentorData;

      const result = await pool.query(
        `INSERT INTO mentors (
          first_name, last_name, email, phone_number, linkedin_url, current_occ_role,
          years_of_experience, area_of_expertise, availability_slots, profile_bio,
          languages_spoken, mentoring_fee, level_comfortable, documents, requirements_from_mentees
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING *`,
        [
          first_name, last_name, email, phone_number, linkedin_url, current_occ_role,
          years_of_experience, area_of_expertise, availability_slots, profile_bio,
          languages_spoken, mentoring_fee, level_comfortable, documents, requirements_from_mentees
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error("repository failed: createMentor", error);
      throw error;
    }
  },

  getAllMentors: async (limit = 10, offset = 0) => {
    try {
      const result = await pool.query(
        `SELECT * FROM mentors ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error("repository failed: getAllMentors", error);
      throw error;
    }
  },

  getMentorById: async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM mentors WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: getMentorById", error);
      throw error;
    }
  },

  updateMentorById: async (id, data) => {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);

      const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(", ");
      const query = `UPDATE mentors SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

      const result = await pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: updateMentorById", error);
      throw error;
    }
  },

  deleteMentorById: async (id) => {
    try {
      const result = await pool.query(`DELETE FROM mentors WHERE id = $1 RETURNING *`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: deleteMentorById", error);
      throw error;
    }
  }
};

module.exports = mentorsRepository;
