// Sorts an entry into a theme from its English definition.
//
// Each category lists English words and short phrases in their singular
// form. A definition is matched one meaning at a time ("sound; speech;
// voice"), trying the whole meaning first, then its head noun (the last
// word: "cooking pot", "bus station"), then its first word. Plurals are
// found by trying singular forms against the lists, so "trees", "flies",
// "leaves" and "teeth" all match without being listed.
//
// A word belongs to exactly one category (a test checks this), so the
// order of the lists below does not matter.

const CATEGORY_WORDS: Record<string, string> = {
    Colors: `color, colour, red, blue, green, yellow, white, black, brown, grey, gray, orange, pink,
        purple, turquoise, violet, mauve`,

    Numbers: `zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen,
        fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, thirty, forty, fifty, sixty,
        seventy, eighty, ninety, hundred, thousand, million, billion, number, half, quarter, double,
        twice, once, third, plus, minus, equals, times, divided by, multiplied by, multiplication,
        division, counting, pair, dozen, kilogram, meter, unit, average, majority`,

    Body: `body, head, hair, face, forehead, eyebrow, eyelash, eye, iris, ear, nose, mouth, lip, tongue,
        tooth, molar, gum, cheek, chin, jaw, beard, mustache, moustache, neck, throat, shoulder, arm,
        forearm, elbow, wrist, hand, palm, finger, thumb, fingernail, nail, fist, chest, breast, nipple,
        belly, stomach, navel, waist, hip, back, spine, buttock, bottom, anus, leg, thigh, knee, shin,
        ankle, heel, foot, toe, toenail, skin, bone, muscle, blood, blood vessel, vein, heart, lung, liver,
        kidney, brain, intestine, entrails, bladder, gall bladder, bile, uterus, womb, placenta,
        umbilical cord, penis, childs penis, vagina, vulva, semen, sweat, tear, urine, poop, fart, snot,
        saliva, armpit, flesh, lymph node, appendix, fibula, handspan, burp, hiccup, sneeze, snore,
        breath, respiration, braid, belly button, joint, pupil, temple, bangs, sole of the foot,
        mole, footprint`,

    Health: `health, healthy, sick, sickness, illness, disease, pain, something that hurts, headache,
        migraine, fever, cough, whooping cough, allergy, alergy, infection, wound, injury, burn, scar,
        scab, blister, abscess, abrasion, swelling, itch, wart, callous, cramps, colic, diarrhea, nausea,
        vomit, dizziness, vertigo, fatigue, epilepsy, leprosy, measles, jaundice, goiter, cataract,
        glaucoma, glacoma, tinea, tibea, depression, hemorrhage, hemorrage, pus, phlegm, parasite, germ,
        medicine, medical treatment, treatment, pill, birth control pill, injection, shot, vaccination,
        syringe, bandage, bandaid, gauze, splint, iodine, ointment, suppository, thermometer, surgery,
        doctor, nurse, pharmacy, hospital, clinic, iv, iud, condom, abortion, pregnancy, pregnant,
        birth, difficult labor, traditional birth attendant, disabled, blind, deaf, mute, lame,
        harelip, lung illness, poisoning, poison, dandruff, mask of pregnancy, circumcision, drug,
        cocaine, heroin, masturbation`,

    Animals: `animal, livestock, herd, bear, bird, cat, dog, puppy, horse, mare, foal, mule, donkey, camel,
        cow, bull, calf, ox, sheep, ewe, ram, lamb, goat, pig, wild boar, boar, chicken, hen, rooster,
        chick, turkey, turkies, pigeon, dove, partridge, stork, raven, crow, vulture, eagle, falcon,
        hawk, owl, hoopoe, hummingbird, nightingale, sparrow, fish, lion, tiger, panther, leopard, wolf,
        fox, hyena, jackal, gazelle, monkey, barbary macaque, elephant, giraffe, rabbit, hare,
        common hare, hedgehog, porcupine, squirrel, gopher, mouse, rat, bat, otter, dolphin, snake,
        lizard, chameleon, turtle, tortoise, frog, toad, alligator, aligator, crocodile, snail, worm,
        insect, bug, ant, bee, wasp, fly, mosquito, flea, louse, bedbug, beetle, scarab beetle,
        cockroach, cricket, grasshopper, locust, butterfly, moth, spider, scorpion, centipede,
        potato bug, cobweb, nest, tail, claw, beak, horn, hoof, wing, feather, talon, quill,
        sacrificial animal, divided slaughtered animal, animal skin, sheepskin, zoo`,

    Food: `food, meal, breakfast, lunch, dinner, supper, afternoon snack, snack, bread, baguette, baghette,
        flour, dough, yeast, baking powder, pancake, pastry, cake, cookie, doughnut, couscous,
        couscous with cinnamon, tajine, soup, porridge, loaf, pasta, noodle, vermicelli, rice, sauce, salad,
        meat, beef, brochette, egg, yolk, milk, buttermilk, butter, cheese, yogurt, cream, oil, olive,
        salt, sugar, honey, jelly, jam, candy, chocolate, lollipop, popcorn, tea, coffee,
        coffee grounds, juice, soda, drink, drinking, wine, water, fruit, apple, apricot, banana,
        cherry, fig, grape, raisin, lemon, mulberry, nectarine, peach, pear, pineapple, pomegranate,
        prickly pear, quince, strawberry, melon, watermelon, almond, walnut, peanut, vegetable, bean,
        chick pea, pea, lentil, carrot, cauliflower, cucumber, eggplant, garlic, onion, potato,
        pumpkin, squash, tomato, turnip, turnip's leaves, beet, pepper, paprika, cumin, cinnamon,
        clove, curry, ginger, saffron, turmeric, basil, cilantro, coriander, parsley, mint, peppermint,
        oregano, rosemary, herb, spice, vinegar, caper, mushroom, french fries, recipe, menu,
        delicious, cooking, cooked, taste, provisions, peelings, hunger, thirst, famine`,

    Family: `family, father, mother, parent, grandparent, grandfather, grandmother, brother, sister,
        sibling, son, daughter, child, children, baby, boy, girl, little girl, twin, husband, wife,
        uncle, aunt, cousin, nephew, niece, relative, bride, groom, fiance, fiancee, marriage,
        divorce, divorced, bachelor, virgin, orphan, widow, adoption, man, woman, male, female, youth,
        relationship, brother-in-law, sister-in-law, son-in-law, daughter-in-law, mother-in-law,
        father-in-law`,

    People: `person, people, peoples, friend, enemy, neighbor, guest, foreigner, tourist, stranger,
        nomad, beggar, slave, liar, thief, theif, flatterer, troublemaker, joker, comedian, artist,
        author, poet, singer, journalist, barber, blacksmith, butcher, carpenter, craftsperson, driver,
        driver assistant, gardener, guard, inspector, merchant, shop keeper, shopkeeper, secretary,
        treasurer, waiter, welder, worker, proprietor, owner, director, boss, prostitute, smuggler,
        mediator, witness, representative, spectators, mister, miss, name, boogieman, boogiewoman,
        intellectual`,

    Nature: `nature, environment, earth, land, ground, gound, soil, dirt, mud, dust, sand, rock, stone,
        mountain, hill, valley, cliff, cave, ravine, gully, desert, oasis, forest, tree, shrub, bush,
        plant, leaf, flower, grass, root, branch, thorn, cactus, cedar, juniper, poplar, bamboo, vine,
        river, stream, spring, waterfall, lake, sea, ocean, island, isle, coast, beach, swamp, well,
        sky, star, sun, moon, planet, milky way, world, earthquake, flood, erosion, fire, smoke, ash,
        soot, spark, flame, air, shadow, shade, light, darkness, mineral, mold, sunlight, liquid, steam, bark,
        rose, palm tree`,

    Weather: `weather, climate, rain, snow, hail, wind, breeze, cloud, cloudy, storm, lightning, thunder,
        ice, frost, fog, mist, heat, cold, hot, warm, temperature, drought, dust devil, rainbow, haze`,

    Time: `time, hour, minute, day, night, morning, afternoon, evening, noon, midnight, dawn, sunrise,
        sunset, today, tomorrow, yesterday, week, weekend, month, year, season, summer, winter,
        autumn, monday, tuesday, wednesday, thursday, friday, saturday, sunday, january, february,
        march, april, may, june, july, august, september, october, november, december, now,
        just now, later, soon, early, late, ago, a while ago, always, never, sometimes, usually,
        rarely, often, already, not yet, no longer, future, past, beginning, end, at the end,
        calendar, calandar, schedule, appointment, birthday, holiday, clock, watch, age, life,
        retirement, occasion`,

    Places: `place, house, home, room, road, street, path, bridge, intersection, curb, village, town,
        city, capital, country, region, province, commune, continent, africa, asia, europe,
        north america, south america, maghreb, casablanca, border, boundary, domain, market, souk,
        souk tent, shop, store, hardware store, airport, station, bus station, train station,
        police station, post office, hotel, hostel, prison, jail, court, office, bureau, park, cafe,
        restaurant, hammam, portal, east, west, north, south, direction, side, corner, center, somewhere,
        distance, address, building, construction, wall, tent, pool, bank`,

    Household: `bed, mattress, pillow, blanket, sheet, cover, covers, carpet, rug, mat, sofa, chair,
        table, seat, shelf, cupboard, drawer, dresser, mirror, curtain, window, door, gate, doorstep,
        entryway, hallway, stairs, steps, ladder, ceiling, floor, roof, roofing, roof is leaking,
        skylight, chimney, fireplace, courtyard, kitchen, toilet, toilet paper, sink, faucet, drain,
        drain pipe, pipe, hose, cistern, basin, bucket, bowl, plate, dish, dishes, cup, mug, glass,
        bottle, jar, jug, pitcher, kettle, teapot, coffee pot, pot, cooking pot, pan, frying pan,
        saucepan, pressure cooker, couscous pot, couscouserie, double boiler, tajine dish,
        melting pot, ladle, spoon, fork, knife, utensils, sieve, strainer, filter, funnel, mortar,
        pestle, mortar and pestle, rolling pin, cookie cutter, garlic press, blender, beater, grill,
        ironwork grill, skewer, brochette racks, brochette sticks, oven, stove, refrigerator, heater,
        charcoal heater, brazier, fan, air conditioner, lamp, light bulb, bulb, light switch,
        electric outlet, socket, electric cord, electricity, battery, solar panel, flashlight,
        candle, matches, lighter, firestarter, kindling, charcoal, coals, metal stick for coals,
        log, soap, shampoo, toothbrush, toothpaste, toothpick, towel, comb, brush, scrub-brush,
        broom, sponge, squeegee, bleach, washboard, washing, clothespins, trash, box, crate,
        wooden box, tin box, metal box, basket, bag, plastic bag, sack, suitcase, key, lock, lid,
        tissues, perfume, lotion, pomade, razor, scissors, safety pin, thumbtack, tape, glue,
        umbrella, television, radio, tape recorder, computer, screen, phone, telephone, ashtray,
        incense, conditioner, bell, stamp, mousetrap, sugar container, meshy bulb for buta lamp, counter, stand for churn,
        tweezers, mail, postal mail, envelope, package`,

    'Tools & Materials': `tool, equipment, hammer, sledge hammer, saw, screwdriver, pliers, wrench,
        bolt, drill, ax, axe, pick-axe, shovel, winch, pulley system, jack, pump, gasket, chain, rope,
        string, cord, twine, wire, magnet, cement, brick, cinder block, plaster, metal, sheet metal,
        a useless piece of metal, steel, iron, copper, bronze, gold, silver, wood, plastic, leather,
        suede, material, rust, sawdust, gasoline, dynamite, paint, paint brush, stick, pole, stake,
        beams, board, trap, scale, file, sandpaper, arrow`,

    Clothing: `clothes, clothing, garment, outfit, dress, housedress, djellaba, jellaba, robe, cape, coat,
        jacket, pullover, sweater, shirt, t-shirt, pants, trousers, skirt, underwear, panties, bra,
        sock, shoe, boot, sandal, slipper, sneaker, tennis shoes, hat, cap, hood, turban, scarf,
        shawl, veil, headdress, belt, glove, button, zipper, pocket, seam, sleeve, handkerchief,
        ring, earring, necklace, bracelet, anklet, bead, sequins, make-up, fabric, fabric scraps,
        cloth, wool, silk, cotton, embroidery, sewing, weaving, loom, warp threads, crochet, needle,
        thread, spool, ribbon, scarf clip, shawl clip, clip for scarf or shawl, wallet, purse, eyeglasses,
        glasses, opening in front of shirt, strap, stripe`,

    Farming: `agriculture, farm, farmer, field, crop, crops, harvest, threshing, threshing area, plow,
        plowing, tilling, planting, irrigation, irrigation ditch, ditch, seed, grain, ground grains,
        wheat, barley, oats, corn, maize, corn stalks, husk, alfalfa, hay, straw, chaff, bran, mill,
        barn, pasture, graze, trough, manure, manure heap, dung, fertilizer, animal pen, cow pen,
        sheep pen, shepherd, shephard, orchard, garden, hoe, rake, pitchfork, scythe, sickle,
        beehive, churn, sowing, livestock pen, fence`,

    Transport: `car, bus, train, taxi, truck, bicycle, bike, scooter, motorcycle, airplane, plane, boat,
        ship, vehicle, tire, tire tube, wheel, pedal, windshield, transportation,
        cost of transportation, travel, traveling, travels, trip, excursion, rocket, wheelbarrow,
        wheelbarrel, saddle, saddle blanket, bridle, police car, yield the way, start of motor,
        ticket, passport, carte de sejour`,

    Religion: `religion, god, allah, prayer, call to prayer, prayer beads, prayer rug, mosque, minaret,
        church, islam, muslim, christian, christianity, jew, judaism, bible, torah, quran, koran,
        angel, devil, devilish, heaven, hell, paradise, sin, faith, faithfulness, soul, pope,
        priestess, charity, fasting, ramadan, pilgrimage, sacrifice, curse, blessing, grave,
        gravestone, tomb, shroud, corpse, cemetery, cemetary, graveyard, amulet, god knows, imam`,

    Society: `society, government, state, president, vice president, minister, mayor, parliament,
        election, ballot, vote, democracy, constitution, law, trial, judge, lawyer, police,
        police inspector, authorities, military, military guys, military men, army, soldier, war,
        peace, defense, weapon, gun, rifle, musket, canon, bullet, bomb, bomb powder, terrorism,
        terrorist, extremist, crime, theft, smuggling, corruption, bribe, execution, killing,
        rights, human rights, freedom, citizen, nationality, population, census, immigration,
        immigrants, ambassador, kingdom, republic, republicans, king, queen, reign, flag,
        association, organization, co-operative, cooperation, community group, consensus, meeting,
        meeting of leaders, agreement, racism, harassment, sexual harrassment, registration,
        birth certificate, summons, testimony, development, developing nations,
        technical assistance, sustainability, sanitation, pollution, responsibility, assembly,
        confrontation, fight, danger, security, safety, penalty`,

    'Work & Money': `work, job, task, tasks, salary, money, coin, bill, price, cost, tax, loan, profit,
        loss, investment, money order, receipt, purchase, shopping, auction, merchandise, products,
        business card, company, enterprise, industry, factory, marketing, advertisement, accounting,
        insurance, rent, project, program, plan, benefit, demand, supplies, debt, poor, rich, wealth,
        objectives, goal`,

    Education: `school, university, student, teacher, teaching, lesson, exam, test, education, book,
        notebook, page, paper, pen, pencil, eraser, chalk, blackboard, dictionary, alphabet, letter,
        word, sentence, paragraph, grammar, verb, construct state, translation, language,
        pronunciation, pronounciation, accent, expression, writing, reading, science, mathematics,
        mathamatics, map, chart, graph, file folder, folder, title, subject, question, information,
        idea, training, instructions, microscope, binoculars, journal, news, report, line, circle,
        cirlce, square, triangle, rectangle, rhombus, cone, curve, thing with string&chalk, speech,
        conversation, explanation, experience, knowledge`,

    Culture: `culture, tradition, traditions, ceremony, baby naming ceremony, wedding, wedding song,
        party, celebration, dance, music, song, lyrics, drum, flute, poem, story, art, theater,
        game, game like chess, lotto-like game, dice, cards, ball, balloon, toy, sport, sports,
        soccer, goal keeper, competition, wrestling, exercise, running, hobby, hobbies, camping, fun,
        joke, joking around, jokingly, gift, invitation, tattoo, henna, berber, amazigh, tamazight,
        moroccan, parade, photo, photograph, penalty card, merit badges, pinwheel, slingshot, prize,
        reward, ensemble, design`,

    Feelings: `feeling, feelings, emotion, love, hate, fear, anger, joy, happiness, sadness, jealousy,
        greed, shame, regret, doubt, hope, wish, longing, homesickness, patience, respect, trust,
        pride, bravery, courage, dignity, thought, dream, worry, boredom, loneliness, craziness,
        folly, naughtiness, jocularity, laughter, sigh, unmet expectation, selfish, optimistic,
        optomistic, pessimistic, beauty, luck, flirting, gossip, good behavior, opinion, covet`,

    Greetings: `hello, welcome, goodbye, good bye, goodnight, good morning, good evening, thank you,
        thanks to god, excuse me, congratulations, condolences, you're welcome, please, sorry`,

    Expressions: `i love you, no problem, be careful, carefull, watch out, come here, don't touch me,
        fuck off, i think so, its none of my business, its none of your business, here it is,
        that's all, thats the way, thats why, what else, why not, poor thing, poor things,
        something is wrong, things are good, can't stand you, i wonder, i will never do that,
        they dont trust each other, probably not, not possible, of course, god willing, enough`,

    Pronouns: `i, me, my, mine, you, your, yours, he, him, his, she, her, hers, it, its, we, us, our,
        ours, they, them, their, theirs, self, oneself, myself, yourself, by yourself, themselves,
        by themselves, this, that, these, those, someone, something, something good, nobody,
        nothing, everyone, everybody, everything, whoever, others, another, all of them, each other, thou, thee, ye`,

    'Grammar Words': `and, or, but, nor, either, neither nor, between and, if, if only, unless,
        because, although, so, so that, therefore, than, like, like that, as, also, even, only,
        just, very, too, more, most, less, -less, - less, much, a lot, many, all, every, some, both, whole,
        almost, approximately, exactly, definitely, probably, maybe, yes, no, not, do not, what, who,
        whom, which, where, where from, when, why, how, how much, by what, what with, in, on, at, of,
        to, from, with, without, without it, by, for, about, above, below, under, over, behind,
        in front of, front, between, among, across from, inside, outside, near, close to, far, up,
        down, upon, against, except, since, until, till, before, after, then, again, here, there,
        over here, over there, quickly, slowly, gently, forcefully, together, alone, by means of,
        by necessity, in order, in order to, in the middle, on the side, opposite, the same as,
        for example, can, must, should, faithfully, sincerely, contains, few, little, next, last,
        first, other, same, such, still, yet, anyway, instead, around, through, each`,

    Adjectives: `big, small, large, old, new, young, long, short, tall, wide, narrow, round, straight,
        wet, dry, moist, smooth, rough, hard, soft, heavy, good, bad, beautiful, pretty, ugly, clean,
        dirty, easy, difficult, fast, slow, strong, weak, full, empty, sweet, sour, bitter, rotten,
        fresh, sticky, naked, bald, barefoot, crazy, honest, innocent, lazy, hospitable, fat, thin,
        dark, true, wrong, right, left, fake, free, normal, odd, special, similar, important,
        necessary, interesting, available, appropriate, reasonable, favorite, priceless, worthless,
        offensive, neglected, ready, asleep, complex, national, independent, different, blond, brave,
        quiet, loud, deep, high, low, open, closed, cheap, expensive, sad, happy, angry,
        tired, hungry, thirsty, alive, dead, funny, kind, polite, rude, proud, jealous,
        fine, spare`,
};

