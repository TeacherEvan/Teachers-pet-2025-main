/**
 * Teachers Pet Data Module
 * Centralized storage for static data used by comment engines.
 * Extracted from enhanced-comment-engine.js to improve maintainability.
 */

window.TeachersPetData = window.TeachersPetData || {};

// Optimized descriptor pools - precise, varied, professional (2024 best practices)
// Using max 2-word combinations, avoiding redundancy, strong nouns over adjective stacking
window.TeachersPetData.descriptorPools = {
    10: ["exceptional mastery", "remarkable achievement", "superior competency", "outstanding performance", "distinguished excellence"],
    9: ["impressive progress", "notable accomplishment", "commendable proficiency", "stellar development", "significant growth"],
    8: ["strong capability", "solid competence", "thorough understanding", "proficient performance", "capable execution"],
    7: ["effective development", "sound understanding", "meaningful achievement", "competent work", "productive learning"],
    6: ["encouraging development", "satisfactory growth", "positive advancement", "reliable progress", "constructive learning"],
    5: ["appropriate development", "steady progress", "consistent learning", "measured growth", "suitable advancement"],
    4: ["emerging skills", "developing understanding", "growing capabilities", "budding competence", "promising foundation"],
    3: ["foundational learning", "basic progress", "initial development", "fundamental understanding", "early growth"],
    2: ["exploratory learning", "starting development", "beginning journey", "initial engagement", "early exploration"],
    1: ["emerging awareness", "starting exploration", "initial curiosity", "beginning discovery", "early interest"]
};

// Optimized verb pools - strong verbs, minimal adverb stacking, professional tone
window.TeachersPetData.verbPools = {
    10: ["excelled consistently", "achieved mastery", "performed exceptionally", "demonstrated excellence", "showcased proficiency"],
    9: ["demonstrated strong ability", "performed admirably", "showed skill", "exhibited proficiency", "achieved excellence"],
    8: ["performed well", "demonstrated capability", "showed competence", "achieved solidly", "exhibited understanding"],
    7: ["progressed effectively", "developed skills", "showed growth", "learned successfully", "advanced consistently"],
    6: ["progressed steadily", "developed positively", "grew effectively", "advanced reliably", "learned well"],
    5: ["developed consistently", "progressed suitably", "grew steadily", "advanced appropriately", "learned effectively"],
    4: ["showed promise", "demonstrated growth", "exhibited development", "displayed potential", "revealed progress"],
    3: ["made progress", "showed development", "demonstrated learning", "exhibited improvement", "achieved gains"],
    2: ["began developing", "started learning", "initiated progress", "commenced growth", "engaged with learning"],
    1: ["explored actively", "discovered eagerly", "began investigating", "started learning", "engaged curiously"]
};

// Optimized adverb pools - diverse, non-repetitive, professional (eliminated duplicate words)
window.TeachersPetData.adverbPools = {
    10: ["remarkably", "exceptionally", "impressively", "notably", "extraordinarily"],
    9: ["consistently", "admirably", "commendably", "thoroughly", "diligently"],
    8: ["skillfully", "capably", "proficiently", "competently", "effectively"],
    7: ["successfully", "positively", "productively", "soundly", "constructively"],
    6: ["confidently", "encouragingly", "reliably", "favorably", "assuredly"],
    5: ["appropriately", "steadily", "suitably", "dependably", "regularly"],
    4: ["promisingly", "progressively", "meaningfully", "purposefully", "actively"],
    3: ["gradually", "fundamentally", "systematically", "methodically", "carefully"],
    2: ["eagerly", "attentively", "openly", "willingly", "receptively"],
    1: ["curiously", "enthusiastically", "inquisitively", "exploratively", "engagingly"]
};

window.TeachersPetData.performanceMap = {
    10: { level: "exceptional" },
    9: { level: "excellent" },
    8: { level: "very strong" },
    7: { level: "strong" },
    6: { level: "good" },
    5: { level: "satisfactory" },
    4: { level: "developing" },
    3: { level: "basic" },
    2: { level: "beginning" },
    1: { level: "emerging" }
};

window.TeachersPetData.grammarRules = {
    pronouns: {
        he: { subject: "He", subject_lower: "he", object: "him", possessive: "his", possessive_cap: "His", verb: "has", isAre: "is" },
        she: { subject: "She", subject_lower: "she", object: "her", possessive: "her", possessive_cap: "Her", verb: "has", isAre: "is" },
        male: { subject: "He", subject_lower: "he", object: "him", possessive: "his", possessive_cap: "His", verb: "has", isAre: "is" },
        female: { subject: "She", subject_lower: "she", object: "her", possessive: "her", possessive_cap: "Her", verb: "has", isAre: "is" }
    },
    subjectCapitalization: {
        english: "English", mathematics: "Mathematics", science: "Science",
        "social studies": "Social Studies", "i.q": "I.Q",
        "physical education": "Physical Education", cooking: "Cooking",
        "conversation 1": "Conversation 1", "conversation 2": "Conversation 2",
        "conversation 3": "Conversation 3",
        arts: "Arts", "puppet show": "Puppet Show",
        "super safari": "Super Safari", "story time": "Story Time"
    }
};

// Subject-to-topic mapping for intelligent grouping
window.TeachersPetData.subjectTopicMap = {
    // Expanded English to include K1 phonics items (Nancy, Oscar, Penny, Queenie, Rev N/O/P)
    "English": [
        "draw lines", "trace", "match", "circle", "letter", "alphabet", "phonics",
        "nancy", "nurse", "nose", "oscar", "octopus", "on",
        "penny", "panda", "pen", "queenie", "quick", "quiet",
        "rev", "n/o/p", "n o p"
    ],
    "Mathematics": ["count", "number", "match", "trace", "dotted"],
    "I.Q": ["color", "same", "fatter", "taller", "hot", "cold", "shape"],
    "Social Studies": ["identify", "animal", "sounds", "habits", "hygiene", "gestures"],
    "Science": ["tissue", "lava", "magnet", "volcano", "experiment", "surface tension", "parachute", "float", "sink", "walking water"],
    "Cooking": ["look chop", "sugar", "bean", "salt", "coconut", "thai", "fried", "wonton", "wontons", "minced", "egg", "oil", "carrot", "seasoning"],
    "Conversation 1": ["pet", "feel", "lunch", "want to be", "like to go"],
    "Conversation 2": ["drink", "going", "school"],
    // Added Conversation 3 for K1 November
    "Conversation 3": [
        "food", "eat", "rice", "colors", "color", "yellow", "purple", "green", "orange",
        "daily routines", "wake", "take a shower", "sleep", "go to sleep", "morning"
    ],
    "Arts": ["finger painting", "ladybug", "play dough", "sponge", "origami", "ring craft", "pig", "banana", "painting", "stem", "paper bag", "fathers", "father's day", "card", "flower"],
    "Physical Education": ["football", "balance", "ball", "ring", "jump", "zigzag", "hurdle", "snakes", "ladders", "trampoline", "balancing", "game", "rubber", "shape", "dice", "step", "straw", "jumping"],
    "Puppet Show": ["noond", "vegetables", "panicked rabbit", "hare", "tortoise", "dog", "reflection"],
    "Super Safari": ["listen", "colour", "numbers", "circle", "pets", "food", "maze", "train", "mask"],
    "Story Time": ["harry frog", "bird", "lovely animals", "ox and the frog"]
};
