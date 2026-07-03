/**
 * quizConfig.ts - All quiz questions, options, copy, and images.
 * Edit this file to change quiz content without touching layout code.
 */

export interface QuizOption {
  value: string;
  label: string;
  description: string;
}

export interface QuizStep {
  type: "text-input" | "single-select" | "multi-select" | "education" | "contact";
  eyebrow: string;
  question: string;
  hint: string;
  image: string;
  options?: QuizOption[];
  /** For education screens */
  points?: string[];
  buttonText?: string;
}

/**
 * Images: these reference files in /public/images/.
 * Drop the actual garden photos into that folder.
 * Placeholder paths are used until real images are supplied.
 */
const images = {
  landing: "/images/garden-hero-night.jpg",
  location: "/images/garden-pool-pergola.jpg",
  projectType: "/images/garden-pergola-fountain.jpg",
  gardenSize: "/images/garden-dog-castle.jpg",
  engineering: "/images/garden-copper-shower.jpg",
  education: "/images/garden-louvred-pergola-sofa.jpg",
  features: "/images/garden-kamado-fridge.jpg",
  timeline: "/images/garden-night-trellis.jpg",
  finishLevel: "/images/garden-finish-pergola-kitchen.jpg",
  contact: "/images/garden-rural-overview.jpg",
};

export const quizImages = images;

