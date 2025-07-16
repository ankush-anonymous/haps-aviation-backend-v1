function validateMentorPayload(payload, isUpdate = false) {
  const {
    first_name, last_name, email, phone_number, linkedin_url, current_occ_role,
    years_of_experience, area_of_expertise, availability_slots, profile_bio,
    languages_spoken, mentoring_fee, level_comfortable, documents, requirements_from_mentees
  } = payload;

  if (!isUpdate) {
    if (!first_name || !last_name || !email || !phone_number || !current_occ_role || !level_comfortable) {
      return { valid: false, error: "Missing required fields: first_name, last_name, email, phone_number, current_occ_role, or level_comfortable" };
    }
  } else {
    if (!payload || Object.keys(payload).length === 0) {
      return { valid: false, error: "Request body cannot be empty" };
    }
  }

  // Type validations
  if (first_name && typeof first_name !== "string") return { valid: false, error: "first_name must be a string" };
  if (last_name && typeof last_name !== "string") return { valid: false, error: "last_name must be a string" };
  if (email && typeof email !== "string") return { valid: false, error: "email must be a string" };
  if (phone_number && typeof phone_number !== "string") return { valid: false, error: "phone_number must be a string" };
  if (linkedin_url && typeof linkedin_url !== "string") return { valid: false, error: "linkedin_url must be a string" };
  if (current_occ_role && typeof current_occ_role !== "string") return { valid: false, error: "current_occ_role must be a string" };
  if (years_of_experience && typeof years_of_experience !== "number") return { valid: false, error: "years_of_experience must be a number" };
  if (area_of_expertise && !Array.isArray(area_of_expertise)) return { valid: false, error: "area_of_expertise must be an array" };
  if (availability_slots && !Array.isArray(availability_slots)) return { valid: false, error: "availability_slots must be an array" };
  if (profile_bio && typeof profile_bio !== "string") return { valid: false, error: "profile_bio must be a string" };
  if (languages_spoken && !Array.isArray(languages_spoken)) return { valid: false, error: "languages_spoken must be an array" };
  if (mentoring_fee && typeof mentoring_fee !== "number") return { valid: false, error: "mentoring_fee must be a number" };
  if (level_comfortable && typeof level_comfortable !== "string") return { valid: false, error: "level_comfortable must be a string" };
  if (documents && !Array.isArray(documents)) return { valid: false, error: "documents must be an array" };
  if (requirements_from_mentees && typeof requirements_from_mentees !== "string") {
    return { valid: false, error: "requirements_from_mentees must be a string" };
  }

  return { valid: true };
}

module.exports = { validateMentorPayload };
