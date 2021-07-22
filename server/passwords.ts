import crypto from "crypto";
function genPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha256")
    .toString("hex");

  return { salt, hash };
}

function validatePassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha256")
    .toString("hex");
  return hash === hashVerify;
}

export { genPassword, validatePassword };