export const quizSteps: Record<string, QuizStep> = {
  postcode: {
    type: "text-input",
    eyebrow: "Your property",
    question: "Where is the property?",
    hint: "", // Hint is dynamic per region (uses locationPlaceholder from Airtable)
    image: images.location,
  },

  projectType: {
    type: "single-select",
    eyebrow: "Your project",
    question: "What kind of project is this?",
    hint: "This helps us understand what you're working with and find landscapers who specialise in exactly this type of work.",
    image: images.projectType,
    options: [
      {
        value: "new_build",
        label: "New build garden",
        description:
          "Starting from scratch. The garden is a blank canvas or builder's finish",
      },
      {
        value: "renovation",
        label: "Garden renovation",
        description:
          "Refreshing or improving an existing garden that needs a new direction",
      },
      {
        value: "extension",
        label: "Garden extension or addition",
        description:
          "Adding a new zone, feature or outdoor living area to an existing garden",
      },
      {
        value: "full_redesign",
        label: "Full redesign",
        description:
          "Starting again with a completely new layout and design",
      },
    ],
  },

  gardenSize: {
    type: "single-select",
    eyebrow: "Your garden",
    question: "How large is the outdoor space?",
    hint: "A rough size is fine. Think of it in terms of familiar spaces rather than exact measurements.",
    image: images.gardenSize,
    options: [
      {
        value: "small",
        label: "Small",
        description:
          "Up to 100m\u00B2. Roughly the size of a large living room or small courtyard",
      },
      {
        value: "medium",
        label: "Medium",
        description:
          "100\u2013250m\u00B2. About the size of a tennis court. Typical detached house garden.",
      },
      {
        value: "large",
        label: "Large",
        description:
          "250\u2013500m\u00B2. Around a quarter of a football pitch. Room for multiple zones.",
      },
      {
        value: "xlarge",
        label: "Extra large",
        description:
          "500\u20131,000m\u00B2. Half a football pitch or more. Substantial plot with real scope.",
      },
      {
        value: "estate",
        label: "Estate",
        description:
          "1,000m\u00B2+. A full football pitch or larger. Rural property or estate grounds.",
      },
    ],
  },

  engineering: {
    type: "single-select",
    eyebrow: "Site conditions",
    question: "Are there any slope, drainage or access challenges on the plot?",
    hint: "Understanding the site helps us match you with landscapers who have the right experience for your specific conditions.",
    image: images.engineering,
    options: [
      {
        value: "none",
        label: "Mostly flat and easy to access",
        description:
          "No obvious level changes, tight access or drainage complications",
      },
      {
        value: "slope",
        label: "Slope or level changes",
        description:
          "Steps, retaining walls or structural work will be needed to manage levels",
      },
      {
        value: "drainage",
        label: "Drainage or waterlogging",
        description:
          "The garden holds water, drains poorly or needs proper surface water management",
      },
      {
        value: "both",
        label: "Slope plus drainage issues",
        description:
          "The site needs careful technical planning. We'll make sure the right landscaper is matched.",
      },
    ],
  },

  siteEducation: {
    type: "education",
    eyebrow: "What makes a great garden",
    question:
      "The gardens that look the best in year five are the ones that were planned properly in year one.",
    hint: "",
    image: images.education,
    points: [
      "Drainage and soil preparation done right means the planting thrives and the lawn stays green, not patchy.",
      "A well-designed garden is built around how you actually use the space, not just how it looks on the day it's finished.",
      "We focus on finish dates, not start dates. The garden should be ready when you want it.",
    ],
    buttonText: "Choose Your Outdoor Features",
  },

  features: {
    type: "multi-select",
    eyebrow: "Outdoor features",
    question: "Which features are on the wish list?",
    hint: "Choose everything that matters. This is where projects move from a tidy garden to a properly considered outdoor space.",
    image: images.features,
    options: [
      {
        value: "patio",
        label: "Patio or terrace",
        description:
          "Dining, entertaining and relaxing surfaces: porcelain, natural stone or composite decking.",
      },
      {
        value: "pergola",
        label: "Pergola or shade structure",
        description:
          "A covered outdoor room that works in the UK climate: louvred, fixed or sail shade.",
      },
      {
        value: "pool",
        label: "Pool or hot tub area",
        description:
          "Pool design, surrounds and access routes, or a hot tub zone with proper drainage and screening.",
      },
      {
        value: "waterFeature",
        label: "Water feature",
        description:
          "A pond, rill, fountain or reflective pool as a garden focal point.",
      },
      {
        value: "outdoorKitchen",
        label: "Outdoor kitchen",
        description:
          "A proper built-in cooking and entertaining area, not just a barbecue on the patio.",
      },
      {
        value: "lighting",
        label: "Lighting scheme",
        description:
          "Designed lighting for atmosphere, safety and extending your garden into the evening.",
      },
      {
        value: "planting",
        label: "Planting and borders",
        description:
          "Designed planting schemes, borders, hedging and trees to bring the garden to life.",
      },
    ],
  },

  timeline: {
    type: "single-select",
    eyebrow: "Timing",
    question: "When would you like the garden to be finished?",
    hint: "We work backwards from your finish date, so the right landscaper is lined up and ready, not just whoever's available.",
    image: images.timeline,
    options: [
      {
        value: "urgent",
        label: "Within the next 3 months",
        description:
          "You want the garden finished as soon as possible",
      },
      {
        value: "planned",
        label: "In the next 3 to 9 months",
        description:
          "You're planning properly and want the right result, not a rushed one",
      },
      {
        value: "flexible",
        label: "I'm still in the research stage",
        description:
          "You want to understand what's possible before committing to a timeline",
      },
    ],
  },

  finishLevel: {
    type: "single-select",
    eyebrow: "Your finish",
    question: "Which best describes the finish you're picturing?",
    hint: "Two identical gardens can cost very differently. This is about taste, not budget. You'll make the final calls in the design stage.",
    image: images.finishLevel,
    options: [
      {
        value: "natural",
        label: "Natural and simple",
        description:
          "Clean lines, good materials, nothing fussy. A garden that works hard and looks effortless.",
      },
      {
        value: "refined",
        label: "Refined and detailed",
        description:
          "Considered details, quality finishes, a design that rewards a second look.",
      },
      {
        value: "premium",
        label: "No expense spared",
        description:
          "The best materials, the finest finishes. Every element chosen with purpose.",
      },
    ],
  },

  contact: {
    type: "contact",
    eyebrow: "Last step",
    question: "Where do we send your estimate?",
    hint: "We'll show your planning range on the next screen and your matched landscapers. No spam, ever.",
    image: images.contact,
  },
};

/**
 * The order screens appear in the quiz flow.
 * This controls navigation (back/forward) and the step counter.
 */
export const quizOrder = [
  "postcode",
  "projectType",
  "gardenSize",
  "engineering",
  "siteEducation",
  "features",
  "timeline",
  "finishLevel",
  "contact",
] as const;

export const TOTAL_STEPS = quizOrder.length;
