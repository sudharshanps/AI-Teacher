import { ConceptNode, Flashcard, GroundingCitation, HomeworkProblem, LessonStep, PersonalizationSettings, QuizQuestion, StudentProfileData } from '../types';

export const defaultPersonalization: PersonalizationSettings = {
  topic: "Ohm's Law",
  sourceMaterialName: "Physics_Class_10.pdf",
  sourceMaterialPages: 124,
  learningLevel: "Beginner",
  existingKnowledge: "New to this",
  learningObjective: "Understand the concept",
  teachingLanguage: "English",
  teachingStyle: "Simple explanations",
  teacherPersonality: "calm",
  availableTime: "10 minutes",
  desiredDepth: "Balanced",
};

export const defaultLessonSteps: LessonStep[] = [
  {
    id: 1,
    title: "01 Introduction",
    subtitle: "What is electricity & charge flow?",
    duration: "1:30",
    type: "intro",
    completed: true,
    active: false,
  },
  {
    id: 2,
    title: "02 Core Concept",
    subtitle: "Voltage, current and resistance defined",
    duration: "2:00",
    type: "concept",
    completed: true,
    active: false,
  },
  {
    id: 3,
    title: "03 Demonstration",
    subtitle: "Water-flow pipe analogy & circuit simulator",
    duration: "2:15",
    type: "demo",
    completed: true,
    active: false,
  },
  {
    id: 4,
    title: "04 Worked Example",
    subtitle: "Mathematical formula: V = I × R and I = V / R",
    duration: "1:45",
    type: "worked-example",
    completed: false,
    active: true,
  },
  {
    id: 5,
    title: "05 Understanding Check",
    subtitle: "Interactive question on resistance & current",
    duration: "1:00",
    type: "checkpoint",
    completed: false,
    active: false,
  },
  {
    id: 6,
    title: "06 Adaptive Explanation",
    subtitle: "Targeted remediation based on student answer",
    duration: "1:30",
    type: "adaptive",
    completed: false,
    active: false,
  },
  {
    id: 7,
    title: "07 Final Assessment",
    subtitle: "5 comprehensive mastery check questions",
    duration: "2:00",
    type: "assessment",
    completed: false,
    active: false,
  },
];

export const defaultCitations: GroundingCitation[] = [
  {
    sourceFile: "Physics_Class_10.pdf",
    chapter: "Chapter 4 — Electricity",
    section: "4.3 Ohm's Law and Circuit Resistance",
    page: 88,
    snippet: "The potential difference, V, across the ends of a given metallic wire in an electric circuit is directly proportional to the current flowing through it, provided its temperature remains constant. V ∝ I or V = I × R.",
    relevanceScore: 0.98,
  },
  {
    sourceFile: "Physics_Class_10.pdf",
    chapter: "Chapter 4 — Electricity",
    section: "4.3.2 Factors on which resistance of a conductor depends",
    page: 91,
    snippet: "Resistance (R) is inversely proportional to the current (I). If resistance is doubled, current gets halved. The SI unit of resistance is Ohm (Ω).",
    relevanceScore: 0.94,
  },
  {
    sourceFile: "Physics_Class_10.pdf",
    chapter: "Chapter 4 — Electricity",
    section: "4.4 Hydraulic (Water-flow) Model of Electric Current",
    page: 93,
    snippet: "Water pressure corresponds to Voltage, flow rate of water corresponds to Current, and pipe narrowness/valve obstruction corresponds to Resistance.",
    relevanceScore: 0.91,
  },
];