// Irregular plurals and other forms worth folding by hand
const IRREGULAR: Record<string, string> = {
    men: 'man', women: 'woman', teeth: 'tooth', feet: 'foot', mice: 'mouse', geese: 'goose',
    lice: 'louse', oxen: 'ox', people: 'people', turkies: 'turkey', knives: 'knife',
};

const LEXICON = new Map<string, string>();
for (const [category, list] of Object.entries(CATEGORY_WORDS)) {
    for (const raw of list.split(',')) {
        const word = raw.trim().replace(/\s+/g, ' ');
        if (word && !LEXICON.has(word)) LEXICON.set(word, category);
    }
}

/** Every listed word, with each category it is listed under (for tests). */
export const lexiconEntries = (): [string, string][] =>
    Object.entries(CATEGORY_WORDS).flatMap(([category, list]) =>
        list.split(',').map(w => w.trim().replace(/\s+/g, ' ')).filter(Boolean).map(w => [w, category] as [string, string]));

/** Singular spellings to try for a word, most likely first. */
const singulars = (word: string): string[] => {
    const forms = [word];
    if (IRREGULAR[word]) forms.push(IRREGULAR[word]);
    if (word.endsWith('ies')) forms.push(`${word.slice(0, -3)}y`);
    if (word.endsWith('ves')) forms.push(`${word.slice(0, -3)}f`, `${word.slice(0, -3)}fe`);
    if (word.endsWith('es') && word.length > 3) forms.push(word.slice(0, -2));
    // "is" is not the plural of "i", nor "us" of "u"
    if (word.endsWith('s') && word.length > 3) forms.push(word.slice(0, -1));
    return forms;
};

