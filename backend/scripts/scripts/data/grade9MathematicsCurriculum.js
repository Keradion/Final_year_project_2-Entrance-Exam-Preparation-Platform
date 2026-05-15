/**
 * Grade 9 Mathematics — general secondary units
 * (sets, real numbers, exponents & radicals, polynomials, linear equations & inequalities,
 * coordinate geometry, plane geometry). Topics and objectives follow textbook-style sequencing.
 *
 * Per chapter: curated exercises in data may set topicIndex; seed pads to **7 exercises per topic** using grade9SeedContent.
 * Plus **one** Quiz record per topic (7 MCQ problems each).
 */

const letters = ['A', 'B', 'C', 'D'];

function quizChoices(opts) {
  return opts.map((text, i) => ({ text, value: letters[i] }));
}

module.exports = {
  gradeLevel: '9',
  subjectName: 'Mathematics',
  stream: 'Natural',
  subjectDescription:
    'Grade 9 Mathematics (Natural stream): sets through plane geometry.',

  chapters: [
    {
      chapterName: 'Unit 1: Sets',
      chapterDescription:
        'Set language, operations, Venn diagrams, and applications.',
      topics: [
        {
          topicName: 'Concept of a set and representation',
          topicDescription: 'Sets, elements, roster and rule methods, finite and infinite sets.',
          topicObjectives: [
            'Define a set and identify elements.',
            'Represent sets using roster and set-builder forms.',
            'Distinguish finite, infinite, and empty sets.',
          ],
        },
        {
          topicName: 'Subsets and set equality',
          topicDescription: 'Subset, proper subset, universal set, power set intuition.',
          topicObjectives: [
            'Decide whether one set is a subset of another.',
            'Use ⊆, ⊂, and equality of sets correctly.',
            'Relate subsets to Venn diagrams.',
          ],
        },
        {
          topicName: 'Union, intersection, and complement',
          topicDescription: 'Basic set operations and their properties.',
          topicObjectives: [
            'Compute A ∪ B and A ∩ B for small finite sets by listing elements.',
            'Find A′ given an explicit universal set U (list or rule).',
            'Read simple mixed expressions such as (A ∪ B) ∩ C when sets are given as lists.',
          ],
        },
        {
          topicName: 'Venn diagrams with two sets',
          topicDescription: 'Visualizing membership, disjoint sets, and regions.',
          topicObjectives: [
            'Label the four regions of two general circles: A\\B, B\\A, A∩B, and outside both.',
            'Connect a diagram shading to a word problem before using inclusion–exclusion.',
          ],
        },
        {
          topicName: 'Problem solving with sets',
          topicDescription: 'Word problems involving membership and operations.',
          topicObjectives: [
            'Translate verbal problems into set notation.',
            'Solve routine problems involving two sets.',
          ],
        },
      ],
      exercises: [
        {
          topicIndex: 0,
          title: 'Set notation',
          question: 'Which roster form represents “even integers from 2 to 6”?',
          options: ['{2, 3, 4, 5, 6}', '{2, 4, 6}', '{2, 4, 6, 8}', '{1, 2, 3}'],
          correctAnswer: 1,
          difficulty: 'Easy',
        },
        {
          topicIndex: 1,
          title: 'Subsets',
          question: 'If A = {1, 2} and B = {1, 2, 3}, which is true?',
          options: ['A ⊂ B only', 'B ⊆ A', 'A ⊆ B', 'A and B are disjoint'],
          correctAnswer: 2,
          difficulty: 'Easy',
        },
        {
          topicIndex: 2,
          title: 'Operations',
          question: 'Let U = {1,…,6}, A = {1, 2, 3}, B = {3, 4}. What is A ∩ B?',
          options: ['{3}', '{1, 2, 3, 4}', '{1, 2}', '∅'],
          correctAnswer: 0,
          difficulty: 'Medium',
        },
        {
          topicIndex: 3,
          title: 'Venn regions',
          question: 'In a Venn diagram with sets A and B, the region “both A and B” represents:',
          options: ['A ∪ B', 'A △ B', 'A ∩ B', 'A′'],
          correctAnswer: 2,
          difficulty: 'Easy',
        },
        {
          topicIndex: 4,
          title: 'Application',
          question:
            'In a class of 40, 25 take Math, 18 take English, 10 take both. How many take at least one?',
          options: ['33', '43', '53', '15'],
          correctAnswer: 0,
          difficulty: 'Medium',
        },
        {
          topicIndex: 0,
          title: 'Set-builder',
          question: '{x ∈ ℤ | −2 < x < 2} in roster form is:',
          options: ['{-2, -1, 0, 1, 2}', '{-1, 0, 1}', '{0, 1}', '{-2, 2}'],
          correctAnswer: 1,
          difficulty: 'Medium',
        },
        {
          topicIndex: 2,
          title: 'Complement',
          question: 'U = {1,2,3,4}, A = {1,4}. What is A′?',
          options: ['{1,4}', '{2,3}', '{1,2,3}', '∅'],
          correctAnswer: 1,
          difficulty: 'Easy',
        },
      ],
      quizzes: [
        {
          topicIndex: 0,
          title: 'Unit 1 Quiz 1 — Sets basics',
          problems: [
            {
              questionText: 'Which is correct for the empty set ∅?',
              choices: quizChoices([
                '∅ has exactly one element',
                '∅ ⊆ every set',
                '∅ = {0}',
                '|∅| = 1',
              ]),
              correctAnswer: 'B',
              answerExplanation: 'The empty set is a subset of every set; it has no elements.',
            },
            {
              questionText: 'Roster form of {x ∈ ℕ | x < 4} (treat ℕ = {1,2,3,…}) is:',
              choices: quizChoices(['{0,1,2,3}', '{1,2,3}', '{1,2,3,4}', '{4}']),
              correctAnswer: 'B',
              answerExplanation: 'Natural numbers less than 4 are 1, 2, and 3.',
            },
            {
              questionText: '{a, b} and {b, a} are:',
              choices: quizChoices(['Different sets', 'Equal sets', 'Disjoint', 'Infinite']),
              correctAnswer: 'B',
              answerExplanation: 'Order does not matter in roster notation.',
            },
            {
              questionText: 'If A = {2,4,6} and B = {4,6,8}, then A ∩ B is:',
              choices: quizChoices(['{4,6}', '{2,8}', '{2,4,6,8}', '∅']),
              correctAnswer: 'A',
              answerExplanation: 'Common elements are 4 and 6.',
            },
            {
              questionText: 'If every element of A is in B and A ≠ B, then:',
              choices: quizChoices([
                'A is a proper subset of B',
                'B is a proper subset of A',
                'A and B are disjoint',
                'A ∪ B = ∅',
              ]),
              correctAnswer: 'A',
              answerExplanation: 'Proper subset means A ⊆ B and there exists b ∈ B with b ∉ A.',
            },
            {
              questionText: '(A ∪ B)′ equals which expression (De Morgan)?',
              choices: quizChoices(['A′ ∪ B′', 'A′ ∩ B′', 'A ∩ B', 'U']),
              correctAnswer: 'B',
              answerExplanation: 'Complement of union is intersection of complements.',
            },
            {
              questionText: '|A ∪ B| = |A| + |B| − |A ∩ B| is used when:',
              choices: quizChoices([
                'A and B are disjoint only',
                'Counting elements in union of finite sets',
                'A is empty',
                'Never',
              ]),
              correctAnswer: 'B',
              answerExplanation: 'Inclusion–exclusion for two finite sets.',
            },
          ],
        },
        {
          topicIndex: 1,
          title: 'Unit 1 Quiz 2 — Subsets',
          problems: [
            {
              questionText: 'How many subsets does {p, q} have?',
              choices: quizChoices(['2', '3', '4', '8']),
              correctAnswer: 'C',
              answerExplanation: '2^n = 2^2 = 4 subsets including ∅ and the set itself.',
            },
            {
              questionText: 'If A ⊂ B and B ⊂ C, then:',
              choices: quizChoices(['A ⊂ C', 'C ⊂ A', 'A = C', 'A and C are disjoint']),
              correctAnswer: 'A',
              answerExplanation: 'Subset relation is transitive.',
            },
            {
              questionText: 'The set {∅} has how many elements?',
              choices: quizChoices(['0', '1', '2', 'Undefined']),
              correctAnswer: 'B',
              answerExplanation: 'It is a singleton whose only element is the empty set.',
            },
            {
              questionText: 'Which cannot be true for finite sets?',
              choices: quizChoices([
                'A ⊆ A',
                'A ⊂ A',
                '∅ ⊂ A if A ≠ ∅',
                '|A| = |A|',
              ]),
              correctAnswer: 'B',
              answerExplanation: 'Proper subset requires at least one element not in the subset; A ⊂ A is false.',
            },
            {
              questionText: 'If U = {1,2,3,4,5}, A = {1,2}, then A ∪ A′ =',
              choices: quizChoices(['A', '∅', 'U', '{3,4,5}']),
              correctAnswer: 'C',
              answerExplanation: 'A set union its complement is the universal set.',
            },
            {
              questionText: 'A △ B (symmetric difference) contains elements that are in:',
              choices: quizChoices([
                'Both A and B',
                'Neither A nor B',
                'Exactly one of A or B',
                'Only A',
              ]),
              correctAnswer: 'C',
              answerExplanation: 'Symmetric difference is (A∪B) \\ (A∩B).',
            },
            {
              questionText: 'If A ⊆ B, then A ∩ B equals:',
              choices: quizChoices(['B', 'A', 'U', '∅']),
              correctAnswer: 'B',
              answerExplanation: 'All elements of A lie in B, so intersection is A.',
            },
          ],
        },
        {
          topicIndex: 2,
          title: 'Unit 1 Quiz 3 — Operations',
          problems: [
            {
              questionText: '(A ∪ B) ∩ C is read as:',
              choices: quizChoices([
                'Elements in A or B and in C',
                'Elements in A and B or C',
                'Elements only in C',
                'Elements in none of the sets',
              ]),
              correctAnswer: 'A',
              answerExplanation: 'Union first, then intersection with C.',
            },
            {
              questionText: 'If A ∩ B = ∅, then A and B are:',
              choices: quizChoices(['Equal', 'Disjoint', 'Subsets', 'Infinite']),
              correctAnswer: 'B',
              answerExplanation: 'No common elements means disjoint.',
            },
            {
              questionText: 'A ∪ ∅ =',
              choices: quizChoices(['∅', 'A', 'U', 'Undefined']),
              correctAnswer: 'B',
              answerExplanation: 'Union with empty set leaves A unchanged.',
            },
            {
              questionText: 'A ∩ ∅ =',
              choices: quizChoices(['A', '∅', 'U', 'A′']),
              correctAnswer: 'B',
              answerExplanation: 'No elements in ∅ to share.',
            },
            {
              questionText: 'If A ⊆ B, then A ∪ B =',
              choices: quizChoices(['A', 'B', '∅', 'A ∩ B']),
              correctAnswer: 'B',
              answerExplanation: 'All of A is already in B, so union is B.',
            },
            {
              questionText: 'The complement of U is:',
              choices: quizChoices(['U', '∅', '{U}', 'A']),
              correctAnswer: 'B',
              answerExplanation: 'Everything not in U (within U) is empty.',
            },
            {
              questionText: 'Which identity is always true?',
              choices: quizChoices([
                'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)',
                'A ∪ (B ∩ C) = (A ∪ B) ∩ A',
                'A ∩ A′ = U',
                'A ∪ A′ = ∅',
              ]),
              correctAnswer: 'A',
              answerExplanation: 'Intersection distributes over union.',
            },
          ],
        },
        {
          topicIndex: 3,
          title: 'Unit 1 Quiz 4 — Venn diagrams',
          problems: [
            {
              questionText: 'Shaded “only A” region excludes:',
              choices: quizChoices(['A ∩ B', 'A \\ B', 'B only', 'U']),
              correctAnswer: 'A',
              answerExplanation: 'Only A means in A but not in B, so not in intersection.',
            },
            {
              questionText: 'Two disjoint non-empty sets in a Venn diagram:',
              choices: quizChoices([
                'Overlap completely',
                'Have empty intersection',
                'Must be equal',
                'Cannot appear',
              ]),
              correctAnswer: 'B',
              answerExplanation: 'Disjoint means no overlap.',
            },
            {
              questionText: 'The region A ∪ B includes:',
              choices: quizChoices([
                'Only A ∩ B',
                'Elements in A or B or both',
                'Elements outside both',
                'Only elements outside U',
              ]),
              correctAnswer: 'B',
              answerExplanation: 'Union collects all members of either set.',
            },
            {
              questionText: 'If |A only| = 5, |B only| = 4, |A ∩ B| = 2, then |A ∪ B| =',
              choices: quizChoices(['9', '11', '7', '13']),
              correctAnswer: 'B',
              answerExplanation: '5 + 4 + 2 = 11 (three disjoint pieces).',
            },
            {
              questionText: 'The complement of A ∩ B in U is:',
              choices: quizChoices(['A ∪ B', 'A′ ∩ B′', 'A′ ∪ B′', 'A ∩ B']),
              correctAnswer: 'C',
              answerExplanation: 'De Morgan: (A ∩ B)′ = A′ ∪ B′.',
            },
            {
              questionText: 'Elements in exactly one of A or B are counted by:',
              choices: quizChoices([
                '|A| + |B|',
                '|A ∪ B| − |A ∩ B|',
                '|A ∩ B|',
                '|U|',
              ]),
              correctAnswer: 'B',
              answerExplanation: 'Total in union minus overlap counts “exclusive or”.',
            },
            {
              questionText: 'Maximum regions created by two circles (general position) is:',
              choices: quizChoices(['2', '3', '4', '5']),
              correctAnswer: 'C',
              answerExplanation: 'Four regions: both, A only, B only, neither.',
            },
          ],
        },
        {
          topicIndex: 4,
          title: 'Unit 1 Quiz 5 — Applications',
          problems: [
            {
              questionText: 'If n(M only) = 12, n(M ∩ E) = 7, n(E only) = 9, then n(M ∪ E) =',
              choices: quizChoices(['21', '28', '19', '35']),
              correctAnswer: 'B',
              answerExplanation: '12 + 7 + 9 = 28.',
            },
            {
              questionText: 'A survey: 100 students, 60 like tea, 50 like coffee, 20 like both. How many like at least one?',
              choices: quizChoices(['90', '130', '110', '70']),
              correctAnswer: 'A',
              answerExplanation: '60 + 50 − 20 = 90.',
            },
            {
              questionText: 'Using same numbers, how many like neither (if everyone answered)?',
              choices: quizChoices(['10', '90', '20', '100']),
              correctAnswer: 'A',
              answerExplanation: '100 − 90 = 10.',
            },
            {
              questionText: "In inclusion–exclusion for three sets, the triple overlap is subtracted because:",
              choices: quizChoices([
                'It was counted three times then added back too much',
                'It should be zero',
                'It is always empty',
                'It equals U',
              ]),
              correctAnswer: 'A',
              answerExplanation: 'Principle adjusts for over-counting in unions.',
            },
            {
              questionText: 'If |A ∪ B| = 20, |A| = 15, |B| = 12, then |A ∩ B| =',
              choices: quizChoices(['7', '47', '3', '32']),
              correctAnswer: 'A',
              answerExplanation: '15 + 12 − 20 = 7.',
            },
            {
              questionText: 'Sets model “students who passed Math” and “passed English”. Passed both is:',
              choices: quizChoices(['Union', 'Intersection', 'Complement', 'Symmetric difference']),
              correctAnswer: 'B',
              answerExplanation: 'Both conditions means in the intersection.',
            },
            {
              questionText: 'If A ⊆ B and |A| = n, |B| = m, then:',
              choices: quizChoices(['n > m', 'n ≤ m', 'n = m always', 'n ≥ m always']),
              correctAnswer: 'B',
              answerExplanation: 'Subset cannot have more distinct elements than superset.',
            },
          ],
        },
      ],
    },

    {
      chapterName: 'Unit 2: The set of real numbers',
      chapterDescription:
        'Number sets, decimal representations, approximations, and absolute value on the real line.',
      topics: [
        {
          topicName: 'Natural numbers, integers, and rationals',
          topicDescription: 'Hierarchy ℕ ⊂ ℤ ⊂ ℚ; fractions and terminating or repeating decimals.',
          topicObjectives: [
            'Classify a given number as ℕ, ℤ, or ℚ with justification.',
            'Convert between fraction form and decimal form for rationals.',
          ],
        },
        {
          topicName: 'Irrational numbers and π',
          topicDescription: 'Non-repeating decimals; examples include √2 and π.',
          topicObjectives: [
            'Give examples of irrationals and explain why they are not in ℚ.',
            'Locate simple irrational lengths (e.g. √2) on a number line approximately using a right triangle idea.',
          ],
        },
        {
          topicName: 'The real number line',
          topicDescription: 'Ordering, density, approximation on ℝ.',
          topicObjectives: [
            'Compare real numbers using inequalities.',
            'Graph intervals on a number line.',
          ],
        },
        {
          topicName: 'Absolute value',
          topicDescription: 'Definition |a|, distance interpretation, simple equations |x| = k.',
          topicObjectives: [
            'Compute absolute values and interpret as distance.',
            'Solve |x| = c for c ≥ 0.',
          ],
        },
        {
          topicName: 'Rounding and significant digits',
          topicDescription: 'Practical approximations for measurements and calculations.',
          topicObjectives: [
            'Round decimals to a given place.',
            'Choose sensible precision in context.',
          ],
        },
      ],
      exercises: [
        {
          topicIndex: 0,
          title: 'Classification',
          question: 'Which is rational?',
          options: ['√2', 'π', '0.75', '0.1010010001… (non-repeating pattern)'],
          correctAnswer: 2,
          difficulty: 'Easy',
        },
        {
          topicIndex: 1,
          title: 'Irrationals',
          question: 'Which statement is true?',
          options: [
            'Every decimal is rational',
            '√4 is irrational',
            'The sum of two rationals is rational',
            'π is rational',
          ],
          correctAnswer: 2,
          difficulty: 'Easy',
        },
        {
          topicIndex: 2,
          title: 'Ordering',
          question: 'Which is smallest?',
          options: ['−0.25', '−1/3', '0', '−0.2'],
          correctAnswer: 1,
          difficulty: 'Medium',
        },
        {
          topicIndex: 3,
          title: 'Absolute value',
          question: '|−7| + |3 − 8| =',
          options: ['2', '12', '10', '0'],
          correctAnswer: 1,
          difficulty: 'Easy',
        },
        {
          topicIndex: 4,
          title: 'Rounding',
          question: 'Round 3.14159 to two decimal places:',
          options: ['3.14', '3.15', '3.1', '3.142'],
          correctAnswer: 0,
          difficulty: 'Easy',
        },
        {
          topicIndex: 2,
          title: 'Interval',
          question: 'Inequality −2 < x ≤ 3 on the number line includes:',
          options: ['−2 but not 3', '3 but not −2', 'Neither endpoint', 'Both −2 and 3'],
          correctAnswer: 1,
          difficulty: 'Medium',
        },
        {
          topicIndex: 3,
          title: '|x| = 5',
          question: 'Solutions of |x| = 5 on ℝ are:',
          options: ['5 only', '−5 only', '5 and −5', '25'],
          correctAnswer: 2,
          difficulty: 'Easy',
        },
      ],
      quizzes: [
        {
          topicIndex: 0,
          title: 'Unit 2 Quiz 1 — Number sets',
          problems: [
            {
              questionText: '−5 belongs to which set(s)?',
              choices: quizChoices(['ℕ only', 'ℤ only', 'ℚ only', 'ℤ and ℚ']),
              correctAnswer: 'D',
              answerExplanation: 'Integers are also rational.',
            },
            {
              questionText: 'A terminating decimal represents:',
              choices: quizChoices([
                'Always irrational',
                'Always rational',
                'Never rational',
                'Only π',
              ]),
              correctAnswer: 'B',
              answerExplanation: 'Terminating decimals are rationals p/10^k.',
            },
            {
              questionText: 'Which is an integer but not natural (ℕ = {1,2,…})?',
              choices: quizChoices(['0', '1', '−1/2', '√9']),
              correctAnswer: 'A',
              answerExplanation: '0 is an integer; not always counted as natural in Grade 9 texts.',
            },
            {
              questionText: '2/3 as a decimal is:',
              choices: quizChoices(['0.6̅6', '0.666… (repeating)', '0.67 exactly', 'Irrational']),
              correctAnswer: 'B',
              answerExplanation: 'Repeating decimal, hence rational.',
            },
            {
              questionText: 'Which is largest?',
              choices: quizChoices(['1/3', '0.33', '0.333', '34/100']),
              correctAnswer: 'A',
              answerExplanation: '1/3 = 0.333… > 0.33 and 0.333.',
            },
            {
              questionText: 'Closure: sum of two integers is:',
              choices: quizChoices(['Always integer', 'Sometimes irrational', 'Never integer', 'Always π']),
              correctAnswer: 'A',
              answerExplanation: 'Integers are closed under addition.',
            },
            {
              questionText: '√9 + √4 =',
              choices: quizChoices(['5', '√13', '√5', '7']),
              correctAnswer: 'A',
              answerExplanation: '3 + 2 = 5.',
            },
          ],
        },
        {
          topicIndex: 1,
          title: 'Unit 2 Quiz 2 — Irrationals',
          problems: [
            {
              questionText: 'Which is irrational?',
              choices: quizChoices(['0.25', '√5', '−13/7', '0']),
              correctAnswer: 'B',
              answerExplanation: '√5 is not a perfect square.',
            },
            {
              questionText: 'Between any two rationals on the line there exists:',
              choices: quizChoices([
                'No other numbers',
                'Only integers',
                'Another rational (and irrationals)',
                'Only π',
              ]),
              correctAnswer: 'C',
              answerExplanation: 'Density of rationals (and ℝ).',
            },
            {
              questionText: 'A repeating decimal is:',
              choices: quizChoices(['Always irrational', 'Always rational', 'Never rational', 'Not a number']),
              correctAnswer: 'B',
              answerExplanation: 'Geometric series gives fraction.',
            },
            {
              questionText: 'Which equals 1?',
              choices: quizChoices(['0.9̅', 'π/π − 1', '√2·√2 / 3', '0.99']),
              correctAnswer: 'A',
              answerExplanation: '0.999… = 1 in real numbers.',
            },
            {
              questionText: 'Square of an irrational can be rational. Example:',
              choices: quizChoices(['(√2)² = 2', '(π)² rational', '(√2)² irrational', 'None']),
              correctAnswer: 'A',
              answerExplanation: '√2 is irrational, its square is 2.',
            },
            {
              questionText: 'Real numbers fill:',
              choices: quizChoices(['Gaps on rationals only', 'The number line completely', 'Only negatives', 'Only [0,1]']),
              correctAnswer: 'B',
              answerExplanation: 'Completeness idea at intuitive level.',
            },
            {
              questionText: 'Which is false?',
              choices: quizChoices([
                'Every integer is rational',
                'Every rational is real',
                'Every real is rational',
                '√2 is real',
              ]),
              correctAnswer: 'C',
              answerExplanation: 'Irrationals are real but not rational.',
            },
          ],
        },
        {
          topicIndex: 2,
          title: 'Unit 2 Quiz 3 — Number line',
          problems: [
            {
              questionText: 'If a < b, then on the line a lies:',
              choices: quizChoices(['To the right of b', 'To the left of b', 'At b', 'Cannot compare']),
              correctAnswer: 'B',
              answerExplanation: 'Smaller numbers are left.',
            },
            {
              questionText: 'Interval notation for {x | 1 ≤ x < 4} is:',
              choices: quizChoices(['(1,4)', '[1,4)', '(1,4]', '[1,4]']),
              correctAnswer: 'B',
              answerExplanation: 'Include 1, exclude 4.',
            },
            {
              questionText: 'Which is equivalent to x > −3?',
              choices: quizChoices(['(−3, ∞)', '(−∞, −3)', '[−3, ∞)', '(−3, −3]']),
              correctAnswer: 'A',
              answerExplanation: 'Open ray to the right of −3.',
            },
            {
              questionText: 'If x ∈ (2, 5), which is always true?',
              choices: quizChoices(['x = 2', 'x = 5', '2 < x < 5', 'x ≤ 2']),
              correctAnswer: 'C',
              answerExplanation: 'Open interval excludes endpoints.',
            },
            {
              questionText: 'Compare −4/5 and −3/4:',
              choices: quizChoices(['−4/5 > −3/4', '−4/5 < −3/4', 'Equal', 'Cannot']),
              correctAnswer: 'B',
              answerExplanation: '−0.8 < −0.75.',
            },
            {
              questionText: 'The opposite of a negative number is:',
              choices: quizChoices(['Negative', 'Positive', 'Zero', 'Irrational']),
              correctAnswer: 'B',
              answerExplanation: '−(−a) = a > 0 if a was negative.',
            },
            {
              questionText: 'Density idea: between 0.1 and 0.2 we can find:',
              choices: quizChoices(['No numbers', 'Many rationals', 'Only one number', 'Only irrationals']),
              correctAnswer: 'B',
              answerExplanation: 'Infinitely many rationals between.',
            },
          ],
        },
        {
          topicIndex: 3,
          title: 'Unit 2 Quiz 4 — Absolute value',
          problems: [
            {
              questionText: '|−4| · |2| =',
              choices: quizChoices(['−8', '8', '6', '−6']),
              correctAnswer: 'B',
              answerExplanation: '4 · 2 = 8.',
            },
            {
              questionText: '|x − 3| when x = 1 equals:',
              choices: quizChoices(['2', '−2', '4', '0']),
              correctAnswer: 'A',
              answerExplanation: '|1 − 3| = |−2| = 2.',
            },
            {
              questionText: 'Solutions of |x| = 6 on ℝ are:',
              choices: quizChoices(['6 only', '−6 only', '6 and −6', '36']),
              correctAnswer: 'C',
              answerExplanation: 'Distance 6 from 0 in either direction.',
            },
            {
              questionText: 'Distance between −3 and 5 on the number line is:',
              choices: quizChoices(['2', '8', '15', '−8']),
              correctAnswer: 'B',
              answerExplanation: '|5 − (−3)| = 8.',
            },
            {
              questionText: 'If |a| = 4 and a < 0, then a =',
              choices: quizChoices(['4', '−4', '±4', '0']),
              correctAnswer: 'B',
              answerExplanation: 'Negative number with magnitude 4.',
            },
            {
              questionText: '|7 − 10| =',
              choices: quizChoices(['−3', '3', '17', '70']),
              correctAnswer: 'B',
              answerExplanation: '|−3| = 3.',
            },
            {
              questionText: 'Which is always true for all real x, y?',
              choices: quizChoices([
                '|x + y| > |x| + |y|',
                '|x + y| = |x| + |y|',
                '|x + y| ≤ |x| + |y|',
                '|xy| = |x| + |y|',
              ]),
              correctAnswer: 'C',
              answerExplanation: 'Triangle inequality for real numbers.',
            },
          ],
        },
        {
          topicIndex: 4,
          title: 'Unit 2 Quiz 5 — Rounding & precision',
          problems: [
            {
              questionText: 'Round 7.864 to one decimal place:',
              choices: quizChoices(['7.8', '7.9', '8.0', '7.86']),
              correctAnswer: 'B',
              answerExplanation: 'Hundredths digit 6 rounds 8 up to 9 → 7.9.',
            },
            {
              questionText: '2.049 rounded to the nearest hundredth is:',
              choices: quizChoices(['2.04', '2.05', '2.00', '2.1']),
              correctAnswer: 'B',
              answerExplanation: 'Thousandths 9 rounds hundredths 4 up to 5.',
            },
            {
              questionText: '0.00340 written with correct significant figures has:',
              choices: quizChoices(['3 significant digits', '5', '2', '6']),
              correctAnswer: 'A',
              answerExplanation: '3, 4, and trailing 0 after 4 count; leading zeros do not.',
            },
            {
              questionText: 'Best estimate of 19.2 × 4.1 using rounded values 19 and 4:',
              choices: quizChoices(['76', '80', '100', '20']),
              correctAnswer: 'A',
              answerExplanation: '19 × 4 = 76.',
            },
            {
              questionText: 'Round 156.5 to the nearest integer:',
              choices: quizChoices(['156', '157', '160', '150']),
              correctAnswer: 'B',
              answerExplanation: 'Tenths digit 5 rounds 6 up in common school rule → 157.',
            },
            {
              questionText: 'Round 12.344 to two decimal places:',
              choices: quizChoices(['12.30', '12.34', '12.35', '12.4']),
              correctAnswer: 'B',
              answerExplanation: 'Digit in thousandths is 4 (< 5), so hundredths stay 4 → 12.34.',
            },
            {
              questionText: 'Truncating 8.97 to one decimal (cut after tenths) gives:',
              choices: quizChoices(['9.0', '8.9', '8.0', '9.9']),
              correctAnswer: 'B',
              answerExplanation: 'Truncate: keep 8.9, do not round up.',
            },
          ],
        },
      ],
    },
  ].concat(require('./grade9MathematicsUnits3to7')),
};
