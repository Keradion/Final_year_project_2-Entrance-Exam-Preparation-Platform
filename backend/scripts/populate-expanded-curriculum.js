require('dotenv').config();

const mongoose = require('mongoose');
const {
  User,
  Subject,
  Chapter,
  Topic,
  Concept,
  Video,
  Exercise,
  Quiz,
  QuizProblem,
} = require('../src/models');

const SUBJECT_PLANS = [
  {
    subjectName: 'Mathematics',
    gradeLevel: '9',
    stream: 'Natural',
    description: 'Grade 9 Mathematics with arithmetic, algebra, geometry, graphs, and probability.',
    videoUrls: ['https://www.youtube.com/watch?v=NybHckSEQBI', 'https://www.youtube.com/watch?v=LDIiYKYvvdA'],
    chapters: [
      ['Number Systems', ['Integers and Operations', 'Fractions and Decimals', 'Factors and Multiples', 'Exponents and Roots', 'Scientific Notation']],
      ['Algebra Foundations', ['Variables and Expressions', 'Simplifying Like Terms', 'Linear Equations', 'Inequalities', 'Word Problems']],
      ['Geometry Basics', ['Angles and Lines', 'Triangles', 'Quadrilaterals', 'Area and Perimeter', 'Coordinate Geometry']],
      ['Graphs and Relations', ['Ordered Pairs', 'Linear Graphs', 'Slope Basics', 'Patterns and Sequences', 'Interpreting Graphs']],
      ['Statistics and Probability', ['Data Collection', 'Mean Median and Mode', 'Bar Graphs', 'Simple Probability', 'Comparing Data Sets']],
    ],
  },
  {
    subjectName: 'Physics',
    gradeLevel: '10',
    stream: 'Natural',
    description: 'Grade 10 Physics covering motion, forces, energy, waves, and electricity.',
    videoUrls: ['https://www.youtube.com/watch?v=ZM8ECpBuQYE', 'https://www.youtube.com/watch?v=kKKM8Y-u7ds'],
    chapters: [
      ['Motion', ['Distance and Displacement', 'Speed and Velocity', 'Acceleration', 'Motion Graphs', 'Relative Motion']],
      ['Forces', ['Types of Forces', 'Net Force', 'Newton First Law', 'Newton Second Law', 'Friction']],
      ['Work and Energy', ['Work Done', 'Kinetic Energy', 'Potential Energy', 'Conservation of Energy', 'Power']],
      ['Waves and Sound', ['Wave Properties', 'Frequency and Wavelength', 'Sound Waves', 'Echoes', 'Wave Applications']],
      ['Electricity', ['Electric Charge', 'Current and Voltage', 'Resistance', 'Simple Circuits', 'Electrical Safety']],
    ],
  },
  {
    subjectName: 'Chemistry',
    gradeLevel: '11',
    stream: 'Natural',
    description: 'Grade 11 Chemistry with atoms, bonding, reactions, stoichiometry, and solutions.',
    videoUrls: ['https://www.youtube.com/watch?v=thnDxFdkzZs', 'https://www.youtube.com/watch?v=EMDrb2LqL7E'],
    chapters: [
      ['Atomic Structure', ['Subatomic Particles', 'Atomic Number', 'Mass Number', 'Isotopes', 'Electron Arrangement']],
      ['Periodic Table', ['Groups and Periods', 'Metals and Nonmetals', 'Periodic Trends', 'Valence Electrons', 'Chemical Families']],
      ['Chemical Bonding', ['Ionic Bonding', 'Covalent Bonding', 'Metallic Bonding', 'Lewis Structures', 'Molecular Shapes']],
      ['Chemical Reactions', ['Reaction Types', 'Balancing Equations', 'Oxidation and Reduction', 'Reaction Energy', 'Reaction Rates']],
      ['Solutions', ['Solute and Solvent', 'Concentration', 'Dilution', 'Solubility', 'Acids and Bases']],
    ],
  },
  {
    subjectName: 'Biology',
    gradeLevel: '12',
    stream: 'Natural',
    description: 'Grade 12 Biology with cells, genetics, evolution, physiology, and ecology.',
    videoUrls: ['https://www.youtube.com/watch?v=URUJD5NEXC8', 'https://www.youtube.com/watch?v=ApvxVtBJxd0'],
    chapters: [
      ['Cell Biology', ['Cell Theory', 'Cell Organelles', 'Plant and Animal Cells', 'Cell Transport', 'Cell Division']],
      ['Genetics', ['DNA Structure', 'Genes and Chromosomes', 'Mendelian Inheritance', 'Punnett Squares', 'Genetic Variation']],
      ['Evolution', ['Natural Selection', 'Adaptation', 'Evidence of Evolution', 'Speciation', 'Human Evolution']],
      ['Human Physiology', ['Digestive System', 'Respiratory System', 'Circulatory System', 'Nervous System', 'Homeostasis']],
      ['Ecology', ['Ecosystems', 'Food Chains', 'Population Dynamics', 'Biogeochemical Cycles', 'Conservation Biology']],
    ],
  },
];

const normalizeTopic = (topicName) => topicName.replace(/^\d+\.\d+\s+/, '');

const getSubjectFocus = (subjectName, cleanTopic) => {
  const focusMap = {
    Mathematics: {
      purpose: `${cleanTopic} helps students reason with quantities, patterns, and relationships using clear mathematical rules.`,
      example: `For example, a ${cleanTopic.toLowerCase()} question may ask you to simplify, compare, calculate, measure, or interpret a relationship.`,
      practice: 'Write each step clearly, keep symbols organized, and check whether the final value fits the problem.',
    },
    Physics: {
      purpose: `${cleanTopic} explains how physical objects, energy, forces, waves, or electric quantities behave in real situations.`,
      example: `For example, a ${cleanTopic.toLowerCase()} question may describe an object, a measurement, a force, a circuit, or a change over time.`,
      practice: 'List the known quantities, choose the correct relationship, include units, and interpret the result physically.',
    },
    Chemistry: {
      purpose: `${cleanTopic} explains the structure, properties, and changes of matter at atomic, molecular, or solution level.`,
      example: `For example, a ${cleanTopic.toLowerCase()} question may ask about particles, bonding, reactions, concentrations, or chemical patterns.`,
      practice: 'Identify the particles or substances involved, apply the chemical rule, and connect the answer to matter and its changes.',
    },
    Biology: {
      purpose: `${cleanTopic} explains how living organisms are structured, how they function, and how life systems interact.`,
      example: `For example, a ${cleanTopic.toLowerCase()} question may ask about cells, inheritance, body systems, evolution, or ecosystems.`,
      practice: 'Connect the structure to its function, use biological terms accurately, and explain how the process supports life.',
    },
  };

  return focusMap[subjectName];
};

