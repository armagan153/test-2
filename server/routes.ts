import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { customers, calls, tasks } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Auth routes
  setupAuth(app);

  // Customer routes
  app.get("/api/customers", async (req, res) => {
    const allCustomers = await db.query.customers.findMany({
      orderBy: desc(customers.createdAt)
    });
    res.json(allCustomers);
  });

  app.post("/api/customers", async (req, res) => {
    const customer = await db.insert(customers).values(req.body).returning();
    res.json(customer[0]);
  });

  // Call routes
  app.get("/api/calls", async (req, res) => {
    const allCalls = await db.query.calls.findMany({
      with: {
        customer: true,
        agent: true
      },
      orderBy: desc(calls.createdAt)
    });
    res.json(allCalls);
  });

  app.post("/api/calls", async (req, res) => {
    const call = await db.insert(calls).values(req.body).returning();
    res.json(call[0]);
  });

  // Task routes 
  app.get("/api/tasks", async (req, res) => {
    const allTasks = await db.query.tasks.findMany({
      with: {
        assignee: true,
        customer: true
      },
      orderBy: desc(tasks.createdAt)
    });
    res.json(allTasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const task = await db.insert(tasks).values(req.body).returning();
    res.json(task[0]);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const task = await db.update(tasks)
      .set(req.body)
      .where(eq(tasks.id, parseInt(req.params.id)))
      .returning();
    res.json(task[0]);
  });

  const httpServer = createServer(app);
  return httpServer;
}
