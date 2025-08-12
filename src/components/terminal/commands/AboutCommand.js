const aboutInfo = {
  Name: "Finn van Montfort",
  Experience: "1 Year at HPE",
  Role: "Developer",
  Location: "Bristol, UK",
  Education: "Bsc. Computer Science"
};

function buildAboutTable(info) {
  const rows = Object.entries(info)
    .map(([key, value]) =>
      `│  ${key.padEnd(12)}:  ${value.padEnd(19)}│`
    )
    .join('\n');
  return `
┌────────────────────────────────────┐
│        Developer Statistics        │
├────────────────────────────────────┤
${rows}
└────────────────────────────────────┘
  `;
}

const AboutCommand = buildAboutTable(aboutInfo);

export default AboutCommand;