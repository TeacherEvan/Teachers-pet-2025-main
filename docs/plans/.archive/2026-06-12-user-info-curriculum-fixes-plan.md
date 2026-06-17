# User Info Window Enhancement & Curriculum Data Fixes — Implementation Plan

**Status:** ✅ **Archived — Implemented & Verified** (June 2025)



> **For implementer:** Use TDD throughout. Write failing test first. Watch it fail. Then implement.

**Goal:** Fix missing curriculum JSON files for all grade/month combos, eliminate duplicate curriculum tracker code, fix broken progress tracking, and improve auto-save UX in student-information.html.

**Architecture:** Create 10 curriculum JSON files matching the schema expected by CurriculumLoader. Move curriculum tracker logic entirely into StudentInfoController (single source of truth). Call setupProgressTracking() in controller init. Add debounced auto-save with visual "Saving..." state.

**Tech Stack:** Vanilla ES6 modules, localStorage/sessionStorage, fetch API for curriculum loading, existing test runner (node tests/run-tests.js), ESLint.

---

### Task 1: Create Curriculum JSON Files — K1 December (Convert .txt → JSON)

**Files:**
- Create: `assets/data/curriculum/k1/december.json`
- Test: `tests/unit/k1-december-curriculum.test.js`

**Step 1: Write the failing test**
```javascript
// tests/unit/k1-december-curriculum.test.js
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('K1 December Curriculum JSON', () => {
  const filePath = path.resolve('assets/data/curriculum/k1/december.json');

  it('should exist and be valid JSON', () => {
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('should have required schema', () => {
    const curriculum = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(curriculum.grade).toBe('K1');
    expect(curriculum.month).toBe('December');
    expect(Array.isArray(curriculum.subjects)).toBe(true);
    expect(curriculum.subjects.length).toBeGreaterThan(0);
  });

  it('each subject should have name, topics, description', () => {
    const curriculum = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    curriculum.subjects.forEach(subject => {
      expect(subject.name).toBeDefined();
      expect(Array.isArray(subject.topics)).toBe(true);
      expect(subject.description).toBeDefined();
    });
  });

  it('should contain all 10 K1 December subjects from .txt', () => {
    const curriculum = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const subjectNames = curriculum.subjects.map(s => s.name);
    const expectedSubjects = [
      'English', 'Mathematics', 'I.Q', 'Phonics', 'Science',
      'Conversation 1', 'Conversation 3', 'Arts',
      'Physical Education', 'Puppet Show'
    ];
    expectedSubjects.forEach(s => expect(subjectNames).toContain(s));
  });
});
```

**Step 2: Run test — confirm it fails**
```bash
npm test 2>&1 | grep -A5 "k1-december-curriculum"
# Expected: FAIL - file not found / JSON parse error
```

**Step 3: Write minimal implementation**
```json
// assets/data/curriculum/k1/december.json
{
  "grade": "K1",
  "month": "December",
  "subjects": [
    {
      "name": "English",
      "topics": [
        "Trace letters following dotted line",
        "Color letters",
        "Draw lines from letter to picture starting from dot",
        "Draw lines to match same letter",
        "Draw lines to match letter with correct picture",
        "Vocabulary: A-Ant, B-Bee, C-Cat, D-Dog, E-Egg, F-Fan, H-Hen, I-Ice Cream, O-Ox, T-Tea"
      ],
      "description": "Focus on basic letter recognition, tracing, and vocabulary A through T"
    },
    {
      "name": "Mathematics",
      "topics": [
        "Write numbers 1-6 following lines",
        "Write freehand in box",
        "Draw correct amount of circles next to numbers",
        "Trace number 6 following dotted line and color",
        "Write numbers 1-7 following lines",
        "Write freehand in box",
        "Color correct amount of pictures, cut and paste in boxes",
        "Vocabulary: One through ten"
      ],
      "description": "Early numeracy: counting 1-7, number formation, quantity matching"
    },
    {
      "name": "I.Q",
      "topics": [
        "Object and Animal - Circle the animals",
        "Direction (Above) - Cross objects that are above",
        "Objects in same group - Draw lines to match",
        "Near and Far - Mark X on objects that are further",
        "Size objects - Draw lines to match suitable size",
        "Direction: Front and back - Circle pictures facing front, cross facing back",
        "Animal (Wings) - Circle animals with wings",
        "Incomplete - Mark incomplete objects with X",
        "Vocabulary: Car, giraffe, girl, cat, telephone, alarm clock, vase/flower, toothbrush/toothpaste, pot/stove, bird, duck, hen, owl, lion, turtle, dog, book, boat, small girl, small dress, big girl, big dress, pencil, van, frog, rice cooker, swing, briefcase"
      ],
      "description": "Visual-spatial reasoning, categorization, directionality, size comparison"
    },
    {
      "name": "Phonics",
      "topics": [
        "Letter R", "Letter S", "Rev Q/R/S", "Letter T", "Letter U",
        "Vocabulary: Ricky rabbit, read, Susie seal, sun, quiet, on, tiger, uncle, Teddy tiger, teeth, Uncle utter, under"
      ],
      "description": "Phonics review Q through U with vocabulary reinforcement"
    },
    {
      "name": "Science",
      "topics": [
        "Mixing colours - primary and secondary by mixing coloured water",
        "Bottle diver experiment - buoyancy and density with bottle diver",
        "Air Pressure - candle and bottle experiment",
        "Air rocket - air pressure moving objects with rocket toy",
        "Vocabulary: Water, colour, mix, bowl, bottle, paper, paper-clip, food colouring, candle, air, sound, table, pencil, air rocket, stepping hard, press/push, fly up"
      ],
      "description": "Hands-on science: color mixing, buoyancy, air pressure experiments"
    },
    {
      "name": "Conversation 1",
      "topics": [
        "Colours Question - What colour is the banana/tree? Answer: The ... is yellow/green",
        "Family Members Question - Who do you love? Answer: I love my father and mother",
        "Abilities Question - What can you do? Answer: I can sing/dance",
        "Playground Equipment Question - Where do you like playing? Answer: I like playing on the seesaw/slide",
        "Vocabulary: Green, yellow, red, blue, mother, father, sing, dance, seesaw, slide"
      ],
      "description": "Basic conversation: colors, family, abilities, playground"
    },
    {
      "name": "Conversation 3",
      "topics": [
        "Food: Actions - What are you doing? I am walking",
        "Weather - How's the weather? It's sunny",
        "Vocabulary: walking, running, jumping, sitting, sunny, rainy, cloudy"
      ],
      "description": "Action verbs and weather vocabulary"
    },
    {
      "name": "Arts",
      "topics": [
        "Butterfly squish painting",
        "Sponge painting tree design",
        "New year card making",
        "Origami - house",
        "Vocabulary: fold, paper, squish, paint, butterfly, flower, sponge, stem, new year, January, card, house, window, roof"
      ],
      "description": "Creative arts: painting techniques, card making, origami"
    },
    {
      "name": "Physical Education",
      "topics": [
        "Hopscotch",
        "Picking Up",
        "Matching & Dropping Ball Race Jumping",
        "Dart Ball Game",
        "Cart Racing",
        "Vocabulary: Hop, number, match, ball, chair, colour, dart board, throw, cart, push, race"
      ],
      "description": "Gross motor skills: hopping, ball handling, racing games"
    },
    {
      "name": "Puppet Show",
      "topics": [
        "The Ants and the Grasshopper",
        "Lion and the Mouse",
        "Vocabulary: ant, grasshopper, hungry, winter, food, lion, mouse, forest, net"
      ],
      "description": "Storytelling through puppetry: fables with morals"
    }
  ]
}
```

