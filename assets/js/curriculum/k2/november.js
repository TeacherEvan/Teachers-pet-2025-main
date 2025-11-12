/**
 * K2 November Curriculum Data
 * Teachers Pet - Kindergarten 2 October-November 2025 (2nd Term)
 * 
 * This file contains all subjects, activities, and vocabulary for K2 November curriculum.
 * NOTE: K2 November has 10 subjects (different from K1's 11):
 * - Has Conversation 3 (NOT Conversation 2)
 * - Does NOT have Cooking, Super Safari, or Story Time
 * 
 * Used by Subjects.html to dynamically generate subject selection interface.
 */

// Initialize global curriculum data structure
window.CurriculumData = window.CurriculumData || {};
window.CurriculumData.K2 = window.CurriculumData.K2 || {};

window.CurriculumData.K2.November = {
    grade: 'K2',
    month: 'November',
    subjects: [
        {
            id: 'mathematics',
            name: 'Mathematics',
            topics: [
                { id: 'math_counting', name: 'Counting from 1-20' },
                { id: 'math_word_problems', name: 'Read the word problems and subtract the numbers to get an answer' },
                { id: 'math_count_subtract', name: 'Count the objects in the box and outside the box, then use subtraction to find out how many items are left' },
                { id: 'math_cross_off', name: 'Cross off the circles and count the amount that is left' }
            ],
            vocabulary: 'Subtract, left, count, how many, Minus, equals, plus, hats, bears, fish, cups, pens, glasses, cross off'
        },
        {
            id: 'iq',
            name: 'I.Q',
            topics: [
                { id: 'iq_match_shapes', name: 'Draw lines to match the shapes to a picture that uses all the shapes in 1st column' },
                { id: 'iq_biggest_smallest', name: 'Look at the 3 given pictures, and colour the one that is either the biggest or smallest' },
                { id: 'iq_same_size', name: 'Look at the given pictures and choose the pair of pictures that are the same size' },
                { id: 'iq_correct_order', name: 'Put the given pictures in the correct order' },
                { id: 'iq_match_activities', name: 'Draw lines to match the same activities' },
                { id: 'iq_longest_shortest', name: 'Colour the longest object and shortest object' },
                { id: 'iq_up_down', name: 'Put an X on things going up and a slash on things going down' },
                { id: 'iq_heaviest_lightest', name: 'Colour the heaviest and lightest object' }
            ],
            vocabulary: 'square, rectangle, triangle, circle, diamonds, penguin, kangaroo, House, big, small, colour, Kettle, Duck, Hexagon, Temple, Fans, Goose, Dolphins, Candle, watermelon, girl, Plant, Lotus, Chicken, boat, bath, Dance, Eat, read, red, blue, Truck, belt, paintbrush, Caterpillar, Slash, X, stairs, sled, turtle, walking, Lollipop, Chair, Flashlight, Ice cream, Plant, TV, House, slide, Milk, growth, order, up, down'
        },
        {
            id: 'social_studies',
            name: 'Social Studies',
            topics: [
                { id: 'social_frog_lifecycle', name: 'Life cycle of the frog' },
                { id: 'social_seasons', name: 'Different seasons around the world' },
                { id: 'social_loy_kratong', name: 'Loy Kratong Festival' },
                { id: 'social_deforestation', name: 'Effects of Deforestation' },
                { id: 'social_days_week', name: 'Days of the week' },
                { id: 'social_transportation', name: 'Transportation and Vehicles' }
            ],
            vocabulary: 'Frog, Tadpole, Froglet, Egg, Summer, Autumn, Winter, Spring, Loy Kratong, River, Klong, Banana Leaves, Banana trunk, Lotus Flowers, Rain, Flood, Deforestation, Forest, Trees, Monday-Sunday, Earth, Car, boat, plane, train'
        },
        {
            id: 'english',
            name: 'English',
            topics: [
                { id: 'english_uppercase_lowercase', name: 'Draw a line from the lower-case letter to the upper-case letter' },
                { id: 'english_trace_letter', name: 'Trace the letter' },
                { id: 'english_circle_correct', name: 'Circle the correct letter' },
                { id: 'english_write_letters', name: 'Write the letters' },
                { id: 'english_match_same', name: 'Draw lines to match the same letters' },
                { id: 'english_phonics_n', name: 'Circle the letter n and paste correct stickers with N words' },
                { id: 'english_phonics_o', name: 'Trace the dotted line to make O and circle words that start with o' },
                { id: 'english_phonics_p', name: 'Colour the parts with the letter "P" and read the word and circle the pictures that start with "P"' },
                { id: 'english_phonics_q', name: 'Trace the dotted line to make the "Q" and paste the "Q" pictures with stickers' }
            ],
            vocabulary: 'a-apple, b-bee, c-cat, d-dog, e-egg, f-fish, g-goat, h-hat, i-ink, j-jug, nurse, neck, nose, nest, octopus, orange, on, ox, panda, pear, pen, pig, quick, queen, quiet, quit'
        },
        {
            id: 'science',
            name: 'Science',
            topics: [
                { id: 'science_air_pressure', name: 'Air Pressure Experiment' }
            ],
            vocabulary: 'Candle, Plate, Plastic bottle, Plastic sheet, Tube, Fire, Air'
        },
        {
            id: 'conversation1',
            name: 'Conversation 1',
            topics: [
                { id: 'conv1_body_parts', name: 'Body Parts - Smell and Hear, Feel and see: What do you use to smell/hear/feel/see? -I use my nose/ears/hands/eyes' },
                { id: 'conv1_how_many', name: 'How many ears/eyes/hands do you have? -I have two ears/eyes/hands' },
                { id: 'conv1_one_nose', name: 'Do you have 1 nose? -Yes I do' },
                { id: 'conv1_what_do', name: 'What do you do with your hands/eyes? -I feel/see' },
                { id: 'conv1_where_from', name: 'Where are you from? -I am from Thailand' },
                { id: 'conv1_common_action', name: 'Common Action: What are you doing? -I am raising my hand. Are you raising your hand? -Yes, I am' },
                { id: 'conv1_favourite_place', name: 'Favourite Place: Where do you like to go? -I like to go to the zoo. Do you like to go to the zoo? -Yes, I do' }
            ],
            vocabulary: 'Nose, Smell, Ears, Hear, Hands, Feel, Eyes, See, Senses, Thailand, raise, hand, school, park, zoo'
        },
        {
            id: 'conversation3',
            name: 'Conversation 3',
            topics: [
                { id: 'conv3_days_week', name: 'Days of the week: What day is it today? -It is Monday. Is it Monday? -Yes, it is' },
                { id: 'conv3_weather', name: 'Weather: What is the weather like? -It\'s sunny. Is it sunny? -Yes, it is' },
                { id: 'conv3_things_wear', name: 'Things we wear: What do you wear on rainy days? -I wear a raincoat on rainy days. Do you wear a raincoat on rainy days? -Yes, I do' }
            ],
            vocabulary: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Sunny, Rainy, Cloudy, Jacket, Umbrella, Raincoat'
        },
        {
            id: 'arts',
            name: 'Arts',
            topics: [
                { id: 'arts_finger_puppet', name: 'Finger Puppet (Elephant)' },
                { id: 'arts_origami_frog', name: 'Create an origami Frog' },
                { id: 'arts_freehand_drawing', name: 'Freehand drawing' },
                { id: 'arts_hand_tracing', name: 'Hand tracing and finger printing' },
                { id: 'arts_fathers_day', name: 'Father Day card making' }
            ],
            vocabulary: 'Fold, Frog, Paper, Puppet, Finger, elephant, colour, Draw, vase, flower, stems, Paste, hand, trace, design, father, love, card, Father\'s Day'
        },
        {
            id: 'physical_education',
            name: 'Physical Education',
            topics: [
                { id: 'pe_hurdle_jumping', name: 'Hurdle Jumping' },
                { id: 'pe_cup_stacking', name: 'Racing game: cup stacking and collecting' },
                { id: 'pe_basketball', name: 'Basketball Shooting and balancing on flower steps' },
                { id: 'pe_zigzag_football', name: 'Zigzag running football game' },
                { id: 'pe_rolled_paper', name: 'Racing Game (Rolled Paper)' }
            ],
            vocabulary: 'Hurdle, Jump, over, Cup, Collect, Stack, Walk, balance, Basketball, shoot, Run, zigzag, kick, goal, Paper roll, pass'
        },
        {
            id: 'puppet_show',
            name: 'Puppet Show',
            topics: [
                { id: 'puppet_shepherd_boy', name: 'Shepherd Boy (Wolf story)' }
            ],
            vocabulary: 'Wolf, Shout, Sheep, Shepherd, Hill'
        }
    ]
};

// Log successful load
console.log('✅ K2 November curriculum loaded:', window.CurriculumData.K2.November.subjects.length, 'subjects');
