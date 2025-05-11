// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

export default defineConfig({
	schema: "./db/schema.ts", // path to your schema file
	out: "./db/migrations", // where migrations will be stored
	dialect: "postgresql", // database dialect
	dbCredentials: {
		url: process.env.DATABASE_URL!, // your database URL
	},
	verbose: true, // show detailed output
	strict: true, // ask for confirmation
});