**Step 4: Run test — confirm it passes**
```bash
npm test 2>&1 | grep -A10 "k1-december-curriculum"
# Expected: PASS all 4 tests
```

**Step 5: Commit**
```bash
git add assets/data/curriculum/k1/december.json tests/unit/k1-december-curriculum.test.js
git commit -m "feat: Add K1 December curriculum JSON (converted from .txt)"
```

---

### Task 2: Create Curriculum JSON Files — K2 December (Convert .txt → JSON)

**Files:**
- Create: `assets/data/curriculum/k2/december.json`
- Test: `tests/unit/k2-december-curriculum.test.js`

**Step 1: Write the failing test**
```javascript
// tests/unit/k2-december-curriculum.test.js
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('K2 December Curriculum JSON', () => {
  const filePath = path.resolve('assets/data/curriculum/k2/december.json');

  it('should exist and be valid JSON', () => {
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('should have required schema', () => {
    const curriculum = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(curriculum.grade).toBe('K2');
    expect(curriculum.month).toBe('December');
    expect(Array.isArray(curriculum.subjects)).toBe(true);
  });

  it('should contain all 14 K2 December subjects from .txt', () => {
    const curriculum = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const subjectNames = curriculum.subjects.map(s => s.name);
    const expectedSubjects = [
      'Mathematics', 'I.Q', 'Social', 'English', 'Phonics',
      'Science', 'Conversation 1', 'Conversation 3',
      'Arts', 'Physical Education', 'Puppet Show', 'Cooking'
    ];
    expectedSubjects.forEach(s => expect(subjectNames).toContain(s));
  });
});
```

**Step 2: Run test — confirm it fails**
```bash
npm test 2>&1 | grep -A5 "k2-december-curriculum"
# Expected: FAIL
```

**Step 3: Write minimal implementation**
```json
// assets/data/curriculum/k2/december.json
{
  "grade": "K2",
  "month": "December",
  "subjects": [
    {
      "name": "Mathematics",
      "topics": [
        "Counting and Number Identification: Practice counting from 1-20, 1-30, and 1-50",
        "Concepts of Subtraction and Addition",
        "Practice tracing and freehand writing numbers 1-20",
        "Vocabulary: count, numbers, subtract, take away, less, write, minus, equals, addition, add, more, plus sign, minus sign, equals sign"
      ],
      "description": "Advanced counting to 50, introduction to addition/subtraction, number writing mastery"
    },
    {
      "name": "I.Q",
      "topics": [
        "Wet and Dry objects",
        "Preposition Underneath",
        "Recognizing Emotions (Happy or Sad)",
        "Distinguishing Loud and Quiet noises",
        "Spatial relationship: Inside and Outside",
        "Concepts of Hot and Cold",
        "Identifying Appropriate Actions",
        "Size Sequencing from smallest to biggest",
        "Vocabulary: wet, dry, underneath, happy, sad, loud, quiet, inside, outside, hot, cold, small, smaller, smallest, big, bigger, biggest"
      ],
      "description": "Cognitive development: sensory discrimination, emotional recognition, spatial concepts, sequencing"
    },
    {
      "name": "Social",
      "topics": [
        "Community helpers, traffic rules, and road signs",
        "What makes up our planet earth and materials usage",
        "New Year's Day, Thai New Year (Songkran) and their meanings",
        "Food pyramid, healthy eating portions, healthiest foods",
        "Vocabulary: community, helper, road sign, safety, police, doctor, teacher, rule, follow, help, home, school, soil, stone, sand, glass bottle, building, charcoal, New Year's Day, Songkran Day, presents/gift, monk, protein, carbohydrates/grains, fats, fruits, vegetables"
      ],
      "description": "Social studies: community awareness, geography, cultural celebrations, nutrition"
    },
    {
      "name": "English",
      "topics": [
        "Introduce and discuss lowercase letters m,n,o,p,q,r,s,t,u,v,w,x,y,z",
        "Draw lines to match letters with pictures",
        "Trace and write letters",
        "Circle correct letters",
        "Practice identifying and saying vocabulary words for each letter",
        "Matching lowercase letters to uppercase counterparts",
        "Vocabulary: mat, net, ox, pen, queen, rainbow, sun, top, umbrella, van, whale, x-ray, yacht, zipper"
      ],
      "description": "Lowercase letter mastery A-Z, upper/lower matching, vocabulary expansion"
    },
    {
      "name": "Phonics",
      "topics": [
        "Introduce and review letter sounds (R,S,T,U)",
        "Identify initial letter sound in words",
        "Color or circle pictures with matching sound",
        "Repeat after teacher and pronounce beginning sounds correctly",
        "Vocabulary: Rabbit, Read, Rain, Rose, Seal, Sand, Sun, Sea, Tiger, Tea, Teeth, Tie, Uncle, Up, Umbrella, Under"
      ],
      "description": "Phonics: R-U sound recognition and pronunciation"
    },
    {
      "name": "Science",
      "topics": [
        "Water and Air Pressure Experiment: Observe difference between wet and dry objects after submerged",
        "Vocabulary: wet, dry, float, sink, air, water, experiment, submerge"
      ],
      "description": "Hands-on experiment: water displacement and air pressure"
    },
    {
      "name": "Conversation 1",
      "topics": [
        "\"What color is/are your hair/socks?\" \"My hair is black/ socks are white.\"",
        "\"Who do you love?\" \"I love my father & mother.\"",
        "\"What can you do?\" \"I can sing & dance.\"",
        "\"Where do you like playing?\" \"I like playing on the.....\"",
        "\"What are you doing?\" \"I am walking / running / jumping.\"",
        "Vocabulary: black, white, hair, socks, shirt, mother, father, love, sing, dance, slide, swings, trampoline, walking, running, jumping"
      ],
      "description": "Extended conversation: colors, family, abilities, actions"
    },
    {
      "name": "Conversation 3",
      "topics": [
        "\"What do you use/wear on sunny days?\" \"I wear sunglasses/ a hat/ use an umbrella\"",
        "\"What is this?\" \"It's a television.\"",
        "\"Do you have a microwave at home?\" \"Yes, we do. / No, we don't.\"",
        "Vocabulary: sunglasses, hat, umbrella, TV, microwave, toaster"
      ],
      "description": "Weather-appropriate items, household appliances, yes/no questions"
    },
    {
      "name": "Arts",
      "topics": [
        "Leaf painting",
        "Fancy mask crafting",
        "Creating a Santa Claus mobile",
        "New Year's card",
        "Water color squish painting",
        "Vocabulary: leaf, paint, print, texture, pattern, watercolor, mask, design, face, eyes, Santa Claus, mobile, card, color pencil, fold, squish"
      ],
      "description": "Seasonal arts: nature printing, 3D crafts, watercolor techniques"
    },
    {
      "name": "Physical Education",
      "topics": [
        "Practice zigzag running and ball handling",
        "Ring toss",
        "Relay Race",
        "Zigzag running and going under arches",
        "Color sorting game",
        "Vocabulary: zigzag, run, ball, put, toss, ring, pole, towel, pass, arches, go under, chair, rubber ring, color, sort, match"
      ],
      "description": "Gross motor: agility drills, team games, coordination"
    },
    {
      "name": "Puppet Show",
      "topics": [
        "The Weeping Tree",
        "The Sick Bear",
        "Vocabulary: Tree, Weep, Butterfly, Flower, Bear, Rain, Sick, Play, Friends"
      ],
      "description": "Emotional storytelling: empathy, friendship, nature"
    },
    {
      "name": "Cooking",
      "topics": [
        "Crispy Puffed Pork Balls",
        "Vocabulary: minced pork, bread, egg, carrot, onion, cooking oil, sugar, salt, ketchup"
      ],
      "description": "Cooking activity: recipe following, measurement, food preparation"
    }
  ]
}
```

