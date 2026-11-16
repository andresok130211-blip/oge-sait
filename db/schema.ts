import { pgTable, serial, text, timestamp, integer, boolean, jsonb, primaryKey, index } from "drizzle-orm/pg-core";

// Every wrong answer a student gives — the coach's "memory" of mistakes
export const coachMistakes = pgTable(
  "coach_mistakes",
  {
    id: serial().primaryKey(),
    userId: text("user_id").notNull(),
    subject: text().notNull(),
    topic: text().notNull().default(""),
    question: text().notNull(),
    chosen: text().notNull().default(""),
    correct: text().notNull().default(""),
    options: jsonb().$type<string[]>().notNull().default([]),
    resolved: boolean().notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("coach_mistakes_user_idx").on(t.userId, t.resolved)]
);

// Right / wrong counters per subject for each student
export const coachStats = pgTable(
  "coach_stats",
  {
    userId: text("user_id").notNull(),
    subject: text().notNull(),
    correct: integer().notNull().default(0),
    wrong: integer().notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.subject] })]
);

// Latest AI-generated plan (hints + mission) for each student
export const coachProfiles = pgTable("coach_profiles", {
  userId: text("user_id").primaryKey(),
  hints: jsonb().$type<{ title: string; text: string; subject?: string }[]>().notNull().default([]),
  mission: jsonb().$type<{ subject: string; topic?: string; title: string; desc: string } | null>(),
  eventsAtGen: integer("events_at_gen").notNull().default(0),
  events: integer().notNull().default(0),
  generatedAt: timestamp("generated_at"),
});
