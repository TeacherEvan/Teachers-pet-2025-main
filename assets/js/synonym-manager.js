/* eslint-env es6 */
/* eslint-disable no-unused-vars */
/* global window, sessionStorage */
/**
 * Synonym Manager - Intelligent Word Variation System
 * Tracks word usage across comment generation session and swaps overused terms
 * with contextually appropriate synonyms to maintain professional variety
 * @class SynonymManager
 */

/**
 * Debug logging helper - only logs when window.__TP_DEBUG__ === true
 * @param {string} emoji - Emoji prefix for the log message
 * @param {string} message - Main log message
 * @param {...any} args - Additional arguments to log
 */
function debugLogSynonym(emoji, message, ...args) {
    if (typeof window !== 'undefined' && window.__TP_DEBUG__ === true) {
        console.log(emoji + ' ' + message, ...args);
    }
}

class SynonymManager {
    constructor() {
        this.synonymData = null;
        this.usageCounts = this.loadUsageCounts();
        this.sessionActive = true;
        this.maxUsageThreshold = 2; // Maximum uses before swapping
        this.initialized = false;

        debugLogSynonym('📚', 'SynonymManager: Initializing...');
    }

    /**
     * Load synonym data from JSON file
     */
    async loadSynonymData() {
        if (this.synonymData) {
            return this.synonymData;
        }

        try {
            const response = await fetch('assets/data/synonyms.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.synonymData = await response.json();
            this.initialized = true;
            debugLogSynonym('✅', 'SynonymManager: Synonym data loaded successfully', {
                categories: Object.keys(this.synonymData),
                totalWords: this.getTotalWordCount()
            });
            return this.synonymData;
        } catch (error) {
            console.error('❌ SynonymManager: Failed to load synonym data:', error);
            this.synonymData = this.getEmptySynonymData();
            return this.synonymData;
        }
    }

    /**
     * Get total word count across all categories
     */
    getTotalWordCount() {
        if (!this.synonymData) return 0;

        let total = 0;
        Object.values(this.synonymData).forEach(category => {
            total += Object.keys(category).length;
        });
        return total;
    }

    /**
     * Fallback empty synonym data structure
     */
    getEmptySynonymData() {
        return {
            adjectives: {},
            verbs: {},
            adverbs: {},
            educational_terms: {},
            phrases: {}
        };
    }

    /**
     * Load usage counts from sessionStorage
     */
    loadUsageCounts() {
        try {
            const stored = sessionStorage.getItem('synonymUsageCounts');
            if (stored) {
                const counts = JSON.parse(stored);
                debugLogSynonym('📊', 'SynonymManager: Loaded usage counts from session', counts);
                return counts;
            }
        } catch (error) {
            console.warn('⚠️ SynonymManager: Could not load usage counts:', error);
        }
        return {};
    }

    /**
     * Save usage counts to sessionStorage
     */
    saveUsageCounts() {
        try {
            sessionStorage.setItem('synonymUsageCounts', JSON.stringify(this.usageCounts));
            debugLogSynonym('💾', 'SynonymManager: Saved usage counts to session');
        } catch (error) {
            console.warn('⚠️ SynonymManager: Could not save usage counts:', error);
        }
    }

    /**
     * Get current usage count for a word
     */
    getUsageCount(word) {
        const normalized = word.toLowerCase().trim();
        return this.usageCounts[normalized] || 0;
    }

    /**
     * Increment usage count for a word
     */
    incrementUsage(word) {
        const normalized = word.toLowerCase().trim();
        this.usageCounts[normalized] = (this.usageCounts[normalized] || 0) + 1;
        this.saveUsageCounts();

        debugLogSynonym('📈', `SynonymManager: "${word}" usage count: ${this.usageCounts[normalized]}`);
    }

    /**
     * Find synonyms for a word across all categories
     */
    findSynonyms(word) {
        if (!this.synonymData) {
            return [];
        }

        const normalized = word.toLowerCase().trim();

        // Search all categories
        for (const category of Object.values(this.synonymData)) {
            if (category[normalized]) {
                return category[normalized];
            }
        }

        return [];
    }

    /**
     * Select the least-used synonym from available options
     */
    selectBestSynonym(word, availableSynonyms) {
        if (!availableSynonyms || availableSynonyms.length === 0) {
            return word;
        }

        // Find synonym with lowest usage count
        let bestSynonym = availableSynonyms[0];
        let lowestCount = this.getUsageCount(bestSynonym);

        for (const synonym of availableSynonyms) {
            const count = this.getUsageCount(synonym);
            if (count < lowestCount) {
                lowestCount = count;
                bestSynonym = synonym;
            }
        }

        debugLogSynonym('🔄', `SynonymManager: Replacing "${word}" (used ${this.getUsageCount(word)}x) with "${bestSynonym}" (used ${lowestCount}x)`);

        return bestSynonym;
    }

    /**
     * Check if a word should be replaced based on usage threshold
     */
    shouldReplace(word) {
        return this.getUsageCount(word) >= this.maxUsageThreshold;
    }

    /**
     * Process text and replace overused words with synonyms
     * @param {string} text - The text to process
     * @param {number} threshold - Maximum uses before replacement (default: 2)
     * @returns {Promise<string>} - Processed text with synonyms
     */
    async replaceOverused(text, threshold = 2) {
        if (!text) {
            return text;
        }

        // Ensure synonym data is loaded
        if (!this.initialized) {
            await this.loadSynonymData();
        }

        // Update threshold if provided
        if (threshold !== undefined && threshold > 0) {
            this.maxUsageThreshold = threshold;
        }

        debugLogSynonym('🔍', 'SynonymManager: Processing text for overused words...');
        debugLogSynonym('📏', 'Current usage threshold:', this.maxUsageThreshold);
        debugLogSynonym('📊', 'Current usage counts BEFORE processing:', { ...this.usageCounts });

        // Extract all words from text (case-insensitive matching)
        const wordMatches = text.match(/\b[\w']+\b/g) || [];
        const wordsInText = new Map(); // normalized -> [original forms with positions]

        // Build word frequency map for this specific text
        for (let i = 0; i < wordMatches.length; i++) {
            const word = wordMatches[i];
            const normalized = word.toLowerCase().trim();

            if (normalized.length >= 4) { // Only process substantial words
                if (!wordsInText.has(normalized)) {
                    wordsInText.set(normalized, []);
                }
                wordsInText.get(normalized).push(word);
            }
        }

        debugLogSynonym('📝', 'Words found in current text:', Array.from(wordsInText.keys()));

        // Track replacements to make
        const replacements = new Map(); // original word -> replacement word

        // Check each unique word against usage threshold
        for (const [normalized, instances] of wordsInText.entries()) {
            const currentUsage = this.getUsageCount(normalized);

            debugLogSynonym('🔍', `Checking "${normalized}": current usage = ${currentUsage}, threshold = ${this.maxUsageThreshold}`);

            // If word has been used >= threshold times, try to replace it
            if (currentUsage >= this.maxUsageThreshold) {
                const synonyms = this.findSynonyms(normalized);

                if (synonyms && synonyms.length > 0) {
                    debugLogSynonym('📖', `Found ${synonyms.length} synonyms for "${normalized}":`, synonyms);

                    const bestSynonym = this.selectBestSynonym(normalized, synonyms);

                    if (bestSynonym && bestSynonym.toLowerCase() !== normalized) {
                        replacements.set(normalized, bestSynonym);
                        debugLogSynonym('✅', `Will replace "${normalized}" with "${bestSynonym}"`);
                    }
                } else {
                    debugLogSynonym('⚠️', `No synonyms found for "${normalized}"`);
                }
            }
        }

        debugLogSynonym('🎯', 'Total replacements planned:', replacements.size);

        // Apply replacements with case preservation
        let processedText = text;

        for (const [original, replacement] of replacements.entries()) {
            // Use word boundary regex for accurate replacement
            const regex = new RegExp(`\\b${this.escapeRegex(original)}\\b`, 'gi');

            processedText = processedText.replace(regex, (match) => {
                const replaced = this.matchCase(match, replacement);
                debugLogSynonym('🔄', `Replacing "${match}" → "${replaced}"`);
                return replaced;
            });
        }

        // NOW update usage counts for ALL words in the FINAL processed text
        const finalWords = processedText.match(/\b[\w']+\b/g) || [];
        const uniqueFinalWords = new Set();

        for (const word of finalWords) {
            const normalized = word.toLowerCase().trim();
            if (normalized.length >= 4) {
                uniqueFinalWords.add(normalized);
            }
        }

        // Increment usage for each unique word
        for (const word of uniqueFinalWords) {
            this.incrementUsage(word);
        }

        debugLogSynonym('✅', 'SynonymManager: Text processing complete');

        return processedText;
    }

    /**
     * Match the case pattern of the original word
     */
    matchCase(original, replacement) {
        // All uppercase
        if (original === original.toUpperCase()) {
            return replacement.toUpperCase();
        }

        // First letter uppercase (Title Case)
        if (original[0] === original[0].toUpperCase() && original.slice(1) === original.slice(1).toLowerCase()) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
        }

        // All lowercase or mixed case - use replacement as-is (lowercase)
        return replacement.toLowerCase();
    }

    /**
     * Escape special regex characters in a string
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Reset usage counts (useful for new session or testing)
     */
    resetUsageCounts() {
        this.usageCounts = {};
        this.saveUsageCounts();
        debugLogSynonym('🔄', 'SynonymManager: Usage counts reset');
    }

    /**
     * Get statistics about current session
     */
    getStatistics() {
        return {
            totalWordsTracked: Object.keys(this.usageCounts).length,
            usageCounts: { ...this.usageCounts },
            threshold: this.maxUsageThreshold,
            initialized: this.initialized,
            synonymsAvailable: this.getTotalWordCount()
        };
    }

    /**
     * Export current state for debugging
     */
    exportState() {
        const stats = this.getStatistics();
        console.table(stats.usageCounts);
        return stats;
    }
}

// Global instance for easy access
if (typeof window !== 'undefined') {
    window.SynonymManager = SynonymManager;
    window.synonymManager = new SynonymManager();
    console.log('🌐 SynonymManager: Global instance created (window.synonymManager)');
}