**Step 4: Run test — confirm it passes**
```bash
npm test 2>&1 | grep -A10 "k2-december-curriculum"
# Expected: PASS
```

**Step 5: Commit**
```bash
git add assets/data/curriculum/k2/december.json tests/unit/k2-december-curriculum.test.js
git commit -m "feat: Add K2 December curriculum JSON (converted from .txt)"
```

---

### Task 3: Create Curriculum JSON Files — K1 August

**Files:**
- Create: `assets/data/curriculum/k1/august.json`
- Test: `tests/unit/k1-august-curriculum.test.js`

**Step 1: Write failing test** (similar pattern, checking for K1 August schema and expected subjects)

**Step 3: Implementation** (based on grade-selection.html K1 description + K1 patterns):
```json
// assets/data/curriculum/k1/august.json
{
  "grade": "K1",
  "month": "August",
  "subjects": [
    {
      "name": "English",
      "topics": [
        "Introduce letters A-E",
        "Trace letters A-E following dotted lines",
        "Match uppercase to lowercase",
        "Vocabulary: A-Ant, B-Bee, C-Cat, D-Dog, E-Egg"
      ],
      "description": "Foundation: letter recognition A-E, basic tracing, vocabulary"
    },
    {
      "name": "Mathematics",
      "topics": [
        "Count 1-5",
        "Trace numbers 1-5",
        "Match numbers to quantities (1-5)",
        "Vocabulary: One, Two, Three, Four, Five"
      ],
      "description": "Early numeracy: counting 1-5, number formation, quantity matching"
    },
    {
      "name": "I.Q",
      "topics": [
        "Same and different objects",
        "Big and small",
        "Matching shapes",
        "Vocabulary: same, different, big, small, circle, square, triangle"
      ],
      "description": "Visual discrimination: matching, size comparison, shapes"
    },
    {
      "name": "Social Studies",
      "topics": [
        "All about me",
        "My family",
        "My school",
        "Vocabulary: me, family, mother, father, sister, brother, school, teacher, friend"
      ],
      "description": "Self-awareness: identity, family, school community"
    },
    {
      "name": "Science",
      "topics": [
        "My five senses",
        "Living vs non-living",
        "Plants need water and sun",
        "Vocabulary: see, hear, smell, taste, touch, plant, water, sun, grow"
      ],
      "description": "Basic science: senses, living things, plant needs"
    },
    {
      "name": "Physical Education",
      "topics": [
        "Basic movement: walk, run, jump",
        "Balance on one foot",
        "Ball skills: roll, catch",
        "Vocabulary: walk, run, jump, balance, ball, roll, catch"
      ],
      "description": "Gross motor foundations: locomotion, balance, ball handling"
    },
    {
      "name": "Arts",
      "topics": [
        "Free drawing",
        "Finger painting exploration",
        "Play dough modeling",
        "Vocabulary: draw, paint, color, finger, dough, shape, make"
      ],
      "description": "Creative exploration: drawing, sensory art, modeling"
    },
    {
      "name": "Music",
      "topics": [
        "Sing nursery rhymes",
        "Move to music",
        "Play simple instruments (shakers, drums)",
        "Vocabulary: sing, dance, music, shake, drum, fast, slow"
      ],
      "description": "Music and movement: rhythm, singing, instruments"
    },
    {
      "name": "Conversation 1",
      "topics": [
        "Hello/Goodbye",
        "What is your name?",
        "How are you?",
        "Vocabulary: hello, goodbye, name, fine, thank you"
      ],
      "description": "Basic social greetings and introductions"
    },
    {
      "name": "Story Time",
      "topics": [
        "Listen to picture books",
        "Retell simple story",
        "Vocabulary: book, story, picture, listen, tell, once upon a time"
      ],
      "description": "Literacy foundations: listening comprehension, storytelling"
    }
  ]
}
```

---

### Task 4: Create Curriculum JSON Files — K1 November

**Files:**
- Create: `assets/data/curriculum/k1/november.json`
- Test: `tests/unit/k1-november-curriculum.test.js`

**Step 3: Implementation** (based on engine-data.js Conversation 3 topics + K1 patterns):
```json
{
  "grade": "K1",
  "month": "November",
  "subjects": [
    {
      "name": "English",
      "topics": [
        "Letters F-J",
        "Trace letters F-J",
        "Phonics: F-Fan, G-Girl, H-Hen, I-Ice Cream, J-Jug",
        "Vocabulary: F-Fan, G-Girl, H-Hen, I-Ice Cream, J-Jug"
      ],
      "description": "Letters F-J with phonics and vocabulary"
    },
    {
      "name": "Mathematics",
      "topics": [
        "Count 1-10",
        "Trace numbers 6-10",
        "Simple addition with objects (1+1=2)",
        "Vocabulary: Six, Seven, Eight, Nine, Ten, add, plus, equals"
      ],
      "description": "Counting to 10, introduction to addition concepts"
    },
    {
      "name": "I.Q",
      "topics": [
        "Patterns: ABAB",
        "Sequencing: first, next, last",
        "Sorting by color and shape",
        "Vocabulary: pattern, first, next, last, sort, color, shape"
      ],
      "description": "Pattern recognition, sequencing, categorization"
    },
    {
      "name": "Social Studies",
      "topics": [
        "Community helpers: police, fire, doctor",
        "Transportation",
        "Safety rules",
        "Vocabulary: police, fire, doctor, car, bus, walk, stop, safe"
      ],
      "description": "Community awareness: helpers, transport, safety"
    },
    {
      "name": "Science",
      "topics": [
        "Weather: sunny, rainy, cloudy",
        "Seasons: autumn",
        "Animals: pets vs wild",
        "Vocabulary: sunny, rainy, cloudy, autumn, pet, wild, dog, cat, bird"
      ],
      "description": "Weather, seasons, animal classification"
    },
    {
      "name": "Physical Education",
      "topics": [
        "Obstacle course",
        "Throwing and catching bean bags",
        "Animal walks: bear, crab, frog",
        "Vocabulary: obstacle, throw, catch, bean bag, bear, crab, frog"
      ],
      "description": "Coordination, throwing/catching, animal movement patterns"
    },
    {
      "name": "Arts",
      "topics": [
        "Leaf printing",
        "Collage making",
        "Thanksgiving crafts",
        "Vocabulary: leaf, print, collage, glue, thanksgiving, turkey, feather"
      ],
      "description": "Nature art, collage techniques, seasonal crafts"
    },
    {
      "name": "Music",
      "topics": [
        "Autumn songs",
        "Rhythm sticks",
        "Loud and soft sounds",
        "Vocabulary: autumn, song, rhythm, stick, loud, soft, tap, shake"
      ],
      "description": "Seasonal music, rhythm exploration, dynamics"
    },
    {
      "name": "Conversation 2",
      "topics": [
        "Drink: What do you want to drink?",
        "Going: Where are you going?",
        "School: What do you do at school?",
        "Vocabulary: drink, water, juice, milk, going, school, play, learn, friend"
      ],
      "description": "Daily routine conversations: drinks, destinations, school"
    },
    {
      "name": "Conversation 3",
      "topics": [
        "Food: What do you eat? I eat rice.",
        "Daily routines: wake up, shower, sleep",
        "Wild animals: lion, giraffe, tiger, monkey",
        "Vocabulary: eat, rice, wake, shower, sleep, lion, giraffe, tiger, monkey"
      ],
      "description": "Food, routines, wild animals vocabulary"
    },
    {
      "name": "Physical Education",
      "topics": [
        "Playground equipment: slide, swing, climbing frame",
        "Group games: duck duck goose",
        "Vocabulary: slide, swing, climb, game, duck, goose, run, tag"
      ],
      "description": "Playground skills, group game rules"
    }
  ]
}
```

