const texscriptImports = `
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap");
`;

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

const texscriptSection = `
.texscript-Section {

}
`;

const texscriptBlock = `
.texscript-Block {

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

const texscriptBR = `
.texscript-BR {

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

export default [texscriptImports, texscriptBR, texscriptBlock, texscriptHR, texscriptLine, texscriptList, texscriptPage, texscriptSection].join(`\n`);
