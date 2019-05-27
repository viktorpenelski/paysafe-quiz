function submitEntry(state) {

    const STORAGE_KEY = "persistedCandidates";
    
    console.log("persisting!");

    function persistToLocalStore() {
        let existing = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (existing == null) existing = [];
        existing.push(state);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }

    persistToLocalStore();
}