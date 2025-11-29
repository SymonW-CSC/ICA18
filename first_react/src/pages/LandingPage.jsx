import React from "react";
export default function LandingPage() {
    return (
        <div style={{
            height: "100vh",
            background: "#444",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h1 style={{ color: "white", fontSize: "4rem", fontWeight: "bold" }}>
                STOCKER
            </h1>

            <a href="/dashboard">
                <button style={{
                    background: "#61B5FF",
                    border: "none",
                    padding: "15px 30px",
                    fontSize: "1.2rem",
                    borderRadius: "10px",
                    cursor: "pointer",
                    marginTop: "20px"
                }}>
                    LET'S GET STARTED
                </button>
            </a>
        </div>
    );
}
