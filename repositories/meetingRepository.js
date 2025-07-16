const { pool } = require("../db/connect");

const meetingRepository = {
  createMeeting: async (data) => {
    try {
      const {
        mentor_id, mentee_id, scheduled_datetime, duration_minutes,
        mode_of_meeting, meeting_link, status, reschedule_requested,
        reschedule_reason, notes_mentor, notes_mentee, session_recording
      } = data;

      const result = await pool.query(
        `INSERT INTO meeting_dtls (
          mentor_id, mentee_id, scheduled_datetime, duration_minutes,
          mode_of_meeting, meeting_link, status, reschedule_requested,
          reschedule_reason, notes_mentor, notes_mentee, session_recording
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *`,
        [
          mentor_id, mentee_id, scheduled_datetime, duration_minutes,
          mode_of_meeting, meeting_link, status, reschedule_requested,
          reschedule_reason, notes_mentor, notes_mentee, session_recording
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: createMeeting", error);
      throw error;
    }
  },

  getAllMeetings: async (limit = 10, offset = 0) => {
    try {
      const result = await pool.query(
        `SELECT * FROM meeting_dtls ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error("repository failed: getAllMeetings", error);
      throw error;
    }
  },

  getMeetingById: async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM meeting_dtls WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: getMeetingById", error);
      throw error;
    }
  },

  updateMeetingById: async (id, data) => {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);
      const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(", ");
      const query = `UPDATE meeting_dtls SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

      const result = await pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: updateMeetingById", error);
      throw error;
    }
  },

  deleteMeetingById: async (id) => {
    try {
      const result = await pool.query(`DELETE FROM meeting_dtls WHERE id = $1 RETURNING *`, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("repository failed: deleteMeetingById", error);
      throw error;
    }
  }
};

module.exports = meetingRepository;
