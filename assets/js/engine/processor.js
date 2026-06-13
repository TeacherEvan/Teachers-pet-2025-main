/* eslint-env es6 */
/* global window */
import { TeachersPetUtils } from "./utils.js";

/**
 * Debug logging helper - only logs when window.__TP_DEBUG__ === true
 * @param {string} emoji - Emoji prefix for the log message
 * @param {string} message - Main log message
 * @param {...any} args - Additional arguments to log
 */
function debugLog(emoji, message, ...args) {
    if (typeof window !== 'undefined' && window.__TP_DEBUG__ === true) {
        console.log(emoji + ' ' + message, ...args);
    }
}

/**
 * Teachers Pet Data Processor
 * Handles data normalization, validation, and grouping.
 */
export const TeachersPetProcessor = {
  /**
   * Process and structure session data for comment generation
   * @param {Object} sessionData - The raw session data
   * @param {Object} engineData - The engine configuration (pools, maps, rules)
   */
  processSessionData: function (sessionData, engineData) {
    debugLog("🔍", "Processing session data:", sessionData);

    // Validate student name
    if (!sessionData.studentName || sessionData.studentName.trim() === "") {
      debugLog('❌', 'Missing student name in session data!');
      throw new Error("Student name is required for comment generation");
    }

    if (!engineData || !engineData.performanceMap || !engineData.grammarRules) {
      debugLog('❌', 'Engine data missing or incomplete');
      throw new Error("Engine data not loaded for comment generation");
    }

    // CRITICAL: Track rating value through entire pipeline
    // Use rating if valid (1-10), otherwise default to 5
    const rating =
      sessionData.overallRating >= 1 && sessionData.overallRating <= 10
        ? sessionData.overallRating
        : 5;

    const performance =
      engineData.performanceMap[rating] || engineData.performanceMap[5];

    const genderRaw =
      typeof sessionData.gender === "string" ? sessionData.gender : "";
    const genderKey = genderRaw.trim().toLowerCase();
    
    // Normalize gender aliases: 'male' -> 'he', 'female' -> 'she'
    const normalizedGenderKey = genderKey === 'male' ? 'he' : 
                                genderKey === 'female' ? 'she' : 
                                genderKey;
    
    const pronouns =
      engineData.grammarRules.pronouns[normalizedGenderKey] ||
      engineData.grammarRules.pronouns.he;

    // Get randomized descriptors/verbs/adverbs from pools
    const descriptor = TeachersPetUtils.getRandomFromPool(
      engineData.descriptorPools[rating],
    );
    const verb = TeachersPetUtils.getRandomFromPool(
      engineData.verbPools[rating],
    );
    const adverb = TeachersPetUtils.getRandomFromPool(
      engineData.adverbPools[rating],
    );

    // Group topics by their parent subjects
    const { grouped: topicsBySubject, orphanedTopics } =
      this.groupTopicsBySubject(
        sessionData.subjects || [],
        sessionData.topicRatings || {},
        engineData.subjectTopicMap,
      );

    const studentName = sessionData.studentName.trim();

    return {
      name: studentName,
      grade: sessionData.grade || "K1",
      month: sessionData.month || "August",
      level: performance.level,
      descriptor: descriptor,
      verb: verb,
      adverb: adverb,
      subjects: sessionData.subjects || [],
      topicsBySubject: topicsBySubject,
      orphanedTopics: orphanedTopics,
      allTopics: Object.keys(sessionData.topicRatings || {}),
      strengths: TeachersPetUtils.processTextArray(sessionData.strengths || ""),
      weaknesses: TeachersPetUtils.processTextArray(
        sessionData.weaknesses || "",
      ),
      overallRating: sessionData.overallRating,
      pronoun_subject: pronouns.subject,
      pronoun_subject_lower: pronouns.subject_lower,
      pronoun_object: pronouns.object,
      pronoun_possessive: pronouns.possessive,
      pronoun_possessive_cap: pronouns.possessive_cap,
      pronoun_verb: pronouns.verb,
      pronoun_isAre: pronouns.isAre,
    };
  },

  /**
   * Group topics under their parent subjects for better organization
   */
  groupTopicsBySubject: function (subjects, topicRatings, subjectTopicMap) {
    const grouped = {};
    const orphanedTopics = [];
    const topicList = Object.keys(topicRatings);

    // Initialize with empty arrays for selected subjects
    subjects.forEach((subject) => {
      grouped[subject] = [];
    });

    // Assign topics to subjects based on keyword matching
    topicList.forEach((topic) => {
      const topicLower = topic.toLowerCase();
      let assigned = false;

      for (const subject of subjects) {
        const keywords = subjectTopicMap[subject] || [];
        if (
          keywords.some((keyword) => topicLower.includes(keyword.toLowerCase()))
        ) {
          grouped[subject].push(topic);
          assigned = true;
          break;
        }
      }

      // If not assigned, try case-insensitive subject name matching
      if (!assigned) {
        for (const subject of subjects) {
          if (topicLower.includes(subject.toLowerCase())) {
            grouped[subject].push(topic);
            assigned = true;
            break;
          }
        }
      }

      // Still not assigned? Track as orphaned topic (do not inject fake subject)
      if (!assigned) {
        debugLog(
          `⚠️ Topic "${topic}" could not be matched to any subject - ORPHANED TOPIC`,
        );
        orphanedTopics.push(topic);
      }
    });

    return { grouped, orphanedTopics };
  },
};
