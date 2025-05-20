chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "reword-text",
    title: "🔁 Reword using AI",
    contexts: ["selection"]
  });

chrome.contextMenus.create({
    id: "summarize-text",
    title: "📌 Summarize in bullet points",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("Context menu clicked", info.menuItemId);
  const promptMap: Record<string, string> = {
    "reword-text": "Reword using AI",
    "summarize-text": "Summarize in bullet points"
  };
  const prompt = promptMap[info.menuItemId];
  
  if (!tab?.id) {
    console.error("No tab ID available");
    return;
  }

  try {
    // Check if API key exists
    const { geminiKey } = await chrome.storage.local.get(['geminiKey']);
    if (!geminiKey) {
      throw new Error("Please set your Gemini API key in the extension options");
    }

    // First, get the selected text
    const [{ result: selectedText }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || ''
    });

    if (!selectedText) {
      throw new Error("No text selected");
    }

    // Make the API call
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${prompt} \n ${selectedText}`
          }]
        }]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      // Store the response in chrome.storage
      await chrome.storage.local.set({ 
        lastResponse: data.candidates[0].content.parts[0].text,
        lastResponseTime: Date.now()
      });
      
      // Create a new window
      await chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 600,
        height: 400,
        focused: true,
        left: 0,
        top: 0
      });
    } else {
      throw new Error("Unexpected response format from API");
    }
  } catch (error) {
    console.error("Error:", error);
    alert(error instanceof Error ? error.message : "An error occurred");
  }
});
