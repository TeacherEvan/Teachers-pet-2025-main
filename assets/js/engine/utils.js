/* eslint-env es6 */
/* global window */

/**
 * Teachers Pet Utility Functions
 * Pure functions for string manipulation, array handling, and formatting.
 */
export const TeachersPetUtils = {
    /**
     * Natural language joining with Oxford comma
     */
    naturalJoin: function (arr, conjunction = "and") {
        if (!arr || arr.length === 0) return "";
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
        return `${arr.slice(0, -1).join(", ")}, ${conjunction} ${arr.slice(-1)}`;
    },

    /**
     * Process text input into array
     */
    processTextArray: function (text, maxItems = 5) {
        if (!text || typeof text !== "string") return [];
        return text.split(",").map(item => item.trim()).filter(Boolean).slice(0, maxItems);
    },

    /**
     * Select random item from array
     */
    selectRandom: function (arr) {
        if (!arr || arr.length === 0) return "";
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Get random item from array pool to prevent repetition
     */
    getRandomFromPool: function (pool) {
        if (!pool || pool.length === 0) return "";
        return pool[Math.floor(Math.random() * pool.length)];
    },

    /**
     * Get word count
     */
    getWordCount: function (text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    },

    /**
     * Improve grammar and formatting
     */
    improveGrammar: function (text) {
        if (!text) return '';

        // Fix capitalization after punctuation
        text = text.replace(/([.!?]\s+)([a-z])/g, (match, punct, letter) => punct + letter.toUpperCase());

        // Capitalize first letter
        text = text.replace(/^([a-z])/, (match, letter) => letter.toUpperCase());

        // Fix spacing
        text = text.replace(/\s+/g, ' ');

        // Ensure proper ending
        if (!/[.!?]$/.test(text.trim())) {
            text = text.trim() + '.';
        }

        return text.trim();
    },

    /**
     * Ensure student name appears appropriately throughout comment
     */
    ensureNameUsage: function (text, studentName) {
        if (!studentName || !text) return text;

        const sentences = text.split(/(?<=[.!?])\s+/);
        let nameCount = (text.match(new RegExp(studentName, 'gi')) || []).length;
        const targetNameUsage = Math.max(3, Math.floor(sentences.length / 3));

        if (nameCount < targetNameUsage) {
            for (let i = 1; i < sentences.length && nameCount < targetNameUsage; i += 2) {
                if (!sentences[i].includes(studentName)) {
                    sentences[i] = sentences[i].replace(/^(He|She|They)\s/, `${studentName} `);
                    nameCount++;
                }
            }
        }

        return sentences.join(' ');
    }
};
