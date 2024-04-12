//function for toggling themes 
function toggleTheme(): void {
  document.getElementById("toggle")?.addEventListener("click", () => {
      document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
  });
}

function themeOnLoad(): void {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
  } 
}

// Markdown functions
function mark(markdown: string): string {
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

// Preview display Function
function displayPreview(dpname: string, dpcontent: string): void {
  const docNameEditable = document.querySelector("#doc-name-editable") as HTMLInputElement | null;
  const markdownInput = document.getElementById('markdown-input') as HTMLTextAreaElement | null;
  const preview = document.getElementById('preview-content');

  if (docNameEditable && markdownInput && preview) {
      docNameEditable.value = dpname;
      markdownInput.value = dpcontent;
      preview.innerHTML = mark(markdownInput.value);
  }
}

function updatePreview(): void {
  const markdownInput = document.getElementById('markdown-input') as HTMLTextAreaElement | null;
  const preview = document.getElementById('preview-content');

  if (markdownInput && preview) {
      markdownInput.addEventListener('input', () => {
          if (preview) {
              preview.innerHTML = mark(markdownInput.value);
          }
      });
  }
}


// new document function
function addNewDocument(): void {
  const docNameUneditables = document.querySelectorAll(".doc-name-uneditable");
  let count = 0;

  for (const element of docNameUneditables) {
      const textContent = element.textContent;
      if (textContent && textContent.includes('untitled-document')) {
          count++;
      }
  }

  createNewDocDiv(Date.now(), `untitled-document(${count}).md`, untitledText);
}

