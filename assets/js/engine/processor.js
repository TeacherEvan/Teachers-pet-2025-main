/* eslint-env es6 */
import { TeachersPetUtils } from "./utils.js";
import { TeachersPetData } from "../data/engine-data.js";
import { debugLog } from '../utils/debug.js';

/**
 * Pre-built inverted keyword index for standard engine data
 * Built once at module load
 */
const STANDARD_KEYWORD_INDEX = (() => {
  const index = new Map();
  for (const [subject, keywords] of Object.entries(TeachersPetData.subjectTopicMap)) {
    for (const keyword of keywords) {
      const normalized = keyword.toLowerCase().trim();
      if (!normalized) continue;
      if (!index.has(normalized)) {
        index.set(normalized, new Set());
      }
      index.get(normalized).add(subject);
    }
  }
  const result = new Map();
  for (const [keyword, subjects] of index) {
    result.set(keyword, Array.from(subjects));
  }
  return result;
})();

/**
 * Teacher's Pet Data Processor
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
   * Optimized with cached inverted keyword index for O(topics × keywords_in_topic) lookup
   */
  groupTopicsBySubject: function (subjects, topicRatings, subjectTopicMap) {
    const grouped = {};
    const orphanedTopics = [];
    const topicList = Object.keys(topicRatings);
    const subjectSet = new Set(subjects); // O(1) lookup
    const subjectCount = subjects.length;
    const keywordCount = Object.values(subjectTopicMap).reduce((sum, k) => sum + k.length, 0);
    const cacheKey = `map-${subjectCount}-${keywordCount}`;

    // Use pre-built standard index if standard engine data is passed
    // Otherwise build and cache custom index
    let keywordIndexArr;
    if (subjectTopicMap === TeachersPetData.subjectTopicMap) {
      keywordIndexArr = STANDARD_KEYWORD_INDEX;
    } else {
      // Build and cache custom index
      if (!this._keywordIndexCache) {
        this._keywordIndexCache = new Map();
      }
      keywordIndexArr = this._keywordIndexCache.get(cacheKey);
      if (!keywordIndexArr) {
        const keywordIndex = new Map();
        for (const [subject, keywords] of Object.entries(subjectTopicMap)) {
          for (const keyword of keywords) {
            const normalized = keyword.toLowerCase().trim();
            if (!normalized) continue;
            if (!keywordIndex.has(normalized)) {
              keywordIndex.set(normalized, new Set());
            }
            keywordIndex.get(normalized).add(subject);
          }
        }
        keywordIndexArr = new Map();
        for (const [keyword, subjects] of keywordIndex) {
          keywordIndexArr.set(keyword, Array.from(subjects));
        }
        this._keywordIndexCache.set(cacheKey, keywordIndexArr);
      }
    }

    // Initialize groups
    subjects.forEach((subject) => { grouped[subject] = []; });

    topicList.forEach((topic) => {
      const topicLower = topic.toLowerCase();
      let assigned = false;

      // Extract keywords from topic (split by space, filter length >= 3)
      const topicKeywords = topicLower.split(/\s+/).filter(k => k.length >= 3);

      // Check each keyword against index
      for (const keyword of topicKeywords) {
        const matchingSubjects = keywordIndexArr.get(keyword);
        if (matchingSubjects) {
          for (const subject of matchingSubjects) {
            if (subjectSet.has(subject)) {
              grouped[subject].push(topic);
              assigned = true;
              break;
            }
          }
          if (assigned) break;
        }
      }

      // Fallback: subject name matching (existing logic)
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
