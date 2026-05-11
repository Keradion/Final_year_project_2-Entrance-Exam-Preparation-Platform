/**
 * Grade 9 · Natural stream — Ministry-style outline (units as chapters, sections as topics).
 * Topic titles follow the Ethiopian Grade 9 student textbook structure; refine wording against your PDF copy if needed.
 */

const MATH = [
  {
    chapterName: 'Further on sets',
    topics: [
      'Sets and Elements',
      'Set Description',
      'Empty set, Finite and Infinite set',
      'Basic Properties and Relationships of Sets',
      'Operation on Sets: Union and Intersection',
      'Operation on Sets: Complement and Difference',
      'Applications of sets',
    ],
  },
  {
    chapterName: 'The number system',
    topics: [
      'Types of numbers (revision)',
      'Rational numbers',
      'Irrational numbers',
      'Real numbers and the number line',
      'Operations on real numbers',
      'Laws of exponents',
      'Zero and negative integer exponents',
      'Rational exponents and radicals',
      'Operations involving radicals',
      'Rationalizing the denominator',
      'Scientific notation',
      'Accuracy, rounding, and significant figures',
      'Applications of the number system',
    ],
  },
  {
    chapterName: 'Solving equations',
    topics: [
      'Revision on linear equation in one variable',
      'Systems of linear equations in two variables (substitution)',
      'Systems of linear equations in two variables (elimination)',
      'Equations involving absolute value',
      'Quadratic equations',
      'Equations involving exponents',
      'Equations involving radicals',
      'Applications of solving equations',
    ],
  },
  {
    chapterName: 'Solving inequalities',
    topics: [
      'Revision on linear inequalities in one variable',
      'Systems of linear inequalities in two variables',
      'Inequalities involving absolute value',
      'Quadratic inequalities',
      'Applications of inequalities',
    ],
  },
  {
    chapterName: 'Introduction to trigonometry',
    topics: ['Revision on right-angled triangles', 'Trigonometric ratios'],
  },
  {
    chapterName: 'Regular polygons',
    topics: [
      'Concave and convex polygons',
      'Sum of interior angles of a convex polygon',
      'Sum of exterior angles of a convex polygon',
      'Measures of interior and exterior angles of a regular polygon',
      'Properties of regular polygons',
      'Perimeter, area, and apothem of regular polygons inscribed in a circle',
    ],
  },
  {
    chapterName: 'Congruency and similarity',
    topics: [
      'Revision on congruency of triangles',
      'Worked examples on SSS, ASA, SAS and RHS',
      'Similar figures and their basic properties',
      'Theorems on similar plane figures',
      'Ratios of sides, perimeters, and areas in similar figures',
    ],
  },
  {
    chapterName: 'Vectors in two dimensions',
    topics: [
      'Vector and scalar quantities',
      'Addition and subtraction of vectors',
      'Multiplication involving vectors (scalar multiplication)',
      'Position vectors',
      'Applications of vectors in two dimensions',
    ],
  },
  {
    chapterName: 'Statistics and probability',
    topics: [
      'Definition of statistics and statistical data',
      'Data collection, cleaning, and data sources',
      'Population, sample, parameter, and statistic',
      'Graphical representations of statistical data',
      'The arithmetic mean',
      'The median',
      'The mode',
      'Applications of measures of central tendency',
      'Measures of dispersion: range, variance, and standard deviation',
      'Probability',
      'Solved problems involving probabilities',
    ],
  },
];

