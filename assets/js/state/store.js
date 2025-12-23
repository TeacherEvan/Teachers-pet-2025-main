/**
 * Reactive State Store with LocalStorage Persistence
 * Uses Proxy pattern to automatically sync state changes to localStorage.
 */

export function createPersistentStore(key, initialState = {}) {
    // 1. Load existing data from localStorage
    let data = { ...initialState };
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge stored data with initial state structure
            data = { ...data, ...parsed };
        }
    } catch (e) {
        console.warn(`Error loading ${key} from storage:`, e);
    }

    // 2. Create Proxy Handler
    const handler = {
        set(target, prop, value) {
            // Reflect.set returns true if successful
            const result = Reflect.set(target, prop, value);
            
            // Auto-save to localStorage
            try {
                localStorage.setItem(key, JSON.stringify(target));
                
                // Optional: Log for debugging
                if (window.__TP_DEBUG__) {
                    console.log(`💾 State Saved [${key}]: ${prop} =`, value);
                }
            } catch (e) {
                console.error(`Error saving ${key} to storage:`, e);
            }
            
            return result;
        },
        
        // Optional: Intercept get to ensure we always have fresh data if modified elsewhere?
        // For now, standard get is fine as we assume this proxy is the source of truth.
    };

    // 3. Return Proxy
    return new Proxy(data, handler);
}
