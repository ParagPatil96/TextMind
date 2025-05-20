# TextMind - Chrome Extension

A powerful Chrome extension that provides instant AI-powered responses for any selected text on the web. Get smart suggestions, explanations, and insights powered by advanced AI models.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) package manager
- Google Chrome browser

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd chrome_extension
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the extension:
```bash
pnpm run build
```

## Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `chrome_extension` directory from your project

## Getting and Adding Gemini API Key

1. **Generate Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your new API key

2. **Add API Key to Extension**:
   - Click the extension icon in your Chrome toolbar
   - Click the settings icon (⚙️) in the extension popup
   - Paste your Gemini API key in the input field
   - Click "Save"

## Using the Extension

1. Select any text on a webpage
2. Right-click and select "Get AI Response" from the context menu
3. The extension will process your selected text and show AI-generated responses
4. Click the "Copy" button next to any response to copy it to your clipboard

## Development

- Source code is in the `src` directory
- Build output goes to the `dist` directory
- Run `pnpm run build` after making changes to rebuild the extension
- Reload the extension in `chrome://extensions/` after rebuilding

## Project Structure

```
chrome_extension/
├── src/
│   ├── popup.ts        # Extension popup UI
│   ├── background.ts   # Background service worker
│   ├── content.ts      # Content script
│   └── styles/         # CSS styles
├── dist/              # Built files
├── popup.html         # Popup HTML
└── manifest.json      # Extension manifest
```

## Troubleshooting

- If the extension doesn't work after loading, try:
  1. Rebuilding the project (`pnpm run build`)
  2. Reloading the extension in `chrome://extensions/`
  3. Refreshing the webpage
- If you get API errors, verify your Gemini API key is correct
- Check the browser console for any error messages

## Security Note

Never share your Gemini API key. The key is stored locally in your browser and is only used to make requests to the Gemini API. 