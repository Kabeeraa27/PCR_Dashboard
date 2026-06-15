# PCR Dashboard

A real-time **Options PCR Dashboard** built using **Node.js**, **Express**, and **stock-nse-india**. The application fetches live option chain data from NSE, computes key technical metrics, and displays them in a modern web dashboard.

## Features

* 📈 Live **Put-Call Ratio (PCR)**
* 📊 **Change OI PCR** (`Put Change OI / Call Change OI`)
* 💹 **VWAP** (Volume Weighted Average Price)
* 🎯 Live Spot Price
* 📋 Dashboard for:

  * NIFTY
  * BANKNIFTY
  * FINNIFTY
  * MIDCPNIFTY
* 📉 Interactive charts with automatic refresh
* 📑 Automatic Excel logging (`PCR_Live.xlsx`)
* 🔄 Refreshes every 30 seconds

---

## Project Structure

```
PCR_Dashboard/
│
├── server.js
├── package.json
├── PCR_Live.xlsx
├── public/
│   └── index.html
└── start_document.bat
```

---

## Prerequisites

Install the following before running the project:

* Node.js (v18 or later recommended)
* npm (bundled with Node.js)

Verify installation:

```bash
node -v
npm -v
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Kabeeraa27/PCR_Dashboard.git
cd PCR_Dashboard
```

Install dependencies:

```bash
npm install
```

---

## Run the Dashboard

### Method 1

```bash
npm start
```

### Method 2

```bash
node server.js
```

### Method 3 (Windows)

Double-click:

```
start_document.bat
```

This will:

1. Start the Node.js server.
2. Open the dashboard in your default browser.

---

## Open the Dashboard

Visit:

```
http://localhost:3001
```

---

## Dashboard Metrics

### PCR

```
PCR = Total Put Open Interest / Total Call Open Interest
```

### Change OI PCR

```
Change OI PCR = Total Put Change in OI / Total Call Change in OI
```

### VWAP

Calculated using traded option premiums and traded volumes:

```
VWAP = Σ(Price × Volume) / Σ(Volume)
```

---

## Supported Indices

* NIFTY
* BANKNIFTY
* FINNIFTY
* MIDCPNIFTY

---

## Data Refresh

The backend fetches fresh NSE option chain data every **30 seconds**.

The frontend automatically refreshes and updates:

* Dashboard cards
* Summary table
* Charts

---

## Output

### Console

Displays a live summary table with:

* Spot
* PCR
* Change OI PCR
* VWAP
* CE OI
* PE OI

### Browser

Displays:

* Live dashboard
* Metric cards
* Interactive charts
* Auto-refreshing data

### Excel

`PCR_Live.xlsx` contains:

* Dashboard sheet
* Historical logs for each index

---

## Dependencies

* `stock-nse-india`
* `express`
* `cors`
* `exceljs`

Install manually if required:

```bash
npm install stock-nse-india express cors exceljs
```

---

## Troubleshooting

### `npm start` → "Missing script: start"

Ensure `package.json` contains:

```json
"scripts": {
  "start": "node server.js"
}
```

### `node: command not found`

Install Node.js and verify:

```bash
node -v
```

### Dashboard is blank

Check:

* `http://localhost:3001/dashboard.json`
* Ensure `server.js` is running.
* Verify `public/index.html` is served correctly.

### Port already in use

Change the port in `server.js` or terminate the process using the existing port.

---

## Disclaimer

This project is intended for educational and analytical purposes only. Data is sourced from NSE through the `stock-nse-india` library. Verify all market information independently before making trading or investment decisions.
