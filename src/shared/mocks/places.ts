import type { Place } from "@/entities/place";

export const MOCK_PLACES: Place[] = [
  // FOOD
  {
    id: "1",
    name_en: "Gwangjang Market",
    name_ko: "광장시장",
    category: "FOOD",
    city: "SEOUL",
    description:
      "One of Seoul's oldest and largest traditional markets, famous for bindaetteok, mayak gimbap, and knife-cut noodles.",
    description_long:
      "One of Seoul's oldest and largest traditional markets, dating back to 1905. Famous for bindaetteok (mung bean pancakes), mayak gimbap (addictive mini rice rolls), and fresh knife-cut noodles. Come hungry — this is where locals eat. The night market section is especially lively on weekends.",
    images: [],
    latitude: 37.57,
    longitude: 126.999,
    address_en: "88 Changgyeonggung-ro, Jongno-gu, Seoul",
    address_ko: "서울 종로구 창경궁로 88",
    operating_hours: "9:00 AM - 11:00 PM",
    closed_days: "Sundays",
    nearest_station: "Jongno 5-ga (Line 1)",
    walk_minutes: 2,
    budget_min: 5000,
    budget_max: 15000,
    dokkaebi_tip:
      "Try the mayak gimbap first — you'll see why they call it addictive. Pro tip: the stalls in the back alleys are where locals go.",
    google_maps_url: "https://maps.google.com/?q=Gwangjang+Market+Seoul",
    tags: ["street-food", "traditional", "budget", "market"],
    rating: 4.5,
    weight: 1.0,
    source: "MANUAL",
  },
  {
    id: "2",
    name_en: "Tosokchon Samgyetang",
    name_ko: "토속촌삼계탕",
    category: "FOOD",
    city: "SEOUL",
    description:
      "Iconic restaurant near Gyeongbokgung, famous for ginseng chicken soup served in a bubbling stone pot.",
    description_long:
      "A Seoul institution near Gyeongbokgung Palace, Tosokchon has been serving its legendary samgyetang (ginseng chicken soup) since 1983. The whole young chicken is stuffed with glutinous rice, jujubes, and ginseng, then slow-cooked until fall-off-the-bone tender. Expect a queue during lunch — it's worth the wait.",
    images: [],
    latitude: 37.5759,
    longitude: 126.9717,
    address_en: "5 Jahamun-ro 5-gil, Jongno-gu, Seoul",
    address_ko: "서울 종로구 자하문로5길 5",
    operating_hours: "10:00 AM - 10:00 PM",
    nearest_station: "Gyeongbokgung (Line 3)",
    walk_minutes: 5,
    budget_min: 16000,
    budget_max: 22000,
    dokkaebi_tip:
      "Go right when they open at 10 AM to skip the line. Add the extra ginseng liquor on the side — trust the Dokkaebi on this one.",
    google_maps_url: "https://maps.google.com/?q=Tosokchon+Samgyetang+Seoul",
    tags: ["korean-bbq", "traditional", "must-try", "historic"],
    rating: 4.3,
    weight: 1.0,
    source: "MANUAL",
  },

  // ATTRACTION
  {
    id: "3",
    name_en: "Bukchon Hanok Village",
    name_ko: "북촌한옥마을",
    category: "ATTRACTION",
    city: "SEOUL",
    description:
      "A charming neighborhood of traditional Korean hanok houses between Gyeongbokgung and Changdeokgung palaces.",
    description_long:
      "Nestled between two grand palaces, Bukchon is a living neighborhood of over 900 traditional Korean hanok houses. Wander the narrow alleys of Gahoe-dong for the most iconic views. Best visited early morning before the crowds arrive. The rooftop cafes overlooking the tiled roofs are a hidden gem.",
    images: [],
    latitude: 37.5826,
    longitude: 126.9831,
    address_en: "37 Gyedong-gil, Jongno-gu, Seoul",
    address_ko: "서울 종로구 계동길 37",
    operating_hours: "Open 24 hours (outdoor area)",
    nearest_station: "Anguk (Line 3)",
    walk_minutes: 3,
    dokkaebi_tip:
      "Skip the main street — turn into the tiny alleys near Gahoe-dong 31. That's where the real magic is. And keep it quiet, people live here!",
    google_maps_url:
      "https://maps.google.com/?q=Bukchon+Hanok+Village+Seoul",
    tags: ["historic", "photo-spot", "culture", "free"],
    rating: 4.4,
    weight: 1.0,
    source: "MANUAL",
  },
  {
    id: "4",
    name_en: "Namsan Seoul Tower",
    name_ko: "남산서울타워",
    category: "ATTRACTION",
    city: "SEOUL",
    description:
      "Seoul's iconic landmark tower on Namsan Mountain, offering panoramic city views and the famous love lock fence.",
    description_long:
      "Standing at 236 meters atop Namsan Mountain, N Seoul Tower is the city's most recognizable landmark. Take the cable car or hike the scenic trail through the forest. The observation deck offers 360-degree views of the entire Seoul skyline. The love lock fence at the base is a must-see for couples.",
    images: [],
    latitude: 37.5512,
    longitude: 126.9882,
    address_en: "105 Namsangongwon-gil, Yongsan-gu, Seoul",
    address_ko: "서울 용산구 남산공원길 105",
    operating_hours: "10:00 AM - 11:00 PM",
    nearest_station: "Myeongdong (Line 4)",
    walk_minutes: 15,
    budget_min: 16000,
    budget_max: 16000,
    dokkaebi_tip:
      "Take the hiking trail from Myeongdong instead of the cable car — it's only 30 minutes and way more scenic. Go at sunset for the best views.",
    google_maps_url: "https://maps.google.com/?q=N+Seoul+Tower",
    tags: ["landmark", "views", "romantic", "instagram"],
    rating: 4.2,
    weight: 1.0,
    source: "MANUAL",
  },

  // SHOPPING
  {
    id: "5",
    name_en: "Hongdae Free Market",
    name_ko: "홍대 프리마켓",
    category: "SHOPPING",
    city: "SEOUL",
    description:
      "A vibrant weekend flea market in Hongdae where young artists sell handmade goods, art, and unique finds.",
    description_long:
      "Every Saturday in Hongdae's playground park, local artists and designers set up stalls selling handmade jewelry, illustrations, pottery, and one-of-a-kind accessories. It's the perfect place to find unique souvenirs you won't see anywhere else. The surrounding streets are filled with buskers, street performers, and indie shops.",
    images: [],
    latitude: 37.5563,
    longitude: 126.9236,
    address_en: "Wausan-ro 21-gil, Mapo-gu, Seoul",
    address_ko: "서울 마포구 와우산로21길",
    operating_hours: "1:00 PM - 6:00 PM (Saturdays only)",
    closed_days: "Sunday - Friday",
    nearest_station: "Hongik University (Line 2)",
    walk_minutes: 5,
    budget_min: 5000,
    budget_max: 30000,
    dokkaebi_tip:
      "The best stuff sells out by 3 PM. Get there early and bring cash — most artists don't take cards. Check the alleys behind the park for hidden vintage shops.",
    google_maps_url: "https://maps.google.com/?q=Hongdae+Free+Market+Seoul",
    tags: ["handmade", "art", "unique", "weekend-only"],
    rating: 4.1,
    weight: 1.0,
    source: "MANUAL",
  },
  {
    id: "6",
    name_en: "Myeongdong Shopping Street",
    name_ko: "명동쇼핑거리",
    category: "SHOPPING",
    city: "SEOUL",
    description:
      "Seoul's busiest shopping district with K-beauty stores, fashion brands, and amazing street food stalls.",
    description_long:
      "Myeongdong is Seoul's retail heart — a neon-lit paradise packed with K-beauty flagship stores, Korean fashion brands, and international labels. The real stars are the street food stalls lining every corner: try the tornado potato, egg bread, and hotteok. Most stores offer tax-free shopping for tourists.",
    images: [],
    latitude: 37.5636,
    longitude: 126.9827,
    address_en: "Myeongdong-gil, Jung-gu, Seoul",
    address_ko: "서울 중구 명동길",
    operating_hours: "10:30 AM - 10:00 PM",
    nearest_station: "Myeongdong (Line 4)",
    walk_minutes: 1,
    budget_min: 10000,
    budget_max: 100000,
    dokkaebi_tip:
      "Don't buy K-beauty at the first store you see — prices vary wildly. And the street food is best after 5 PM when all the stalls are open. Ask for tax refund!",
    google_maps_url:
      "https://maps.google.com/?q=Myeongdong+Shopping+Street+Seoul",
    tags: ["k-beauty", "fashion", "street-food", "tax-free"],
    rating: 4.0,
    weight: 1.0,
    source: "MANUAL",
  },
];
