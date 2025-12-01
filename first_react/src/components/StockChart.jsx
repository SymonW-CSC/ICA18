import React, { useEffect, useState } from "react";

export default function StockChart({ symbol, type }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //O54A46XP46YZ2MQU used up

    const apiKey = "4J3DZ2DH2D7E4LOC";

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                let url = "";
                if (type === "crypto") {
                    url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${apiKey}`;
                } else {
                    url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
                }

                const res = await fetch(url);
                const json = await res.json();

                if (type === "crypto") {
                    console.log(`AlphaVantage crypto response for ${symbol}:`, json);
                }

                const timeSeries = type === "crypto"
                    ? json["Time Series (Digital Currency Daily)"]
                    : json["Time Series (Daily)"];

                if (!timeSeries) {
                    setError("No time series data returned (maybe unsupported symbol)");
                    setData([]);
                    setLoading(false);
                    return;
                }

                const chartData = Object.entries(timeSeries)
                    .map(([date, info]) => {
                        const price = type === "crypto"
                            ? parseFloat(info["4a. close (USD)"])
                            : parseFloat(info["4. close"]);

                        return { date, price };
                    })
                    .filter(d => !isNaN(d.price))
                    .reverse();

                if (chartData.length === 0) {
                    setError("No valid price data found for this symbol");
                    setData([]);
                } else {
                    setData(chartData);
                }
            } catch (err) {
                console.error(err);
                setError("Fetch error: " + err.message);
                setData([]);
            }

            setLoading(false);
        }

        fetchData();
    }, [symbol, type]);

    if (loading) return <p>Loading {symbol} data...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data || data.length === 0) return <p>No data available</p>;

    return (
        <div>
            <h2>{symbol} Prices</h2>
            <ul>
                {data.slice(-10).map((d) => (
                    <li key={d.date}>
                        {d.date}: ${d.price.toFixed(6)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
