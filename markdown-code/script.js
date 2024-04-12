"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function toggleTheme() {
    const toggleButton = document.getElementById("toggle");
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
        });
    }
}
function themeOnLoad() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
    }
}
toggleTheme();
window.onload = themeOnLoad();
const welcomeText = "# Welcome to Markdown\n\nMarkdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.\n\n## How to use this?\n\n1. Write markdown in the markdown editor window\n2. See the rendered markdown in the preview window\n\n### Features\n\n- Create headings, paragraphs, links, blockquotes, inline-code, code blocks, and lists\n- Name and save the document to access again later\n- Choose between Light or Dark mode depending on your preference\n\n> This is an example of a blockquote. If you would like to learn more about markdown syntax, you can visit this [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).\n\n#### Headings\n\nTo create a heading, add the hash sign (#) before the heading. The number of number signs you use should correspond to the heading level. You'll see in this guide that we've used all six heading levels (not necessarily in the correct way you should use headings!) to illustrate how they should look.\n\n##### Lists\n\nYou can see examples of ordered and unordered lists above.\n\n###### Code Blocks\n\nThis markdown editor allows for inline-code snippets, like this: `<p>I'm inline</p>`. It also allows for larger code blocks like this:\n\n```\n<main>\n  <h1>This is a larger code block</h1>\n</main>\n```";
const untitledText = "# This is a new untitled document.\n\nStart typing here to see preview and use the editor.";
const docNameEditable = document.querySelector("#doc-name-editable"), saveBtn = document.querySelector("#save-change-btn"), addNewDocBtn = document.querySelector("#new-doc-btn"), docNavSection = document.querySelector(".docs-nav-section"), allDocs = document.querySelector(".all-docs");
const markdownInput = document.getElementById('markdown-input'), preview = document.getElementById('preview-content');
marked.setOptions({
    mangle: false,
    headerIds: false
});
function displayPreview(dpname, dpcontent) {
    if (docNameEditable && markdownInput && preview) {
        docNameEditable.value = dpname;
        markdownInput.value = dpcontent;
        preview.innerHTML = marked.parse(markdownInput.value);
    }
}
function updatePreview() {
    if (markdownInput && preview) {
        markdownInput.addEventListener('input', () => {
            if (preview) {
                preview.innerHTML = marked.parse(markdownInput.value);
            }
        });
    }
}
function createNewDocDiv(cdate, cname, ccontent) {
    cdate = cdate || "";
    cname = cname || "";
    ccontent = ccontent || "";
    const newDoc = document.createElement('div');
    newDoc.classList.add('new-doc');
    const iconDoc = new Image();
    iconDoc.src = './public/assets/icon-document.svg';
    iconDoc.alt = 'icon-doc';
    iconDoc.classList.add('icon-doc');
    const docDateName = document.createElement('div');
    docDateName.classList.add('doc-date-name');
    const docDate = document.createElement('label');
    const dateObj = new Date(cdate); //1st param
    const dateFormatted = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');
    docDate.classList.add('doc-date');
    docDate.textContent = dateFormatted;
    const docName = document.createElement('a');
    docName.href = "#";
    docName.classList.add('doc-name-uneditable');
    docName.textContent = cname; //2nd param
    let docNameWoMD = docName.textContent.split(".")[0];
    if (docNameWoMD.includes('(') || docNameWoMD.includes(')')) {
        docNameWoMD = docNameWoMD.replace(/\(|\)/g, '');
    }
    docName.setAttribute('id', docNameWoMD);
    const docContent = document.createElement('p');
    docContent.classList.add('doc-content');
    docContent.style.display = "none";
    docContent.textContent = ccontent; //3rd param
    docDateName.appendChild(docDate);
    docDateName.appendChild(docName);
    newDoc.setAttribute('id', `new-doc-${docNameWoMD}`);
    newDoc.appendChild(iconDoc);
    newDoc.appendChild(docDateName);
    newDoc.appendChild(docContent);
    if (allDocs && docNavSection) {
        allDocs.appendChild(newDoc);
        docNavSection.appendChild(allDocs);
    }
    displayPreview(cname, ccontent); //2nd and 3rd params
}
const loadDocs = () => __awaiter(void 0, void 0, void 0, function* () {
    if (allDocs) {
        allDocs.innerHTML = "";
        let response = yield fetch('./public/data.json');
        let docs = yield response.json();
        for (let i = 0; i < docs.length; i++) {
            const createdDate = docs[i].createdAt, name = docs[i].name, content = docs[i].content;
            createNewDocDiv(createdDate, name, content);
        }
    }
});
let count = 0; //has to be outside
const addNewDoc = () => {
    const docNameUneditables = document.querySelectorAll(".doc-name-uneditable"); //for those that already exist
    for (let j = 0; j < docNameUneditables.length; j++) {
        const stripDocNameUneditable = docNameUneditables[j].textContent.split(".")[0];
        if (stripDocNameUneditable === 'untitled-document') {
            ++count;
        }
        ;
    }
    createNewDocDiv(Date.now().toString(), `untitled-document(${count}).md`, untitledText);
};
const updateDocNameUneditable = () => {
    const docnameUneditables = document.querySelectorAll(".doc-name-uneditable");
    for (let d = 0; d < docnameUneditables.length; d++) {
        docnameUneditables[docnameUneditables.length - 1].innerHTML = (docNameEditable === null || docNameEditable === void 0 ? void 0 : docNameEditable.value) || "";
    }
};
const saveChangestoLS = () => {
    var _a, _b;
    const newDocs = document.querySelectorAll(".new-doc");
    for (let n = 0; n < newDocs.length; n++) {
        if (newDocs[n].innerHTML.includes((docNameEditable === null || docNameEditable === void 0 ? void 0 : docNameEditable.value) || "")) {
            let x = ((docNameEditable === null || docNameEditable === void 0 ? void 0 : docNameEditable.value) || "").split(".")[0];
            if (x.includes('(') || x.includes(')')) {
                x = x.replace(/\(|\)/g, '');
            }
            newDocs[n].id = `"new-doc-${x}"`;
            (_a = newDocs[n].querySelector(".doc-name-uneditable")) === null || _a === void 0 ? void 0 : _a.setAttribute('id', x);
            (_b = newDocs[n].querySelector(".doc-content")) === null || _b === void 0 ? void 0 : _b.textContent = (markdownInput === null || markdownInput === void 0 ? void 0 : markdownInput.value) || "";
        }
    }
    const sdateObj = new Date();
    const sdate = sdateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');
    const currentDate = sdate;
    const currentDocName = (docNameEditable === null || docNameEditable === void 0 ? void 0 : docNameEditable.value) || "";
    const currentDocContent = (markdownInput === null || markdownInput === void 0 ? void 0 : markdownInput.value) || "";
    const documentData = {
        datesaved: currentDate,
        namesaved: currentDocName,
        contentsaved: currentDocContent
    };
    localStorage.setItem((docNameEditable === null || docNameEditable === void 0 ? void 0 : docNameEditable.value) || "", JSON.stringify(documentData));
};
updatePreview();
loadDocs();
if (addNewDocBtn) {
    addNewDocBtn.addEventListener('click', addNewDoc);
}
if (docNameEditable) {
    docNameEditable.addEventListener("input", updateDocNameUneditable);
}
if (saveBtn) {
    saveBtn.addEventListener('click', saveChangestoLS);
}