const getConcreteConcept = (subjectName, cleanTopic) => {
  const topic = cleanTopic.toLowerCase();

  if (subjectName === 'Chemistry') {
    if (topic.includes('subatomic')) {
      return {
        definition: 'Subatomic particles are the smaller particles that make up an atom. The three main particles are protons, neutrons, and electrons.',
        details: 'Protons have a positive charge and are found in the nucleus. Neutrons have no charge and are also found in the nucleus. Electrons have a negative charge and move around the nucleus in energy levels. The number of protons identifies the element, while electrons are important in bonding and ion formation.',
        example: 'A neutral sodium atom has 11 protons and 11 electrons. If it loses one electron, it becomes a positive sodium ion because it now has more protons than electrons.',
      };
    }
    if (topic.includes('atomic number')) {
      return {
        definition: 'Atomic number is the number of protons in the nucleus of an atom. It identifies the element.',
        details: 'Every atom of the same element has the same atomic number. Carbon always has 6 protons, oxygen always has 8 protons, and sodium always has 11 protons. In a neutral atom, the number of electrons is equal to the atomic number.',
        example: 'An atom with atomic number 17 has 17 protons. This element is chlorine. If the atom is neutral, it also has 17 electrons.',
      };
    }
    if (topic.includes('mass number') || topic.includes('isotope')) {
      return {
        definition: `${cleanTopic} describes the particles in the nucleus, especially protons and neutrons.`,
        details: 'Mass number is the total number of protons and neutrons. Isotopes are atoms of the same element with different numbers of neutrons. Isotopes have the same atomic number but different mass numbers.',
        example: 'Carbon-12 and carbon-14 both have 6 protons, but carbon-14 has more neutrons. That is why they are isotopes of carbon.',
      };
    }
    if (topic.includes('bond')) {
      return {
        definition: `${cleanTopic} explains how atoms join together to form stable substances.`,
        details: 'Atoms bond by losing, gaining, or sharing electrons. Ionic bonds form when electrons are transferred. Covalent bonds form when electrons are shared. Metallic bonding involves positive metal ions surrounded by mobile electrons.',
        example: 'Sodium chloride forms when sodium loses one electron and chlorine gains one electron. The resulting opposite charges attract each other.',
      };
    }
    if (topic.includes('reaction') || topic.includes('balancing') || topic.includes('oxidation') || topic.includes('rates')) {
      return {
        definition: `${cleanTopic} explains how substances change into new substances during chemical reactions.`,
        details: 'In a chemical reaction, atoms are rearranged. Bonds break in the reactants and new bonds form in the products. A balanced equation shows that atoms are conserved.',
        example: 'In 2H2 + O2 -> 2H2O, hydrogen and oxygen react to form water. The equation is balanced because each type of atom has the same count on both sides.',
      };
    }
    return {
      definition: `${cleanTopic} explains the behavior of matter using particles, composition, and chemical change.`,
      details: 'Chemistry connects observable properties, such as color or reaction behavior, to particles such as atoms, ions, and molecules. The structure of particles determines how substances behave.',
      example: 'A substance dissolving in water can be explained by interactions between solute particles and water molecules.',
    };
  }

  if (subjectName === 'Physics') {
    if (topic.includes('speed') || topic.includes('velocity') || topic.includes('motion') || topic.includes('displacement') || topic.includes('acceleration')) {
      return {
        definition: `${cleanTopic} describes how the position of an object changes with time.`,
        details: 'Distance measures the total path traveled, while displacement measures change in position with direction. Speed is distance per time. Velocity includes direction. Acceleration is the rate of change of velocity.',
        example: 'If a runner travels 100 meters in 20 seconds, the average speed is 5 m/s. If the runner returns to the starting point, the displacement is zero even though distance was traveled.',
      };
    }
    if (topic.includes('force') || topic.includes('friction') || topic.includes('newton')) {
      return {
        definition: `${cleanTopic} explains pushes, pulls, and changes in motion.`,
        details: 'A force can speed up, slow down, stop, or change the direction of an object. Net force is the overall force after combining all forces. If net force is zero, forces are balanced and motion does not change.',
        example: 'If a 4 kg object accelerates at 3 m/s^2, the net force is F = ma = 12 N.',
      };
    }
    if (topic.includes('energy') || topic.includes('work') || topic.includes('power')) {
      return {
        definition: `${cleanTopic} describes energy transfer and the ability to do work.`,
        details: 'Work is done when a force moves an object through a distance. Kinetic energy depends on mass and speed. Potential energy depends on position or height. Power is the rate of doing work.',
        example: 'Lifting a book increases its gravitational potential energy because work is done against gravity.',
      };
    }
    if (topic.includes('wave') || topic.includes('sound') || topic.includes('frequency')) {
      return {
        definition: `${cleanTopic} explains how energy travels through vibrations or disturbances.`,
        details: 'A wave has wavelength, frequency, amplitude, and speed. Sound is a mechanical wave that needs a medium. Higher frequency usually means higher pitch.',
        example: 'If a sound wave has a higher frequency, it is heard as a higher-pitched sound.',
      };
    }
    return {
      definition: `${cleanTopic} explains a physical relationship involving matter, energy, motion, or electricity.`,
      details: 'Physics uses measurable quantities and laws to describe natural events. The same law can explain many different examples when the correct quantities are identified.',
      example: 'In an electric circuit, current changes when voltage or resistance changes according to the circuit relationship.',
    };
  }

  if (subjectName === 'Mathematics') {
    if (topic.includes('integer')) {
      return {
        definition: 'Integers are whole numbers and their negatives, including zero.',
        details: 'Integer operations follow rules for signs. Adding a negative number is like subtracting. Multiplying or dividing two numbers with the same sign gives a positive result; different signs give a negative result.',
        example: '18 + (-7) = 11 because adding negative 7 means moving 7 steps left from 18 on the number line.',
      };
    }
    if (topic.includes('fraction') || topic.includes('decimal')) {
      return {
        definition: `${cleanTopic} represents parts of a whole or values between whole numbers.`,
        details: 'Fractions use a numerator and denominator. Decimals use place value. Fractions and decimals can represent the same value, such as 1/2 and 0.5.',
        example: '3/4 means three parts out of four equal parts. As a decimal, 3/4 = 0.75.',
      };
    }
    if (topic.includes('equation') || topic.includes('expression') || topic.includes('variable') || topic.includes('terms')) {
      return {
        definition: `${cleanTopic} uses symbols and numbers to represent relationships.`,
        details: 'A variable represents an unknown or changing value. Expressions can be simplified by combining like terms. Equations are solved by keeping both sides balanced.',
        example: 'For 3x + 5 = 20, subtract 5 from both sides to get 3x = 15, then divide by 3 to get x = 5.',
      };
    }
    if (topic.includes('angle') || topic.includes('triangle') || topic.includes('area') || topic.includes('geometry')) {
      return {
        definition: `${cleanTopic} studies shapes, measurements, and spatial relationships.`,
        details: 'Geometry uses properties such as side length, angle measure, parallel lines, perimeter, and area. These properties help classify shapes and solve measurement problems.',
        example: 'The area of a rectangle is length times width. A rectangle with length 8 cm and width 5 cm has area 40 cm^2.',
      };
    }
    return {
      definition: `${cleanTopic} is a mathematical relationship that can be represented using numbers, symbols, diagrams, or graphs.`,
      details: 'Mathematical concepts are built from definitions and rules. A correct solution follows the rule step by step and keeps the value or relationship consistent.',
      example: 'A pattern that increases by 5 each time can be described by adding 5 repeatedly or by writing a rule for the nth term.',
    };
  }

  if (topic.includes('cell')) {
    return {
      definition: `${cleanTopic} explains the structure and function of cells, the basic units of life.`,
      details: 'Cells contain structures called organelles. The nucleus stores genetic information, mitochondria release energy, ribosomes make proteins, and the cell membrane controls movement in and out of the cell.',
      example: 'Plant cells have a cell wall and chloroplasts, while animal cells usually do not. Chloroplasts allow plant cells to carry out photosynthesis.',
    };
  }
  if (topic.includes('dna') || topic.includes('gene') || topic.includes('inheritance') || topic.includes('chromosome')) {
    return {
      definition: `${cleanTopic} explains how biological information is stored and passed from parents to offspring.`,
      details: 'DNA contains instructions for traits. Genes are sections of DNA. Chromosomes carry many genes. Inheritance patterns explain how traits appear across generations.',
      example: 'If a child inherits one allele from each parent, the combination of alleles can determine a visible trait.',
    };
  }
  if (topic.includes('ecosystem') || topic.includes('food') || topic.includes('population') || topic.includes('conservation')) {
    return {
      definition: `${cleanTopic} describes relationships between organisms and their environment.`,
      details: 'Ecosystems include living factors such as plants and animals, and nonliving factors such as water, sunlight, and soil. Energy moves through food chains and food webs.',
      example: 'In a food chain, grass is eaten by a grasshopper, the grasshopper is eaten by a frog, and the frog may be eaten by a snake.',
    };
  }
  return {
    definition: `${cleanTopic} explains a biological structure, process, or relationship in living organisms.`,
    details: 'Biological concepts connect structure and function. A body part, cell organelle, or ecosystem component usually has a role that supports survival, reproduction, or stability.',
    example: 'Homeostasis keeps internal conditions stable, such as body temperature or water balance, even when the outside environment changes.',
  };
};

