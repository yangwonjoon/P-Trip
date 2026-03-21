/** 도깨비 톤 브랜딩 멘트 */
export const COPY = {
  hero: {
    title: "Don't know where to go?",
    subtitle: "Let the Dokkaebi decide.",
    tagline: "Your trickster guide to Korea",
  },
  location: {
    sectionLabel: "WHERE ARE YOU?",
    useMyLocation: "Use my location",
    orPickCity: "or pick a city",
    permissionPrompt:
      "Where are you right now? (Don't worry, we won't plan ahead.)",
  },
  mode: {
    sectionLabel: "PICK YOUR VIBE",
    category: {
      label: "Category draw",
      description: "Pick a deck — food, spots, or shopping",
    },
    mix: {
      label: "Mix draw",
      description: "All shuffled — the Dokkaebi picks for you",
    },
    course: {
      label: "Full day course",
      description: "4 cards — morning to dinner",
      badge: "coming soon",
    },
  },
  draw: {
    pickDeck: "Pick your deck",
    pickDeckSub: "What are you in the mood for?",
    shuffleButton: "Shuffle this deck 🃏",
    shufflingTitle: "Shuffling the deck...",
    shufflingSub: "The Dokkaebi is messing with your fate",
    resultTitle: "The Dokkaebi has spoken!",
    resultSub: "No takebacks. (okay, maybe one.)",
  },
  actions: {
    getDirections: "Get directions on Google Maps",
    drawAgain: "Draw again 🔀",
    share: "Share",
    shuffleAndDraw: "Shuffle & draw 🃏",
  },
  empty: "Even the Dokkaebi needs a moment. Try another city!",
  footer: "Plans? The Dokkaebi doesn't know that word.",
} as const;
