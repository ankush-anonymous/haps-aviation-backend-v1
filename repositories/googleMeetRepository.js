
const { pool } = require("../db/connect");

const saveToken = async ({ mentor_email, access_token, refresh_token, scope, token_type, expiry_date }) => {
    const query = `
        INSERT INTO google_tokens (mentor_email, access_token, refresh_token, scope, token_type, expiry_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [mentor_email, access_token, refresh_token, scope, token_type, expiry_date];
    try {
        const result = await pool.query(query, values);
        console.log(`Token saved for ${mentor_email}`);
        return result.rows[0];
    } catch (error) {
        console.error('Error saving Google token:', error);
        throw error;
    }
};


const updateToken = async ({ mentor_email, access_token, refresh_token, scope, token_type, expiry_date }) => {
    const query = `
        UPDATE google_tokens
        SET
            access_token = $2,
            refresh_token = $3,
            scope = $4,
            token_type = $5,
            expiry_date = $6,
            updated_at = NOW()
        WHERE mentor_email = $1
        RETURNING *;
    `;
    const values = [mentor_email, access_token, refresh_token, scope, token_type, expiry_date];
    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            console.warn(`No token found to update for ${mentor_email}`);
            return null;
        }
        console.log(`Token updated for ${mentor_email}`);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating Google token:', error);
        throw error;
    }
};

const getTokenByEmail = async (mentor_email) => {
    const query = `
        SELECT * FROM google_tokens
        WHERE mentor_email = $1;
    `;
    try {
        const result = await pool.query(query, [mentor_email]);
        return result.rows[0] || null;
    } catch (error) {
        console.error(`Error fetching Google token for ${mentor_email}:`, error);
        throw error;
    }
};

module.exports = {
    saveToken,
    updateToken,
    getTokenByEmail,
};

