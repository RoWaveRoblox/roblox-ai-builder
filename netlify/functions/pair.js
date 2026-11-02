const sessions = globalThis.__rocreateSessions || (globalThis.__rocreateSessions = new Map());

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function code() {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

async function store() {
  try {
    const { getStore } = require("@netlify/blobs");
    return getStore("rocreate-pair");
  } catch {
    return null;
  }
}

async function read(blobs, key) {
  if (blobs) {
    const value = await blobs.get(key, { type: "json" });
    return value || null;
  }
  return sessions.get(key) || null;
}

async function write(blobs, key, value) {
  if (blobs) {
    await blobs.setJSON(key, value);
    return;
  }
  sessions.set(key, value);
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors(), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ error: "POST only" }) };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: "Bad JSON" }) };
  }

  const blobs = await store();
  const action = body.action;

  if (action === "create") {
    let id = code();
    for (let n = 0; n < 5 && (await read(blobs, id)); n++) id = code();
    await write(blobs, id, { code: id, connected: false, jobs: [], created: Date.now() });
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ code: id }) };
  }

  const session = body.code ? await read(blobs, String(body.code).toLowerCase()) : null;
  if (!session) {
    return { statusCode: 404, headers: cors(), body: JSON.stringify({ error: "Code not found" }) };
  }
  const key = session.code;

  if (action === "claim") {
    session.connected = true;
    await write(blobs, key, session);
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true, code: key }) };
  }

  if (action === "status") {
    return {
      statusCode: 200,
      headers: cors(),
      body: JSON.stringify({ ok: true, connected: session.connected, waiting: session.jobs.length }),
    };
  }

  if (action === "push") {
    const job = body.job || {};
    session.jobs.push({
      id: Date.now().toString(36),
      kind: job.kind || "script",
      name: job.name || "RoCreate",
      source: String(job.source || "").slice(0, 100000),
    });
    session.jobs = session.jobs.slice(-20);
    await write(blobs, key, session);
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true, waiting: session.jobs.length }) };
  }

  if (action === "pull") {
    const jobs = session.jobs;
    session.jobs = [];
    session.connected = true;
    await write(blobs, key, session);
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true, jobs }) };
  }

  return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: "Unknown action" }) };
};