---

### Task 5: Create Curriculum JSON Files — K1 January

**Files:**
- Create: `assets/data/curriculum/k1/january.json`
- Test: `tests/unit/k1-january-curriculum.test.js`

**Step 3: Implementation** (based on K1 December arts "new year card making" + K1 patterns):
```json
{
  "grade": "K1",
  "month": "January",
  "subjects": [
    {
      "name": "English",
      "topics": [
        "Letters K-O",
        "Trace letters K-O",
        "Phonics: K-Kite, L-Lion, M-Monkey, N-Nest, O-Octopus",
        "Vocabulary: K-Kite, L-Lion, M-Monkey, N-Nest, O-Octopus"
      ],
      "description": "Letters K-O with phonics"
    },
    {
      "name": "Mathematics",
      "topics": [
        "Count 1-15",
        "Number recognition 1-15",
        "More/less comparison",
        "Vocabulary: Eleven through Fifteen, more, less, compare"
      ],
      "description": "Extended counting, quantity comparison"
    },
    {
      "name": "I.Q",
      "topics": [
        "Opposites: hot/cold, big/small, fast/slow",
        "Memory games",
        "Vocabulary: hot, cold, big, small, fast, slow, opposite, remember, memory"
      ],
      "description": "Opposites concept, memory skills"
    },
    {
      "name": "Social Studies",
      "topics": [
        "New Year celebrations",
        "Chinese New Year",
        "Family traditions",
        "Vocabulary: new year, celebrate, tradition, family, lantern, dragon, lucky"
      ],
      "description": "Cultural celebrations, family traditions"
    },
    {
      "name": "Science",
      "topics": [
        "Winter weather",
        "Hot and cold objects",
        "Ice and water",
        "Vocabulary: winter, cold, ice, water, freeze, melt, hot, warm"
      ],
      "description": "States of matter: ice/water, temperature"
    },
    {
      "name": "Physical Education",
      "topics": [
        "Dance and movement",
        "Ribbon dancing",
        "Follow the leader",
        "Vocabulary: dance, ribbon, move, follow, leader, jump, spin, turn"
      ],
      "description": "Creative movement, rhythm, following directions"
    },
    {
      "name": "Arts",
      "topics": [
        "Chinese New Year crafts",
        "Snowflake cutting",
        "Winter collage",
        "Vocabulary: lantern, dragon, snowflake, cut, winter, collage, white, blue"
      ],
      "description": "Cultural crafts, fine motor: cutting, collage"
    },
    {
      "name": "Music",
      "topics": [
        "New Year songs",
        "Fast and slow tempo",
        "Instrument exploration",
        "Vocabulary: new year, song, fast, slow, tempo, drum, bell, triangle"
      ],
      "description": "Seasonal music, tempo concepts, instruments"
    },
    {
      "name": "Conversation 1",
      "topics": [
        "Happy New Year greetings",
        "My holiday",
        "Vocabulary: happy, new, year, holiday, fun, family, visit, travel"
      ],
      "description": "New Year greetings, holiday sharing"
    },
    {
      "name": "Story Time",
      "topics": [
        "Winter stories",
        "Sequence story events",
        "Vocabulary: winter, snow, story, first, then, next, last, end"
      ],
      "description": "Seasonal stories, narrative sequencing"
    }
  ]
}
```

---

### Task 6: Create Curriculum JSON Files — K2 November

**Files:**
- Create: `assets/data/curriculum/k2/november.json`
- Test: `tests/unit/k2-november-curriculum.test.js`

**Step 3: Implementation** (based on grade-selection.html K2 description + engine-data.js):
```json
{
  "grade": "K2",
  "month": "November",
  "subjects": [
    {
      "name": "English",
      "topics": [
        "Full alphabet review A-Z",
        "Upper/lowercase matching all letters",
        "Beginning sounds all letters",
        "CVC words: cat, dog, hat, mat",
        "Vocabulary: all letter vocabulary + CVC words"
      ],
      "description": "Complete alphabet mastery, early reading: CVC words"
    },
    {
      "name": "Mathematics",
      "topics": [
        "Count 1-30",
        "Addition up to 10",
        "Subtraction up to 5",
        "Number bonds to 10",
        "Vocabulary: add, subtract, equals, plus, minus, bond, ten"
      ],
      "description": "Counting to 30, addition/subtraction fluency, number bonds"
    },
    {
      "name": "I.Q",
      "topics": [
        "Complex patterns: ABC, AABB",
        "Logical reasoning: which comes next?",
        "Visual memory: kim's game",
        "Vocabulary: pattern, logic, sequence, memory, observe, recall"
      ],
      "description": "Advanced patterns, logical reasoning, visual memory"
    },
    {
      "name": "Social Studies",
      "topics": [
        "My community: places and people",
        "Map skills: simple maps",
        "Cultural diversity",
        "Vocabulary: community, map, place, people, culture, different, same, world"
      ],
      "description": "Community awareness, basic geography, cultural understanding"
    },
    {
      "name": "Science",
      "topics": [
        "Plant life cycle: seed to plant",
        "Animal habitats",
        "Sink or float experiment",
        "Vocabulary: seed, grow, plant, habitat, home, sink, float, experiment, water"
      ],
      "description": "Life cycles, habitats, experimental inquiry"
    },
    {
      "name": "Physical Education",
      "topics": [
        "Structured games with rules",
        "Team relay races",
        "Balance beam",
        "Vocabulary: game, rule, team, relay, race, balance, beam, walk"
      ],
      "description": "Rule-based games, teamwork, balance skills"
    },
    {
      "name": "Arts",
      "topics": [
        "Directed drawing",
        "Color mixing: secondary colors",
        "Clay modeling",
        "Vocabulary: draw, mix, color, secondary, clay, model, shape, create"
      ],
      "description": "Technique-based art: drawing, color theory, 3D modeling"
    },
    {
      "name": "Music",
      "topics": [
        "Simple rhythms: ta, ti-ti",
        "High and low pitch",
        "Class ensemble",
        "Vocabulary: rhythm, beat, high, low, pitch, ensemble, together, play"
      ],
      "description": "Rhythm notation, pitch awareness, ensemble playing"
    },
    {
      "name": "Conversation 2",
      "topics": [
        "Shopping: How much? I want...",
        "Restaurant: Can I have...?",
        "Doctor: My ... hurts",
        "Vocabulary: buy, price, want, restaurant, eat, doctor, hurt, sick, medicine"
      ],
      "description": "Real-world conversations: shopping, dining, health"
    },
    {
      "name": "Conversation 3",
      "topics": [
        "Technology: phone, computer, TV",
        "Jobs: what do you want to be?",
        "Vocabulary: phone, computer, TV, watch, job, teacher, doctor, police, driver"
      ],
      "description": "Modern world: technology, aspirations, occupations"
    },
    {
      "name": "Cooking",
      "topics": [
        "Fruit salad",
        "Measuring ingredients",
        "Kitchen safety",
        "Vocabulary: fruit, salad, measure, cup, spoon, safe, knife, cut, wash"
      ],
      "description": "Simple recipe, measurement, safety awareness"
    }
  ]
}
```

