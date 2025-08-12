const manPages = {
  clear: `NAME
    clear - clear the terminal

SYNOPSIS
    clear

DESCRIPTION
    Clears the terminal history.
`,
  about: `NAME
    about - shows Finn van Montfort (aka TheCheesyWiggle)'s developer statistics

SYNOPSIS
    about

DESCRIPTION
    Shows information about Finn van Montfort (aka TheCheesyWiggle).
`,
  contact: `NAME
    contact - shows contact information

SYNOPSIS
    contact

DESCRIPTION
    Shows Finn van Montfort (aka TheCheesyWiggle)'s contact information.
`,
  project: `NAME
    project - list or show project details

SYNOPSIS
    project
    project [number]

DESCRIPTION
    Lists all projects or shows details for a specific project.
`,
  whoami: `NAME
    whoami - displays the current terminal session name

SYNOPSIS
    whoami

DESCRIPTION
    Prints the current name set for the terminal session.
`,
  su: `NAME
    su - set your terminal session name

SYNOPSIS
    su <your_name>

DESCRIPTION
    Sets your name for the terminal session.
`,
  cowsay: `NAME
    cowsay - displays a cow saying your message

SYNOPSIS
    cowsay [message]

DESCRIPTION
    Prints your message in a speech bubble with a cow ASCII art.
`,
  man: `NAME
    man - show command manual

SYNOPSIS
    man [command]

DESCRIPTION
    Shows the manual/help for a specific command.
`
};


const updated_man = {
  man: {
    NAME: "man - show command manual",
    SYNOPSIS: "man [command]",
    DESCRIPTION: "Shows the manual/help for a specific command."
  },
  about: {
    NAME:"",
    SYNOPSIS:"",
    DESCRIPTION:"",
  }
}

export default function ManCommand({ cmd }) {
  const cmdParts = cmd.trim().split(" ");
  if (cmdParts.length === 1) {
    const commands = Object.keys(manPages).sort().join(", ");
    return `Manual pages available for:\n${commands}\n\nType 'man [command]' to read about a command.`;
  }
  const topic = cmdParts.slice(1).join(" ");
  if (manPages[topic]) {
    return manPages[topic];
  }
  return `No manual entry for '${topic}'`;
}