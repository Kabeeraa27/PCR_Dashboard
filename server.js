import { NseIndia } from "stock-nse-india";
import ExcelJS from "exceljs";
import fs from "fs";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.static("public"));

let latestResults = [];

const nse = new NseIndia();

const FILE_NAME = "PCR_Live.xlsx";

const INDICES = [
  "NIFTY",
  "BANKNIFTY",
  "FINNIFTY",
  "MIDCPNIFTY"
];


const HISTORY_FILE = "history.json";

let history = {
    date: "",
    labels: [],
    pcr: {
        NIFTY: [],
        BANKNIFTY: [],
        FINNIFTY: [],
        MIDCPNIFTY: []
    },
    spot: {
        NIFTY: [],
        BANKNIFTY: [],
        FINNIFTY: [],
        MIDCPNIFTY: []
    }
};

if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(
        fs.readFileSync(HISTORY_FILE, "utf8")
    );
}


// ===============================
// Fetch Metrics
// ===============================
async function getMetrics(symbol) {
  const oc = await nse.getIndexOptionChain(symbol);

  let ceOI = 0;
  let peOI = 0;

  let ceChangeOI = 0;
  let peChangeOI = 0;

  let totalPV = 0;
  let totalVol = 0;

  for (const row of oc.records.data) {

    if (row.CE) {

      ceOI += row.CE.openInterest || 0;
      ceChangeOI += row.CE.changeinOpenInterest || 0;

      if (
        row.CE.lastPrice > 0 &&
        row.CE.totalTradedVolume > 0
      ) {
        totalPV +=
          row.CE.lastPrice *
          row.CE.totalTradedVolume;

        totalVol += row.CE.totalTradedVolume;
      }
    }

    if (row.PE) {

      peOI += row.PE.openInterest || 0;
      peChangeOI += row.PE.changeinOpenInterest || 0;

      if (
        row.PE.lastPrice > 0 &&
        row.PE.totalTradedVolume > 0
      ) {
        totalPV +=
          row.PE.lastPrice *
          row.PE.totalTradedVolume;

        totalVol += row.PE.totalTradedVolume;
      }
    }
  }

  return {

    symbol,

    timestamp: new Date().toLocaleString(),

    spot: oc.records.underlyingValue,

    ceOI,

    peOI,

    ceChangeOI,

    peChangeOI,

    pcr:
      ceOI === 0
        ? 0
        : peOI / ceOI,

    changeOIPCR:
      ceChangeOI === 0
        ? 0
        : peChangeOI / ceChangeOI,

    vwap:
      totalVol === 0
        ? 0
        : totalPV / totalVol

  };
}

// ===============================
// Save to Excel
// ===============================
async function saveExcel(results) {

  const workbook = new ExcelJS.Workbook();

  if (fs.existsSync(FILE_NAME)) {
    await workbook.xlsx.readFile(FILE_NAME);
  }

  //-------------------------
  // Dashboard Sheet
  //-------------------------

  let dashboard =
    workbook.getWorksheet("Dashboard");

  if (!dashboard) {

    dashboard =
      workbook.addWorksheet("Dashboard");

  }

  dashboard.spliceRows(
    1,
    dashboard.rowCount
  );

  dashboard.addRow([
    "Index",
    "Spot",
    "PCR",
    "Change OI PCR",
    "VWAP",
    "Call OI",
    "Put OI",
    "Call Change OI",
    "Put Change OI",
    "Updated"
  ]);

  //-------------------------
  // Individual Logs
  //-------------------------

  for (const r of results) {

    dashboard.addRow([

      r.symbol,

      r.spot,

      r.pcr,

      r.changeOIPCR,

      r.vwap,

      r.ceOI,

      r.peOI,

      r.ceChangeOI,

      r.peChangeOI,

      r.timestamp

    ]);

    let ws =
      workbook.getWorksheet(r.symbol);

    if (!ws) {

      ws =
        workbook.addWorksheet(
          r.symbol
        );

      ws.addRow([

        "Timestamp",

        "Spot",

        "PCR",

        "Change OI PCR",

        "VWAP",

        "Call OI",

        "Put OI",

        "Call Change OI",

        "Put Change OI"

      ]);
    }

    ws.addRow([

      r.timestamp,

      r.spot,

      r.pcr,

      r.changeOIPCR,

      r.vwap,

      r.ceOI,

      r.peOI,

      r.ceChangeOI,

      r.peChangeOI

    ]);
  }

  await workbook.xlsx.writeFile(
    FILE_NAME
  );
}

