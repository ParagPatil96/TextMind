import { marked } from "marked";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Popup loaded');
        // Get the response from storage
        const { lastResponse, lastResponseTime } = await chrome.storage.local.get(['lastResponse', 'lastResponseTime']);
        console.log('Got response from storage:', { lastResponse, lastResponseTime });
        
        // Only show response if it's from the last 5 seconds
        if (lastResponse && lastResponseTime && (Date.now() - lastResponseTime < 5000)) {
            const { options, summary } = splitOptionsAndSummary(lastResponse);
            displayResponses(options, summary);
        } else {
            // Show a message if no recent response
            const container = document.getElementById('responses');
            if (container) {
                container.innerHTML = '<div class="response-container">Select text and use the context menu to get AI assistance.</div>';
            }
        }
    } catch (error) {
        console.error('Error loading response:', error);
    }
});

// Split the markdown into options based on headings like "**Option 1"
function splitOptionsAndSummary(markdown: string): { options: { title: string, content: string }[], summary?: string } {
    // Split on lines that start with "**Option" (at the beginning of a line)
    const parts = markdown.split(/\n(?=\*\*Option \d+)/g).map(s => s.trim()).filter(Boolean);

    // If the first part doesn't start with "**Option", treat it as a summary and skip it
    let options = (parts.length > 1 && !parts[0].startsWith('**Option')) ? parts.slice(1) : parts;
    let summary: string | undefined = undefined;

    // Check if the last option contains a summary/final note (not a blockquote)
    if (options.length > 0) {
        const last = options[options.length - 1];
        // Split last option into lines
        const lines = last.split('\n');
        // Find the index where the first non-blockquote line appears after the first line
        const summaryIndex = lines.findIndex((line, idx) => idx > 0 && !line.trim().startsWith('>') && line.trim() !== '');
        if (summaryIndex !== -1) {
            // Move the summary out of the option
            summary = lines.slice(summaryIndex).join('\n').trim();
            options[options.length - 1] = lines.slice(0, summaryIndex).join('\n').trim();
        }
    }

    // Extract title/content as before
    const optionObjs = options.map(opt => {
        const match = opt.match(/^\*\*(Option.*?):\*\*\s*/);
        if (match) {
            const title = match[1];
            const content = opt.slice(match[0].length).trim();
            return { title, content };
        } else {
            return { title: `Option`, content: opt };
        }
    });

    return { options: optionObjs, summary };
}

function displayResponses(responses: { title: string, content: string }[], summary?: string) {
    const container = document.getElementById('responses');
    if (!container) return;

    container.innerHTML = '';

    responses.forEach((response, index) => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response-container';

        const header = document.createElement('div');
        header.className = 'response-header';

        const title = document.createElement('div');
        title.className = 'response-title';
        title.textContent = response.title;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';

        const successMessage = document.createElement('span');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Copied!';

        const content = document.createElement('div');
        content.className = 'markdown-content';

        try {
            const strippedContent = stripBlockquotes(response.content);
            const html = marked.parse(strippedContent);
            if (typeof html === "string") {
                content.innerHTML = html;
            } else if (html instanceof Promise) {
                html.then(res => content.innerHTML = res);
            }
        } catch (error) {
            content.textContent = stripBlockquotes(response.content);
        }

        header.appendChild(title);
        header.appendChild(copyButton);
        header.appendChild(successMessage);

        responseDiv.appendChild(header);
        responseDiv.appendChild(content);
        container.appendChild(responseDiv);

        copyButton.addEventListener('click', async () => {
            try {
                const strippedContent = stripBlockquotes(response.content);
                await navigator.clipboard.writeText(strippedContent);
                successMessage.style.display = 'inline';
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 2000);
                });
            } catch (error) {
                console.error('Failed to copy:', error);
            }
        });
    });

    if (summary) {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary-section';

        const title = document.createElement('div');
        title.className = 'summary-title';
        title.textContent = 'Summary';

        const content = document.createElement('div');
        content.className = 'summary-content';
        content.textContent = stripBlockquotes(summary);

        summaryDiv.appendChild(title);
        summaryDiv.appendChild(content);
        container.appendChild(summaryDiv);
    }
}

function stripBlockquotes(markdown: string): string {
    return markdown
        .split('\n')
        .map(line => line.replace(/^\s*> ?/, '')) // Remove leading > and optional space
        .join('\n')
        .trim();
} 