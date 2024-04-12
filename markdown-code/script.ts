function toggleTheme(): void {
  const toggleButton: HTMLElement | null = document.getElementById("toggle");
  if (toggleButton) {
      toggleButton.addEventListener("click", () => {
          document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
      });
  }
}

function themeOnLoad(): void {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
  }
}

toggleTheme();
window.onload = themeOnLoad();

const welcomeText: string = "# Welcome to Markdown\n\nMarkdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.\n\n## How to use this?\n\n1. Write markdown in the markdown editor window\n2. See the rendered markdown in the preview window\n\n### Features\n\n- Create headings, paragraphs, links, blockquotes, inline-code, code blocks, and lists\n- Name and save the document to access again later\n- Choose between Light or Dark mode depending on your preference\n\n> This is an example of a blockquote. If you would like to learn more about markdown syntax, you can visit this [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).\n\n#### Headings\n\nTo create a heading, add the hash sign (#) before the heading. The number of number signs you use should correspond to the heading level. You'll see in this guide that we've used all six heading levels (not necessarily in the correct way you should use headings!) to illustrate how they should look.\n\n##### Lists\n\nYou can see examples of ordered and unordered lists above.\n\n###### Code Blocks\n\nThis markdown editor allows for inline-code snippets, like this: `<p>I'm inline</p>`. It also allows for larger code blocks like this:\n\n```\n<main>\n  <h1>This is a larger code block</h1>\n</main>\n```";
const untitledText: string = "# This is a new untitled document.\n\nStart typing here to see preview and use the editor.";

const docNameEditable: HTMLElement | null = document.querySelector("#doc-name-editable"),
    saveBtn: HTMLElement | null = document.querySelector("#save-change-btn"),
    addNewDocBtn: HTMLElement | null = document.querySelector("#new-doc-btn"),
    docNavSection: HTMLElement | null = document.querySelector(".docs-nav-section"),
    allDocs: HTMLElement | null = document.querySelector(".all-docs");

const markdownInput: HTMLElement | null = document.getElementById('markdown-input'),
  preview: HTMLElement | null = document.getElementById('preview-content');

marked.setOptions ({
  mangle: false,
  headerIds: false
});

function displayPreview(dpname: string, dpcontent: string): void {
  if (docNameEditable && markdownInput && preview) {
      docNameEditable.value = dpname;
      markdownInput.value = dpcontent;
      preview.innerHTML = marked.parse(markdownInput.value);
  }
}

function updatePreview(): void {
  if (markdownInput && preview) {
      markdownInput.addEventListener('input', () => {
          if (preview) {
              preview.innerHTML = marked.parse(markdownInput.value);
          }
      });
  }
}

function createNewDocDiv(cdate: string, cname: string, ccontent: string): void {
  cdate = cdate || "";
  cname = cname || "";
  ccontent = ccontent || "";

  const newDoc: HTMLElement = document.createElement('div');
  newDoc.classList.add('new-doc');

  const iconDoc: HTMLImageElement = new Image();
  iconDoc.src = './public/assets/icon-document.svg';
  iconDoc.alt= 'icon-doc';
  iconDoc.classList.add('icon-doc');

  const docDateName: HTMLElement = document.createElement('div');
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

  const docContent: HTMLElement = document.createElement('p');
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

const loadDocs = async(): Promise<void> => { //the markdown input section always shows content of last entry by default on load
  if (allDocs) {
      allDocs.innerHTML = "";
      let response: Response = await fetch('./public/data.json');
      let docs: any[] = await response.json();
      for (let i = 0; i < docs.length; i++) {
          const createdDate: string = docs[i].createdAt,
                name: string = docs[i].name,
                content: string = docs[i].content;   
          createNewDocDiv(createdDate, name, content); 
      }
  }
}

let count: number = 0; //has to be outside
const addNewDoc = (): void => {
  const docNameUneditables: NodeListOf<Element> = document.querySelectorAll(".doc-name-uneditable"); //for those that already exist
  for (let j = 0; j < docNameUneditables.length; j++) {
      const stripDocNameUneditable: string = docNameUneditables[j].textContent.split(".")[0];
      if (stripDocNameUneditable === 'untitled-document') {
          ++count;
      };
  } 
  createNewDocDiv(Date.now().toString(), `untitled-document(${count}).md`, untitledText); 
}

const updateDocNameUneditable = (): void => {
  const docnameUneditables: NodeListOf<Element> = document.querySelectorAll(".doc-name-uneditable");
  for (let d = 0; d < docnameUneditables.length; d++) {
      docnameUneditables[docnameUneditables.length - 1].innerHTML = docNameEditable?.value || "";
  }
}

const saveChangestoLS = (): void => {
  const newDocs: NodeListOf<Element> = document.querySelectorAll(".new-doc");
  for (let n = 0; n < newDocs.length; n++) {
      if (newDocs[n].innerHTML.includes(docNameEditable?.value || "")) {
          let x: string = (docNameEditable?.value || "").split(".")[0];
          if (x.includes('(') || x.includes(')')) {
              x = x.replace(/\(|\)/g, '');
          }
          newDocs[n].id = `"new-doc-${x}"`;
          newDocs[n].querySelector(".doc-name-uneditable")?.setAttribute('id', x);
          newDocs[n].querySelector(".doc-content")?.textContent = markdownInput?.value || "";
      }
  }

  const sdateObj: Date = new Date();
  const sdate: string = sdateObj.toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}).replace(',', '');
  const currentDate: string = sdate;
  const currentDocName: string = docNameEditable?.value || "";
  const currentDocContent: string = markdownInput?.value || "";
  
  const documentData: any = {
      datesaved: currentDate,
      namesaved: currentDocName,
      contentsaved: currentDocContent
  };
  localStorage.setItem(docNameEditable?.value || "", JSON.stringify(documentData));
}

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