const makeConcepts = (subjectName, topicName) => {
  const cleanTopic = normalizeTopic(topicName);
  const concrete = getConcreteConcept(subjectName, cleanTopic);
  return [
    {
      title: `${cleanTopic} Core Notes`,
      content: `${cleanTopic} is a core concept in ${subjectName}.

Definition:
${concrete.definition}

Main idea:
${concrete.details}

Explanation:
${concrete.example}

Example connection:
Questions about ${cleanTopic} usually ask for a calculation, classification, cause-and-effect relationship, or explanation based on this concept.`,
    },
    {
      title: `${cleanTopic} Concept Breakdown`,
      content: `${cleanTopic} can be understood by separating it into its main parts.

First part: the object or quantity
This is the thing being described. In ${subjectName}, it may be a number, shape, force, particle, cell structure, organism, or system.

Second part: the relationship
The concept explains how the parts are connected. One value may increase, another may decrease, or one structure may perform a function that affects the whole system.

Third part: the result
The result is what happens when the relationship is applied. This may produce a calculation, a classification, a physical effect, a chemical change, or a biological response.

For ${cleanTopic}, the key is understanding how the parts work together rather than treating the topic as an isolated word.`,
    },
    {
      title: `${cleanTopic} Example Explanation`,
      content: `A typical ${cleanTopic} example begins with given information and asks for a conclusion.

Example situation:
${concrete.example}

Explanation:
The important information in the situation must be connected to the rule or relationship behind ${cleanTopic}. Once the relationship is identified, the conclusion follows logically.

In ${subjectName}, this kind of reasoning is important because many exam questions change the wording but test the same underlying concept.`,
    },
  ];
};

const buildRows = (cleanTopic, rows) => rows.map(([level, skill, question, options, correctAnswer, hint]) => ({
  title: `${level}: ${skill} ${cleanTopic}`,
  question,
  options,
  correctAnswer,
  hint,
}));

