/**
 * MoE Ethiopia–style Grade 9 Mathematics — Units 3–7 (Natural stream).
 * Each unit: 5 topics, curated exercises by topicIndex, 7 quizzes × 7 problems. Seed pads to 7 exercises per topic.
 */

const letters = ['A', 'B', 'C', 'D'];

function quizChoices(opts) {
  return opts.map((text, i) => ({ text, value: letters[i] }));
}

/** Quiz problem shorthand */
function Q(questionText, optionStrings, correctLetter, answerExplanation = '') {
  return {
    questionText,
    choices: quizChoices(optionStrings),
    correctAnswer: correctLetter,
    answerExplanation,
  };
}

module.exports = [
  {
    chapterName: 'Unit 3: Exponents, radicals, and scientific notation',
    chapterDescription:
      'Laws of exponents, radicals, simplification, and scientific notation as in MoE Grade 9 mathematics.',
    topics: [
      {
        topicName: 'Integer exponents and laws',
        topicDescription: 'Product, quotient, and power rules for exponents.',
        topicObjectives: [
          'Apply product, quotient, and power laws only after bases match.',
          'Rewrite multi-step powers so each base appears once before evaluating.',
        ],
      },
      {
        topicName: 'Zero and negative exponents',
        topicDescription: 'Definitions a^0 = 1 (a≠0) and a^(−n) = 1/a^n.',
        topicObjectives: [
          'Evaluate expressions with zero or negative exponents.',
          'Rewrite expressions using only positive exponents.',
        ],
      },
      {
        topicName: 'nth roots and radicals',
        topicDescription: 'Square roots, cube roots, and principal root.',
        topicObjectives: [
          'Relate √x and x^(1/2) at an introductory level.',
          'Simplify √(a²) = |a| for real a.',
        ],
      },
      {
        topicName: 'Simplifying radical expressions',
        topicDescription: 'Product rule for radicals and rationalizing denominators (simple cases).',
        topicObjectives: [
          'Simplify √a · √b = √(ab) for non-negative a, b.',
          'Rationalize denominators of the form 1/√a.',
        ],
      },
      {
        topicName: 'Scientific notation',
        topicDescription: 'Writing large and small numbers as m × 10^k with 1 ≤ |m| < 10.',
        topicObjectives: [
          'Convert between standard and scientific notation.',
          'Multiply and divide numbers in scientific notation.',
        ],
      },
    ],
    exercises: [
      {
        topicIndex: 0,
        title: 'Laws',
        question: 'Simplify x^5 · x^3 (assume x ≠ 0):',
        options: ['x^8', 'x^15', 'x^2', '2x^8'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 1,
        title: 'Negative exponent',
        question: '2^(−3) equals:',
        options: ['8', '−8', '1/8', '−1/8'],
        correctAnswer: 2,
        difficulty: 'Easy',
      },
      {
        topicIndex: 2,
        title: 'Radical',
        question: '√36 =',
        options: ['6', '±6 in principal root grade context', '18', '72'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 3,
        title: 'Simplify √12',
        question: '√12 in simplest radical form is:',
        options: ['4√3', '2√3', '3√2', '6√2'],
        correctAnswer: 1,
        difficulty: 'Medium',
      },
      {
        topicIndex: 4,
        title: 'Scientific',
        question: '3400 written in scientific notation is:',
        options: ['34 × 10^2', '3.4 × 10^3', '3.4 × 10^4', '0.34 × 10^4'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 0,
        title: 'Power of power',
        question: '(y^3)^2 =',
        options: ['y^5', 'y^6', 'y^9', '2y^3'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 3,
        title: 'Rationalize',
        question: 'Rationalizing 1/√2 gives:',
        options: ['√2/2', '√2', '1/2', '2'],
        correctAnswer: 0,
        difficulty: 'Medium',
      },
    ],
    quizzes: [
      {
        topicIndex: 0,
        title: 'Unit 3 Quiz 1 — Exponent laws',
        problems: [
          Q('a^4 · a^2 equals:', ['a^6', 'a^8', '2a^6', 'a^3'], 'A', 'Add exponents when bases match.'),
          Q('(b^3)^4 equals:', ['b^7', 'b^12', 'b^81', '12b'], 'B', 'Multiply exponents.'),
          Q('(2x)^3 equals:', ['6x^3', '8x^3', '2x^3', '8x'], 'B', '2^3 x^3.'),
          Q('x^7 / x^2 (x≠0) equals:', ['x^5', 'x^9', 'x^3.5', '5'], 'A', 'Subtract exponents.'),
          Q('((−1)^5)^2 equals:', ['−1', '1', '25', '−25'], 'B', 'Odd then even power.'),
          Q('(3a^2)(4a^3) equals:', ['7a^5', '12a^5', '12a^6', '7a^6'], 'B', 'Multiply coefficients; add exponents.'),
          Q('Which is not always true for a≠0?', ['a^1 = a', 'a^0 = 1', 'a^2 = (−a)^2', 'a^(1/2) = −√a'], 'D', 'Principal square root is non-negative for non-negative a.'),
        ],
      },
      {
        topicIndex: 1,
        title: 'Unit 3 Quiz 2 — Zero & negative',
        problems: [
          Q('(−5)^0 equals:', ['0', '1', '−1', 'Undefined'], 'B', 'Non-zero base to zero is 1.'),
          Q('3^(−2) =', ['−9', '−1/9', '1/9', '9'], 'C'),
          Q('Rewrite x^(−4) with positive exponent:', ['−x^4', 'x^4', '1/x^4', '4/x'], 'C'),
          Q('(2^3 · 2^(−2)) simplifies to:', ['2^5', '2^1', '2^(−6)', '1'], 'B'),
          Q('(1/2)^(−3) =', ['1/8', '−8', '8', '−1/8'], 'C', 'Reciprocal cube.'),
          Q('0^0 in school context is typically:', ['0', '1', 'Undefined / context-dependent', '∞'], 'C', 'Often treated as indeterminate.'),
          Q('(a^(−2))(a^5) for a≠0:', ['a^3', 'a^(−10)', 'a^7', '1/a^7'], 'A'),
        ],
      },
      {
        topicIndex: 2,
        title: 'Unit 3 Quiz 3 — Radicals',
        problems: [
          Q('√49 =', ['7', '±7', '24.5', '9'], 'A', 'Principal root non-negative.'),
          Q('√( (−5)^2 ) =', ['−5', '5', '25', '−25'], 'B', 'Equals |−5|.'),
          Q('³√27 =', ['3', '9', '81', '±3'], 'A'),
          Q('Which is irrational?', ['√9', '√10', '4/5', '0'], 'B'),
          Q('√2 · √8 =', ['√10', '4', '16', '2√2'], 'B', '√16 = 4.'),
          Q('√(x^2) for real x simplifies to:', ['x', '−x', '|x|', 'x^4'], 'C'),
          Q('Square side area 81 m² has side:', ['9 m', '40.5 m', '18 m', '6561 m'], 'A'),
        ],
      },
      {
        topicIndex: 3,
        title: 'Unit 3 Quiz 4 — Simplify radicals',
        problems: [
          Q('√50 simplifies to:', ['5√2', '25√2', '2√25', '10√5'], 'A', '√25·√2.'),
          Q('√18/√2 =', ['√9', '3', '9', '√36'], 'B', '√(18/2)=√9.'),
          Q('(2√3)^2 =', ['4√3', '12', '6', '36'], 'B', '4·3=12.'),
          Q('1/√5 rationalized:', ['√5/5', '√5', '5', '1/5'], 'A'),
          Q('√(32) =', ['4√2', '8√2', '16√2', '2√8'], 'A'),
          Q('Which equals √6?', ['√2·√3', '√2+√3', '√5+1', '√12'], 'A'),
          Q('√x · √x for x ≥ 0 equals:', ['x', 'x²', '√(x²)', '2√x'], 'A'),
        ],
      },
      {
        topicIndex: 4,
        title: 'Unit 3 Quiz 5 — Scientific notation',
        problems: [
          Q('0.0042 in scientific notation:', ['4.2×10^3', '4.2×10^(−3)', '42×10^(−2)', '0.42×10^(−2)'], 'B'),
          Q('(2×10^3)(3×10^4) =', ['6×10^7', '6×10^12', '5×10^7', '5×10^12'], 'A'),
          Q('(8×10^6)/(2×10^2) =', ['4×10^4', '4×10^8', '6×10^4', '6×10^3'], 'A'),
          Q('520000 =', ['5.2×10^5', '5.2×10^4', '52×10^4', '5.2×10^6'], 'A'),
          Q('1.2×10^(−1) as decimal:', ['12', '1.2', '0.12', '0.012'], 'C'),
          Q('Adding 3×10^2 + 2×10^3 in scientific form (approx):', ['2.3×10^3', '5×10^5', '5×10^2', '3.2×10^2'], 'A'),
          Q('Which is smallest?', ['9×10^(−3)', '2×10^(−2)', '5×10^(−4)', '1×10^(−2)'], 'C', '5×10^(−4) = 0.0005.'),
        ],
      },
    ],
  },

  {
    chapterName: 'Unit 4: Polynomials',
    chapterDescription:
      'Polynomial vocabulary, operations, special products, and introductory division as in MoE Grade 9.',
    topics: [
      {
        topicName: 'Terms, degree, and standard form',
        topicDescription: 'Polynomial in one variable; leading coefficient; degree.',
        topicObjectives: [
          'Identify terms, coefficients, and degree.',
          'Write polynomials in descending powers.',
        ],
      },
      {
        topicName: 'Adding and subtracting polynomials',
        topicDescription: 'Combine like terms.',
        topicObjectives: [
          'Add polynomials horizontally or vertically.',
          'Subtract by distributing −1.',
        ],
      },
      {
        topicName: 'Multiplying polynomials',
        topicDescription: 'Distribute; multiply monomial × polynomial.',
        topicObjectives: [
          'Multiply monomial by polynomial.',
          'Multiply binomial by binomial.',
        ],
      },
      {
        topicName: 'Special products',
        topicDescription: '(a+b)², (a−b)², (a+b)(a−b).',
        topicObjectives: [
          'Expand squares of binomials.',
          'Apply difference of squares.',
        ],
      },
      {
        topicName: 'Dividing polynomials by monomials',
        topicDescription: 'Split numerator; reduce powers.',
        topicObjectives: [
          'Divide each term of a polynomial by a monomial.',
        ],
      },
    ],
    exercises: [
      {
        topicIndex: 0,
        title: 'Degree',
        question: 'Degree of 5x³ − 2x + 7 is:',
        options: ['5', '3', '4', '1'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 1,
        title: 'Add',
        question: '(3x + 2) + (x − 5) =',
        options: ['4x − 3', '4x + 3', '2x − 3', '3x^2 − 3'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 2,
        title: 'Multiply',
        question: '2x(3x − 1) =',
        options: ['6x² − 2x', '6x − 1', '5x − 2x', '6x² − 1'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 3,
        title: 'Square',
        question: '(x + 3)² =',
        options: ['x² + 9', 'x² + 6x + 9', 'x² + 3x + 9', '2x + 6'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 4,
        title: 'Divide',
        question: '(8x³ − 4x²) ÷ (2x) =',
        options: ['4x² − 2x', '4x³ − 2x', '6x²', '4x − 2'],
        correctAnswer: 0,
        difficulty: 'Medium',
      },
      {
        topicIndex: 2,
        title: 'Binomial',
        question: '(x − 2)(x + 4) =',
        options: ['x² + 2x − 8', 'x² − 2x − 8', 'x² + 8', 'x² − 8'],
        correctAnswer: 0,
        difficulty: 'Medium',
      },
      {
        topicIndex: 3,
        title: 'Difference of squares',
        question: '(2a − 5)(2a + 5) =',
        options: ['4a² − 25', '4a² + 25', '2a² − 25', '4a − 25'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
    ],
    quizzes: [
      {
        topicIndex: 0,
        title: 'Unit 4 Quiz 1 — Vocabulary',
        problems: [
          Q('Leading coefficient of −2x⁴ + x − 1 is:', ['1', '−2', '4', '−1'], 'B'),
          Q('Constant term of 3x² − 7x + 4 is:', ['3', '−7', '4', '0'], 'C'),
          Q('Which is a binomial?', ['x²', 'x+1', 'x²+x+1', '5'], 'B'),
          Q('Standard form requires exponents:', ['Ascending', 'Descending', 'Any order', 'Only even'], 'B'),
          Q('Degree of non-zero constant 8 is:', ['8', '1', '0', 'Undefined'], 'C'),
          Q('Like terms in 3x² + 2x + x² are:', ['3x² and 2x', '3x² and x²', '2x and x²', 'None'], 'B'),
          Q('Polynomial in x has negative exponents?', ['Always', 'Never in this course', 'Sometimes', 'Only degree 1'], 'B'),
        ],
      },
      {
        topicIndex: 1,
        title: 'Unit 4 Quiz 2 — Add/subtract',
        problems: [
          Q('(5y − 3) − (2y + 4) =', ['3y − 7', '3y + 1', '7y + 1', '7y − 7'], 'A'),
          Q('(x² + 2x) + (3x² − x) =', ['4x² + x', '4x² + 3x', '2x² + x', '3x³'], 'A'),
          Q('Subtract 4a from 2a² + a:', ['2a² − 3a', '2a² + 5a', '2a² − 5a', '−2a² + 3a'], 'A'),
          Q('Simplify 3 − (1 − m):', ['2 − m', '2 + m', '4 − m', '4 + m'], 'B'),
          Q('Perimeter of triangle with sides (x+1), x, (2x−3):', ['4x − 2', '3x − 1', '4x + 4', '2x + 2'], 'A'),
          Q('(8p) + (−8p) + p =', ['0', 'p', '16p', '−p'], 'B'),
          Q('Which simplifies to 0?', ['x+x', 'x−x', 'x·0', 'x/ x'], 'B', 'x≠0 for last.'),
        ],
      },
      {
        topicIndex: 2,
        title: 'Unit 4 Quiz 3 — Multiply',
        problems: [
          Q('−3x²(x − 2) =', ['−3x³ − 6x²', '−3x³ + 6x²', '3x³ + 6x²', '−3x − 6'], 'B'),
          Q('(x+5)(x−5) =', ['x² − 25', 'x² + 25', 'x² − 10x − 25', 'x² + 10'], 'A'),
          Q('(2x−1)(3x+4) =', ['6x²+5x−4', '6x²−4', '5x−4', '6x+3'], 'A', '6x²+8x−3x−4.'),
          Q('Expand (x+2)³ for practice grade 9 style — first (x+2)² then:', ['x³+8', 'x²+4x+4 times (x+2)', 'Use binomial cube', 'x³+6x²+12x+8'], 'D', 'Recognize pattern.'),
          Q('Area rectangle (x+3) by (x−1):', ['x²+2x−3', 'x²+4x+3', 'x²−3', '2x+2'], 'A'),
          Q('(a+b)(a+b) differs from (a+b)(a−b) by:', ['Sign of middle term', 'b² sign', 'Both', 'No difference'], 'B'),
          Q('−2(3−x) =', ['−6+2x', '−6−2x', '6−2x', '−5+x'], 'A'),
        ],
      },
      {
        topicIndex: 3,
        title: 'Unit 4 Quiz 4 — Special products',
        problems: [
          Q('(m−4)² =', ['m²−16', 'm²−8m+16', 'm²+16', 'm²+8m+16'], 'B'),
          Q('(2k+3)² =', ['4k²+9', '4k²+12k+9', '2k²+6k+9', '4k²+6k+9'], 'B'),
          Q('(x+7)(x−7) =', ['x²−49', 'x²+49', 'x²−14x−49', '2x'], 'A'),
          Q('(a+1)² − (a−1)² simplifies to:', ['2', '4a', '2a²', '0'], 'B', 'Difference 4a.'),
          Q('Which expands to x²+6x+9?', ['(x+3)²', '(x+9)²', '(x+6)²', '(x+1)²'], 'A'),
          Q('(√x + √y)(√x − √y) for x,y≥0:', ['x−y', 'x+y', 'xy', 'x²−y²'], 'A'),
          Q('Error: (x+y)² = x²+y² is wrong because missing:', ['xy', '2xy', 'y²', 'x²'], 'B'),
        ],
      },
      {
        topicIndex: 4,
        title: 'Unit 4 Quiz 5 — Division',
        problems: [
          Q('(12x⁴) ÷ (3x) =', ['4x³', '4x⁴', '9x³', '36x⁵'], 'A'),
          Q('(6a² + 3a) ÷ (3a), a≠0:', ['2a+1', '2a−1', '2a²+a', '3a'], 'A'),
          Q('(10x⁵ − 5x³) ÷ (5x³):', ['2x² − 1', '2x⁵ − 1', '5x² − 1', '2 − x'], 'A'),
          Q('Divide (8y²) by (−2y), y≠0:', ['−4y', '4y', '−16y³', '−4y²'], 'A'),
          Q('If (x²−x)/x = x−1, x≠0, which value fails?', ['x=2', 'x=1', 'x=−1', 'x=0'], 'D', 'Division by zero.'),
          Q('(9x³) ÷ (3x²) =', ['3x', '3x²', '27x', '3/x'], 'A'),
          Q('Simplify (4ab²)/(2a), a≠0:', ['2b²', '2ab', '2ab²', '2/a'], 'A'),
        ],
      },
    ],
  },

  {
    chapterName: 'Unit 5: Linear equations and inequalities',
    chapterDescription:
      'Solving linear equations and inequalities in one variable and simple modeling (MoE Grade 9).',
    topics: [
      {
        topicName: 'Linear equations in one variable',
        topicDescription: 'ax + b = c; multi-step equations.',
        topicObjectives: [
          'Isolate the variable using inverse operations.',
          'Verify solutions by substitution.',
        ],
      },
      {
        topicName: 'Equations with fractions and decimals',
        topicDescription: 'Clear denominators; decimal coefficients.',
        topicObjectives: [
          'Solve equations involving rational coefficients.',
        ],
      },
      {
        topicName: 'Literal equations and formulas',
        topicDescription: 'Solve for a chosen variable (e.g. d = rt for t).',
        topicObjectives: [
          'Rearrange formulas encountered in science contexts.',
        ],
      },
      {
        topicName: 'Linear inequalities',
        topicDescription: 'Inequality rules; graph on number line.',
        topicObjectives: [
          'Solve ax+b < c and graph solution sets.',
          'Understand sign flip when multiplying by a negative.',
        ],
      },
      {
        topicName: 'Modeling with equations',
        topicDescription: 'Translate word problems to equations.',
        topicObjectives: [
          'Set up and solve problems about numbers, ages, and rates.',
        ],
      },
    ],
    exercises: [
      {
        topicIndex: 0,
        title: 'Solve',
        question: 'Solve 2x − 5 = 9:',
        options: ['x = 7', 'x = 2', 'x = 14', 'x = −7'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 1,
        title: 'Fraction',
        question: 'Solve x/2 + 1 = 4:',
        options: ['x = 6', 'x = 10', 'x = 3', 'x = 5'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 2,
        title: 'Literal',
        question: 'Solve C = 2πr for r:',
        options: ['r = C/(2π)', 'r = 2π/C', 'r = C − 2π', 'r = πC/2'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 3,
        title: 'Inequality',
        question: 'Solve −3x > 12:',
        options: ['x > −4', 'x < −4', 'x > 4', 'x < 4'],
        correctAnswer: 1,
        difficulty: 'Medium',
      },
      {
        topicIndex: 4,
        title: 'Word',
        question: 'The sum of a number and 8 is 23. The number is:',
        options: ['31', '15', '14', '−15'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 0,
        title: 'Multi-step',
        question: 'Solve 3(x − 1) = 2x + 4:',
        options: ['x = 5', 'x = 7', 'x = 1', 'x = −5'],
        correctAnswer: 1,
        difficulty: 'Medium',
      },
      {
        topicIndex: 3,
        title: 'Compound',
        question: 'Which values satisfy 1 < x ≤ 3?',
        options: ['x = 0', 'x = 1', 'x = 2', 'x = 4'],
        correctAnswer: 2,
        difficulty: 'Easy',
      },
    ],
    quizzes: [
      {
        topicIndex: 0,
        title: 'Unit 5 Quiz 1 — Linear equations',
        problems: [
          Q('5x + 2 = 17 ⇒ x =', ['3', '4', '5', '15/5'], 'A', '5x=15.'),
          Q('7 − 2x = 1 ⇒ x =', ['3', '−3', '4', '−4'], 'A', '2x=6.'),
          Q('4(x+2)=20 ⇒ x =', ['2', '3', '5', '7'], 'B', 'x+2=5.'),
          Q('3x = 2x − 5 ⇒', ['x = −5', 'x = 5', 'x = 0', 'No solution'], 'A'),
          Q('Equation with no solution: 2x+1 = 2x+3 has:', ['x=0', 'x=1', 'No solution', 'Infinite solutions'], 'C'),
          Q('Equation 3(x−1)=3x−3 has:', ['Unique x', 'No solution', 'Infinitely many solutions', 'x=1 only'], 'C'),
          Q('Solve (x−3)/2 = 4:', ['x = 5', 'x = 11', 'x = 8', 'x = 10'], 'B', 'x−3=8.'),
        ],
      },
      {
        topicIndex: 1,
        title: 'Unit 5 Quiz 2 — Fractions/decimals',
        problems: [
          Q('x/3 − x/6 = 1 ⇒ x =', ['2', '3', '6', '1'], 'C', 'x/6=1.'),
          Q('0.3x + 1.7 = 5 ⇒ x =', ['9', '11', '12', '10'], 'B', '0.3x=3.3 ⇒ x=11.'),
          Q('1/2 + x/4 = 2 ⇒ x =', ['4', '6', '8', '10'], 'B', 'x/4=1.5 ⇒ x=6.'),
          Q('2/x = 1/3 (x≠0) ⇒ x =', ['3/2', '6', '2/3', '5'], 'B', 'Cross multiply.'),
          Q('0.25x = 2 ⇒ x =', ['0.5', '8', '4', '50'], 'B'),
          Q('(2x−1)/5 = 3 ⇒ x =', ['7', '8', '15', '16'], 'B', '2x−1=15 ⇒ x=8.'),
          Q('1.5x − 0.5 = 4 ⇒ x =', ['2', '3', '4', '5'], 'B', '1.5x=4.5.'),
        ],
      },
      {
        topicIndex: 2,
        title: 'Unit 5 Quiz 3 — Formulas',
        problems: [
          Q('F = ma ⇒ m =', ['F/a', 'a/F', 'Fa', 'F−a'], 'A', 'a≠0.'),
          Q('V = lwh ⇒ h =', ['V/(lw)', 'Vlw', 'V−lw', 'lw/V'], 'A', 'lw≠0.'),
          Q('y = mx + b ⇒ x =', ['(y−b)/m', 'y/m + b', '(y+b)/m', 'm(y−b)'], 'A', 'm≠0.'),
          Q('P = 2l + 2w ⇒ w =', ['(P−2l)/2', 'P/2 − l', 'Both A and B', 'Neither'], 'C', 'Equivalent.'),
          Q('I = Prt ⇒ t =', ['I/(Pr)', 'Pr/I', 'I−Pr', 'I/P'], 'A', 'Pr≠0.'),
          Q('K = (1/2)mv² ⇒ v² =', ['2K/m', 'K/(2m)', 'm/(2K)', '2mK'], 'A'),
          Q('Solve ax + b = 0 for x (a≠0):', ['−b/a', 'b/a', 'a/b', '−a/b'], 'A'),
        ],
      },
      {
        topicIndex: 3,
        title: 'Unit 5 Quiz 4 — Inequalities',
        problems: [
          Q('2x − 4 ≤ 10 ⇒', ['x ≤ 7', 'x ≥ 7', 'x ≤ 3', 'x ≥ 3'], 'A', '2x≤14.'),
          Q('−x < 3 ⇒', ['x < −3', 'x > −3', 'x > 3', 'x < 3'], 'B', 'Multiply by −1 flips sign.'),
          Q('Graph of x ≥ 2 on number line uses:', ['Open circle at 2', 'Closed circle at 2', 'No arrow', 'Only negatives'], 'B'),
          Q('3 − 2x ≥ 7 ⇒', ['x ≤ −2', 'x ≥ −2', 'x ≤ 2', 'x ≥ 2'], 'A', '−2x≥4 ⇒ x≤−2.'),
          Q('Which is always true?', ['x < x+1', 'x > x+1', 'x = x+1', 'None'], 'A'),
          Q('System style: x>1 and x<5 simplifies to:', ['(1,5)', '[1,5]', '(1,5]', '[1,5)'], 'A', 'Open unless inclusive.'),
          Q('If m < 0, then mx > k implies:', ['x > k/m', 'x < k/m', 'x = k/m', 'No rule'], 'B', 'Divide by negative flips.'),
        ],
      },
      {
        topicIndex: 4,
        title: 'Unit 5 Quiz 5 — Word problems',
        problems: [
          Q('Consecutive integers sum to 45: smaller is:', ['21', '22', '23', '20'], 'B', 'n+(n+1)=45 ⇒ n=22.'),
          Q('Age: Father 35, son 10. Years y until father is twice son’s age:', ['5', '10', '15', '20'], 'C', '35+y=2(10+y) ⇒ y=15.'),
          Q('Cost: 3 pens + 2 books = 46; pen costs 6. Book costs:', ['10', '12', '14', '18'], 'C', '18+2b=46 ⇒ b=14.'),
          Q('Distance same: 60t = 90(t−1) ⇒ t hours for slower car:', ['2', '3', '4', '1.5'], 'B', '60t=90t−90 ⇒ t=3.'),
          Q('Percent: 20% of x is 14 ⇒ x =', ['56', '70', '84', '100'], 'B', '0.2x=14.'),
          Q('Rectangle length 2 more than width; perimeter 32; width:', ['7', '8', '9', '10'], 'A', '2( w + w+2 ) = 32.'),
          Q('Mixture concept: pure review — if 2/5 of class are girls and 18 are boys, class size:', ['18', '30', '45', '36'], 'B', '3/5 N=18 ⇒ N=30.'),
        ],
      },
    ],
  },

  {
    chapterName: 'Unit 6: Coordinate geometry',
    chapterDescription:
      'The Cartesian plane, distance, midpoint, slope, and graphing linear equations (MoE Grade 9).',
    topics: [
      {
        topicName: 'Plotting points and quadrants',
        topicDescription: 'Ordered pairs; signs in quadrants I–IV.',
        topicObjectives: [
          'Plot and read coordinates in the plane.',
        ],
      },
      {
        topicName: 'Distance between two points',
        topicDescription: 'Distance formula from the Pythagorean theorem.',
        topicObjectives: [
          'Compute distance horizontally, vertically, and diagonally.',
        ],
      },
      {
        topicName: 'Midpoint of a segment',
        topicDescription: 'Average of coordinates.',
        topicObjectives: [
          'Find midpoint of a segment given endpoints.',
        ],
      },
      {
        topicName: 'Slope of a line',
        topicDescription: 'm = rise/run; parallel and perpendicular slopes (intro).',
        topicObjectives: [
          'Compute slope from two points.',
        ],
      },
      {
        topicName: 'Graphing linear equations',
        topicDescription: 'y = mx + b; intercepts.',
        topicObjectives: [
          'Graph lines using slope and intercept.',
        ],
      },
    ],
    exercises: [
      {
        topicIndex: 0,
        title: 'Quadrant',
        question: 'Point (−2, 3) lies in which quadrant?',
        options: ['I', 'II', 'III', 'IV'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 1,
        title: 'Distance',
        question: 'Distance from (0,0) to (3,4) is:',
        options: ['5', '7', '12', '25'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 2,
        title: 'Midpoint',
        question: 'Midpoint of (0, 0) and (8, 6) is:',
        options: ['(4, 3)', '(8, 6)', '(16, 12)', '(2, 3)'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 3,
        title: 'Slope',
        question: 'Slope through (1, 2) and (3, 8) is:',
        options: ['3', '2', '6', '1/3'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 4,
        title: 'Intercept',
        question: 'y-intercept of y = −2x + 5 is:',
        options: ['5', '−2', '0', '5/2'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 1,
        title: 'Horizontal distance',
        question: 'Distance from (2, 3) to (7, 3) is:',
        options: ['5', '10', '√34', '1'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 4,
        title: 'Table',
        question: 'If y = 3x − 1, when x = 2, y =',
        options: ['5', '7', '6', '4'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
    ],
    quizzes: [
      {
        topicIndex: 0,
        title: 'Unit 6 Quiz 1 — Plotting',
        problems: [
          Q('(5, −1) lies in quadrant', ['I', 'II', 'III', 'IV'], 'D'),
          Q('Point on x-axis has y-coordinate:', ['always 1', 'always 0', 'any value', 'undefined'], 'B'),
          Q('Origin coordinates:', ['(1,1)', '(0,0)', '(0,1)', '(1,0)'], 'B'),
          Q('Symmetry of (−a,b) about y-axis gives:', ['(a,b)', '(a,−b)', '(−a,−b)', '(b,a)'], 'A'),
          Q('Which lies left of y-axis?', ['(1,2)', '(−1,2)', '(0,3)', '(2,0)'], 'B'),
          Q('If ab>0 for point (a,b), point may be in:', ['II or IV', 'I or III', 'I only', 'IV only'], 'B', 'Same signs.'),
          Q('Shift (2,3) left 2 units:', ['(0,3)', '(4,3)', '(2,5)', '(2,1)'], 'A'),
        ],
      },
      {
        topicIndex: 1,
        title: 'Unit 6 Quiz 2 — Distance',
        problems: [
          Q('Distance (1,1) to (4,5):', ['5', '7', '√13', '√41'], 'A', '3-4-5 triangle.'),
          Q('Distance (a,b) to (a,b+3):', ['3', '9', '√3', '|b|'], 'A', 'Vertical.'),
          Q('(0,0) to (−5,12) distance:', ['13', '17', '7', '10'], 'A'),
          Q('Perimeter triangle (0,0),(3,0),(0,4):', ['7', '10', '12', '14'], 'C', '3+4+5=12.'),
          Q('Points (k,2) and (k,8) are how far apart?', ['6', '10', '√36', '|k|'], 'A'),
          Q('Distance formula uses:', ['Pythagorean theorem', 'Area', 'Trig only', 'Probability'], 'A'),
          Q('(2,2) to (8,10):', ['10', '8', '12', '6'], 'A', 'Δx=6, Δy=8 ⇒ 10.'),
        ],
      },
      {
        topicIndex: 2,
        title: 'Unit 6 Quiz 3 — Midpoint',
        problems: [
          Q('Midpoint (2,6) and (8,10):', ['(5,8)', '(6,8)', '(10,16)', '(4,4)'], 'A'),
          Q('If midpoint is (0,0) and one end (−3,4), the other is:', ['(3,−4)', '(−3,−4)', '(4,−3)', '(3,4)'], 'A'),
          Q('Diagonals of rectangle bisect each other; midpoint of (0,0) and (6,8):', ['(3,4)', '(6,8)', '(0,8)', '(12,16)'], 'A'),
          Q('Midpoint formula averages:', ['x only', 'y only', 'x and y separately', 'slopes'], 'C'),
          Q('Endpoints (1,5) and (5,1); midpoint:', ['(3,3)', '(6,6)', '(2,2)', '(4,4)'], 'A'),
          Q('Segment parallel to x-axis from (−1,4) to (5,4); midpoint x:', ['2', '4', '1', '3'], 'A', 'x=(−1+5)/2=2.'),
          Q('If one endpoint and midpoint known you can find:', ['The other endpoint', 'Area only', 'Impossible', 'Slope only'], 'A'),
        ],
      },
      {
        topicIndex: 3,
        title: 'Unit 6 Quiz 4 — Slope',
        problems: [
          Q('Slope (0,0) to (4,2):', ['2', '1/2', '4', '6'], 'B', '2/4.'),
          Q('Horizontal line slope:', ['0', '1', 'undefined', '∞'], 'A'),
          Q('Vertical line slope:', ['0', '1', 'undefined', '−1'], 'C'),
          Q('Parallel lines have:', ['Equal slopes (non-vertical)', 'Product −1', 'No relation', 'Reciprocal'], 'A'),
          Q('Slope (3,3) to (5,9):', ['2', '3', '6/2', '4'], 'B', 'Δy/Δx=6/2=3.'),
          Q('Perpendicular non-vertical slopes multiply to:', ['0', '1', '−1', '2'], 'C', 'Intro level.'),
          Q('If line rises left-to-right, slope is:', ['Positive', 'Negative', 'Zero', 'Undefined'], 'A'),
        ],
      },
      {
        topicIndex: 4,
        title: 'Unit 6 Quiz 5 — Graphing lines',
        problems: [
          Q('y = 2x + 1 has y-intercept:', ['1', '2', '0', '3'], 'A'),
          Q('x-intercept of 2x + 3y = 6 (set y=0):', ['x=3', 'x=6', 'x=2', 'x=1'], 'A', '2x=6.'),
          Q('Slope of 3x + 6y = 12 solved for y:', ['−1/2', '−2', '1/2', '3'], 'A', 'y = −x/2 + 2.'),
          Q('Line through origin with slope 3:', ['y=3x', 'y=x+3', 'x=3', 'y=3'], 'A'),
          Q('Parallel to y = −4x through (0,5):', ['y = −4x+5', 'y = 4x+5', 'y=5', 'x=5'], 'A'),
          Q('Which point on y = −x + 6?', ['(2,4)', '(2,5)', '(6,0)', '(3,2)'], 'A', '4=−2+6.'),
          Q('If m>0 and b<0, line crosses y-axis:', ['Above origin', 'Below origin', 'At origin', 'Never'], 'B'),
        ],
      },
    ],
  },

  {
    chapterName: 'Unit 7: Plane geometry',
    chapterDescription:
      'Angles, triangles, quadrilaterals, and area relationships aligned with MoE Grade 9 geometry outcomes.',
    topics: [
      {
        topicName: 'Angles and parallel lines',
        topicDescription: 'Complementary, supplementary, vertical, alternate interior.',
        topicObjectives: [
          'Find unknown angles using line and transversal facts.',
        ],
      },
      {
        topicName: 'Angles in triangles',
        topicDescription: 'Sum 180°; exterior angle theorem (intro).',
        topicObjectives: [
          'Solve for unknown angles in triangles.',
        ],
      },
      {
        topicName: 'Congruent triangles',
        topicDescription: 'SSS, SAS, ASA ideas without full formal proofs.',
        topicObjectives: [
          'Use congruence to justify equal sides/angles.',
        ],
      },
      {
        topicName: 'Quadrilaterals',
        topicDescription: 'Parallelogram, rectangle, rhombus, square (properties).',
        topicObjectives: [
          'Apply properties of sides, angles, and diagonals.',
        ],
      },
      {
        topicName: 'Area and perimeter',
        topicDescription: 'Triangle, rectangle, parallelogram, trapezoid.',
        topicObjectives: [
          'Compute area and perimeter from dimensions.',
        ],
      },
    ],
    exercises: [
      {
        topicIndex: 0,
        title: 'Supplementary',
        question: 'Two supplementary angles; one is 112°. The other is:',
        options: ['68°', '78°', '112°', '90°'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 1,
        title: 'Triangle sum',
        question: 'Two angles 50° and 60°; third angle:',
        options: ['70°', '110°', '30°', '80°'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 2,
        title: 'Congruence',
        question: 'If ΔABC ≅ ΔDEF and AB = 5 cm, then DE =',
        options: ['5 cm', 'Unknown', '10 cm', '2.5 cm'],
        correctAnswer: 0,
        difficulty: 'Easy',
      },
      {
        topicIndex: 3,
        title: 'Parallelogram',
        question: 'Opposite angles in a parallelogram are:',
        options: ['Supplementary', 'Congruent', 'Complementary', 'Always 90°'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 4,
        title: 'Area triangle',
        question: 'Area of triangle base 10, height 4:',
        options: ['40', '20', '14', '24'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 4,
        title: 'Rectangle',
        question: 'Rectangle 7 m by 3 m has perimeter:',
        options: ['21', '20', '10', '14'],
        correctAnswer: 1,
        difficulty: 'Easy',
      },
      {
        topicIndex: 0,
        title: 'Vertical angles',
        question: 'Two intersecting lines form vertical angles of x and (2x − 30)°. x =',
        options: ['30°', '40°', '60°', '90°'],
        correctAnswer: 0,
        difficulty: 'Medium',
      },
    ],
    quizzes: [
      {
        topicIndex: 0,
        title: 'Unit 7 Quiz 1 — Angles',
        problems: [
          Q('Complementary to 35°:', ['55°', '145°', '65°', '125°'], 'A'),
          Q('Supplementary to 118°:', ['62°', '72°', '152°', '28°'], 'A'),
          Q('Parallel lines, alternate interior angles are:', ['Equal', 'Supplementary', 'Complementary', 'Unrelated'], 'A'),
          Q('Corresponding angles when lines parallel:', ['Equal', 'Sum 90', 'Sum 180 always', '0'], 'A'),
          Q('Vertical angles measure:', ['Equal', 'Supplementary', 'Different always', '90'], 'A'),
          Q('Linear pair sums to:', ['90°', '180°', '360°', '0°'], 'B'),
          Q('If a transversal is perpendicular to one of two parallels it is — to the other:', ['Parallel', 'Perpendicular', 'Skew', 'Cannot tell'], 'B'),
        ],
      },
      {
        topicIndex: 1,
        title: 'Unit 7 Quiz 2 — Triangles',
        problems: [
          Q('Angles 40°, 65°, third is:', ['75°', '85°', '95°', '105°'], 'A', '180−105=75.'),
          Q('Exterior angle at vertex equals sum of:', ['Opposite interior two', 'All three interior', 'Only adjacent', '90'], 'A'),
          Q('Equilateral triangle each angle:', ['60°', '90°', '45°', '30°'], 'A'),
          Q('Right triangle has one angle:', ['180°', '90°', '0°', '360°'], 'B'),
          Q('Isosceles base angles are:', ['Equal', '90', 'Supplementary', '0'], 'A'),
          Q('Cannot exist: angles 50,60,80 sum?', ['190 no', '180 yes', '170', '200'], 'A', 'Sum not 180.'),
          Q('Triangle inequality: sides 2,3,x longest integer x often checked; minimal for 2,3,4?', ['Valid', 'Invalid', 'Only equilateral', 'x<1'], 'A', '4<2+3.'),
        ],
      },
      {
        topicIndex: 2,
        title: 'Unit 7 Quiz 3 — Congruence',
        problems: [
          Q('CPCTC means corresponding parts of — are congruent:', ['Congruent triangles', 'Similar only', 'Circles', 'Lines'], 'A'),
          Q('SSS shows:', ['Side-side-side', 'Side-side-angle incorrectly', 'Angle-angle', 'Hypotenuse'], 'A'),
          Q('If two right triangles have equal legs by SAS with right angle included:', ['Congruent', 'Never', 'Similar only', 'No relation'], 'A'),
          Q('Reflexive property used in proofs refers to:', ['A segment equals itself', 'Nothing', 'Parallel only', 'Angles sum 180'], 'A'),
          Q('Two triangles same three sides (order matched) implies:', ['Congruent', 'Similar only', 'Maybe not', 'Equal area only'], 'A'),
          Q('ASA needs:', ['Two angles and included side', 'Three angles', 'Two sides non-included', 'One angle'], 'A'),
          Q('If ΔABC ≅ ΔDEF, angle A corresponds:', ['∠D', '∠E', '∠F', 'None'], 'A', 'Order of letters.'),
        ],
      },
      {
        topicIndex: 3,
        title: 'Unit 7 Quiz 4 — Quadrilaterals',
        problems: [
          Q('Parallelogram diagonals:', ['Always bisect each other', 'Always equal', 'Always perpendicular', 'Never meet'], 'A'),
          Q('Rectangle diagonals:', ['Equal and bisect', 'Unequal', 'Never bisect', 'Perpendicular always'], 'A'),
          Q('Rhombus diagonals:', ['Perpendicular', 'Equal', 'Parallel', 'None'], 'A'),
          Q('Square is:', ['Rectangle + rhombus', 'Only rhombus', 'Only rectangle', 'Trapezoid'], 'A'),
          Q('Each angle of rectangle:', ['90°', '60', '45', '180'], 'A'),
          Q('One pair parallel only (general):', ['Trapezoid', 'Parallelogram', 'Rectangle', 'Square'], 'A'),
          Q('Sum interior angles quadrilateral:', ['180', '360', '540', '720'], 'B'),
        ],
      },
      {
        topicIndex: 4,
        title: 'Unit 7 Quiz 5 — Area/perimeter',
        problems: [
          Q('Rectangle 5×4 area:', ['18', '20', '9', '16'], 'B'),
          Q('Triangle base 12 height 5 area:', ['30', '60', '17', '34'], 'A', '½·12·5=30.'),
          Q('Parallelogram base 8 height 3 area:', ['24', '48', '11', '22'], 'A'),
          Q('Trapezoid bases 3,5 height 4 area:', ['16', '32', '20', '12'], 'A', '½(3+5)·4=16.'),
          Q('Circle area grade intro: r=3 (use π):', ['9π', '6π', '3π', '18π'], 'A', 'πr².'),
          Q('Square side s perimeter:', ['s', 's²', '4s', '2s'], 'C'),
          Q('If rectangle area 48 and length 8, width:', ['6', '8', '4', '12'], 'A'),
        ],
      },
    ],
  },
];
