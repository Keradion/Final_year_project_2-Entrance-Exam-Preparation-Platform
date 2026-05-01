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

const SUBJECTS = [
  {
    subjectName: 'Mathematics',
    gradeLevel: '9',
    stream: 'Natural',
    chapterName: 'Foundations of Mathematics',
    topicName: 'Algebra and Number Sense',
    topicDescription: 'Core algebra skills, operations, equations, and reasoning for Grade 9 Mathematics.',
    objectives: [
      'Simplify algebraic expressions.',
      'Solve one-step and two-step equations.',
      'Apply order of operations correctly.',
    ],
    concept: 'Algebra helps us represent unknown values with symbols and solve problems using rules of equality.',
    exercises: [
      ['Simplify 3x + 2x.', ['3x', '5x', '6x', 'x'], 1, 'Combine like terms.'],
      ['Solve x + 7 = 15.', ['7', '8', '15', '22'], 1, 'Subtract 7 from both sides.'],
      ['What is 4 squared?', ['8', '12', '16', '20'], 2, '4 squared means 4 x 4.'],
      ['Evaluate 2(3 + 4).', ['10', '14', '18', '24'], 1, 'Work inside parentheses first.'],
      ['Which is an even number?', ['11', '13', '18', '21'], 2, 'Even numbers are divisible by 2.'],
    ],
    quiz: [
      ['What is the value of 5x when x = 3?', ['8', '15', '25', '53'], 'B', 'Substitute x = 3, then multiply 5 by 3.'],
      ['Solve 2x = 10.', ['2', '5', '8', '12'], 'B', 'Divide both sides by 2.'],
      ['Which expression is equivalent to x + x + x?', ['x3', '3x', 'x + 3', 'x/3'], 'B', 'Three equal x terms combine to 3x.'],
      ['What comes first in order of operations?', ['Addition', 'Multiplication', 'Parentheses', 'Subtraction'], 'C', 'Parentheses are evaluated first.'],
      ['What is 12 divided by 3?', ['3', '4', '9', '36'], 'B', '12 split into 3 equal groups gives 4.'],
    ],
  },
  {
    subjectName: 'Physics',
    gradeLevel: '10',
    stream: 'Natural',
    chapterName: 'Foundations of Physics',
    topicName: 'Motion and Forces',
    topicDescription: 'Introductory mechanics covering motion, speed, force, and Newtonian thinking.',
    objectives: [
      'Define speed and velocity.',
      'Calculate simple motion quantities.',
      'Recognize balanced and unbalanced forces.',
    ],
    concept: 'Physics studies matter, energy, motion, and forces. Mechanics explains how and why objects move.',
    exercises: [
      ['A car travels 100 m in 20 s. What is its speed?', ['2 m/s', '5 m/s', '20 m/s', '100 m/s'], 1, 'Speed = distance / time.'],
      ['Which unit measures force?', ['Joule', 'Newton', 'Watt', 'Pascal'], 1, 'Force is measured in newtons.'],
      ['If net force is zero, motion is...', ['Always speeding up', 'Balanced', 'Impossible', 'Always circular'], 1, 'Zero net force means balanced forces.'],
      ['Acceleration means change in...', ['Mass', 'Volume', 'Velocity', 'Color'], 2, 'Acceleration is rate of change of velocity.'],
      ['Gravity near Earth pulls objects...', ['Upward', 'Downward', 'Sideways only', 'Nowhere'], 1, 'Gravity attracts objects toward Earth.'],
    ],
    quiz: [
      ['What formula gives speed?', ['time/distance', 'distance/time', 'force/mass', 'mass/volume'], 'B', 'Speed is distance divided by time.'],
      ['The SI unit of force is...', ['Newton', 'Meter', 'Second', 'Kilogram'], 'A', 'Force is measured in newtons.'],
      ['A push or pull is called...', ['Energy', 'Force', 'Power', 'Density'], 'B', 'A force is a push or pull.'],
      ['An object at rest tends to stay at rest because of...', ['Friction', 'Inertia', 'Heat', 'Light'], 'B', 'Inertia resists changes in motion.'],
      ['If velocity changes, the object is...', ['Accelerating', 'Frozen', 'Massless', 'Balanced'], 'A', 'Acceleration occurs when velocity changes.'],
    ],
  },
  {
    subjectName: 'Chemistry',
    gradeLevel: '11',
    stream: 'Natural',
    chapterName: 'Foundations of Chemistry',
    topicName: 'Atomic Structure',
    topicDescription: 'Atoms, subatomic particles, atomic number, mass number, and basic periodic ideas.',
    objectives: [
      'Describe the structure of an atom.',
      'Identify protons, neutrons, and electrons.',
      'Use atomic number and mass number.',
    ],
    concept: 'An atom is the smallest unit of an element that keeps the chemical identity of that element.',
    exercises: [
      ['Which particle has a positive charge?', ['Electron', 'Proton', 'Neutron', 'Molecule'], 1, 'Protons are positively charged.'],
      ['Electrons are found mostly in the...', ['Nucleus', 'Electron cloud', 'Proton shell', 'Neutron core'], 1, 'Electrons occupy regions around the nucleus.'],
      ['Atomic number equals number of...', ['Neutrons', 'Protons', 'Protons + neutrons', 'Electrons + neutrons'], 1, 'Atomic number identifies proton count.'],
      ['Which particle has no charge?', ['Electron', 'Proton', 'Neutron', 'Ion'], 2, 'Neutrons are neutral.'],
      ['Mass number is protons plus...', ['Electrons', 'Neutrons', 'Ions', 'Atoms'], 1, 'Mass number counts protons and neutrons.'],
    ],
    quiz: [
      ['What is an atom?', ['A cell part', 'Smallest unit of an element', 'A type of wave', 'A force'], 'B', 'Atoms are the basic units of elements.'],
      ['Which subatomic particle is negative?', ['Proton', 'Neutron', 'Electron', 'Nucleus'], 'C', 'Electrons carry negative charge.'],
      ['Where is most atomic mass located?', ['Electron cloud', 'Nucleus', 'Outer shell', 'Bond'], 'B', 'Protons and neutrons in the nucleus contain most mass.'],
      ['Atomic number 6 means the atom has...', ['6 protons', '6 neutrons only', '6 shells', '6 compounds'], 'A', 'Atomic number equals number of protons.'],
      ['A charged atom is called...', ['Molecule', 'Ion', 'Isotope', 'Mixture'], 'B', 'Atoms become ions when they gain or lose electrons.'],
    ],
  },
  {
    subjectName: 'Biology',
    gradeLevel: '12',
    stream: 'Natural',
    chapterName: 'Foundations of Biology',
    topicName: 'Cells and Life Processes',
    topicDescription: 'Cell structure, organelles, life processes, and the basis of living organisms.',
    objectives: [
      'Identify major cell organelles.',
      'Compare plant and animal cells.',
      'Explain basic life processes.',
    ],
    concept: 'Cells are the basic structural and functional units of life.',
    exercises: [
      ['Which organelle controls cell activities?', ['Mitochondrion', 'Nucleus', 'Ribosome', 'Cell wall'], 1, 'The nucleus contains genetic instructions.'],
      ['Which organelle makes energy available?', ['Mitochondrion', 'Nucleus', 'Vacuole', 'Chloroplast'], 0, 'Mitochondria release usable energy.'],
      ['Plant cells usually have...', ['No nucleus', 'Cell wall', 'No cytoplasm', 'Only ribosomes'], 1, 'Plant cells have cell walls.'],
      ['Photosynthesis occurs in...', ['Ribosomes', 'Chloroplasts', 'Mitochondria', 'Nucleus'], 1, 'Chloroplasts contain chlorophyll.'],
      ['The basic unit of life is the...', ['Tissue', 'Organ', 'Cell', 'System'], 2, 'All living organisms are made of cells.'],
    ],
    quiz: [
      ['What is the basic unit of life?', ['Atom', 'Cell', 'Organ', 'Tissue'], 'B', 'The cell is the basic unit of life.'],
      ['Which structure surrounds the cell?', ['Cell membrane', 'Nucleus', 'Ribosome', 'DNA'], 'A', 'The cell membrane controls movement in and out.'],
      ['Which organelle contains DNA in eukaryotic cells?', ['Nucleus', 'Vacuole', 'Cytoplasm', 'Cell wall'], 'A', 'The nucleus stores genetic material.'],
      ['Which cells have chloroplasts?', ['Most plant cells', 'All animal cells', 'Bacteria only', 'Red blood cells only'], 'A', 'Chloroplasts are common in green plant cells.'],
      ['Groups of similar cells form...', ['Atoms', 'Tissues', 'Organs only', 'Molecules'], 'B', 'Similar cells working together form tissues.'],
    ],
  },
];

