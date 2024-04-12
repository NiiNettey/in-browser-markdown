"use strict";
function convertToMarkdown(input) {
    // Replace newline characters with <br> tags
    input = input.replace(/\n/g, '<br>');
    // Rules for converting input to markdown
    const rules = [
        { regex: /^#\s(.+)/gm, replacement: '<h1>$1</h1>' },
        { regex: /^##\s(.+)/gm, replacement: '<h2>$1</h2>' },
        { regex: /^###\s(.+)/gm, replacement: '<h3>$1</h3>' },
        { regex: /\*\*(.+?)\*\*/gm, replacement: '<strong>$1</strong>' }, // Bold text
        { regex: /\*(.+?)\*/gm, replacement: '<em>$1</em>' }, // Italic text
        { regex: /^>\s(.+)/gm, replacement: '<blockquote>$1</blockquote>' },
        { regex: /^\d+\.\s(.+)/gm, replacement: '<ol><li>$1</li></ol>' },
        { regex: /^-\s(.+)/gm, replacement: '<ul><li>$1</li></ul>' },
        { regex: /`(.+?)`/gm, replacement: '<code>$1</code>' },
        { regex: /---/gm, replacement: '<hr>' },
        { regex: /\[(.+?)\]\((.+?)\)/gm, replacement: '<a href="$2">$1</a>' },
        { regex: /!\[(.+?)\]\((.+?)\)/gm, replacement: '<img src="$2" alt="$1">' }
    ];
    // Applying rules to input
    let markdown = input;
    rules.forEach(rule => {
        markdown = markdown.replace(rule.regex, rule.replacement);
    });
    return markdown;
}
document.addEventListener('DOMContentLoaded', () => {
    const markupInput = document.getElementById('markup-input');
    const previewOutput = document.getElementById('preview-output');
    const updatePreview = () => {
        const inputText = markupInput.value;
        const markdownOutput = convertToMarkdown(inputText);
        previewOutput.innerHTML = markdownOutput;
    };
    // Update preview on input or keyup events
    markupInput.addEventListener('input', updatePreview);
    markupInput.addEventListener('keyup', updatePreview);
});
