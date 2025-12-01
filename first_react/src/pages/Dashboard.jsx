// Dashboard.jsx
import React, { useReducer, useEffect, useMemo, useState } from "react";
import StockChart from "../components/StockChart";

// --- Custom useLocalStorage Hook ---
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = React.useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = (value) => {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    };

    return [storedValue, setValue];
}

// --- Reducer ---
function portfolioReducer(state, action) {
    switch (action.type) {
        case "ADD":
            return [...state, action.payload];
        case "DELETE":
            return state.filter((item) => item.ticker !== action.payload);
        case "UPDATE_AMOUNT":
            return state.map((item) =>
                item.ticker === action.payload.ticker
                    ? { ...item, amount: action.payload.amount }
                    : item
            );
        case "UPDATE_PRICE":
            return state.map((item) =>
                item.ticker === action.payload.ticker
                    ? { ...item, price: action.payload.price }
                    : item
            );
        default:
            return state;
    }
}

// --- Dashboard Component ---
export default function Dashboard() {
    const [storedStocks, setStoredStocks] = useLocalStorage("stocks", [
        { ticker: "NVDA", amount: 0, price: 0 },
    ]);
    const [storedCryptos, setStoredCryptos] = useLocalStorage("cryptos", [
        { ticker: "BTC", amount: 0, price: 0 },
    ]);

    const [stocks, dispatchStocks] = useReducer(portfolioReducer, storedStocks);
    const [cryptos, dispatchCryptos] = useReducer(portfolioReducer, storedCryptos);

    const [selectedTicker, setSelectedTicker] = useState(null);

    const [newStockTicker, setNewStockTicker] = useState("");
    const [newCryptoTicker, setNewCryptoTicker] = useState("");

    // Persist changes
    useEffect(() => setStoredStocks(stocks), [stocks]);
    useEffect(() => setStoredCryptos(cryptos), [cryptos]);

    // --- Handlers ---
    const handleStockChange = (ticker, value) => {
        const amount = parseFloat(value) || 0;
        dispatchStocks({ type: "UPDATE_AMOUNT", payload: { ticker, amount } });
    };

    const handleCryptoChange = (ticker, value) => {
        const amount = parseFloat(value) || 0;
        dispatchCryptos({ type: "UPDATE_AMOUNT", payload: { ticker, amount } });
    };

    const addStock = () => {
        const ticker = newStockTicker.trim().toUpperCase();
        if (!ticker) return;
        // Prevent duplicates
        if (stocks.find((s) => s.ticker === ticker)) {
            alert("Stock already exists");
            return;
        }
        dispatchStocks({ type: "ADD", payload: { ticker, amount: 0, price: 0 } });
        setNewStockTicker("");
    };

    const addCrypto = () => {
        const ticker = newCryptoTicker.trim().toUpperCase();
        if (!ticker) return;
        if (cryptos.find((c) => c.ticker === ticker)) {
            alert("Crypto already exists");
            return;
        }
        dispatchCryptos({ type: "ADD", payload: { ticker, amount: 0, price: 0 } });
        setNewCryptoTicker("");
    };

    const deleteItem = (ticker, type) => {
        if (type === "stock") dispatchStocks({ type: "DELETE", payload: ticker });
        else if (type === "crypto") dispatchCryptos({ type: "DELETE", payload: ticker });
    };

    // --- Calculate Total Value ---
    const totalStockValue = useMemo(
        () => stocks.reduce((acc, s) => acc + s.price * s.amount, 0),
        [stocks]
    );
    const totalCryptoValue = useMemo(
        () => cryptos.reduce((acc, c) => acc + c.price * c.amount, 0),
        [cryptos]
    );

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>

            <p>Total Stock Value: ${totalStockValue.toFixed(2)}</p>
            <p>Total Crypto Value: ${totalCryptoValue.toFixed(2)}</p>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "20px",
                }}
            >
                {/* Stocks Column */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                    <h2>Stocks</h2>
                    <div style={{ display: "flex", marginBottom: "10px", gap: "5px" }}>
                        <input
                            type="text"
                            placeholder="Add stock ticker"
                            value={newStockTicker}
                            onChange={(e) => setNewStockTicker(e.target.value)}
                        />
                        <button onClick={addStock}>Add</button>
                    </div>
                    {stocks.map((s) => (
                        <div
                            key={s.ticker}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px",
                                border: "1px solid #ccc",
                                marginBottom: "5px",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => setSelectedTicker(s.ticker)}
                        >
                            <span>{s.ticker}: ${s.price}</span>
                            <input
                                type="number"
                                min="0"
                                value={s.amount}
                                onChange={(e) => handleStockChange(s.ticker, e.target.value)}
                                style={{ width: "60px" }}
                            />
                            <button onClick={(e) => { e.stopPropagation(); deleteItem(s.ticker, "stock"); }}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Cryptos Column */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                    <h2>Cryptos</h2>
                    <div style={{ display: "flex", marginBottom: "10px", gap: "5px" }}>
                        <input
                            type="text"
                            placeholder="Add crypto symbol"
                            value={newCryptoTicker}
                            onChange={(e) => setNewCryptoTicker(e.target.value)}
                        />
                        <button onClick={addCrypto}>Add</button>
                    </div>
                    {cryptos.map((c) => (
                        <div
                            key={c.ticker}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px",
                                border: "1px solid #ccc",
                                marginBottom: "5px",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => setSelectedTicker(c.ticker)}
                        >
                            <span>{c.ticker}: ${c.price}</span>
                            <input
                                type="number"
                                min="0"
                                value={c.amount}
                                onChange={(e) => handleCryptoChange(c.ticker, e.target.value)}
                                style={{ width: "60px" }}
                            />
                            <button onClick={(e) => { e.stopPropagation(); deleteItem(c.ticker, "crypto"); }}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart Section */}
            {selectedTicker && (
                <div style={{ marginTop: "30px" }}>
                    <h2>{selectedTicker} Chart</h2>
                    <StockChart symbol={selectedTicker} />
                </div>
            )}
        </div>
    );
}
