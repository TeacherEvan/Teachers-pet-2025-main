/* eslint-env es6 */
/* eslint-disable no-unused-vars */
/* global window, sessionStorage */
/**
 * Synonym Manager - Intelligent Word Variation System
 * Tracks word usage across comment generation session and swaps overused terms
 * with contextually appropriate synonyms to maintain professional variety
 * @class SynonymManager
 */

class SynonymManager {
    constructor() {
        this.synonymData = null;
        this.usageCounts = this.loadUsageCounts();
        this.sessionActive = true;
        this.maxUsageThreshold = 2; // Maximum uses before swapping
        this.initialized = false;

        console.log('📚 SynonymManager: Initializing...');
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
            console.log('✅ SynonymManager: Synonym data loaded successfully', {
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
                console.log('📊 SynonymManager: Loaded usage counts from session', counts);
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
            console.log('💾 SynonymManager: Saved usage counts to session');
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

        console.log(`📈 SynonymManager: "${word}" usage count: ${this.usageCounts[normalized]}`);
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

        console.log(`🔄 SynonymManager: Replacing "${word}" (used ${this.getUsageCount(word)}x) with "${bestSynonym}" (used ${lowestCount}x)`);

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

        console.log('🔍 SynonymManager: Processing text for overused words...');
        console.log('📏 Current usage threshold:', this.maxUsageThreshold);

        // Track words in current text for replacement
        const wordsToReplace = new Map(); // word -> replacement

        // Split into words while preserving structure
        const words = text.match(/\b[\w']+\b/g) || [];

        // First pass: identify overused words and find replacements
        for (const word of words) {
            const normalized = word.toLowerCase().trim();

            // Skip if already processed or too short
            if (wordsToReplace.has(normalized) || normalized.length < 4) {
                continue;
            }

            // Check if word is overused
            if (this.shouldReplace(normalized)) {
                const synonyms = this.findSynonyms(normalized);

                if (synonyms.length > 0) {
                    const replacement = this.selectBestSynonym(normalized, synonyms);
                    if (replacement !== normalized) {
                        wordsToReplace.set(normalized, replacement);
                    }
                }
            }
        }

        console.log('🎯 SynonymManager: Found overused words to replace:',
            Array.from(wordsToReplace.entries()));

        // Second pass: replace words while preserving case
        let processedText = text;

        for (const [original, replacement] of wordsToReplace.entries()) {
            // Create regex to match word with word boundaries
            const regex = new RegExp(`\\b${this.escapeRegex(original)}\\b`, 'gi');

            processedText = processedText.replace(regex, (match) => {
                // Preserve original capitalization
                return this.matchCase(match, replacement);
            });
        }

        // Third pass: update usage counts for all words in final text
        const finalWords = processedText.match(/\b[\w']+\b/g) || [];
        for (const word of finalWords) {
            if (word.length >= 4) { // Only track substantial words
                this.incrementUsage(word);
            }
        }

        console.log('✅ SynonymManager: Text processing complete');

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
        console.log('🔄 SynonymManager: Usage counts reset');
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
