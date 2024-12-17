const all = `
* {
  margin: 0;
  padding: 0;
}
`;

const body = `
body {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #444;
  overflow: auto;
  box-sizing: border-box;
  padding: 24px;
  gap: 24px;
}
`;

export default [all, body].join(`\n`);
