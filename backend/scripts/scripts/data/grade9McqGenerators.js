/**
 * Five substantive exercises and five quiz MCQs per topic (Grade 9 Natural).
 */

const LETTERS = ['A', 'B', 'C', 'D'];

function ex(question, options, correctIndex, hint) {
  return { question, options, correctAnswer: correctIndex, hint: hint || '' };
}

function qz(questionText, texts, correctIdx, answerExplanation) {
  const choices = texts.map((text, i) => ({ text, value: LETTERS[i] }));
  return {
    questionText,
    choices,
    correctAnswer: LETTERS[correctIdx],
    answerExplanation,
  };
}

function hashPick(str, mod) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
}

function skillObjectives(subjectName, chapterName, topicName, verbs) {
  return [
    `${verbs[0]} the ideas of “${topicName}” in ${chapterName} (${subjectName}).`,
    `${verbs[1]} standard problems involving “${topicName}”.`,
    `${verbs[2]} answers and diagrams linked to “${topicName}”.`,
  ];
}

function article(topicName, chapterName, subjectName, bodyParas) {
  return [topicName, ...bodyParas].join('\n\n');
}

function mathPack(chapterName, topicName) {
  const k = hashPick(topicName + chapterName, 97);
  const verbs = ['Define and use', 'Solve and apply', 'Check'];
  if (chapterName === 'The number system') {
    return {
      objectives: skillObjectives('Mathematics', chapterName, topicName, verbs),
      article: article(topicName, chapterName, 'Mathematics', [
        `Real numbers combine rationals (quotients of integers) and irrationals (e.g. √2, π on the line). “${topicName}” builds the notation and laws you need before harder algebra.`,
        `Exponent laws shorten products of powers; scientific notation handles very large or small magnitudes. Radicals pair with rationalizing denominators when your form requires a rational denominator.`,
      ]),
      exercises: [
        ex('Which number is rational?', ['√2', 'π', '7/11', '√3'], 2, 'Quotient of integers.'),
        ex('Which is an integer?', ['√9', '0.25', '√5', '1/3'], 0, '√9 = 3.'),
        ex('Which is greater: −1.2 or −1.05?', ['−1.05', '−1.2', 'Equal', 'Cannot tell'], 0, 'Less negative is larger.'),
        ex('2³ × 2² equals', ['2⁵', '2⁶', '4⁵', '2'], 0, 'Add exponents when bases match.'),
        ex('Write 0.0034 in scientific notation a×10ⁿ with 1≤|a|<10.', ['3.4×10⁻³', '34×10⁻²', '3.4×10³', '0.34×10⁻²'], 0, 'Move decimal three places right.'),
      ],
      quizItems: [
        qz('Which is irrational in ℝ?', ['9/4', '√7', '−3', '0.125'], 1, '√7 is not a perfect square.'),
        qz('Value of 5⁰ + 2⁻³', ['1 1/8', '0', '1', '8/9'], 0, '1 + 1/8 = 9/8.'),
        qz('Rationalize 1/√2', ['√2/2', '2', '1/2', '2√2'], 0, 'Multiply by √2/√2.'),
        qz('Decimal of 1/8', ['0.125', '0.18', '0.12', '0.25'], 0, '8×125=1000.'),
        qz('Which is in standard scientific form (typical rule)?', ['3.1×10⁴', '31×10³', '0.31×10⁵', '31000'], 0, 'Coefficient often 1–10.'),
      ],
    };
  }

  if (chapterName === 'Solving equations') {
    const a = 2 + (k % 3),
      b = 3 + (k % 4),
      xans = 5 + (k % 2);
    const lhs = `${a}x + ${b}`;
    const rhs = a * xans + b;
    return {
      objectives: skillObjectives('Mathematics', chapterName, topicName, verbs),
      article: article(topicName, chapterName, 'Mathematics', [
        `Equations balance two expressions. “${topicName}” uses inverse operations and equivalent steps; check solutions in the original when you square or multiply by expressions that might be zero.`,
        `Systems in two variables: substitution isolates one unknown; elimination aligns coefficients. Absolute value gives two linear cases; radicals may need squaring and verification.`,
      ]),
      exercises: [
        ex(`Solve: ${lhs} = ${rhs}`, [`x = ${xans}`, `x = ${xans + 2}`, 'x = 0', `x = −1`], 0, 'Isolate x.'),
        ex('Solve |x − 2| = 5', ['x = 7 or −3', 'x = 7', 'x = −3', 'no solution'], 0, 'Two cases from |·|=a>0.'),
        ex('A root of x² − 5x + 6 = 0 is', ['x = 2', 'x = 5', 'x = 1', 'x = 6'], 0, 'Factor (x−2)(x−3).'),
        ex('Solve 3(x − 1) = 2x + 4', ['x = 7', 'x = 5', 'x = 1', 'x = −1'], 0, '3x−3 = 2x+4.'),
        ex('x + y = 5 and x − y = 1 give x =', ['3', '2', '4', '1'], 0, 'Add: 2x=6.'),
      ],
      quizItems: [
        qz('Why check after squaring both sides?', ['Extraneous roots can appear', 'Never needed', 'Removes solutions', 'Only for lines'], 0, 'Algebraic steps may not be reversible.'),
        qz('Solve 2y = 10', ['y = 5', 'y = 8', 'y = 2', 'y = 12'], 0, 'Divide by 2.'),
        qz('Factor x² − 9', ['(x−3)(x+3)', '(x+3)²', '(x−9)(x+1)', 'x²(1−9/x)'], 0, 'Difference of squares.'),
        qz('√(x+1)=3, x real, domain ok → x =', ['8', '4', '2', '10'], 0, 'x+1=9.'),
        qz('4z − 8 = 0 → z =', ['2', '4', '−2', '8'], 0, '4z=8.'),
      ],
    };
  }

  if (chapterName === 'Solving inequalities') {
    return {
      objectives: skillObjectives('Mathematics', chapterName, topicName, verbs),
      article: article(topicName, chapterName, 'Mathematics', [
        `Inequalities use <, ≤, >, ≥. Multiplying or dividing by a negative reverses the sign. “${topicName}” also covers regions for systems and cases for |x| and quadratics as in your book.`,
      ]),
      exercises: [
        ex('Solve −2x > 8', ['x < −4', 'x > −4', 'x > 4', 'x < 4'], 0, 'Divide by −2, flip sign.'),
        ex('3x + 1 ≤ 10 gives', ['x ≤ 3', 'x ≥ 3', 'x ≤ 11/3 wrong', 'x < 0'], 0, '3x≤9.'),
        ex('|x| < 2 means (real line)', ['−2 < x < 2', 'x>2', 'x<−2', 'x=±2'], 0, 'Open interval about 0.'),
        ex('Which fails x ≥ 1 and x ≤ 4?', ['x=0', 'x=2', 'x=4', 'x=1'], 0, '0 below range.'),
        ex('−x ≥ 5 implies', ['x ≤ −5', 'x ≥ −5', 'x ≥ 5', 'x ≤ 5'], 0, 'Multiply by −1, flip.'),
      ],
      quizItems: [
        qz('Multiply a < b by −3', ['−3a > −3b', '−3a < −3b', 'same', 'undefined'], 0, 'Flip inequality.'),
        qz('5 − x ≥ 2', ['x ≤ 3', 'x ≥ 3', 'x ≤ 7', 'x ≤ −3'], 0, '−x≥−3.'),
        qz('Graph x > 1 on number line: dot at 1', ['open, shade right', 'closed, left', 'closed both', 'no shade'], 0, 'Strict: hollow circle.'),
        qz('x² − 1 < 0 for real x', ['−1<x<1', 'x<-1', 'x>1', 'never'], 0, 'Between roots ±1.'),
        qz('System half-planes: solution set is usually', ['intersection of regions', 'union only', 'empty always', 'one point always'], 0, 'AND of constraints.'),
      ],
    };
  }

  if (chapterName === 'Introduction to trigonometry') {
    return {
      objectives: skillObjectives('Mathematics', chapterName, topicName, verbs),
      article: article(topicName, chapterName, 'Mathematics', [
        `Right triangle ratios: sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent. “${topicName}” uses consistent labeling with your diagram.`,
      ]),
      exercises: [
        ex('opp=3, hyp=5 → sin θ =', ['3/5', '4/5', '5/3', '3/4'], 0, 'opp/hyp.'),
        ex('tan 45° =', ['1', '0', '√2', '1/2'], 0, 'Isoceles right triangle.'),
        ex('3-4-5 triangle: tan at angle opposite 4', ['4/3', '3/4', '4/5', '5/4'], 0, 'opp/adj.'),
        ex('cos θ with adj=6, hyp=10', ['6/10', '8/10', '10/6', '6/8'], 0, 'adj/hyp.'),
        ex('Pythagorean: legs 5 and 12, hyp =', ['13', '17', '7', '√119'], 0, '25+144=169.'),
      ],
      quizItems: [
        qz('sin²θ + cos²θ =', ['1', '0', 'tan θ', '2'], 0, 'Identity for all θ.'),
        qz('sin 30°', ['1/2', '√3/2', '1', '0'], 0, 'Standard angle.'),
        qz('Angle in right triangle opposite longest side', ['90°', '30°', '45°', '60°'], 0, 'Right angle opposite hypotenuse.'),
        qz('cos 60°', ['1/2', '√3/2', '√2/2', '1'], 0, 'Complement of 30°.'),
        qz('If sin θ = 0.6 and θ acute, cos θ ≈', ['0.8', '0.36', '1.0', '0.6'], 0, '√(1−0.36).'),
      ],
    };
  }

  if (chapterName === 'Regular polygons') {
    return {
      objectives: skillObjectives('Mathematics', chapterName, topicName, verbs),
      article: article(topicName, chapterName, 'Mathematics', [
        `Interior angle sum of n-gon: (n−2)·180°. Regular n-gon: equal sides and angles. Exterior angles sum to 360°. “${topicName}” applies these to classify and compute angles.`,
      ]),
      exercises: [
        ex('Interior sum hexagon', ['720°', '540°', '360°', '900°'], 0, '(6−2)·180.'),
        ex('Each exterior angle regular octagon', ['45°', '60°', '40°', '50°'], 0, '360/8.'),
        ex('Interior angle regular pentagon', ['108°', '120°', '72°', '90°'], 0, '3·180/5.'),
        ex('If each exterior 30°, number of sides', ['12', '10', '15', '6'], 0, '360/30.'),
        ex('Convex: each interior <', ['180°', '360°', '90°', '270°'], 0, 'No reflex at vertex.'),
      ],
      quizItems: [
        qz('Interior + exterior at one convex vertex', ['180°', '90°', '360°', '0°'], 0, 'Straight line along side.'),
        qz('Triangle interior sum', ['180°', '360°', '270°', '90°'], 0, 'n=3.'),
        qz('Decagon interior sum', ['1440°', '1800°', '1080°', '720°'], 0, '(10−2)·180.'),
        qz('Square interior angle', ['90°', '60°', '120°', '45°'], 0, 'Regular 4-gon.'),
        qz('Sum of exterior angles walking once around convex polygon', ['360°', '180°', '(n−2)180', 'n·90'], 0, 'Full turn.'),
      ],
    };
  }

  if (chapterName === 'Congruency and similarity') {
    return {
      objectives: skillObjectives('Mathematics', chapterName, topicName, verbs),
      article: article(topicName, chapterName, 'Mathematics', [
        `Congruent figures match in shape and size (corresponding sides and angles equal). Similar figures have equal angles and proportional sides. “${topicName}” uses SSS, SAS, ASA, RHS for triangles; similarity scales lengths by ratio k, areas by k².`,
      ]),
      exercises: [
        ex('Two triangles: three pairs of equal sides → congruent by', ['SSS', 'SAS only', 'AAA only', 'RHS only'], 0, 'Side-side-side.'),
        ex('Similar triangles side ratio 1:2 → area ratio', ['1:4', '1:2', '1:8', '2:1'], 0, 'Areas scale as k².'),
        ex('All equilateral triangles are', ['similar (same angles)', 'congruent', 'neither', 'squares'], 0, '60° angles match.'),
        ex('AAA establishes', ['similarity', 'congruence always', 'nothing', 'perpendicular'], 0, 'Angles equal → similar.'),
        ex('If ΔABC ~ ΔDEF with AB=3, DE=6, ratio of sides B→E scale', ['2', '1/2', '3', '18'], 0, 'DE/AB = 2.'),
      ],
      quizItems: [
        qz('RHS congruence uses', ['right angle, hypotenuse, one leg', 'three angles', 'two legs only', 'area'], 0, 'Right-triangle case.'),
        qz('If two polygons similar, perimeters ratio 3:5, sides ratio', ['3:5', '9:25', '5:3', '√3:√5'], 0, 'Linear dimensions same ratio.'),
        qz('For general triangles, AAA alone proves', ['similarity', 'congruence', 'right angle', 'parallel lines'], 0, 'Same angles → proportional sides.'),
        qz('Scale factor k doubles each side → area multiplies by', ['4', '2', '8', 'k'], 0, 'Area ∝ k².'),
        qz('SAS similarity needs', ['two sides proportional and included angle equal', 'all sides equal', 'only angles', 'only one side'], 0, 'Included angle matches.'),
      ],
    };
  }

  if (chapterName === 'Vectors in two dimensions') {
    const verbsV = ['Represent', 'Add and resolve', 'Apply'];
    return {
      objectives: skillObjectives('Mathematics', chapterName, topicName, verbsV),
      article: article(topicName, chapterName, 'Mathematics', [
        `Vectors have magnitude and direction; scalars have magnitude only. “${topicName}” covers components, parallelogram/triangle rule for addition, scalar multiplication, and position vectors from an origin as in your text.`,
      ]),
      exercises: [
        ex('Which is a vector quantity?', ['velocity', 'mass', 'temperature', 'time'], 0, 'Has direction.'),
        ex('Vector (3,4) magnitude', ['5', '7', '12', '1'], 0, '√(9+16).'),
        ex('Double vector v doubles', ['its magnitude only if direction fixed', 'angle only', 'nothing', 'direction reverses'], 0, 'Scalar multiple k>0 scales length.'),
        ex('Adding (1,2) and (3,−1) gives', ['(4,1)', '(2,3)', '(3,2)', '(−2,3)'], 0, 'Component-wise.'),
        ex('Position vector of point (2,5) from origin', ['2i + 5j if basis used', 'zero', '7 only', '√29 only'], 0, 'Coordinates as vector.'),
      ],
      quizItems: [
        qz('Unit vector has length', ['1', '0', 'undefined', 'π'], 0, 'Normalized.'),
        qz('Subtracting same vector from itself gives', ['zero vector', 'unit vector', 'undefined', 'twice the vector'], 0, 'v−v=0.'),
        qz('3D not required in this topic; Grade 9 focus', ['plane vectors', 'only 3D', 'only scalars', 'only complex'], 0, 'Two components common.'),
        qz('Direction of (0,5)', ['along +y axis', 'along +x', 'zero vector', 'diagonal'], 0, 'Vertical.'),
        qz('If a = (2,1) and b = (1,3), a+b =', ['(3,4)', '(1,2)', '(2,3)', '(3,2)'], 0, 'Add components.'),
      ],
    };
  }

  if (chapterName === 'Statistics and probability') {
    const verbsS = ['Collect and summarize', 'Interpret', 'Compute probability for'];
    return {
      objectives: skillObjectives('Mathematics', chapterName, topicName, verbsS),
      article: article(topicName, chapterName, 'Mathematics', [
        `Statistics organizes data: mean, median, mode, spread. Probability models uncertainty with P(event) between 0 and 1. “${topicName}” follows definitions in your MoE textbook for samples vs populations.`,
      ]),
      exercises: [
        ex('Mean of 2, 4, 6', ['4', '3', '12', '5'], 0, 'Sum/3.'),
        ex('Median of 1, 3, 9, 10', ['6', '5', '9', '4'], 0, 'Average of middle two when even count? 1,3,9,10 → (3+9)/2=6.'),
        ex('Range of {5, 2, 8}', ['6', '8', '3', '10'], 0, '8−2.'),
        ex('P(fair coin head)', ['1/2', '1', '0', '1/4'], 0, 'Two equal outcomes.'),
        ex('Mode of {2,2,5,7}', ['2', '5', '7', 'none'], 0, 'Most frequent.'),
      ],
      quizItems: [
        qz('Probability of impossible event', ['0', '1', '1/2', 'undefined'], 0, 'Never happens.'),
        qz('Sample differs from population because', ['sample is subset, estimates population', 'they are always equal', 'sample is larger', 'population is smaller always'], 0, 'Inferential idea.'),
        qz('Variance measures', ['spread around mean', 'only center', 'only max', 'median only'], 0, 'Dispersion.'),
        qz('Two fair dice: probability sum equals 7', ['6/36', '7/36', '1/12', '5/36'], 0, 'Pairs (1,6)(2,5)(3,4)(4,3)(5,2)(6,1): six outcomes out of 36.'),
        qz('Bar chart best for', ['comparing categories', 'continuous time series only', 'correlation two numeric vars', 'pie only'], 0, 'Categorical comparison.'),
      ],
    };
  }

  return null;
}

