# 📈 PCR Dashboard

A modern **Real-Time Options Analytics Dashboard** built using **Node.js**, **Express**, **Chart.js**, and **stock-nse-india**. The application fetches live NSE option chain data, computes key derivatives metrics, stores historical intraday values, and presents them through an interactive web dashboard with auto-refreshing visualizations.

---

# ✨ Features

* 📈 Live **Put-Call Ratio (PCR)** for major NSE indices
* 📊 **Change OI PCR** (`Put Change in OI / Call Change in OI`)
* 💹 **VWAP** (Volume Weighted Average Price)
* 🎯 Live **Underlying Spot Price**
* ⚡ Automatic refresh every **30 seconds**
* 📉 Interactive **PCR Trend Chart** for all indices
* 📊 Interactive **Spot Price Trend Chart** for all indices
* 🕘 Fixed market timeline from **09:15 AM – 03:30 PM**
* 🔄 Historical chart persistence using `history.json`
* 💾 Automatic Excel logging (`PCR_Live.xlsx`)
* 🟢 Dynamic value highlighting whenever metrics change
* 📋 Responsive dashboard cards and summary table

---

# 📊 Supported Indices

* NIFTY
* BANKNIFTY
* FINNIFTY
* MIDCPNIFTY

---

# 📁 Project Structure

```text
PCR_Dashboard/
│
├── server.js
├── package.json
├── package-lock.json
├── history.json
├── PCR_Live.xlsx
├── start.bat
├── node_modules/
│
└── public/
    └── index.html
```

---

# 🛠️ Technologies Used

* Node.js
* Express.js
* Chart.js
* stock-nse-india
* ExcelJS
* CORS
* HTML5
* CSS3
* Vanilla JavaScript

---

# 📦 Installation

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

# ▶️ Running the Dashboard

## Option 1

```bash
npm start
```

## Option 2

```bash
node server.js
```

## Option 3 (Windows)

Simply run:

```text
start.bat
```

This launches the backend server and opens the dashboard automatically in your default browser.

---

# 🌐 Access the Dashboard

Open:

```text
http://localhost:3001
```

---

# 📐 Metrics Calculated

## Put Call Ratio (PCR)

```text
PCR = Total Put Open Interest / Total Call Open Interest
```

---

## Change OI PCR

```text
Change OI PCR = Total Put Change in OI / Total Call Change in OI
```

---

## VWAP

Calculated using traded option premiums and traded volumes:

```text
VWAP = Σ(Price × Volume) / Σ(Volume)
```

---

# 📈 Interactive Charts

The dashboard contains two live charts:

## 1️⃣ PCR Trend

* Displays PCR values for all four indices.
* Each index is plotted with a unique color.
* Fixed market timeline from **09:15 AM to 03:30 PM**.
* Hover over any point to view the exact PCR value and timestamp.
* Automatically restores previous intraday history after page refresh.

## 2️⃣ Spot Price Trend

* Displays underlying spot prices for all four indices.
* Uses the same synchronized market timeline.
* Hover tooltips show precise spot values.
* Intraday history is preserved using `history.json`.

---

# 💾 Historical Persistence

Unlike conventional dashboards that reset after a browser refresh, this project maintains intraday history.

The backend stores minute-wise values in:

```text
history.json
```

This enables:

* Persistence across browser refreshes
* Continuous intraday charts
* Seamless restoration of PCR and Spot history
* Automatic reset when a new trading day begins

---

# 📑 Excel Logging

Every refresh automatically updates:

```text
PCR_Live.xlsx
```

The workbook contains:

* Dashboard summary sheet
* Individual historical logs for:

  * NIFTY
  * BANKNIFTY
  * FINNIFTY
  * MIDCPNIFTY

Each log includes:

* Timestamp
* Spot Price
* PCR
* Change OI PCR
* VWAP
* Call OI
* Put OI
* Call Change OI
* Put Change OI

---

# 🔄 Refresh Behaviour

The backend fetches fresh option chain data every **30 seconds**.

The frontend automatically updates:

* Dashboard cards
* Summary table
* PCR chart
* Spot chart
* Value highlights for changed metrics

Historical values remain intact throughout the trading session.

---

# 📂 API Endpoints

## Live Dashboard Data

```text
GET /dashboard.json
```

Returns the latest computed metrics for all tracked indices.

---

## Historical Chart Data

```text
GET /history.json
```

Returns stored intraday PCR and Spot values used to restore charts after refresh.

---

# 📸 Dashboard Highlights

* Real-time dashboard cards
* Interactive summary table
* Combined PCR visualization
* Combined Spot Price visualization
* Automatic flashing of updated values
* Responsive layout with modern UI styling

---

# 📦 Dependencies

```text
stock-nse-india
express
cors
exceljs
chart.js
```

Install manually if required:

```bash
npm install stock-nse-india express cors exceljs
```

---

# 🛠️ Troubleshooting

## `npm start` → Missing script

Ensure `package.json` contains:

```json
"scripts": {
  "start": "node server.js"
}
```

---

## `Cannot GET /history.json`

* Verify the backend is running.
* Ensure `server.js` exposes:

```javascript
app.get("/history.json", (req, res) => {
    res.json(history);
});
```

* Restart the Node server after making changes.

---

## `EADDRINUSE: address already in use`

Another process is already using the configured port.

Terminate it using:

```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

or change the server port.

---

## Dashboard appears blank

Verify:

* `http://localhost:3001/dashboard.json`
* `http://localhost:3001/history.json`
* `server.js` is running successfully
* `public/index.html` is being served correctly

---

# ⚠️ Disclaimer

This project is intended solely for educational, analytical, and research purposes. Market data is sourced using the `stock-nse-india` library. Users should independently verify all information before making any trading or investment decisions.