const PHYSICS = [
  {
    chapterName: 'Physics and Human Society',
    topics: [
      'Definition and Nature of Physics',
      'Branches of Physics',
      'Related Fields to Physics',
      'Historical Issues and Contributors',
    ],
  },
  {
    chapterName: 'Physical Quantities',
    topics: [
      'Scales, Standards, and Units (prefixes)',
      'Measurement and Safety',
      'Classification of Physical Quantities',
      'Unit conversion',
    ],
  },
  {
    chapterName: 'Motion in a Straight Line',
    topics: [
      'Position, Distance, and Displacement',
      'Average Speed and Instantaneous Speed',
      'Average Velocity and Instantaneous Velocity',
      'Acceleration',
      'Uniform Motion',
      'Graphical Representation of Motion',
    ],
  },
  {
    chapterName: 'Force, Work, Energy, and Power',
    topics: [
      'The Concept of Force',
      "Newton's Laws of Motion",
      'Forces of Friction',
      'The Concept of Work',
      'Kinetic and Potential Energies',
      'Power',
    ],
  },
  {
    chapterName: 'Simple Machines',
    topics: [
      'Simple Machines and their Purposes',
      'Simple Machines at Home',
      'Simple Machines at Workplace',
      'Classification of Simple Machines',
      'Mechanical Advantage, Velocity Ratio, and Efficiency',
      'Designing Simple Machines',
    ],
  },
  {
    chapterName: 'Mechanical Oscillation and Sound Wave',
    topics: [
      'Common Characteristics of Waves',
      'String, Pendulum, and Spring',
      'Propagation of Waves and Energy Transmission',
      'Sound Waves',
      'Superposition of Waves',
      'Characteristics of Sound Waves',
    ],
  },
  {
    chapterName: 'Temperature and Thermometry',
    topics: [
      'Temperature and Our Life',
      'Extreme Temperature Safety',
      'Temperature Change and its Effects',
      'Measuring Temperature with Different Thermometric Scales',
      'Types of Thermometers and Their Use',
      'Conversion between Temperature Scales',
      'Thermal Expansion of Materials',
    ],
  },
];

const CHEMISTRY = [
  {
    chapterName: 'Chemistry and Its Importance',
    topics: [
      'Definition and Scope of Chemistry',
      'Relationship between Chemistry and Other Natural Sciences',
      'The Role Chemistry Plays in Production and in Society',
      'Some Common Chemical Industries in Ethiopia',
    ],
  },
  {
    chapterName: 'Measurements and Scientific Methods',
    topics: ['Measurements and Units in Chemistry', 'Chemistry as Experimental Science'],
  },
  {
    chapterName: 'Structure of the Atom',
    topics: [
      'Historical Development of Atomic Theories of Matter',
      'Fundamental Laws of Chemical Reactions',
      'Atomic Theory',
      'Discoveries of Fundamental Subatomic Particles and the Atomic Nucleus',
      'Composition of an Atom and Isotopes',
    ],
  },
  {
    chapterName: 'Periodic Classification of Elements',
    topics: [
      'Historical Development of Periodic Classification',
      "Mendeleev's Classification of the Elements",
      'The Modern Periodic Table',
      'Major Trends in the Periodic Table',
    ],
  },
  {
    chapterName: 'Chemical Bonding',
    topics: ['Chemical Bonding', 'Ionic Bonding', 'Covalent Bonding', 'Metallic Bonding'],
  },
];

