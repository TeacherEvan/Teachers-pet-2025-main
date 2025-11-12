/**
 * K1 November Curriculum Data
 * Teachers Pet - Kindergarten 1 October-November 2025 (2nd Semester)
 * 
 * This file contains all subjects, activities, and vocabulary for K1 November curriculum.
 * Used by Subjects.html to dynamically generate subject selection interface.
 */

// Initialize global curriculum data structure
window.CurriculumData = window.CurriculumData || {};
window.CurriculumData.K1 = window.CurriculumData.K1 || {};

window.CurriculumData.K1.November = {
    grade: 'K1',
    month: 'November',
    subjects: [
        {
            id: 'english',
            name: 'English',
            topics: [
                { id: 'english_match_letters', name: 'Draw lines to match the letters' },
                { id: 'english_trace_letter', name: 'Trace the letter starting from the dot and color' },
                { id: 'english_match_same', name: 'Draw lines to match the same letters' },
                { id: 'english_phonics_nancy', name: 'Nancy Nurse (Nose)' },
                { id: 'english_phonics_oscar', name: 'Oscar Octopus (On)' },
                { id: 'english_phonics_penny', name: 'Penny Panda (pen)' },
                { id: 'english_phonics_queenie', name: 'Queenie Quick (quiet)' },
                { id: 'english_phonics_rev', name: 'Rev N/O/P' }
            ],
            vocabulary: 'A-Ant, B-Bee, C-Cat, D-Dog, E-Egg, F-Fan, H-Hen, I-Ice cream, O-Ox, Nancy Nurse, Nose, Oscar Octopus, On, Penny Panda, pen, Queenie Quick, quiet'
        },
        {
            id: 'mathematics',
            name: 'Mathematics',
            topics: [
                { id: 'math_count', name: 'Count from 1-10' },
                { id: 'math_trace_numbers', name: 'Trace numbers 1-5 following the dotted line and colouring the correct amount of pictures' },
                { id: 'math_write_numbers', name: 'Write the correct numbers in the boxes next to the number (free hand)' },
                { id: 'math_draw_circles', name: 'Draw the correct amount of circles in the box below or next to the number' },
                { id: 'math_color_amount', name: 'Color the correct amount of pictures' },
                { id: 'math_place_pictures', name: 'Place the correct amount of pictures in the boxes' },
                { id: 'math_count_cross', name: 'Count the pictures and cross out each picture' },
                { id: 'math_finger_counting', name: 'Counting from 1-10 with our fingers' },
                { id: 'math_match_numbers', name: 'Draw lines to match the correct number to the pictures' }
            ],
            vocabulary: 'One-ten'
        },
        {
            id: 'iq',
            name: 'I.Q',
            topics: [
                { id: 'iq_kitchen_objects', name: 'Objects in the kitchen' },
                { id: 'iq_water_animals', name: 'Animals that live in the water' },
                { id: 'iq_not_same_group', name: 'Not in the same group' },
                { id: 'iq_wild_pets', name: 'Wild animals and pets' },
                { id: 'iq_inside_outside', name: 'Inside and outside' },
                { id: 'iq_fruit_vegetables', name: 'Fruit and vegetables' },
                { id: 'iq_healthy_unhealthy', name: 'Healthy and Unhealthy food' },
                { id: 'iq_same_group', name: 'Same group' }
            ],
            vocabulary: 'knife, charcoal stove, wok, book, ribbon, shell, octopus, fish, duck, dolphin, crab, shrimp, bird, dog, hand soap, toothpaste, mango, bathroom, frog, flower, animal, spinach, banana, pineapple, fruit, cat, elephant, reindeer, monkey, hen, wild animals, pets, bird cage, fish bowl, dog kennel, carrot, banana, grape, onion, pepper, peas, orange, corn, bread, candy, carrot, milk, lollipop, healthy, unhealthy, paint brush, paint can, baby, baby bottle, train, train tracks, whale, monkey, mouse, ostrich, morning glory, turtle, alligator, cow, plate, bowl, rice'
        },
        {
            id: 'social_studies',
            name: 'Social Studies',
            topics: [
                { id: 'social_milk_sources', name: 'Sources of milk' },
                { id: 'social_fruits_vegetables', name: 'Fruits and vegetables' },
                { id: 'social_healthy_life', name: 'How to live a healthy life' },
                { id: 'social_healthy_teeth', name: 'Healthy teeth' },
                { id: 'social_hygiene_practices', name: 'Personal hygiene practices' }
            ],
            vocabulary: 'cow, goat, toffee, cake, ice cream, papaya, banana, rose apple, orange, onion leaves, Chinese cabbage, bokchoy, strong, clean, healthy, sleep, hands, exercise, healthy teeth, cavity, toothpaste, toothbrush, personal hygiene practices, mosquito net, cover food, throw the trash, cleanliness, wash'
        },
        {
            id: 'science',
            name: 'Science',
            topics: [
                { id: 'science_walking_water', name: 'Walking water-tissue' },
                { id: 'science_surface_tension', name: 'Surface tension' },
                { id: 'science_parachute', name: 'Parachute' },
                { id: 'science_float_sink', name: 'Float sink' }
            ],
            vocabulary: 'tissue, water, color, walking, cup, paper boat, soap, fast, slow, move, toy, parachute, fall, fast, slow, drop, up, down, float, sink, pencil, rock, apple, block, paperclip, screw, heavy/light'
        },
        {
            id: 'cooking',
            name: 'Cooking',
            topics: [
                { id: 'cooking_thai_wontons', name: 'Thai fried wontons' }
            ],
            vocabulary: 'wonton sheets, egg, minced, oil, chopped carrot, salt, seasoning sauce'
        },
        {
            id: 'conversation1',
            name: 'Conversation 1',
            topics: [
                { id: 'conv1_body_parts', name: 'Body Parts - What do you see? -I see with my eyes' },
                { id: 'conv1_senses', name: 'Senses - What do you do with your nose? -I smell with my nose' },
                { id: 'conv1_personal_info', name: 'Personal information - Where are you from? -I am from Thailand' },
                { id: 'conv1_common_actions', name: 'Common Actions - What are you doing? -I am raising my hand' },
                { id: 'conv1_favourite_place', name: 'Favourite place - Where do you like to go? -I like to go to school' }
            ],
            vocabulary: 'eyes, smell, Thailand, hand, school'
        },
        {
            id: 'conversation2',
            name: 'Conversation 2',
            topics: [
                { id: 'conv2_food', name: 'Food - What do you like to eat? -I like rice' },
                { id: 'conv2_colors', name: 'Colors - What color do you like? -I like yellow' },
                { id: 'conv2_daily_routines', name: 'Daily routines - What do you do in the morning? -I wake up, I take a shower, I go to sleep' }
            ],
            vocabulary: 'Food, yellow, purple, green, orange, wake up, take a shower, go to sleep'
        },
        {
            id: 'arts',
            name: 'Arts',
            topics: [
                { id: 'arts_ring_craft', name: 'Ring Craft - Pig\'s face' },
                { id: 'arts_banana_painting', name: 'Banana stem painting' },
                { id: 'arts_finger_painting', name: 'Finger painting - Flower' },
                { id: 'arts_paper_bag', name: 'Paper bag craft' },
                { id: 'arts_fathers_day', name: 'Father\'s Day card' }
            ],
            vocabulary: 'pig, ring, face, watercolor, paint, banana, finger, flower, paint, paper bag, string, fold, design, Father\'s Day, father, love, card'
        },
        {
            id: 'physical_education',
            name: 'Physical Education',
            topics: [
                { id: 'pe_trampoline', name: 'Trampoline jumping' },
                { id: 'pe_hurdle', name: 'Hurdle jumping' },
                { id: 'pe_balancing_game', name: 'Balancing game and putting the ball into the rubber ring' },
                { id: 'pe_jumping_shape', name: 'Jumping by shape' },
                { id: 'pe_snakes_ladders', name: 'Snakes and ladders' }
            ],
            vocabulary: 'Trampoline, jump, hurdle, over, balance, walk, ball, rubber rings, jumping, shape, dice, step, ladder, straw'
        },
        {
            id: 'puppet_show',
            name: 'Puppet Show',
            topics: [
                { id: 'puppet_hare_tortoise', name: 'The hare and the tortoise' },
                { id: 'puppet_dog_reflection', name: 'The dog and his reflection' }
            ],
            vocabulary: 'hare, tortoise, race, slow, fast, dog, reflection, water, greedy'
        }
    ]
};

// Log successful load
console.log('✅ K1 November curriculum loaded:', window.CurriculumData.K1.November.subjects.length, 'subjects');
