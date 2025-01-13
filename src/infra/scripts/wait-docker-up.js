const { exec } = require("node:child_process");
let count = 0;
let clock = ["🕛", "🕑", "🕒", "🕓", "🕕", "🕖", "🕘", "🕙"];

function check_postgres() {
  exec("docker exec develop-readify pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(
        `\r${clock[count % clock.length]} Waiting PostgreSQL accept connections...`,
      );
      count++;
      check_postgres();
      return;
    }
    process.stdout.write("\r" + " ".repeat(50) + "\r"); // Limpa a linha
    process.stdout.write(
      "\n✅ PostgreSQL is ready and accepting connections!\n\n",
    );
  }
}

check_postgres();