const makeSubjectExercises = (subjectName, cleanTopic) => {
  const topic = cleanTopic.toLowerCase();

  if (subjectName === 'Mathematics') {
    if (topic.includes('integer')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Add signed numbers in', 'What is 18 + (-7)?', ['-25', '-11', '11', '25'], 2, 'Move 7 units left from 18.'],
        ['Easy', 'Subtract signed numbers in', 'What is -6 - 9?', ['-15', '-3', '3', '15'], 0, 'Subtracting 9 moves 9 more units left.'],
        ['Medium', 'Multiply signed numbers in', 'What is (-4) x (-6)?', ['-24', '-10', '10', '24'], 3, 'Two negative factors give a positive product.'],
        ['Medium', 'Compare values in', 'Which integer is greatest?', ['-12', '-3', '0', '-1'], 2, 'Zero is greater than all negative numbers listed.'],
        ['Hard', 'Evaluate expression in', 'Evaluate -3[4 - (-2)].', ['-18', '-6', '6', '18'], 0, 'Work inside brackets first: 4 - (-2) = 6.'],
      ]);
    }
    if (topic.includes('fraction') || topic.includes('decimal')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Add fractions in', 'What is 1/2 + 1/4?', ['1/6', '2/6', '3/4', '1'], 2, 'Use denominator 4: 2/4 + 1/4.'],
        ['Easy', 'Convert decimals in', 'Which decimal equals 3/5?', ['0.3', '0.5', '0.6', '0.8'], 2, 'Divide 3 by 5.'],
        ['Medium', 'Multiply fractions in', 'What is 2/3 x 9?', ['3', '4', '6', '12'], 2, '9 divided by 3 is 3, then multiply by 2.'],
        ['Medium', 'Compare decimals in', 'Which number is largest?', ['0.45', '0.405', '0.54', '0.504'], 2, 'Compare place values from left to right.'],
        ['Hard', 'Solve mixed operation in', 'What is 0.75 + 2/5?', ['0.95', '1.05', '1.15', '1.25'], 2, '2/5 = 0.4, then add 0.75.'],
      ]);
    }
    if (topic.includes('factor') || topic.includes('multiple')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Identify factors in', 'Which number is a factor of 24?', ['5', '6', '7', '10'], 1, '24 divided by 6 has no remainder.'],
        ['Easy', 'Find multiples in', 'Which number is a multiple of 8?', ['18', '24', '30', '34'], 1, '8 x 3 = 24.'],
        ['Medium', 'Find HCF in', 'What is the highest common factor of 18 and 24?', ['2', '3', '6', '12'], 2, 'List common factors and choose the largest.'],
        ['Medium', 'Find LCM in', 'What is the least common multiple of 4 and 6?', ['8', '10', '12', '24'], 2, '12 is the first shared multiple.'],
        ['Hard', 'Apply factors in', 'A teacher has 36 pens and 48 pencils. What is the largest equal group size possible?', ['6', '8', '12', '18'], 2, 'Find the HCF of 36 and 48.'],
      ]);
    }
    if (topic.includes('exponent') || topic.includes('root') || topic.includes('scientific notation')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Evaluate powers in', 'What is 3^3?', ['9', '18', '27', '81'], 2, '3 x 3 x 3.'],
        ['Easy', 'Find square roots in', 'What is the square root of 64?', ['6', '8', '16', '32'], 1, '8 x 8 = 64.'],
        ['Medium', 'Simplify powers in', 'What is 2^4 x 2^3?', ['2^7', '2^12', '4^7', '4^12'], 0, 'Add exponents with the same base.'],
        ['Medium', 'Use scientific notation in', 'Which equals 45,000?', ['4.5 x 10^3', '4.5 x 10^4', '45 x 10^4', '0.45 x 10^3'], 1, 'Move the decimal 4 places.'],
        ['Hard', 'Compare powers in', 'Which is greater?', ['5^2', '2^5', '3^3', '4^2'], 1, '2^5 = 32, larger than 25, 27, and 16.'],
      ]);
    }
    if (topic.includes('equation') || topic.includes('expression') || topic.includes('variable') || topic.includes('terms') || topic.includes('inequalit') || topic.includes('word problem')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Combine terms in', 'Simplify 4x + 3x - 2x.', ['5x', '7x', '9x', '5x^2'], 0, 'Combine coefficients of x.'],
        ['Easy', 'Substitute values in', 'If x = 4, what is 2x + 7?', ['11', '15', '18', '23'], 1, '2(4) + 7.'],
        ['Medium', 'Solve equations in', 'Solve 3x + 5 = 20.', ['3', '5', '8', '15'], 1, 'Subtract 5, then divide by 3.'],
        ['Medium', 'Use inequalities in', 'Which value satisfies x + 4 > 10?', ['4', '5', '6', '7'], 3, 'x must be greater than 6.'],
        ['Hard', 'Model word problems in', 'A number doubled and increased by 5 is 29. What is the number?', ['10', '11', '12', '17'], 2, '2x + 5 = 29.'],
      ]);
    }
    if (topic.includes('angle') || topic.includes('triangle') || topic.includes('quadrilateral') || topic.includes('area') || topic.includes('coordinate')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Find angle facts in', 'Two angles on a straight line sum to...', ['90°', '120°', '180°', '360°'], 2, 'Supplementary angles form a straight line.'],
        ['Easy', 'Identify shapes in', 'How many sides does a quadrilateral have?', ['3', '4', '5', '6'], 1, 'Quad means four.'],
        ['Medium', 'Calculate area in', 'A rectangle has length 8 cm and width 5 cm. What is its area?', ['13 cm^2', '26 cm^2', '40 cm^2', '80 cm^2'], 2, 'Area = length x width.'],
        ['Medium', 'Use triangle angles in', 'Two angles of a triangle are 50° and 60°. What is the third angle?', ['60°', '70°', '80°', '90°'], 1, 'Triangle angles sum to 180°.'],
        ['Hard', 'Apply coordinate geometry in', 'What is the distance between (0,0) and (3,4)?', ['5', '6', '7', '12'], 0, 'Use the 3-4-5 right triangle.'],
      ]);
    }
    if (topic.includes('graph') || topic.includes('slope') || topic.includes('pattern') || topic.includes('sequence') || topic.includes('ordered pair')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Read ordered pairs in', 'In the ordered pair (3, 7), what is the x-coordinate?', ['3', '7', '10', '21'], 0, 'The first number is x.'],
        ['Easy', 'Recognize graph points in', 'Which point lies on the y-axis?', ['(4,0)', '(0,5)', '(3,3)', '(2,1)'], 1, 'Points on the y-axis have x = 0.'],
        ['Medium', 'Calculate slope in', 'What is the slope between (1,2) and (3,6)?', ['1', '2', '3', '4'], 1, 'Rise is 4 and run is 2.'],
        ['Medium', 'Continue sequences in', 'The sequence is 5, 9, 13, 17. What comes next?', ['19', '20', '21', '22'], 2, 'Add 4 each time.'],
        ['Hard', 'Interpret linear graphs in', 'A line has equation y = 2x + 3. What is y when x = 5?', ['10', '11', '13', '15'], 2, 'Substitute x = 5.'],
      ]);
    }
    return buildRows(cleanTopic, [
      ['Easy', 'Find average in', 'Find the mean of 4, 6, and 8.', ['5', '6', '7', '8'], 1, 'Add and divide by 3.'],
      ['Easy', 'Read data in', 'Which value is the mode of 2, 3, 3, 4, 5?', ['2', '3', '4', '5'], 1, 'Mode appears most often.'],
      ['Medium', 'Calculate probability in', 'A bag has 3 red and 2 blue balls. What is P(red)?', ['2/5', '3/5', '1/2', '5/3'], 1, 'There are 3 red out of 5 total.'],
      ['Medium', 'Compare data in', 'Which set has the greater range: A = {2,8,10}, B = {4,5,6}?', ['A', 'B', 'Both equal', 'Cannot tell'], 0, 'Range is highest minus lowest.'],
      ['Hard', 'Interpret data in', 'If five scores have mean 12, what is their total?', ['17', '24', '60', '120'], 2, 'Total = mean x number of scores.'],
    ]);
  }

  if (subjectName === 'Physics') {
    if (topic.includes('distance') || topic.includes('displacement') || topic.includes('speed') || topic.includes('velocity') || topic.includes('acceleration') || topic.includes('motion')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Calculate speed in', 'A cyclist travels 60 m in 12 s. What is the speed?', ['3 m/s', '5 m/s', '12 m/s', '72 m/s'], 1, 'Speed = distance / time.'],
        ['Easy', 'Identify displacement in', 'A student walks 5 m east then 5 m west. What is the displacement?', ['0 m', '5 m', '10 m', '25 m'], 0, 'Displacement depends on final position from start.'],
        ['Medium', 'Calculate acceleration in', 'A car changes velocity from 4 m/s to 16 m/s in 3 s. What is acceleration?', ['3 m/s^2', '4 m/s^2', '6 m/s^2', '12 m/s^2'], 1, 'Change in velocity is 12 m/s over 3 s.'],
        ['Medium', 'Interpret motion graphs in', 'On a distance-time graph, a steeper line means...', ['lower speed', 'higher speed', 'zero distance', 'negative mass'], 1, 'Steeper slope means more distance per time.'],
        ['Hard', 'Solve relative motion in', 'Two students run toward each other at 3 m/s and 2 m/s. How fast does the distance between them close?', ['1 m/s', '2 m/s', '3 m/s', '5 m/s'], 3, 'Add speeds when moving toward each other.'],
      ]);
    }
    if (topic.includes('force') || topic.includes('friction') || topic.includes('newton')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Identify force unit in', 'Which unit measures force?', ['Newton', 'Joule', 'Watt', 'Meter'], 0, 'Force is measured in newtons.'],
        ['Easy', 'Recognize balanced forces in', 'If net force is zero, the forces are...', ['unbalanced', 'balanced', 'infinite', 'magnetic only'], 1, 'Zero net force means balanced forces.'],
        ['Medium', 'Calculate net force in', 'A 4 kg object accelerates at 3 m/s^2. What is the net force?', ['7 N', '12 N', '16 N', '24 N'], 1, 'Use F = ma.'],
        ['Medium', 'Apply friction in', 'Which force opposes motion between surfaces?', ['Gravity', 'Friction', 'Tension', 'Magnetism'], 1, 'Friction resists relative motion.'],
        ['Hard', 'Analyze Newton laws in', 'A passenger moves forward when a bus stops suddenly because of...', ['inertia', 'friction only', 'weight loss', 'sound'], 0, 'Inertia resists changes in motion.'],
      ]);
    }
    if (topic.includes('energy') || topic.includes('work') || topic.includes('power')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Identify work in', 'Work is done when a force causes...', ['color change', 'displacement', 'temperature only', 'rest only'], 1, 'Work needs force and displacement.'],
        ['Easy', 'Recognize energy in', 'Which object has kinetic energy?', ['A moving ball', 'A book at rest only', 'A stopped clock', 'A cold stone only'], 0, 'Kinetic energy is energy of motion.'],
        ['Medium', 'Calculate work in', 'A 10 N force moves a box 3 m. How much work is done?', ['3 J', '10 J', '13 J', '30 J'], 3, 'Work = force x distance.'],
        ['Medium', 'Calculate power in', 'If 100 J of work is done in 5 s, what is power?', ['5 W', '20 W', '50 W', '500 W'], 1, 'Power = work / time.'],
        ['Hard', 'Analyze kinetic energy in', 'If speed doubles, kinetic energy becomes...', ['half', 'double', 'four times', 'unchanged'], 2, 'Kinetic energy depends on speed squared.'],
      ]);
    }
    if (topic.includes('wave') || topic.includes('sound') || topic.includes('echo') || topic.includes('frequency')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Identify wave parts in', 'The highest point of a wave is called the...', ['crest', 'trough', 'node', 'echo'], 0, 'The crest is the top point.'],
        ['Easy', 'Recognize sound in', 'Sound waves need a...', ['vacuum only', 'medium', 'battery', 'lens'], 1, 'Sound is a mechanical wave.'],
        ['Medium', 'Calculate wave speed in', 'A wave has frequency 5 Hz and wavelength 2 m. What is speed?', ['2.5 m/s', '7 m/s', '10 m/s', '25 m/s'], 2, 'v = fλ.'],
        ['Medium', 'Apply echo in', 'An echo is caused by sound...', ['absorption', 'reflection', 'evaporation', 'freezing'], 1, 'Echoes are reflected sound waves.'],
        ['Hard', 'Analyze pitch in', 'Higher frequency sound is heard as...', ['lower pitch', 'higher pitch', 'lower speed in all media', 'silence'], 1, 'Pitch increases with frequency.'],
      ]);
    }
    return buildRows(cleanTopic, [
      ['Easy', 'Identify electric charge in', 'The SI unit of electric charge is...', ['Coulomb', 'Newton', 'Joule', 'Meter'], 0, 'Charge is measured in coulombs.'],
      ['Easy', 'Recognize current in', 'Electric current is the rate of flow of...', ['charge', 'mass', 'heat only', 'sound'], 0, 'Current is charge flow per time.'],
      ['Medium', 'Use Ohm law in', 'If V = 12 V and R = 4 Ω, what is current?', ['2 A', '3 A', '8 A', '16 A'], 1, 'I = V / R.'],
      ['Medium', 'Analyze circuits in', 'In a series circuit, the current is...', ['same through all components', 'zero everywhere', 'different at every point', 'unrelated to voltage'], 0, 'Series circuit has one path.'],
      ['Hard', 'Apply safety in', 'Why should a fuse be connected in a circuit?', ['To increase danger', 'To prevent excessive current', 'To remove voltage always', 'To store water'], 1, 'A fuse breaks the circuit when current is too high.'],
    ]);
  }

  if (subjectName === 'Chemistry') {
    if (topic.includes('atomic') || topic.includes('subatomic') || topic.includes('mass number') || topic.includes('isotope') || topic.includes('electron')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Identify particles in', 'Which particle has a positive charge?', ['Electron', 'Proton', 'Neutron', 'Molecule'], 1, 'Protons are positive.'],
        ['Easy', 'Find atomic number in', 'An atom has 11 protons. What is its atomic number?', ['5', '10', '11', '22'], 2, 'Atomic number equals proton count.'],
        ['Medium', 'Calculate mass number in', 'An atom has 8 protons and 10 neutrons. What is its mass number?', ['8', '10', '18', '80'], 2, 'Add protons and neutrons.'],
        ['Medium', 'Apply ions in', 'A neutral atom loses 2 electrons. What charge forms?', ['2-', '1-', '1+', '2+'], 3, 'Losing electrons makes a positive ion.'],
        ['Hard', 'Analyze isotopes in', 'Carbon-12 and Carbon-14 differ in number of...', ['protons', 'neutrons', 'electrons only', 'compounds'], 1, 'Isotopes differ in neutrons.'],
      ]);
    }
    if (topic.includes('periodic') || topic.includes('group') || topic.includes('metal') || topic.includes('valence') || topic.includes('famil')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Locate groups in', 'Vertical columns in the periodic table are called...', ['periods', 'groups', 'isotopes', 'solutions'], 1, 'Groups are vertical columns.'],
        ['Easy', 'Locate periods in', 'Horizontal rows in the periodic table are called...', ['periods', 'groups', 'ions', 'mixtures'], 0, 'Periods are horizontal rows.'],
        ['Medium', 'Use valence electrons in', 'Elements in the same group usually have the same number of...', ['neutrons', 'valence electrons', 'nuclei', 'isotopes'], 1, 'Group number relates to valence electrons for many main-group elements.'],
        ['Medium', 'Classify metals in', 'Which property is common for many metals?', ['brittle and dull', 'good electrical conductor', 'always gas', 'never reacts'], 1, 'Metals usually conduct electricity.'],
        ['Hard', 'Predict trends in', 'Across a period from left to right, atomic radius generally...', ['decreases', 'increases greatly', 'becomes zero', 'does not exist'], 0, 'Nuclear attraction increases across a period.'],
      ]);
    }
    if (topic.includes('bond') || topic.includes('lewis') || topic.includes('molecular')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Identify ionic bonding in', 'Ionic bonding usually forms between...', ['metal and nonmetal', 'two noble gases', 'two identical atoms only', 'water and light'], 0, 'Electrons transfer from metal to nonmetal.'],
        ['Easy', 'Identify covalent bonding in', 'Covalent bonds form when atoms...', ['share electrons', 'share protons', 'destroy nuclei', 'become mixtures'], 0, 'Covalent bonding involves shared electrons.'],
        ['Medium', 'Apply Lewis structures in', 'Dots in a Lewis structure represent...', ['valence electrons', 'neutrons', 'nuclei', 'mass numbers'], 0, 'Lewis dots show valence electrons.'],
        ['Medium', 'Compare bonds in', 'NaCl is best described as...', ['ionic compound', 'covalent molecule', 'metal only', 'isotope'], 0, 'Sodium transfers an electron to chlorine.'],
        ['Hard', 'Analyze molecular shape in', 'The shape of a molecule mainly depends on...', ['electron pair arrangement', 'color only', 'container size', 'temperature only'], 0, 'Electron pairs repel and arrange around the central atom.'],
      ]);
    }
    if (topic.includes('reaction') || topic.includes('balancing') || topic.includes('oxidation') || topic.includes('rate')) {
      return buildRows(cleanTopic, [
        ['Easy', 'Identify reaction type in', 'Burning methane is an example of...', ['combustion', 'freezing', 'filtration', 'dissolving only'], 0, 'Burning in oxygen is combustion.'],
        ['Easy', 'Recognize conservation in', 'Balanced equations show conservation of...', ['atoms', 'color', 'temperature only', 'shape only'], 0, 'Atoms are conserved in reactions.'],
        ['Medium', 'Balance equations in', 'Balance: H2 + O2 -> H2O. What coefficient goes before H2O?', ['1', '2', '3', '4'], 1, '2H2 + O2 -> 2H2O.'],
        ['Medium', 'Apply oxidation in', 'Oxidation can be described as loss of...', ['electrons', 'protons', 'neutrons', 'nuclei'], 0, 'OIL RIG: oxidation is loss.'],
        ['Hard', 'Analyze reaction rate in', 'Increasing temperature usually makes reaction rate...', ['slower', 'faster', 'zero always', 'unrelated'], 1, 'Particles collide more often and with more energy.'],
      ]);
    }
    return buildRows(cleanTopic, [
      ['Easy', 'Identify solute in', 'In salt water, salt is the...', ['solute', 'solvent', 'indicator', 'metal'], 0, 'The solute is dissolved.'],
      ['Easy', 'Identify solvent in', 'In salt water, water is the...', ['solute', 'solvent', 'precipitate', 'acid only'], 1, 'The solvent does the dissolving.'],
      ['Medium', 'Calculate concentration in', 'What is concentration if 10 g solute is in 2 L solution?', ['2 g/L', '5 g/L', '10 g/L', '20 g/L'], 1, '10 divided by 2.'],
      ['Medium', 'Classify acid-base in', 'A solution with pH 3 is...', ['acidic', 'neutral', 'basic', 'pure salt'], 0, 'pH below 7 is acidic.'],
      ['Hard', 'Analyze dilution in', 'When water is added to a solution, concentration...', ['increases', 'decreases', 'always doubles', 'becomes mass'], 1, 'Same solute in more volume means lower concentration.'],
    ]);
  }

  if (topic.includes('cell') || topic.includes('organelles') || topic.includes('transport') || topic.includes('division')) {
    return buildRows(cleanTopic, [
      ['Easy', 'Identify organelles in', 'Which organelle controls most activities in a eukaryotic cell?', ['Cell wall', 'Nucleus', 'Ribosome', 'Vacuole'], 1, 'The nucleus contains DNA.'],
      ['Easy', 'Recognize energy in', 'Which organelle releases usable energy from food?', ['Mitochondrion', 'Chloroplast', 'Nucleus', 'Cell wall'], 0, 'Mitochondria release energy.'],
      ['Medium', 'Compare cells in', 'Which structure is usually found in plant cells but not animal cells?', ['Cell membrane', 'Cytoplasm', 'Cell wall', 'Nucleus'], 2, 'Plant cells have cell walls.'],
      ['Medium', 'Apply transport in', 'Water moving across a membrane from high to low water concentration is...', ['osmosis', 'respiration', 'digestion', 'mutation'], 0, 'Osmosis is diffusion of water.'],
      ['Hard', 'Analyze division in', 'Mitosis produces cells that are genetically...', ['identical', 'always different', 'without chromosomes', 'not living'], 0, 'Mitosis makes identical body cells.'],
    ]);
  }
  if (topic.includes('dna') || topic.includes('gene') || topic.includes('chromosome') || topic.includes('inheritance') || topic.includes('punnett') || topic.includes('variation')) {
    return buildRows(cleanTopic, [
      ['Easy', 'Identify DNA in', 'DNA mainly stores...', ['genetic information', 'oxygen only', 'digested food', 'water only'], 0, 'DNA carries hereditary instructions.'],
      ['Easy', 'Recognize genes in', 'A gene is a section of...', ['DNA', 'cell wall', 'cytoplasm', 'water'], 0, 'Genes are DNA segments.'],
      ['Medium', 'Apply inheritance in', 'If both parents pass a recessive allele, the offspring trait is...', ['recessive', 'always dominant', 'never seen', 'not genetic'], 0, 'Two recessive alleles express the recessive trait.'],
      ['Medium', 'Use Punnett squares in', 'In a Tt x Tt cross, what fraction is tt?', ['1/4', '1/2', '3/4', '1'], 0, 'The combinations are TT, Tt, Tt, tt.'],
      ['Hard', 'Analyze variation in', 'Genetic variation in a population increases the chance of...', ['adaptation', 'identical offspring only', 'no evolution', 'no survival'], 0, 'Variation gives populations options under environmental change.'],
    ]);
  }
  if (topic.includes('evolution') || topic.includes('selection') || topic.includes('adaptation') || topic.includes('speciation')) {
    return buildRows(cleanTopic, [
      ['Easy', 'Define adaptation in', 'An adaptation is a trait that helps an organism...', ['survive or reproduce', 'disappear immediately', 'stop needing energy', 'avoid inheritance'], 0, 'Adaptations improve survival or reproduction.'],
      ['Easy', 'Identify selection in', 'Natural selection acts on...', ['variation in traits', 'empty space', 'nonliving rocks only', 'all traits equally'], 0, 'Selection depends on variation.'],
      ['Medium', 'Apply evolution in', 'If dark moths survive better in a polluted area, their frequency may...', ['increase', 'decrease to zero immediately', 'stay impossible', 'be unrelated'], 0, 'Better survival can increase trait frequency.'],
      ['Medium', 'Use evidence in', 'Fossils are evidence for...', ['evolution over time', 'no past life', 'only weather', 'cell division only'], 0, 'Fossils show past organisms.'],
      ['Hard', 'Analyze speciation in', 'Speciation is most likely when populations are...', ['isolated and evolve differences', 'always mixed freely', 'all identical forever', 'without DNA'], 0, 'Isolation can lead to new species.'],
    ]);
  }
  if (topic.includes('ecosystem') || topic.includes('food') || topic.includes('population') || topic.includes('cycle') || topic.includes('conservation')) {
    return buildRows(cleanTopic, [
      ['Easy', 'Identify ecology in', 'A group of the same species living in one area is a...', ['population', 'organ', 'cell', 'molecule'], 0, 'Population means same species in an area.'],
      ['Easy', 'Recognize food chains in', 'In a food chain, plants are usually...', ['producers', 'top predators', 'decomposers only', 'parasites only'], 0, 'Plants make food by photosynthesis.'],
      ['Medium', 'Apply energy flow in', 'Energy flow in an ecosystem usually begins with...', ['sunlight', 'soil only', 'predators', 'rain only'], 0, 'Sunlight powers photosynthesis.'],
      ['Medium', 'Use cycles in', 'The water cycle includes evaporation and...', ['condensation', 'mutation', 'digestion', 'inheritance'], 0, 'Water vapor condenses into clouds.'],
      ['Hard', 'Analyze conservation in', 'Protecting habitats helps preserve...', ['biodiversity', 'pollution only', 'habitat loss', 'extinction only'], 0, 'Habitats support many species.'],
    ]);
  }
  if (topic.includes('system') || topic.includes('respiratory') || topic.includes('circulatory') || topic.includes('digestive') || topic.includes('nervous') || topic.includes('homeostasis')) {
    return buildRows(cleanTopic, [
      ['Easy', 'Identify function in', 'The respiratory system mainly exchanges...', ['gases', 'genes', 'bones', 'light'], 0, 'It exchanges oxygen and carbon dioxide.'],
      ['Easy', 'Recognize circulation in', 'Blood is pumped around the body by the...', ['heart', 'stomach', 'lung air sacs', 'skin'], 0, 'The heart pumps blood.'],
      ['Medium', 'Apply digestion in', 'Digestion breaks large food molecules into...', ['smaller soluble molecules', 'rocks', 'light waves', 'chromosomes'], 0, 'Small molecules can be absorbed.'],
      ['Medium', 'Explain nerves in', 'The nervous system sends messages using...', ['nerve impulses', 'digestive juices', 'red blood cells only', 'cell walls'], 0, 'Neurons transmit impulses.'],
      ['Hard', 'Analyze homeostasis in', 'Sweating on a hot day helps maintain...', ['body temperature', 'bone length', 'eye color', 'DNA sequence'], 0, 'Sweating cools the body.'],
    ]);
  }
  return buildRows(cleanTopic, [
    ['Easy', 'Identify ecology in', 'A group of the same species living in one area is a...', ['population', 'organ', 'cell', 'molecule'], 0, 'Population means same species in an area.'],
    ['Easy', 'Recognize food chains in', 'In a food chain, plants are usually...', ['producers', 'top predators', 'decomposers only', 'parasites only'], 0, 'Plants make food by photosynthesis.'],
    ['Medium', 'Apply energy flow in', 'Energy flow in an ecosystem usually begins with...', ['sunlight', 'soil only', 'predators', 'rain only'], 0, 'Sunlight powers photosynthesis.'],
    ['Medium', 'Use cycles in', 'The water cycle includes evaporation and...', ['condensation', 'mutation', 'digestion', 'inheritance'], 0, 'Water vapor condenses into clouds.'],
    ['Hard', 'Analyze conservation in', 'Protecting habitats helps preserve...', ['biodiversity', 'pollution only', 'habitat loss', 'extinction only'], 0, 'Habitats support many species.'],
  ]);
};

