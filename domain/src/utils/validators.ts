export function validatePassword(password: string): Error | null {
  if (password.length < 8) {
    return new Error("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    return new Error("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    return new Error("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    return new Error("Password must contain at least one number");
  }

  return null;
}
