import React from "react";

export default function TerminalInput({name, input, onChange, onKeyDown, inputRef }){
    return (
        <div style={{ display: "flex", alignItems: "center", fontFamily: "monospace", color: "#eee", fontSize: "1rem", marginTop: "0.1rem" }}>
            <div style={{ color: "limegreen", marginRight: "0.5rem"}}>{name}@portfolio:~$  </div>
            <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            style={{
                width: "100%",
                minHeight: "2.5rem",
                background: "transparent",
                border: "none",
                color: "#eee",
                fontFamily: "monospace",
                outline: "none",
            }}
            autoFocus
            />
        </div>
    )
}