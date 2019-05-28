function submitEntry(entry) {

    function persistToLocalStore() {
        let existing = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (existing == null) existing = [];
        existing.push(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }

    function sendToLocalhostServer() {
        fetch("http://127.0.0.1:6060", {
            method: "POST",
            body: JSON.stringify(entry)
        });
    }

    persistToLocalStore();
    sendToLocalhostServer();
}
