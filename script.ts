
// ---------- For toggling btn day & night mode + prefers-color-scheme on load ---------- //
function toggleTheme(): void {
    document.getElementById("toggle")?.addEventListener("click", () => { //Have to target the input not label
        document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
    });
}

function themeOnLoad(): void {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
    } 
}

toggleTheme();
window.onload = themeOnLoad;


// --------------------------- Rename, load, add, save changes -------------------------- //
const welcomeText: string = "# Welcome to Markdown\n\nMarkdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.\n\n## How to use this?\n\n1. Write markdown in the markdown editor window\n2. See the rendered markdown in the preview window\n\n### Features\n\n- Create headings, paragraphs, links, blockquotes, inline-code, code blocks, and lists\n- Name and save the document to access again later\n- Choose between Light or Dark mode depending on your preference\n\n> This is an example of a blockquote. If you would like to learn more about markdown syntax, you can visit this [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).\n\n#### Headings\n\nTo create a heading, add the hash sign (#) before the heading. The number of number signs you use should correspond to the heading level. You'll see in this guide that we've used all six heading levels (not necessarily in the correct way you should use headings!) to illustrate how they should look.\n\n##### Lists\n\nYou can see examples of ordered and unordered lists above.\n\n###### Code Blocks\n\nThis markdown editor allows for inline-code snippets, like this: `<p>I'm inline</p>`. It also allows for larger code blocks like this:\n\n\n<main>\n  <h1>This is a larger code block</h1>\n</main>\n`";
const untitledText: string = "# This is a new untitled document.\n\nStart typing here to see preview and use the editor.";

const docNameEditable: HTMLInputElement = document.querySelector("#doc-name-editable") as HTMLInputElement,
      saveBtn: HTMLButtonElement = document.querySelector("#save-change-btn") as HTMLButtonElement,
      addNewDocBtn: HTMLButtonElement = document.querySelector("#new-doc-btn") as HTMLButtonElement,
      docNavSection: HTMLElement = document.querySelector(".docs-nav-section") as HTMLElement,
      allDocs: HTMLElement = document.querySelector(".all-docs") as HTMLElement;

let markdownInput: HTMLTextAreaElement = document.getElementById('markdown-input') as HTMLTextAreaElement,
    preview: HTMLElement = document.getElementById('preview-content') as HTMLElement;

marked.setOptions ({
    mangle: false,
    headerIds: false
});

function displayPreview(dpname: string, dpcontent: string): void {
    docNameEditable.value = dpname;
    markdownInput.value = dpcontent;
    preview.innerHTML = marked.parse(markdownInput.value);
}

function updatePreview(): void {
    markdownInput.addEventListener('input', () => {
        preview.innerHTML = marked.parse(markdownInput.value);
    });
}

function createNewDocDiv(cdate: string, cname: string, ccontent: string): void {
    cdate = cdate || "";
    cname = cname || "";
    ccontent = ccontent || "";

    const newDoc: HTMLDivElement = document.createElement('div');
    newDoc.classList.add('new-doc');

    const iconDoc: HTMLImageElement = document.createElement('img');
    iconDoc.src = './assets/icon-document.svg';
    iconDoc.alt= 'icon-doc';
    iconDoc.classList.add('icon-doc');

    const docDateName: HTMLDivElement = document.createElement('div');
    docDateName.classList.add('doc-date-name');

    const docDate: HTMLLabelElement = document.createElement('label');
    const dateObj: Date = new Date(cdate); //1st param
    const dateFormatted: string = dateObj.toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}).replace(',', '');
    docDate.classList.add('doc-date');
    docDate.textContent = dateFormatted;

    const docName: HTMLAnchorElement = document.createElement('a');
    docName.href = "#";
    docName.classList.add('doc-name-uneditable');
    docName.textContent = cname; //2nd param

    let docNameWoMD: string = docName.textContent.split(".")[0];
    if (docNameWoMD.includes('(') || docNameWoMD.includes(')')) {
        docNameWoMD = docNameWoMD.replace(/\(|\)/g, '');
    }

    docName.setAttribute('id', docNameWoMD);

    const docContent: HTMLParagraphElement = document.createElement('p');
    docContent.classList.add('doc-content');
    docContent.style.display = "none";
    docContent.textContent = ccontent; //3rd param
        
    docDateName.appendChild(docDate);
    docDateName.appendChild(docName);
    
    newDoc.setAttribute('id', `new-doc-${docNameWoMD}`);
    newDoc.appendChild(iconDoc);
    newDoc.appendChild(docDateName);
    newDoc.appendChild(docContent);

    allDocs.appendChild(newDoc);

    docNavSection.appendChild(allDocs);

    displayPreview(cname, ccontent); //2nd and 3rd params
}

const loadDocs = async(): Promise<void> => { //the markdown input section always shows content of last entry by default on load
    allDocs.innerHTML = "";
    let response: Response = await fetch('./data.json');
    let docs: any[] = await response.json();
    for (let i=0; i<docs.length; i++) {
        const createdDate: string = docs[i].createdAt,
              name: string = docs[i].name,
              content: string = docs[i].content;   
        createNewDocDiv(createdDate, name, content); 
    }
}

