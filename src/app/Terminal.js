//This ensures that the component is only rendered on the client side
'use client';
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineTerminal } from "react-icons/md";
import TerminalInput from "@/components/terminal/TerminalInput";
import TerminalHistory from "@/components/terminal/TerminalHistory";
import AboutCommand from "@/components/terminal/commands/AboutCommand"
import ContactCommand from "@/components/terminal/commands/ContactCommand"
import SwitchUser from "@/components/terminal/commands/SwitchUser";
import ShowProjects from "@/components/terminal/commands/ShowProjects";
import ManCommand from "@/components/terminal/commands/ManCommand";
import CowSay from "@/components/terminal/commands/CowSayCommand";
import { asciiArtDesktop, asciiArtMobile } from "@/components/terminal/asciiArt";

export default function TerminalPage() {

  const router = useRouter();
  const [name, switchUser] = useState("guest");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([{
    id: Date.now(),
    command: "",
    name: "",
    text: typeof window !== "undefined" && window.innerWidth < 768
        ? asciiArtMobile
        : asciiArtDesktop
  }]);
  
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd) => {
    cmd = cmd.trim().toLowerCase();

    const entry = {
      id: Date.now(),
      command: cmd,
      text: "",
    };
    
    
    if (cmd === "clear") {
      setHistory([{
        id: Date.now(),
        command: "",
        name: "",
        text: typeof window !== "undefined" && window.innerWidth < 768
          ? asciiArtMobile
          : asciiArtDesktop
      }]);
      setInput("");
      return; 
    } else if (cmd === "about") {
      entry.text = AboutCommand;
    } else if (cmd === "contact") {
      entry.text = ContactCommand;
    } else if (cmd.startsWith("project")) {
      entry.text = ShowProjects({ cmd });
    } else if (cmd.startsWith("su")) {
      entry.text = SwitchUser({ cmd, switchUser});
    } else if (cmd.startsWith("man")) {
      entry.text = ManCommand({ cmd });
    } else if (cmd.startsWith("cowsay")) {
      entry.text = CowSay({ cmd });
    } else if (cmd === "whoami"){
      entry.text = name
    } else {
      entry.text = `Command not found: ${cmd}`;
    }

    entry.name = name;
    setHistory(prev => [...prev, entry]);
    setInput("");
  }

   const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input.trim());
    }
  };

  return(
    <div className="min-h-screen bg-black text-white p-4 font-mono"
      style={{
        maxWidth: "100vw",
        overflowX: "auto",
        fontSize: "1em"
      }}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Finn van Montfort's Portfolio</h1>
        <button
          aria-label="Switch to Bauhaus"
          onClick={() => router.push("/Bauhaus")}
        ><MdOutlineTerminal size={32} className="text-white hover:text-green-400 transition-colors" /></button>

      </div>
      <div
        ref={terminalRef}
        className="mt-2 w-full overflow-x-auto whitespace-pre-wrap"
        style={{ maxWidth: "100%", height: "60vh", position: "relative" }}
      >
        <div text="white" className="mt-2">
        <TerminalHistory history={history} />
          <TerminalInput
            name={name}
            input={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  )
}