function physicsPack(chapterName, topicName) {
  const verbs = ['Describe', 'Apply', 'Explain'];
  const base = {
    objectives: skillObjectives('Physics', chapterName, topicName, verbs),
    article: article(topicName, chapterName, 'Physics', [
      `Grade 9 physics introduces measurable quantities, motion, force, energy, simple machines, waves, and temperature. “${topicName}” ties observation to SI-style units and clear diagrams.`,
    ]),
  };
  const ex5 = [
    ex('Which is a vector quantity?', ['displacement', 'mass', 'temperature', 'time'], 0, 'Displacement has direction.'),
    ex('SI unit of force is', ['newton (N)', 'joule', 'watt', 'pascal'], 0, 'F = ma gives N = kg·m/s².'),
    ex('Speed = distance / time; unit m/s is', ['correct', 'always kg', 'always N', 'unitless'], 0, 'Derived unit.'),
    ex('First law: object stays at rest or constant v unless', ['net external force', 'heat', 'color', 'sound'], 0, 'Newton 1 inertia.'),
    ex('Frequency unit hertz means', ['cycles per second', 'meters only', 'kg', 'joules'], 0, 'Hz = s⁻¹.'),
  ];
  const q5 = [
    qz('Work unit', ['joule', 'newton', 'watt', 'metre'], 0, 'Energy transfer.'),
    qz('Power is', ['work per time', 'force only', 'mass×speed', 'distance only'], 0, 'P = W/t.'),
    qz('Sound is', ['mechanical wave', 'electromagnetic in vacuum only', 'static charge', 'only light'], 0, 'Needs medium usually.'),
    qz('Celsius to Kelvin: add', ['273.15 (approx 273)', '100', '32', '212'], 0, 'T_K = T_C + 273.15.'),
    qz('Friction opposes', ['relative motion', 'gravity always', 'normal force always', 'weight direction always'], 0, 'Parallel to surface.'),
  ];
  if (chapterName === 'Motion in a Straight Line') {
    return {
      ...base,
      article: article(topicName, chapterName, 'Physics', [
        `Position locates an object on a line; displacement is change in position (vector). Speed uses path length; velocity uses displacement over time. “${topicName}” connects graphs of position/time and velocity/time to stories of motion.`,
      ]),
      exercises: [
        ex('Distance 100 m in 20 s, average speed', ['5 m/s', '2 m/s', '2000 m/s', '0.2 m/s'], 0, '100/20.'),
        ex('Straight line: +3 km then −1 km displacement from start', ['+2 km', '4 km', '−2 km', '3 km'], 0, 'Net from origin.'),
        ex('Acceleration unit', ['m/s²', 'm/s', 'm²/s', 'N/kg'], 0, 'Rate of change of velocity.'),
        ex('Uniform motion means', ['constant velocity', 'zero distance', 'only at rest', 'increasing acceleration'], 0, 'v constant.'),
        ex('Slope of position–time graph is', ['velocity', 'acceleration', 'force', 'mass'], 0, 'dx/dt.'),
      ],
      quizItems: [
        qz('Instantaneous vs average speed can differ when', ['speed changes during interval', 'always equal', 'never defined', 'only in circles'], 0, 'Path vs interval.'),
        qz('Zero acceleration means velocity', ['constant', 'zero only', 'increasing', 'undefined'], 0, 'dv/dt=0.'),
        qz('Negative velocity on a line means', ['direction opposite chosen positive', 'impossible', 'always deceleration', 'always faster'], 0, 'Sign = direction.'),
        qz('Area under v–t graph often gives', ['displacement', 'force', 'mass', 'temperature'], 0, 'Integral interpretation.'),
        qz('km/h to m/s roughly multiply by', ['5/18', '18/5', '1000', '3600'], 0, '1 km/h = 1000/3600 m/s.'),
      ],
    };
  }
  return { ...base, exercises: ex5, quizItems: q5 };
}

