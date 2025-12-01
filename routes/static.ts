import express, { Request, Response } from "express";
import { TrivyScan } from "../types.ts";
import { KuberScan } from "../DB/static.ts";
import { trivyScan } from "../util.ts";

const router = express.Router();

router.get("/:scanid", async (req: Request, res: Response) => {
  try {
    const scanid = req.params.scanid;
    if (!scanid) {
      return res.status(400).json({ error: "Missing params" });
    }
    const scan: TrivyScan | null = await KuberScan.findOne({ ScanID: scanid })
      .select(
        "-__v -_id",
      );
    if (!scan) {
      return res.status(404).json({ error: "Not Found" });
    }
    res.status(200).json(scan);
  } catch (_err: Error | any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/save", async (req: Request, res: Response) => {
  try {
    if (req.body.image == null || req.body.Vulnerability == null) {
      return res.status(400).json({ error: "Missing params" });
    }
    const uuid = crypto.randomUUID();
    const scan = new KuberScan({
      ScanID: uuid,
      image: req.body.image,
      Vulnerability: [],
    });
    await scan.save();
    if (!scan) {
      res.status(409).json({ error: "Error creating scan" });
    }
    res.status(200).json({ scan });
  } catch (_err: Error | any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/scan", async (req: Request, res: Response) => {
  try {
    if (req.body.image == null) {
      return res.status(400).json({ error: "Missing params" });
    }
    const initscan = await fetch("http://localhost:3000/static/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: req.body.image,
        Vulnerability: [],
      }),
    });
    const initScanData = await initscan.json();
    const scanId = initScanData.scan.ScanID;
    (async () => {
      try {
        const result = await trivyScan(req.body.image);
        await KuberScan.updateOne(
          { ScanID: scanId },
          {
            $set: {
              status: "done",
              Vulnerability: result.Results[0].Vulnerabilities
                ? result.Results[0].Vulnerabilities
                : [],
            },
          },
        );
      } catch (e: Error | any) {
        await KuberScan.updateOne(
          { ScanID: scanId },
          {
            $set: { status: "Error" + e.message },
          },
        );
      }
    })();
    res.status(200).json({ scanId });
  } catch (err: any) {
    res.status(500).json({ error: err });
  }
});

export default router;