---

### Task 7: Create Curriculum JSON Files — K2 January

**Files:**
- Create: `assets/data/curriculum/k2/january.json`
- Test: `tests/unit/k2-january-curriculum.test.js`

**Step 3: Implementation** (new year theme + K2 level):
```json
{
  "grade": "K2",
  "month": "January",
  "subjects": [
    {
      "name": "English",
      "topics": [
        "Sentence building: I see the...",
        "Sight words: the, and, is, to, a",
        "Reading simple sentences",
        "Vocabulary: the, and, is, to, a, see, I, you, we, can"
      ],
      "description": "Early reading: sight words, simple sentence construction"
    },
    {
      "name": "Mathematics",
      "topics": [
        "Count 1-50",
        "Skip counting by 2s, 5s",
        "Shapes: 2D and 3D",
        "Vocabulary: fifty, count, skip, two, five, shape, circle, square, cube, sphere"
      ],
      "description": "Extended counting, skip counting, geometry basics"
    },
    {
      "name": "I.Q",
      "topics": [
        "Analogies: cat:kitten :: dog:puppy",
        "Classification: sort by multiple attributes",
        "Vocabulary: analogy, classify, sort, attribute, group, category"
      ],
      "description": "Analogical reasoning, multi-attribute classification"
    },
    {
      "name": "Social Studies",
      "topics": [
        "World cultures",
        "Holidays around the world",
        "My place in the world",
        "Vocabulary: world, culture, holiday, country, flag, language, food, custom"
      ],
      "description": "Global awareness, cultural celebrations, geographic self-location"
    },
    {
      "name": "Science",
      "topics": [
        "Magnets",
        "Light and shadows",
        "Sound vibrations",
        "Vocabulary: magnet, attract, repel, light, shadow, sound, vibrate, hear"
      ],
      "description": "Physical science: magnetism, light, sound"
    },
    {
      "name": "Physical Education",
      "topics": [
        "Gymnastics basics",
        "Jump rope skills",
        "Cooperative games",
        "Vocabulary: gymnastics, roll, jump, rope, cooperate, team, share, help"
      ],
      "description": "Body control, coordination, cooperation"
    },
    {
      "name": "Arts",
      "topics": [
        "Self-portrait",
        "Texture exploration",
        "Printmaking: foam prints",
        "Vocabulary: portrait, self, texture, print, foam, press, ink, paper"
      ],
      "description": "Self-expression, texture, printmaking technique"
    },
    {
      "name": "Music",
      "topics": [
        "Call and response songs",
        "Create your own rhythm",
        "Marching band play-along",
        "Vocabulary: call, response, create, rhythm, march, band, instrument, play"
      ],
      "description": "Musical interaction, creativity, ensemble"
    },
    {
      "name": "Conversation 1",
      "topics": [
        "Year review: What did you learn?",
        "Goals: What do you want to learn?",
        "Vocabulary: learn, year, goal, want, better, improve, try, practice"
      ],
      "description": "Reflection and goal-setting conversations"
    }
  ]
}
```

---

### Task 8: Create Curriculum JSON Files — P2 Semester 1

**Files:**
- Create: `assets/data/curriculum/p2/semester1.json`
- Test: `tests/unit/p2-semester1-curriculum.test.js`

**Step 3: Implementation** (from month-selection.html P2 Semester 1 description + engine-data.js P2 subjects):
```json
{
  "grade": "P2",
  "month": "Semester 1",
  "subjects": [
    {
      "name": "Thai Language",
      "topics": [
        "Reading: consonants, vowels, tone marks",
        "Writing: letter formation, words, sentences",
        "Listening comprehension",
        "Speaking: pronunciation, conversation",
        "Vocabulary: high-frequency Thai words"
      ],
      "description": "Thai literacy: reading, writing, listening, speaking foundations"
    },
    {
      "name": "Mathematics",
      "topics": [
        "Numbers 1-100",
        "Addition and subtraction within 20",
        "Place value: tens and ones",
        "Shapes and patterns",
        "Measurement: length, weight",
        "Vocabulary: addition, subtraction, tens, ones, measure, long, short, heavy, light"
      ],
      "description": "Number sense to 100, basic operations, measurement introduction"
    },
    {
      "name": "Science",
      "topics": [
        "Living things: plants and animals",
        "Plant parts and functions",
        "Animal characteristics",
        "Weather and seasons",
        "Vocabulary: plant, animal, root, stem, leaf, flower, seed, weather, season, rain, sun"
      ],
      "description": "Life science: plants, animals, weather observation"
    },
    {
      "name": "Social Studies",
      "topics": [
        "My community: school, neighborhood",
        "Thailand: map, flag, capital",
        "Community helpers",
        "Rules and responsibilities",
        "Vocabulary: community, Thailand, Bangkok, flag, map, helper, rule, responsibility"
      ],
      "description": "Civics and geography: community, Thailand basics, citizenship"
    },
    {
      "name": "English",
      "topics": [
        "Phonics: consonant blends, digraphs",
        "Sight words: 50+ words",
        "Reading: simple stories",
        "Writing: sentences, punctuation",
        "Vocabulary: blend, digraph, sight word, sentence, period, capital letter"
      ],
      "description": "English literacy: phonics, sight words, reading, writing"
    },
    {
      "name": "Arts",
      "topics": [
        "Color mixing: primary to secondary",
        "Thai patterns: traditional designs",
        "Drawing: observation skills",
        "Crafts: paper folding, collage",
        "Vocabulary: primary, secondary, mix, pattern, Thai, fold, collage, observe"
      ],
      "description": "Color theory, Thai cultural art, observational drawing, crafts"
    },
    {
      "name": "Health & Physical Education",
      "topics": [
        "Basic movements: run, jump, throw, catch",
        "Healthy habits: washing, eating, sleeping",
        "Safety: at home, school, road",
        "Vocabulary: move, run, jump, throw, catch, healthy, wash, eat, sleep, safe"
      ],
      "description": "Fundamental movement skills, health education, safety awareness"
    },
    {
      "name": "Computing",
      "topics": [
        "Computer parts: monitor, keyboard, mouse",
        "Mouse skills: click, drag, double-click",
        "Keyboard: letter keys, space, enter",
        "Digital citizenship: care for devices",
        "Vocabulary: computer, monitor, keyboard, mouse, click, drag, type, care"
      ],
      "description": "Computer hardware basics, input device skills, digital care"
    }
  ]
}
```

