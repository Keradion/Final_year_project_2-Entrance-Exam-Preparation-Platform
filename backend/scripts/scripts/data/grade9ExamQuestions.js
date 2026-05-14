/**
 * Five university-entrance-style MCQs per Grade 9 Mathematics topic.
 * When seeding, questions are attached to year-tagged exam papers (2014–2018 E.C.) for sorting only — stems have no year prefix.
 */

const EC_YEARS = [2014, 2015, 2016, 2017, 2018];

function Q(questionText, choices, correctLetter, answerExplanation = '') {
  return { questionText, choices, correctAnswer: correctLetter, answerExplanation };
}

function pack(c, t) {
  switch (`${c}-${t}`) {
    // Unit 1 — Sets
    case '0-0':
      return [
        Q('Which is a well-defined set in the roster sense?', ['The set of tall students in the school', 'The set of prime numbers less than 10', 'The set of interesting novels', 'The set of large numbers'], 'B'),
        Q('The empty set ∅ is best described as:', ['A set with one element 0', 'A set with no elements', 'The same as {∅}', 'A subset of no set'], 'B'),
        Q('Roster notation {a, e, i, o, u} denotes:', ['A set of five vowels (letters)', 'An interval on the number line', 'A sequence with repetition allowed', 'The universal set'], 'A'),
        Q('If ℕ = {1,2,3,…}, which is true?', ['0 ∈ ℕ for all grade-9 textbooks', '3 ∈ ℕ', '−1 ∈ ℕ', '∅ ∈ ℕ'], 'B'),
        Q('Set-builder {x ∈ ℤ | −2 < x < 2} in roster form is:', ['{−2,−1,0,1,2}', '{−1,0,1}', '{0,1}', '{−2,2}'], 'B'),
      ];
    case '0-1':
      return [
        Q('If A ⊆ B and A ≠ B, we also write:', ['A = B', 'A ⊂ B (proper subset)', 'A ∩ B = ∅', 'A ∪ B = ∅'], 'B'),
        Q('How many subsets does {p, q} have?', ['2', '3', '4', '8'], 'C'),
        Q('If every element of A belongs to B, then:', ['B ⊆ A always', 'A ⊆ B', 'A and B are disjoint', 'A ∪ B = ∅'], 'B'),
        Q('For finite sets, if A ⊂ B then:', ['|A| > |B|', '|A| ≤ |B|', '|A| = |B| always', '|A ∩ B| = 0'], 'B'),
        Q('The set {∅} has how many elements?', ['0', '1', '2', 'Undefined'], 'B'),
      ];
    case '0-2':
      return [
        Q('For A = {1,2,4} and B = {2,4,6}, A ∩ B equals:', ['{2,4}', '{1,2,4,6}', '{1,6}', '∅'], 'A'),
        Q('If U = {1,…,6} and A = {1,2,4}, then A′ is:', ['{1,2,4}', '{3,5,6}', '{2,3,5}', '{6}'], 'B'),
        Q('A ∪ A equals:', ['∅', 'A', 'U only', 'A′'], 'B'),
        Q('If A ∩ B = ∅, then A and B are called:', ['Equal', 'Disjoint', 'Subsets of each other', 'Universal'], 'B'),
        Q('(A ∪ B)′ equals (De Morgan):', ['A′ ∪ B′', 'A′ ∩ B′', 'A ∩ B', 'U'], 'B'),
      ];
    case '0-3':
      return [
        Q('In a Venn diagram of two sets A and B, the “both A and B” region is:', ['A ∪ B', 'A ∩ B', 'A \\ B only', 'Outside both'], 'B'),
        Q('Two disjoint non-empty sets have:', ['Non-empty intersection', 'Empty intersection', 'Equal cardinality always', 'Union equal to ∅'], 'B'),
        Q('|A ∪ B| for finite A,B equals:', ['|A| + |B| always', '|A| + |B| − |A ∩ B|', '|A| − |B|', '|A ∩ B| only'], 'B'),
        Q('Shading “only A” corresponds to elements in:', ['A ∩ B', 'A \\ B', 'B \\ A', 'U only'], 'B'),
        Q('For two circles in general position, how many distinct regions?', ['2', '3', '4', '5'], 'C'),
      ];
    case '0-4':
      return [
        Q('In a class, 40 learners: 25 take Math, 18 take English, 10 take both. How many take at least one?', ['33', '43', '53', '15'], 'A'),
        Q('Inclusion–exclusion for two sets: |A ∪ B| =', ['|A| − |B|', '|A| + |B| − |A ∩ B|', '|A ∩ B| − |A|', '|U|'], 'B'),
        Q('If 60 like tea, 50 like coffee, 20 like both (all answered), “both” appears in the intersection because:', ['It is the union count', 'It is the overlap counted twice in naive sum', 'It is always zero', 'It equals neither'], 'B'),
        Q('If |A ∪ B| = 20, |A| = 15, |B| = 12, then |A ∩ B| =', ['7', '47', '3', '32'], 'A'),
        Q('“Learners who passed both Math and English” is modeled by:', ['Union of two sets', 'Intersection of two sets', 'Complement only', 'Symmetric difference only'], 'B'),
      ];
    // Unit 2 — Real numbers
    case '1-0':
      return [
        Q('Which number is rational?', ['√7', '√25', 'π', '√2 + √3'], 'B'),
        Q('Which is true about ℕ, ℤ, ℚ?', ['ℤ ⊂ ℕ', 'ℕ ⊂ ℤ', 'ℚ ⊂ ℕ', 'They are disjoint'], 'B'),
        Q('0.25 as a fraction in lowest terms is:', ['1/5', '1/4', '2/5', '1/2'], 'B'),
        Q('A terminating decimal represents:', ['Always an irrational number', 'A rational number', 'Never a fraction', 'Only integers'], 'B'),
        Q('−3 is a member of:', ['ℕ only', 'ℤ and ℚ', 'ℚ only, not ℤ', 'Neither ℤ nor ℚ'], 'B'),
      ];
    case '1-1':
      return [
        Q('√2 is:', ['Rational', 'Irrational', 'An integer', 'A natural number'], 'B'),
        Q('Which is irrational?', ['√16', '3.14 as an exact fraction 157/50', '√3', '−5'], 'C'),
        Q('π is often approximated by 22/7, but π itself is:', ['Exactly 22/7', 'Irrational', 'An integer', 'Rational with denominator 7'], 'B'),
        Q('The decimal 0.101001000100001… (pattern of gaps) tends to be:', ['Rational with repeating period', 'Irrational', 'An integer', 'Exactly 1/9'], 'B'),
        Q('If x² = 8, then x on ℝ:', ['Is always rational', 'Includes ±2√2 (irrational)', 'Is only 8', 'Does not exist'], 'B'),
      ];
    case '1-2':
      return [
        Q('On the real line, −2.7 compared to −2.05:', ['−2.7 > −2.05', '−2.7 < −2.05', 'They are equal', 'Cannot compare'], 'B'),
        Q('The open interval (1, 5) means:', ['1 ≤ x ≤ 5', '1 < x < 5', 'x = 1 or x = 5 only', 'x ≤ 1'], 'B'),
        Q('Density of ℚ in ℝ implies that between two distinct reals:', ['There is no rational', 'There is a rational (informally, many)', 'There is only an integer', 'There is no real'], 'B'),
        Q('Which is greatest?', ['−1', '−2', '0', '−1/2'], 'C'),
        Q('|−4.3| equals:', ['−4.3', '4.3', '0', '43'], 'B'),
      ];
    case '1-3':
      return [
        Q('|x| interpreted on ℝ is:', ['Always negative', 'Distance from x to 0', 'x² only', 'Undefined for x = 0'], 'B'),
        Q('Solutions of |x| = 5 on ℝ are:', ['x = 5 only', 'x = −5 only', 'x = 5 or x = −5', 'No solution'], 'C'),
        Q('|3 − 8| equals:', ['−5', '5', '11', '0'], 'B'),
        Q('If |a| = |b|, then necessarily:', ['a = b', 'a = b or a = −b', 'a = 0', 'b = 0'], 'B'),
        Q('|x| < 2 means:', ['x ∈ (−2, 2)', 'x ∈ [−2, 2]', 'x > 2 only', 'x < −2 only'], 'A'),
      ];
    case '1-4':
      return [
        Q('Rounding 4.876 to two decimal places gives:', ['4.87', '4.88', '4.86', '4.90'], 'B'),
        Q('The main role of significant figures is to:', ['Increase digits arbitrarily', 'Reflect justified precision from measurements', 'Remove all decimals', 'Force scientific notation'], 'B'),
        Q('0.004070 has how many significant figures if written as measured?', ['3', '4', '5', '6'], 'B'),
        Q('Which is closer to 7.05: 7.0 or 7.1 (nearest tenth)?', ['7.0', '7.1', 'Both equally', 'Neither'], 'A'),
        Q('Scientific notation 3.2 × 10⁻³ equals:', ['3200', '0.0032', '320', '0.32'], 'B'),
      ];
    // Unit 3 — Exponents & radicals
    case '2-0':
      return [
        Q('x³ · x⁴ simplifies to:', ['x^12', 'x^7', 'x', '2x^7'], 'B'),
        Q('(y²)³ equals:', ['y^5', 'y^6', 'y^8', '3y^2'], 'B'),
        Q('(2a)³ expands to:', ['6a³', '8a³', '2a³', '8a'], 'B'),
        Q('a^m · a^n =', ['a^(mn)', 'a^(m+n)', 'a^(m−n)', '2a^(m+n)'], 'B'),
        Q('For a ≠ 0, a⁰ equals:', ['0', '1', 'a', 'Undefined'], 'B'),
      ];
    case '2-1':
      return [
        Q('5⁻² equals:', ['−25', '1/25', '25', '−1/25'], 'B'),
        Q('For x ≠ 0, (3x)⁻¹ equals:', ['3x', '1/(3x)', '−3x', 'x/3'], 'B'),
        Q('(2/3)⁻² equals:', ['4/9', '9/4', '−4/9', '6'], 'B'),
        Q('0⁰ in secondary-school convention is typically:', ['0', '1 (with care)', 'Undefined everywhere', '10'], 'B'),
        Q('2⁻¹ + 4⁻¹ equals:', ['1/6', '3/4', '1/2', '6'], 'B'),
      ];
    case '2-2':
      return [
        Q('√36 (principal square root) equals:', ['±6', '6', '−6', '18'], 'B'),
        Q('³√(−8) equals:', ['Not a real number', '−2', '2', '4'], 'B'),
        Q('√( (−4)² ) on ℝ equals:', ['−4', '4', '16', '−16'], 'B'),
        Q('Which is the radical form of 25^(1/2)?', ['5', '√5', '5²', '1/5'], 'A'),
        Q('√(ab) for a,b ≥ 0 equals:', ['√a · √b', '√a + √b', 'a√b only', 'ab'], 'A'),
      ];
    case '2-3':
      return [
        Q('√50 in simplified radical form is:', ['5√2', '10√5', '25√2', '√(25·2) unsimplified'], 'A'),
        Q('Rationalizing 1/√7 gives:', ['√7/7', '7/√7', '√7', '1/7'], 'A'),
        Q('√12 simplifies to:', ['3√2', '2√3', '6√2', '4√3'], 'B'),
        Q('√(x²) for real x is:', ['Always x', '|x|', '−x', 'x²'], 'B'),
        Q('Multiplying √3 · √2 yields:', ['√5', '√6', '6', '5'], 'B'),
      ];
    case '2-4':
      return [
        Q('3.2 × 10⁴ in ordinary notation is:', ['32000', '0.00032', '320', '32'], 'A'),
        Q('9 × 10⁻² equals:', ['900', '0.09', '90', '0.009'], 'B'),
        Q('(2 × 10³)(3 × 10²) in scientific form is:', ['6 × 10^5', '5 × 10^5', '6 × 10^6', '5 × 10^6'], 'A'),
        Q('Scientific form requires the mantissa m to satisfy:', ['|m| < 1', '1 ≤ |m| < 10', '|m| > 10', 'm integer only'], 'B'),
        Q('0.00045 ≈', ['4.5 × 10^4', '4.5 × 10^−4', '4.5 × 10^3', '4.5 × 10^−3'], 'B'),
      ];
    // Unit 4 — Polynomials
    case '3-0':
      return [
        Q('Degree of 7x³ − x + 2 is:', ['7', '3', '1', '2'], 'B'),
        Q('Leading coefficient of −2x⁴ + x is:', ['1', '−2', '4', '2'], 'B'),
        Q('Constant term of (x + 1)(x − 1) when expanded is:', ['1', '−1', '0', 'x²'], 'B'),
        Q('A monomial is:', ['A sum of unlike terms', 'One term: product of constants and powers', 'Always degree 2', 'Always a binomial'], 'B'),
        Q('Standard form arranges terms by:', ['Random order', 'Descending powers of the variable', 'Ascending only', 'Alphabetical'], 'B'),
      ];
    case '3-1':
      return [
        Q('(4x² − 3x + 1) + (x² + 5x) equals:', ['5x² + 2x + 1', '3x² − 8x + 1', '5x² − 8x', '4x² + 2x + 1'], 'A'),
        Q('(5t + 2) − (t − 3) equals:', ['4t − 1', '4t + 5', '6t + 5', '4t + 1'], 'B'),
        Q('Subtracting (2x + 1) from (3x) gives:', ['x − 1', 'x + 1', '5x + 1', '−x − 1'], 'B'),
        Q('Like terms in 3x²y + 2xy² + x²y are:', ['3x²y and x²y', 'All three', '2xy² and x²y', 'None'], 'A'),
        Q('The sum of two degree-3 polynomials can have degree:', ['Always 6', 'At most 3', 'Always 3', 'Never 3'], 'B'),
      ];
    case '3-2':
      return [
        Q('(x + 2)(x − 3) expands to:', ['x² + x − 6', 'x² − x − 6', 'x² + 5x − 6', 'x² − 5x + 6'], 'B'),
        Q('−2x(x − 4) equals:', ['−2x² + 8x', '−2x² − 8x', '2x² + 8x', '−2x − 4'], 'A'),
        Q('(x + 1)(x + 1) is:', ['x² + 1', 'x² + 2x + 1', 'x² − 1', '2x + 1'], 'B'),
        Q('(a − 3)(a + 3) equals:', ['a² − 9', 'a² + 9', 'a² − 6a + 9', 'a² + 6a + 9'], 'A'),
        Q('Area model for (x+2)(x+3) matches:', ['x² + 5x + 6', 'x² + 6', '2x + 5', 'x + 5'], 'A'),
      ];
    case '3-3':
      return [
        Q('(a + b)² expands to:', ['a² + b²', 'a² + 2ab + b²', 'a² − 2ab + b²', 'a² + ab + b²'], 'B'),
        Q('(r − 2)² equals:', ['r² − 4', 'r² − 4r + 4', 'r² + 4r + 4', 'r² + 4'], 'B'),
        Q('(u − v)(u + v) equals:', ['u² + v²', 'u² − v²', 'u² + 2uv + v²', 'u − v²'], 'B'),
        Q('(2m + 1)² equals:', ['4m² + 1', '4m² + 4m + 1', '4m² + 2m + 1', '2m² + 4m + 1'], 'B'),
        Q('Difference of squares pattern applies to:', ['(x+1)(x+1)', '(x+1)(x−1)', '(x+1)+(x−1)', 'x² + 1 only'], 'B'),
      ];
    case '3-4':
      return [
        Q('(12x⁴ − 6x²) ÷ (3x²) for x ≠ 0 equals:', ['4x² − 2', '4x² − 6', '9x² − 3', '4x⁶ − 2x⁴'], 'A'),
        Q('(8x³) ÷ (2x) for x ≠ 0 equals:', ['4x²', '16x²', '4x⁴', '6x²'], 'A'),
        Q('Dividing each term of a polynomial by monomial uses:', ['Only factoring, never termwise', 'Exponent laws term by term', 'Completing the square only', 'Canceling all variables'], 'B'),
        Q('(15x⁵ + 5x²) ÷ (5x²) simplifies to:', ['3x³ + 1', '3x³ + x', '3x⁵ + 1', 'x³ + x'], 'A'),
        Q('If division yields remainder 0 for all terms, quotient degree compared to dividend typically:', ['Is higher', 'Is lower or equal (variable case)', 'Is always 0', 'Equals ∞'], 'B'),
      ];
    // Unit 5 — Linear equations & inequalities
    case '4-0':
      return [
        Q('Solve 4x + 5 = 17.', ['x = 2', 'x = 3', 'x = 4', 'x = 5.5'], 'B'),
        Q('Solve 2(x − 1) = 6.', ['x = 2', 'x = 3', 'x = 4', 'x = 1'], 'C'),
        Q('If 3x = −9, then x =', ['−3', '3', '−27', '27'], 'A'),
        Q('Equation with no solution on ℝ (example type):', ['2x = 2x', 'x = x + 1', 'x = 1', '3x = 6'], 'B'),
        Q('Zero product idea helps when one side is factored as:', ['A sum of squares only', 'A product equal to zero', 'A constant only', 'An inequality'], 'B'),
      ];
    case '4-1':
      return [
        Q('Solve x/3 + 1/2 = 1.', ['x = 1', 'x = 1.5', 'x = 3/2', 'x = 2/3'], 'B'),
        Q('Clearing denominators in (2x + 1)/4 = 3 often uses:', ['Multiply both sides by LCD', 'Subtract denominators', 'Square both sides only', 'Ignore denominators'], 'A'),
        Q('0.2x = 4 implies x =', ['0.8', '20', '2', '40'], 'B'),
        Q('Equation (3x − 2)/5 = 4 has solution:', ['x = 14/3', 'x = 22/3', 'x = 6', 'x = 7'], 'B'),
        Q('Decimal coefficient equation best handled by:', ['Guessing', 'Scaling to integers when helpful', 'Dropping decimals', 'Squaring always'], 'B'),
      ];
    case '4-2':
      return [
        Q('Solve P = 2l + 2w for w.', ['w = (P − 2l)/2', 'w = P − l', 'w = P/2', 'w = 2P − l'], 'A'),
        Q('From V = (1/3)πr²h, isolating h gives:', ['h = 3V/(πr²)', 'h = Vπr²/3', 'h = πr²/(3V)', 'h = V/3'], 'A'),
        Q('Literal equation ax + b = c, solve for x:', ['x = (c − b)/a if a ≠ 0', 'x = c − b', 'x = a/(c − b)', 'No formula'], 'A'),
        Q('F = ma solved for a:', ['a = Fm', 'a = F/m', 'a = m/F', 'a = F + m'], 'B'),
        Q('Same operations on both sides preserves:', ['Only addition', 'Equivalence of equations (valid steps)', 'The variable name only', 'Inequalities direction always'], 'B'),
      ];
    case '4-3':
      return [
        Q('Solve −3x < 6.', ['x < −2', 'x > −2', 'x > 2', 'x < 2'], 'B'),
        Q('Dividing inequality by negative number:', ['Keeps direction', 'Reverses direction', 'Makes it equality', 'Is not allowed'], 'B'),
        Q('2x − 5 ≥ 1 implies:', ['x ≥ 2', 'x ≥ 3', 'x ≤ 3', 'x ≤ 2'], 'B'),
        Q('Solution of x + 4 ≤ 0 is:', ['x ≤ −4', 'x ≥ −4', 'x ≤ 4', 'x = −4 only'], 'A'),
        Q('Graph of x > 1 on number line uses:', ['Closed circle at 1', 'Open circle at 1, shade right', 'Open circle, shade left', 'No arrow'], 'B'),
      ];
    case '4-4':
      return [
        Q('“A number increased by 9 is 40.” Equation:', ['n − 9 = 40', 'n + 9 = 40', '9n = 40', 'n = 40/9'], 'B'),
        Q('Distance = rate × time gives t =', ['d + r', 'd/r if r ≠ 0', 'r/d', 'dr'], 'B'),
        Q('Consecutive integer sum model for n + (n+1) = 35 gives n =', ['17', '18', '16', '35'], 'A'),
        Q('Perimeter rectangle 2l + 2w = 48 with l = w + 2 yields w =', ['10', '11', '12', '14'], 'B'),
        Q('Checking a solution means:', ['Substitute into the original model', 'Change the problem', 'Ignore units', 'Square all terms'], 'A'),
      ];
    // Unit 6 — Coordinate geometry
    case '5-0':
      return [
        Q('Point (−4, 5) lies in quadrant:', ['I', 'II', 'III', 'IV'], 'B'),
        Q('The origin has coordinates:', ['(1,1)', '(0,0)', '(0,1)', '(1,0)'], 'B'),
        Q('Sign pattern in quadrant IV:', ['x>0, y>0', 'x>0, y<0', 'x<0, y>0', 'x<0, y<0'], 'B'),
        Q('Ordered pair (a,b) means:', ['Move a vertically, b horizontally', 'Move a horizontally, b vertically from origin', 'Sum a+b', 'Product ab'], 'B'),
        Q('Reflected point of (2,3) over x-axis is:', ['(−2,3)', '(2,−3)', '(−2,−3)', '(3,2)'], 'B'),
      ];
    case '5-1':
      return [
        Q('Distance from (0,0) to (0,6) is:', ['6', '36', '√6', '0'], 'A'),
        Q('Distance from (−1,2) to (2,6) is:', ['3', '4', '5', '7'], 'C'),
        Q('Distance formula is based on:', ['Sine law', 'Pythagorean theorem', 'Area of circle', 'Midpoint only'], 'B'),
        Q('If Δx = 3 and Δy = 4, distance is:', ['5', '7', '12', '√7'], 'A'),
        Q('Two points with same y-coordinate:', ['Always distance 0', 'Have horizontal segment', 'Have undefined slope only', 'Are never aligned'], 'B'),
      ];
    case '5-2':
      return [
        Q('Midpoint of (−2,0) and (4,6) is:', ['(1,3)', '(3,3)', '(6,6)', '(2,6)'], 'A'),
        Q('Midpoint formula averages:', ['Slopes', 'x-coordinates and y-coordinates separately', 'Areas', 'Radii'], 'B'),
        Q('Midpoint of (0,0) and (10,0) is:', ['(10,0)', '(5,0)', '(0,5)', '(5,5)'], 'B'),
        Q('If M is midpoint of AB, then AM : MB equals:', ['2:1', '1:2', '1:1', 'Depends on orientation only if unordered'], 'C'),
        Q('Segment from (1,1) to (5,9) midpoint y-coordinate:', ['4', '5', '9', '10'], 'B'),
      ];
    case '5-3':
      return [
        Q('Slope through (0,0) and (2,6) is:', ['2', '3', '1/3', '6'], 'B'),
        Q('Horizontal line slope is:', ['0', '1', 'Undefined', '−1'], 'A'),
        Q('Vertical line slope is:', ['0', '1', 'Undefined', 'Infinite number but “undefined” in grade 9 convention'], 'C'),
        Q('Slope through (1,2) and (5,10) is:', ['2', '8/4 = 2', '4/8', '10'], 'B'),
        Q('Parallel non-vertical lines have slopes:', ['Product −1', 'Equal', 'Always 0', 'Always undefined'], 'B'),
      ];
    case '5-4':
      return [
        Q('y = −x + 4 has y-intercept:', ['4', '−4', '1', '−1'], 'A'),
        Q('In y = mx + b, m represents:', ['y-intercept', 'Slope', 'x-intercept always', 'Area'], 'B'),
        Q('Line with slope 2 through (0,3) is:', ['y = 2x + 3', 'y = 3x + 2', 'y = 2x − 3', 'y = x + 2'], 'A'),
        Q('x-intercept of y = 2x − 8 is at:', ['(0,−8)', '(4,0)', '(−4,0)', '(8,0)'], 'B'),
        Q('Point-slope form idea uses:', ['A known point and slope', 'Only intercepts', 'Only area', 'Circle radius'], 'A'),
      ];
    // Unit 7 — Plane geometry
    case '6-0':
      return [
        Q('Corresponding angles with parallel lines and a transversal are:', ['Supplementary', 'Congruent', 'Complementary always', 'Always 90°'], 'B'),
        Q('Alternate interior angles (parallel lines) are:', ['Unequal', 'Congruuent', 'Always 90°', 'Undefined'], 'B'),
        Q('Two supplementary angles on a straight line sum to:', ['90°', '180°', '360°', '45°'], 'B'),
        Q('If a transversal is perpendicular to one of two parallel lines, it is:', ['Skew', 'Perpendicular to the other', 'Parallel to the other', 'Cannot meet the other'], 'B'),
        Q('Vertical angles are:', ['Supplementary', 'Always congruent', 'Always complementary', 'Never equal'], 'B'),
      ];
    case '6-1':
      return [
        Q('Angles 50° and 60° in a triangle imply third angle:', ['50°', '60°', '70°', '80°'], 'C'),
        Q('Sum of interior angles in a triangle:', ['90°', '180°', '270°', '360°'], 'B'),
        Q('Exterior angle equals sum of:', ['All three interior angles', 'Two non-adjacent interior angles', 'Adjacent interior only', 'Zero'], 'B'),
        Q('Equilateral triangle each angle:', ['45°', '60°', '90°', '30°'], 'B'),
        Q('Right triangle has exactly:', ['No 90° angle', 'One 90° angle', 'Two 90° angles', 'Three 90° angles'], 'B'),
      ];
    case '6-2':
      return [
        Q('ΔABC ≅ ΔDEF with A↔D implies:', ['AB corresponds to EF', 'AB corresponds to DE', '∠A corresponds to ∠F', 'BC corresponds to DE'], 'B'),
        Q('SSS congruence needs:', ['Three angle equalities', 'Three side equalities in order', 'Two sides only', 'One side'], 'B'),
        Q('ASA uses:', ['Angle-side-angle correspondence', 'Two sides andnonincluded angle only', 'Area only', 'Perimeter only'], 'A'),
        Q('Congruent triangles have:', ['Same shape only', 'Same shape and size', 'Same area only always but not sides', 'No relation'], 'B'),
        Q('If two triangles are congruent, corresponding medians are:', ['Unequal', 'Equal in length', 'Always zero', 'Undefined'], 'B'),
      ];
    case '6-3':
      return [
        Q('Opposite sides of a parallelogram are:', ['Skew', 'Parallel and equal in length', 'Perpendicular', 'Always unequal'], 'B'),
        Q('Rectangle is a parallelogram with:', ['All sides equal only', 'Four right angles', 'No parallel sides', 'One pair of parallel sides'], 'B'),
        Q('Rhombus has:', ['No equal sides', 'All sides equal', 'Only two equal sides', 'No diagonals'], 'B'),
        Q('Square is:', ['Rectangle only, not rhombus', 'Both rectangle and rhombus', 'Neither', 'Trapezoid only'], 'B'),
        Q('Trapezoid (one pair parallel definition) has:', ['Two pairs parallel sides', 'At least one pair parallel bases (definition variant)', 'No parallel sides', 'Always congruent diagonals'], 'B'),
      ];
    case '6-4':
      return [
        Q('Triangle base 10 cm, height 6 cm: area =', ['16 cm²', '30 cm²', '60 cm²', '32 cm²'], 'B'),
        Q('Rectangle 3 m by 7 m has area:', ['20 m²', '21 m²', '10 m²', '49 m²'], 'B'),
        Q('Parallelogram area with base b and height h:', ['b + h', '½bh', 'bh', '2(b+h)'], 'C'),
        Q('Circle radius 5 (use π): area =', ['10π', '25π', '5π', '50π'], 'B'),
        Q('Circumference of circle radius r is:', ['πr', '2πr', 'πr²', '2πr²'], 'B'),
      ];
    default:
      return [
        Q('Which choice follows correctly from the definition in this lesson?', ['Use the definition with the given data', 'Ignore givens', 'Change the unit arbitrarily', 'Assume conclusion without proof'], 'A'),
        Q('Which step is always invalid in formal reasoning here?', ['Check against the definition', 'Introduce an unrelated formula', 'Substitute given values', 'Simplify both sides'], 'B'),
        Q('A suitable “trap” wrong answer often:', ['Matches units but wrong operation', 'Matches no pattern', 'Is always undefined', 'Is always 0'], 'A'),
        Q('Best strategy for multi-step items:', ['Work forward from givens, one justified step at a time', 'Guess final letter', 'Skip diagram reading', 'Drop one condition'], 'A'),
        Q('When unsure, you should:', ['Substitute a simple case consistent with the problem', 'Change the problem statement', 'Assume all options equal', 'Reject all choices'], 'A'),
      ];
  }
}

function buildExamQuestionsForTopic({ chapterIndex, topicIndex, topicName }) {
  const raw = pack(chapterIndex, topicIndex);
  return EC_YEARS.map((_, i) => {
    const q = raw[i];
    return {
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      answerExplanation:
        q.answerExplanation ||
        `University entrance exam style item (Mathematics, Natural stream), aligned to “${topicName}”.`,
    };
  });
}

module.exports = {
  buildExamQuestionsForTopic,
  EC_YEARS,
};
