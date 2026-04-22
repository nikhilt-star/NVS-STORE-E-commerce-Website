export const validators = {
  required: (value) => Boolean(value?.trim()),
  email: (value) => /\S+@\S+\.\S+/.test(value),
  minLength: (value, length) => value.trim().length >= length,
}
