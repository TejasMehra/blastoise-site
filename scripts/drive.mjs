/**
 * Minimal Chrome DevTools Protocol driver, so the battle can actually be
 * played and screenshotted while it is being tuned.
 *
 *   node --experimental-websocket scripts/drive.mjs <script.json>
 *
 * Steps: {goto}, {click: selector}, {wait: ms}, {shot: file}, {eval: js},
 * {scroll: selector}
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const OUT = "shots";
mkdirSync(OUT, { recursive: true });

const steps = JSON.parse(process.argv[2] ?? "[]");
const width = Number(process.env.W ?? 1280);
const height = Number(process.env.H ?? 1000);

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    `--window-size=${width},${height}`,
    "--user-data-dir=" + process.env.TEMP + "\\bl-cdp",
    "about:blank",
  ],
  { stdio: "ignore" },
);

process.on("exit", () => chrome.kill());

async function targets() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await r.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error("Chrome did not expose a debugging target");
}

const page = await targets();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res) => (ws.onopen = res));

let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};

function send(method, params = {}) {
  const msgId = ++id;
  ws.send(JSON.stringify({ id: msgId, method, params }));
  return new Promise((res) => pending.set(msgId, res));
}

async function evaluate(expression) {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.result?.exceptionDetails) {
    throw new Error(JSON.stringify(r.result.exceptionDetails));
  }
  return r.result?.result?.value;
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

/* surface page errors and console warnings, so hydration mismatches and
   runtime exceptions cannot hide behind a screenshot that looks fine */
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.method === "Runtime.exceptionThrown") {
    console.error("  PAGE ERROR:", m.params.exceptionDetails?.text,
      m.params.exceptionDetails?.exception?.description?.slice(0, 2400));
  }
  if (m.method === "Log.entryAdded" && m.params.entry.level !== "verbose") {
    console.error(`  CONSOLE[${m.params.entry.level}]:`, m.params.entry.text?.slice(0, 300), m.params.entry.url ?? "");
  }
  if (m.method === "Runtime.consoleAPICalled" && ["error","warning"].includes(m.params.type)) {
    console.error(`  CONSOLE[${m.params.type}]:`,
      m.params.args.map(a => a.value ?? a.description).join(" ").slice(0, 300));
  }
});

/* headless Chrome reports prefers-reduced-motion: reduce by default, which
   would silently screenshot the static fallback instead of the animation */
/* the --window-size flag sizes the browser window, not the viewport; without
   this the measured innerWidth does not match what was asked for */
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
  screenWidth: width,
  screenHeight: height,
});

if (!process.env.REDUCED) {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
}

for (const step of steps) {
  if (step.goto) {
    await send("Page.navigate", { url: step.goto });
    await sleep(step.settle ?? 3500);
  }
  if (step.scroll) {
    await evaluate(
      `document.querySelector(${JSON.stringify(step.scroll)})?.scrollIntoView({block:"start"}); 1`,
    );
    await sleep(500);
  }
  if (step.click) {
    const clicked = await evaluate(
      `(()=>{const e=document.querySelector(${JSON.stringify(step.click)}); if(!e) return "MISSING"; e.click(); return "ok";})()`,
    );
    if (clicked === "MISSING") console.error("  ! selector not found:", step.click);
    await sleep(step.after ?? 400);
  }
  if (step.eval) {
    const v = await evaluate(step.eval);
    console.log("  eval:", JSON.stringify(v));
  }
  if (step.key) {
    for (let i = 0; i < (step.times ?? 1); i++) {
      for (const type of ["rawKeyDown", "keyUp"]) {
        await send("Input.dispatchKeyEvent", {
          type,
          key: step.key,
          code: step.key === "Tab" ? "Tab" : step.code ?? step.key,
          windowsVirtualKeyCode: step.key === "Tab" ? 9 : step.vk ?? 0,
          text: step.key.length === 1 ? step.key : undefined,
        });
      }
      await sleep(90);
    }
  }
  if (step.wait) await sleep(step.wait);
  if (step.shot) {
    const r = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(`${OUT}/${step.shot}`, Buffer.from(r.result.data, "base64"));
    console.log("  shot:", step.shot);
  }
}

ws.close();
chrome.kill();
process.exit(0);
