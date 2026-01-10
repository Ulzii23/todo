import { relations } from "drizzle-orm";
import { user } from "./user";
import { task } from "./task";

export const usersRelations = relations(user, ({ many }) => ({
  tasks: many(task),
}));

export const tasksRelations = relations(task, ({ one }) => ({
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }), 
}));