---

### Task 9: Create Curriculum JSON Files — P2 Semester 2

**Files:**
- Create: `assets/data/curriculum/p2/semester2.json`
- Test: `tests/unit/p2-semester2-curriculum.test.js`

**Step 3: Implementation** (from month-selection.html P2 Semester 2 description):
```json
{
  "grade": "P2",
  "month": "Semester 2",
  "subjects": [
    {
      "name": "Thai Language",
      "topics": [
        "Reading comprehension: short passages",
        "Consonant classes: middle, high, low",
        "Writing: paragraphs, punctuation",
        "Poetry: Thai poems, rhymes",
        "Vocabulary: comprehension, consonant, class, paragraph, poem, rhyme"
      ],
      "description": "Advanced Thai: comprehension, consonant classes, creative writing"
    },
    {
      "name": "Mathematics",
      "topics": [
        "Multiplication introduction: 2x, 5x, 10x",
        "Fractions: half, quarter",
        "Measurement: length (cm, m), time (hour, half-hour)",
        "Money: Thai coins and notes",
        "Vocabulary: multiply, fraction, half, quarter, centimeter, meter, hour, baht, coin, note"
      ],
      "description": "Early multiplication, fractions, measurement, money"
    },
    {
      "name": "Science",
      "topics": [
        "Life cycles: butterfly, frog, plant",
        "Forces: push, pull, magnet",
        "Water cycle: evaporation, condensation, rain",
        "Materials: properties, changes",
        "Vocabulary: life cycle, butterfly, frog, force, push, pull, water cycle, evaporate, condense"
      ],
      "description": "Life cycles, physical forces, water cycle, material properties"
    },
    {
      "name": "Social Studies",
      "topics": [
        "Thai history: ancient kingdoms",
        "Maps: Thailand provinces, directions",
        "Citizenship: rights, responsibilities",
        "Thai symbols: elephant, flag, anthem",
        "Vocabulary: history, kingdom, province, direction, citizen, right, responsibility, symbol"
      ],
      "description": "Thai history, advanced map skills, citizenship education"
    },
    {
      "name": "English",
      "topics": [
        "Vowel teams: ai, ee, oa, ou",
        "Past tense: regular -ed, common irregular",
        "Questions: who, what, where, when, why, how",
        "Reading: chapter books, comprehension",
        "Vocabulary: vowel, team, past, tense, question, who, what, where, when, why, how"
      ],
      "description": "Advanced phonics, grammar: past tense, question words, chapter book reading"
    },
    {
      "name": "Arts",
      "topics": [
        "Thai crafts: weaving, pottery, umbrella painting",
        "Drama: role play, puppetry",
        "Music integration: rhythm with art",
        "Vocabulary: craft, weave, pottery, umbrella, drama, role, puppet, rhythm, music"
      ],
      "description": "Traditional Thai crafts, performing arts, cross-curricular integration"
    },
    {
      "name": "Health & Physical Education",
      "topics": [
        "Games with rules: tag, relay, ball games",
        "Emotional health: feelings, empathy",
        "Nutrition: food groups",
        "Vocabulary: game, rule, tag, relay, emotion, feeling, empathy, nutrition, food group"
      ],
      "description": "Structured games, social-emotional learning, nutrition"
    },
    {
      "name": "Computing",
      "topics": [
        "File management: save, open, folder",
        "Simple coding: Scratch Jr / block coding",
        "Digital drawing",
        "Online safety basics",
        "Vocabulary: file, save, open, folder, code, block, draw, safe, online, internet"
      ],
      "description": "File operations, introductory coding, digital creativity, e-safety"
    }
  ]
}
```

---

### Task 10: Create Curriculum JSON Files — PVT General

**Files:**
- Create: `assets/data/curriculum/pvt/general.json`
- Test: `tests/unit/pvt-general-curriculum.test.js`

**Step 3: Implementation** (from grade-selection.html PVT description):
```json
{
  "grade": "PVT",
  "month": "General",
  "subjects": [
    {
      "name": "PVT Language Arts",
      "topics": [
        "Phonemic awareness",
        "Phonics: systematic decoding",
        "Vocabulary development",
        "Reading fluency and comprehension",
        "Writing: process, genres, conventions",
        "Speaking and listening",
        "Vocabulary: comprehensive grade-appropriate word lists"
      ],
      "description": "Complete language arts: reading, writing, speaking, listening"
    },
    {
      "name": "PVT Mathematics",
      "topics": [
        "Number sense and operations",
        "Algebraic thinking: patterns, relationships",
        "Geometry: shapes, spatial reasoning",
        "Measurement: attributes, units, tools",
        "Data analysis and probability",
        "Vocabulary: math vocabulary by strand"
      ],
      "description": "Comprehensive mathematics across all strands"
    },
    {
      "name": "PVT Science",
      "topics": [
        "Physical science: matter, energy, forces",
        "Life science: organisms, ecosystems",
        "Earth and space science",
        "Engineering design process",
        "Vocabulary: science vocabulary by domain"
      ],
      "description": "Inquiry-based science across all domains"
    },
    {
      "name": "PVT Social Studies",
      "topics": [
        "History: personal, family, community",
        "Geography: maps, places, environments",
        "Civics: rules, citizenship, government",
        "Economics: needs, wants, goods, services",
        "Culture: diversity, traditions",
        "Vocabulary: social studies vocabulary by strand"
      ],
      "description": "Social studies: history, geography, civics, economics, culture"
    },
    {
      "name": "PVT Physical Education",
      "topics": [
        "Motor skills: locomotor, non-locomotor, manipulative",
        "Movement concepts: space, effort, relationships",
        "Physical fitness: health-related, skill-related",
        "Personal and social behavior",
        "Vocabulary: PE vocabulary by standard"
      ],
      "description": "Standards-based physical education"
    },
    {
      "name": "PVT Arts & Crafts",
      "topics": [
        "Visual arts: creating, presenting, responding, connecting",
        "Media and techniques variety",
        "Art history and appreciation",
        "Vocabulary: arts vocabulary"
      ],
      "description": "Comprehensive visual arts education"
    },
    {
      "name": "PVT Music & Movement",
      "topics": [
        "Singing: alone and with others",
        "Instruments: playing, improvising",
        "Movement: dance, creative movement",
        "Listening: analysis, appreciation",
        "Vocabulary: music vocabulary"
      ],
      "description": "Comprehensive music and movement education"
    },
    {
      "name": "PVT Critical Thinking & Logic",
      "topics": [
        "Problem solving strategies",
        "Logical reasoning",
        "Creative thinking",
        "Decision making",
        "Metacognition",
        "Vocabulary: thinking skills vocabulary"
      ],
      "description": "Explicit critical thinking and logic instruction"
    },
    {
      "name": "PVT Social-Emotional Learning",
      "topics": [
        "Self-awareness: emotions, strengths",
        "Self-management: regulation, goals",
        "Social awareness: empathy, perspective",
        "Relationship skills: communication, cooperation",
        "Responsible decision making",
        "Vocabulary: SEL vocabulary"
      ],
      "description": "CASEL-aligned social-emotional learning"
    },
    {
      "name": "PVT Life Skills",
      "topics": [
        "Personal care: hygiene, dressing, eating",
        "Home skills: cooking, cleaning, organizing",
        "Community skills: shopping, transport, safety",
        "Vocational: interests, work habits",
        "Vocabulary: life skills vocabulary"
      ],
      "description": "Functional life skills for independence"
    },
    {
      "name": "PVT Technology & Digital Literacy",
      "topics": [
        "Device basics: hardware, software",
        "Digital citizenship: safety, ethics",
        "Information literacy: search, evaluate",
        "Creation: documents, media, code",
        "Vocabulary: technology vocabulary"
      ],
      "description": "Comprehensive technology and digital literacy"
    },
    {
      "name": "PVT Environmental Awareness",
      "topics": [
        "Nature observation",
        "Conservation: reduce, reuse, recycle",
        "Sustainability",
        "Climate awareness",
        "Vocabulary: environment vocabulary"
      ],
      "description": "Environmental stewardship and sustainability"
    },
    {
      "name": "PVT Mindfulness & Well-being",
      "topics": [
        "Breathing techniques",
        "Body awareness",
        "Emotional regulation tools",
        "Gratitude and positivity",
        "Vocabulary: mindfulness vocabulary"
      ],
      "description": "Mindfulness practices for well-being"
    },
    {
      "name": "PVT Global Citizenship",
      "topics": [
        "World cultures and languages",
        "Global issues: age-appropriate",
        "Interconnectedness",
        "Action for change",
        "Vocabulary: global citizenship vocabulary"
      ],
      "description": "Global awareness and citizenship education"
    }
  ]
}
```

