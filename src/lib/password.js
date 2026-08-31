// Re-exported from password.mjs so the same implementation is used by the app
// (via webpack) and by the Node test runner (which imports the .mjs directly).
export { hashPassword, verifyPassword } from "./password.mjs";
