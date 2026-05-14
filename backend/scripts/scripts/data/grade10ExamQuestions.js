/**
 * Five university-entrance-style MCQs per Grade 10 Mathematics topic (2014–2018 E.C. papers for metadata only).
 */

const EC_YEARS = [2014, 2015, 2016, 2017, 2018];

function Q(questionText, choices, correctLetter, answerExplanation = '') {
  return { questionText, choices, correctAnswer: correctLetter, answerExplanation };
}

function pack(c, t) {
  switch (`${c}-${t}`) {
    case '0-0':
      return [
        Q('For (3x)/(x−4), values excluded from the domain include:', ['x = 0', 'x = 4', 'x = 3', 'x = −4'], 'B'),
        Q('Which expression is defined for all real x?', ['1/(x²+1)', '1/x', '1/(x−1)', '√(−x)'], 'A'),
        Q('(x²−9)/(x−3) for x≠3 simplifies to:', ['x−3', 'x+3', 'x', '3'], 'B'),
        Q('Zero in a numerator only (denominator nonzero) makes the fraction:', ['Undefined', 'Equal to 0', 'Infinite', 'Not a rational expression'], 'B'),
        Q('Listing excluded values should happen:', ['Before multiplying both sides of an equation by LCD', 'Never', 'Only for quadratics', 'Only for trig'], 'A'),
      ];
    case '0-1':
      return [
        Q('(2/x)·(x²/5) for x≠0 equals:', ['2x/5', '10/x', 'x/10', '5/(2x)'], 'A'),
        Q('Dividing by a rational expression is equivalent to multiplying by its:', ['Square', 'Reciprocal', 'Derivative', 'LCD only'], 'B'),
        Q('(a/b)·(b/a) for ab≠0 equals:', ['0', '1', 'a²', 'b²'], 'B'),
        Q('After multiplying rational expressions you should:', ['Factor and cancel where allowed', 'Never simplify', 'Add numerators only', 'Remove variables'], 'A'),
        Q('Domain of a product includes:', ['Intersection of domains of factors (excluding new zeros of denominators)', 'Only positive x', 'All ℂ', 'Never ℝ'], 'A'),
      ];
    case '0-2':
      return [
        Q('LCD of 1/x and 1/(x+2) is:', ['x', 'x+2', 'x(x+2)', '2'], 'C'),
        Q('3/(x+1) − 1/(x+1) for x≠−1 equals:', ['2/(x+1)', '4/(x+1)', '2', '3'], 'A'),
        Q('Adding rational expressions needs:', ['Common denominator', 'Equal numerators', 'Same degree only', 'Trig substitution'], 'A'),
        Q('Subtracting flips the sign of:', ['Only denominators', 'Every term in the second numerator after single fraction form', 'Pi', 'Only constants'], 'B'),
        Q('LCD choice should be:', ['A multiple of each denominator polynomial', 'Smaller than any denominator', 'Always 1', 'Always x'], 'A'),
      ];
    case '0-3':
      return [
        Q('(1/x)/(1/x²) for x≠0 simplifies to:', ['x', '1/x', 'x²', 'x³'], 'A'),
        Q('Simplifying a complex fraction often multiplies top and bottom by:', ['LCD of inner denominators', 'Only x', 'Zero', 'π'], 'A'),
        Q('If numerator and denominator are identical rational expressions (same domain), value is:', ['0', '1 where defined', 'x', 'undefined always'], 'B'),
        Q('Nested fractions require attention to:', ['Excluded values at each stage', 'Only color', 'Only angles', 'Matrix rank'], 'A'),
        Q('1/(1 + 1/x) with x≠0, x≠−1 simplifies by:', ['Multiplying num/den by x', 'Dropping 1', 'Squaring', 'Replacing x by 1/x always'], 'A'),
      ];
    case '0-4':
      return [
        Q('After solving a rational equation, extraneous roots fail:', ['LCD existence', 'Substitution in original equation', 'Color test', 'Exponent rules'], 'B'),
        Q('If 5/(x−2)=2, then x equals:', ['4.5', '3/2', '9/2', '7/2'], 'C'),
        Q('Multiplying both sides by (x−3) may introduce:', ['Always better solutions', 'Candidates that make factor 0', 'No change', 'Complex only'], 'B'),
        Q('First algebraic step usually lists:', ['Excluded values from denominators', 'Only final answers', 'Only graph', 'Only discriminant'], 'A'),
        Q('Clearing denominators is not equivalent if you:', ['Divide by expressions that can be 0 on candidate solutions', 'Check solutions', 'Use LCD', 'Keep domain notes'], 'A'),
      ];
    case '1-0':
      return [
        Q('−4x ≤ 8 implies:', ['x ≤ −2', 'x ≥ −2', 'x ≤ 2', 'x ≥ 2'], 'B'),
        Q('Multiplying an inequality by −1:', ['Preserves direction', 'Reverses direction', 'Makes it equality', 'Is impossible'], 'B'),
        Q('Graph of x > 2 on a number line uses:', ['Closed circle at 2', 'Open circle at 2, shade right', 'Shade left', 'No arrow'], 'B'),
        Q('Compound −1 ≤ x < 3 includes x =', ['−1', '3', '4', '−2'], 'A'),
        Q('“At most 7” means:', ['x > 7', 'x ≤ 7', 'x ≥ 7', 'x = 7'], 'B'),
      ];
    case '1-1':
      return [
        Q('Two distinct non-vertical parallel lines in a plane:', ['Meet once', 'Never meet', 'Are the same line', 'Meet twice'], 'B'),
        Q('Graphing a system helps:', ['Visualize intersection or parallelism', 'Remove variables', 'Factor cubics', 'Compute determinants only'], 'A'),
        Q('Coincident lines graph as:', ['One line; infinitely many solutions', 'No points in common', 'Exactly one solution', 'A parabola'], 'A'),
        Q('Solution (x,y) must lie:', ['On both lines simultaneously', 'Only on x-axis', 'Only on y-axis', 'Outside plane'], 'A'),
        Q('If slopes differ, lines are:', ['Parallel distinct', 'Intersecting (unless vertical cases mishandled)', 'Always perpendicular', 'Always horizontal'], 'B'),
      ];
    case '1-2':
      return [
        Q('If y = −x + 4 and 2x + y = 7, then x =', ['1', '2', '3', '4'], 'C'),
        Q('Substitution replaces one variable using:', ['The other equation', 'Random numbers', 'Only graphs', 'Calculator only'], 'A'),
        Q('If substitution yields 0 = 3, the system is:', ['Dependent', 'Inconsistent', 'Unique solution', 'Cubic'], 'B'),
        Q('If substitution yields 0 = 0 for all variables eliminated inconsistently, check:', ['Whether equations describe the same line', 'Only discriminant', 'Only volume', 'Only trig'], 'A'),
        Q('Best starting equation for substitution often has:', ['A variable already isolated', 'Highest degree', 'Three variables', 'No equals sign'], 'A'),
      ];
    case '1-3':
      return [
        Q('x + y = 10 and x − y = 4 gives x =', ['5', '6', '7', '8'], 'C'),
        Q('Elimination aligns coefficients to:', ['Cancel one variable by adding/subtracting equations', 'Make denominators 1 only', 'Square both sides', 'Graph faster'], 'A'),
        Q('Multiplying an entire equation by a nonzero constant preserves:', ['Its solution set', 'Nothing', 'Only slope', 'Only intercept'], 'A'),
        Q('If elimination yields 0x + 0y = k with k≠0, system is:', ['Inconsistent', 'Dependent', 'Unique', 'Trig only'], 'A'),
        Q('Back-substitution finds:', ['Remaining unknowns after one is known', 'Only discriminants', 'Only areas', 'Only angles'], 'A'),
      ];
    case '1-4':
      return [
        Q('Two investments total 5000; one part at context rates — defining two variables needs:', ['Two equations from the story', 'One equation only', 'No equations', 'Cubic'], 'A'),
        Q('Mixture with two concentrations typically yields:', ['Total amount equation and pure substance equation often', 'Only geometry', 'Only trig', 'Only one unknown'], 'A'),
        Q('If answer contradicts “non-negative counts”, you should:', ['Revisit model or constraints', 'Accept blindly', 'Divide by zero', 'Change only digits'], 'A'),
        Q('System form ax + by = c is:', ['Linear', 'Always quadratic', 'Always cubic', 'Never useful'], 'A'),
        Q('Checking in words means:', ['Verify numbers satisfy both story and algebra', 'Ignore story', 'Use only graph', 'Square everything'], 'A'),
      ];
    case '2-0':
      return [
        Q('x² − 7x + 12 = 0 has roots:', ['3 and 4', '−3 and −4', '2 and 6', '0 and 12'], 'A'),
        Q('Zero-product applies when product equals:', ['1', '0', '−1', 'x'], 'B'),
        Q('Factoring first step is often:', ['Standard form = 0', 'Completing square only', 'Quadratic formula only', 'Trig'], 'A'),
        Q('x² = 9 has real solutions:', ['x = 3 only', 'x = ±3', 'x = 9', 'no solution'], 'B'),
        Q('If factoring gives repeated root, graph touches x-axis:', ['Once (tangent)', 'Never', 'Twice separated', 'Three times'], 'A'),
      ];
    case '2-1':
      return [
        Q('To make x² + 10x a perfect square, add:', ['10', '25', '100', '5'], 'B'),
        Q('Vertex form reveals vertex at:', ['(h,k) in y=(x−h)²+k', '(0,0) always', '(k,h)', 'Undefined'], 'A'),
        Q('Completing the square derives:', ['Quadratic formula (standard proof)', 'Circle circumference only', 'Trig ratios only', 'Volume formulas only'], 'A'),
        Q('If a ≠ 1 in ax²+bx+c, a useful step is factor a from first two terms or:', ['Divide whole equation by a (a≠0) in some approaches', 'Ignore a', 'Set a=1 always', 'Use only graph'], 'A'),
        Q('Completing square solves by reducing to:', ['(square) = constant', 'Linear always', 'Cubic always', 'No algebra'], 'A'),
      ];
    case '2-2':
      return [
        Q('For x² − 4x + 4 = 0, discriminant Δ equals:', ['0', 'positive', 'negative', '16'], 'A'),
        Q('Δ < 0 implies over ℝ:', ['Two distinct roots', 'One repeated', 'No real roots', 'Three roots'], 'C'),
        Q('Quadratic formula uses:', ['a≠0', 'a=0', 'c=0 always', 'b=0 only'], 'A'),
        Q('Sum of roots of x² − 5x + 6 = 0 equals:', ['5', '−5', '6', '−6'], 'A'),
        Q('If roots are real and distinct, parabola crosses x-axis:', ['Twice', 'Never', 'Once only tangency', 'Three times'], 'A'),
      ];
    case '2-3':
      return [
        Q('Rectangle width w, length w+4, area 60 — positive width root satisfies:', ['w=6 is typical solution of w(w+4)=60', 'w negative only', 'w=0', 'no quadratic'], 'A'),
        Q('Projectile height h(t)=−5t²+20t has physical model shape:', ['Parabolic', 'Linear only', 'Constant', 'Cubic only'], 'A'),
        Q('Choosing roots after solving must respect:', ['Domain constraints of context (length/time positive)', 'Only letter option A', 'No checks', 'Complex always'], 'A'),
        Q('Product-and-sum number problems often lead to:', ['Quadratic in one unknown after substitution', 'Only linear', 'Only trig', 'No equation'], 'A'),
        Q('Checking a width-area problem substitutes into:', ['Area formula with both dimensions', 'Only perimeter', 'Only discriminant', 'Only sin'], 'A'),
      ];
    case '2-4':
      return [
        Q('Substitution u = x² turns x⁴ − 13x² + 36 = 0 into:', ['u − 13u + 36 = 0', 'u² − 13u + 36 = 0', 'u² + 36', 'linear in x only'], 'B'),
        Q('From u = x² with u≥0, recover x as:', ['±√u when applicable', 'always u', 'only u²', 'only −√u'], 'A'),
        Q('Extra solutions may appear if:', ['Squaring steps or domain widening without checks', 'Never', 'Only in addition', 'Only with circles'], 'A'),
        Q('Final step after solving for u:', ['Solve original for x and check', 'Stop at u', 'Ignore checks', 'Graph only'], 'A'),
        Q('Equation type is “reducible” because:', ['It becomes quadratic in a new variable', 'It is linear always', 'It has no variables', 'It is always quartic unsolvable'], 'A'),
      ];
    case '3-0':
      return [
        Q('Domain of a relation given by points is the set of:', ['x-coordinates', 'y-coordinates', 'slopes', 'areas'], 'A'),
        Q('{(1,2),(1,3)} is a function?', ['Yes', 'No', 'Only if linear', 'Only if quadratic'], 'B'),
        Q('Range collects:', ['outputs / second coordinates', 'inputs only', 'slopes', 'degrees only'], 'A'),
        Q('Vertical line test detects:', ['functions among graphs', 'areas', 'volumes', 'parallelism'], 'A'),
        Q('Relation can be expressed by rule, table, or:', ['graph', 'only words', 'never algebra', 'only matrix'], 'A'),
      ];
    case '3-1':
      return [
        Q('If f(x)=2x+1, f(5)=', ['9', '10', '11', '12'], 'C'),
        Q('f(a) means replace:', ['x by a in the rule', 'a by f', 'f by x', 'both sides by 0'], 'A'),
        Q('If f(x)=x², f(−3)=', ['−9', '9', '6', '−6'], 'B'),
        Q('Independent variable in y=f(x) is typically:', ['x', 'y', 'f', 'the constant only'], 'A'),
        Q('Zeros of f satisfy:', ['f(x)=0', 'f(x)=1', 'x=0 always', 'y undefined'], 'A'),
      ];
    case '3-2':
      return [
        Q('Slope of y = 4x − 9 is:', ['4', '−9', '9', '1/4'], 'A'),
        Q('Parallel lines (non-vertical) share:', ['slopes', 'x-intercepts only', 'y-intercepts only', 'area'], 'A'),
        Q('y-intercept of y = −x + 7:', ['7', '−7', '1', '−1'], 'A'),
        Q('Horizontal line has slope:', ['0', '1', 'undefined', '−1'], 'A'),
        Q('Point-slope uses known:', ['point and slope', 'only intercept', 'only vertex', 'only radius'], 'A'),
      ];
    case '3-3':
      return [
        Q('Vertex of y=(x−5)²+3:', ['(5,3)', '(−5,3)', '(5,−3)', '(3,5)'], 'A'),
        Q('If a>0 in y=a(x−h)²+k, parabola opens:', ['up', 'down', 'left', 'right'], 'A'),
        Q('Axis of symmetry is vertical line through:', ['vertex', 'origin always', 'only roots', 'circumcenter always'], 'A'),
        Q('Minimum of y=(x+1)²+4 is:', ['4', '1', '5', '0'], 'A'),
        Q('Connecting standard form to vertex often uses:', ['completing the square', 'only factoring cubics', 'only trig', 'only matrix'], 'A'),
      ];
    case '3-4':
      return [
        Q('y=f(x)+2 shifts graph:', ['up 2', 'down 2', 'right 2', 'left 2'], 'A'),
        Q('y=f(x−2) shifts graph:', ['right 2', 'left 2', 'up 2', 'down 2'], 'A'),
        Q('y=−f(x) reflects across:', ['x-axis', 'y-axis', 'origin only', 'y=x'], 'A'),
        Q('Stretch y=3f(x) multiplies:', ['outputs by 3', 'inputs by 3', 'both by 9', 'nothing'], 'A'),
        Q('Order of shifts and stretches matters because:', ['composition is not generally commutative', 'never', 'only for lines', 'only cubics'], 'A'),
      ];
    case '4-0':
      return [
        Q('Hypotenuse of 5-12-___ right triangle:', ['13', '17', '8', '25'], 'A'),
        Q('Legs are the sides:', ['adjacent to right angle', 'opposite right angle only', 'always equal', 'undefined'], 'A'),
        Q('Pythagorean theorem applies to:', ['right triangles', 'all triangles', 'circles only', 'polygons only'], 'A'),
        Q('Hypotenuse is:', ['longest side', 'shortest side', 'always base', 'always height'], 'A'),
        Q('3-4-5 triangle is:', ['right', 'obtuse', 'acute not right', 'degenerate'], 'A'),
      ];
    case '4-1':
      return [
        Q('sin θ =', ['opp/hyp', 'adj/hyp', 'opp/adj', 'hyp/opp'], 'A'),
        Q('cos θ =', ['opp/hyp', 'adj/hyp', 'opp/adj', 'hyp/adj'], 'B'),
        Q('tan θ =', ['opp/adj', 'adj/opp', 'hyp/adj', 'opp/hyp'], 'A'),
        Q('If opposite = 7 and hypotenuse = 25, sin θ =', ['7/25', '24/25', '25/7', '4/7'], 'A'),
        Q('Ratios depend on:', ['which acute angle is referenced', 'always hypotenuse only', 'color', 'area only'], 'A'),
      ];
    case '4-2':
      return [
        Q('If cos θ = adjacent/hypotenuse, adjacent =', ['hyp·cos θ', 'hyp/cos θ', 'cos/hyp', 'hyp+ cos θ'], 'A'),
        Q('If sin θ = 0.5 and hyp = 12, opposite ≈', ['6', '12', '24', '0.5'], 'A'),
        Q('After trig solve, Pythagoras checks:', ['consistency of three sides', 'only angles', 'only area', 'only volume'], 'A'),
        Q('If angle known and one side, another side may use:', ['sin/cos/tan appropriately', 'only addition', 'only discriminant', 'only circle theorems'], 'A'),
        Q('Right triangle trig assumes angle is:', ['acute in introductory ratio definitions', 'always obtuse', '180°', '0°'], 'A'),
      ];
    case '4-3':
      return [
        Q('If tan θ = opposite/adjacent = 1 (acute), θ ≈', ['30°', '45°', '60°', '90°'], 'B'),
        Q('Inverse trig on calculator for acute angles gives:', ['an acute angle solution in principal range used', 'always 180°', 'always 0', 'undefined'], 'A'),
        Q('Two legs known — find acute angle with:', ['tan⁻¹(opposite/adjacent) among methods', 'only sine law for non-right', 'guess', 'area formula only'], 'A'),
        Q('Acute angles in a right triangle sum to:', ['90°', '180°', '45°', '360°'], 'A'),
        Q('If sin θ = √3/2 (acute), θ =', ['30°', '45°', '60°', '90°'], 'C'),
      ];
    case '4-4':
      return [
        Q('Angle of elevation measured from horizontal', ['upward', 'downward', 'vertical only', 'tangent line'], 'A'),
        Q('Sketching the situation usually produces:', ['a right triangle model', 'a circle only', 'a cube only', 'no diagram'], 'A'),
        Q('If horizontal distance d and height h from base, tan θ =', ['h/d', 'd/h', 'h+d', '√(hd)'], 'A'),
        Q('Bearings problems may reduce to:', ['right triangles after components', 'only statistics', 'only polynomials', 'no math'], 'A'),
        Q('Answers should reflect:', ['units and rounding requested', 'never units', 'only symbolic π when numeric asked wrong', 'only complex'], 'A'),
      ];
    case '5-0':
      return [
        Q('Interior angle sum of a heptagon (n=7):', ['720°', '900°', '540°', '360°'], 'B'),
        Q('Formula (n−2)·180° gives total interior sum for:', ['simple convex polygon', 'only triangle', 'only circle', 'only hexagon'], 'A'),
        Q('Each interior of regular n-gon:', ['(n−2)·180° / n', '360/n', '180/n', 'n·180'], 'A'),
        Q('Exterior angles of convex polygon sum to:', ['360°', '180°', '90°', '(n−2)180'], 'A'),
        Q('Equilateral triangle interior angles:', ['60° each', '90°', '45°', '120°'], 'A'),
      ];
    case '5-1':
      return [
        Q('If two polygons are similar with scale k for lengths, areas scale by:', ['k', 'k²', 'k³', '1/k'], 'B'),
        Q('Similar triangles have:', ['equal corresponding angles', 'equal all sides', 'no correspondence', 'one random angle only'], 'A'),
        Q('Proportion 2/3 = x/15 gives x =', ['10', '12', '9', '5'], 'A'),
        Q('Scale factor 3 enlargement multiplies a side length by:', ['3', '9', '27', '1/3'], 'A'),
        Q('Non-similar figures can share:', ['one angle without proportional sides', 'always similarity', 'always congruence', 'always same area'], 'A'),
      ];
    case '5-2':
      return [
        Q('AA similarity uses:', ['two pairs of equal angles', 'three sides only', 'one side only', 'right angle only'], 'A'),
        Q('SAS similarity pairs proportional sides about:', ['equal included angle', 'any angle without check', 'no angle', 'area'], 'A'),
        Q('SSS similarity uses:', ['three side proportions in order', 'one angle only', 'altitude only', 'perimeter only'], 'A'),
        Q('Congruence implies similarity:', ['yes', 'no', 'only for circles', 'only for squares'], 'A'),
        Q('Incorrect correspondence can make ratios look wrong — fix by:', ['matching vertices', 'ignoring order', 'doubling angles', 'adding areas'], 'A'),
      ];
    case '5-3':
      return [
        Q('Central angle equals intercepted arc measure (same circle). Inscribed angle equals:', ['half the arc', 'full arc', 'double the arc', '90° always'], 'A'),
        Q('Angle inscribed in semicircle is:', ['45°', '90°', '60°', '30°'], 'B'),
        Q('Same arc inscribed angles are:', ['equal', 'always 0', 'supplementary always', 'random'], 'A'),
        Q('Major arc is longer than:', ['180°', '360°', '90°', '0°'], 'A', 'Strictly longer than a semicircle in the “major” designation.'),
        Q('Center to circle point is:', ['radius', 'diameter always', 'tangent', 'chord always'], 'A'),
      ];
    case '5-4':
      return [
        Q('Radius to tangent point is ___ tangent line:', ['parallel to', 'perpendicular to', 'identical to', 'skew to'], 'B'),
        Q('From external point, two tangent segments to circle are:', ['equal length (standard theorem)', 'always unequal', 'zero', 'infinite'], 'A'),
        Q('Line through center perpendicular to chord:', ['bisects the chord', 'doubles chord', 'is always tangent', 'misses chord'], 'A'),
        Q('Power-of-a-point ideas in intro problems often use:', ['right triangles from radii and tangents', 'only cones', 'only statistics', 'only complex numbers'], 'A'),
        Q('Secant intersects circle at:', ['two points (typically)', 'zero', 'always one', 'never in plane'], 'A'),
      ];
    case '6-0':
      return [
        Q('Cylinder volume V =', ['πr²h', '2πrh', 'πrh', '4/3 πr³'], 'A'),
        Q('Lateral surface area of cylinder (side only) =', ['2πrh', 'πr²h', '4πr²', 'πr²'], 'A'),
        Q('If radius doubles and height unchanged, volume scales by:', ['2', '4', '8', '1'], 'B'),
        Q('Prism volume =', ['base area × height', '½ base × height (triangle area, not prism)', 'πr³', '4πr²'], 'A'),
        Q('Units of volume are:', ['cubic', 'square only', 'degrees', 'newtons'], 'A'),
      ];
    case '6-1':
      return [
        Q('Cone volume =', ['(1/3)πr²h', 'πr²h', '2πrh', '4πr²'], 'A'),
        Q('Pyramid volume =', ['(1/3) base area × height', 'base × height', '½ base × height', 'πr³'], 'A'),
        Q('Slant height ℓ relates r and h in right cone by ℓ² =', ['r²+h²', 'r+h', 'rh', '(r+h)²'], 'A'),
        Q('Compared to cylinder same base & height, cone volume is:', ['greater', 'smaller by factor 1/3', 'equal', 'zero'], 'B'),
        Q('Nets help visualize:', ['surface area', 'only volume to exclude faces', 'only angles', 'only trig'], 'A'),
      ];
    case '6-2':
      return [
        Q('Sphere volume V =', ['(4/3)πr³', '4πr²', 'πr²h', '2πrh'], 'A'),
        Q('Sphere surface area A =', ['4πr²', '(4/3)πr³', 'πr²', '2πr'], 'A'),
        Q('If radius triples, volume scales by:', ['3', '9', '27', '81'], 'C'),
        Q('Hemisphere solid volume (radius r) =', ['(2/3)πr³', '(4/3)πr³', '2πr²', 'πr²'], 'A'),
        Q('Diameter D = 2r implies r =', ['D/2', '2D', 'D²', 'πD'], 'A'),
      ];
    case '6-3':
      return [
        Q('Composite volume often computed by:', ['adding/subtracting simpler volumes', 'averaging', 'only perimeter', 'only angle sums'], 'A'),
        Q('Internal shared face usually:', ['not part of outer surface area', 'counted twice blindly', 'ignored always for volume', 'equals volume'], 'A'),
        Q('Decomposition means:', ['split into standard solids', 'multiply all lengths', 'only guess', 'only trig'], 'A'),
        Q('Tunnel through block removes volume of:', ['tunnel solid', 'nothing', 'whole block always', 'only surface'], 'A'),
        Q('Reasonableness check uses:', ['rough estimate / units', 'never', 'only letter picks', 'only discriminant'], 'A'),
      ];
    case '6-4':
      return [
        Q('1 m³ often taught equals about:', ['1 L', '100 L', '1000 L', '10 L'], 'C'),
        Q('1 cm³ corresponds to:', ['1 mL (common)', '1000 mL', '1 L', '1 m³'], 'A'),
        Q('Convert 3.2 m to cm:', ['32', '320', '3200', '0.032'], 'B'),
        Q('Paint coverage ties to:', ['surface area', 'volume only', 'angles only', 'probability only'], 'A'),
        Q('Final numeric answers should:', ['match instruction precision', 'always 10 decimals', 'never include units', 'always be fractions'], 'A'),
      ];
    default:
      return [
        Q('Which step follows from the definition for this topic?', ['Use definitions with given data', 'Guess', 'Drop givens', 'Change units randomly'], 'A'),
        Q('An invalid move in reasoning is:', ['contradicting a given without justification', 'checking arithmetic', 'labeling diagram', 'using LCD'], 'A'),
        Q('Trap answers often:', ['ignore domain or context', 'match units', 'follow definitions', 'check signs'], 'A'),
        Q('Best practice multi-step:', ['one justified step at a time', 'jump to final', 'skip algebra', 'never substitute'], 'A'),
        Q('If unsure, test:', ['a simple consistent case', 'impossible case', 'always complex case', 'always discard all options'], 'A'),
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
