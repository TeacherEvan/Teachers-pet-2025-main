// TypeScript Type Definitions for Teachers Pet Comment Engine
// Provides type safety for core data structures and public APIs

/**
 * Student gender options
 */
export type Gender = 'he' | 'she' | 'they' | 'male' | 'female';

/**
 * Grade levels supported
 */
export type Grade = 'K1' | 'K2' | 'PVT';

/**
 * Month names for term reporting
 */
export type Month = 
  | 'August' | 'September' | 'October' | 'November' | 'December' 
  | 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July';

/**
 * Performance rating (1-10)
 */
export type Rating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Performance level descriptors
 */
export interface PerformanceLevel {
  level: string;
  achievement?: string;
  attitude?: string;
  descriptor?: string;
}

/**
 * Pronoun set for a given gender
 */
export interface PronounSet {
  subject: string;
  subject_lower: string;
  object: string;
  possessive: string;
  possessive_cap: string;
  verb: string;
  isAre: string;
  reflexive?: string;
}

/**
 * Grammar rules including pronouns and subject capitalization
 */
export interface GrammarRules {
  pronouns: Record<string, PronounSet>;
  subjectCapitalization: Record<string, string>;
}

/**
 * Descriptor/verb/adverb pools by rating
 */
export interface WordPools {
  [rating: number]: string[];
}

/**
 * Subject to topic keyword mapping
 */
export interface SubjectTopicMap {
  [subject: string]: string[];
}

/**
 * Core engine data structure (TeachersPetData)
 */
export interface TeachersPetData {
  descriptorPools: WordPools;
  verbPools: WordPools;
  adverbPools: WordPools;
  performanceMap: Record<number, PerformanceLevel>;
  grammarRules: GrammarRules;
  subjectTopicMap: SubjectTopicMap;
}

/**
 * Raw session data from UI/localStorage
 */
export interface SessionData {
  studentName: string;
  gender: Gender;
  overallRating: Rating | number;
  grade?: Grade;
  month?: Month;
  subjects: string[];
  topicRatings: Record<string, number>;
  strengths: string | string[];
  weaknesses: string | string[];
}

/**
 * Processed data ready for template generation
 */
export interface ProcessedSessionData {
  name: string;
  grade: Grade;
  month: Month;
  level: string;
  descriptor: string;
  verb: string;
  adverb: string;
  subjects: string[];
  topicsBySubject: Record<string, string[]>;
  orphanedTopics: string[];
  allTopics: string[];
  strengths: string[];
  weaknesses: string[];
  overallRating: number;
  pronoun_subject: string;
  pronoun_subject_lower: string;
  pronoun_object: string;
  pronoun_possessive: string;
  pronoun_possessive_cap: string;
  pronoun_verb: string;
  pronoun_isAre: string;
}

/**
 * Generated comment output
 */
export interface GeneratedComment {
  male: string;
  female: string;
  wordCount: {
    male: number;
    female: number;
  };
}

/**
 * Synonym data structure
 */
export interface SynonymData {
  adjectives: Record<string, string[]>;
  verbs: Record<string, string[]>;
  adverbs: Record<string, string[]>;
  educational_terms: Record<string, string[]>;
  phrases: Record<string, string[]>;
}

/**
 * Synonym usage statistics
 */
export interface SynonymStatistics {
  totalWordsTracked: number;
  usageCounts: Record<string, number>;
  threshold: number;
  initialized: boolean;
  synonymsAvailable: number;
}

/**
 * EnhancedCommentEngine public API
 */
export interface EnhancedCommentEngine {
  generateComments(sessionData: SessionData): Promise<GeneratedComment>;
}

/**
 * TeachersPetProcessor public API
 */
export interface TeachersPetProcessor {
  processSessionData(sessionData: SessionData, engineData: TeachersPetData): ProcessedSessionData;
  groupTopicsBySubject(
    subjects: string[],
    topicRatings: Record<string, number>,
    subjectTopicMap: SubjectTopicMap
  ): { grouped: Record<string, string[]>; orphanedTopics: string[] };
}

/**
 * TeachersPetTemplates public API
 */
export interface TeachersPetTemplates {
  generateStyleComment(style: 'male' | 'female', data: ProcessedSessionData): Promise<string>;
  generateFallbackComments(studentName: string): Promise<GeneratedComment>;
}

/**
 * TeachersPetUtils public API
 */
export interface TeachersPetUtils {
  naturalJoin(arr: string[], conjunction?: string): string;
  processTextArray(text: string | string[], maxItems?: number): string[];
  selectRandom<T>(arr: T[]): T;
  getRandomFromPool(pool: string[]): string;
  getWordCount(text: string): number;
  improveGrammar(text: string): string;
  ensureNameUsage(text: string, studentName: string): string;
}

/**
 * SynonymManager public API
 */
export interface SynonymManager {
  loadSynonymData(): Promise<SynonymData>;
  replaceOverused(text: string, threshold?: number): Promise<string>;
  resetUsageCounts(): void;
  getStatistics(): SynonymStatistics;
  exportState(): SynonymStatistics;
}

// Global declarations for browser environment
declare global {
  interface Window {
    __TP_DEBUG__: boolean;
    TeachersPetData: TeachersPetData;
    EnhancedCommentEngine: new () => EnhancedCommentEngine;
    PremiumCommentEngine: new () => any; // deprecated
    OptimizedCommentGenerator: new () => any;
    commentGenerator: any;
    synonymManager: SynonymManager;
    generateCommentsFromStorage: () => Promise<GeneratedComment>;
    testCommentGeneration: () => Promise<GeneratedComment>;
    startOverWithAnimation: () => void;
  }
}

export {};