const EXTRA_RESOURCES = {
  Mathematics: {
    concepts: [
      {
        title: 'Variables and Expressions',
        content: `A variable is a letter or symbol that represents an unknown number.

In algebra, expressions are built from numbers, variables, and operation signs. For example, 3x + 5 means three times an unknown value plus five.

Important ideas:
- Like terms have the same variable part, such as 2x and 7x.
- Constants are fixed numbers, such as 4 or 15.
- Simplifying means combining terms without changing the value of the expression.

Example:
2x + 3x + 4 becomes 5x + 4 because 2x and 3x are like terms.`,
      },
      {
        title: 'Solving Linear Equations',
        content: `An equation states that two expressions are equal. To solve an equation, isolate the variable.

Main rule:
Whatever you do to one side of the equation, you must do to the other side.

Example:
x + 9 = 17
x = 17 - 9
x = 8

Check:
8 + 9 = 17, so the answer is correct.`,
      },
      {
        title: 'Order of Operations',
        content: `The order of operations tells us which calculation to do first.

Use this order:
1. Parentheses
2. Exponents
3. Multiplication and division from left to right
4. Addition and subtraction from left to right

Example:
2 + 3 x 4 = 2 + 12 = 14

We multiply before adding, so the answer is 14, not 20.`,
      },
    ],
    videos: [
      ['Algebra Basics: Variables and Expressions', 'https://www.youtube.com/watch?v=NybHckSEQBI'],
      ['Solving One-Step and Two-Step Equations', 'https://www.youtube.com/watch?v=LDIiYKYvvdA'],
    ],
  },
  Physics: {
    concepts: [
      {
        title: 'Speed, Velocity, and Acceleration',
        content: `Speed tells how fast an object moves. Velocity tells how fast and in what direction.

Speed formula:
speed = distance / time

Acceleration is the rate at which velocity changes. An object accelerates when it speeds up, slows down, or changes direction.

Example:
If a runner covers 50 meters in 10 seconds, the speed is 5 meters per second.`,
      },
      {
        title: 'Forces and Net Force',
        content: `A force is a push or pull. Forces can start motion, stop motion, or change direction.

When forces are balanced, the net force is zero and motion does not change.

When forces are unbalanced, the object accelerates in the direction of the greater force.

Example:
If two students push a box in opposite directions with equal force, the box may not move.`,
      },
      {
        title: 'Newton’s First Law',
        content: `Newton's first law says that an object at rest stays at rest, and an object in motion stays in motion, unless acted on by an unbalanced force.

This property is called inertia.

Everyday example:
When a bus stops suddenly, passengers move forward because their bodies tend to keep moving.`,
      },
    ],
    videos: [
      ['Motion: Speed, Velocity, and Acceleration', 'https://www.youtube.com/watch?v=ZM8ECpBuQYE'],
      ['Newton’s Laws of Motion Introduction', 'https://www.youtube.com/watch?v=kKKM8Y-u7ds'],
    ],
  },
  Chemistry: {
    concepts: [
      {
        title: 'Inside the Atom',
        content: `Atoms are made of three main subatomic particles.

Protons:
- Positive charge
- Found in the nucleus
- Determine the element

Neutrons:
- No charge
- Found in the nucleus
- Add mass and help stabilize the atom

Electrons:
- Negative charge
- Found around the nucleus
- Involved in chemical bonding`,
      },
      {
        title: 'Atomic Number and Mass Number',
        content: `The atomic number is the number of protons in an atom. It identifies the element.

The mass number is the total number of protons and neutrons.

Formula:
mass number = protons + neutrons

Example:
If an atom has 6 protons and 6 neutrons, its mass number is 12.`,
      },
      {
        title: 'Ions and Isotopes',
        content: `An ion is an atom that has gained or lost electrons.

If an atom loses electrons, it becomes positively charged.
If an atom gains electrons, it becomes negatively charged.

An isotope is an atom of the same element with a different number of neutrons.

Example:
Carbon-12 and Carbon-14 are isotopes of carbon.`,
      },
    ],
    videos: [
      ['Atomic Structure Explained', 'https://www.youtube.com/watch?v=thnDxFdkzZs'],
      ['Protons, Neutrons, and Electrons', 'https://www.youtube.com/watch?v=EMDrb2LqL7E'],
    ],
  },
  Biology: {
    concepts: [
      {
        title: 'Cell Theory',
        content: `Cell theory is one of the foundations of biology.

It states that:
1. All living things are made of cells.
2. The cell is the basic unit of structure and function in living things.
3. All cells come from pre-existing cells.

This means cells are the smallest living units that can carry out life processes.`,
      },
      {
        title: 'Major Cell Organelles',
        content: `Organelles are specialized structures inside cells.

Nucleus:
Controls cell activities and contains DNA.

Mitochondria:
Release energy from food.

Ribosomes:
Build proteins.

Cell membrane:
Controls what enters and leaves the cell.

Chloroplasts:
Found in plant cells and carry out photosynthesis.`,
      },
      {
        title: 'Plant and Animal Cells',
        content: `Plant and animal cells share many structures, but they also differ.

Both have:
- Cell membrane
- Cytoplasm
- Nucleus
- Mitochondria

Plant cells usually also have:
- Cell wall
- Chloroplasts
- Large central vacuole

These structures help plants make food and maintain shape.`,
      },
    ],
    videos: [
      ['Introduction to Cells', 'https://www.youtube.com/watch?v=URUJD5NEXC8'],
      ['Plant Cells and Animal Cells', 'https://www.youtube.com/watch?v=ApvxVtBJxd0'],
    ],
  },
};

