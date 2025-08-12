const contactInfo = {
  Email: "fv256@exeter.ac.uk",
  Github: "TheCheesyWiggle",
  Website: "example.com",
};

function buildContactTable(info) {
  const rows = Object.entries(info)
    .map(([key, value]) => `│  ${key.padEnd(12)}:  ${value.padEnd(19)}│`)
    .join("\n");
  return `
┌────────────────────────────────────┐
│         Contact Information        │
├────────────────────────────────────┤
${rows}
└────────────────────────────────────┘
  `;
}

const ContactCommand = buildContactTable(contactInfo);
export default ContactCommand;