let count: number = 0; //has to be outside
const addNewDoc = (): void => {
    const docNameUneditables: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".doc-name-uneditable"); //for those that already exist
    for (let j = 0; j<docNameUneditables.length; j++) {
        const stripDocNameUneditable: string = docNameUneditables[j].textContent?.split(".")[0] || '';
        if (stripDocNameUneditable === 'untitled-document') {
            ++count;
        };
    } 
    createNewDocDiv(Date.now().toString(),`untitled-document(${count}).md`, untitledText); 
}

const updateDocNameUneditable = (): void => {
    const docnameUneditables: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".doc-name-uneditable");
    for (let d=0; d<docnameUneditables.length; d++) {
        docnameUneditables[docnameUneditables.length-1].innerHTML = docNameEditable.value;
    }
}

const saveChangestoLS = (): void => {
    const newDocs: NodeListOf<HTMLDivElement> = document.querySelectorAll(".new-doc");
    for (let n=0; n<newDocs.length; n++) {
        if (newDocs[n].innerHTML.includes(docNameEditable.value)) {
            let x: string = docNameEditable.value.split(".")[0];
            if (x.includes('(') || x.includes(')')) {
                x = x.replace(/\(|\)/g, '');
            }
            newDocs[n].id = `"new-doc-${x}"`;
            newDocs[n].querySelector(".doc-name-uneditable")?.setAttribute('id', x);
            newDocs[n].querySelector(".doc-content")!.textContent = markdownInput.value;
        }
    }

    const sdateObj: Date = new Date();
    const sdate: string = sdateObj.toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}).replace(',', '');
    const currentDate: string = sdate;
    const currentDocName: string = docNameEditable.value;
    const currentDocContent: string = markdownInput.value;
    
    const documentData: { datesaved: string; namesaved: string; contentsaved: string } = {
        datesaved: currentDate,
        namesaved: currentDocName,
        contentsaved: currentDocContent
    };
    localStorage.setItem(docNameEditable.value, JSON.stringify(documentData));
}


updatePreview();
loadDocs(); 
addNewDocBtn.addEventListener('click', addNewDoc);
docNameEditable.addEventListener("input", updateDocNameUneditable);
saveBtn.addEventListener('click', saveChangestoLS);


// ----------- For changing delBtn SVG element on hover, delete function + toggling preview & sidebar ----------- //
const delBtn: HTMLButtonElement = document.querySelector("#del-btn") as HTMLButtonElement,
      delPathElement: SVGPathElement = delBtn.querySelector("svg path") as SVGPathElement,
      delPromptBox: HTMLDivElement = document.querySelector("#delete-prompt-box-bg") as HTMLDivElement,
      cfmDelBtn: HTMLButtonElement = document.querySelector("#cfm-n-del-btn") as HTMLButtonElement,
      docToDel: HTMLElement = document.querySelector('#doc-to-del') as HTMLElement;

const mainInputSection: HTMLElement = document.querySelector('.markdown-main-container') as HTMLElement,
      markdownInputSection: HTMLElement = document.querySelector('#markdown-input-section') as HTMLElement,
      previewToggleDiv: HTMLDivElement = document.querySelector("#preview-toggle") as HTMLDivElement,
      previewToggle: HTMLSpanElement = previewToggleDiv.querySelector("span") as HTMLSpanElement;

const sideBarToggleDiv: HTMLDivElement = document.querySelector("#menu-close-toggle") as HTMLDivElement,
      sideBarToggle: HTMLSpanElement = sideBarToggleDiv.querySelector("span") as HTMLSpanElement;

const delDoc = (): void => {
    delPromptBox.style.display = "none";
    const allNewDocs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.new-doc');
    for (const div of allNewDocs) {
        if (div.innerHTML.includes(docToDel.textContent?.replace(/[']+/g, '') || '')) {
            div.remove();
        }
    }
    docNameEditable.value = 'welcome.md'; //reset to default
    markdownInput.value = welcomeText; //reset to default
    preview.innerHTML = marked.parse(markdownInput.value);
}

previewToggleDiv.addEventListener("click", () => {
    previewToggle.classList.toggle("hide");
    markdownInputSection.classList.toggle("hide-markdown");
    mainInputSection.classList.toggle("hide-markdown");
    preview.classList.toggle("hide-markdown");
});

sideBarToggleDiv.addEventListener("click", () => {sideBarToggle.classList.toggle("close")});

delBtn.addEventListener("mouseover", () => {delPathElement.style.fill = "var(--orange)"});

delBtn.addEventListener("mouseout", () => {delPathElement.style.fill = ""});

delBtn.addEventListener("click", () => {
    delPromptBox.style.display = "block";
    docToDel.textContent = `'${docNameEditable.value}'`;
});

cfmDelBtn.addEventListener("click", delDoc);

delPromptBox.addEventListener("click", () => {delPromptBox.style.display = "none";}); //click elsewhere if you do not want to confirm and delete

