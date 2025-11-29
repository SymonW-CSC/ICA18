import React from "react";
import { useState } from "react";

export default function Dashboard() {
    const [stocks, setStocks] = useState([
        { ticker: "DOGE", amount: 2000, price: 0.17 },
        { ticker: "AAPL", amount: 2, price: 170 },
        { ticker: "TSLA", amount: 1, price: 240 }
    ]);

    function addStock() {
        const newStock = { ticker: "NEW", amount: 0, price: 0 };
        setStocks([...stocks, newStock]);
    }

    function deleteStock(ticker) {
        setStocks(stocks.filter(s => s.ticker !== ticker));
    }

    return (
        <div style={{ display: "flex" }}>

            {/* Sidebar */}
            <div style={{
                width: "250px",
                background: "#444",
                padding: "20px",
                height: "100vh"
            }}>
                {stocks.map(stock => (
                    <button key={stock.ticker}
                        style={{
                            width: "100%",
                            padding: "15px",
                            marginBottom: "15px",
                            fontWeight: "bold",
                            borderRadius: "10px",
                            border: "2px solid black",
                            cursor: "pointer"
                        }}
                        onClick={() => console.log(stock)}
                    >
                        {stock.ticker}
                    </button>
                ))}

                <button
                    onClick={addStock}
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        marginTop: "20px",
                        fontSize: "2rem",
                        background: "white",
                        cursor: "pointer"
                    }}>
                    +
                </button>
            </div>

            {/* Stock Info Placeholder */}
            <div style={{ padding: "50px", flexGrow: 1 }}>
                <h1>DASHBOARD</h1>
                <p>Select a stock to view details.</p>
            </div>

        </div>
    );
}
