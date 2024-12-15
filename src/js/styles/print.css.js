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
    width: 210mm;
    height: 297mm;
    box-shadow: none;
  }
}
`;

export default [print].join(`\n`);