const makeExerciseSet = (subjectName, topicName, createdBy) => {
  const cleanTopic = normalizeTopic(topicName);
  const createdBase = new Date('2026-01-01T00:00:00.000Z').getTime();
  return makeSubjectExercises(subjectName, cleanTopic).map((exercise, index) => ({
    ...exercise,
    topic: null,
    difficulty: index < 2 ? 'Easy' : index < 4 ? 'Medium' : 'Hard',
    createdBy,
    createdAt: new Date(createdBase + index * 1000),
    updatedAt: new Date(createdBase + index * 1000),
  }));
};

const makeQuizQuestions = (subjectName, topicName) => {
  const cleanTopic = normalizeTopic(topicName);
  const focus = getSubjectFocus(subjectName, cleanTopic);
  return [
    [`What is the main purpose of ${cleanTopic}?`, [focus.purpose, 'To decorate the page', 'To replace all other topics', 'To avoid practice'], 'A', `${cleanTopic} is a meaningful concept within ${subjectName}.`],
    [`Which study action best supports ${cleanTopic}?`, ['Connect the definition to examples', 'Memorize without reading', 'Ignore mistakes', 'Skip all exercises'], 'A', 'Examples help turn the definition into usable understanding.'],
    [`What should a student check in a ${cleanTopic} solution?`, ['Whether the answer fits the question', 'Whether the answer is longest', 'Whether the page is colorful', 'Whether no steps are shown'], 'A', 'A good solution must match the question context.'],
    [`Which statement about ${cleanTopic} is best?`, [focus.example, 'It has no role in questions', 'It is unrelated to the chapter', 'It only matters outside school'], 'A', `${cleanTopic} should be connected to real subject questions.`],
    [`How can a student master ${cleanTopic}?`, ['Read the concept, solve examples, and review feedback', 'Avoid examples', 'Guess repeatedly', 'Only read the title'], 'A', 'Concept reading, practice, and feedback build mastery.'],
  ];
};

