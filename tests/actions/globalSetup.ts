import { execSync } from "node:child_process";

export default function globalSetup() {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: "file:./prisma/test.db",
    },
  });
}