const BIOLOGY = [
  {
    chapterName: 'Introduction to Biology',
    topics: [
      'Definition of Biology',
      'Why do we study Biology?',
      'The Scientific Method',
      'Tools of a Biologist (laboratory and field)',
      'The Light Microscope',
      'General Laboratory Safety Rules',
    ],
  },
  {
    chapterName: 'Characteristics and Classification of Organisms',
    topics: [
      'Characteristics of living things',
      'Taxonomy: principles and hierarchies',
      'Relevance of classification',
      'Linnaean system of nomenclature',
      'Common Ethiopian animals and plants',
      'Kingdom Monera',
      'Kingdom Protista',
      'Kingdom Fungi',
      'Kingdom Plantae',
      'Kingdom Animalia',
      'Renowned taxonomists in Ethiopia',
    ],
  },
  {
    chapterName: 'Cells',
    topics: [
      'Introduction to the cell',
      'Cell theory',
      'Cell structure and function',
      'Types of cells',
      'Animal and plant cells',
      'Observing cells under a microscope',
      'Passive transport',
      'Active transport',
      'Levels of biological organization',
    ],
  },
  {
    chapterName: 'Reproduction',
    topics: [
      'Introduction to reproduction',
      'Asexual reproduction',
      'Types of asexual reproduction',
      'Sexual reproduction in humans',
      'Primary and secondary sexual characteristics',
      'Male reproductive structures',
      'Female reproductive structures',
      'The menstrual cycle',
      'Fertilization and pregnancy',
      'Methods of birth control',
      'Sexually transmitted infections: transmission and prevention',
    ],
  },
  {
    chapterName: 'Human Health, Nutrition, and Disease',
    topics: [
      'What is food?',
      'Nutrition and nutrients',
      'Balanced diets',
      'Deficiency diseases',
      'Malnutrition',
      'Substance abuse',
      'Infectious diseases',
      'Non-infectious diseases',
      'Renowned nutritionists in Ethiopia',
    ],
  },
  {
    chapterName: 'Ecology',
    topics: [
      'Definitions of ecological terms',
      'Biotic and abiotic components',
      'Ecological levels',
      'Ecosystems',
      'Biomes',
      'Ecological succession',
      'Ecological relationships',
    ],
  },
];

/** Curated educational videos (rotate by index). Replace with textbook-companion links when available. */
const VIDEO_POOLS = {
  Mathematics: [
    'https://www.youtube.com/watch?v=EoxrqFmXYnw',
    'https://www.youtube.com/watch?v=Zy6KN5QxdMw',
    'https://www.youtube.com/watch?v=RsOwXGOiZ4o',
    'https://www.youtube.com/watch?v=NMpDFr6hOik',
    'https://www.youtube.com/watch?v=GYFAB6N9yPU',
    'https://www.youtube.com/watch?v=v_UyVmITiYQ',
    'https://www.youtube.com/watch?v=IwW0GJWKH98',
    'https://www.youtube.com/watch?v=LdYVWu2HqpM',
    'https://www.youtube.com/watch?v=FLOfTwOSJH0',
    'https://www.youtube.com/watch?v=b1WGfQpqFAC',
    'https://www.youtube.com/watch?v=9RSQTdLBD6Y',
    'https://www.youtube.com/watch?v=p_di4Zn4wz4',
  ],
  Physics: [
    'https://www.youtube.com/watch?v=c38H6UK2RSA',
    'https://www.youtube.com/watch?v=XlLguvxK-OU',
    'https://www.youtube.com/watch?v=ZMrcN8MR0P4',
    'https://www.youtube.com/watch?v=DHWsyyFQ2dA',
    'https://www.youtube.com/watch?v=Y8Yy4e2Y9rA',
    'https://www.youtube.com/watch?v=s9F5fhJQo3k',
    'https://www.youtube.com/watch?v=gkGKczSzdWo',
    'https://www.youtube.com/watch?v=HpCVa5S1Pgk',
    'https://www.youtube.com/watch?v=MBNnMbnIFWI',
    'https://www.youtube.com/watch?v=yYm3idhQPGo',
  ],
  Chemistry: [
    'https://www.youtube.com/watch?v=FSyAehMdpyI',
    'https://www.youtube.com/watch?v=ANi689PV4jY',
    'https://www.youtube.com/watch?v=pof_rtwGvR8',
    'https://www.youtube.com/watch?v=2tK5cW2xt3k',
    'https://www.youtube.com/watch?v=0RRVV4Iw_yo',
    'https://www.youtube.com/watch?v=oN9LeTEqEk8',
    'https://www.youtube.com/watch?v=5wCIzdeAdkc',
    'https://www.youtube.com/watch?v=UvlcxlynRN8',
  ],
  Biology: [
    'https://www.youtube.com/watch?v=qwNLUViJ6vU',
    'https://www.youtube.com/watch?v=9BFXxFlX0bw',
    'https://www.youtube.com/watch?v=8IlT7y9U5lc',
    'https://www.youtube.com/watch?v=8KdxNcHe0Wo',
    'https://www.youtube.com/watch?v=q8NCMRmXZiE',
    'https://www.youtube.com/watch?v=W9YWkzbD0jM',
    'https://www.youtube.com/watch?v=jvqREOO6-pQ',
    'https://www.youtube.com/watch?v=pgoVtVB85NQ',
    'https://www.youtube.com/watch?v=VPJG_PLDzL8',
    'https://www.youtube.com/watch?v=RfdlxuF1jfM',
  ],
};

