import React, { useReducer, useEffect, useCallback, useMemo } from "react";
import StockChart from "../components/StockChart";


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


function portfolioReducer(state, action) {
    switch (action.type) {
        case "ADD":
            return [...state, action.payload];
        case "DELETE":
            return state.filter((item) => item.ticker !== action.payload);
        case "UPDATE":
            return state.map((item) =>
                item.ticker === action.payload.ticker
                    ? { ...item, ...action.payload.updates }
                    : item
            );
        default:
            return state;
    }
}


export default function Dashboard() {
    const [storedStocks, setStoredStocks] = useLocalStorage("stocks", [
        { ticker: "AAPL", amount: 2, price: 170 },
        { ticker: "TSLA", amount: 1, price: 240 },
    ]);
    const [storedCryptos, setStoredCryptos] = useLocalStorage("cryptos", [
        { ticker: "DOGE", amount: 2000, price: 0.17 },
        { ticker: "BTC", amount: 0.05, price: 34000 },
    ]);

    const [stocks, dispatchStocks] = useReducer(portfolioReducer, storedStocks);
    const [cryptos, dispatchCryptos] = useReducer(
        portfolioReducer,
        storedCryptos
    );

    const [selectedTicker, setSelectedTicker] = React.useState(null);


    useEffect(() => setStoredStocks(stocks), [stocks]);
    useEffect(() => setStoredCryptos(cryptos), [cryptos]);


    const addStock = useCallback(() => {
        const ticker = prompt("Enter the stock ticker:")?.toUpperCase();
        if (ticker) {
            dispatchStocks({ type: "ADD", payload: { ticker, amount: 0, price: 0 } });
        }
    }, []);

    const addCrypto = useCallback(() => {
        const ticker = prompt("Enter the crypto symbol:")?.toUpperCase();
        if (ticker) {
            dispatchCryptos({ type: "ADD", payload: { ticker, amount: 0, price: 0 } });
        }
    }, []);

    const deleteItem = useCallback((ticker, type) => {
        if (type === "stock") dispatchStocks({ type: "DELETE", payload: ticker });
        else if (type === "crypto") dispatchCryptos({ type: "DELETE", payload: ticker });
    }, []);


    const updateStock = (ticker, key, value) => {

        const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
        dispatchStocks({ type: "UPDATE", payload: { ticker, updates: { [key]: numericValue } } });
    };

    const updateCrypto = (ticker, key, value) => {
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
        dispatchCryptos({ type: "UPDATE", payload: { ticker, updates: { [key]: numericValue } } });
    };


    const totalShares = useMemo(
        () => stocks.reduce((acc, s) => acc + s.amount, 0),
        [stocks]
    );
    const totalCoins = useMemo(
        () => cryptos.reduce((acc, c) => acc + c.amount, 0),
        [cryptos]
    );

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

            <div style={{ marginBottom: "20px" }}>
                <p>Total Shares: {totalShares}</p>
                <p>Total Stock Value: ${totalStockValue.toFixed(2)}</p>
                <p>Total Coins: {totalCoins}</p>
                <p>Total Crypto Value: ${totalCryptoValue.toFixed(2)}</p>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* Stocks Column */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                    <h2>Stocks</h2>
                    <button onClick={addStock} style={{ marginBottom: "10px" }}>
                        + Add Stock
                    </button>
                    {stocks.map((s) => (
                        <div
                            key={s.ticker}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px",
                                border: "1px solid #ccc",
                                marginBottom: "5px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                background: selectedTicker === s.ticker ? "#90EE90" : "green",
                            }}
                            onClick={() => setSelectedTicker(s.ticker)}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                <strong>{s.ticker}</strong>
                                <button onClick={(e) => { e.stopPropagation(); deleteItem(s.ticker, "stock"); }}>
                                    Delete
                                </button>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Shares"
                                    value={s.amount}
                                    onChange={(e) => updateStock(s.ticker, "amount", e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Price per share"
                                    value={s.price}
                                    onChange={(e) => updateStock(s.ticker, "price", e.target.value)}
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cryptos Column */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                    <h2>Cryptos</h2>
                    <button onClick={addCrypto} style={{ marginBottom: "10px" }}>
                        + Add Crypto
                    </button>
                    {cryptos.map((c) => (
                        <div
                            key={c.ticker}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px",
                                border: "1px solid #ccc",
                                marginBottom: "5px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                background: selectedTicker === c.ticker ? "90EE90" : "green",
                            }}
                            onClick={() => setSelectedTicker(c.ticker)}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                <strong>{c.ticker}</strong>
                                <button onClick={(e) => { e.stopPropagation(); deleteItem(c.ticker, "crypto"); }}>
                                    Delete
                                </button>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Coins"
                                    value={c.amount}
                                    onChange={(e) => updateCrypto(c.ticker, "amount", e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Price per coin"
                                    value={c.price}
                                    onChange={(e) => updateCrypto(c.ticker, "price", e.target.value)}
                                    style={{ flex: 1 }}
                                />
                            </div>
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
