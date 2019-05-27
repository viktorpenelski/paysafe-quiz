function submitEntry(entry) {

    const STORAGE_KEY = "persistedCandidates";

    function persistToLocalStore() {
        let existing = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (existing == null) existing = [];
        existing.push(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }

    function sendToLocalhostServer() {

        // send "synchronously", because currently a window.refresh reloads the page, cutting off some requests.
        // Once this is no longer the case, async can be used.
        try {
            $.post({
                url: "http://localhost:6060/",
                data: JSON.stringify(entry),
                async: false
            });
        } catch (ignored) {
        }
    }

    persistToLocalStore();
    sendToLocalhostServer();
}
