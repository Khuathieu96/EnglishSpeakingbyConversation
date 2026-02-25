// Types
export interface ConversationLine {
  id:  string;
  speaker: 'ai' | 'user';
  text: string;
  hint?: string;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  difficulty:  'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  estimatedTime: number; // in minutes
  lines: ConversationLine[];
}

// Sample Conversations Data
export const conversations: Conversation[] = [
  // ==================== BEGINNER LEVEL ====================
  {
    id: 'restaurant-order',
    title: 'Restaurant Order',
    description:  'Practice ordering food, asking for recommendations, and handling the check.',
    difficulty: 'beginner',
    category: 'Dining',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfWkkR3sl5_48VqaeuyeuXCKAO5cIe7Opg4rH9DLdvfWp18YB9YnjkD8d5GdLe3URQ6wvgNBZUERQ4ETBr3bReqi8O7SyZrVKHwQ4WRenftkeaU0_7GIONhpTinxtaJM1CbiXWpfFr9LLHOIpSyIj1MCRb14vUDLx_gZxZzTB-FkChxnN8BoNzbvVn1ysN8xbMqXAaFvj-1H9RR_ZgMwoDSbDLsn8PJMD1lMFeOfyMsmLS2ypKUaTFttGqG7E8DKzGMfQ9QzpJ2UrX',
    estimatedTime: 5,
    lines: [
      {
        id: 'ro-1',
        speaker: 'ai',
        text: "Hello! Welcome to our restaurant.  How many people?",
      },
      {
        id:  'ro-2',
        speaker: 'user',
        text: "Hi, table for two please.",
        hint: "Tell them how many people are in your group",
      },
      {
        id: 'ro-3',
        speaker: 'ai',
        text: "Right this way. Here are your menus.  Can I get you something to drink? ",
      },
      {
        id: 'ro-4',
        speaker: 'user',
        text: "I'll have water, please.",
        hint: "Order a drink",
      },
      {
        id: 'ro-5',
        speaker: 'ai',
        text: "Sure.  Are you ready to order, or do you need a few more minutes?",
      },
      {
        id: 'ro-6',
        speaker: 'user',
        text: "I'm ready.  I'd like the grilled chicken, please.",
        hint: "Tell them you're ready and order your food",
      },
      {
        id: 'ro-7',
        speaker: 'ai',
        text: "Excellent choice. Would you like any side dishes with that?",
      },
      {
        id: 'ro-8',
        speaker: 'user',
        text: "Yes, I'll have the salad and french fries.",
        hint: "Choose your side dishes",
      },
      {
        id: 'ro-9',
        speaker:  'ai',
        text:  "Perfect. Your order will be ready in about fifteen minutes.",
      },
      {
        id: 'ro-10',
        speaker: 'user',
        text: "Thank you very much.",
        hint: "Express gratitude",
      },
      {
        id: 'ro-11',
        speaker: 'ai',
        text: "Here's your food. Enjoy your meal!  Is there anything else you need?",
      },
      {
        id: 'ro-12',
        speaker: 'user',
        text: "Could I have the check, please?",
        hint: "Ask for the bill",
      },
    ],
  },
  {
    id: 'meeting-new-people',
    title: 'Meeting New People',
    description: 'Learn natural introductions, ice-breakers, and basic small talk for social events.',
    difficulty: 'beginner',
    category: 'Social',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2h8Zs7rNcb9pSYTYDo-yH-Ompw_XGQTPSpoqPYla3s_suRbsHGrKhZKpKGuEEPsp_7_2HGiWj5gU3NwqER_ro58Atdb7mgMJipq9IYDMIZG6WiuIK6WfmQAwCz7k9Ll3QmiJ4l7BTEN_s1MDF2z5sELrUxhbpciXH0j7nGK1PzZEjU9KHfr1TixK5v0al34Kk249VcoIcyd9w1-jYWoYsK35VB0G2JvSDfOsOjfDoeriEyM0PdqcoDVXqOgTnGVsBpcjcVZ5TDI0T',
    estimatedTime: 4,
    lines: [
      {
        id: 'mnp-1',
        speaker:  'ai',
        text:  "Hi there! I don't think we've met before. I'm Sarah.",
      },
      {
        id: 'mnp-2',
        speaker: 'user',
        text: "Nice to meet you, Sarah. I'm John.",
        hint: "Introduce yourself",
      },
      {
        id: 'mnp-3',
        speaker: 'ai',
        text: "Nice to meet you too, John. Are you from around here?",
      },
      {
        id: 'mnp-4',
        speaker: 'user',
        text: "No, I moved here last month from New York.",
        hint: "Tell them where you're from",
      },
      {
        id: 'mnp-5',
        speaker: 'ai',
        text: "Oh, that's exciting! What brought you here?",
      },
      {
        id: 'mnp-6',
        speaker: 'user',
        text: "I got a new job at a tech company downtown.",
        hint: "Explain why you moved",
      },
      {
        id: 'mnp-7',
        speaker: 'ai',
        text: "That's great! How do you like it so far?",
      },
      {
        id: 'mnp-8',
        speaker:  'user',
        text:  "I really enjoy it. The people are very friendly.",
        hint: "Share your opinion",
      },
      {
        id: 'mnp-9',
        speaker: 'ai',
        text: "I'm glad to hear that. We should grab coffee sometime! ",
      },
      {
        id: 'mnp-10',
        speaker: 'user',
        text: "That sounds great. Here's my phone number.",
        hint: "Accept the invitation",
      },
    ],
  },
  {
    id: 'at-the-store',
    title: 'Shopping at the Store',
    description:  'Ask for prices, sizes, and find specific items while browsing a local shop.',
    difficulty: 'beginner',
    category: 'Shopping',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2WTqz4PmE5mUdmAy1ROhg6AlU_mFQNung0YEahNEZwRhwIkOI2C6xC8ZA4N-Z_z53UITMG_pXvO1Fsh8dhKe7hLaijrYAuoBLe22evlLVfFPmunqrv-_6-Ur1Q0bPpKjtEL9BjoqI35gG6mXOrlgrB7U-0sqwEagrh1wDdASrqCC9DU3VgHRU803UvYVq6R-_KyEBy-J3Ycbb4YGJ_n05-Kzcvfsj6GN-EXLeToa1kMRKM22BeGpc6n4oFf95SsN-rNJBWxBtHFbl',
    estimatedTime: 4,
    lines: [
      {
        id: 'ats-1',
        speaker: 'ai',
        text: "Hello! Welcome to our store. Can I help you find something?",
      },
      {
        id: 'ats-2',
        speaker: 'user',
        text: "Yes, I'm looking for a blue shirt.",
        hint: "Tell them what you're looking for",
      },
      {
        id: 'ats-3',
        speaker: 'ai',
        text: "Sure!  What size do you need?",
      },
      {
        id: 'ats-4',
        speaker: 'user',
        text: "I need a medium, please.",
        hint: "Tell them your size",
      },
      {
        id: 'ats-5',
        speaker: 'ai',
        text: "Here you go. The fitting rooms are on your right if you'd like to try it on.",
      },
      {
        id: 'ats-6',
        speaker: 'user',
        text: "Thank you.  I'll try it on now.",
        hint: "Thank them and respond",
      },
      {
        id: 'ats-7',
        speaker: 'ai',
        text: "How does it fit?",
      },
      {
        id: 'ats-8',
        speaker: 'user',
        text: "It fits perfectly. I'll take it.",
        hint: "Tell them about the fit",
      },
      {
        id: 'ats-9',
        speaker:  'ai',
        text:  "Great! Will that be cash or card?",
      },
      {
        id: 'ats-10',
        speaker: 'user',
        text: "I'll pay with my credit card.",
        hint: "Choose your payment method",
      },
    ],
  },

  // ==================== INTERMEDIATE LEVEL ====================
  {
    id: 'at-the-airport',
    title: 'At the Airport',
    description: 'Navigate check-in, customs, and boarding announcements with confidence.',
    difficulty: 'intermediate',
    category: 'Travel',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSihMHc0Q7VVVRz1_1CPcEG6iPEM9EnTU2U8heDVwW31E17ccjCilNdFoa488xZRJTITHwhNJbg0YB535202kurctf__NzkYDAx4XnOR_gdmUQu_E7eVychhCHuBjFHiv5NHWQOSEIvvsXMoW7gEn3CEtO-DLPeJlXUrnsl21fEMWbF1x3_FUeWOcLMqNXDlv3xktOEwM3QQoTj4asQ1MHAo36ZWPUDvyMlggGtBwPpR_qwyur0WKc250c1lt-Ose--xymX6DAy1Ct',
    estimatedTime: 6,
    lines: [
      {
        id: 'ata-1',
        speaker: 'ai',
        text: "Good morning.  May I see your passport and booking confirmation, please?",
      },
      {
        id: 'ata-2',
        speaker:  'user',
        text:  "Of course, here they are.",
        hint: "Hand over your documents",
      },
      {
        id: 'ata-3',
        speaker:  'ai',
        text:  "Thank you. Are you checking any bags today?",
      },
      {
        id: 'ata-4',
        speaker: 'user',
        text: "Yes, I have one suitcase to check in.",
        hint: "Tell them about your luggage",
      },
      {
        id: 'ata-5',
        speaker: 'ai',
        text: "Please place it on the scale.  Would you like a window or aisle seat?",
      },
      {
        id: 'ata-6',
        speaker: 'user',
        text: "A window seat would be great, thank you.",
        hint: "Choose your seat preference",
      },
      {
        id: 'ata-7',
        speaker: 'ai',
        text: "Here's your boarding pass. Your gate is B twelve, and boarding starts at ten thirty.",
      },
      {
        id: 'ata-8',
        speaker: 'user',
        text: "What time should I be at the gate?",
        hint: "Ask about timing",
      },
      {
        id: 'ata-9',
        speaker: 'ai',
        text: "Please be there at least thirty minutes before boarding.  Security is to your left.",
      },
      {
        id: 'ata-10',
        speaker: 'user',
        text: "Is there a lounge I can use while I wait?",
        hint: "Ask about airport facilities",
      },
      {
        id: 'ata-11',
        speaker: 'ai',
        text: "Yes, there's a lounge near gate B ten.  Do you have any other questions?",
      },
      {
        id: 'ata-12',
        speaker:  'user',
        text:  "No, that's everything. Thank you for your help.",
        hint: "Thank them and conclude",
      },
    ],
  },
  {
    id: 'doctor-visit',
    title: 'Doctor Visit',
    description:  'Explain symptoms, understand medical advice, and ask about treatments.',
    difficulty: 'intermediate',
    category: 'Healthcare',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-konOb0FtFBj7kXyasb8pk8Ei1T9E4H2_xBkcxj_Xyx6w79CYBwWCuZpp_LU_FnokjLxxLuSCbXOcGOBRjJ_7GNK-d7kmyWhnkjQjGAVZGud9E6OkX67Whi9HcXYQaFuN-OQi47NDhOFFtZeg86g3mjt8NdnFXBZLkVpxFoKZZbHmegbGSOynoTuFJ25zpbmIkMrPyKNJmytUnwk0sbWT4AktFaiVn69UwDkfV6qNWzfcs37aAAXJE01aeabIt45-JbXmR_HttImd',
    estimatedTime: 5,
    lines:  [
      {
        id:  'dv-1',
        speaker: 'ai',
        text: "Good afternoon. What brings you in today?",
      },
      {
        id:  'dv-2',
        speaker: 'user',
        text: "I've been having headaches and feeling very tired lately.",
        hint: "Describe your symptoms",
      },
      {
        id: 'dv-3',
        speaker: 'ai',
        text: "I see. How long have you been experiencing these symptoms? ",
      },
      {
        id: 'dv-4',
        speaker: 'user',
        text: "It started about a week ago.",
        hint: "Tell them when it started",
      },
      {
        id: 'dv-5',
        speaker: 'ai',
        text: "Are the headaches constant, or do they come and go?",
      },
      {
        id: 'dv-6',
        speaker: 'user',
        text: "They come and go, usually in the afternoon.",
        hint: "Describe the pattern",
      },
      {
        id: 'dv-7',
        speaker: 'ai',
        text: "Have you been getting enough sleep?  Any changes in your diet?",
      },
      {
        id: 'dv-8',
        speaker:  'user',
        text:  "I've been working late and not sleeping well.",
        hint: "Explain your lifestyle",
      },
      {
        id: 'dv-9',
        speaker: 'ai',
        text: "That could be contributing.  Are you taking any medications currently?",
      },
      {
        id: 'dv-10',
        speaker: 'user',
        text: "No, I'm not taking any medications.",
        hint: "Answer about medications",
      },
      {
        id: 'dv-11',
        speaker: 'ai',
        text: "I'd like to check your blood pressure. I'll also recommend some lifestyle changes.",
      },
      {
        id: 'dv-12',
        speaker: 'user',
        text: "Should I schedule a follow-up appointment?",
        hint: "Ask about next steps",
      },
    ],
  },
  {
    id: 'hotel-check-in',
    title: 'Hotel Check-in',
    description: 'Manage your reservation, request amenities, and report room issues.',
    difficulty: 'intermediate',
    category: 'Travel',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfcu-OiS8aTb7RWCiQ2TQT1qkG5qjKxPI5ROpFNprMZOT2fGz_mscoDJE4nefcy9wfistrnIrz7BfywjyvwI-jupzYYywIkxCmlw-4sd9FMu71pYyDboWzrek6kgXFIVzrTUnb-edBcT4AWTSdB5IyVAmMYGX5GJdAwiNekd6zP2iA2wilFln4y1ouApPLz-fwy6uvncyKyGTC_AGtDqJqbKaRKTQjPVxfseA5WyFmFNTnZc2VDiJ5IAkXo_N3H-bADiJGWMujiieM',
    estimatedTime:  5,
    lines: [
      {
        id: 'hci-1',
        speaker:  'ai',
        text:  "Welcome to the Grand Hotel. Do you have a reservation?",
      },
      {
        id:  'hci-2',
        speaker: 'user',
        text: "Yes, I have a reservation under the name Smith.",
        hint: "Confirm your reservation",
      },
      {
        id: 'hci-3',
        speaker:  'ai',
        text:  "Let me look that up.  Ah yes, a double room for three nights.  Is that correct?",
      },
      {
        id: 'hci-4',
        speaker: 'user',
        text: "That's correct. Is early check-in available?",
        hint: "Confirm and ask about early check-in",
      },
      {
        id: 'hci-5',
        speaker: 'ai',
        text: "Your room is actually ready now. May I see your ID and a credit card for incidentals?",
      },
      {
        id: 'hci-6',
        speaker: 'user',
        text: "Sure, here's my passport and credit card.",
        hint: "Provide your documents",
      },
      {
        id: 'hci-7',
        speaker:  'ai',
        text:  "Thank you. You're in room four fifteen on the fourth floor. Would you like help with your luggage?",
      },
      {
        id: 'hci-8',
        speaker: 'user',
        text: "No thank you, I can manage.  What time is breakfast served?",
        hint: "Decline and ask about breakfast",
      },
      {
        id: 'hci-9',
        speaker: 'ai',
        text: "Breakfast is from seven to ten in the restaurant on the ground floor.  Here are your key cards.",
      },
      {
        id: 'hci-10',
        speaker: 'user',
        text: "Is the gym and pool included with my stay?",
        hint:  "Ask about hotel amenities",
      },
      {
        id: 'hci-11',
        speaker:  'ai',
        text:  "Yes, all amenities are included. The gym is on the second floor, and the pool is on the rooftop.",
      },
      {
        id: 'hci-12',
        speaker:  'user',
        text:  "Perfect. Thank you very much for your help.",
        hint: "Thank them",
      },
    ],
  },

  // ==================== ADVANCED LEVEL ====================
  {
    id: 'job-interview',
    title: 'Job Interview',
    description:  'Master professional vocabulary and answer complex behavioral questions.',
    difficulty: 'advanced',
    category: 'Professional',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgb3BwlUTACd2jJobRAu4Ii-Vdgi7xP8I0Bk5UWUNtTqDwE03wO-UgVALFypZ9C_dIX6siGYoGPDf-Hw5BgN653VZg_sdOZOS5jZ_h-jQMJgVyijNG68sN2ZGarvpGlfOf1bWZJ8GRR393t-U8O62Ipz6hYm9BdFAqrr1vZb1S5MHWOUNqfsStRwYwAxD5ER2whWPiMG3fw8e40X9BaJp0YnQN0YBmBmSEgAeNJSLWDYfwOfO-n5n0Neh9td74GhZlDaxi-H3wuYRE',
    estimatedTime: 8,
    lines: [
      {
        id: 'ji-1',
        speaker: 'ai',
        text: "Thank you for coming in today. Please, have a seat.  Can you start by telling me a little about yourself?",
      },
      {
        id: 'ji-2',
        speaker: 'user',
        text: "Thank you for having me. I'm a software developer with five years of experience in web development.",
        hint: "Give a brief professional introduction",
      },
      {
        id: 'ji-3',
        speaker: 'ai',
        text: "Impressive. What attracted you to this position at our company?",
      },
      {
        id: 'ji-4',
        speaker:  'user',
        text:  "I've always admired your company's innovative approach, and I believe my skills would be a great fit for your team.",
        hint: "Explain why you want this job",
      },
      {
        id: 'ji-5',
        speaker: 'ai',
        text: "Can you tell me about a challenging project you've worked on? ",
      },
      {
        id: 'ji-6',
        speaker: 'user',
        text: "I led a project to redesign our company's main application, which improved user engagement by thirty percent.",
        hint: "Describe a specific achievement",
      },
      {
        id: 'ji-7',
        speaker: 'ai',
        text: "That's great.  How do you handle tight deadlines and pressure?",
      },
      {
        id: 'ji-8',
        speaker: 'user',
        text: "I prioritize tasks effectively and communicate clearly with my team to ensure we meet our goals.",
        hint: "Explain your approach to pressure",
      },
      {
        id: 'ji-9',
        speaker: 'ai',
        text: "What would you say is your greatest weakness?",
      },
      {
        id: 'ji-10',
        speaker: 'user',
        text: "I sometimes focus too much on details, but I've learned to balance thoroughness with efficiency.",
        hint: "Be honest but show self-improvement",
      },
      {
        id: 'ji-11',
        speaker: 'ai',
        text: "Where do you see yourself in five years? ",
      },
      {
        id: 'ji-12',
        speaker: 'user',
        text: "I see myself in a leadership role, contributing to strategic decisions while mentoring junior developers.",
        hint: "Share your career aspirations",
      },
      {
        id: 'ji-13',
        speaker: 'ai',
        text: "Do you have any questions for us?",
      },
      {
        id: 'ji-14',
        speaker: 'user',
        text: "Yes, could you tell me more about the team I would be working with?",
        hint: "Ask a thoughtful question",
      },
      {
        id: 'ji-15',
        speaker: 'ai',
        text: "Of course. You'd be joining a team of eight developers.  We'll be in touch soon about next steps.",
      },
      {
        id: 'ji-16',
        speaker: 'user',
        text: "Thank you for your time.  I look forward to hearing from you.",
        hint: "Close professionally",
      },
    ],
  },
  {
    id: 'business-negotiation',
    title: 'Business Negotiation',
    description: 'Practice persuasive speaking, counter-offers, and closing formal deals.',
    difficulty: 'advanced',
    category: 'Professional',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO-HPgTIRVFk7aWG7VQLOc_NDNLkf7XU4VrKijcm94vZbRROsaq9IxftpI33kL0mQLumzKX-2NF2NeX_eQgRCdrYFvRAg-DsDhcbVQEN7kik1ABelfDcy_bhsNJ3K6-lZlRsX5SmHBYfqZIk2YyXs-kelrvKJ8iWHWMAk0KgLST_mBBP_VxTAYwa283H98SjusOo9DAK51brd90PMbXBFck8aPj6Qmsbnx3PH9fsMtF7BeZEAwDOwji_vgVkTjmy-jS0jsWEO90N3O',
    estimatedTime:  7,
    lines: [
      {
        id: 'bn-1',
        speaker: 'ai',
        text: "Thank you for meeting with us today. We've reviewed your proposal.  Shall we discuss the terms?",
      },
      {
        id: 'bn-2',
        speaker:  'user',
        text:  "Absolutely. I'm confident we can find terms that work for both parties.",
        hint: "Express willingness to negotiate",
      },
      {
        id: 'bn-3',
        speaker:  'ai',
        text:  "Your pricing seems a bit higher than what we typically pay. Can you explain the value? ",
      },
      {
        id: 'bn-4',
        speaker: 'user',
        text: "Our pricing reflects the premium quality and dedicated support we provide, which reduces long-term costs.",
        hint: "Justify your pricing with value",
      },
      {
        id: 'bn-5',
        speaker: 'ai',
        text: "I understand.  However, our budget is limited.  Is there any flexibility on the price?",
      },
      {
        id: 'bn-6',
        speaker: 'user',
        text: "We could offer a ten percent discount if you commit to a two-year contract.",
        hint: "Offer a compromise",
      },
      {
        id: 'bn-7',
        speaker: 'ai',
        text: "Two years is a long commitment. What about a one-year contract with an option to renew?",
      },
      {
        id: 'bn-8',
        speaker: 'user',
        text: "We can do one year, but the discount would need to be adjusted to five percent.",
        hint: "Counter-offer with adjusted terms",
      },
      {
        id: 'bn-9',
        speaker: 'ai',
        text: "That seems reasonable. What about the delivery timeline?  We need implementation within three months.",
      },
      {
        id: 'bn-10',
        speaker: 'user',
        text: "Three months is tight, but we can meet that deadline with proper resource allocation.",
        hint: "Address the timeline concern",
      },
      {
        id: 'bn-11',
        speaker: 'ai',
        text: "Good. Let's also discuss the payment terms. We prefer net sixty days.",
      },
      {
        id: 'bn-12',
        speaker: 'user',
        text: "We typically require net thirty, but we can agree to net forty-five as a compromise.",
        hint: "Negotiate payment terms",
      },
      {
        id: 'bn-13',
        speaker: 'ai',
        text: "I think we have a deal.  Shall we summarize the agreed terms? ",
      },
      {
        id: 'bn-14',
        speaker: 'user',
        text: "Yes, let's document everything and have our legal teams review the contract.",
        hint: "Confirm and suggest next steps",
      },
    ],
  },
  {
    id: 'technical-support-call',
    title: 'Technical Support Call',
    description: 'Diagnose tech problems, follow instructions, and resolve connectivity issues.',
    difficulty: 'advanced',
    category: 'Technology',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi8S83oRAfXxZc1hUeHGoC0__-GxGW2i0OhR-fUAU4WC04khGkX7xLB3KNWafj9NTmUVGfbjohp8vVan8u3yjvaeSGpy8ODDgKSAVgW3kYU0AltW8ud3pyM2ElV6jyr3HAZ5Z1YRgR-aMjRj8ZnPutmixW6BxzprfCGYSFvmWPyVPuvuraXRqeVEMUlQaq7BoI_aVsLurqr48zuZxMdGAxcUl1YqQH016Q9DE9defPVyNUt8CydXTNpnT9k9XqpCuFs00wQXK5oOYD',
    estimatedTime:  6,
    lines: [
      {
        id: 'tsc-1',
        speaker:  'ai',
        text:  "Thank you for calling tech support. How can I assist you today?",
      },
      {
        id: 'tsc-2',
        speaker: 'user',
        text: "Hi, I'm having trouble connecting to the internet. My WiFi keeps disconnecting.",
        hint: "Describe your technical issue",
      },
      {
        id: 'tsc-3',
        speaker: 'ai',
        text: "I'm sorry to hear that. When did this issue start, and have you made any recent changes to your network?",
      },
      {
        id: 'tsc-4',
        speaker: 'user',
        text: "It started yesterday. I haven't changed anything, but there was a power outage the night before.",
        hint: "Provide relevant details",
      },
      {
        id: 'tsc-5',
        speaker: 'ai',
        text: "That could be related.  Have you tried restarting your router by unplugging it for thirty seconds?",
      },
      {
        id: 'tsc-6',
        speaker:  'user',
        text:  "Yes, I've already tried that, but the problem persists.",
        hint: "Confirm what you've already tried",
      },
      {
        id: 'tsc-7',
        speaker: 'ai',
        text: "Let's check your router settings. Can you tell me what lights are currently showing on the router?",
      },
      {
        id: 'tsc-8',
        speaker:  'user',
        text:  "The power light is solid green, but the internet light is blinking orange.",
        hint: "Describe what you observe",
      },
      {
        id: 'tsc-9',
        speaker: 'ai',
        text: "The blinking orange indicates a connection issue. I'll run a diagnostic from our end.  Can you confirm your account number?",
      },
      {
        id: 'tsc-10',
        speaker:  'user',
        text:  "Sure, my account number is seven eight five four three two one.",
        hint: "Provide the requested information",
      },
      {
        id: 'tsc-11',
        speaker: 'ai',
        text: "I see the issue. There's a signal problem in your area. I'm sending a refresh signal now.  Please wait a moment.",
      },
      {
        id: 'tsc-12',
        speaker: 'user',
        text: "Okay, the internet light just turned solid green. It seems to be working now.",
        hint: "Confirm the status update",
      },
      {
        id: 'tsc-13',
        speaker: 'ai',
        text: "Excellent!  Is there anything else I can help you with today?",
      },
      {
        id: 'tsc-14',
        speaker: 'user',
        text: "No, that's all. Thank you so much for your help.",
        hint: "Thank them and conclude",
      },
    ],
  },
];

// Helper functions
export const getConversationById = (id: string): Conversation | undefined => {
  return conversations.find((conv) => conv.id === id);
};

export const getConversationsByDifficulty = (
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Conversation[] => {
  return conversations.filter((conv) => conv.difficulty === difficulty);
};

export const getConversationsByCategory = (category: string): Conversation[] => {
  return conversations.filter(
    (conv) => conv.category. toLowerCase() === category.toLowerCase()
  );
};

export const getAllCategories = (): string[] => {
  const categories = conversations.map((conv) => conv.category);
  return [...new Set(categories)];
};

export const getAllDifficulties = (): string[] => {
  return ['beginner', 'intermediate', 'advanced'];
};

// Get user lines count for a conversation (for progress tracking)
export const getUserLinesCount = (conversationId: string): number => {
  const conversation = getConversationById(conversationId);
  if (!conversation) return 0;
  return conversation.lines. filter((line) => line.speaker === 'user').length;
};