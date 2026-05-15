/**
 * Five university-entrance-style MCQs per Grade 11 Mathematics topic (2014–2018 E.C. papers for metadata only).
 */

const EC_YEARS = [2014, 2015, 2016, 2017, 2018];

function Q(questionText, choices, correctLetter, answerExplanation = '') {
  return { questionText, choices, correctAnswer: correctLetter, answerExplanation };
}

function pack(c, t) {
  switch (`${c}-${t}`) {
    case '0-0':
      return [
        Q('The graph of y = f⁻¹(x) is obtained from y = f(x) by reflecting across:', ['y = x', 'x-axis', 'y-axis', 'origin'], 'A'),
        Q('If (2, 5) lies on y = f(x), a point on y = f⁻¹(x) is:', ['(5, 2)', '(2, 5)', '(−2, 5)', '(2, −5)'], 'A'),
        Q('A function may fail to have an inverse that is a function if it:', ['is not one-to-one', 'is linear', 'has domain ℝ', 'is constant'], 'A'),
        Q('To find f⁻¹ algebraically, a common first step is:', ['write y = f(x) and solve for x', 'differentiate f', 'graph only', 'assume f(x)=0'], 'A'),
        Q('Inverse functions undo composition on suitable domains: f(f⁻¹(x)) =', ['x (when defined)', '0', '1', 'f(x)'], 'A'),
      ];
    case '0-1':
      return [
        Q('For f(x)=2x and g(x)=x+3, (f∘g)(1) equals:', ['8', '5', '4', '6'], 'A'),
        Q('The domain of f∘g is constrained by:', ['domain of g and where g(x) lies in domain of f', 'only f', 'only constants', 'no constraints'], 'A'),
        Q('Composition is generally:', ['not commutative', 'always commutative', 'only for constants', 'undefined'], 'A'),
        Q('(f∘g)(x) means:', ['f(g(x))', 'g(f(x))', 'f(x)·g(x)', 'f(x)+g(x)'], 'A'),
        Q('If g(2)=7 and f(7)=−1, then (f∘g)(2)=', ['−1', '7', '2', '9'], 'A'),
      ];
    case '0-2':
      return [
        Q('A piecewise function may need different rules because:', ['different intervals apply', 'all functions are global polynomials', 'never', 'only for circles'], 'A'),
        Q('At x = 1 where rules change, evaluation uses:', ['the rule whose interval contains x', 'always the larger rule', 'average', 'zero'], 'A'),
        Q('Graph of a piecewise linear function can show:', ['corners or jumps depending on definitions', 'only smooth curves', 'only circles', 'no segments'], 'A'),
        Q('Domain of a piecewise function is typically:', ['union of intervals where pieces are defined', 'only positive x', 'empty', 'a single point'], 'A'),
        Q('Piecewise models appear when:', ['a process changes rule at thresholds', 'everything is quadratic', 'never in science', 'only with matrices'], 'A'),
      ];
    case '0-3':
      return [
        Q('Horizontal line test: if some horizontal line meets the graph twice, then:', ['f is not one-to-one', 'f must be quadratic', 'f has no domain', 'f is not a function'], 'A'),
        Q('A strictly increasing continuous function on ℝ is:', ['one-to-one', 'never one-to-one', 'always constant', 'not a function'], 'A'),
        Q('Restricting domain can:', ['make a function invertible when the restriction is one-to-one', 'remove all values', 'always break algebra', 'never help'], 'A'),
        Q('Vertical line test checks:', ['Whether relation is a function', 'Whether it is one-to-one', 'Circle tangents', 'Matrix rank'], 'A'),
        Q('If f is not one-to-one, its inverse relation:', ['may fail to be a function without restriction', 'is always a line', 'is always empty', 'is always quadratic'], 'A'),
      ];
    case '0-4':
      return [
        Q('For b>0, b≠1: log_b(b³) equals:', ['3', 'b³', 'b', '1'], 'A'),
        Q('Exponential y=b^x and log y=log_b x are:', ['inverses on suitable domains', 'identical', 'unrelated', 'always parallel lines'], 'A'),
        Q('The natural log ln x is log base:', ['e', '10', '2', 'π'], 'A'),
        Q('log₂ 8 equals:', ['3', '2', '4', '1/3'], 'A'),
        Q('Composition e^{ln x} for x>0 simplifies to:', ['x', 'e^x', 'ln e', '0'], 'A'),
      ];
    case '1-0':
      return [
        Q('In P(t)=P₀·a^t with a>1, growth factor per unit t is:', ['a', 'P₀', 't', '1/a'], 'A'),
        Q('Exponential decay often has factor a in:', ['(0,1)', '(1,∞)', 'only negatives', 'only zero'], 'A'),
        Q('Doubling time ideas pair with:', ['exponential growth models', 'only linear', 'only trig', 'circle area'], 'A'),
        Q('As t grows, 0.92^t tends to:', ['0', '∞', '1', '−∞'], 'A'),
        Q('If 5^N = 125, then N =', ['3', '2', '4', '5'], 'A'),
      ];
    case '1-1':
      return [
        Q('log₃ 81 equals:', ['4', '3', '9', '27'], 'A'),
        Q('log_b 1 equals:', ['0', '1', 'b', 'undefined always'], 'A'),
        Q('log_b b equals:', ['1', '0', 'b²', '−1'], 'A'),
        Q('If b^x = c with b,c>0, b≠1, then x =', ['log_b c', 'b^c', 'c/b', 'ln b'], 'A'),
        Q('A logarithm answers: “To what power do I raise the base to get ___?”', ['the argument', 'the base always', 'zero always', 'i'], 'A'),
      ];
    case '1-2':
      return [
        Q('log₂(AB) equals:', ['log₂ A + log₂ B', 'log₂ A · log₂ B', 'log₂(A+B)', 'log₂ A − log₂ B'], 'A'),
        Q('log₃(x⁵) equals:', ['5 log₃ x', 'x log₃ 5', 'log₃ x − 5', '(log₃ x)⁵'], 'A'),
        Q('ln(x/y) expands to:', ['ln x − ln y', 'ln x + ln y', 'ln x / ln y', '(ln x)(ln y)'], 'A'),
        Q('Change-of-base: log_a x equals:', ['ln x / ln a', 'ln a / ln x', 'ln(ax)', 'ln x · ln a'], 'A'),
        Q('log₄ 2 equals:', ['1/2', '2', '4', '√2'], 'A'),
      ];
    case '1-3':
      return [
        Q('If 2^x = 32, then x =', ['5', '4', '6', '3'], 'A'),
        Q('If 9^x = 27, a useful step expresses both sides as powers of:', ['3', '2', '5', '10'], 'A'),
        Q('If e^{2t} = 5, then 2t =', ['ln 5', 'e⁵', '5e', 'log₁₀ 2'], 'A'),
        Q('3^{2x−1} = 3⁴ implies:', ['2x − 1 = 4', '2x = 4', 'x = 4 only', 'no equation'], 'A'),
        Q('Taking log of both sides helps when:', ['bases do not match cleanly', 'never', 'only for lines', 'only for circles'], 'A'),
      ];
    case '1-4':
      return [
        Q('log₅(x−2) requires:', ['x − 2 > 0', 'x > 0 only', 'x < 2', 'no restriction'], 'A'),
        Q('If log x + log(x−3) = log 10, combining gives log of:', ['x(x−3)', 'x + (x−3)', '10x', '3x'], 'A'),
        Q('Extraneous solutions are common after:', ['exponentiating or combining logs without domain checks', 'substitution in linear systems', 'Pythagoras', 'matrix add'], 'A'),
        Q('If ln(2y) = 1, then y equals:', ['e/2', 'e', '2e', '1/2'], 'A'),
        Q('A solution making a log argument zero is:', ['invalid', 'always best', 'always e', 'always 1'], 'A'),
      ];
    case '2-0':
      return [
        Q('π radians equals:', ['180°', '90°', '360°', '60°'], 'A'),
        Q('Arc length s with radius r and central angle θ (radians) satisfies:', ['s = rθ', 's = r/θ', 's = θ/r', 's = r²θ'], 'A'),
        Q('30° in radians is:', ['π/6', 'π/4', 'π/3', 'π/2'], 'A'),
        Q('One full turn in radians:', ['2π', 'π', '4π', '1'], 'A'),
        Q('π/2 radians is:', ['90°', '45°', '180°', '30°'], 'A'),
      ];
    case '2-1':
      return [
        Q('On the unit circle, cos θ is the:', ['x-coordinate', 'y-coordinate', 'hypotenuse of triangle with side 2', 'radius > 1'], 'A'),
        Q('The point for θ = 0 on the unit circle is:', ['(1, 0)', '(0, 1)', '(−1,0)', '(0,−1)'], 'A'),
        Q('sin²θ + cos²θ on the unit circle equals:', ['1', '0', '2', 'tan θ'], 'A'),
        Q('Angle π radians corresponds to:', ['(−1, 0) on unit circle', '(1,0)', '(0,1)', '(0,−1)'], 'A'),
        Q('Coordinates on the unit circle come from:', ['(cos θ, sin θ)', '(sin θ, cos θ) always reversed only', '(tan θ, sec θ) always', '(θ, θ)'], 'A'),
      ];
    case '2-2':
      return [
        Q('For y = sin x, the period is:', ['2π', 'π', '4π', '1'], 'A'),
        Q('Amplitude of y = 3 sin x is:', ['3', '1', '2π', '6'], 'A'),
        Q('The midline of y = 2 sin x + 5 is:', ['y = 5', 'y = 2', 'y = 0', 'y = 7'], 'A'),
        Q('Cosine starts at its maximum at x=0 for:', ['y = cos x', 'y = sin x', 'y = tan x', 'y = sec x'], 'A'),
        Q('Period of y = sin(bx) with b>0 is:', ['2π/b', '2π', 'b', 'π/b'], 'A'),
      ];
    case '2-3':
      return [
        Q('arcsin(1/2) (principal value) is:', ['π/6', 'π/3', 'π/2', '5π/6'], 'A'),
        Q('Range of principal arcsin is typically:', ['[−π/2, π/2]', '[0, π]', '[−π, π]', '(0, 2π)'], 'A'),
        Q('arctan(√3) (principal) is:', ['π/3', 'π/6', 'π/4', 'π/2'], 'A'),
        Q('Inverse trig needs domain restriction because:', ['sin/cos/tan are not one-to-one on maximal domains', 'they are always linear', 'angles are always degrees', 'unit circle is undefined'], 'A'),
        Q('cos(arccos x) equals for x in [−1,1]:', ['x', '1', '0', '√(1−x²)'], 'A'),
      ];
    case '2-4':
      return [
        Q('sec θ equals:', ['1/cos θ', '1/sin θ', 'cos θ/sin θ', 'sin θ/cos θ'], 'A'),
        Q('cot θ equals:', ['cos θ/sin θ', 'sin θ/cos θ', '1/sin θ', '1/cos θ'], 'A'),
        Q('1 + tan²θ equals:', ['sec²θ', 'csc²θ', 'sin²θ', 'cos²θ'], 'A'),
        Q('csc θ is undefined when:', ['sin θ = 0', 'cos θ = 0', 'tan θ = 0', 'θ = 45°'], 'A'),
        Q('Reciprocal identities link sec, csc, cot to:', ['sin and cos primarily', 'only hyperbolas', 'matrix trace', 'complex i'], 'A'),
      ];
    case '3-0':
      return [
        Q('Distance from (0,0) to (3,4) is:', ['5', '7', '12', '25'], 'A'),
        Q('Midpoint of (−2,6) and (4,2) is:', ['(1, 4)', '(3, 4)', '(0, 4)', '(2, 8)'], 'A'),
        Q('Slope of line through (1,1) and (3,5) is:', ['2', '1/2', '4', '3'], 'A'),
        Q('Parallel lines (non-vertical) have:', ['equal slopes', 'product −1', 'no relation', 'undefined slopes'], 'A'),
        Q('Perpendicular slopes m₁ and m₂ (non-vertical/horizontal) satisfy:', ['m₁m₂ = −1', 'm₁=m₂', 'm₁+m₂=0', 'm₁=0'], 'A'),
      ];
    case '3-1':
      return [
        Q('Center of (x−2)²+(y+1)² = 9 is:', ['(2, −1)', '(−2, 1)', '(2,1)', '(3,0)'], 'A'),
        Q('Radius of x²+y² = 16 is:', ['4', '16', '8', '256'], 'A'),
        Q('Expanding (x−1)²+(y−2)² = 25 shows linear terms unless:', ['completed correctly with squares', 'always zero', 'never quadratic', 'only if origin-centered'], 'A'),
        Q('A circle equation has coefficients of x² and y²:', ['equal (when not degenerate conic mix-up)', 'always opposite', 'always 0', 'different always'], 'A'),
        Q('Completing the square helps rewrite:', ['general form into center–radius form', 'only ellipses', 'only hyperbolas', 'only logs'], 'A'),
      ];
    case '3-2':
      return [
        Q('Parabola y = (x−3)² + 2 has vertex:', ['(3, 2)', '(−3, 2)', '(3, −2)', '(2, 3)'], 'A'),
        Q('For y = a(x−h)²+k with a>0, opens:', ['up', 'down', 'left', 'right'], 'A'),
        Q('Focus–directrix definition ties distance to focus and:', ['directrix line', 'center', 'origin only', 'asymptote'], 'A'),
        Q('Axis of symmetry of y = 4(x+1)² is:', ['x = −1', 'y = −1', 'x = 1', 'y = 4'], 'A'),
        Q('A vertical shift affects:', ['k in vertex form', 'only h', 'period only', 'eccentricity'], 'A'),
      ];
    case '3-3':
      return [
        Q('Standard ellipse x²/a² + y²/b² = 1 (a,b>0) crosses x-axis at:', ['±a', '±b', '±1 only', '0 only'], 'A'),
        Q('Sum of distances from ellipse points to two foci is:', ['constant (2a in standard horizontal major cases with suitable labeling)', 'always 0', 'π', 'variable with no pattern'], 'A'),
        Q('If semi-major axis is 5 and semi-minor is 3, rough shape is:', ['elongated along major axis', 'always a circle radius 8', 'hyperbola', 'parabola'], 'A'),
        Q('Circle is special ellipse when:', ['semi-axes equal', 'never', 'always degenerate', 'eccentricity 2'], 'A'),
        Q('Eccentricity of ellipse satisfies:', ['0 ≤ e < 1', 'e = 1 always', 'e > 1 always', 'e undefined'], 'A'),
      ];
    case '3-4':
      return [
        Q('Unit hyperbola x² − y² = 1 has asymptotes:', ['y = ±x', 'y = ±x²', 'y = 0 only', 'x = 0 only'], 'A'),
        Q('Compared to ellipse, hyperbola standard form uses:', ['minus between squared terms (basic orientation)', 'plus only', 'only linear terms', 'only one variable'], 'A'),
        Q('Hyperbola branches approach:', ['asymptotes', 'a single point always', 'a circle', 'y-axis only'], 'A'),
        Q('For hyperbola, eccentricity e typically satisfies:', ['e > 1', 'e < 1', 'e = 0', 'e = π'], 'A'),
        Q('Conic classification uses:', ['quadratic terms and discriminant-style tests', 'only distance formula once', 'only trig', 'only determinants of 4×4'], 'A'),
      ];
    case '4-0':
      return [
        Q('i² equals:', ['−1', '1', 'i', '−i'], 'A'),
        Q('Real part of 7 − 3i is:', ['7', '−3', '3', '0'], 'A'),
        Q('Imaginary part of 7 − 3i is:', ['−3', '7', '3i', '10'], 'A'),
        Q('Complex numbers include:', ['a + bi with a,b real', 'only reals', 'only i', 'only rationals'], 'A'),
        Q('√(−9) in ℂ simplifies to:', ['3i', '−3i only always wrong', '9i', 'undefined'], 'A'),
      ];
    case '4-1':
      return [
        Q('|3 + 4i| equals:', ['5', '7', '12', '25'], 'A'),
        Q('Point 3 + 4i sits in Argand plane at:', ['(3, 4) treating Im as y', '(4,3)', '(3,−4)', '(−3,4)'], 'A'),
        Q('|z| measures:', ['distance from origin', 'angle only', 'real part only', 'imaginary part only'], 'A'),
        Q('|z| = 0 implies:', ['z = 0', 'z = i', 'z = 1', 'no solution'], 'A'),
        Q('Modulus is always:', ['non-negative real', 'pure imaginary', 'negative', 'undefined'], 'A'),
      ];
    case '4-2':
      return [
        Q('(2 + i) + (3 − 2i) equals:', ['5 − i', '5 + i', '1 − i', '1 + 3i'], 'A'),
        Q('i(1 + i) equals:', ['i + i² = −1 + i', '1 + i', 'i', '−i'], 'A'),
        Q('(1 + i)² equals:', ['2i', '2', '−2', '1 − 2i'], 'A'),
        Q('Multiplying by i rotates by 90° about origin in:', ['Argand picture (standard convention)', 'only real axis', 'never', 'matrix world only'], 'A'),
        Q('Associativity holds for addition in ℂ:', ['yes', 'no', 'only for reals', 'only for integers'], 'A'),
      ];
    case '4-3':
      return [
        Q('Conjugate of 5 − 2i is:', ['5 + 2i', '−5 − 2i', '5 − 2i', '−5 + 2i'], 'A'),
        Q('z·z̄ for z=a+bi equals:', ['a² + b²', 'a² − b²', '2a', '2bi'], 'A'),
        Q('To divide by a+bi, multiply numerator and denominator by:', ['a − bi (conjugate)', 'a+bi again', 'i only', '0'], 'A'),
        Q('Real part of (x+iy)(x−iy) is:', ['x² + y²', 'x² − y²', '2xy', '0'], 'A'),
        Q('Conjugate reflects across:', ['real axis in Argand plane', 'imaginary axis only', 'line y=x always', 'unit circle'], 'A'),
      ];
    case '4-4':
      return [
        Q('Polar form z = r(cos θ + i sin θ) has r =', ['|z|', 'arg z', 'Re z', 'Im z'], 'A'),
        Q('Multiplying two complex numbers in polar form multiplies magnitudes and:', ['adds angles', 'subtracts angles', 'multiplies angles', 'ignores angles'], 'A'),
        Q('e^{iπ} + 1 = 0 involves:', ["Euler's bridge between exp and trig", 'only real logs', 'only matrices', 'determinant'], 'A'),
        Q('Argument of a positive real number can be taken as:', ['0', 'π/2', 'π', '2π'], 'A'),
        Q('De Moivre-style ideas power n-th roots of unity in:', ['complex plane', 'only ℝ', 'only integers', 'only cones'], 'A'),
      ];
    case '5-0':
      return [
        Q('A 2×3 matrix has:', ['2 rows and 3 columns', '3 rows and 2 columns', '6 rows', '5 entries'], 'A'),
        Q('Equality of matrices requires:', ['same size and all entries equal', 'same determinant only', 'same trace only', 'only square'], 'A'),
        Q('A row vector could be written as 1×n:', ['yes', 'never', 'only n=2', 'only for circles'], 'A'),
        Q('Zero matrix acts like ___ under addition.', ['identity for addition', 'multiplicative inverse', 'undefined', 'logarithm'], 'A'),
        Q('Transpose swaps:', ['rows and columns', 'sign only', 'determinant with trace', 'i with −i'], 'A'),
      ];
    case '5-1':
      return [
        Q('If A is m×n and B is n×p, AB is:', ['m×p', 'n×n', 'p×m', 'undefined'], 'A'),
        Q('Matrix multiplication is generally:', ['not commutative', 'commutative', 'only for 1×1', 'impossible'], 'A'),
        Q('Identity matrix Iₙ has ones on:', ['main diagonal', 'anti-diagonal only', 'every entry', 'last row only'], 'A'),
        Q('If AB is defined, BA:', ['may be undefined or different size', 'is always defined', 'always equals AB', 'is always I'], 'A'),
        Q('Row-by-column rule dot-products a row of A with:', ['a column of B', 'a row of B always', 'entire B', 'vector 0'], 'A'),
      ];
    case '5-2':
      return [
        Q('det [[a,b],[c,d]] equals:', ['ad − bc', 'ad + bc', 'ac − bd', 'a + d'], 'A'),
        Q('If det A = 0 for square A, then A is:', ['singular (no inverse)', 'always invertible', 'always identity', 'not square'], 'A'),
        Q('det I₂ equals:', ['1', '0', '2', '−1'], 'A'),
        Q('Scaling one row by k scales determinant by:', ['k', 'k²', '1/k', '0'], 'A'),
        Q('Swapping two rows:', ['flips sign of determinant', 'no effect', 'doubles det', 'sets det to 1'], 'A'),
      ];
    case '5-3':
      return [
        Q('If A⁻¹ exists, A A⁻¹ =', ['I', '0', 'A²', 'Aᵀ'], 'A'),
        Q('Inverse of 2×2 [[a,b],[c,d]] uses factor 1/(ad−bc) times:', ['[[d,−b],[−c,a]]', '[[a,b],[c,d]]', '[[−d,b],[c,−a]]', 'transpose only'], 'A'),
        Q('If det A = 3, det(A⁻¹) is:', ['1/3', '3', '9', '−3'], 'A'),
        Q('Solving Ax = b with invertible A gives x =', ['A⁻¹b', 'bA⁻¹ always same', 'Ab', 'det A'], 'A'),
        Q('Not all square matrices have inverses when:', ['det = 0', 'det ≠ 0', 'always', 'never'], 'A'),
      ];
    case '5-4':
      return [
        Q('Cramer’s rule for 2×2 applies when:', ['det of coefficient matrix ≠ 0', 'always', 'never', 'only for 3×3'], 'A'),
        Q('Determinant in denominator of Cramer’s rule is:', ['coefficient matrix determinant', 'right-hand side determinant', 'always 1', 'trace'], 'A'),
        Q('If det = 0, Cramer’s rule:', ['fails / inconsistent or dependent', 'always gives x=0', 'always works', 'only for complex'], 'A'),
        Q('Matrix form Ax=b packages coefficients into:', ['A', 'only x', 'only constants scattered', 'only circles'], 'A'),
        Q('Replacement columns in Cramer numerators come from:', ['constants vector', 'always first column only', 'zeros', 'identity'], 'A'),
      ];
    case '6-0':
      return [
        Q('Vector ⟨3, −4⟩ has length:', ['5', '7', '12', '25'], 'A'),
        Q('From point A to B, vector components are:', ['difference of coordinates', 'sum always', 'product', 'midpoint'], 'A'),
        Q('Zero vector has magnitude:', ['0', '1', 'undefined', 'i'], 'A'),
        Q('⟨a,b⟩ represents displacement in:', ['plane ℝ²', 'only ℝ', 'only ℂ alone', 'sphere S²'], 'A'),
        Q('Standard basis in ℝ² includes:', ['⟨1,0⟩ and ⟨0,1⟩', 'only ⟨1,1⟩', '⟨i,0⟩', 'empty set'], 'A'),
      ];
    case '6-1':
      return [
        Q('⟨1,2⟩ + ⟨3,4⟩ equals:', ['⟨4,6⟩', '⟨2,2⟩', '⟨3,8⟩', '⟨−2,−2⟩'], 'A'),
        Q('Parallelogram rule constructs sum by:', ['diagonal of parallelogram built from vectors', 'always perpendicular only', 'averaging lengths only', 'dot product only'], 'A'),
        Q('Head-to-tail places tail of second at:', ['head of first', 'origin only', 'midpoint always', 'random'], 'A'),
        Q('Vector addition is:', ['commutative', 'not commutative', 'only for unit vectors', 'undefined'], 'A'),
        Q('Geometrically, adding two vectors yields:', ['resultant displacement', 'always zero', 'always perpendicular', 'scalar only'], 'A'),
      ];
    case '6-2':
      return [
        Q('3⟨1,−2⟩ equals:', ['⟨3,−6⟩', '⟨1,−6⟩', '⟨3,2⟩', '⟨4,1⟩'], 'A'),
        Q('A unit vector has magnitude:', ['1', '0', '√2 always', 'variable'], 'A'),
        Q('Scalar multiplication by negative reverses:', ['direction (if nonzero)', 'nothing', 'only length not direction', 'dimension'], 'A'),
        Q('⟨2,0⟩ scaled by 1/2 is:', ['⟨1,0⟩', '⟨2,0⟩', '⟨4,0⟩', '⟨0,2⟩'], 'A'),
        Q('Parallel nonzero vectors differ by:', ['scalar multiple', 'always rotation 90°', 'matrix inverse', 'complex conjugation'], 'A'),
      ];
    case '6-3':
      return [
        Q('⟨1,0⟩·⟨0,1⟩ equals:', ['0', '1', '−1', 'i'], 'A'),
        Q('u·v for column vectors (2D) with u=⟨u₁,u₂⟩, v=⟨v₁,v₂⟩ is:', ['u₁v₁ + u₂v₂', 'u₁v₂ + u₂v₁ always', 'cross product magnitude', 'det always'], 'A'),
        Q('If u·v = 0 for nonzero plane vectors, they are:', ['perpendicular', 'parallel', 'identical', 'undefined'], 'A'),
        Q('u·u equals:', ['|u|²', '|u|', '0', 'det(u)'], 'A'),
        Q('Dot product is commutative:', ['yes', 'no', 'only in ℝ³', 'only for complex'], 'A'),
      ];
    case '6-4':
      return [
        Q('Matrix [[a,b],[c,d]] times vector ⟨x,y⟩ produces:', ['⟨ax+by, cx+dy⟩', '⟨ax,cy⟩ always', 'a scalar always', '⟨x,y⟩'], 'A'),
        Q('Linear transformations preserve:', ['linear combinations / origin fixed', 'all distances individually', 'angles always', 'circles to squares always'], 'A'),
        Q('Rotation matrices are:', ['orthogonal with determinant 1 (special cases)', 'always diagonal', 'always zero', 'never invertible'], 'A'),
        Q('Shear is an example of:', ['linear map', 'nonlinear always', 'complex conjugation', 'logarithm'], 'A'),
        Q('Composition of linear maps corresponds to:', ['matrix multiplication', 'matrix addition only', 'dot product of maps', 'scalar add'], 'A'),
      ];
    default:
      return [
        Q('Which step best fits this topic?', ['Use definitions and given data', 'Guess', 'Drop constraints', 'Skip verification'], 'A'),
        Q('A typical trap is:', ['ignoring domain or singular cases', 'checking units', 'drawing a figure', 'substituting'], 'A'),
        Q('If two methods disagree:', ['re-read the setup', 'pick arbitrarily', 'always average', 'stop early'], 'A'),
        Q('Final answers should:', ['match requested form and constraints', 'never include checks', 'always be complex', 'avoid labeling'], 'A'),
        Q('Good first move is:', ['record what is given symbolically', 'jump to memorized template blindly', 'erase information', 'change variables randomly'], 'A'),
      ];
  }
}

function buildExamQuestionsForTopic({ chapterIndex, topicIndex, topicName }) {
  void topicName;
  const raw = pack(chapterIndex, topicIndex);
  return EC_YEARS.map((_year, i) => {
    const q = raw[i];
    return {
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      answerExplanation:
        q.answerExplanation ||
        `Entrance-exam style item aligned to Grade 11 topic ${chapterIndex + 1}.${topicIndex + 1}.`,
    };
  });
}

module.exports = { buildExamQuestionsForTopic };