// ===============================
// Console Dashboard
// ===============================
async function dashboard() {

  try {

    const results = await Promise.all(
      INDICES.map(getMetrics)
    );

    latestResults = results.map(r => ({
      Index: r.symbol,
      Spot: r.spot,
      PCR: r.pcr,
      Change_OI_PCR: r.changeOIPCR,
      VWAP: r.vwap,
      CE_OI: r.ceOI,
      PE_OI: r.peOI,
      Updated: r.timestamp
    }));

    // =====================================
    // Update history.json (once per minute)
    // =====================================

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    if (history.date !== today) {
    history = {
        date: today,
        labels: [],
        pcr: {
            NIFTY: [],
            BANKNIFTY: [],
            FINNIFTY: [],
            MIDCPNIFTY: []
        },
        spot: {
            NIFTY: [],
            BANKNIFTY: [],
            FINNIFTY: [],
            MIDCPNIFTY: []
        }
    };
}

fs.writeFileSync(
    HISTORY_FILE,
    JSON.stringify(history, null, 2)
);

    const label = now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

    const isNewMinute =
        history.labels.length === 0 ||
        history.labels[history.labels.length - 1] !== label;

    // Market timings: 09:15 AM to 03:30 PM
    const totalMinutes =
        now.getHours() * 60 + now.getMinutes();

    const marketOpen = 9 * 60 + 15;   // 09:15
    const marketClose = 15 * 60 + 30; // 15:30

    if (
        isNewMinute &&
        totalMinutes >= marketOpen &&
        totalMinutes <= marketClose
    ) {

        history.labels.push(label);

        for (const r of results) {
            history.pcr[r.symbol].push(Number(r.pcr));
            history.spot[r.symbol].push(Number(r.spot));
        }

        const MAX_POINTS = 376;

        if (history.labels.length > MAX_POINTS) {
            history.labels.shift();
        }

        for (const idx of INDICES) {
            if (history.pcr[idx].length > MAX_POINTS) {
                history.pcr[idx].shift();
            }

            if (history.spot[idx].length > MAX_POINTS) {
                history.spot[idx].shift();
            }
        }

        history.date = today;

        fs.writeFileSync(
            HISTORY_FILE,
            JSON.stringify(history, null, 2)
        );
    }

    // =====================================
    // Console Output
    // =====================================

    console.clear();

    console.log(
      "\n==============================================="
    );

    console.log(
      " LIVE OPTION CHAIN DASHBOARD"
    );

    console.log(
      new Date().toLocaleString()
    );

    console.log(
      "===============================================\n"
    );

    console.table(

      results.map(r => ({

        Index: r.symbol,

        Spot: Number(r.spot).toFixed(2),

        PCR: r.pcr.toFixed(3),

        Change_OI_PCR: r.changeOIPCR.toFixed(3),

        VWAP: r.vwap.toFixed(2),

        CE_OI: r.ceOI,

        PE_OI: r.peOI

      }))

    );

    // =====================================
    // Save Excel
    // =====================================

    await saveExcel(results);

  }

  catch (err) {

    console.error(err);

  }

}



// ===============================
// Run every 30 sec
// ===============================

const PORT = 3001;

app.get("/dashboard.json", (req, res) => {
    res.json(latestResults);
});

app.get("/history.json", (req, res) => {
    res.json(history);
});

app.listen(PORT, () => {
    console.log(`Dashboard available at http://localhost:${PORT}`);
});

// Initial fetch
dashboard();

// Refresh every 30 seconds
setInterval(dashboard, 30000);