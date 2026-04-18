export const templates = [
  { 
    id: '1', type: 'wedding', theme: 'royal', title: 'Royal Wedding', desc: 'Elegant and traditional with rich colors.', color: 'bg-gradient-to-br from-amber-200 to-amber-500',
    demoData: {
      eventType: 'wedding', theme: 'royal',
      primaryName: 'Ankita', secondaryName: 'Mohit',
      primaryParents: 'D/o Anil Kumar Jha & Anita Jha',
      secondaryParents: 'S/o Rama Shankar Rai & Suman Rai',
      introImageUrl: 'https://images.unsplash.com/photo-1543886546-0b8ac1e1d670?q=80&w=800&auto=format&fit=crop',
      primaryPhotoUrl: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=600&auto=format&fit=crop',
      secondaryPhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
      date: '2026-12-15T18:00', venue: 'The Taj Mahal Palace, Mumbai',
      introGreeting: 'Shree Ganeshay Namah',
      story: 'With the heartfelt blessings of our families, we invite you to join us in celebrating the joyous union of our beloved. Our journey began 5 years ago, and every moment since has been magical.',
      musicUrl: 'https://www.youtube.com/watch?v=kGIQ2H6gT2A',
      imageUrls: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop'],
      events: [
        { name: 'Wedding Ceremony', time: '2026-12-15T18:00', description: 'Traditional ceremony under the stars.' },
        { name: 'Grand Reception', time: '2026-12-15T20:30', description: 'Dinner, drinks, and dancing to follow.' }
      ]
    }
  },
  { 
    id: '2', type: 'wedding', theme: 'modern', title: 'Modern Romance', desc: 'Clean, contemporary, and minimalist.', color: 'bg-gradient-to-br from-stone-200 to-stone-400',
    demoData: {
      eventType: 'wedding', theme: 'modern',
      primaryName: 'Emma', secondaryName: 'James',
      date: '2026-09-20T16:00', venue: 'The Glasshouse, New York',
      introGreeting: 'Join us in celebrating the wedding of',
      story: 'A modern love story. We can\'t wait to share this beautiful moment with our closest friends and family in the city where we fell in love.',
      musicUrl: 'https://www.youtube.com/watch?v=FjHGZj2IjBk',
      imageUrls: ['https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Ceremony & Reception', time: '2026-09-20T16:00', description: 'Vows followed by a rooftop cocktail hour and dinner.' }]
    }
  },
  { 
    id: '3', type: 'wedding', theme: 'glassmorphism', title: 'Glassmorphism', desc: 'Trendy, translucent, and sleek.', color: 'bg-gradient-to-br from-blue-100 to-purple-200',
    demoData: {
      eventType: 'wedding', theme: 'glassmorphism',
      primaryName: 'Sophia', secondaryName: 'Liam',
      date: '2026-10-05T17:00', venue: 'Skyline Atrium, Chicago',
      introGreeting: 'You are invited to the wedding of',
      story: 'From high school sweethearts to lifelong partners. Join us as we take the next step in our adventure together.',
      musicUrl: 'https://www.youtube.com/watch?v=1bPEqEie0S4',
      imageUrls: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'The Celebration', time: '2026-10-05T17:00', description: 'An evening of joy, love, and glass-clinking.' }]
    }
  },
  { 
    id: '4', type: 'engagement', theme: 'vintage', title: 'Vintage Love', desc: 'Classic and timeless romance.', color: 'bg-gradient-to-br from-orange-100 to-rose-200',
    demoData: {
      eventType: 'engagement', theme: 'vintage',
      primaryName: 'Olivia', secondaryName: 'Noah',
      date: '2026-06-12T19:00', venue: 'The Heritage Estate, Charleston',
      introGreeting: 'Please join us to celebrate the engagement of',
      story: 'He asked, and she said yes! We are excited to celebrate our engagement with the people who mean the most to us.',
      imageUrls: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Engagement Party', time: '2026-06-12T19:00', description: 'Drinks, hors d\'oeuvres, and good company.' }]
    }
  },
  { 
    id: '5', type: 'engagement', theme: 'elegant', title: 'Elegant Affair', desc: 'Sophisticated and refined.', color: 'bg-gradient-to-br from-slate-200 to-slate-400',
    demoData: {
      eventType: 'engagement', theme: 'elegant',
      primaryName: 'Isabella', secondaryName: 'Lucas',
      date: '2026-08-22T18:30', venue: 'The Grand Hotel Ballroom',
      introGreeting: 'Celebrate the engagement of',
      story: 'We are tying the knot! Come raise a glass with us as we celebrate our upcoming wedding.',
      imageUrls: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Cocktail Reception', time: '2026-08-22T18:30', description: 'Black tie optional.' }]
    }
  },
  { 
    id: '6', type: 'housewarming', theme: 'botanical', title: 'Botanical Home', desc: 'Fresh, natural, and inviting.', color: 'bg-gradient-to-br from-green-200 to-emerald-400',
    demoData: {
      eventType: 'housewarming', theme: 'botanical',
      primaryName: 'The Smiths', secondaryName: '',
      date: '2026-05-10T14:00', venue: '123 Maple Street, Austin, TX',
      introGreeting: 'We\'ve moved! Join us for a',
      story: 'We finally found our dream home! We would love for you to drop by, see the new place, and enjoy some food and drinks with us.',
      imageUrls: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Open House', time: '2026-05-10T14:00', description: 'Drop in anytime between 2 PM and 6 PM.' }]
    }
  },
  { 
    id: '7', type: 'baby_shower', theme: 'sunset', title: 'Sunset Shower', desc: 'Warm, cozy, and beautiful.', color: 'bg-gradient-to-br from-orange-300 to-rose-400',
    demoData: {
      eventType: 'baby_shower', theme: 'sunset',
      primaryName: 'Baby Johnson', secondaryName: '',
      date: '2026-07-18T13:00', venue: 'The Botanical Gardens Cafe',
      introGreeting: 'A new adventure begins! Join us for a baby shower honoring',
      story: 'We are so excited to welcome our little one into the world. Let\'s celebrate with games, gifts, and great company!',
      imageUrls: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Baby Shower', time: '2026-07-18T13:00', description: 'Lunch and baby games!' }]
    }
  },
  { 
    id: '8', type: 'birthday', theme: 'neon', title: 'Neon Party', desc: 'Bright, energetic, and fun.', color: 'bg-gradient-to-br from-fuchsia-400 to-purple-600',
    demoData: {
      eventType: 'birthday', theme: 'neon',
      primaryName: 'Alex', secondaryName: '',
      date: '2026-11-05T21:00', venue: 'Neon Lights Club, Downtown',
      introGreeting: 'Get ready to party! Celebrating the 30th birthday of',
      story: 'I\'m turning 30! Let\'s make it a night to remember. Wear your brightest colors and bring your dancing shoes.',
      imageUrls: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'The Big 3-0 Bash', time: '2026-11-05T21:00', description: 'Drinks, DJ, and dancing all night.' }]
    }
  },
  { 
    id: '9', type: 'birthday', theme: 'confetti', title: 'Confetti Bash', desc: 'Festive and colorful celebration.', color: 'bg-gradient-to-br from-yellow-300 to-pink-400',
    demoData: {
      eventType: 'birthday', theme: 'confetti',
      primaryName: 'Mia', secondaryName: '',
      date: '2026-04-25T14:00', venue: 'Sunshine Park Pavilion',
      introGreeting: 'You are invited to a magical birthday party for',
      story: 'Mia is turning 5! Join us for a fun-filled afternoon with cake, balloons, and a bouncy castle.',
      imageUrls: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Mia\'s 5th Birthday', time: '2026-04-25T14:00', description: 'Cake cutting at 3:30 PM.' }]
    }
  },
  { 
    id: '10', type: 'company_party', theme: 'corporate', title: 'Corporate Event', desc: 'Professional and sleek design.', color: 'bg-gradient-to-br from-gray-700 to-gray-900',
    demoData: {
      eventType: 'company_party', theme: 'corporate',
      primaryName: 'TechCorp', secondaryName: 'Annual Gala',
      date: '2026-12-10T19:00', venue: 'The Grand Convention Center',
      introGreeting: 'You are cordially invited to the',
      story: 'Join us as we celebrate a year of incredible achievements, milestones, and the hard work of our amazing team.',
      imageUrls: ['https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop'],
      events: [
        { name: 'Networking & Cocktails', time: '2026-12-10T19:00', description: 'Meet and greet with the executive team.' },
        { name: 'Awards Dinner', time: '2026-12-10T20:00', description: 'Dinner and annual awards presentation.' }
      ]
    }
  },
  { 
    id: '11', type: 'company_party', theme: 'cyberpunk', title: 'Cyberpunk Night', desc: 'Futuristic and edgy vibe.', color: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    demoData: {
      eventType: 'company_party', theme: 'cyberpunk',
      primaryName: 'NeonTech', secondaryName: 'Product Launch',
      date: '2026-09-15T20:00', venue: 'Sector 7 Warehouse',
      introGreeting: 'Experience the future at the',
      story: 'Be the first to witness our revolutionary new product line. Immersive experiences, live DJs, and futuristic cocktails await.',
      imageUrls: ['https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Launch Event', time: '2026-09-15T20:00', description: 'Keynote presentation at 9 PM.' }]
    }
  },
  { 
    id: '12', type: 'wedding', theme: 'ocean', title: 'Ocean Breeze', desc: 'Calm, serene, and coastal.', color: 'bg-gradient-to-br from-cyan-100 to-blue-300',
    demoData: {
      eventType: 'wedding', theme: 'ocean',
      primaryName: 'Chloe', secondaryName: 'Daniel',
      date: '2026-05-28T16:30', venue: 'Crystal Cove Beach Resort',
      introGreeting: 'Join us by the sea for the wedding of',
      story: 'We are tying the knot with the ocean as our backdrop. We can\'t wait to celebrate our love with you on the beach.',
      imageUrls: ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Beach Ceremony', time: '2026-05-28T16:30', description: 'Followed by a seafood dinner reception.' }]
    }
  },
  { 
    id: '13', type: 'wedding', theme: 'boho', title: 'Boho Chic', desc: 'Earthy, warm, and relaxed.', color: 'bg-[#fdfbf7]',
    demoData: {
      eventType: 'wedding', theme: 'boho',
      primaryName: 'Willow', secondaryName: 'Rowan',
      date: '2026-08-14T15:00', venue: 'The Desert Oasis, Joshua Tree',
      introGreeting: 'Celebrate the union of',
      story: 'Under the open sky and surrounded by nature, we are exchanging our vows. Join us for a weekend of love, music, and desert magic.',
      imageUrls: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Ceremony & Festival', time: '2026-08-14T15:00', description: 'Vows at 3 PM, followed by live music and food trucks.' }]
    }
  },
  { 
    id: '14', type: 'company_party', theme: 'artdeco', title: 'Gatsby Gala', desc: 'Geometric, gold, and luxurious.', color: 'bg-[#1a1a1a]',
    demoData: {
      eventType: 'company_party', theme: 'artdeco',
      primaryName: 'Sterling', secondaryName: 'Co.',
      date: '2026-12-31T20:00', venue: 'The Grand Ballroom',
      introGreeting: 'You are invited to the',
      story: 'Step back into the roaring twenties for an evening of opulence and celebration as we ring in the new year.',
      imageUrls: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'New Year\'s Eve Gala', time: '2026-12-31T20:00', description: 'Black tie required. Champagne toast at midnight.' }]
    }
  },
  { 
    id: '15', type: 'baby_shower', theme: 'watercolor', title: 'Pastel Dreams', desc: 'Soft, artistic, and pastel.', color: 'bg-gradient-to-br from-blue-50 to-pink-50',
    demoData: {
      eventType: 'baby_shower', theme: 'watercolor',
      primaryName: 'Baby', secondaryName: 'Smith',
      date: '2026-03-10T13:00', venue: 'The Botanical Gardens',
      introGreeting: 'Join us to shower',
      story: 'We are overjoyed to welcome our little one soon! Please join us for a lovely afternoon of tea, treats, and celebration.',
      imageUrls: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Baby Shower', time: '2026-03-10T13:00', description: 'Afternoon tea and games.' }]
    }
  },
  { 
    id: '16', type: 'wedding', theme: 'rustic', title: 'Rustic Charm', desc: 'Woodsy, warm, and country.', color: 'bg-[#f4f1ea]',
    demoData: {
      eventType: 'wedding', theme: 'rustic',
      primaryName: 'Harper', secondaryName: 'Mason',
      date: '2026-10-22T16:00', venue: 'Whispering Pines Barn',
      introGreeting: 'Together with their families',
      story: 'We\'re getting hitched! Join us for a rustic celebration filled with love, laughter, and a whole lot of dancing.',
      imageUrls: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Barn Wedding', time: '2026-10-22T16:00', description: 'Ceremony outdoors, reception inside the barn.' }]
    }
  },
  { 
    id: '17', type: 'engagement', theme: 'gothic', title: 'Dark Romance', desc: 'Dark, romantic, and moody.', color: 'bg-black',
    demoData: {
      eventType: 'engagement', theme: 'gothic',
      primaryName: 'Raven', secondaryName: 'Lucius',
      date: '2026-10-31T19:00', venue: 'The Old Manor',
      introGreeting: 'Join us for an evening of',
      story: 'A love written in the stars. We invite you to celebrate our engagement on All Hallows\' Eve.',
      imageUrls: ['https://images.unsplash.com/photo-1505934333218-8fe21ff87e69?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Engagement Soirée', time: '2026-10-31T19:00', description: 'Cocktails and dark elegance.' }]
    }
  },
  { 
    id: '18', type: 'birthday', theme: 'tropical', title: 'Tropical Vibes', desc: 'Bright, leafy, and vibrant.', color: 'bg-emerald-50',
    demoData: {
      eventType: 'birthday', theme: 'tropical',
      primaryName: 'Leo', secondaryName: '',
      date: '2026-07-15T14:00', venue: 'The Tiki Lounge',
      introGreeting: 'Get ready to luau for',
      story: 'Leo is turning 30! Grab your favorite Hawaiian shirt and join us for a tropical bash with fruity drinks and good vibes.',
      imageUrls: ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Leo\'s 30th Luau', time: '2026-07-15T14:00', description: 'Pool party and BBQ.' }]
    }
  },
  { 
    id: '19', type: 'wedding', theme: 'fairytale', title: 'Enchanted Forest', desc: 'Magical, soft, and enchanting.', color: 'bg-indigo-50',
    demoData: {
      eventType: 'wedding', theme: 'fairytale',
      primaryName: 'Aurora', secondaryName: 'Phillip',
      date: '2026-05-10T15:00', venue: 'The Enchanted Gardens',
      introGreeting: 'Once upon a time...',
      story: 'Our fairytale is just beginning. We request the honor of your presence as we say "I do" surrounded by magic and nature.',
      imageUrls: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'The Royal Wedding', time: '2026-05-10T15:00', description: 'A magical ceremony followed by a grand ball.' }]
    }
  },
  { 
    id: '20', type: 'birthday', theme: 'retro', title: 'Retro Roller', desc: '70s/80s vibe, funky colors.', color: 'bg-[#fdf6e3]',
    demoData: {
      eventType: 'birthday', theme: 'retro',
      primaryName: 'Max', secondaryName: '',
      date: '2026-08-20T18:00', venue: 'Starlight Roller Rink',
      introGreeting: 'Let\'s groove tonight for',
      story: 'Dust off your skates and neon leg warmers! We are celebrating Max\'s birthday with a totally tubular roller disco.',
      imageUrls: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop'],
      events: [{ name: 'Roller Disco Party', time: '2026-08-20T18:00', description: 'Skating, pizza, and arcade games.' }]
    }
  }
];