export const multilingualTranslations: Record<string, {
  intro: string;
  concept: string;
  misconceptionSpeech: string;
  successSpeech: string;
}> = {
  English: {
    intro: "Hello! I'm your AI Teacher. Today we are exploring Ohm's Law from fundamental principles. Think of electrical circuits as energy flowing through a guided path.",
    concept: "In any circuit, Voltage (V) is the driving pressure, Current (I) is the flow of electrons, and Resistance (R) is the opposition to that flow. The governing law is V = I × R, or I = V / R.",
    misconceptionSpeech: "Let's look at this another way. If the electrical pressure stays constant, but the pathway becomes more obstructed with higher resistance, fewer electrons can pass through per second. That means current must decrease, not increase!",
    successSpeech: "Spot on! You nailed the inverse relationship. As resistance increases under constant voltage, the current drops proportionately.",
  },
  Hindi: {
    intro: "नमस्ते! मैं आपकी AI शिक्षिका हूँ। आज हम ओम का नियम (Ohm's Law) सरल उदाहरणों के साथ समझेंगे।",
    concept: "विद्युत परिपथ में, वोल्टेज (V) धक्का देने वाला दबाव है, करंट (I) इलेक्ट्रॉनों का प्रवाह है, और प्रतिरोध (R) रुकावट है। सूत्र है V = I × R, यानी I = V / R।",
    misconceptionSpeech: "आइए इसे एक और तरीके से समझें। अगर वोल्टेज स्थिर रहे और रुकावट (प्रतिरोध) बढ़ जाए, तो इलेक्ट्रॉन धीमी गति से बहेंगे। इसलिए करंट कम होगा, बढ़ेगा नहीं!",
    successSpeech: "बहुत बढ़िया! आपने प्रतिरोध और करंट के संबंध को बिल्कुल सही समझ लिया है।",
  },
  Hinglish: {
    intro: "Hello! Main aapka AI Teacher hoon. Aaj hum Ohm's Law ko ek super simple water pipe analogy se samjhenge.",
    concept: "Circuit mein Voltage (V) pressure jaisa hota hai, Current (I) water flow jaisa, aur Resistance (R) pipe ki constriction jaisi. Formula hai: V = I × R, matlab I = V / R.",
    misconceptionSpeech: "Chaliye isko doosre angle se dekhte hain! Agar pressure same rahe par pipe patla ho jaye (resistance badh jaye), toh flow (current) kam ho jayega, badhega nahi!",
    successSpeech: "Superb! Aapne exact inverse relation samajh liya. Resistance badhega toh current definitely decrease hoga.",
  },
  Tamil: {
    intro: "வணக்கம்! நான் உங்கள் AI ஆசிரியர். இன்று நாம் ஓம் விதியை (Ohm's Law) எளிய முறையில் கற்றுக் கொள்வோம்.",
    concept: "மின்னழுத்தம் (Voltage) என்பது அழுத்தம், மின்னோட்டம் (Current) என்பது எலக்ட்ரான்களின் ஓட்டம், மின்தடை (Resistance) என்பது அந்த ஓட்டத்தைத் தடுக்கும் சக்தி. V = I × R.",
    misconceptionSpeech: "இதை வேறு விதமாகப் பார்ப்போம். அழுத்தம் மாறாமல் இருக்கும் போது, மின்தடை அதிகரித்தால், மின்னோட்டம் குறையும். அது அதிகரிக்காது!",
    successSpeech: "அருமை! மின்தடைக்கும் மின்னோட்டத்திற்கும் உள்ள தொடர்பை நீங்கள் மிகச் சரியாகப் புரிந்து கொண்டீர்கள்.",
  },
  Telugu: {
    intro: "నమస్కారం! నేను మీ AI ఉపాధ్యాయుడిని. ఈ రోజు మనం ఓమ్ నియమం (Ohm's Law) సులభంగా నేర్చుకుందాం.",
    concept: "వోల్టేజ్ (V) అనేది ఒత్తిడి, కరెంట్ (I) అనేది ప్రవాహం, రెసిస్టెన్స్ (R) అనేది అడ్డంకి. సూత్రం: V = I × R.",
    misconceptionSpeech: "మరొక ఉదాహరణతో చూద్దాం. వోల్టేజ్ స్థిరంగా ఉన్నప్పుడు, నిరోధం (రెసిస్టెన్స్) పెరిగితే కరెంట్ తగ్గుతుంది, పెరగదు!",
    successSpeech: "అద్భుతం! రెసిస్టెన్స్ మరియు కరెంట్ మధ్య సంబంధాన్ని మీరు ఖచ్చితంగా అర్థం చేసుకున్నారు.",
  },
  Malayalam: {
    intro: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI അധ്യാപികയാണ്. ഇന്ന് നമ്മൾ ഓംസ് നിയമം (Ohm's Law) വിശദമായി പഠിക്കും.",
    concept: "വോൾട്ടേജ് (V) സമ്മർദ്ദവും, കറന്റ് (I) പ്രവാഹവും, റെസിസ്റ്റൻസ് (R) തടസ്സവുമാണ്. സമവാക്യം: V = I × R.",
    misconceptionSpeech: "നമുക്കിത് മറ്റൊരു രീതിയിൽ മനസ്സിലാക്കാം. റെസിസ്റ്റൻസ് കൂടുമ്പോൾ കറന്റ് കുറയുകയാണ് ചെയ്യുന്നത്.",
    successSpeech: "മികച്ച ഉത്തരം! റെസിസ്റ്റൻസും കറന്റും തമ്മിലുള്ള വിപരീത അനുപാതം നിങ്ങൾ കൃത്യമായി മനസ്സിലാക്കി.",
  },
  Kannada: {
    intro: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಶಿಕ್ಷಕ. ಇಂದು ನಾವು ಓಮ್ ನಿಯಮವನ್ನು (Ohm's Law) ಸರಳವಾಗಿ ಕಲಿಯೋಣ.",
    concept: "ವೋಲ್ಟೇಜ್ (V) ಒತ್ತಡ, ಕರೆಂಟ್ (I) ಹರಿವು, ರೆಸಿಸ್ಟೆನ್ಸ್ (R) ಅಡಚಣೆ. ಸೂತ್ರ: V = I × R.",
    misconceptionSpeech: "ಇದನ್ನು ಮತ್ತೊಂದು ರೀತಿಯಲ್ಲಿ ನೋಡೋಣ. ವೋಲ್ಟೇಜ್ ಸ್ಥಿರವಾಗಿದ್ದು ರೆಸಿಸ್ಟೆನ್ಸ್ ಹೆಚ್ಚಾದರೆ ಕರೆಂಟ್ ಕಡಿಮೆಯಾಗುತ್ತದೆ.",
    successSpeech: "ಅತ್ಯುತ್ತಮ! ನೀವು ಸರಿಯಾದ ಪರಿಕಲ್ಪನೆಯನ್ನು ಗ್ರಹಿಸಿದ್ದೀರಿ.",
  },
};

export const defaultQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: "application",
    question: "If a circuit is powered by a 12V battery and contains a 4Ω resistor, what is the electric current flowing through it?",
    options: ["2 Amperes", "3 Amperes", "8 Amperes", "48 Amperes"],
    correctAnswer: 1, // 3 Amperes
    explanation: "Using Ohm's Law: I = V / R = 12V / 4Ω = 3A.",
    conceptTagged: "Basic Formula (V=IR)",
  },
  {
    id: 2,
    type: "conceptual",
    question: "If the resistance of a circuit is doubled while the applied voltage remains strictly constant, the current will be:",
    options: ["Doubled", "Halved", "Quadrupled", "Unchanged"],
    correctAnswer: 1, // Halved
    explanation: "Because Current (I) is inversely proportional to Resistance (R), doubling R halves I.",
    conceptTagged: "Inverse Relationship",
  },
  {
    id: 3,
    type: "mcq",
    question: "In the hydraulic (water-flow) analogy of electricity, what corresponds to Voltage?",
    options: ["The diameter of the pipe", "The rate of water flow per second", "The water pressure produced by the tank/pump", "The friction on the pipe walls"],
    correctAnswer: 2, // Water pressure
    explanation: "Water pressure provides the push (potential difference), which corresponds directly to electrical Voltage.",
    conceptTagged: "Physical Analogies",
  },
  {
    id: 4,
    type: "short-answer",
    question: "A toaster is connected to a standard 120V outlet. If its heating coil has a resistance of 15Ω, what current does it draw?",
    options: ["6 Amperes", "8 Amperes", "10 Amperes", "12 Amperes"],
    correctAnswer: 1, // 8 Amperes
    explanation: "I = V / R = 120V / 15Ω = 8 Amperes.",
    conceptTagged: "Practical Application",
  },
  {
    id: 5,
    type: "conceptual",
    question: "Why is an ammeter (which measures current) designed with very low internal resistance?",
    options: ["To prevent reducing the total current flowing in the circuit", "To increase the battery voltage", "To generate more heat for measurement", "To convert AC to DC"],
    correctAnswer: 0,
    explanation: "An ammeter is connected in series; if it had high resistance, it would reduce the circuit's current and give an inaccurate reading.",
    conceptTagged: "Circuit Design & Instrumentation",
  },
];

