function validateAdminPayload(payload, isUpdate = false) {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Payload is missing or invalid" };
  }

  const { name, email, phone_number } = payload;

  if (!isUpdate) {
    if (!name || !email || !phone_number) {
      return { valid: false, error: "Missing required fields: name, email, phone_number" };
    }
  } else {
    if (Object.keys(payload).length === 0) {
      return { valid: false, error: "Request body cannot be empty" };
    }
  }

  if (name && typeof name !== "string") return { valid: false, error: "name must be a string" };
  if (email && typeof email !== "string") return { valid: false, error: "email must be a string" };
  if (phone_number && typeof phone_number !== "string") return { valid: false, error: "phone_number must be a string" };

  return { valid: true };
}

module.exports = { validateAdminPayload };