const makeVideoUrl = (subjectName, topicName, gradeLevel) => {
  const cleanTopic = normalizeTopic(topicName);
  const videoIdsBySubject = {
    Mathematics: ['NybHckSEQBI', 'LDIiYKYvvdA'],
    Physics: ['ZM8ECpBuQYE', 'kKKM8Y-u7ds'],
    Chemistry: ['thnDxFdkzZs', 'EMDrb2LqL7E'],
    Biology: ['URUJD5NEXC8', 'ApvxVtBJxd0'],
  };
  const ids = videoIdsBySubject[subjectName] || videoIdsBySubject.Mathematics;
  const seed = cleanTopic.split('').reduce((total, char) => total + char.charCodeAt(0), Number(gradeLevel));
  return `https://www.youtube.com/embed/${ids[seed % ids.length]}`;
};

async function deleteSeededChapterTree(subjectId, oldFoundationName) {
  const chapters = await Chapter.find({
    subject: subjectId,
    $or: [
      { chapterName: /^Chapter [1-5]: / },
      { chapterName: oldFoundationName },
    ],
  }).select('_id');
  const chapterIds = chapters.map((chapter) => chapter._id);
  if (chapterIds.length === 0) return;

  const topics = await Topic.find({ chapter: { $in: chapterIds } }).select('_id');
  const topicIds = topics.map((topic) => topic._id);
  const quizzes = await Quiz.find({ topic: { $in: topicIds } }).select('_id');
  const quizIds = quizzes.map((quiz) => quiz._id);

  await Promise.all([
    QuizProblem.deleteMany({ quizId: { $in: quizIds } }),
    Quiz.deleteMany({ _id: { $in: quizIds } }),
    Exercise.deleteMany({ topic: { $in: topicIds } }),
    Concept.deleteMany({ topic: { $in: topicIds } }),
    Video.deleteMany({ topic: { $in: topicIds } }),
    Topic.deleteMany({ _id: { $in: topicIds } }),
    Chapter.deleteMany({ _id: { $in: chapterIds } }),
  ]);
}

