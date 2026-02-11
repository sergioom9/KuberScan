import express, { Request, Response } from "npm:express@4.18.2";
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
      .select("-__v -_id");
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
    if (req.body.image == null) {
      return res.status(400).json({ error: "Missing params" });
    }
    const uuid = crypto.randomUUID();
    const scan = new KuberScan({
      ScanID: uuid,
      image: req.body.image,
      Vulnerability: [],
    });
    await scan.save();
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

    const uuid = crypto.randomUUID();
    const scan = new KuberScan({
      ScanID: uuid,
      image: req.body.image,
      Vulnerability: [],
      status: "pending"
    });
    await scan.save();

    const scanId = scan.ScanID;

    (async () => {
      try {
        console.log(`🔄 Processing scan ${scanId} for image: ${req.body.image}`);
        const result = await trivyScan(req.body.image);
        
        await KuberScan.updateOne(
          { ScanID: scanId },
          {
            $set: {
              status: "done",
              Vulnerability: result.Results && result.Results[0]?.Vulnerabilities
                ? result.Results[0].Vulnerabilities
                : [],
            },
          }
        );
        console.log(`✅ Scan ${scanId} completed successfully`);
      } catch (e: any) {
        console.error(`❌ Scan ${scanId} failed:`, e.message);
        await KuberScan.updateOne(
          { ScanID: scanId },
          {
            $set: { status: `Error: ${e.message}` },
          }
        );
      }
    })();

    res.status(200).json({ scanId });
  } catch (err: any) {
    console.error("Error initiating scan:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;