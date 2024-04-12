"use strict";
function toggleTheme() {
    var _a;
    (_a = document.getElementById("toggle")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
    });
}
function themeOnLoad() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
    }
}
toggleTheme();
window.onload = themeOnLoad();
// --------------------------- Rename, load, add, save changes -------------------------- //
const welcomeText = "# Welcome to Markdown\n\nMarkdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.\n\n## How to use this?\n\n1. Write markdown in the markdown editor window\n2. See the rendered markdown in the preview window\n\n### Features\n\n- Create headings, paragraphs, links, blockquotes, inline-code, code blocks, and lists\n- Name and save the document to access again later\n- Choose between Light or Dark mode depending on your preference\n\n> This is an example of a blockquote. If you would like to learn more about markdown syntax, you can visit this [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).\n\n#### Headings\n\nTo create a heading, add the hash sign (#) before the heading. The number of number signs you use should correspond to the heading level. You'll see in this guide that we've used all six heading levels (not necessarily in the correct way you should use headings!) to illustrate how they should look.\n\n##### Lists\n\nYou can see examples of ordered and unordered lists above.\n\n###### Code Blocks\n\nThis markdown editor allows for inline-code snippets, like this: `<p>I'm inline</p>`. It also allows for larger code blocks like this:\n\n```\n<main>\n  <h1>This is a larger code block</h1>\n</main>\n```";
const untitledText = "# This is a new untitled document.\n\nStart typing here to see preview and use the editor.";
const docNameEditable = document.querySelector("#doc-name-editable"), saveBtn = document.querySelector("#save-change-btn"), addNewDocBtn = document.querySelector("#new-doc-btn"), docNavSection = document.querySelector(".docs-nav-section"), allDocs = document.querySelector(".all-docs");
let markdownInput = document.getElementById('markdown-input'), preview = document.getElementById('preview-content');
function mark(markdown) {
    // Regular expressions to match Markdown syntax
    const headingRegex = /^(#{1,6})\s+(.*)/;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    const blockquoteRegex = /^>\s+(.*)/;
    const orderedListRegex = /^\d+\.\s+(.*)/;
    const unorderedListRegex = /^-\s+(.*)/;
    const codeRegex = /`(.*?)`/g;
    const horizontalRuleRegex = /^---$/;
    const linkRegex = /\[([^\[]+)\]\(([^\)]+)\)/g;
    const imageRegex = /!\[([^\[]+)\]\(([^\)]+)\)/g;
    // Replace Markdown syntax with HTML tags
    markdown = markdown.replace(headingRegex, (_match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text}</h${level}>`;
    });
    markdown = markdown.replace(boldRegex, '<strong>$1</strong>');
    markdown = markdown.replace(italicRegex, '<em>$1</em>');
    markdown = markdown.replace(blockquoteRegex, '<blockquote>$1</blockquote>');
    markdown = markdown.replace(orderedListRegex, '<ol><li>$1</li></ol>');
    markdown = markdown.replace(unorderedListRegex, '<ul><li>$1</li></ul>');
    markdown = markdown.replace(codeRegex, '<code>$1</code>');
    markdown = markdown.replace(horizontalRuleRegex, '<hr>');
    markdown = markdown.replace(linkRegex, '<a href="$2">$1</a>');
    markdown = markdown.replace(imageRegex, '<img src="$2" alt="$1">');
    return markdown;
}
function displayPreview(dpname, dpcontent) {
    if (docNameEditable && markdownInput && preview) {
        docNameEditable.value = dpname;
        markdownInput.value = dpcontent;
        preview.innerHTML = mark(markdownInput.value);
    }
}
function updatePreview() {
    if (markdownInput && preview) {
        markdownInput.addEventListener('input', () => {
            if (preview) {
                preview.innerHTML = mark(markdownInput.value);
            }
        });
    }
}
// Other functions remain unchanged
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