function learningObjectivesForTopic(subjectName, chapterName, topicName) {
  return [
    `Explain the main ideas of ${topicName} in your own words and relate them to ${chapterName}.`,
    `Use definitions and procedures from ${topicName} to work through representative Grade 9 ${subjectName} tasks.`,
    `Check solutions for reasonableness and connect ${topicName} to examples discussed in the official textbook.`,
  ];
}

/**
 * Plain-text concept article (no HTML). Frontend splits on blank lines into paragraphs.
 */
function buildConceptArticle({ subjectName, chapterName, topicName, objectives }) {
  const objBlock = objectives.map((o) => `• ${o}`).join('\n');

  return [
    `${topicName}`,
    `Where this fits: ${chapterName} — Grade 9 ${subjectName}. National textbooks treat "${topicName}" as part of this unit so you can build concepts in the same order your school expects.`,
    `This note is written as a short article you can read on screen. There is no HTML: paragraphs are plain text, suitable for revision on phone or laptop.`,
    `Learning objectives`,
    `After you finish this topic, you should be able to:`,
    objBlock,
    `Core explanation`,
    `${topicName} connects what you already know to what comes next in ${chapterName}. Open your official textbook to the matching section and read the definitions there first; use this article to organize how you practice.`,
    `When the book gives a worked example, cover the solution, write your own attempt, then uncover and correct line by line. If you cannot say why a step is valid, stop and reread the objective it supports before moving on.`,
    `Common pitfalls include switching formulas between topics, skipping units in measurement questions, and answering a different question than the one asked. Slow down, underline the task words, and restate the problem in one sentence before calculating.`,
    `Revision and self-check`,
    `Without the book, list: (1) the key definition for ${topicName}, (2) one standard problem type, (3) one way your teacher might ask you to apply it. If any list item is vague, reread this unit and redo one textbook exercise.`,
    `Study habits`,
    `Short, focused sessions beat long passive reading. After each session, write one question you still have about ${topicName} for class. Keep notation consistent with your textbook so you do not train two conflicting habits.`,
  ].join('\n\n');
}

function pickVideoUrl(subjectName, index) {
  const pool = VIDEO_POOLS[subjectName];
  return pool[index % pool.length];
}

const GRADE_9_NATURAL_CURRICULUM = [
  {
    name: 'Mathematics',
    desc: 'Grade 9 Mathematics — sets, real numbers, equations and inequalities, trigonometry, geometry, vectors, statistics and probability (MoE-aligned outline).',
    plan: MATH,
  },
  {
    name: 'Physics',
    desc: 'Grade 9 Physics — quantities, linear motion, force and energy, simple machines, waves and sound, temperature (MoE-aligned outline).',
    plan: PHYSICS,
  },
  {
    name: 'Chemistry',
    desc: 'Grade 9 Chemistry — importance of chemistry, measurement, atomic structure, periodic table, bonding (MoE-aligned outline).',
    plan: CHEMISTRY,
  },
  {
    name: 'Biology',
    desc: 'Grade 9 Biology — methods of biology, classification, cells, reproduction, health and nutrition, ecology (MoE-aligned outline).',
    plan: BIOLOGY,
  },
];

module.exports = {
  GRADE_9_NATURAL_CURRICULUM,
  learningObjectivesForTopic,
  buildConceptArticle,
  pickVideoUrl,
};