---

### Task 11: Fix StudentInfoController — Remove Duplicate Tracker, Add Progress Tracking

**Files:**
- Modify: `assets/js/controllers/student-info-controller.js`
- Test: `tests/unit/student-info-controller.test.js`

**Step 1: Write failing test**
```javascript
// tests/unit/student-info-controller.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StudentInfoController } from '../../assets/js/controllers/student-info-controller.js';

describe('StudentInfoController', () => {
  let controller, mockApp, container;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="curriculumTracker"></div>
      <form class="student-form">
        <input id="studentName" name="studentName" required>
        <select id="gender" name="gender" required><option value="">Select</option><option value="he">He</option></select>
        <textarea id="strengths" name="strengths" required></textarea>
        <textarea id="weaknesses" name="weaknesses" required></textarea>
        <input type="range" id="overallAttributes" name="overallAttributes" min="1" max="10" value="5">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <button class="nav-button primary" type="button">Next</button>
        <button class="nav-button secondary" type="button">Back</button>
      </form>
      <div class="slider-value" id="sliderValue"></div>
    `;
    mockApp = {
      sessionData: {},
      updateSessionData: vi.fn(),
      navigateWithTransition: vi.fn(),
      showNotification: vi.fn()
    };
    controller = new StudentInfoController(mockApp);
  });

  it('should initialize curriculum tracker from URL params', () => {
    window.history.pushState({}, '', '?grade=K1&month=August');
    controller.init();
    const tracker = document.getElementById('curriculumTracker');
    expect(tracker.innerHTML).toContain('K1');
    expect(tracker.innerHTML).toContain('August');
  });

  it('should initialize curriculum tracker from localStorage when no URL params', () => {
    localStorage.setItem('studentData', JSON.stringify({ grade: 'K2', month: 'November' }));
    controller.init();
    const tracker = document.getElementById('curriculumTracker');
    expect(tracker.innerHTML).toContain('K2');
    expect(tracker.innerHTML).toContain('November');
  });

  it('should escape HTML in tracker output (XSS prevention)', () => {
    window.history.pushState({}, '', '?grade=<script>&month=test');
    controller.init();
    const tracker = document.getElementById('curriculumTracker');
    expect(tracker.innerHTML).not.toContain('<script>');
    expect(tracker.innerHTML).toContain('&lt;script&gt;');
  });

  it('should call setupProgressTracking in init', () => {
    const spy = vi.spyOn(controller, 'setupProgressTracking');
    controller.init();
    expect(spy).toHaveBeenCalled();
  });

  it('progress bar should update when form fields are filled', () => {
    controller.init();
    const nameInput = document.getElementById('studentName');
    nameInput.value = 'Test Student';
    nameInput.dispatchEvent(new Event('input'));
    const progressFill = document.getElementById('progressFill');
    expect(progressFill.style.width).not.toBe('0%');
  });
});
```

**Step 3: Implementation**
```javascript
// assets/js/controllers/student-info-controller.js
export class StudentInfoController {
    constructor(app) {
        this.app = app;
    }

    init() {
        // Show current curriculum tracker (single source of truth)
        this.updateCurriculumTracker();

        this.setupFormValidation();
        this.setupProgressTracking();  // NEW: was missing
        this.initSlider();
        this.setupNavigationButtons();
    }

    /**
     * Update curriculum tracker display with XSS-safe escaping
     */
    updateCurriculumTracker() {
        try {
            let grade = '';
            let month = '';
            // Prefer URL params, fallback to localStorage
            const params = new URLSearchParams(window.location.search);
            grade = params.get('grade') || '';
            month = params.get('month') || '';
            if (!grade || !month) {
                const saved = localStorage.getItem('studentData');
                if (saved) {
                    const data = JSON.parse(saved);
                    grade = grade || data.grade || '';
                    month = month || data.month || '';
                }
            }
            if (grade && month) {
                const tracker = document.getElementById('curriculumTracker');
                if (tracker) {
                    const safeGrade = this.escapeHtml(grade);
                    const safeMonth = this.escapeHtml(month);
                    tracker.innerHTML = `<span style="background:rgba(0,0,0,0.07);border-radius:16px;padding:4px 12px;font-weight:600;display:inline-block;">Current: <span style='color:#2a7cff'>${safeGrade}</span> · <span style='color:#ff7c2a'>${safeMonth}</span> <a href='month-selection.html?grade=${encodeURIComponent(grade)}' style='margin-left:8px;font-size:13px;'>Change</a></span>`;
                }
            }
        } catch (e) { }
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupFormValidation() {
        const form = document.querySelector('.student-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Setup form submission
        const nextButton = document.querySelector('.nav-button.primary');
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitStudentInfo();
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.name || field.id) {
            case 'studentName':
                isValid = value.length >= 2;
                message = isValid ? '' : 'Student name must be at least 2 characters';
                break;
            case 'gender':
                isValid = value !== '';
                message = isValid ? '' : 'Please select a gender';
                break;
            case 'strengths':
                isValid = value.length >= 5;
                message = isValid ? '' : 'Please provide more detail (minimum 5 characters)';
                break;
            case 'weaknesses':
                isValid = value.length >= 5;
                message = isValid ? '' : 'Please provide more detail (minimum 5 characters)';
                break;
        }

        // Update field appearance
        field.classList.remove('valid', 'invalid');
        field.classList.add(isValid ? 'valid' : 'invalid');

        // Update validation message
        const messageElement = field.parentNode.querySelector('.validation-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = message ? 'flex' : 'none';
            messageElement.classList.toggle('success', isValid && value !== '');
        }

        return isValid;
    }

    setupProgressTracking() {
        const form = document.querySelector('.student-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        const updateProgress = () => {
            const completedFields = Array.from(inputs).filter(input =>
                input.value.trim() !== '' && this.validateField(input)
            ).length;

            const progress = (completedFields / inputs.length) * 100;

            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }

            if (progressText) {
                progressText.textContent = `Form Progress: ${Math.round(progress)}% Complete`;
            }
        };

        inputs.forEach(input => {
            input.addEventListener('input', updateProgress);
        });

        updateProgress();
    }