async function main() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) throw new Error('MONGODB_URI or DATABASE_URL is required');

  await mongoose.connect(uri);

  const creator = await User.findOne({ role: { $in: ['teacher', 'admin'] } }).sort({ role: 1, created_at: 1 });
  if (!creator) {
    throw new Error('Create at least one teacher or admin before seeding curriculum.');
  }

  const summary = [];

  for (const plan of SUBJECT_PLANS) {
    const subject = await Subject.findOneAndUpdate(
      { subjectName: plan.subjectName, gradeLevel: plan.gradeLevel, stream: plan.stream },
      {
        subjectName: plan.subjectName,
        subjectDescription: plan.description,
        gradeLevel: plan.gradeLevel,
        stream: plan.stream,
        teacher: creator.role === 'teacher' ? creator._id : undefined,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await deleteSeededChapterTree(subject._id, `Foundations of ${plan.subjectName}`);

    let chapterCount = 0;
    let topicCount = 0;
    let exerciseCount = 0;
    let quizQuestionCount = 0;

    for (const [chapterIndex, [chapterTitle, topicTitles]] of plan.chapters.entries()) {
      const chapterNumber = chapterIndex + 1;
      const chapter = await Chapter.create({
        chapterName: `Chapter ${chapterNumber}: ${chapterTitle}`,
        chapterDescription: `${plan.subjectName} Grade ${plan.gradeLevel} chapter on ${chapterTitle}.`,
        subject: subject._id,
      });
      chapterCount += 1;

      for (const [topicIndex, topicTitle] of topicTitles.entries()) {
        const topicNumber = `${chapterNumber}.${topicIndex + 1}`;
        const topicName = `${topicNumber} ${topicTitle}`;
        const topic = await Topic.create({
          topicName,
          topicDescription: `${topicTitle} in ${plan.subjectName} for Grade ${plan.gradeLevel}.`,
          topicObjectives: [
            `Explain the main idea of ${topicTitle}.`,
            `Apply ${topicTitle} to practice questions.`,
            `Review common mistakes in ${topicTitle}.`,
          ],
          chapter: chapter._id,
        });
        topicCount += 1;

        await Concept.insertMany(makeConcepts(plan.subjectName, topicName).map((concept) => ({
          ...concept,
          topic: topic._id,
        })));

        await Video.create({
          title: `${topicName} Video Lesson`,
          videoUrl: makeVideoUrl(plan.subjectName, topicName, plan.gradeLevel),
          topic: topic._id,
        });

        const exercises = makeExerciseSet(plan.subjectName, topicName, creator._id).map((exercise) => ({
          ...exercise,
          topic: topic._id,
        }));
        await Exercise.insertMany(exercises);
        exerciseCount += exercises.length;

        const quiz = await Quiz.create({
          topic: topic._id,
          title: `${topicName} Practice Quiz`,
          description: `Five-question quiz for ${topicName}.`,
          createdBy: creator._id,
        });

        const quizQuestions = makeQuizQuestions(plan.subjectName, topicName).map(([questionText, answers, correctAnswer, answerExplanation]) => ({
          quizId: quiz._id,
          questionText,
          choices: answers.map((answer, index) => ({
            text: answer,
            value: String.fromCharCode(65 + index),
          })),
          correctAnswer,
          answerExplanation,
        }));
        await QuizProblem.insertMany(quizQuestions);
        quizQuestionCount += quizQuestions.length;
      }
    }

    summary.push({
      subject: `${plan.subjectName} Grade ${plan.gradeLevel}`,
      chapters: chapterCount,
      topics: topicCount,
      exercises: exerciseCount,
      quizQuestions: quizQuestionCount,
    });
  }

  console.log(JSON.stringify(summary, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch (_err) {
    // Ignore disconnect errors during failed seed.
  }
  process.exit(1);
});
