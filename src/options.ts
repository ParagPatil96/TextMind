document.addEventListener('DOMContentLoaded', () => {
    // Load saved API key
    chrome.storage.local.get(['geminiKey'], (result) => {
        if (result.geminiKey) {
            (document.getElementById('geminiKey') as HTMLInputElement).value = result.geminiKey;
        }
    });

    // Save API key
    document.getElementById('save')?.addEventListener('click', () => {
        const key = (document.getElementById('geminiKey') as HTMLInputElement).value;
        chrome.storage.local.set({ geminiKey: key }, () => {
            alert('Settings saved!');
        });
    });
});