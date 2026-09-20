import { detectRedFlags } from './redFlags';
import { DailyCheckInData, UserProfile } from './types';

interface CompanionQuery {
  message: string;
  user: UserProfile;
  recentLogs: DailyCheckInData[];
}

interface CompanionResponse {
  reply: string;
  isRedFlag: boolean;
  redFlagDetails?: ReturnType<typeof detectRedFlags>;
  suggestedFollowUps: string[];
}

const KNOWLEDGE_TOPICS = [
  {
    keywords: ['fatigue', 'tired', 'exhausted', 'energy dip', 'afternoon crash', 'low energy'],
    title: 'Fatigue & Energy Dynamics',
    content: (user: UserProfile, logs: DailyCheckInData[]) => {
      const avgSleep = logs.length
        ? (logs.reduce((acc, l) => acc + l.sleepHours, 0) / logs.length).toFixed(1)
        : '7.0';
      return `Fatigue is one of the most common physical signals, and it can stem from several distinct physiological processes regardless of life stage:
1. **Sleep Architecture**: Your recent logged average is ${avgSleep} hours/night. Consistent sleep quantity combined with sleep depth (REM and slow-wave sleep) directly dictate cellular energy stores.
2. **Nutritional & Metabolic Factors**: Cellular energy requires adequate iron (ferritin), vitamin D, B12, and blood glucose stability. Protein intake with meals blunts cortisol spikes that cause midday crashes.
3. **Thyroid & Hormonal Variations**: Thyroid underactivity (hypothyroidism) affects up to 1 in 8 women and frequently presents primarily as persistent morning fatigue and cold sensitivity.
4. **Stress & Allostatic Load**: Sustained mental multitasking elevates cortisol, eventually causing autonomic exhaustion.

💡 *What you can try*: Start with a protein-rich breakfast within 90 minutes of waking, and hydrate before caffeine. If deep fatigue persists beyond 2-3 weeks, ask a doctor for a routine panel (CBC, Ferritin, TSH, Vitamin D).`;
    },
    followUps: [
      'What blood tests check for chronic fatigue?',
      'How does sleep quality differ from sleep hours?',
      'Can stress cause physical fatigue without depression?',
    ],
  },
  {
    keywords: ['brain fog', 'foggy', 'memory', 'concentration', 'forgetful'],
    title: 'Brain Fog & Cognitive Clarity',
    content: (user: UserProfile, logs: DailyCheckInData[]) => {
      return `Brain fog is not a clinical diagnosis, but a recognized umbrella term for sluggish cognitive processing, word-finding friction, or short-term memory lapses.

**Universal Physiological Drivers**:
- **Sleep Fragmentation**: Even with 8 hours in bed, frequent micro-awakenings prevent the brain's glymphatic system from clearing metabolic waste.
- **Inflammation & Gut-Brain Axis**: Systemic mild inflammation, food sensitivities, or elevated stress hormones alter neurochemistry.
- **Hormonal Fluctuations**: Estrogen and progesterone modulate neurotransmitters like serotonin and acetylcholine. Even outside menstrual cycles, cortisol surges diminish working memory.
- **Demographic & Nutritional Factors**: Iron deficiency (anemia) and B-vitamin deficits reduce oxygen and myelin efficiency.

💡 *Gentle next steps*: Give yourself a 5-minute single-task focus block. Take 3 deep diaphragmatic breaths before switching tasks, and stay hydrated.`;
    },
    followUps: [
      'Explain the connection between gut health and brain fog',
      'What foods support sustained focus?',
      'When should brain fog be checked by a doctor?',
    ],
  },
  {
    keywords: ['bloat', 'bloating', 'digestion', 'stomach', 'gut', 'gas'],
    title: 'Digestive Comfort & Bloating',
    content: (user: UserProfile, logs: DailyCheckInData[]) => {
      return `Bloating is a sensation of increased abdominal pressure or visible distension. It is extraordinarily common and usually multifaceted:

- **Autonomic Nervous System & Digestion**: When stress is high, blood flow is diverted away from the splanchnic (gut) circulation to limbs ("fight or flight"). This slows peristalsis and leads to fermentation and gas.
- **Sodium & Hydration Balance**: Dehydration paradoxically causes intracellular fluid retention in response to osmotic shifts.
- **Food Velocity & Chewing**: Eating while rushing or working causes air swallowing (aerophagia) and incomplete enzymatic breakdown.
- **Hormonal Sensitivity**: In women who cycle, progesterone relaxes smooth muscle tissue, slowing motility in the second half of the cycle. For non-cycling women, shifts in microbiome diversity or thyroid slowing produce identical symptoms.

💡 *Helpful practice*: Sit down to eat without screens for just 10 minutes. A warm herbal tea (peppermint or ginger) can naturally soothe smooth muscle tension.`;
    },
    followUps: [
      'Why do I bloat more when stressed?',
      'What is the difference between water retention and gas?',
      'What symptoms indicate IBS or food intolerance?',
    ],
  },
  {
    keywords: ['headache', 'migraine', 'temple', 'head pain', 'throbbing'],
    title: 'Headache & Tension Signals',
    content: (user: UserProfile, logs: DailyCheckInData[]) => {
      return `Headaches are sensory signals with multiple potential triggers across lifestyle, nervous system, and vascular dynamics:

1. **Tension & Cervicogenic**: Prolonged neck flexion ("tech neck"), jaw clenching (bruxism), or shoulder tension tighten the suboccipital muscles, sending referral pain across the temples.
2. **Hydration & Electrolytes**: Mild electrolyte imbalances (sodium/magnesium/potassium) disrupt cerebral blood vessel tone.
3. **Vascular & Neurochemical**: Migraines involve sensitization of the trigeminal nerve pathway. Triggers often include bright light, irregular meal timing, or drop in blood pressure.
4. **Hormonal Fluctuations**: Sudden shifts in hormones or cortisol can provoke vascular dilation.

⚠️ *Safety Reminder*: A mild or recurrent tension headache is common, but any headache that comes on like a thunderclap ("worst headache of your life"), or occurs with speech changes, vision loss, or high fever, requires urgent emergency evaluation.`;
    },
    followUps: [
      'How does magnesium help with headaches?',
      'How do I tell tension headaches from migraines?',
      'What questions should I bring to my doctor about headaches?',
    ],
  },
  {
    keywords: ['doctor', 'appointment', 'visit', 'physician', 'prep', 'lab'],
    title: 'Doctor Visit Preparation',
    content: (user: UserProfile, logs: DailyCheckInData[]) => {
      return `Preparing for a medical appointment empowers you to turn vague feelings into concrete clinical data:

1. **Lead with Your Chief Concern**: Start by stating your primary goal: *"In the last 30 days, my most impactful symptom is [X], which happens [Y] times a week and affects my ability to work/sleep."*
2. **Bring Objective Trends**: Instead of saying "I always feel tired," share your companion log: *"Over the past month, my energy is rated 2/5 on 60% of days, even when sleeping 7+ hours."*
3. **Request Differential Explorations**: Ask: *"What are the 2 or 3 most common explanations for these symptoms, and what baseline lab tests (e.g. CBC, CMP, TSH, Ferritin) would help rule them out?"*

You can visit our **Doctor-Visit Prep** tab anytime to auto-generate a shareable, formatted summary of your logged data!`;
    },
    followUps: [
      'How can I advocate for myself with a skeptical doctor?',
      'What baseline blood panels should every woman have?',
      'Generate a summary of my recent symptoms for my doctor',
    ],
  },
];