export const defaultStudentProfile: StudentProfileData = {
  name: "Sudharshan",
  email: "sudharshanthemagnet@gmail.com",
  learningLevel: "Beginner",
  preferredLanguage: "English",
  teachingStyle: "Visual + Examples",
  learningGoal: "Understand the concept",
  overallProgress: 82,
  topicsStudied: 12,
  learningTimeMinutes: 504, // 8h 24m
  currentStreakDays: 6,
  strongConcepts: ["Voltage Potential", "Electric Charge Flow", "Basic Formula (V=IR)", "SI Units (Volts, Amperes)"],
  weakConcepts: ["Resistance Inverse Scaling", "Complex Series-Parallel Circuits", "Internal Resistance of Meters"],
  recentScores: [
    { topic: "Ohm's Law Mastery", score: 82, date: "Today" },
    { topic: "Python Fundamentals", score: 91, date: "Yesterday" },
    { topic: "AI Fundamentals & Attention", score: 76, date: "3 days ago" },
    { topic: "Kinematics & Newton's Laws", score: 88, date: "5 days ago" },
  ],
  memoryLogs: [
    { concept: "Resistance Inverse Scaling", note: "Student showed uncertainty when resistance increased. Remediated successfully via hydraulic water-pipe analogy.", date: "Today" },
    { concept: "Vector Acceleration", note: "Responded strongly to step-by-step physical coordinate diagrams.", date: "5 days ago" },
    { concept: "Attention Weights (Transformers)", note: "Preferred matrix heatmap visualizations over abstract mathematical descriptions.", date: "3 days ago" },
  ],
};

