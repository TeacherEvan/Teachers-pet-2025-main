/**
 * K2 December Curriculum Data
 * Teachers Pet - Kindergarten 2 December 2025 (2nd Semester)
 * 
 * This file contains all subjects, activities, and vocabulary for K2 December curriculum.
 * NOTE: K2 December has 11 subjects (different from November's 10):
 * - Includes Cooking (NOT in November)
 * - Has updated topics for several subjects
 * 
 * Used by Subjects.html to dynamically generate subject selection interface.
 */

// Initialize global curriculum data structure
window.CurriculumData = window.CurriculumData || {};
window.CurriculumData.K2 = window.CurriculumData.K2 || {};

window.CurriculumData.K2.December = {
  grade: 'K2',
  month: 'December',
  subjects: [
    {
      id: 'mathematics',
      name: 'Mathematics',
      topics: [
        { id: 'math_counting_1_20', name: 'Counting from 1-20' },
        { id: 'math_counting_1_30', name: 'Counting from 1-30' },
        { id: 'math_counting_1_50', name: 'Counting from 1-50' },
        { id: 'math_subtraction_addition', name: 'Concepts of Subtraction and Addition' },
        { id: 'math_tracing_writing', name: 'Tracing and freehand writing numbers 1-20' }
      ],
      vocabulary: 'count, numbers, subtract, take away, less, write, minus, equals, addition, add, more, plus sign, minus sign, equals sign'
    },
    {
      id: 'iq',
      name: 'I.Q',
      topics: [
        { id: 'iq_wet_dry', name: 'Wet and Dry objects' },
        { id: 'iq_underneath', name: 'The preposition Underneath' },
        { id: 'iq_emotions', name: 'Recognizing Emotions (Happy or Sad)' },
        { id: 'iq_loud_quiet', name: 'Distinguishing between Loud and Quiet noises' },
        { id: 'iq_inside_outside', name: 'Understanding the spatial relationship of Inside and Outside' },
        { id: 'iq_hot_cold', name: 'Concepts of Hot and Cold' },
        { id: 'iq_appropriate_actions', name: 'Identifying Appropriate Actions' },
        { id: 'iq_size_sequencing', name: 'Size Sequencing from smallest to biggest' }
      ],
      vocabulary: 'wet, dry, underneath, happy, sad, loud, quiet, inside, outside, hot, cold, small, smaller, smallest, big, bigger, biggest'
    },
    {
      id: 'social_studies',
      name: 'Social Studies',
      topics: [
        { id: 'social_community_helpers', name: 'Community helpers, traffic rules, and road signs' },
        { id: 'social_planet_earth', name: 'What makes up our planet earth and what those materials are used for' },
        { id: 'social_new_year', name: 'New Year\'s Day and Thai New Year (Songkran)' },
        { id: 'social_food_pyramid', name: 'Food pyramid and healthy eating' }
      ],
      vocabulary: 'community, helper, road sign, safety, police, doctor, teacher, rule, follow, help, home, school, soil, stone, sand, glass bottle, building, charcoal, New Year\'s Day, Songkran Day, presents/gift, monk, protein, carbohydrates/grains, fats, fruits, vegetables'
    },
    {
      id: 'english',
      name: 'English',
      topics: [
        { id: 'english_lowercase_intro', name: 'Introduce and discuss lowercase letters m,n,o,p,q,r,s,t,u,v,w,x,y,z' },
        { id: 'english_match_pictures', name: 'Draw lines to match letters with pictures' },
        { id: 'english_trace_write', name: 'Trace and write letters' },
        { id: 'english_circle_correct', name: 'Circle correct letter' },
        { id: 'english_vocabulary_practice', name: 'Practice identifying and saying vocabulary words that begin with each letter' },
        { id: 'english_lowercase_uppercase', name: 'Matching lowercase letters to their uppercase counterparts' }
      ],
      vocabulary: 'mat, net, ox, pen, queen, rainbow, sun, top, umbrella, van, whale, x-ray, yacht, zipper'
    },
    {
      id: 'phonics',
      name: 'Phonics',
      topics: [
        { id: 'phonics_letter_r', name: 'Letter R sound - identify initial sound, color/circle matching pictures' },
        { id: 'phonics_letter_s', name: 'Letter S sound - identify initial sound, color/circle matching pictures' },
        { id: 'phonics_letter_t', name: 'Letter T sound - identify initial sound, color/circle matching pictures' },
        { id: 'phonics_letter_u', name: 'Letter U sound - identify initial sound, color/circle matching pictures' }
      ],
      vocabulary: 'Rabbit, Read, Rain, Rose, Seal, Sand, Sun, Sea, Tiger, Tea, Teeth, Tie, Uncle, Up, Umbrella, Under'
    },
    {
      id: 'science',
      name: 'Science',
      topics: [
        { id: 'science_water_air_pressure', name: 'Water and Air Pressure Experiment - Observe difference between wet and dry objects after submerged' }
      ],
      vocabulary: 'wet, dry, float, sink, air, water, experiment, submerge'
    },
    {
      id: 'conversation1',
      name: 'Conversation 1',
      topics: [
        { id: 'conv1_color_hair_socks', name: 'What color is/are your hair/socks? -My hair is black/socks are white' },
        { id: 'conv1_who_love', name: 'Who do you love? -I love my father & mother' },
        { id: 'conv1_what_can_do', name: 'What can you do? -I can sing & dance' },
        { id: 'conv1_where_playing', name: 'Where do you like playing? -I like playing on the...' },
        { id: 'conv1_what_doing', name: 'What are you doing? -I am walking/running/jumping' }
      ],
      vocabulary: 'black, white, hair, socks, shirt, mother, father, love, sing, dance, slide, swings, trampoline, walking, running, jumping'
    },
    {
      id: 'conversation3',
      name: 'Conversation 3',
      topics: [
        { id: 'conv3_sunny_days', name: 'What do you use/wear on sunny days? -I wear sunglasses/a hat/use an umbrella' },
        { id: 'conv3_what_is_this', name: 'What is this? -It\'s a television' },
        { id: 'conv3_home_appliances', name: 'Do you have a microwave at home? -Yes, we do./No, we don\'t' }
      ],
      vocabulary: 'sunglasses, hat, umbrella, TV, microwave, toaster'
    },
    {
      id: 'arts',
      name: 'Arts',
      topics: [
        { id: 'arts_leaf_painting', name: 'Leaf painting' },
        { id: 'arts_fancy_mask', name: 'Fancy mask crafting' },
        { id: 'arts_santa_mobile', name: 'Creating a Santa Claus mobile' },
        { id: 'arts_new_year_card', name: 'New Year\'s card' },
        { id: 'arts_watercolor_squish', name: 'Water color squish painting' }
      ],
      vocabulary: 'leaf, paint, print, texture, pattern, watercolor, mask, design, face, eyes, Santa Claus, mobile, card, color pencil, fold, squish'
    },
    {
      id: 'physical_education',
      name: 'Physical Education',
      topics: [
        { id: 'pe_zigzag_ball', name: 'Zigzag running and ball handling' },
        { id: 'pe_ring_toss', name: 'Ring toss' },
        { id: 'pe_relay_race', name: 'Relay Race' },
        { id: 'pe_zigzag_arches', name: 'Zigzag running and going under the arches' },
        { id: 'pe_color_sorting', name: 'Color sorting game' }
      ],
      vocabulary: 'zigzag, run, ball, put, toss, ring, pole, towel, pass, arches, go under, chair, rubber ring, color, sort, match'
    },
    {
      id: 'puppet_show',
      name: 'Puppet Show',
      topics: [
        { id: 'puppet_weeping_tree', name: 'The Weeping Tree' },
        { id: 'puppet_sick_bear', name: 'The Sick Bear' }
      ],
      vocabulary: 'Tree, Weep, Butterfly, Flower, Bear, Rain, Sick, Play, Friends'
    },
    {
      id: 'cooking',
      name: 'Cooking',
      topics: [
        { id: 'cooking_pork_balls', name: 'Crispy Puffed Pork balls' }
      ],
      vocabulary: 'minced pork, bread, egg, carrot, onion, cooking oil, sugar, salt, ketchup'
    }
  ]
};

// Log successful load
console.log('✅ K2 December curriculum loaded:', window.CurriculumData.K2.December.subjects.length, 'subjects');
