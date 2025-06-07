import bcript from "bcryptjs";

async function hash(password) {
  const rounds = Number(process.env.BCRYPT_ROUNDS);
  return await bcript.hash(addPepper(password), rounds);
}

async function compare(providedPassword, storedPassword) {
  return await bcript.compare(addPepper(providedPassword), storedPassword);
}

function addPepper(password) {
  const pepper = process.env.PASSWORD_PEPPER;
  return password + pepper;
}

const password = {
  hash: hash,
  compare: compare,
};

export default password;
