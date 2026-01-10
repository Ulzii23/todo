import { pgTable, integer, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const task = pgTable("tasks", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    userId: integer("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

    name: varchar({ length: 255 }).notNull(),

    isDone: boolean().default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),

});