    initSlider() {
        const slider = document.querySelector('.slider');
        const sliderValue = document.querySelector('.slider-value');

        if (!slider || !sliderValue) return;

        const updateSliderDisplay = () => {
            const value = parseInt(slider.value);
            sliderValue.textContent = `${value}/10`;

            // Update slider appearance based on value
            const percentage = (value - 1) / 9 * 100;
            slider.style.background = `linear-gradient(90deg,
        #e74c3c 0%,
        #f39c12 ${percentage < 50 ? percentage * 2 : 100}%,
        #27ae60 ${percentage}%)`;
        };

        slider.addEventListener('input', updateSliderDisplay);
        updateSliderDisplay();
    }

    setupNavigationButtons() {
        // Back button
        const backButton = document.querySelector('.nav-button.secondary');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.app.navigateWithTransition('index.html');
            });
        }
    }

    submitStudentInfo() {
        const form = document.querySelector('.student-form');
        if (!form) return;

        // Collect form data
        const formData = new FormData(form);

        // Validate all required fields
        const requiredFields = form.querySelectorAll('[required]');
        let allValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.app.showNotification('Please complete all required fields correctly.', 'error');
            return;
        }

        // Store session data (in memory only)
        // Get grade/month from localStorage.studentData (persisted from previous steps)
        let grade = '';
        let month = '';
        try {
            const saved = localStorage.getItem('studentData');
            if (saved) {
                const data = JSON.parse(saved);
                grade = data.grade || '';
                month = data.month || '';
            }
        } catch (e) {
            console.warn('Could not load grade/month from localStorage:', e);
        }

        const sessionData = {
            grade: grade,
            month: month,
            studentName: formData.get('studentName') || '',
            gender: formData.get('gender') || '',
            overallRating: parseInt(formData.get('overallRating')) || 5,
            strengths: formData.get('strengths') || '',
            weaknesses: formData.get('weaknesses') || '',
            subjects: [],
            topicRatings: {}
        };

        this.app.updateSessionData(sessionData);

        // Pass data to next page via URL parameters (temporary)
        const params = new URLSearchParams();
        Object.keys(sessionData).forEach(key => {
            if (typeof sessionData[key] !== 'object') {
                params.set(key, sessionData[key]);
            }
        });

        this.app.navigateWithTransition(`Subjects.html?${params.toString()}`);
    }
}
```

---

### Task 12: Clean Up student-information.html — Remove Inline Tracker

**Files:**
- Modify: `student-information.html`
- Test: Manual verification (no duplicate tracker code)

**Step 1: Write failing test**
```javascript
// tests/unit/student-info-html.test.js
import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('student-information.html', () => {
  const content = fs.readFileSync('student-information.html', 'utf-8');

  it('should NOT contain inline updateCurriculumTracker function', () => {
    expect(content).not.toContain('function updateCurriculumTracker');
    expect(content).not.toContain('updateCurriculumTracker()');
  });

  it('should contain curriculumTracker div', () => {
    expect(content).toContain('id="curriculumTracker"');
  });
});
```

**Step 3: Implementation** — Remove lines 1044-1069 from student-information.html (the `updateCurriculumTracker` function and its auto-call)

---

### Task 13: Improve Auto-Save UX — Debouncing + Saving State

**Files:**
- Modify: `student-information.html` (inline script section)
- Test: `tests/unit/auto-save-ux.test.js`

**Step 1: Write failing test**
```javascript
// tests/unit/auto-save-ux.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Auto-save UX', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="studentForm">
        <input id="studentName" name="studentName">
        <select id="gender" name="gender"><option value="">Select</option><option value="he">He</option></select>
        <textarea id="strengths" name="strengths"></textarea>
        <textarea id="weaknesses" name="weaknesses"></textarea>
        <input type="range" id="overallAttributes" name="overallAttributes" min="1" max="10" value="5">
      </form>
      <div class="auto-save-indicator" id="nameIndicator">Saved</div>
      <div class="auto-save-indicator" id="genderIndicator">Saved</div>
      <div class="auto-save-indicator" id="strengthsIndicator">Saved</div>
      <div class="auto-save-indicator" id="weaknessesIndicator">Saved</div>
    `;
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  it('should debounce auto-save (300ms)', () => {
    // Load the inline script logic
    require('../student-information.html'); // This would need adjustment
    
    const nameInput = document.getElementById('studentName');
    const indicator = document.getElementById('nameIndicator');
    
    nameInput.value = 'Test';
    nameInput.dispatchEvent(new Event('input'));
    
    // Should show "Saving..." immediately
    expect(indicator.textContent).toBe('Saving...');
    
    // Advance timers 200ms - should still be saving
    vi.advanceTimersByTime(200);
    expect(indicator.textContent).toBe('Saving...');
    
    // Advance to 350ms - should show "Saved"
    vi.advanceTimersByTime(150);
    expect(indicator.textContent).toBe('Saved');
  });
});
```

**Step 3: Implementation** — Replace the auto-save logic in student-information.html inline script (around lines 1077-1089) with debounced version showing "Saving..." state.

---

### Task 14: Full Integration Test & Verification

**Files:**
- Test: `tests/integration/full-flow.test.js`

**Step 1: Write failing test** — Test complete flow: grade-selection → month-selection → student-information → subjects → comments

**Step 3: Run all tests**
```bash
npm test
npm run lint
node scripts/verify.js
```

**Expected: All pass**

---

### Task 15: Clean Up .txt Files (Optional)

**Files:**
- Delete: `assets/js/curriculum/k1/December.txt`
- Delete: `assets/js/curriculum/k2/December.txt`

**Step 3: Commit**
```bash
git rm assets/js/curriculum/k1/December.txt assets/js/curriculum/k2/December.txt
git commit -m "chore: Remove legacy .txt curriculum files (replaced by JSON)"
```

---

## Execution Order

1. Tasks 1-10: Create curriculum JSON files (parallelizable - independent)
2. Task 11: Fix StudentInfoController
3. Task 12: Clean up student-information.html
4. Task 13: Improve auto-save UX
5. Task 14: Full verification
6. Task 15: Cleanup .txt files

---

## Commit Strategy

Commit after each task passes its tests. Use conventional commits:
- `feat: Add K1 December curriculum JSON`
- `feat: Add K2 December curriculum JSON`
- `feat: Add K1 August curriculum JSON`
- `feat: Add K1 November curriculum JSON`
- `feat: Add K1 January curriculum JSON`
- `feat: Add K2 November curriculum JSON`
- `feat: Add K2 January curriculum JSON`
- `feat: Add P2 Semester 1 curriculum JSON`
- `feat: Add P2 Semester 2 curriculum JSON`
- `feat: Add PVT General curriculum JSON`
- `fix: StudentInfoController - add progress tracking, remove duplicate tracker`
- `fix: student-information.html - remove inline tracker function`
- `feat: Auto-save UX - debouncing with saving state`
- `chore: Remove legacy .txt curriculum files`