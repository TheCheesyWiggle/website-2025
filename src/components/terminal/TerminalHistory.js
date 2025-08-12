import React from "react";
import { asciiArtDesktop, asciiArtMobile } from "./asciiArt";

export default function TerminalHistory({ history }) {
  return (
    <>
      {history.map((entry, i) => (
        <div
          key={i}
          style={{
            fontFamily: "monospace",
            fontSize: "1rem",
            marginBottom: "0.2rem",
          }}
        >
          {entry.command && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "limegreen", marginRight: "0.5rem" }}>
                {entry.name}@portfolio:~$
              </span>
              <span>{entry.command}</span>
            </div>
          )}
          {entry.text && (
            <div
              style={{
                color: "#ccc",
                whiteSpace: "pre-wrap",
                lineHeight:
                  entry.text === asciiArtDesktop ||
                  entry.text === asciiArtMobile
                    ? "1"
                    : "normal",
              }}
            >
              {entry.text}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
