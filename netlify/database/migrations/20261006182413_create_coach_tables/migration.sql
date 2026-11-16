CREATE TABLE "coach_mistakes" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"subject" text NOT NULL,
	"topic" text DEFAULT '' NOT NULL,
	"question" text NOT NULL,
	"chosen" text DEFAULT '' NOT NULL,
	"correct" text DEFAULT '' NOT NULL,
	"options" jsonb DEFAULT '[]' NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_profiles" (
	"user_id" text PRIMARY KEY,
	"hints" jsonb DEFAULT '[]' NOT NULL,
	"mission" jsonb,
	"events_at_gen" integer DEFAULT 0 NOT NULL,
	"events" integer DEFAULT 0 NOT NULL,
	"generated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "coach_stats" (
	"user_id" text,
	"subject" text,
	"correct" integer DEFAULT 0 NOT NULL,
	"wrong" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coach_stats_pkey" PRIMARY KEY("user_id","subject")
);
--> statement-breakpoint
CREATE INDEX "coach_mistakes_user_idx" ON "coach_mistakes" ("user_id","resolved");