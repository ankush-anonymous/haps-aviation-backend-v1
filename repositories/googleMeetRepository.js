const {pool} = require('../db/connect'); // assuming you use `pg` pool

exports.saveGoogleTokens = async (userEmail, tokens) => {
  const { access_token, refresh_token, scope, token_type, expiry_date } = tokens;

  await pool.query(
    `
    INSERT INTO google_tokens (user_email, access_token, refresh_token, scope, token_type, expiry_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_email) DO UPDATE
    SET access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        scope = EXCLUDED.scope,
        token_type = EXCLUDED.token_type,
        expiry_date = EXCLUDED.expiry_date
    `,
    [userEmail, access_token, refresh_token, scope, token_type, expiry_date]
  );
};

exports.getGoogleTokens = async (userEmail) => {
  const result = await pool.query(
    'SELECT * FROM google_tokens WHERE user_email = $1',
    [userEmail]
  );
  return result.rows[0];
};