export const demoFlashcards: Flashcard[] = [
  {
    id: 1,
    concept: "Ohm's Law Definition",
    front: "What is Ohm's Law in basic terms?",
    back: "The potential difference (Voltage) across a conductor is directly proportional to the current flowing through it at constant temperature: V = I × R.",
    mastered: true,
  },
  {
    id: 2,
    concept: "Inverse Current Relationship",
    front: "What happens to Current (I) if Resistance (R) is doubled at constant Voltage (V)?",
    back: "The Current is halved: I = V / R. Current and resistance have an inverse relationship.",
    mastered: false,
  },
  {
    id: 3,
    concept: "Units & Symbols",
    front: "What are the standard SI units for Voltage, Current, and Resistance?",
    back: "Voltage = Volts (V), Current = Amperes (A), Resistance = Ohms (Ω).",
    mastered: true,
  },
  {
    id: 4,
    concept: "Hydraulic Analogy",
    front: "In the water-pipe model of electricity, what do Voltage, Current, and Resistance represent?",
    back: "Voltage = Water pressure; Current = Flow rate of water; Resistance = Pipe constriction / valve resistance.",
    mastered: true,
  },
];

export const demoConceptMap: ConceptNode[] = [
  { id: 'elec', label: 'Electricity', status: 'mastered', masteryPct: 95, category: 'Root', connections: ['volt', 'curr', 'res'] },
  { id: 'volt', label: 'Voltage (V)', status: 'mastered', masteryPct: 92, category: 'Fundamental', connections: ['ohms'] },
  { id: 'curr', label: 'Current (I)', status: 'mastered', masteryPct: 88, category: 'Fundamental', connections: ['ohms'] },
  { id: 'res', label: 'Resistance (R)', status: 'review', masteryPct: 64, category: 'Fundamental', connections: ['ohms', 'series'] },
  { id: 'ohms', label: "Ohm's Law (V=IR)", status: 'learning', masteryPct: 78, category: 'Core Law', connections: ['series', 'parallel'] },
  { id: 'series', label: 'Series Circuits', status: 'learning', masteryPct: 40, category: 'Application', connections: [] },
  { id: 'parallel', label: 'Parallel Circuits', status: 'review', masteryPct: 20, category: 'Application', connections: [] },
];

export const demoHomeworkProblems: HomeworkProblem[] = [
  {
    id: 1,
    tier: 'Basic',
    concept: 'Direct Formula Calculation',
    question: 'A 9V battery is connected to a small light bulb with a resistance of 3Ω. What is the current flowing through the circuit?',
    hint: 'Use the formula I = V / R.',
    solution: 'I = 9V / 3Ω = 3 Amperes.',
  },
  {
    id: 2,
    tier: 'Intermediate',
    concept: 'Variable Resistance Shift',
    question: 'If you adjust a variable resistor from 10Ω to 40Ω in a circuit powered by a constant 20V source, by how much does the current decrease?',
    hint: 'Calculate the initial current (I₁) and final current (I₂), then find the difference.',
    solution: 'I₁ = 20/10 = 2A. I₂ = 20/40 = 0.5A. The current decreases by 1.5 Amperes (from 2A to 0.5A).',
  },
  {
    id: 3,
    tier: 'Application',
    concept: 'Real-World Appliance Sizing',
    question: 'An electric kettle operates on 230V mains and safely draws a maximum of 10A current. What is the minimum internal resistance required for the heating element?',
    hint: 'Rearrange Ohm\'s Law to solve for R: R = V / I.',
    solution: 'R = V / I = 230V / 10A = 23 Ohms.',
  },
];
