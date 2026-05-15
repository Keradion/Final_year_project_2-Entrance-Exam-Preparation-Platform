/**
 * Grade 10 Mathematics — secondary mathematics
 * (rational expressions & equations; inequalities & linear systems; quadratics; relations & functions;
 * right-triangle trigonometry; polygons, similarity & circles; surface area & volume of solids).
 *
 * Same seed pattern as Grade 9: topics numbered u.v in the seeder, 7 MCQ exercises per topic (curated + pad),
 * one quiz per topic (7 problems), five entrance-exam-style MCQs per topic from grade10ExamQuestions.js.
 */

const letters = ['A', 'B', 'C', 'D'];

function quizChoices(opts) {
  return opts.map((text, i) => ({ text, value: letters[i] }));
}

/** Quiz problem factory */
function Q(questionText, opts, correctLetter, answerExplanation = '') {
  return {
    questionText,
    choices: quizChoices(opts),
    correctAnswer: correctLetter,
    answerExplanation,
  };
}

module.exports = {
  gradeLevel: '10',
  subjectName: 'Mathematics',
  stream: 'Natural',
  subjectDescription:
    'Grade 10 Mathematics (Natural stream): algebra extension through solid measurement.',

  chapters: [
    // ─── Unit 1 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 1: Rational expressions and rational equations',
      chapterDescription:
        'Simplify rational expressions, operate with them, and solve rational equations with domain awareness.',
      topics: [
        {
          topicName: 'Rational expressions and domain',
          topicDescription: 'Excluded values; simplifying by factoring common terms.',
          topicObjectives: [
            'State values that must be excluded from the domain when denominators contain variables.',
            'Reduce rational expressions by canceling common factors (identifying non-values).',
          ],
        },
        {
          topicName: 'Multiplication and division of rational expressions',
          topicDescription: 'Product and quotient rules; reciprocal for division.',
          topicObjectives: [
            'Multiply rational expressions and simplify the result.',
            'Divide by multiplying by the reciprocal and simplify.',
          ],
        },
        {
          topicName: 'Addition and subtraction of rational expressions',
          topicDescription: 'Least common denominator; combine into one fraction.',
          topicObjectives: [
            'Find an LCD for polynomial denominators.',
            'Add or subtract and simplify the combined rational expression.',
          ],
        },
        {
          topicName: 'Complex fractions',
          topicDescription: 'Simplify fractions whose numerator or denominator contain fractions.',
          topicObjectives: [
            'Rewrite complex fractions using multiplication by the LCD of all “little” denominators.',
            'Simplify nested rational expressions systematically.',
          ],
        },
        {
          topicName: 'Solving rational equations',
          topicDescription: 'Multiply by LCD; check extraneous roots.',
          topicObjectives: [
            'Solve rational equations algebraically and list excluded values first.',
            'Identify and reject extraneous solutions after substitution.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Domain', question: 'For (x + 1)/(x − 3), which x is excluded?', options: ['x = 1', 'x = −1', 'x = 3', 'x = 0'], correctAnswer: 2, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Multiply', question: '(2/x) · (x²/4) simplifies to:', options: ['x/2', '2/x', 'x²/2', '8/x'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Add', question: '1/x + 1/2 equals:', options: ['2/(x+2)', '(2+x)/(2x)', '1/(2x)', '2x'], correctAnswer: 1, difficulty: 'Medium' },
        { topicIndex: 3, title: 'Complex', question: 'Simplify (1/x) / (1/x²):', options: ['x', '1/x', 'x²', 'x³'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Solve', question: 'If 3/(x−2) = 1, then x =', options: ['5', '1', '2', '−1'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Reduce', question: '(x² − 9)/(x − 3) for x ≠ 3 equals:', options: ['x − 3', 'x + 3', 'x', '3'], correctAnswer: 1, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Extraneous', question: 'After solving, extraneous roots fail:', options: ['The quadratic formula', 'Substitution in the original equation', 'Factoring', 'Graphing only'], correctAnswer: 1, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 1 Quiz 1 — Domain & simplify', problems: [
          Q('Values of x that make a denominator zero must be:', ['Included in the solution set', 'Listed as excluded from the domain', 'Ignored', 'Always equal to 0'], 'B'),
          Q('For 5/(x + 2), the excluded value is:', ['x = 5', 'x = −2', 'x = 2', 'None'], 'B'),
          Q('(x² − 4)/(x − 2) for x ≠ 2 simplifies to:', ['x − 2', 'x + 2', 'x² + 2', '2'], 'B'),
          Q('A rational expression is undefined when:', ['Numerator is 0', 'Denominator is 0', 'x is positive', 'x is rational'], 'B'),
          Q('Canceling factors is valid only if the factor is:', ['Zero', 'Non-zero on the considered domain', 'Always x', 'Always 1'], 'B'),
          Q('Domain of 1/(x(x−1)) excludes:', ['x = 0 only', 'x = 1 only', 'x = 0 and x = 1', 'No values'], 'C'),
          Q('Simplifying removes common factors that appear in:', ['Numerator only', 'Denominator only', 'Both numerator and denominator', 'Neither'], 'C'),
        ]},
        { topicIndex: 1, title: 'Unit 1 Quiz 2 — Multiply & divide', problems: [
          Q('(a/b) · (c/d) equals:', ['ac/(bd)', 'ad/(bc)', '(a+c)/(b+d)', 'a+b'], 'A'),
          Q('To divide by a rational expression, multiply by its:', ['Square', 'Reciprocal', 'Opposite', 'Double'], 'B'),
          Q('(3x/2) · (4/x) for x ≠ 0 equals:', ['6', '12/x', '3x/8', '6x'], 'A'),
          Q('(x²/x) for x ≠ 0 simplifies to:', ['0', '1', 'x', 'x²'], 'C'),
          Q('Product of two rationals is rational because:', ['Numerators add', 'You multiply numerators and denominators', 'Denominators cancel always', 'LCD is always 1'], 'B'),
          Q('(1/x) ÷ (1/x²) equals:', ['x', '1/x', 'x³', '1'], 'A'),
          Q('Before multiplying, factoring often helps to:', ['Increase degree', 'Cancel common factors later', 'Remove variables', 'Avoid LCD'], 'B'),
        ]},
        { topicIndex: 2, title: 'Unit 1 Quiz 3 — Add & subtract', problems: [
          Q('LCD of x and x² is:', ['x', 'x²', 'x³', '1'], 'B'),
          Q('2/x + 3/x equals for x ≠ 0:', ['5/x', '5/(2x)', '6/x²', '1'], 'A'),
          Q('1/(x+1) + 1/(x−1) needs LCD:', ['x', '(x+1)(x−1)', 'x²', '2'], 'B'),
          Q('Subtracting rational expressions changes signs of:', ['Only denominators', 'Terms in the second numerator', 'All symbols', 'Only constants always'], 'B'),
          Q('After combining over LCD, you should:', ['Expand only', 'Simplify and factor if helpful', 'Square both sides always', 'Divide by x'], 'B'),
          Q('5/6 − 1/4 (numerical practice) equals:', ['7/12', '4/2', '9/12', '1'], 'A'),
          Q('LCD stands for:', ['Lowest common denominator', 'Linear common divisor', 'Longest coefficient divisor', 'Least complex domain'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 1 Quiz 4 — Complex fractions', problems: [
          Q('To simplify (a/b)/(c/d) multiply outer by:', ['a and d', 'b and c', 'ad and bc pattern: multiply by bd sometimes', 'Using (b·d) LCD of inner denominators'], 'D', 'Multiply numerator and denominator by LCD of all “small” denominators or use invert-and-multiply for division form.'),
          Q('(1 + 1/x) with x ≠ 0 can be written as:', ['(x+1)/x', '1/x', '2/x', 'x'], 'A'),
          Q('A complex fraction has a fraction in its:', ['Exponent only', 'Numerator or denominator', 'Graph only', 'Domain only'], 'B'),
          Q('Simplifying layered fractions often starts by:', ['Guessing', 'Identifying all inner denominators', 'Removing variables', 'Squaring'], 'B'),
          Q('(2/x)/(1/x) for x ≠ 0 equals:', ['2', '1/2', '2x', 'x/2'], 'A'),
          Q('If numerator of complex fraction is 0 (and defined), value is:', ['1', '0', 'Undefined always', '∞'], 'B'),
          Q('Multiplying top and bottom by the same non-zero expression:', ['Changes value', 'Preserves value (by 1)', 'Always extraneous', 'Removes solutions'], 'B'),
        ]},
        { topicIndex: 4, title: 'Unit 1 Quiz 5 — Rational equations', problems: [
          Q('First step often: note excluded values, then:', ['Square blindly', 'Multiply both sides by LCD', 'Divide by x always', 'Graph only'], 'B'),
          Q('Extraneous solutions arise because multiplication by an expression can:', ['Shrink the domain artificially in appearance', 'Introduce candidates outside original domain validity', 'Always fix everything', 'Remove all variables'], 'B'),
          Q('If 2/(x−1) = 1, then x =', ['3', '2', '1', '0'], 'A'),
          Q('After solving, you must:', ['Accept all algebra roots', 'Check in original equation', 'Ignore denominators', 'Square again'], 'B'),
          Q('A value that makes any original denominator 0 is:', ['Always a solution', 'Never allowed', 'A solution if numerator also 0', 'Always extraneous'], 'B'),
          Q('If LCD is (x−2), multiplying removes:', ['Only constants', 'That factor from denominators when multiplied', 'Solutions', 'Graph'], 'B'),
          Q('Rational equation modeling rates often uses:', ['Sum of reciprocals sometimes', '1/(rate·time) forms in work problems', 'Only addition of rates in some cases', 'All of B–C patterns appear in texts'], 'D', 'Context-dependent; all listed patterns appear in standard problem types.'),
        ]},
      ],
    },

    // ─── Unit 2 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 2: Linear inequalities and systems of linear equations',
      chapterDescription:
        'Compound inequalities in one variable; solve 2×2 systems by graphing, substitution, and elimination.',
      topics: [
        {
          topicName: 'Linear inequalities in one variable',
          topicDescription: 'Solve and graph; compound inequalities; interval notation intuition.',
          topicObjectives: [
            'Solve linear inequalities and represent solution sets on a number line.',
            'Handle multiplication or division by a negative number (reverse the inequality).',
          ],
        },
        {
          topicName: 'Systems of linear equations — graphical method',
          topicDescription: 'Intersecting lines as solution; parallel (none) or coincident (many).',
          topicObjectives: [
            'Graph two lines and read the intersection when it exists.',
            'Classify a system as consistent independent, inconsistent, or dependent from a graph.',
          ],
        },
        {
          topicName: 'Systems — substitution method',
          topicDescription: 'Isolate a variable and substitute into the other equation.',
          topicObjectives: [
            'Use substitution to reduce to one variable and solve.',
            'Interpret special cases (no solution, many solutions) algebraically.',
          ],
        },
        {
          topicName: 'Systems — elimination method',
          topicDescription: 'Add or subtract equations to eliminate a variable.',
          topicObjectives: [
            'Multiply equations by constants to align coefficients.',
            'Eliminate one variable and back-substitute.',
          ],
        },
        {
          topicName: 'Applications of systems',
          topicDescription: 'Mixture, motion, and money word problems.',
          topicObjectives: [
            'Define two unknowns and write two equations from a context.',
            'Check solutions in the original wording.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Inequality', question: '−2x > 6 implies:', options: ['x > −3', 'x < −3', 'x > 3', 'x < 3'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Graph', question: 'Two non-parallel lines in a plane meet:', options: ['Never', 'Exactly once', 'Always twice', 'Only if parallel'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Substitute', question: 'If y = 2x and x + y = 9, then x =', options: ['3', '4', '2', '5'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 3, title: 'Eliminate', question: 'Add x + y = 5 and x − y = 1 to get:', options: ['2x = 6', '2x = 4', '2y = 6', '0 = 0'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Context', question: 'Two numbers sum to 15 and differ by 3. Larger is:', options: ['6', '9', '8', '10'], correctAnswer: 1, difficulty: 'Medium' },
        { topicIndex: 0, title: 'Compound', question: '1 < x ≤ 4 means x is:', options: ['Only 4', 'Between 1 and 4 including 4', 'Less than 1', 'Only integers'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Parallel', question: 'Substitution yielding 0 = 5 indicates:', options: ['Infinite solutions', 'No solution', 'One solution', 'Wrong method'], correctAnswer: 1, difficulty: 'Medium' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 2 Quiz 1 — Inequalities', problems: [
          Q('Multiplying both sides of an inequality by −3 reverses:', ['The variable', 'The inequality sign', 'Both sides identity', 'Nothing'], 'B'),
          Q('x ≤ 5 on a number line uses:', ['Open circle at 5, shade left', 'Closed circle at 5, shade left', 'Open circle, shade right', 'No shading'], 'B'),
          Q('3x − 1 ≥ 8 gives:', ['x ≥ 3', 'x ≥ 2', 'x ≤ 3', 'x ≤ 2'], 'A'),
          Q('−x < 2 implies:', ['x < −2', 'x > −2', 'x > 2', 'x < 2'], 'B'),
          Q('“At least 10” translates to:', ['x > 10', 'x ≥ 10', 'x < 10', 'x ≤ 10'], 'B'),
          Q('Intersection of x > 1 and x < 4 is:', ['(1,4)', 'Empty', 'All ℝ', '[1,4]'], 'A'),
          Q('Dividing inequality by positive 2:', ['Reverses sign', 'Keeps direction', 'Always impossible', 'Makes equality'], 'B'),
        ]},
        { topicIndex: 1, title: 'Unit 2 Quiz 2 — Graphical systems', problems: [
          Q('Solution of a 2×2 linear system graphically is:', ['y-intercept', 'Intersection point if unique', 'Origin only', 'Slope'], 'B'),
          Q('Parallel distinct lines mean the system has:', ['One solution', 'No solution', 'Infinite', 'Two solutions'], 'B'),
          Q('Coincident lines mean:', ['No solution', 'Infinitely many solutions', 'Exactly two', 'Wrong graph'], 'B'),
          Q('Consistent independent system:', ['Unique solution', 'None', 'Many', 'Cannot graph'], 'A'),
          Q('Graphing is useful to:', ['Visualize and estimate', 'Never check', 'Remove variables', 'Avoid algebra'], 'A'),
          Q('If lines cross at (2,1), that pair:', ['Satisfies both equations', 'Fails one', 'Is random', 'Is always wrong'], 'A'),
          Q('Vertical and horizontal lines can intersect:', ['Never', 'At most once if not parallel to each other', 'Always twice', 'Only at origin'], 'B'),
        ]},
        { topicIndex: 2, title: 'Unit 2 Quiz 3 — Substitution', problems: [
          Q('Substitution is convenient when one equation is:', ['Already solved for a variable', 'Cubic', 'Empty', 'In three variables only'], 'A'),
          Q('If y = 3x and 2x + y = 10, then x =', ['1', '2', '5/3', '3'], 'B'),
          Q('After substitution, you solve:', ['A single-variable equation', 'Always a matrix', 'No equation', 'Only graph'], 'A'),
          Q('0 = 0 after substitution suggests:', ['No solution', 'Dependent system (many solutions) if both equations equivalent context', 'Unique', 'Error always'], 'B'),
          Q('Back-substitute means:', ['Ignore answer', 'Plug x to find y (or reverse)', 'Square roots', 'Graph again'], 'B'),
          Q('y = −x + 5 and y = x + 1 intersect when x =', ['1', '2', '3', '4'], 'B'),
          Q('Substitution works for:', ['Linear systems commonly', 'Only quadratics', 'Never', 'Only 3D'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 2 Quiz 4 — Elimination', problems: [
          Q('Goal of elimination is to:', ['Add graphs', 'Remove one variable by combining equations', 'Factor', 'Complete the square'], 'B'),
          Q('To eliminate x, coefficients of x may be made:', ['Equal or opposite via scaling', 'Always 1 without scaling', 'Zero in one equation only by magic', 'Infinite'], 'A'),
          Q('x + 2y = 7 and 2x + 4y = 8 implies:', ['Unique', 'No solution (parallel)', 'Infinite', 'Cannot tell'], 'B'),
          Q('After finding one variable, use:', ['Substitution into an original equation', 'Discriminant only', 'Circle area', 'Trig only'], 'A'),
          Q('Elimination is also called:', ['Addition method in many textbooks', 'Only graphical', 'Newton method', 'Factoring'], 'A'),
          Q('3x + y = 5 and x − y = 3: adding equations gives:', ['4x = 8', '2x = 2', '4x = 2', '0'], 'A'),
          Q('Scaling an equation by k ≠ 0 preserves:', ['Nothing', 'Solution set of that equation', 'Only graph color', 'Domain of whole system as lines'], 'B'),
        ]},
        { topicIndex: 4, title: 'Unit 2 Quiz 5 — Applications', problems: [
          Q('Two bags cost $11 total; difference of prices is $1. Cheaper bag (in $) could be modeled by system — solution gives cheaper:', ['5', '6', '4', '7'], 'A', 'x+y=11, y−x=1 gives larger y, cheaper x=5. (Check problem framing in class.)'),
          Q('Rates add for combined work in basic models when:', ['Independent workers completing a job', 'They block each other', 'Never', 'Only if equal'], 'A'),
          Q('Defining variables in words first helps to:', ['Write consistent equations', 'Skip checking', 'Remove units', 'Avoid answers'], 'A'),
          Q('Mixture: two concentrations require:', ['Mass balance and pure substance balance often', 'Only one equation', 'No equations', 'Trig'], 'A'),
          Q('Solution must satisfy:', ['Both equations and realistic constraints (e.g. non-negative counts)', 'Neither', 'Only one', 'Only graph'], 'A'),
          Q('If you get negative liters in answer:', ['Accept blindly', 'Re-read constraints / setup', 'Always round up', 'Divide by zero'], 'B'),
          Q('Typical “coins” problems use:', ['Count equation and value equation', 'One unknown only', 'Circle theorems', 'Completing square'], 'A'),
        ]},
      ],
    },

    // ─── Unit 3 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 3: Quadratic equations',
      chapterDescription: 'Factoring, completing the square, quadratic formula, discriminant, and applications.',
      topics: [
        {
          topicName: 'Solving quadratic equations by factoring',
          topicDescription: 'Zero-product property; standard form ax² + bx + c = 0.',
          topicObjectives: ['Factor quadratics over integers where possible.', 'Apply zero-product to find roots.'],
        },
        {
          topicName: 'Completing the square',
          topicDescription: 'Build a perfect square; vertex form connection.',
          topicObjectives: ['Complete the square for monic and simple non-monic quadratics.', 'Solve ax² + bx + c = 0 by this method when appropriate.'],
        },
        {
          topicName: 'The quadratic formula and discriminant',
          topicDescription: 'Δ = b² − 4ac; nature of roots.',
          topicObjectives: ['Use the formula to solve any quadratic.', 'Predict number of real roots from the discriminant.'],
        },
        {
          topicName: 'Applications of quadratic equations',
          topicDescription: 'Area, projectile, and number product models.',
          topicObjectives: ['Translate contexts to a quadratic model.', 'Choose physically meaningful roots.'],
        },
        {
          topicName: 'Equations reducible to quadratic form',
          topicDescription: 'Substitution patterns (e.g. expressions squared).',
          topicObjectives: ['Recognize quadratics in a new variable after substitution.', 'Check all candidates in the original equation.'],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Factor', question: 'x² − 5x + 6 = 0 has roots:', options: ['2, 3', '−2, −3', '1, 6', '0'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Complete', question: 'x² + 6x + __ to be perfect square needs:', options: ['9', '6', '36', '3'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Formula', question: 'Discriminant of x² + x + 1 is:', options: ['positive', 'zero', 'negative', '4'], correctAnswer: 2, difficulty: 'Medium' },
        { topicIndex: 3, title: 'Area', question: 'Rectangle length 2 more than width; area 35. Width ≈', options: ['5', '7', '6', '4'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Substitute', question: 'If u = x² and x⁴ − 5x² + 4 = 0, then u satisfies:', options: ['u² − 5u + 4 = 0', 'u − 5 + 4 = 0', 'u² + 5u = 0', 'u = 4 only'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 0, title: 'Zero product', question: 'If ab = 0 then:', options: ['a = 0 or b = 0', 'a = b', 'both nonzero', 'always 1'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Roots', question: 'Δ > 0 means:', options: ['No real roots', 'One repeated', 'Two distinct real', 'Not quadratic'], correctAnswer: 2, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 3 Quiz 1 — Factoring', problems: [
          Q('x² − 9 = 0 has solutions:', ['x = ±3', 'x = 3 only', 'x = −3 only', 'x = 9'], 'A'),
          Q('x(x − 4) = 0 gives roots:', ['0 and 4', '0 only', '4 only', 'None'], 'A'),
          Q('Standard form before factoring is often:', ['Set equal to 0', 'Set equal to 1 always', 'Avoid simplifying', 'Graph only'], 'A'),
          Q('x² + 2x + 1 factors as:', ['(x+1)²', '(x−1)²', '(x+2)(x−1)', '(x+1)(x−2)'], 'A'),
          Q('Zero-product property requires product:', ['Non-zero', 'Zero', 'Positive', 'Negative'], 'B'),
          Q('x² − 5x = 0 factors as x( ):', ['x − 5', 'x + 5', '5 − x', 'x²'], 'A'),
          Q('Check roots by:', ['Substituting into original equation', 'Guessing', 'Adding 1 always', 'Discriminant only'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 3 Quiz 2 — Completing the square', problems: [
          Q('To complete x² + 8x + __, add:', ['8', '16', '4', '64'], 'B'),
          Q('Vertex form y = (x − h)² + k has vertex at:', ['(0,0)', '(h,k)', '(k,h)', '(−h,−k)'], 'B'),
          Q('Completing square always tracks:', ['Middle term as 2·(√const)·x when monic', 'Only constant term', 'Degree raise', 'Log rules'], 'A'),
          Q('If coefficient of x² is not 1, first step often:', ['Divide equation by a (if a ≠ 0)', 'Ignore a', 'Square a', 'Factor a out from first two terms sometimes'], 'D'),
          Q('x² − 6x can be written (x − 3)² −', ['3', '6', '9', '12'], 'C'),
          Q('Completing square solves quadratics by:', ['Reducing to (square) = constant', 'Only graphing', 'Derivatives', 'Matrices'], 'A'),
          Q('Perfect square trinomial has discriminant of the quadratic (as polynomial) equal to:', ['0 when viewed as equation in one variable after setting', 'Always 1', 'Always negative', 'Undefined'], 'A', 'The trinomial is a perfect square ⇔ its discriminant (as quadratic in x) is zero.'),
        ]},
        { topicIndex: 2, title: 'Unit 3 Quiz 3 — Formula & Δ', problems: [
          Q('Quadratic formula solves ax²+bx+c=0 with a:', ['0', '≠ 0', 'negative only', 'fraction only'], 'B'),
          Q('If Δ = 0, real roots:', ['Two distinct', 'One repeated', 'None', 'Three'], 'B'),
          Q('If Δ < 0, real roots:', ['Two', 'One', 'None', 'Infinite'], 'C'),
          Q('Sum of roots −b/a applies when:', ['a ≠ 0', 'never', 'only if c = 0', 'only cubics'], 'A'),
          Q('Product of roots c/a applies when:', ['a ≠ 0', 'never', 'b = 0 only', 'always'], 'A'),
          Q('Formula derives from:', ['Completing the square on standard form', 'Factoring only', 'Trig', 'Guess'], 'A'),
          Q('Discriminant is:', ['b² − 4ac', 'b² + 4ac', 'a² − 4bc', '4ac − b²'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 3 Quiz 4 — Applications', problems: [
          Q('Projectile height models often use:', ['Linear only', 'Quadratic in time', 'Exponential only', 'No equation'], 'B'),
          Q('Positive root often chosen when modeling:', ['Length or time that must be positive', 'Any sign', 'Never', 'Complex'], 'A'),
          Q('Area of rectangle L×W with L = W+3 and LW = 40 gives W positive root:', ['5', '8', '−8', '3'], 'A'),
          Q('Product of two numbers is 24 and sum 11 (find numbers):', ['3 and 8', '4 and 6', '2 and 12', '1 and 24'], 'A'),
          Q('Setting up: define unknown(s), then:', ['Write equation from relations', 'Skip relations', 'Use only graph', 'Divide by zero'], 'A'),
          Q('If quadratic has two positive roots, context may force:', ['One feasible answer', 'Both always', 'Neither', 'No solution'], 'A'),
          Q('Checking in wording means:', ['Verify numbers fit the story', 'Ignore story', 'Square only', 'Use discriminant only'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 3 Quiz 5 — Reducible form', problems: [
          Q('x⁴ − 10x² + 9 = 0 can use u =', ['x', 'x²', 'x³', '1/x'], 'B'),
          Q('After solving for u, recover x by:', ['x = ±√u when u ≥ 0 in x² = u patterns', 'Always u', 'Ignoring signs', 'Only +√u if context demands'], 'A'),
          Q('Substitution can increase:', ['Care needed for extraneous roots when reversing steps', 'Degree always', 'Nothing', 'Only linear'], 'A'),
          Q('If u² − 5u + 6 = 0 then u =', ['2 or 3', 'only 6', '0', '5'], 'A'),
          Q('Always substitute back into:', ['Original equation', 'Only u-equation', 'Nothing', 'Derivative'], 'A'),
          Q('Patterns like (x + 1/x)² appear in:', ['Some advanced homework', 'Selected enrichment links to identities', 'Never', 'Only 3D volume'], 'A', 'Recognize (a + 1/a)² = a² + 2 + 1/a² style patterns when taught.'),
          Q('Number of x solutions from two positive u roots in x² = u pattern can be up to:', ['2', '4', '1', '0'], 'B'),
        ]},
      ],
    },

    // ─── Unit 4 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 4: Relations, functions, and graphs',
      chapterDescription: 'Domain and range, function notation, linear and quadratic graphs, simple transformations.',
      topics: [
        { topicName: 'Relations and the coordinate plane', topicDescription: 'Ordered pairs; domain and range from sets or graphs.', topicObjectives: ['Read domain and range from a graph or roster.', 'Distinguish relation from function informally.'], },
        { topicName: 'Functions and notation', topicDescription: 'f(x); evaluating and interpreting.', topicObjectives: ['Evaluate f(a) for linear and quadratic f.', 'Interpret f(x) in context.'], },
        { topicName: 'Graph of linear functions', topicDescription: 'Slope-intercept; intercepts.', topicObjectives: ['Graph lines from slope and intercept.', 'Find intercepts algebraically.'], },
        { topicName: 'Graph of quadratic functions', topicDescription: 'Parabola; vertex and axis of symmetry.', topicObjectives: ['Locate vertex for y = a(x−h)²+k.', 'Sketch parabolas from vertex and direction.'], },
        { topicName: 'Simple transformations of graphs', topicDescription: 'Vertical shifts; reflections in axes (introductory).', topicObjectives: ['Describe shifts of y = f(x) ± k vertically.', 'Recognize reflection y = −f(x) in the x-axis.'], },
      ],
      exercises: [
        { topicIndex: 0, title: 'Domain', question: 'Domain of {(1,2),(3,4)} as first components:', options: ['{1,3}', '{2,4}', '{1,2}', 'ℝ'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'f(2)', question: 'If f(x) = 3x − 1, f(2) =', options: ['5', '6', '7', '4'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Slope', question: 'y = −2x + 7 slope:', options: ['7', '−2', '2', '0'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Vertex', question: 'Vertex of y = (x − 1)² + 2:', options: ['(1,2)', '(−1,2)', '(1,−2)', '(2,1)'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Shift', question: 'y = x² + 5 shifts the basic parabola:', options: ['Right 5', 'Up 5', 'Down 5', 'Left 5'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Not function', question: 'Fails vertical line test if:', options: ['One x has two y on graph', 'One y has two x', 'Line is vertical', 'Slope is 0'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 3, title: 'Axis', question: 'Axis of symmetry of y = (x+3)²:', options: ['x = 3', 'x = −3', 'y = 3', 'y = −3'], correctAnswer: 1, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 4 Quiz 1 — Relations', problems: [
          Q('Domain is the set of:', ['Second coordinates', 'First coordinates', 'Slopes', 'Areas'], 'B'),
          Q('Range is the set of:', ['First coordinates', 'Second coordinates', 'Always ℤ', 'Always ℕ'], 'B'),
          Q('A function assigns:', ['Each input at most one output', 'Each input many outputs', 'No outputs', 'Random'], 'A'),
          Q('Vertical line test checks:', ['Function property on graph', 'Parallel lines', 'Area', 'Volume'], 'A'),
          Q('{(2,1),(2,3)} is:', ['A function', 'Not a function', 'Always linear', 'Empty'], 'B'),
          Q('Relation can be given by:', ['Graph, table, or rule', 'Only words', 'Never', 'Only trig'], 'A'),
          Q('If graph passes vertical line twice at same x:', ['Still a function', 'Not a function', 'Always quadratic', 'Always linear'], 'B'),
        ]},
        { topicIndex: 1, title: 'Unit 4 Quiz 2 — f(x)', problems: [
          Q('f(0) for f(x) = 4 − x is:', ['4', '0', '−4', '1'], 'A'),
          Q('f(x) = x² + 1; f(−1) =', ['0', '1', '2', '−2'], 'C'),
          Q('Independent variable in y = f(x) is often:', ['y', 'x', 'f', 'Both x and y'], 'B'),
          Q('Evaluating replaces:', ['x with a number (everywhere in rule)', 'Only constants', 'Only exponents', 'Graph color'], 'A'),
          Q('If f(a) = 0, a is:', ['Always maximum', 'A root / zero of f', 'Always minimum', 'Undefined'], 'B'),
          Q('f(x) = 2x; f(3) − f(2) =', ['1', '2', '3', '0'], 'B'),
          Q('Notation f : A → B suggests:', ['Domain A, codomain/target set B', 'Only graph', 'Only roots', 'Only area'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 4 Quiz 3 — Linear graphs', problems: [
          Q('y-intercept of y = 4x − 1:', ['4', '−1', '1', '0'], 'B'),
          Q('x-intercept of y = 2x − 4:', ['(2,0)', '(0,−4)', '(4,0)', '(0,2)'], 'A'),
          Q('Slope of horizontal line:', ['0', '1', 'undefined', '−1'], 'A'),
          Q('Parallel lines (non-vertical) have:', ['Equal slopes', 'Slopes product −1', 'No relation', 'Undefined both'], 'A'),
          Q('Perpendicular lines (non-vertical) slopes m1, m2 satisfy:', ['m1 = m2', 'm1·m2 = −1', 'm1 + m2 = 0', 'm1 = −m2 always'], 'B'),
          Q('Point-slope form uses:', ['Known point and slope', 'Only intercept', 'Only vertex', 'Only area'], 'A'),
          Q('Line through (0,0) with slope 5:', ['y = 5x', 'y = x + 5', 'x = 5', 'y = 5'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 4 Quiz 4 — Parabolas', problems: [
          Q('For y = ax² with a > 0, opens:', ['Down', 'Up', 'Left', 'Right'], 'B'),
          Q('Vertex of y = x² − 6x + 9 is at x:', ['3 by symmetry of (x−3)²', '6', '9', '0'], 'A'),
          Q('Axis of symmetry passes through:', ['Vertex', 'Origin always', 'y-intercept only', 'None'], 'A'),
          Q('Minimum value of y = (x−4)² + 1 is:', ['1', '4', '5', '0'], 'A'),
          Q('If a < 0 in y = ax² + bx + c, parabola opens:', ['Up', 'Down', 'Flat', 'Sideways only'], 'B'),
          Q('Roots are x-intercepts when:', ['They are real and function defined', 'Always imaginary', 'Never on parabolas', 'Only if linear'], 'A'),
          Q('Standard form connects to vertex by:', ['Completing the square or formula', 'Only factoring quadratics in two variables', 'Trig only', 'Never'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 4 Quiz 5 — Transformations', problems: [
          Q('y = f(x) + 3 shifts graph:', ['Up 3', 'Down 3', 'Right 3', 'Left 3'], 'A'),
          Q('y = f(x − 3) shifts graph:', ['Up 3', 'Down 3', 'Right 3', 'Left 3'], 'C'),
          Q('y = −f(x) reflects across:', ['y-axis', 'x-axis', 'origin only', 'line y=x always'], 'B'),
          Q('y = f(−x) reflects across:', ['y-axis', 'x-axis', 'vertex', 'none'], 'A'),
          Q('Combining shifts applies:', ['Order matters in composition; track inner/outer on x', 'Never', 'Only to lines', 'Only cubics'], 'A'),
          Q('Vertex moves with shifts of:', ['Both x and y in transformed form', 'Only color', 'Only domain of relation seen as graph', 'No movement'], 'A'),
          Q('Stretch y = 2f(x) vertically by factor:', ['2', '1/2', '4', '0'], 'A'),
        ]},
      ],
    },

    // ─── Unit 5 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 5: Introduction to trigonometry',
      chapterDescription: 'Right-triangle ratios; solving for sides and angles; simple applications.',
      topics: [
        { topicName: 'Angles and right triangles', topicDescription: 'Acute angles; opposite, adjacent, hypotenuse.', topicObjectives: ['Label sides relative to a marked acute angle.', 'Recognize right-triangle Pythagorean relationship.'], },
        { topicName: 'Trigonometric ratios', topicDescription: 'sin, cos, tan for acute angles.', topicObjectives: ['Write ratios from side lengths.', 'Use a calculator when appropriate.'], },
        { topicName: 'Finding unknown sides', topicDescription: 'Sine, cosine, tangent in isolation, algebraic solve.', topicObjectives: ['Solve for a side given one side and an acute angle.', 'Check with Pythagoras when two sides found.'], },
        { topicName: 'Finding unknown angles', topicDescription: 'Inverse ratios at introductory level.', topicObjectives: ['Find acute angle from two sides using inverse trig.', 'Summarize angles in a triangle.'], },
        { topicName: 'Applications: elevation, depression, and bearings', topicDescription: 'Simple realistic triangles.', topicObjectives: ['Draw a diagram from wording.', 'Translate to sine/cosine/tangent relationships.'], },
      ],
      exercises: [
        { topicIndex: 0, title: 'Hypotenuse', question: 'Legs 6 and 8; hypotenuse =', options: ['10', '12', '14', '9'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'sin', question: 'Opposite 3, hyp 5; sin θ =', options: ['3/5', '4/5', '3/4', '5/3'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Find side', question: 'cos 30° = √3/2; adj = √3, hyp =', options: ['1', '2', '√3/2', '3'], correctAnswer: 1, difficulty: 'Medium' },
        { topicIndex: 3, title: 'Angle', question: 'tan θ = 1 with acute θ gives θ =', options: ['30°', '45°', '60°', '90°'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Shadow', question: '10 m tower, sun 30° to horizontal; shadow ≈ (use √3≈1.73)', options: ['17.3 m', '10 m', '5 m', '20 m'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'tan', question: 'Opposite 5, adjacent 12; tan θ =', options: ['5/12', '12/5', '13/5', '5/13'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Complementary', question: 'Two acute angles in right triangle sum to:', options: ['90°', '45°', '180°', '60°'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 5 Quiz 1 — Right triangles', problems: [
          Q('Longest side of a right triangle is:', ['Leg', 'Hypotenuse', 'Altitude', 'Median'], 'B'),
          Q('Pythagoras: a² + b² =', ['c for hypotenuse c', 'a+b', '2c', 'ab'], 'A'),
          Q('If legs are 5 and 12, hypotenuse:', ['13', '17', '7', '25'], 'A'),
          Q('Side opposite marked acute θ is:', ['Next to θ along triangle base always', 'Across from θ', 'Hypotenuse always', 'Unnamed'], 'B'),
          Q('Adjacent (not hypotenuse) touches:', ['θ at one endpoint along triangle', 'None', 'Only hypotenuse', 'Area'], 'A'),
          Q('A 3-4-5 triangle is:', ['Right', 'Not right', 'Equilateral', 'Obtuse'], 'A'),
          Q('Height of equilateral triangle side 2 is √3 by:', ['Trig or special triangle', 'Always 1', 'Never computable', 'Circle area'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 5 Quiz 2 — Ratios', problems: [
          Q('sin θ =', ['opp/hyp', 'adj/hyp', 'opp/adj', 'hyp/opp'], 'A'),
          Q('cos θ =', ['opp/hyp', 'adj/hyp', 'opp/adj', 'hyp/adj'], 'B'),
          Q('tan θ =', ['opp/adj', 'adj/opp', 'hyp/opp', 'opp/hyp'], 'A'),
          Q('sin²θ + cos²θ for acute θ in a right triangle:', ['0', '1', '2', 'tan θ'], 'B'),
          Q('If hyp = 10 and sin θ = 0.6, opposite ≈', ['6', '8', '10', '0.6'], 'A'),
          Q('cos increases as acute angle approaches 0° toward:', ['0', '1', '2', 'undefined always'], 'B'),
          Q('tan 45° =', ['0', '1', '√2', '1/2'], 'B'),
        ]},
        { topicIndex: 2, title: 'Unit 5 Quiz 3 — Unknown sides', problems: [
          Q('If sin θ = opp/hyp and hyp known, opp =', ['hyp·sin θ', 'hyp/sin θ', 'sin θ/hyp', 'hyp−sin θ'], 'A'),
          Q('If cos θ = adj/hyp, adj =', ['hyp·cos θ', 'hyp/cos θ', 'hyp+cos θ', 'cos/hyp'], 'A'),
          Q('Always check sides with:', ['Pythagoras when possible', 'Never', 'Only addition', 'Area of circle'], 'A'),
          Q('If angle and one leg known, second leg may use:', ['tan or Pythagoras', 'Only cosine law (not grade-10 right)', 'Guess', 'Inverse only'], 'A'),
          Q('Right triangle trigonometry assumes:', ['One 90° angle', 'No 90°', 'All equal', 'Obtuse'], 'A'),
          Q('Rounding final answer should match:', ['Context / significant guidance', 'Always 10 decimals', 'Never round', 'π exactly always'], 'A'),
          Q('If θ = 30° and hyp = 4, opposite side:', ['2', '2√3', '4/√3', '1'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 5 Quiz 4 — Unknown angles', problems: [
          Q('If opp and hyp known, use:', ['sin⁻¹ after forming ratio', 'Only cosine law', 'Addition of angles without trig', 'Area formula'], 'A'),
          Q('Calculator sin⁻¹ gives principal value in range typically:', ['0° to 90° for positive acute context', 'Always 180°', 'Always negative', 'Undefined'], 'A'),
          Q('If tan θ = 1 (acute θ), θ =', ['30°', '45°', '60°', '90°'], 'B'),
          Q('Two known sides in right triangle determine acute angles via:', ['Ratios + inverse trig', 'Never', 'Only one angle always', 'Pythagoras alone'], 'A'),
          Q('Sum of two acute angles in right triangle:', ['90°', '180°', '45°', '30°'], 'A'),
          Q('If cos θ = 0.5 (acute), θ =', ['30°', '45', '60°', '90°'], 'C'),
          Q('Check angle plausibility with:', ['Diagram + triangle sum', 'Ignore diagram', 'Guess', 'Multiply sides'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 5 Quiz 5 — Applications', problems: [
          Q('Angle of elevation is measured from:', ['Horizontal up to line of sight', 'Vertical down', 'Always 90°', 'Inside circle'], 'A'),
          Q('Angle of depression equals angle of elevation when:', ['Parallel horizontals (alternate interior)', 'Never', 'Always 0', 'Always 90'], 'A'),
          Q('Always:', ['Draw sketch', 'Skip sketch', 'Use only words', 'Avoid labeling'], 'A'),
          Q('Ladder leaning: right triangle uses wall and:', ['Ground', 'Circle', 'Sphere', 'Diagonal of square only'], 'A'),
          Q('If horizontal distance and angle known, height often via:', ['tan', 'Only cos', 'Only matrix', 'Exponent'], 'A'),
          Q('Bearings may combine with:', ['Right triangle models after decomposing', 'Never trig', 'Only statistics', 'Complex numbers'], 'A'),
          Q('Final answer should include:', ['Units if any in problem', 'Never units', 'Always radians only', 'Always degrees only'], 'A', 'Match the unit convention used in the lesson.'),
        ]},
      ],
    },

    // ─── Unit 6 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 6: Plane geometry — polygons, similarity, and circles',
      chapterDescription: 'Regular polygons, similarity, circle theorems.',
      topics: [
        { topicName: 'Regular polygons and angle sums', topicDescription: 'Interior and exterior angles; tiling intuition.', topicObjectives: ['Use (n−2)·180° for interior sum.', 'Find each interior angle measure of a regular n-gon.'], },
        { topicName: 'Similar figures', topicDescription: 'Scale factor; ratios of lengths, areas (intro).', topicObjectives: ['Set up proportions for similar triangles.', 'Relate areas of similar figures to scale factor squared (awareness).'], },
        { topicName: 'Triangle similarity', topicDescription: 'AA, SAS, SSS similarity.', topicObjectives: ['Prove or use similarity with angle or side patterns.', 'Match corresponding vertices.'], },
        { topicName: 'Circles: central and inscribed angles', topicDescription: 'Arcs and angle measures.', topicObjectives: ['Relate central angle measure to intercepted arc.', 'Use inscribed angle theorem (measure half the arc).'], },
        { topicName: 'Chords, tangents, and mixed problems', topicDescription: 'Radius perpendicular to tangent; chord properties.', topicObjectives: ['Apply tangent-radius perpendicularity.', 'Solve simple chord–distance from center problems.'], },
      ],
      exercises: [
        { topicIndex: 0, title: 'Sum', question: 'Interior angle sum of pentagon:', options: ['360°', '540°', '720°', '180°'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Scale', question: 'Sides doubled; perimeter scales by:', options: ['2', '4', '8', '1'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'AA', question: 'Two pairs of equal angles ⇒ triangles are:', options: ['Congruent always', 'Similar', 'Neither', 'Right only'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Inscribed', question: 'Inscribed angle on arc 80° measures:', options: ['80°', '40°', '160°', '20°'], correctAnswer: 1, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Tangent', question: 'Radius to point of tangency is ___ to tangent:', options: ['parallel', 'perpendicular', 'skew', 'equal'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Each interior hex', question: 'Each interior angle of regular hexagon:', options: ['60°', '120°', '90°', '108°'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Central', question: 'Central angle 50° ⇒ arc measure:', options: ['25°', '50°', '100°', '180°'], correctAnswer: 1, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 6 Quiz 1 — Polygons', problems: [
          Q('Sum of interior angles of n-gon:', ['180n', '(n−2)·180°', '360n', '90n'], 'B'),
          Q('Regular polygon: all sides', ['Different', 'Equal', 'Curved', 'Undefined'], 'B'),
          Q('Exterior angles of convex polygon sum to:', ['180°', '360°', '90°', '(n−2)180'], 'B'),
          Q('Each interior of regular octagon:', ['135°', '120°', '108°', '144°'], 'A'),
          Q('Triangle angle sum:', ['90°', '180°', '360°', '270°'], 'B'),
          Q('n = 4 interior sum:', ['360°', '540°', '180°', '720°'], 'A'),
          Q('Exterior angle size of regular n-gon:', ['360/n degrees', '180/n', '(n−2)180/n always for exterior', 'n^2'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 6 Quiz 2 — Similarity', problems: [
          Q('Similar shapes have:', ['Same angles; proportional sides', 'Different angles', 'Equal area always', 'No correspondence'], 'A'),
          Q('Scale k from first to second lengths; areas scale by:', ['k', 'k²', 'k³', '1/k'], 'B'),
          Q('If ΔABC ~ ΔDEF with AB/DE = 2, heights ratio:', ['2', '4', '1', '8'], 'A'),
          Q('Proportion 3/6 = x/10 gives x:', ['5', '4', '6', '20'], 'A'),
          Q('Non-similar shapes may still:', ['Share one angle only', 'Be always similar', 'Never share sides', 'Always congruent'], 'A'),
          Q('Scale factor from smaller to larger >1 means:', ['Enlargement', 'Reduction', 'Reflection only', 'No change'], 'A'),
          Q('Corresponding sides meet at:', ['Matching vertices order', 'Random', 'Never', 'Center always'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 6 Quiz 3 — Triangle similarity', problems: [
          Q('AA criterion needs:', ['Two angle pairs equal', 'Three sides', 'One side', 'Right only'], 'A'),
          Q('SAS similarity uses:', ['Proportional sides about equal included angle', 'All sides different', 'No angles', 'Area'], 'A'),
          Q('SSS similarity uses:', ['Three side proportions', 'One angle', 'Two angles only', 'Altitude'], 'A'),
          Q('Congruence is:', ['Stronger than similarity (same shape and size)', 'Weaker', 'Unrelated', 'Only circles'], 'A'),
          Q('If lines cut parallels, you may get:', ['Equal corresponding angles → similar triangles setups', 'Nothing', 'Always congruent circles', 'Always cubes'], 'A'),
          Q('Match letters A↔D means:', ['Angle A corresponds to D', 'Sides unrelated', 'Areas equal always', 'Parallel'], 'A'),
          Q('Similarity is not guaranteed from:', ['SSA: two sides and a non-included angle (ambiguous case)', 'AA with two pairs of equal angles', 'SAS similarity (proportional sides, equal included angle)', 'SSS side proportionality'], 'A', 'SSA is not a general similarity (or congruence) criterion unless extra conditions (e.g., right triangle HL context) are met.'),
        ]},
        { topicIndex: 3, title: 'Unit 6 Quiz 4 — Circle angles', problems: [
          Q('Central angle equals:', ['Its intercepted arc measure', 'Half arc always', 'Double arc always', '90° always'], 'A'),
          Q('Inscribed angle equals:', ['Half intercepted arc', 'Full arc', 'Twice arc', '0'], 'A'),
          Q('Angle inscribed in semicircle is:', ['45°', '90°', '60°', '30°'], 'B'),
          Q('Same arc inscribed angles are:', ['Equal', 'Always 0', 'Unrelated', '180°'], 'A'),
          Q('Major arc is:', ['>180° arc', '<180°', '=180° always', 'Not on circle'], 'A'),
          Q('Minor arc paired with inscribed angle uses:', ['Half measure relationship', 'Full only', 'Never', 'Cube root'], 'A'),
          Q('Center O on circle problems often join:', ['Radii to endpoints', 'Only tangents', 'Nothing', 'Diagonals of square only'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 6 Quiz 5 — Chords & tangents', problems: [
          Q('Tangent at P is perpendicular to:', ['Any chord', 'Radius OP', 'Another tangent always', 'Diameter not through P always'], 'B'),
          Q('Two tangents from external point to circle have:', ['Equal tangent lengths', 'Unequal always', '90° between always', 'Zero length'], 'A'),
          Q('Chord farther from center is:', ['Longer always', 'Shorter (for fixed circle)', 'Unchanged', 'Not a chord'], 'B'),
          Q('Perpendicular from center to chord:', ['Bisects chord', 'Doubles chord', 'Rotates chord', 'Removes chord'], 'A'),
          Q('Power ideas (intro) may use:', ['Right triangles from radii and tangents', 'Only cubes', 'Statistics', 'Logs'], 'A'),
          Q('If line touches circle once and lies outside elsewhere, it is:', ['Secant', 'Tangent', 'Diameter', 'Chord'], 'B'),
          Q('Radius length r and distance d from center to chord L relate by:', ['Half-chord and r,d right triangle', 'No relation', 'L = 2πr always', 'L = r'], 'A'),
        ]},
      ],
    },

    // ─── Unit 7 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 7: Surface area and volume of solid figures',
      chapterDescription: 'Prisms, cylinders, pyramids, cones, spheres; composite solids.',
      topics: [
        { topicName: 'Prisms and cylinders', topicDescription: 'Lateral and total surface area; volume.', topicObjectives: ['V = base area × height for right prism.', 'Cylinder V = πr²h; lateral area = 2πrh.'], },
        { topicName: 'Pyramids and cones', topicDescription: 'Slant height; volume formulas.', topicObjectives: ['Cone V = (1/3)πr²h.', 'Pyramid V = (1/3) base area × height.'], },
        { topicName: 'Spheres', topicDescription: 'Surface area and volume with radius.', topicObjectives: ['Use A = 4πr² and V = (4/3)πr³.', 'Compare to hemisphere facts when needed.'], },
        { topicName: 'Composite solids', topicDescription: 'Add/subtract volumes or surface (care with overlap).', topicObjectives: ['Decompose a composite solid into parts.', 'Avoid double-counting shared faces in surface area.'], },
        { topicName: 'Units and applied problems', topicDescription: 'Conversions and reasonableness.', topicObjectives: ['Convert between common metric length and volume units.', 'Interpret results in context.'], },
      ],
      exercises: [
        { topicIndex: 0, title: 'Cylinder V', question: 'r = 2, h = 3 ⇒ V = (π)', options: ['6π', '12π', '18π', '4π'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Cone V', question: 'r = 3, h = 4 ⇒ V = (π)', options: ['12π', '15π', '36π', '9π'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 2, title: 'Sphere V', question: 'r = 3 ⇒ V = (π)', options: ['36π', '108π', '27π', '12π'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Composite', question: 'Box 2×3×4 volume:', options: ['9', '24', '18', '20'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Convert', question: '2 m = ___ cm', options: ['20', '200', '2000', '0.02'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Lateral cylinder', question: 'r = 1, h = 5 lateral area =', options: ['10π', '5π', '2π', 'π'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Sphere A', question: 'r = 2 surface area =', options: ['4π', '8π', '16π', '32π'], correctAnswer: 2, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 7 Quiz 1 — Prisms & cylinders', problems: [
          Q('Volume of right prism:', ['Base area × height', '½ base × height', 'πr² only', '4/3 πr³'], 'A'),
          Q('Cylinder volume:', ['πr²h', '2πrh', 'πrh', 'πr³'], 'A'),
          Q('Cylinder lateral area (no bases):', ['2πrh', 'πr²h', '4πr²', '2πr + h'], 'A'),
          Q('Total surface cylinder (both bases):', ['2πrh + 2πr²', '2πrh only', 'πr²h', 'rh'], 'A'),
          Q('Units of volume:', ['Cubic units', 'Square units only', 'Degrees', 'Newtons'], 'A'),
          Q('Triangular prism uses triangular:', ['Base area', 'Hypotenuse only', 'Angle only', 'Perimeter only'], 'A'),
          Q('If radius doubles and height unchanged, cylinder volume scales by:', ['2', '4', '8', '1'], 'B'),
        ]},
        { topicIndex: 1, title: 'Unit 7 Quiz 2 — Pyramids & cones', problems: [
          Q('Cone volume:', ['(1/3)πr²h', 'πr²h', '2πrh', '4πr³'], 'A'),
          Q('Pyramid volume:', ['(1/3) base area × height', 'base × height', '½ base × height always', 'πr²'], 'A'),
          Q('Cone lateral area uses:', ['slant height ℓ in πrℓ', 'ℓ² only', 'No π', 'r only'], 'A'),
          Q('Slant height related to r,h by:', ['ℓ = √(r²+h²) in right cone', 'ℓ = r+h always', 'ℓ = rh', 'ℓ = r/h'], 'A'),
          Q('Compared to prism with same base and height, pyramid volume is:', ['Greater', 'Less (factor 1/3)', 'Equal always', 'Zero'], 'B'),
          Q('Nets help to see:', ['Surface area pieces', 'Only volume', 'Angles in circle only', 'Trig only'], 'A'),
          Q('Height in formulas is:', ['Perpendicular height', 'Slant always', 'Diagonal always', 'Circumference'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 7 Quiz 3 — Spheres', problems: [
          Q('Sphere volume:', ['(4/3)πr³', 'πr³', '4πr²', '2πrh'], 'A'),
          Q('Sphere surface area:', ['4πr²', '(4/3)πr³', '2πr', 'πr²'], 'A'),
          Q('If radius triples, volume scales by:', ['3', '9', '27', '6'], 'C'),
          Q('If radius doubles, surface area scales by:', ['2', '4', '8', '16'], 'B'),
          Q('Hemisphere volume (solid) from radius r:', ['(2/3)πr³', '(4/3)πr³', 'πr³', '2πr²'], 'A'),
          Q('Ball model uses:', ['Sphere', 'Cube always', 'Cone only', 'Prism only'], 'A'),
          Q('Diameter D relates r by:', ['r = D/2', 'r = D', 'r = 2D', 'r = D²'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 7 Quiz 4 — Composite solids', problems: [
          Q('Composite volume often:', ['Sum or difference of parts', 'Always multiply', 'Always average', 'Never defined'], 'A'),
          Q('Shared internal face in surface area:', ['Not part of outer surface', 'Counted twice always', 'Always ignored outside', 'Same as volume'], 'A'),
          Q('Cylinder with hemisphere on top (one flat join) — surface care:', ['Subtract circle area at join from separate totals', 'Always add all faces blindly', 'Ignore hemisphere', 'Use only lateral'], 'A'),
          Q('Decompose means:', ['Split into simpler solids', 'Always multiply', 'Never draw', 'Only cone'], 'A'),
          Q('Tunnel through rectangular block changes:', ['Volume by subtracting tunnel volume', 'Nothing', 'Always adds', 'Only perimeter'], 'A'),
          Q('Check reasonableness by:', ['Order-of-magnitude estimate', 'Never', 'Guess letter', 'Always exact only'], 'A'),
          Q('Water displacement idea connects to:', ['Volume', 'Area only', 'Angle only', 'Trig ratio'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 7 Quiz 5 — Units & applications', problems: [
          Q('1 m³ =', ['1000 L often in metric teaching', '1 L', '10 L', '100 L'], 'A'),
          Q('1 cm³ =', ['1 mL (often)', '1000 mL', '1 L', '0.001 mL'], 'A'),
          Q('Convert cm to m: divide by:', ['10', '100', '1000', '10000'], 'B'),
          Q('Tank volume in m³ and depth in m gives base area by:', ['V/h when prism/cylinder model', 'V·h', 'V+h', '√V'], 'A'),
          Q('Paint coverage problems link:', ['Surface area and coat thickness or rate', 'Volume only always', 'Angles only', 'Trig only'], 'A'),
          Q('Rounding 3.156 to two decimals:', ['3.15', '3.16', '3.1', '3.20'], 'B'),
          Q('Final answer with units:', ['Matches problem context', 'Never written', 'Always inches', 'Never converted'], 'A'),
        ]},
      ],
    },
  ],
};
