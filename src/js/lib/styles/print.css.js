const print = `
@media print {
  @page {
    size: A4;
  }

  body {
    margin: 0;
    padding: 0;
    display: block;
  }

  page {
    margin: 0 auto;
    box-shadow: none;
  }
}
`;

export default [print].join(`\n`);