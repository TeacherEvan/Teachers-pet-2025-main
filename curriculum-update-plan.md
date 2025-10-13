# Curriculum Update Implementation Plan

## Overview

Replace the existing subject/topic structure in `Subjects.html` with the new curriculum data extracted from the screenshot. This will update all marking points to reflect the current kindergarten teaching standards.

## Current Structure Analysis

### Existing Subjects in `Subjects.html`

1. **English** - 6 topics (matching letters, tracing, etc.)
2. **Phonics** - 6 topics (recognizing letters A-E, blending CVC words, etc.)
3. **Mathematics** - 6 topics (counting 1-10, tracing numbers, shapes)
4. **I.Q** - 6 topics (matching animals, shapes, memory games)
5. **Social Studies** - 6 topics (farm animals, body parts, community helpers)
6. **Science** - 6 topics (buoyancy, gas production, five senses)
7. **Conversation 1** - 6 topics (greetings, yes/no questions, polite words)
8. **Conversation 3** - 6 topics (snacks, fruits, vegetables, animals)
9. **Physical Education** - 6 topics (outdoor games, balance, coordination)
10. **Arts & Crafts** - 6 topics (finger painting, collage, play dough)

### New Curriculum from Screenshot

1. **English** - 4 activities + vocabulary
2. **Mathematics** - 6 activities + vocabulary
3. **I.Q** - 5 activities + extensive vocabulary
4. **Social Studies** - 5 activities + extensive vocabulary
5. **Science** - 4 experiments + vocabulary
6. **Cooking** - 1 activity + vocabulary
7. **Conversation 1** - 5 topics + vocabulary
8. **Conversation 2** - 3 topics + vocabulary
9. **Arts** - 5 activities + vocabulary
10. **Physical Education** - 6 activities + vocabulary
11. **Puppet Show** - 2 stories + vocabulary
12. **Super Safari** - 15+ activities + extensive vocabulary
13. **Story Time** - 4 stories + vocabulary

## Key Differences

### Subjects to Remove

- **Phonics** (not in new curriculum - merged into English)
- **Conversation 3** (replaced by Conversation 2)

### Subjects to Add

- **Cooking**
- **Conversation 2**
- **Puppet Show**
- **Super Safari**
- **Story Time**

### Subjects to Update (activities/topics changed)

- All existing subjects need topic updates

## Implementation Strategy

### Phase 1: Prepare Data Structure

Create a JavaScript object containing all new curriculum data in the same format as existing code.

### Phase 2: Update HTML Structure

Replace the subject sections in `Subjects.html` (lines ~369-650+) with new curriculum topics.

### Phase 3: Maintain Compatibility

Ensure all existing JavaScript functions still work:

- `toggleSubject()` function
- `handleSubjectCheck()` function
- Subject/topic checkbox handling
- Comment generation integration

### Phase 4: Update Comment Engine

Verify `PremiumCommentEngine` can handle new subject names and topics properly.

## Detailed Replacement Mapping

### English (Updated Activities)

**OLD Topics:**

- Matching letters to pictures ✓ (keep - similar to new)
- Tracing and coloring letters ✓ (keep - similar to new)
- Matching identical letters ✓ (keep - similar to new)
- Identifying beginning letter sounds ✓ (keep - similar to new)
- Singing the alphabet song with actions ❌ (remove)
- Writing uppercase and lowercase letters ❌ (remove)

**NEW Topics:**

- Draw lines to match letter with correct picture
- Trace letters starting from the dot
- Draw lines to match the same letters
- Circle correct letter matching with pictures

### Mathematics (Updated Activities)

**OLD Topics:**

- Counting from 1 to 10 ✓ (keep)
- Tracing numbers 1-3 ➜ (update to "1-5")
- Matching quantities to numbers ✓ (keep)
- Counting with fingers ❌ (remove)
- Identifying basic shapes ❌ (remove)
- Sorting objects by shape ❌ (remove)

**NEW Topics:**

- Count from 1-10
- Draw lines to match pictures with same number
- Mark picture with correct amount
- Mark numbers that match with pictures
- Circle the correct amount
- Trace numbers 1-5 following dotted line

### I.Q (Updated Activities)

**OLD Topics:**

- All current topics to be replaced

**NEW Topics:**

- Color pictures that are the same
- Color pictures that are fatter
- Color the taller picture
- Color hot and cold items
- Color shape that is same as first

### Social Studies (Updated Activities)

**NEW Topics:**

- Identify animal sounds and sounds around us
- Identify animals that produce milk
- Good habits we do every day
- Personal hygiene
- Good and bad gestures

### Science (Updated Activities)

**NEW Topics:**

