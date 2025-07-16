function validateMeetingPayload(payload, isUpdate = false) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: "Payload is missing or invalid" };
  }

  const {
    mentor_id, mentee_id, scheduled_datetime, duration_minutes,
    mode_of_meeting, meeting_link, status,
    reschedule_requested, reschedule_reason,
    notes_mentor, notes_mentee, session_recording
  } = payload;

  if (!isUpdate) {
    if (!mentor_id || !mentee_id || !scheduled_datetime || !duration_minutes) {
      return {
        valid: false,
        error: "Missing required fields: mentor_id, mentee_id, scheduled_datetime, duration_minutes"
      };
    }
  }

  if (mentor_id && typeof mentor_id !== "string") return { valid: false, error: "mentor_id must be a string (UUID)" };
  if (mentee_id && typeof mentee_id !== "string") return { valid: false, error: "mentee_id must be a string (UUID)" };
  if (scheduled_datetime && isNaN(Date.parse(scheduled_datetime))) return { valid: false, error: "scheduled_datetime must be a valid date" };
  if (duration_minutes && typeof duration_minutes !== "number") return { valid: false, error: "duration_minutes must be a number" };
  if (mode_of_meeting && typeof mode_of_meeting !== "string") return { valid: false, error: "mode_of_meeting must be a string" };
  if (meeting_link && typeof meeting_link !== "string") return { valid: false, error: "meeting_link must be a string" };
  if (status && !["Scheduled", "Completed", "Cancelled", "No Show"].includes(status)) {
    return { valid: false, error: "Invalid status value" };
  }
  if (reschedule_requested !== undefined && typeof reschedule_requested !== "boolean") {
    return { valid: false, error: "reschedule_requested must be a boolean" };
  }
  if (reschedule_reason && typeof reschedule_reason !== "string") {
    return { valid: false, error: "reschedule_reason must be a string" };
  }
  if (notes_mentor && typeof notes_mentor !== "string") {
    return { valid: false, error: "notes_mentor must be a string" };
  }
  if (notes_mentee && typeof notes_mentee !== "string") {
    return { valid: false, error: "notes_mentee must be a string" };
  }
  if (session_recording && typeof session_recording !== "string") {
    return { valid: false, error: "session_recording must be a string" };
  }

  return { valid: true };
}

module.exports = { validateMeetingPayload };