function chemistryPack(chapterName, topicName) {
  const verbs = ['Define', 'Use symbols for', 'Predict'];
  const base = {
    objectives: skillObjectives('Chemistry', chapterName, topicName, verbs),
    article: article(topicName, chapterName, 'Chemistry', [
      `Particles, moles, formulas, periodic trends, and bonding explain matter. “${topicName}” follows your Grade 9 chemistry book: observation, measurement, then model.`,
    ]),
  };
  const ex5 = [
    ex('Atom is electrically neutral when', ['protons = electrons', 'only neutrons', 'more electrons', 'more protons always'], 0, 'Equal + and − charges.'),
    ex('Symbol for sodium', ['Na', 'S', 'So', 'N'], 0, 'Latin natrium.'),
    ex('Ionic bond forms between', ['metal and non-metal often', 'two metals only', 'noble gases only', 'identical atoms only'], 0, 'Electron transfer tendency.'),
    ex('Smallest particle keeping element identity in reaction', ['number of protons', 'mass number only', 'neutron count only', 'electron shells only'], 0, 'Atomic number defines element.'),
    ex('Periodic table columns called', ['groups', 'periods only', 'shells', 'ions'], 0, 'Vertical families.'),
  ];
  const q5 = [
    qz('Isotope differs in', ['neutron number', 'protons always', 'element name always', 'charge always'], 0, 'Same Z, different A.'),
    qz('Covalent bond', ['electron sharing', 'always electron sea', 'only in metals', 'no electrons'], 0, 'Non-metals often.'),
    qz('Law of definite proportions idea', ['compound has fixed element ratios by mass', 'random mixing', 'only gases', 'no compounds'], 0, 'Constant composition.'),
    qz('Atomic number 6 element', ['carbon', 'oxygen', 'nitrogen', 'boron'], 0, 'C has Z=6.'),
    qz('Noble gases tend to be', ['unreactive', 'most reactive metals', 'strong acids', 'liquid at room always'], 0, 'Full valence shells.'),
  ];
  if (chapterName === 'Structure of the Atom') {
    return {
      ...base,
      article: article(topicName, chapterName, 'Chemistry', [
        `Atoms contain nucleus (protons, neutrons) and electrons. “${topicName}” relates atomic number Z, mass number A, and isotopes; models evolved from Dalton to quantum picture in syllabus steps.`,
      ]),
      exercises: [
        ex('Proton charge', ['+e', '−e', '0', '2e'], 0, 'Fundamental +1 on scale of e.'),
        ex('Electron mass vs proton', ['much smaller', 'equal', 'larger', 'zero'], 0, 'electron ≪ proton.'),
        ex('Element with 11 protons', ['sodium', 'neon', 'magnesium', 'chlorine'], 0, 'Z=11 → Na.'),
        ex('Mass number A counts', ['protons + neutrons', 'electrons only', 'protons only', 'neutrons only'], 0, 'Nucleons.'),
        ex('Neutral atom has electrons equal to', ['atomic number', 'mass number', 'neutrons', 'zero'], 0, 'Balance charge.'),
      ],
      quizItems: [
        qz('Discovery sequence: electrons often credited broadly to', ['Thomson (cathode rays)', 'only Dalton', 'Faraday heat', 'nobody'], 0, 'Historical point in texts.'),
        qz('Isotope same element: same', ['proton number', 'neutron number always', 'mass always', 'chemical behavior always identical in all conditions'], 0, 'Z defines element.'),
        qz('Nuclide notation ¹⁴₆C implies protons', ['6', '14', '8', '20'], 0, 'Subscript Z.'),
        qz('Rutherford experiment suggested', ['small dense positive nucleus', 'uniform pudding only', 'no nucleus', 'only electrons'], 0, 'Scattering.'),
        qz('Ion Na⁺ has', ['one fewer electron than neutral Na', 'one more', 'same always', 'no protons'], 0, 'Lost valence e.'),
      ],
    };
  }
  return { ...base, exercises: ex5, quizItems: q5 };
}

