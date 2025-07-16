function validateMenteePayload(payload, isUpdate = false) {
  const {
    full_name, email, phone_number, age_group, current_stage,
    key_goal, preferred_language, preferred_mentor_domain,
    availability, budget, questions_for_mentor, previous_attempts
  } = payload;

  if (!isUpdate) {
    if (!full_name || !email) {
      return { valid: false, error: "Missing required fields: full_name or email" };
    }
  } else {
    if (!payload || Object.keys(payload).length === 0) {
      return { valid: false, error: "Request body cannot be empty" };
    }
  }

  // Type validations
  if (full_name && typeof full_name !== "string") return { valid: false, error: "full_name must be a string" };
  if (email && typeof email !== "string") return { valid: false, error: "email must be a string" };
  if (phone_number && typeof phone_number !== "string") return { valid: false, error: "phone_number must be a string" };
  if (age_group && typeof age_group !== "string") return { valid: false, error: "age_group must be a string" };
  if (current_stage && typeof current_stage !== "string") return { valid: false, error: "current_stage must be a string" };
  if (key_goal && typeof key_goal !== "string") return { valid: false, error: "key_goal must be a string" };
  if (preferred_language && typeof preferred_language !== "string") return { valid: false, error: "preferred_language must be a string" };
  if (preferred_mentor_domain && !Array.isArray(preferred_mentor_domain)) return { valid: false, error: "preferred_mentor_domain must be an array" };
  if (availability && !Array.isArray(availability)) return { valid: false, error: "availability must be an array" };
  if (budget && typeof budget !== "number") return { valid: false, error: "budget must be a number" };
  if (questions_for_mentor && typeof questions_for_mentor !== "string") return { valid: false, error: "questions_for_mentor must be a string" };
  if (previous_attempts && typeof previous_attempts !== "string") return { valid: false, error: "previous_attempts must be a string" };

  return { valid: true };
}

module.exports = { validateMenteePayload };
