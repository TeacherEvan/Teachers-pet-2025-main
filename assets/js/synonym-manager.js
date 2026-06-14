/* eslint-env es6 */
/* eslint-disable no-unused-vars */
/* global window, sessionStorage */
/**
 * Synonym Manager - Intelligent Word Variation System
 * Tracks word usage across comment generation session and swaps overused terms
 * with contextually appropriate synonyms to maintain professional variety
 * @class SynonymManager
 */
import { createDebugLog } from './utils/debug.js';

const debugLogSynonym = createDebugLog('📚 ');

export class SynonymManager {
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
            
            // Build flat synonym map for O(1) lookup
            this.synonymFlatMap = new Map();
            for (const [category, words] of Object.entries(this.synonymData)) {
                for (const [word, synonyms] of Object.entries(words)) {
                    this.synonymFlatMap.set(word.toLowerCase(), synonyms);
                }
            }
            
            // Initialize memoization caches
            this.escapeRegexCache = new Map();
            this.matchCaseCache = new Map();

            debugLogSynonym('✅', 'SynonymManager: Synonym data loaded successfully', {
                categories: Object.keys(this.synonymData),
                totalWords: this.getTotalWordCount(),
                flatMapSize: this.synonymFlatMap.size
            });
            return this.synonymData;
        } catch (error) {
            debugLogSynonym('❌', 'SynonymManager: Failed to load synonym data:', error);
            this.synonymData = this.getEmptySynonymData();
            this.synonymFlatMap = new Map();
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
            debugLogSynonym('⚠️', 'SynonymManager: Could not load usage counts:', error);
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
            debugLogSynonym('⚠️', 'SynonymManager: Could not save usage counts:', error);
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
     * Find synonyms for a word across all categories - O(1) via flat map
     */
    findSynonyms(word) {
        if (!this.synonymFlatMap) {
            return [];
        }

        const normalized = word.toLowerCase().trim();
        return this.synonymFlatMap.get(normalized) || [];
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
     * Process text and replace overused words with synonyms - Optimized O(n) version
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

        // Single-pass tokenization with position tracking
        const tokens = [];
        const tokenRegex = /\b[\w']+\b/g;
        let match;
        while ((match = tokenRegex.exec(text)) !== null) {
            const normalized = match[0].toLowerCase().trim();
            if (normalized.length >= 4) { // Only process substantial words
                tokens.push({ 
                    word: match[0], 
                    normalized, 
                    start: match.index, 
                    end: match.index + match[0].length 
                });
            }
        }

        debugLogSynonym('📝', 'Tokens found in current text:', tokens.map(t => t.normalized));

        // Track replacements to make (normalized -> {replacement, positions[]})
        const replacements = new Map();

        // Check each token against usage threshold
        for (const token of tokens) {
            const { normalized } = token;
            const currentUsage = this.getUsageCount(normalized);

            debugLogSynonym('🔍', `Checking "${normalized}": current usage = ${currentUsage}, threshold = ${this.maxUsageThreshold}`);

            // If word has been used >= threshold times, try to replace it
            if (currentUsage >= this.maxUsageThreshold && !replacements.has(normalized)) {
                const synonyms = this.findSynonyms(normalized);

                if (synonyms && synonyms.length > 0) {
                    debugLogSynonym('📖', `Found ${synonyms.length} synonyms for "${normalized}":`, synonyms);

                    const bestSynonym = this.selectBestSynonym(normalized, synonyms);

                    if (bestSynonym && bestSynonym.toLowerCase() !== normalized) {
                        replacements.set(normalized, { 
                            replacement: bestSynonym, 
                            positions: [token.start] 
                        });
                        debugLogSynonym('✅', `Will replace "${normalized}" with "${bestSynonym}"`);
                    }
                } else {
                    debugLogSynonym('⚠️', `No synonyms found for "${normalized}"`);
                }
            } else if (replacements.has(normalized)) {
                // Already planning to replace this word, add position
                replacements.get(normalized).positions.push(token.start);
            }
        }

        debugLogSynonym('🎯', 'Total replacements planned:', replacements.size);

        // Apply all replacements in single pass (right-to-left to preserve indices)
        let processedText = text;
        
        // Sort replacements by rightmost position first
        const sortedReplacements = Array.from(replacements.entries())
            .map(([normalized, data]) => ({
                normalized,
                replacement: data.replacement,
                rightmostPos: Math.max(...data.positions)
            }))
            .sort((a, b) => b.rightmostPos - a.rightmostPos);

        for (const { normalized, replacement } of sortedReplacements) {
            const regex = new RegExp(`\\b${this.escapeRegex(normalized)}\\b`, 'gi');
            processedText = processedText.replace(regex, (originalMatch) => {
                const replaced = this.matchCase(originalMatch, replacement);
                debugLogSynonym('🔄', `Replacing "${originalMatch}" → "${replaced}"`);
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
     * Escape special regex characters in a string - memoized
     */
    escapeRegex(str) {
        if (this.escapeRegexCache.has(str)) {
            return this.escapeRegexCache.get(str);
        }
        const result = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this.escapeRegexCache.set(str, result);
        return result;
    }

    /**
     * Match the case pattern of the original word - memoized
     */
    matchCase(original, replacement) {
        const key = original + '|' + replacement;
        if (this.matchCaseCache.has(key)) {
            return this.matchCaseCache.get(key);
        }

        // All uppercase
        if (original === original.toUpperCase()) {
            const result = replacement.toUpperCase();
            this.matchCaseCache.set(key, result);
            return result;
        }

        // First letter uppercase (Title Case)
        if (original[0] === original[0].toUpperCase() && original.slice(1) === original.slice(1).toLowerCase()) {
            const result = replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
            this.matchCaseCache.set(key, result);
            return result;
        }

        // All lowercase or mixed case - use replacement as-is (lowercase)
        const result = replacement.toLowerCase();
        this.matchCaseCache.set(key, result);
        return result;
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
// if (typeof window !== 'undefined') {
//     window.SynonymManager = SynonymManager;
//     window.synonymManager = new SynonymManager();
//     console.log('🌐 SynonymManager: Global instance created (window.synonymManager)');
// }

export const synonymManager = new SynonymManager();