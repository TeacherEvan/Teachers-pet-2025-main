/**
 * Teachers Pet Data Module
 * Centralized storage for static data used by comment engines.
 * Extracted from enhanced-comment-engine.js to improve maintainability.
 */

window.TeachersPetData = window.TeachersPetData || {};

// Randomized descriptor pools to prevent repetition
window.TeachersPetData.descriptorPools = {
    10: ["exceptional performance", "remarkable achievement", "superior mastery", "phenomenal competency", "distinguished excellence"],
    9: ["impressive progress", "notable accomplishment", "commendable proficiency", "stellar development", "admirable growth"],
    8: ["strong capability", "solid competence", "robust understanding", "capable performance", "proficient skills"],
    7: ["noteworthy progress", "effective development", "sound understanding", "positive achievement", "competent work"],
    6: ["good progress", "encouraging development", "satisfactory growth", "pleasing advancement", "favorable learning"],
    5: ["appropriate development", "steady progress", "consistent learning", "reliable growth", "suitable advancement"],
    4: ["emerging skills", "developing understanding", "growing capabilities", "budding competence", "promising foundation"],
    3: ["foundational learning", "basic progress", "initial development", "beginning understanding", "early growth"],
    2: ["exploratory learning", "starting development", "beginning journey", "initial steps", "early exploration"],
    1: ["discovering learning", "emerging awareness", "starting exploration", "initial curiosity", "beginning discovery"]
};

window.TeachersPetData.verbPools = {
    10: ["excelled magnificently", "achieved brilliantly", "performed exceptionally", "demonstrated mastery", "showcased excellence"],
    9: ["demonstrated excellence", "performed admirably", "showed impressive skill", "exhibited strong ability", "displayed proficiency"],
    8: ["performed well", "achieved solidly", "demonstrated capability", "showed competence", "exhibited understanding"],
    7: ["progressed effectively", "developed well", "showed growth", "achieved consistently", "learned successfully"],
    6: ["progressed steadily", "developed positively", "grew encouragingly", "advanced favorably", "learned reliably"],
    5: ["developed consistently", "progressed appropriately", "grew steadily", "advanced suitably", "learned reliably"],
    4: ["showed promise", "demonstrated growth", "exhibited development", "displayed progress", "revealed potential"],
    3: ["made progress", "showed development", "demonstrated learning", "exhibited growth", "revealed advancement"],
    2: ["began developing", "started learning", "initiated growth", "commenced progress", "embarked on learning"],
    1: ["explored enthusiastically", "discovered curiously", "began investigating", "started exploring", "commenced discovering"]
};

window.TeachersPetData.adverbPools = {
    10: ["remarkably", "exceptionally", "brilliantly", "magnificently", "phenomenally"],
    9: ["consistently", "impressively", "notably", "admirably", "commendably"],
    8: ["skillfully", "capably", "proficiently", "competently", "effectively"],
    7: ["effectively", "successfully", "positively", "soundly", "ably"],
    6: ["confidently", "encouragingly", "steadily", "reliably", "favorably"],
    5: ["reliably", "appropriately", "consistently", "steadily", "suitably"],
    4: ["steadily", "promisingly", "progressively", "developmentally", "encouragingly"],
    3: ["gradually", "progressively", "foundationally", "basically", "initially"],
    2: ["eagerly", "exploratively", "initially", "tentatively", "beginningly"],
    1: ["curiously", "enthusiastically", "exploratively", "investigatively", "discoveringly"]
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
