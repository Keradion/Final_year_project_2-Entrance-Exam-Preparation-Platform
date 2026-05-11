/**
 * Per-topic teaching content and assessments aligned to chapter themes (MoE Grade 9 Natural).
 * Articles are plain text (no HTML). Exercises and quizzes use real subject matter, not meta-learning prompts.
 */

const { buildRealPack, ex, qz } = require('./grade9McqGenerators');

function objectivesTriplet(specific) {
  return [specific.obj1, specific.obj2, specific.obj3];
}

// ---------------------------------------------------------------------------
// Mathematics — Further on sets (full substance)
// ---------------------------------------------------------------------------

const MATH_SETS = {
  'Sets and Elements': {
    objectives: {
      obj1: 'Identify whether a given collection is a set (well-defined objects).',
      obj2: 'Use membership notation and distinguish elements from non-elements.',
      obj3: 'Represent simple finite sets in roster form.',
    },
    article: [
      'Sets and Elements',
      'In school mathematics, a set is a well-defined collection of distinct objects. “Well-defined” means: given any object, everyone can agree whether it belongs to the collection or not—there is no guessing based on opinion.',
      'Examples that are sets: the set of even digits in {0,1,2,3,4,5,6,7,8,9}, the set of provincial capitals in a fixed list, the set of Grade 9 students registered in a single class roster. Examples that are usually not sets for mathematics: “all tall students” (height threshold not fixed), “interesting numbers” (subjective).',
      'Each object that is in the set is called an element. If x is an element of set A, we write x ∈ A. If it is not, we write x ∉ A. Capital letters A, B, C, … often name sets; lowercase letters often name elements.',
      'Two sets are equal if they have exactly the same elements; order does not matter in roster notation. Repeating an element when you list a set does not add new members: {1, 2, 2} is the same set as {1, 2}.',
      'Learning objectives for this section',
      '• Identify whether a given collection is a set (well-defined objects).',
      '• Use membership notation and distinguish elements from non-elements.',
      '• Represent simple finite sets in roster form.',
    ].join('\n\n'),
    exercise: {
      question: 'Which of the following is a set in the mathematical sense?',
      options: [
        'The collection of all “difficult” problems in the textbook (no fixed rule).',
        'The set of vowels in the English alphabet: {a, e, i, o, u}.',
        'The collection of the three nicest cities in the world (opinion-based).',
        'All heavy bags in the market without a weight limit.',
      ],
      correctAnswer: 1,
      hint: 'A set must be well-defined: membership should be clear without personal judgment.',
    },
    quizItems: [
      {
        questionText: 'Which statement about the collection {2, 4, 6, 8} is correct?',
        choices: [
          { text: '8 is an element of the set.', value: 'A' },
          { text: '5 is an element of the set.', value: 'B' },
          { text: 'The set has five different elements.', value: 'C' },
          { text: 'Order matters, so {8,6,4,2} is a different set.', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: '8 ∈ {2, 4, 6, 8}. Roster order does not change the set; there are four elements.',
      },
      {
        questionText: 'Which symbol correctly states that 3 is not in the set {1, 5, 7}?',
        choices: [
          { text: '3 ∉ {1, 5, 7}', value: 'A' },
          { text: '3 ∈ {1, 5, 7}', value: 'B' },
          { text: '3 ⊂ {1, 5, 7}', value: 'C' },
          { text: '3 = {1, 5, 7}', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: '∉ means “is not an element of.” Subset notation (⊂) is for sets compared to sets, not for a single element.',
      },
      {
        questionText: 'Which collection is NOT suitable to be treated as a set in Grade 9 work?',
        choices: [
          { text: 'The set of whole-number multiples of 10 between 10 and 50.', value: 'A' },
          { text: 'The set of all “famous” scientists (no precise membership rule).', value: 'B' },
          { text: 'The set {Monday, Tuesday, Wednesday}.', value: 'C' },
          { text: 'The set of prime numbers less than 10.', value: 'D' },
        ],
        correctAnswer: 'B',
        answerExplanation: '“Famous” is not a precise mathematical rule, so the collection is not well-defined.',
      },
    ],
  },

  'Set Description': {
    objectives: {
      obj1: 'Describe a set using words, roster notation, or set-builder form.',
      obj2: 'Translate between verbal rules and symbolic notation.',
      obj3: 'Read conditions such as {x | …} correctly.',
    },
    article: [
      'Set Description',
      'You can describe the same set in several ways. Roster (or tabular) notation lists the elements inside braces: A = {3, 5, 7}. Set-builder notation gives a rule: B = {x | x is an odd integer between 2 and 8}. The vertical bar “|” is read “such that.”',
      'In verbal form you might say: “B is the set of odd integers strictly between 2 and 8,” which matches {3, 5, 7}. Always check every condition in the rule: parity (odd/even), bounds (strict or inclusive), and the universe of objects you allow (integers only, real numbers, letters, etc.).',
      'When you copy set-builder notation, do not change the condition silently. For example {x | x² = 4 and x ∈ ℤ} has elements −2 and 2; {x | x = √4} without saying which root can be ambiguous—your textbook fixes conventions.',
      'Learning objectives for this section',
      '• Describe a set using words, roster notation, or set-builder form.',
      '• Translate between verbal rules and symbolic notation.',
      '• Read conditions such as {x | …} correctly.',
    ].join('\n\n'),
    exercise: {
      question: 'Which roster notation matches {x | x is an integer and 1 ≤ x ≤ 4}?',
      options: ['{2, 3}', '{1, 2, 3, 4}', '{1, 2, 3}', '{0, 1, 2, 3, 4}'],
      correctAnswer: 1,
      hint: 'Include every integer from 1 through 4 inclusive.',
    },
    quizItems: [
      {
        questionText: 'Set-builder notation {x | x is a day of the week starting with “T”} in roster form is:',
        choices: [
          { text: '{Tuesday, Thursday}', value: 'A' },
          { text: '{Today, Tomorrow}', value: 'B' },
          { text: '{T}', value: 'C' },
          { text: '{Tuesday only}', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Tuesday and Thursday start with T in English day names.',
      },
      {
        questionText: 'What does the symbol “|” mean inside {x | condition}?',
        choices: [
          { text: '“such that”', value: 'A' },
          { text: '“divided by”', value: 'B' },
          { text: '“or”', value: 'C' },
          { text: '“and also” (always between two sets only)', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'In set-builder form, | introduces the condition on x.',
      },
      {
        questionText: 'If A = {n | n is a natural number less than 4}, which element is NOT in A (using ℕ = {1,2,3,…})?',
        choices: [
          { text: '4', value: 'A' },
          { text: '1', value: 'B' },
          { text: '3', value: 'C' },
          { text: '2', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Natural numbers less than 4 are 1, 2, and 3; 4 is not less than 4.',
      },
    ],
  },

  'Empty set, Finite and Infinite set': {
    objectives: {
      obj1: 'Recognize the empty set and its notation (∅ or {}).',
      obj2: 'Classify sets as finite or infinite from their definition.',
      obj3: 'Give examples of finite and infinite sets from arithmetic and geometry.',
    },
    article: [
      'Empty set, finite and infinite sets',
      'The empty set has no elements. It is written ∅ or {}. Do not confuse ∅ with {0}: the first has zero elements; the second has one element, the number zero.',
      'A finite set can be counted: you can list all elements in principle and finish. An infinite set cannot be matched one-to-one with {1, 2, …, n} for any fixed n. Examples of infinite sets in Grade 9 work: ℕ, ℤ, the set of all even integers. Examples of finite sets: the fingers on one hand, the set of vertices of a given triangle.',
      'Cardinality |A| is the number of elements when A is finite. For example |{a, b, c}| = 3 and |∅| = 0.',
      'Learning objectives for this section',
      '• Recognize the empty set and its notation (∅ or {}).',
      '• Classify sets as finite or infinite from their definition.',
      '• Give examples of finite and infinite sets from arithmetic and geometry.',
    ].join('\n\n'),
    exercise: {
      question: 'Which set is the empty set?',
      options: ['{0}', '{∅}', '∅', '{{}} if ∅ is an element'],
      correctAnswer: 2,
      hint: 'The empty set has no elements; {0} contains one element.',
    },
    quizItems: [
      {
        questionText: 'The set {x | x is an integer and x² = −1} (within real numbers) is:',
        choices: [
          { text: 'Empty', value: 'A' },
          { text: '{−1, 1}', value: 'B' },
          { text: '{i, −i}', value: 'C' },
          { text: '{0}', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'No real integer squares to −1, so no elements satisfy the condition.',
      },
      {
        questionText: 'Which set is finite?',
        choices: [
          { text: '{1, 2, 3, 4, 5}', value: 'A' },
          { text: 'The set of all positive integers', value: 'B' },
          { text: 'The set of all points on a line', value: 'C' },
          { text: 'The set of all multiples of 3', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'A fixed finite roster is finite; the others continue without end.',
      },
      {
        questionText: 'What is |{a, b, a, b}|?',
        choices: [
          { text: '2', value: 'A' },
          { text: '4', value: 'B' },
          { text: '0', value: 'C' },
          { text: '1', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Repeated listings do not add distinct elements; only a and b.',
      },
    ],
  },

  'Basic Properties and Relationships of Sets': {
    objectives: {
      obj1: 'Use subset (⊆), proper subset, and equality of sets correctly.',
      obj2: 'Identify the universal set and how it frames complement (preview).',
      obj3: 'Apply properties such as A ⊆ A and ∅ ⊆ A for any set A.',
    },
    article: [
      'Basic properties and relationships of sets',
      'Subset: A ⊆ B means every element of A is also in B. If A ⊆ B and B has at least one element not in A, then A is a proper subset, written A ⊂ B in many textbooks. Two sets are equal (A = B) if A ⊆ B and B ⊆ A.',
      'For every set A, A ⊆ A. Also, the empty set is a subset of every set: ∅ ⊆ A, because there is no element of ∅ that could fail to lie in A (vacuous truth).',
      'The universal set U (for a given problem) is the reference bag from which every set under discussion is taken. Complement and other operations are defined relative to U in later sections.',
      'Learning objectives for this section',
      '• Use subset (⊆), proper subset, and equality of sets correctly.',
      '• Identify the universal set and how it frames complement (preview).',
      '• Apply properties such as A ⊆ A and ∅ ⊆ A for any set A.',
    ].join('\n\n'),
    exercise: {
      question: 'Let A = {1, 2} and B = {1, 2, 3}. Which statement is true?',
      options: [
        'A ⊂ B and A ⊆ B.',
        'B is a subset of A.',
        'A and B have no elements in common.',
        'A = B.',
      ],
      correctAnswer: 0,
      hint: 'Every element of A lies in B; 3 is in B but not in A.',
    },
    quizItems: [
      {
        questionText: 'Which is always true for any set A?',
        choices: [
          { text: '∅ ⊆ A', value: 'A' },
          { text: 'A ⊂ A', value: 'B' },
          { text: '|A| = 0', value: 'C' },
          { text: 'A = ∅', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'The empty set is a subset of every set. A ⊂ A is false for proper subset; A ⊆ A is true.',
      },
      {
        questionText: 'If C = {x, y} and D = {y, x}, then:',
        choices: [
          { text: 'C = D', value: 'A' },
          { text: 'C is a proper subset of D', value: 'B' },
          { text: 'C and D are disjoint only', value: 'C' },
          { text: 'C has more elements than D', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Same elements ⇒ same set; order in roster form does not matter.',
      },
      {
        questionText: 'The set of all Grade 9 learners in one named section is taken from the universal set “all learners in that school.” If E is that section’s set, which is necessarily true?',
        choices: [
          { text: 'E ⊆ U for that problem', value: 'A' },
          { text: 'U ⊆ E always', value: 'B' },
          { text: 'E is always empty', value: 'C' },
          { text: 'E must equal U', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Every set discussed is a subset of the chosen universal set.',
      },
    ],
  },

  'Operation on Sets: Union and Intersection': {
    objectives: {
      obj1: 'Compute A ∪ B and A ∩ B from rosters or simple rules.',
      obj2: 'Interpret union as “or” and intersection as “and” in careful mathematical use.',
      obj3: 'Use Venn-style reasoning for two sets with listed elements.',
    },
    article: [
      'Union and intersection',
      'The union A ∪ B is {x | x ∈ A or x ∈ B (or both)}. In roster work you list every element that appears in either set once each. The intersection A ∩ B is {x | x ∈ A and x ∈ B}. If there is no common element, A ∩ B = ∅; the sets are called disjoint.',
      'Example: If A = {1, 2, 3} and B = {3, 4, 5}, then A ∪ B = {1, 2, 3, 4, 5} and A ∩ B = {3}. Always look for duplicates only once in the union.',
      'Learning objectives for this section',
      '• Compute A ∪ B and A ∩ B from rosters or simple rules.',
      '• Interpret union as “or” and intersection as “and” in careful mathematical use.',
      '• Use Venn-style reasoning for two sets with listed elements.',
    ].join('\n\n'),
    exercise: {
      question: 'Let P = {2, 4, 6} and Q = {4, 6, 8}. What is P ∩ Q?',
      options: ['{4, 6}', '{2, 8}', '{2, 4, 6, 8}', '{6} only'],
      correctAnswer: 0,
      hint: 'Intersection lists elements that appear in BOTH sets.',
    },
    quizItems: [
      {
        questionText: 'If A = {a, b} and B = {c, d}, what is A ∪ B?',
        choices: [
          { text: '{a, b, c, d}', value: 'A' },
          { text: '{a, b, c}', value: 'B' },
          { text: '∅', value: 'C' },
          { text: '{a, c}', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Union gathers every element from both disjoint rosters.',
      },
      {
        questionText: 'Which pair of sets has an empty intersection?',
        choices: [
          { text: '{1, 2} and {3, 4}', value: 'A' },
          { text: '{1, 2} and {2, 3}', value: 'B' },
          { text: '{5} and {5}', value: 'C' },
          { text: '∅ and ∅', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'No shared element between {1,2} and {3,4}; hence disjoint here.',
      },
      {
        questionText: 'If x ∈ A ∩ B, which must be true?',
        choices: [
          { text: 'x ∈ A and x ∈ B', value: 'A' },
          { text: 'x ∈ A or x ∈ B only (not necessarily both)', value: 'B' },
          { text: 'x ∉ A', value: 'C' },
          { text: 'x is not in B', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Intersection requires membership in BOTH sets.',
      },
    ],
  },

  'Operation on Sets: Complement and Difference': {
    objectives: {
      obj1: 'Find A′ (complement relative to U) when A and U are given as rosters.',
      obj2: 'Compute set difference A \\ B = {x | x ∈ A and x ∉ B}.',
      obj3: 'Relate complement and difference using the universal set.',
    },
    article: [
      'Complement and difference',
      'Given a universal set U and A ⊆ U, the complement A′ (or A^c) is {x ∈ U | x ∉ A}. Everything “outside” A but still inside U.',
      'The set difference A \\ B (also written A − B) means elements that are in A but not in B. If U is fixed and B ⊆ U, then A \\ B = A ∩ B′ when A ⊆ U as well in the same universe.',
      'Example: U = {1, 2, 3, 4, 5}, A = {1, 2, 3}. Then A′ = {4, 5}. If B = {2, 4}, A \\ B = {1, 3}.',
      'Learning objectives for this section',
      '• Find A′ (complement relative to U) when A and U are given as rosters.',
      '• Compute set difference A \\ B = {x | x ∈ A and x ∉ B}.',
      '• Relate complement and difference using the universal set.',
    ].join('\n\n'),
    exercise: {
      question: 'Let U = {1, 2, 3, 4, 5, 6} and A = {2, 4, 6}. What is A′?',
      options: ['{1, 3, 5}', '{2, 4, 6}', '{1, 2, 3}', '∅'],
      correctAnswer: 0,
      hint: 'Complement in U lists elements of U not in A.',
    },
    quizItems: [
      {
        questionText: 'If A = {3, 6, 9} and B = {6, 12}, what is A \\ B?',
        choices: [
          { text: '{3, 9}', value: 'A' },
          { text: '{6}', value: 'B' },
          { text: '{12}', value: 'C' },
          { text: '{3, 6, 9, 12}', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Remove elements of B from A; only 6 is removed from A.',
      },
      {
        questionText: 'For U = {10, 20, 30} and A = {10}, what is A′?',
        choices: [
          { text: '{20, 30}', value: 'A' },
          { text: '{10}', value: 'B' },
          { text: '∅', value: 'C' },
          { text: 'U', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Complement is everything in U that is not in A.',
      },
      {
        questionText: 'Which describes A \\ B in words?',
        choices: [
          { text: 'Elements in A that are not in B', value: 'A' },
          { text: 'Elements in B only', value: 'B' },
          { text: 'Elements in A or B', value: 'C' },
          { text: 'Always the same as A ∪ B', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Set difference keeps A-side elements excluding those shared in B.',
      },
    ],
  },

  'Applications of sets': {
    objectives: {
      obj1: 'Model simple surveys with two categories using union and intersection.',
      obj2: 'Translate a word problem into sets and fill a Venn count.',
      obj3: 'Check that totals in a class do not double-count intersection.',
    },
    article: [
      'Applications of sets',
      'Many timetable and survey stories hide set operations. If some learners play football, some play volleyball, and some play both, the “play at least one sport” set is the union; “play both” is the intersection. Always ask whether the problem wants union, intersection, complement, or a count that subtracts double-counted people.',
      'A classic pattern: |A ∪ B| = |A| + |B| − |A ∩ B| for finite sets. Without subtracting |A ∩ B| you count people in both sports twice.',
      'When you read Ministry-style word problems, underline nouns that become sets (learners who passed, learners who take physics, etc.) and note the universal set (e.g., all Grade 9 students in one school).',
      'Learning objectives for this section',
      '• Model simple surveys with two categories using union and intersection.',
      '• Translate a word problem into sets and fill a Venn count.',
      '• Check that totals in a class do not double-count intersection.',
    ].join('\n\n'),
    exercise: {
      question:
        'In a class of 40 learners, 25 take Mathematics club (set M) and 18 take Science club (set S). If 10 take both, how many take at least one of the clubs? (Use |M ∪ S| = |M| + |S| − |M ∩ S|)',
      options: ['33', '43', '53', '15'],
      correctAnswer: 0,
      hint: '25 + 18 − 10 = 33.',
    },
    quizItems: [
      {
        questionText: 'Why do we subtract |A ∩ B| when we compute |A ∪ B| from |A| and |B|?',
        choices: [
          { text: 'Because elements in both sets were counted twice.', value: 'A' },
          { text: 'Because union means “only A.”', value: 'B' },
          { text: 'Because intersection is always empty.', value: 'C' },
          { text: 'To turn union into difference.', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: 'Adding |A| and |B| counts shared elements twice; subtract |A ∩ B| once.',
      },
      {
        questionText: 'If everyone in U is in A or B but not both, then A ∩ B equals:',
        choices: [
          { text: '∅', value: 'A' },
          { text: 'U', value: 'B' },
          { text: 'A ∪ B', value: 'C' },
          { text: 'Cannot tell', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: '“Not both” means no element in the intersection; disjoint sets inside U.',
      },
      {
        questionText: 'Which real situation maps naturally to intersection?',
        choices: [
          { text: 'Learners who pass BOTH Mathematics AND English.', value: 'A' },
          { text: 'Every learner in the school.', value: 'B' },
          { text: 'Learners who take Mathematics or Science but not both.', value: 'C' },
          { text: 'All learners not in Mathematics.', value: 'D' },
        ],
        correctAnswer: 'A',
        answerExplanation: '“Both” conditions correspond to intersection of the two groups.',
      },
    ],
  },
};

// Extra MCQs so each “Further on sets” topic seeds five exercises and five quiz problems.
const SETS_PAD = {
  'Sets and Elements': {
    ex5: ex(
      'Roster form for “even digits in {1,2,3,4,5,6,7,8,9}”?',
      ['{2,4,6,8}', '{1,3,5,7,9}', '{0,2,4}', '{2,4}'],
      0,
      'Even digits among 1–9 are 2, 4, 6, 8.'
    ),
    qz4: qz('How many distinct elements in {7, 7, 8}?', ['2', '3', '1', '0'], 0, 'Duplicates do not add members.'),
    qz5: qz('Which is correct notation for “x is not in A”?', ['x ∉ A', 'x ⊆ A', 'A ∈ x', 'x ⊂ A'], 0, '∉ means not an element.'),
  },
  'Set Description': {
    ex5: ex(
      'Which roster matches {n | n is an even integer, 2 ≤ n ≤ 8}?',
      ['{2,4,6,8}', '{2,4,6}', '{4,6,8}', '{2,3,4,5,6,7,8}'],
      0,
      'Even integers from 2 through 8 inclusive.'
    ),
    qz4: qz('Set-builder “{x | x is a prime less than 8}” in roster form includes', ['{2,3,5,7}', '{1,3,5,7}', '{2,3,5}', '{7}'], 0, 'Primes below 8: 2, 3, 5, 7.'),
    qz5: qz('{x | x² = 4 and x is an integer} equals', ['{−2, 2}', '{2}', '{−2}', '{4}'], 0, 'Two integer solutions.'),
  },
  'Empty set, Finite and Infinite set': {
    ex5: ex(
      'Which set is infinite in typical Grade 9 work?',
      ['{1,2,3,…} as all positive integers', '{1,…,100}', '{0}', '{∅}'],
      0,
      'No largest element; listing never finishes.'
    ),
    qz4: qz('|{∅}| equals', ['1', '0', '2', 'undefined'], 0, 'One element: the empty set itself, as a member.'),
    qz5: qz('{x ∈ ℤ | 0 < x < 1} is', ['∅', '{0}', '{1}', '{1/2}'], 0, 'No integer strictly between 0 and 1.'),
  },
  'Basic Properties and Relationships of Sets': {
    ex5: ex(
      'Let A = {5, 10}. Which is false?',
      ['10 ∉ A', 'A ⊆ A', '∅ ⊆ A', '{5} ⊆ A'],
      0,
      '10 is an element of A.'
    ),
    qz4: qz('If every element of A is in B and A ≠ B, then A is a', ['proper subset of B', 'superset of B', 'complement of B', 'universal set'], 0, 'A ⊂ B: subset but not equal.'),
    qz5: qz('A = {1,2} and B = {2,1} implies', ['A = B', 'A ⊂ B only', 'A ∩ B = ∅', '|A| ≠ |B|'], 0, 'Same elements ⇒ same set.'),
  },
  'Operation on Sets: Union and Intersection': {
    ex5: ex(
      'If M = {2,5} and N = {5,9}, what is M ∪ N?',
      ['{2,5,9}', '{5}', '{2,9}', '{2,5,5,9}'],
      0,
      'List each element once.'
    ),
    qz4: qz('If A ∩ B = ∅, sets A and B are called', ['disjoint', 'equal', 'subsets surely infinite', 'universal'], 0, 'No common elements.'),
    qz5: qz('For any finite A, |A ∪ A| equals', ['|A|', '2|A|', '0', '|A|²'], 0, 'Union with itself does not duplicate.'),
  },
  'Operation on Sets: Complement and Difference': {
    ex5: ex(
      'Let U = {2,4,6,8} and D = {4}. What is D′ (complement in U)?',
      ['{2,6,8}', '{4}', '∅', 'U'],
      0,
      'All elements of U not in D.'
    ),
    qz4: qz('For any A (within fixed U), A ∩ A′ equals', ['∅', 'A', 'U', 'A′'], 0, 'No element is both in A and not in A.'),
    qz5: qz('(A′)′ relative to the same U equals', ['A', 'U', '∅', 'A′'], 0, 'Double complement returns A.'),
  },
  'Applications of sets': {
    ex5: ex(
      '|A| = 12, |B| = 9, |A ∩ B| = 4. What is |A ∪ B|?',
      ['17', '25', '21', '5'],
      0,
      '12 + 9 − 4 = 17.'
    ),
    qz4: qz('Number in A only (not B) uses', ['|A| − |A ∩ B|', '|A| + |B|', '|A ∩ B| only', '|U| − |A|'], 0, 'Remove the overlap count from A.'),
    qz5: qz('In a Venn with two clubs, “both clubs” is represented by', ['A ∩ B', 'A ∪ B', 'A′', 'U only'], 0, 'Intersection = both.'),
  },
};

function stripObjectivesSection(article) {
  return article
    .replace(/\n\nLearning objectives for this section[\s\S]*$/m, '')
    .replace(/\n\nLearning objectives[\s\S]*$/m, '')
    .trim();
}

function quizItemToExercise(qi) {
  const idx = qi.choices.findIndex((c) => c.value === qi.correctAnswer);
  return {
    question: qi.questionText,
    options: qi.choices.map((c) => c.text),
    correctAnswer: idx >= 0 ? idx : 0,
    hint: (qi.answerExplanation || '').slice(0, 200),
  };
}

function normalizeMathSetsPayload(topicName) {
  const block = MATH_SETS[topicName];
  const pad = SETS_PAD[topicName];
  if (!block || !pad) return null;
  return {
    objectives: objectivesTriplet(block.objectives),
    article: stripObjectivesSection(block.article),
    exercises: [block.exercise, ...block.quizItems.map(quizItemToExercise), pad.ex5],
    quizItems: [...block.quizItems, pad.qz4, pad.qz5],
  };
}

/**
 * @returns {{ objectives: string[], article: string, exercises: object[], quizItems: object[], videoUrl?: string }}
 */
function getTopicPayload(subjectName, chapterName, topicName) {
  if (subjectName === 'Mathematics' && chapterName === 'Further on sets') {
    const setsPayload = normalizeMathSetsPayload(topicName);
    if (setsPayload) return setsPayload;
  }
  return buildRealPack(subjectName, chapterName, topicName);
}

module.exports = { getTopicPayload };
