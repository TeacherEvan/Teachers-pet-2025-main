/**
 * K1 December Curriculum Data
 * Teachers Pet - Kindergarten 1 December 2025 (2nd Semester)
 * 
 * This file contains all subjects, activities, and vocabulary for K1 December curriculum.
 * Used by Subjects.html to dynamically generate subject selection interface.
 */

// Initialize global curriculum data structure
window.CurriculumData = window.CurriculumData || {};
window.CurriculumData.K1 = window.CurriculumData.K1 || {};

window.CurriculumData.K1.December = {
    grade: 'K1',
    month: 'December',
    subjects: [
        {
            id: 'english',
            name: 'English',
            topics: [
                { id: 'english_trace_letters', name: 'Trace the letters following the dotted line and color the letters' },
                { id: 'english_match_letter_picture', name: 'Draw lines from the letter to the picture starting from the dot' },
                { id: 'english_match_same_letter', name: 'Draw lines to match the same letter' },
                { id: 'english_match_correct_picture', name: 'Draw lines to match the letter with the correct picture' }
            ],
            vocabulary: 'A-Ant, B-Bee, C-Cat, D-Dog, E-Egg, F-Fan, H-Hen, I-Ice Cream, O-Ox, T-Tea'
        },
        {
            id: 'mathematics',
            name: 'Mathematics',
            topics: [
                { id: 'math_write_numbers', name: 'Write numbers 1-6 following the lines and write freehand in the box' },
                { id: 'math_draw_circles', name: 'Draw the correct amount of circles in the box next to the numbers' },
                { id: 'math_trace_number_6', name: 'Trace number 6 following the dotted line and colour' },
                { id: 'math_write_numbers_freehand', name: 'Write numbers 1-7 following the lines and write freehand in the box' },
                { id: 'math_draw_circles_next', name: 'Draw the correct amount of circles in the box next to the number' },
                { id: 'math_color_correct_amount', name: 'Color the correct amount of pictures and cut the pictures and paste them in the boxes' }
            ],
            vocabulary: 'One – ten'
        },
        {
            id: 'iq',
            name: 'I.Q',
            topics: [
                { id: 'iq_object_animal', name: 'Object and Animal - Circle the animals' },
                { id: 'iq_direction_above', name: 'Direction (Above) - Cross the objects that are above' },
                { id: 'iq_same_group', name: 'Objects in the same group - Draw lines to match objects that are further' },
                { id: 'iq_mark_objects', name: 'Mark X to objects that are further' },
                { id: 'iq_match_size', name: 'Draw lines to match suitable size objects' },
                { id: 'iq_front_back', name: 'Direction: Front and back - Circle the pictures that face the front - Cross the pictures that face the back' },
                { id: 'iq_animal_wings', name: 'Animal (Wings) - Circle the animals that have wings' },
                { id: 'iq_incomplete', name: 'Incomplete – Mark the incomplete objects with X' }
            ],
            vocabulary: 'Car, giraffe, girl, cat, telephone, alarm clock, vase/flower, toothbrush/toothpaste, pot/stove, bird, duck, hen, owl, lion, turtle, dog, book, boat, small girl, small dress, big girl, big dress, pencil, van, frog, rice cooker, swing, briefcase'
        },
        {
            id: 'social_studies',
            name: 'Social Studies',
            topics: [
                { id: 'social_environment', name: 'Kindness to the Environment- Discuss what is the environment and taking care of it' },
                { id: 'social_trees', name: 'Benefits of Trees – Explaining the effects of cutting down trees and destroying the forest' },
                { id: 'social_insects', name: 'Insects -Mark the insects with X' },
                { id: 'social_sea_animals', name: 'Sea Animals –Circle the animals that live in the ocean' }
            ],
            vocabulary: 'environment, water, plants, feed, animals, throw, rubbish, tree, forest, deforestation, leaves, trunk, fruits, insects, ant, butterfly, mosquito, ladybug, dragonfly, grasshopper, fish, sea, shark, starfish, dolphin, whale, mussel, ocean'
        },
        {
            id: 'phonics',
            name: 'Phonics',
            topics: [
                { id: 'phonics_letter_r', name: 'Letter R' },
                { id: 'phonics_letter_s', name: 'Letter S' },
                { id: 'phonics_rev', name: 'Rev Q/R/S' },
                { id: 'phonics_letter_t', name: 'Letter T' },
                { id: 'phonics_letter_u', name: 'Letter U' }
            ],
            vocabulary: 'Ricky rabbit, read, Susie seal, sun, quiet, on, tiger, uncle, Teddy tiger, teeth, Uncle utter, under'
        },
        {
            id: 'science',
            name: 'Science',
            topics: [
                { id: 'science_mixing_colours', name: 'Mixing colours' },
                { id: 'science_bottle_diver', name: 'Bottle diver experiment' },
                { id: 'science_air_pressure', name: 'Air pressure' },
                { id: 'science_air_rocket', name: 'Air rocket' }
            ],
            vocabulary: 'Water, colour, mix, bowl, bottle, water, paper, paper-clip, food colouring, candle, air, sound, table, pencil, air rocket, stepping hard, press/push, fly up'
        },
        {
            id: 'conversation1',
            name: 'Conversation 1',
            topics: [
                { id: 'conv1_colours', name: 'Colours Question- What colour is the banana/tree?' },
                { id: 'conv1_family', name: 'Answer- The ... is yellow/green. Family Members Question- Who do you love?' },
                { id: 'conv1_abilities', name: 'Answer- I love my father and mother. Abilities Question- What can you do?' },
                { id: 'conv1_playground', name: 'Answer- I can sing/dance. Playground Equipment Question- Where do you like playing?' },
                { id: 'conv1_answer_seesaw', name: 'Answer- I like playing on the seesaw/slide' }
            ],
            vocabulary: 'Green, yellow, red, blue, mother, father, sing, dance, seesaw, slide'
        },
        {
            id: 'conversation3',
            name: 'Conversation 3',
            topics: [
                { id: 'conv3_food_actions', name: 'Food: Actions -What are you doing? I am walking' },
                { id: 'conv3_weather', name: 'Weather- How's the weather? It's sunny' }
            ],
            vocabulary: 'walking, running, jumping, sitting, sunny, rainy, cloudy'
        },
        {
            id: 'arts',
            name: 'Arts',
            topics: [
                { id: 'arts_butterfly_painting', name: 'Butterfly squish painting' },
                { id: 'arts_sponge_tree', name: 'Sponge painting tree design' },
                { id: 'arts_new_year_card', name: 'new year card making' },
                { id: 'arts_origami_house', name: 'origami - house' }
            ],
            vocabulary: 'fold, paper, squish, paint, butterfly, flower, sponge, stem, new year, January, card, house, window, roof'
        },
        {
            id: 'physical_education',
            name: 'Physical Education',
            topics: [
                { id: 'pe_hopscotch', name: 'Hopscotch' },
                { id: 'pe_picking_up', name: 'Picking Up' },
                { id: 'pe_ball_race', name: 'Matching & Dropping Ball Race Jumping' },
                { id: 'pe_dart_ball', name: 'Dart Ball Game' },
                { id: 'pe_cart_racing', name: 'Cart Racing' }
            ],
            vocabulary: 'Hop, number, match, ball, chair, colour, dart board, throw, cart, push, race'
        },
        {
            id: 'puppet_show',
            name: 'Puppet Show',
            topics: [
                { id: 'puppet_ants_grasshopper', name: 'The Ants and the Grasshopper' },
                { id: 'puppet_lion_mouse', name: 'Lion and the Mouse' }
            ],
            vocabulary: 'ant, grasshopper, hungry, winter, food, lion, mouse, forest, net'
        }
    ]
};

// Log successful load
console.log('✅ K1 December curriculum loaded:', window.CurriculumData.K1.December.subjects.length, 'subjects');
