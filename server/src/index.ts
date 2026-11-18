import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";

const app = express();
const port = Number(process.env.PORT) || 3001;
const dataDir = path.resolve(import.meta.dirname, "../data");
const leadsFile = path.join(dataDir, "leads.json");

type Lead = {
  id: string;
  name: string;
  contact: string;
  kind: string;
  when: string;
  budget: string;
  message: string;
  createdAt: string;
};

function clip(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/contact", (req, res) => {
  const contact = clip(req.body?.contact, 200);
  const message = clip(req.body?.message, 2000);
  const name = clip(req.body?.name, 80);
  const kind = clip(req.body?.kind, 80);
  const when = clip(req.body?.when, 80);
  const budget = clip(req.body?.budget, 80);

  const digits = contact.replace(/\D/g, "");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const phoneOk = digits.length >= 10 && digits.length <= 15;
  if (contact.length > 200 || (!emailOk && !phoneOk)) {
    res.status(400).json({ ok: false, error: "Укажите телефон или email." });
    return;
  }

  if (message.length < 10 || message.length > 2000) {
    res.status(400).json({ ok: false, error: "Опишите задачу — хотя бы пару предложений." });
    return;
  }

  const lead: Lead = {
    id: `${Date.now()}`,
    name,
    contact,
    kind,
    when,
    budget,
    message,
    createdAt: new Date().toISOString(),
  };

  fs.mkdirSync(dataDir, { recursive: true });
  const current: Lead[] = fs.existsSync(leadsFile)
    ? (JSON.parse(fs.readFileSync(leadsFile, "utf8")) as Lead[])
    : [];
  current.push(lead);
  fs.writeFileSync(leadsFile, JSON.stringify(current, null, 2));

  res.status(201).json({ ok: true });
});

const clientDist = path.resolve(import.meta.dirname, "../../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`API http://localhost:${port}`);
});
