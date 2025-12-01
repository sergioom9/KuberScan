import { DynamicEvent } from "../DB/dynamic.ts";
import express, { Request, Response } from "express";

const router = express.Router();

router.post("/save", async (req: Request, res: Response) => {
  try {
    const event = req.body;
    if (!event.k8s || !event.rule) {
      return res.status(400).json({ error: "Error" });
    }
    const newEvent = new DynamicEvent({
      podName: event.k8s.pod.name,
      namespace: event.k8s.namespace.name,
      rule: event.rule,
      output: event.output,
      priority: event.priority,
      fields: event,
    });
    await newEvent.save();
    res.status(200).json({ newEvent });
  } catch (_err: Error | any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;