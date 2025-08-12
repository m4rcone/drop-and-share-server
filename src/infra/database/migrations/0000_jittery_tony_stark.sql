CREATE TABLE "uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"remote_key" text NOT NULL,
	"remote_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
