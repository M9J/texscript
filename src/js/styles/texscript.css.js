const texscriptImports = ``;

const texscriptPage = `
.texscript-Page {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.5);
    page-break-after: always;
}
`;

const texscriptLine = `
.texscript-Line {
    display: block;
}
`;

const texscriptList = `
.texscript-List {
    list-style-type: disc;
}
`;

const texscriptHR = `
.texscript-HR {
    height: 1px;
    border: 0;
    background: rgba(0, 0, 0, 0.1);
    margin: 8px 0;
}
`;

const texscriptSection = `.texscript-Section {}`;
const texscriptBlock = `.texscript-Block {}`;
const texscriptBR = `.texscript-BR {}`;

export default [texscriptImports, texscriptBR, texscriptBlock, texscriptHR, texscriptLine, texscriptList, texscriptPage, texscriptSection].join(`\n`);