function biologyPack(chapterName, topicName) {
  const verbs = ['Identify', 'Explain', 'Apply'];
  const base = {
    objectives: skillObjectives('Biology', chapterName, topicName, verbs),
    article: article(topicName, chapterName, 'Biology', [
      `Living organisms share cell structure, metabolism, response, growth, reproduction, adaptation. “${topicName}” matches Ethiopian Grade 9 biology: method, diversity, cells, reproduction, health, ecology.`,
    ]),
  };
  const ex5 = [
    ex('Cell theory: basic unit of life', ['cell', 'atom', 'tissue only', 'organ only'], 0, 'Cells.'),
    ex('Kingdom with prokaryotes in 5-kingdom scheme', ['Monera', 'Plantae only', 'Fungi only', 'Animalia only'], 0, 'Bacteria-like.'),
    ex('Mitochondrion mainly for', ['ATP / cellular respiration', 'photosynthesis', 'cell wall', 'chromosomes only'], 0, 'Energy.'),
    ex('DNA holds', ['genetic information', 'only proteins', 'water', 'glucose only'], 0, 'Hereditary code.'),
    ex('Ecology studies', ['organisms and environment', 'only atoms', 'only rocks', 'only stars'], 0, 'Interactions.'),
  ];
  const q5 = [
    qz('Plant cell has; animal typically lacks', ['cell wall', 'nucleus', 'membrane', 'cytoplasm'], 0, 'Cellulose wall in plants.'),
    qz('Binary fission common in', ['many bacteria', 'humans', 'moss spores only', 'birds'], 0, 'Asexual prokaryote.'),
    qz('Photosynthesis main input gas', ['CO₂', 'N₂ only', 'CO only', 'H₂ only'], 0, 'Carbon source.'),
    qz('Virus debated as living partly because', ['no independent metabolism', 'has many cells', 'always large', 'always producers'], 0, 'Needs host.'),
    qz('Biotic factor example', ['predator population', 'pH of soil', 'rainfall', 'temperature'], 0, 'Living component.'),
  ];
  if (chapterName === 'Cells') {
    return {
      ...base,
      article: article(topicName, chapterName, 'Biology', [
        `Cells carry out life processes; eukaryotes have membrane-bound organelles. “${topicName}” covers membrane transport, organelles, and comparison of plant and animal cells as in your textbook figures.`,
      ]),
      exercises: [
        ex('Control center of eukaryotic cell', ['nucleus', 'ribosome', 'vacuole', 'cell wall'], 0, 'DNA enclosed.'),
        ex('Passive transport needs no', ['ATP directly in simple diffusion', 'membrane', 'water', 'cells'], 0, 'Down gradient.'),
        ex('Site of protein synthesis (often taught)', ['ribosome', 'lysosome', 'vacuole', 'centriole'], 0, 'Translation.'),
        ex('Osmosis is diffusion of', ['water', 'protein only', 'DNA', 'organelles'], 0, 'Water across membrane.'),
        ex('Chloroplast found in', ['plant cells typically', 'animal cells', 'bacteria always', 'viruses'], 0, 'Photosynthesis.'),
      ],
      quizItems: [
        qz('Cell membrane is mainly', ['phospholipid bilayer', 'cellulose only', 'silica', 'pure DNA'], 0, 'Fluid mosaic model.'),
        qz('Active transport moves substances', ['against concentration gradient', 'always down gradient', 'only gases', 'without proteins'], 0, 'Needs energy often.'),
        qz('Lysosomes contain', ['digestive enzymes', 'chlorophyll', 'chlorophyll only', 'cellulose'], 0, 'Breakdown.'),
        qz('Largest organelle in many plant cells', ['central vacuole', 'nucleolus only', 'ribosome', 'centriole'], 0, 'Turgor.'),
        qz('Endoplasmic reticulum associated with', ['synthesis and transport', 'only photosynthesis', 'only ATP', 'cell wall build in animals'], 0, 'Rough/Smooth ER roles.'),
      ],
    };
  }
  return { ...base, exercises: ex5, quizItems: q5 };
}

/**
 * @returns {{ objectives: string[], article: string, exercises: object[], quizItems: object[], videoUrl?: string }}
 */
function buildRealPack(subjectName, chapterName, topicName) {
  if (subjectName === 'Mathematics') {
    const m = mathPack(chapterName, topicName);
    if (m) return m;
    return mathPack('The number system', topicName);
  }
  if (subjectName === 'Physics') return physicsPack(chapterName, topicName);
  if (subjectName === 'Chemistry') return chemistryPack(chapterName, topicName);
  if (subjectName === 'Biology') return biologyPack(chapterName, topicName);
  return mathPack('The number system', topicName);
}

module.exports = {
  buildRealPack,
  ex,
  qz,
};



Read