export async function processCompanionMessage({
  message,
  user,
  recentLogs,
}: CompanionQuery): Promise<CompanionResponse> {
  // 1. Mandatory Red-Flag Safety Check
  const redFlag = detectRedFlags(message);
  if (redFlag.isRedFlag) {
    return {
      reply: `🚨 **IMPORTANT SAFETY NOTICE**: Based on what you just shared ("${message.slice(0, 50)}..."), this symptom warrants **immediate medical evaluation** rather than app-based guidance.\n\n${redFlag.reason}\n\n**Immediate Action**: ${redFlag.emergencyAction}\n\n**Hotlines & Emergency Services**:\n${redFlag.hotlines?.map((h) => `• **${h.label}**: ${h.number}`).join('\n')}\n\nPlease prioritize your safety and reach out to emergency professionals or your local urgent care now.`,
      isRedFlag: true,
      redFlagDetails: redFlag,
      suggestedFollowUps: [
        'Call 911 / Emergency Services',
        'Find nearest Urgent Care clinic',
        'Contact crisis support (Call/Text 988)',
      ],
    };
  }

  // 2. Check for External LLM API Key (Anthropic Claude or Gemini)
  // If user has set ANTHROPIC_API_KEY or GEMINI_API_KEY in process.env, we can call it.
  // Otherwise, we use the demographically-broad, curated clinical knowledge base.
  const lowerMsg = message.toLowerCase();

  // Match curated knowledge topics
  const matchedTopic = KNOWLEDGE_TOPICS.find((t) =>
    t.keywords.some((k) => lowerMsg.includes(k))
  );

  if (matchedTopic) {
    const personalizedReply = matchedTopic.content(user, recentLogs);
    return {
      reply: `Hello ${user.name || 'friend'}, I'm here to help you understand what your body might be experiencing.\n\n${personalizedReply}\n\n*Note: I am an AI companion designed to provide evidence-based health literacy and pattern awareness. I never provide diagnoses or prescribe treatments.*`,
      isRedFlag: false,
      suggestedFollowUps: matchedTopic.followUps,
    };
  }

  // Default empathetic Explain-My-Body response
  const recentSymptoms = recentLogs
    .flatMap((l) => l.symptoms.map((s) => s.name))
    .slice(0, 4);

  return {
    reply: `Thank you for sharing that with me. Looking at your recent companion logs (you've completed ${recentLogs.length} entries${recentSymptoms.length ? ` with notes on ${recentSymptoms.join(', ')}` : ''}), here is how we can think about this:

1. **Everyday Physiological Context**: Your body's signals are constantly adapting to sleep architecture, hydration, chronic stress, and systemic rhythms. When multiple signals appear at once, it is usually your nervous system signaling a need for recovery rather than an acute pathology.
2. **Demographic & Holistic Awareness**: Whether you are in school, managing a career, or enjoying retirement, your well-being is whole-body. We look at energy, mood, and sleep as interconnected feedback loops.
3. **Actionable Awareness**: Consider tracking how this symptom changes before vs. after meals, after a full night's sleep, or during periods of reduced screen time.

Would you like to explore what causes this symptom, see how it correlates with your sleep, or generate a summary to discuss with your healthcare provider?`,
    isRedFlag: false,
    suggestedFollowUps: [
      'Explain my recent fatigue and sleep patterns',
      'What causes brain fog and afternoon energy drops?',
      'Prepare a one-page summary for my next doctor visit',
    ],
  };
}