- Tissue Magic
- Lava lamp
- Magnet
- Lemon volcano

### Cooking (NEW Subject)

**Topics:**

- Look chop

### Conversation 1 (Updated)

**NEW Topics:**

- What pet do you have? (I have a dog/cat)
- How do you feel? (I feel happy/sad)
- What would you like for lunch? (I would like...)
- What do you want to be? (I want to be a doctor/teacher)
- Where would you like to go? (I like to go to the zoo/park)

### Conversation 2 (NEW Subject - replaces Conversation 3)

**Topics:**

- What do you like to drink? (I like to drink milk)
- Where are you going? (I'm going to the hospital)
- How do you go to school? (I go to school by car)

### Arts (Updated from Arts & Crafts)

**NEW Topics:**

- Finger painting
- Ladybug
- Play Dough
- Sponge painting
- Origami Fox

### Physical Education (Updated)

**NEW Topics:**

- Playing football
- Balance the ball
- Put ball in the ring
- Balance and jump in circle
- Zigzag and going under arches
- Hurdle jumping

### Puppet Show (NEW Subject)

**Topics:**

- Noond doesn't eat her vegetables
- The tale of the panicked rabbit

### Super Safari (NEW Subject)

**Topics:**

- Listen and colour
- Say the numbers
- Look and circle
- Say the sentence
- Colour the correct circle
- Complete the face
- Color different pictures
- Join the dots
- My pets - Say the pets
- Look and match
- Food - Say the food
- Draw something
- Maze activity
- Super Safari Arts and Crafts
- Let's make a train
- Hanging letters S/N/I
- Make a handprint bird
- Make a pasta fish
- Animals Mask

### Story Time (NEW Subject)

**Topics:**

- Harry frog
- Bird
- The lovely animals
- The ox and the frog

## Technical Considerations

### 1. HTML Structure Pattern

Each subject follows this pattern:

```html
<div class="subject-section">
    <div class="subject-header" onclick="toggleSubject('subjectid')">
        <div class="subject-title">
            <input type="checkbox" class="subject-checkbox" id="subject_subjectid" value="Subject Name" onchange="handleSubjectCheck('subjectid')">
            <label for="subject_subjectid">SUBJECT NAME</label>
            <span class="dropdown-arrow" id="arrow_subjectid">▼</span>
        </div>
    </div>
    <div class="subject-content" id="content_subjectid">
        <!-- Topics here -->
    </div>
</div>
```

### 2. Topic Structure Pattern

```html
<div class="topic-item">
    <input type="checkbox" class="topic-checkbox" id="uniqueid" value="topic description">
    <label for="uniqueid" class="topic-text">Topic Description</label>
</div>
```

### 3. Subject ID Naming Convention

- Use lowercase, no spaces
- Examples: `english`, `mathematics`, `iq`, `social`, `conversation1`, `conversation2`

### 4. Comment Engine Compatibility

The `PremiumCommentEngine` must recognize new subject names:

- Update `grammarRules.subjectCapitalization` object
- Verify subject name matching in comment generation logic

## Implementation Steps

### Step 1: Backup Current File

Create backup of `Subjects.html` before making changes.

### Step 2: Update Subject Sections

Replace HTML for each subject section with new curriculum topics.

### Step 3: Update JavaScript

- Add new subject IDs to any subject arrays
- Update `grammarRules.subjectCapitalization` in `comment-engine.js`

### Step 4: Test Functionality

- Verify all checkboxes work
- Test dropdown toggle functionality
- Verify subject selection propagates to comment generation
- Test comment generation with new subjects

### Step 5: Update Documentation

- Log changes in `jobcard.md`
- Update `Index.md` if needed
- Document new curriculum structure

## Risk Mitigation

### Potential Issues

1. **Breaking existing user data** - Solution: Clear localStorage on first load after update
2. **Comment generation errors** - Solution: Test with multiple subject combinations
3. **UI layout issues** - Solution: Test with many subjects expanded
4. **Topic ID conflicts** - Solution: Use systematic naming (subject_topic1, subject_topic2, etc.)

## Testing Checklist

- [ ] All subject checkboxes clickable
- [ ] Dropdown arrows toggle correctly
- [ ] Topics hidden when subject unchecked
- [ ] Topics shown when subject checked
- [ ] Comment generation includes new subjects
- [ ] No JavaScript console errors
- [ ] Mobile responsive layout maintained
- [ ] Glassmorphism styling preserved
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

## Rollback Plan

If issues arise:

1. Restore `Subjects.html` from backup
2. Clear browser cache
3. Test original functionality
4. Document issues for debugging

---

**Next Step:** Get user approval before proceeding with implementation.