async function main() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) throw new Error('MONGODB_URI or DATABASE_URL is required');

  await mongoose.connect(uri);

  const creator = await User.findOne({ role: { $in: ['teacher', 'admin'] } }).sort({ role: 1, created_at: 1 });
  if (!creator) {
    throw new Error('Create at least one teacher or admin before seeding exercises and quizzes.');
  }

  const summary = [];

  for (const item of SUBJECTS) {
    const subject = await Subject.findOneAndUpdate(
      { subjectName: item.subjectName, gradeLevel: item.gradeLevel, stream: item.stream },
      {
        subjectName: item.subjectName,
        subjectDescription: `${item.subjectName} course content for Grade ${item.gradeLevel}.`,
        gradeLevel: item.gradeLevel,
        stream: item.stream,
        teacher: creator.role === 'teacher' ? creator._id : undefined,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const chapter = await Chapter.findOneAndUpdate(
      { subject: subject._id, chapterName: item.chapterName },
      { chapterName: item.chapterName, chapterDescription: `Core chapter for ${item.subjectName}.`, subject: subject._id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const topic = await Topic.findOneAndUpdate(
      { chapter: chapter._id, topicName: item.topicName },
      {
        topicName: item.topicName,
        topicDescription: item.topicDescription,
        topicObjectives: item.objectives,
        chapter: chapter._id,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await Concept.findOneAndUpdate(
      { topic: topic._id, title: `${item.subjectName} Overview` },
      {
        title: `${item.subjectName} Overview`,
        content: `${item.concept}

This overview introduces the main idea of the topic and prepares you for the exercises and quiz. Read the concept notes first, then test your understanding in the practice section.`,
        topic: topic._id,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const resources = EXTRA_RESOURCES[item.subjectName];
    for (const concept of resources.concepts) {
      await Concept.findOneAndUpdate(
        { topic: topic._id, title: concept.title },
        {
          ...concept,
          topic: topic._id,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    for (const [title, videoUrl] of resources.videos) {
      await Video.findOneAndUpdate(
        { topic: topic._id, title },
        {
          title,
          videoUrl,
          topic: topic._id,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    await Exercise.deleteMany({ topic: topic._id, title: /^Seeded Practice / });
    await Exercise.insertMany(
      item.exercises.map(([question, options, correctAnswer, hint], index) => ({
        topic: topic._id,
        title: `Seeded Practice ${index + 1}`,
        question,
        options,
        correctAnswer,
        hint,
        difficulty: index < 2 ? 'Easy' : index < 4 ? 'Medium' : 'Hard',
        createdBy: creator._id,
      }))
    );

    const oldQuizzes = await Quiz.find({ topic: topic._id, title: 'Seeded Practice Quiz' }).select('_id');
    await QuizProblem.deleteMany({ quizId: { $in: oldQuizzes.map((quiz) => quiz._id) } });
    await Quiz.deleteMany({ _id: { $in: oldQuizzes.map((quiz) => quiz._id) } });

    const quiz = await Quiz.create({
      topic: topic._id,
      title: 'Seeded Practice Quiz',
      description: `Five-question quiz for ${item.subjectName} Grade ${item.gradeLevel}.`,
      createdBy: creator._id,
    });

    await QuizProblem.insertMany(
      item.quiz.map(([questionText, answers, correctAnswer, answerExplanation]) => ({
        quizId: quiz._id,
        questionText,
        choices: answers.map((answer, index) => ({
          text: answer,
          value: String.fromCharCode(65 + index),
        })),
        correctAnswer,
        answerExplanation,
      }))
    );

    summary.push({
      subject: `${item.subjectName} Grade ${item.gradeLevel}`,
      stream: item.stream,
      chapter: chapter.chapterName,
      topic: topic.topicName,
      concepts: resources.concepts.length + 1,
      videos: resources.videos.length,
      exercises: item.exercises.length,
      quizQuestions: item.quiz.length,
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
