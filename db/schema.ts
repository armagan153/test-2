import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "agent"] }).default("agent").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Customers table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Calls table
export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  agentId: integer("agent_id").references(() => users.id).notNull(),
  notes: text("notes"),
  duration: integer("duration"), // in seconds
  status: text("status", { enum: ["completed", "missed", "followup"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  assignedTo: integer("assigned_to").references(() => users.id),
  customerId: integer("customer_id").references(() => customers.id),
  status: text("status", { enum: ["pending", "in_progress", "completed"] }).default("pending").notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  calls: many(calls),
  tasks: many(tasks)
}));

export const callsRelations = relations(calls, ({ one }) => ({
  customer: one(customers, {
    fields: [calls.customerId],
    references: [customers.id]
  }),
  agent: one(users, {
    fields: [calls.agentId],
    references: [users.id]
  })
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id]
  }),
  customer: one(customers, {
    fields: [tasks.customerId],
    references: [customers.id]
  })
}));

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);
export const insertCallSchema = createInsertSchema(calls);
export const selectCallSchema = createSelectSchema(calls);
export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type Call = typeof calls.$inferSelect;
export type InsertCall = typeof calls.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