/** Looks up a phrase, trying singular forms of its last word. */
const lookup = (words: string[]): string | undefined => {
    if (!words.length) return undefined;
    const head = words.slice(0, -1).join(' ');
    for (const last of singulars(words[words.length - 1])) {
        const hit = LEXICON.get(head ? `${head} ${last}` : last);
        if (hit) return hit;
    }
    return undefined;
};

const PREPOSITIONS = new Set(['of', 'for', 'in', 'on', 'with', 'from', 'to', 'at', 'that', 'which', 'like']);
const LITTLE_WORDS = new Set(['Grammar Words', 'Pronouns']);

/** The words inside brackets: "pupil (of eye)", "dates (fruit)" */
const bracketWords = (definition: string): string[] =>
    [...definition.toLowerCase().matchAll(/\(([^)]*)\)?/g)].flatMap(m => m[1].split(/[^a-z'-]+/)).filter(Boolean);

/** Lowercased meanings, without notes in brackets, the loan mark or quotes. */
const meaningsOf = (definition: string): string[] =>
    definition
        .toLowerCase()
        .replace(/\*/g, '')
        .replace(/[’‘]/g, "'")
        .replace(/\([^)]*\)?/g, ' ')
        .replace(/["“”!?.…:]/g, ' ')
        .split(/[;,/]/)
        .map(m => m.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

export const categorizeWord = (definition: string): string => {
    const trimmed = definition.trim().toLowerCase();
    if (trimmed.startsWith('to ')) return 'Verbs';
    const meanings = meaningsOf(definition);
    // Bare numerals ("10", "24th"): the PDF's numbers list stores them this way
    if (meanings[0] && /^\d+(st|nd|rd|th)?$/.test(meanings[0])) return 'Numbers';

    // The PDF often puts the qualifier after a comma: "pen, animal" is an
    // animal pen, not a writing pen
    if (meanings.length === 2) {
        const flipped = lookup(`${meanings[1]} ${meanings[0]}`.split(' '));
        if (flipped) return flipped;
    }

    for (const meaning of meanings) {
        const words = meaning.split(' ');
        // The noun phrase ends where a preposition starts: "bottom of",
        // "pot for couscous", "line in a paper"
        const cut = words.findIndex((w, i) => i > 0 && PREPOSITIONS.has(w));
        const core = cut > 0 ? words.slice(0, cut) : words;
        const whole = lookup(words);
        if (whole) return whole;
        // Only part of the meaning matched. A little word in a longer
        // meaning ("my house", "all the money") says nothing about its theme
        const part = lookup(core) ?? lookup(core.slice(-1)) ?? lookup(core.slice(0, 1));
        if (part && !LITTLE_WORDS.has(part)) return part;
    }
    // Last resort: any word of the first meaning ("corn on the cob")
    for (const word of meanings[0]?.split(' ') ?? []) {
        const hit = lookup([word]);
        if (hit && !LITTLE_WORDS.has(hit)) return hit;
    }
    // Then the note in brackets, which often names the theme outright
    for (const word of bracketWords(definition)) {
        const hit = lookup([word]);
        if (hit && !LITTLE_WORDS.has(hit)) return hit;
    }
    return 'General';
};
