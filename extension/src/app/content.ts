
const pattern = /^https:\/\/meet\.google\.com\/[a-z]+-[a-z]+-[a-z]+$/

chrome.runtime.sendMessage({}, (response) => {
    var checkReady = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(checkReady)
            if(!pattern.exec(window.location.href)) return;
            console.log("We're in the injected content script!")
            import('../ui/overlay');
        }
    })
})