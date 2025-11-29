import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div style={{
            width: "100%",
            background: "#ddd",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "flex-start",
            gap: "20px"
        }}>
            <Link to="/">Landing</Link>
            <Link to="/dashboard">Dashboard</Link>
        </div>
    );
}
