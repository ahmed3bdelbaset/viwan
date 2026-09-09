import { Project, InsightArticle, CompanyInfo, ServiceItem, AdminUser, ExpertiseSector } from '../admin-types';

export const INITIAL_PROJECTS: Project[] = [
  {
    "id": "prj-private-residence-01",
    "code": "PRJ-2026-01",
    "slug": "private-residence-01",
    "index": "01",
    "name": "Private Residence 01",
    "nameAr": "إقامة خاصة 01",
    "title": "Private Residence 01",
    "title_en": "Private Residence 01",
    "title_ar": "إقامة خاصة 01",
    "location": "New Cairo",
    "location_en": "New Cairo, Egypt",
    "location_ar": "القاهرة الجديدة، مصر",
    "country": "Egypt",
    "country_en": "Egypt",
    "country_ar": "مصر",
    "client_en": "Private VIP Client",
    "client_ar": "عميل خاص",
    "year": 2026,
    "area_sqm": "1,850 m²",
    "type": "Private Residence",
    "category": "Private Residence",
    "sector_en": "Residential",
    "sector_ar": "القطاع السكني",
    "disciplines": [
      "Architecture",
      "Interior Design",
      "Landscape"
    ],
    "services_en": [
      "Architecture",
      "Interior Design",
      "Landscape"
    ],
    "services_ar": [
      "الاستشارات المعمارية",
      "التصميم الداخلي",
      "تصميم اللاندسكيب"
    ],
    "scope": [
      "Architecture Design",
      "Interior Design",
      "Landscape Design",
      "Technical Documentation",
      "Engineering Coordination"
    ],
    "tagline": "A home in harmony with its surroundings.",
    "subtitle_en": "A home in harmony with its surroundings.",
    "subtitle_ar": "منزل متناغم مع محيطه الطبيعي ويوفر ملاذاً هادئاً.",
    "heading": "A refined balance of architecture and nature.",
    "headingAr": "توازن دقيق بين روعة العمارة وجمال الطبيعة.",
    "description": "This private residence was designed as a serene retreat where modern architecture meets a warm, timeless atmosphere. The design embraces open spaces, natural materials and a strong connection to the outdoors, creating a home that feels both elegant and personal. Travertine volumes are layered with vertical wood screens and expansive glazing, allowing the garden and pool to become part of daily life inside the house.",
    "descriptionAr": "صُممت هذه الإقامة الخاصة كملاذ هادئ حيث تلتقي العمارة الحديثة بالأجواء الدافئة الخالدة. يتبنى التصميم الفراغات المفتوحة والمواد الطبيعية والاتصال القوي بالطبيعة الخارجية، مع كتل الترافيرتين وشاشات الخشب الرأسية والواجهات الزجاجية الممتدة.",
    "details_en": "This private residence was designed as a serene retreat where modern architecture meets a warm, timeless atmosphere.",
    "details_ar": "صُممت هذه الإقامة الخاصة كملاذ هادئ يجمع بين العمارة الحديثة والدفء الكلاسيكي.",
    "philosophy": "A dialogue between modern living and natural serenity, where every space is intentionally crafted to enhance the way people live.",
    "vision_en": "A dialogue between modern living and natural serenity, where every space is intentionally crafted to enhance the way people live.",
    "vision_ar": "حوار هندسي بين متطلبات المعيشة العصرية والسكينة الطبيعية، حيث تم تصميم كل فراغ بعناية لتعزيز جودة الحياة اليومية.",
    "cover": "/images/project-private-residence.png",
    "cover_image": "/images/project-private-residence.png",
    "coverImage": "/images/project-private-residence.png",
    "interior": "/images/interior-living-marble.jpg",
    "cinematic": "/images/hero-villa.png",
    "featured": true,
    "is_featured": true,
    "status": "completed",
    "publish_status": "Featured",
    "lat": 30.0131,
    "lng": 31.4913,
    "display_order": 1,
    "lifecycle_stage": "handover",
    "gallery": [
      {
        "src": "/images/project-private-residence.png",
        "caption": "Exterior View",
        "category": "Architecture"
      },
      {
        "src": "/images/interior-living-marble.jpg",
        "caption": "Living Area",
        "category": "Interiors"
      },
      {
        "src": "/images/interior-dining.png",
        "caption": "Dining Area",
        "category": "Interiors"
      },
      {
        "src": "/images/interior-bedroom.png",
        "caption": "Master Bedroom",
        "category": "Interiors"
      },
      {
        "src": "/images/detail-courtyard.png",
        "caption": "Courtyard",
        "category": "Landscape"
      },
      {
        "src": "/images/material-stone.png",
        "caption": "Travertine Detail",
        "category": "Details"
      }
    ],
    "gallery_images": [
      "/images/project-private-residence.png",
      "/images/interior-living-marble.jpg",
      "/images/interior-dining.png",
      "/images/interior-bedroom.png",
      "/images/detail-courtyard.png",
      "/images/material-stone.png"
    ]
  },
  {
    "id": "prj-lake-house",
    "code": "PRJ-2025-02",
    "slug": "lake-house",
    "index": "02",
    "name": "Lake House",
    "nameAr": "منزل البحيرة",
    "title": "Lake House",
    "title_en": "Lake House",
    "title_ar": "منزل البحيرة",
    "location": "Ain Sokhna",
    "location_en": "Ain Sokhna, Egypt",
    "location_ar": "العين السخنة، مصر",
    "country": "Egypt",
    "country_en": "Egypt",
    "country_ar": "مصر",
    "client_en": "Private Owner",
    "client_ar": "مالك خاص",
    "year": 2025,
    "area_sqm": "1,200 m²",
    "type": "Private Residence",
    "category": "Private Residence",
    "sector_en": "Residential",
    "sector_ar": "القطاع السكني",
    "disciplines": [
      "Architecture",
      "Landscape"
    ],
    "services_en": [
      "Architecture",
      "Landscape"
    ],
    "services_ar": [
      "الاستشارات المعمارية",
      "تصميم اللاندسكيب"
    ],
    "scope": [
      "Architecture Design",
      "Landscape Design",
      "Technical Documentation"
    ],
    "tagline": "Rooted in the landscape. Designed for a slower, richer life.",
    "subtitle_en": "Rooted in the landscape. Designed for a slower, richer life.",
    "subtitle_ar": "متجذر في تضاريس الموقع، ومصمم لحياة أكثر عمقاً وهدوءاً.",
    "heading": "A quiet structure resting on water.",
    "headingAr": "كتلة معمارية هادئة تستقر فوق سطح الماء.",
    "description": "The Lake House is a low, horizontal composition that extends over calm water on a timber deck. A cantilevered roof shelters the living spaces while travertine walls anchor the house to its site. Reeds, olive trees and native planting soften the edge between architecture and landscape, so the building appears to have always belonged there.",
    "descriptionAr": "تكوين أفقي منخفض يمتد فوق سطح الماء الهادئ عبر منصات خشبية متدرجة وسقف كابولي يحمي المساحات المعيشية وجدران الترافيرتين الراسية.",
    "details_en": "The Lake House is a low, horizontal composition that extends over calm water on a timber deck.",
    "details_ar": "تكوين أفقي منخفض يمتد فوق سطح الماء عبر منصات خشبية متدرجة.",
    "philosophy": "Architecture lives longer when it belongs.",
    "vision_en": "Architecture lives longer when it belongs.",
    "vision_ar": "تدوم العمارة طويلاً حين تنتمي بتناغم تام إلى بيئتها وطبيعتها.",
    "cover": "/images/project-lake-house.png",
    "cover_image": "/images/project-lake-house.png",
    "coverImage": "/images/project-lake-house.png",
    "interior": "/images/interior-living-fireplace.jpg",
    "cinematic": "/images/project-lake-house.png",
    "featured": false,
    "is_featured": false,
    "status": "completed",
    "publish_status": "Published",
    "lat": 29.6,
    "lng": 32.3167,
    "display_order": 2,
    "lifecycle_stage": "handover",
    "gallery": [
      {
        "src": "/images/project-lake-house.png",
        "caption": "Exterior at Dawn",
        "category": "Architecture"
      },
      {
        "src": "/images/interior-living-fireplace.jpg",
        "caption": "Living Area",
        "category": "Interiors"
      },
      {
        "src": "/images/project-hillside-villa.png",
        "caption": "Terraces",
        "category": "Landscape"
      },
      {
        "src": "/images/material-wood.png",
        "caption": "Timber Cladding",
        "category": "Details"
      }
    ],
    "gallery_images": [
      "/images/project-lake-house.png",
      "/images/interior-living-fireplace.jpg",
      "/images/project-hillside-villa.png",
      "/images/material-wood.png"
    ]
  },
  {
    "id": "prj-the-urban-retreat",
    "code": "PRJ-2025-03",
    "slug": "the-urban-retreat",
    "index": "03",
    "name": "The Urban Retreat",
    "nameAr": "الملاذ الحضري",
    "title": "The Urban Retreat",
    "title_en": "The Urban Retreat",
    "title_ar": "الملاذ الحضري",
    "location": "Cairo",
    "location_en": "Cairo, Egypt",
    "location_ar": "القاهرة، مصر",
    "country": "Egypt",
    "country_en": "Egypt",
    "country_ar": "مصر",
    "client_en": "Private Collector",
    "client_ar": "عميل خاص",
    "year": 2025,
    "area_sqm": "650 m²",
    "type": "Apartment",
    "category": "Apartment",
    "sector_en": "Interior Architecture",
    "sector_ar": "العمارة الداخلية",
    "disciplines": [
      "Interior Design"
    ],
    "services_en": [
      "Interior Design"
    ],
    "services_ar": [
      "التصميم الداخلي والديكور"
    ],
    "scope": [
      "Interior Design",
      "FF&E",
      "Lighting Design",
      "Styling"
    ],
    "tagline": "A refined urban sanctuary that balances warmth, materiality and modern living.",
    "subtitle_en": "A refined urban sanctuary that balances warmth, materiality and modern living.",
    "subtitle_ar": "ملاذ حضري فاخر يوازن بين الدفء والمواد النبيلة والحياة العصرية.",
    "heading": "Calm, material and deeply personal.",
    "headingAr": "هدوء وأناقة ومواد تعبر عن الخصوصية العميقة.",
    "description": "A complete interior transformation of a city apartment into a warm, layered retreat. Dark walnut panelling, travertine surfaces and a linear fireplace create a sense of stillness, while carefully controlled lighting shapes the mood from morning to night. Every piece of furniture and every finish was selected to feel timeless rather than fashionable.",
    "descriptionAr": "تحول داخلي شامل لشقة في قلب المدينة إلى ملاذ دافئ من خشب الجوز والترافيرتين الطبيعي والمدفأة الخطية مع إضاءة مدروسة بعناية.",
    "details_en": "A complete interior transformation of a city apartment into a warm, layered retreat.",
    "details_ar": "تحول داخلي شامل لشقة في قلب المدينة إلى ملاذ دافئ وهادئ.",
    "philosophy": "Spaces shaped by purpose, character and detail.",
    "vision_en": "Spaces shaped by purpose, character and detail.",
    "vision_ar": "فراغات معمارية تشكلها الغاية والخصوصية والدقة في أدق التفاصيل.",
    "cover": "/images/interior-living-fireplace.jpg",
    "cover_image": "/images/interior-living-fireplace.jpg",
    "coverImage": "/images/interior-living-fireplace.jpg",
    "interior": "/images/interior-dining.png",
    "cinematic": "/images/interior-living-fireplace.jpg",
    "featured": false,
    "is_featured": false,
    "status": "completed",
    "publish_status": "Published",
    "lat": 30.0444,
    "lng": 31.2357,
    "display_order": 3,
    "lifecycle_stage": "handover",
    "gallery": [
      {
        "src": "/images/interior-living-fireplace.jpg",
        "caption": "Living Area",
        "category": "Interiors"
      },
      {
        "src": "/images/interior-dining.png",
        "caption": "Dining",
        "category": "Interiors"
      },
      {
        "src": "/images/interior-bedroom.png",
        "caption": "Bedroom",
        "category": "Interiors"
      },
      {
        "src": "/images/material-fabric.png",
        "caption": "Textiles",
        "category": "Details"
      },
      {
        "src": "/images/material-metal.png",
        "caption": "Bronze & Stone",
        "category": "Details"
      }
    ],
    "gallery_images": [
      "/images/interior-living-fireplace.jpg",
      "/images/interior-dining.png",
      "/images/interior-bedroom.png",
      "/images/material-fabric.png",
      "/images/material-metal.png"
    ]
  },
  {
    "id": "prj-hillside-villa",
    "code": "PRJ-2026-04",
    "slug": "hillside-villa",
    "index": "04",
    "name": "Hillside Villa",
    "nameAr": "فيلا المنحدر الجبلي",
    "title": "Hillside Villa",
    "title_en": "Hillside Villa",
    "title_ar": "فيلا المنحدر الجبلي",
    "location": "Ain Sokhna",
    "location_en": "Ain Sokhna, Egypt",
    "location_ar": "العين السخنة، مصر",
    "country": "Egypt",
    "country_en": "Egypt",
    "country_ar": "مصر",
    "client_en": "Real Estate Developer",
    "client_ar": "مطور عقاري",
    "year": 2026,
    "area_sqm": "2,400 m²",
    "type": "Private Villa",
    "category": "Private Villa",
    "sector_en": "Residential",
    "sector_ar": "القطاع السكني",
    "disciplines": [
      "Architecture",
      "Landscape",
      "Engineering"
    ],
    "services_en": [
      "Architecture",
      "Landscape",
      "Engineering"
    ],
    "services_ar": [
      "الاستشارات المعمارية",
      "تصميم اللاندسكيب",
      "الهندسة الإنشائية والتنسيق"
    ],
    "scope": [
      "Architecture Design",
      "Landscape Design",
      "Structural Coordination",
      "BIM"
    ],
    "tagline": "Rooted in the landscape.",
    "subtitle_en": "Rooted in the landscape.",
    "subtitle_ar": "منحوتة في تضاريس الموقع ومطلة على زرقة البحر.",
    "heading": "Built into the slope, open to the sea.",
    "headingAr": "منحوتة في تضاريس الجبل، ومفتوحة على زرقة البحر.",
    "description": "Set into a steep coastal site, the villa steps down the hillside in a series of stone terraces. Wide external stairs move through native planting toward the sea, and each level opens onto its own shaded outdoor room. Structural and MEP coordination through BIM allowed the complex terracing to be resolved precisely before construction began.",
    "descriptionAr": "فيلا مدرجة على منحدر ساحلي عبر مصاطب حجرية وأدراج واسعة وسط نباتات المنطقة نحو البحر، منسقة بدقة عبر نمذجة الـ BIM الهندسية.",
    "details_en": "Set into a steep coastal site, the villa steps down the hillside in a series of stone terraces.",
    "details_ar": "فيلا ساحلية متدرجة عبر مصاطب حجرية وأدراج واسعة.",
    "philosophy": "Nature. Architecture. People.",
    "vision_en": "Nature. Architecture. People.",
    "vision_ar": "الطبيعة. العمارة. الإنسان.",
    "cover": "/images/project-hillside-villa.png",
    "cover_image": "/images/project-hillside-villa.png",
    "coverImage": "/images/project-hillside-villa.png",
    "interior": "/images/interior-bedroom.png",
    "cinematic": "/images/project-hillside-villa.png",
    "featured": false,
    "is_featured": false,
    "status": "ongoing",
    "publish_status": "Published",
    "lat": 29.58,
    "lng": 32.33,
    "display_order": 4,
    "lifecycle_stage": "supervision",
    "gallery": [
      {
        "src": "/images/project-hillside-villa.png",
        "caption": "Approach",
        "category": "Landscape"
      },
      {
        "src": "/images/interior-bedroom.png",
        "caption": "Master Suite",
        "category": "Interiors"
      },
      {
        "src": "/images/detail-courtyard.png",
        "caption": "Stone Courtyard",
        "category": "Architecture"
      },
      {
        "src": "/images/material-stone.png",
        "caption": "Stone Detail",
        "category": "Details"
      }
    ],
    "gallery_images": [
      "/images/project-hillside-villa.png",
      "/images/interior-bedroom.png",
      "/images/detail-courtyard.png",
      "/images/material-stone.png"
    ]
  },
  {
    "id": "prj-commercial-project-03",
    "code": "PRJ-2025-05",
    "slug": "commercial-project-03",
    "index": "05",
    "name": "Urban Commercial Hub",
    "nameAr": "المركز التجاري الحضري",
    "title": "Urban Commercial Hub",
    "title_en": "Urban Commercial Hub",
    "title_ar": "المركز التجاري الحضري",
    "location": "Riyadh",
    "location_en": "Riyadh, KSA",
    "location_ar": "الرياض، المملكة العربية السعودية",
    "country": "KSA",
    "country_en": "KSA",
    "country_ar": "السعودية",
    "client_en": "Riyadh Holdings Group",
    "client_ar": "مجموعة الرياض القابضة",
    "year": 2025,
    "area_sqm": "18,500 m²",
    "type": "Commercial",
    "category": "Commercial",
    "sector_en": "Commercial",
    "sector_ar": "تجاري وإداري",
    "disciplines": [
      "Architecture",
      "Interior Design",
      "Engineering"
    ],
    "services_en": [
      "Architecture",
      "Interior Design",
      "Engineering"
    ],
    "services_ar": [
      "الاستشارات المعمارية",
      "التصميم الداخلي",
      "التنسيق الكهروميكانيكي"
    ],
    "scope": [
      "Architecture Design",
      "Interior Design",
      "Technical Documentation",
      "MEP Coordination"
    ],
    "tagline": "A civic presence in limestone and bronze.",
    "subtitle_en": "A civic presence in limestone and bronze.",
    "subtitle_ar": "حضور عمراني رائد بالحجر الجيري والبرونز في قلب الرياض.",
    "heading": "Precision at an urban scale.",
    "headingAr": "دقة هندسية وصرح عمراني رائد.",
    "description": "A mixed-use commercial building on a prominent Riyadh plaza. Deep recessed windows and bronze vertical fins control the harsh desert light while giving the limestone façade rhythm and depth. Full technical documentation and MEP coordination were delivered alongside the design, ensuring a seamless transition from concept to construction.",
    "descriptionAr": "مبنى تجاري متعدد الاستخدامات في ساحة بارزة بالرياض، يتميز بنوافذ عميقة وكواسر شمسية برونزية وتكسيات حجرية متطورة مع تنسيق MEP كامل.",
    "details_en": "A mixed-use commercial building on a prominent Riyadh plaza.",
    "details_ar": "مبنى تجاري متعدد الاستخدامات في ساحة بارزة بالرياض.",
    "philosophy": "Design is not decoration. It is how space works, feels and lasts.",
    "vision_en": "Design is not decoration. It is how space works, feels and lasts.",
    "vision_ar": "التصميم ليس مجرد زخرفة، بل هو كيف يعمل الفراغ، وكيف يبدو شعوره، وكيف يدوم للأجيال.",
    "cover": "/images/project-commercial-riyadh.png",
    "cover_image": "/images/project-commercial-riyadh.png",
    "coverImage": "/images/project-commercial-riyadh.png",
    "interior": "/images/project-executive-office.png",
    "cinematic": "/images/project-commercial-riyadh.png",
    "featured": false,
    "is_featured": false,
    "status": "completed",
    "publish_status": "Published",
    "lat": 24.7136,
    "lng": 46.6753,
    "display_order": 5,
    "lifecycle_stage": "handover",
    "gallery": [
      {
        "src": "/images/project-commercial-riyadh.png",
        "caption": "Plaza Façade",
        "category": "Architecture"
      },
      {
        "src": "/images/project-executive-office.png",
        "caption": "Executive Office",
        "category": "Interiors"
      },
      {
        "src": "/images/material-metal.png",
        "caption": "Bronze Fins",
        "category": "Details"
      }
    ],
    "gallery_images": [
      "/images/project-commercial-riyadh.png",
      "/images/project-executive-office.png",
      "/images/material-metal.png"
    ]
  },
  {
    "id": "prj-private-majlis",
    "code": "PRJ-2024-06",
    "slug": "private-majlis",
    "index": "06",
    "name": "Private Majlis",
    "nameAr": "المجلس الخاص",
    "title": "Private Majlis",
    "title_en": "Private Majlis",
    "title_ar": "المجلس الخاص",
    "location": "Riyadh",
    "location_en": "Riyadh, KSA",
    "location_ar": "الرياض، المملكة العربية السعودية",
    "country": "KSA",
    "country_en": "KSA",
    "country_ar": "السعودية",
    "client_en": "Royal Family Office",
    "client_ar": "مكتب عائلي مرموق",
    "year": 2024,
    "area_sqm": "480 m²",
    "type": "Luxury Living",
    "category": "Luxury Living",
    "sector_en": "Hospitality & Heritage",
    "sector_ar": "ضيافة وأصالة",
    "disciplines": [
      "Interior Design"
    ],
    "services_en": [
      "Interior Design"
    ],
    "services_ar": [
      "التصميم الداخلي الفاخر"
    ],
    "scope": [
      "Interior Design",
      "Bespoke Furniture",
      "Lighting Design"
    ],
    "tagline": "Sophisticated spaces rooted in tradition, expressed with contemporary elegance.",
    "subtitle_en": "Sophisticated spaces rooted in tradition, expressed with contemporary elegance.",
    "subtitle_ar": "فضاءات راقية متجذرة في التراث ومعبر عنها بأناقة معاصرة.",
    "heading": "Tradition, reinterpreted.",
    "headingAr": "أصالة التراث برؤية معمارية معاصرة.",
    "description": "A private majlis that honours the ritual of gathering. Backlit geometric screens in carved wood wrap the room, low seating follows the perimeter, and a single brass pendant marks the centre. Contemporary in its restraint, traditional in its generosity.",
    "descriptionAr": "مجلس خاص يحتفي بتقاليد الضيافة الأصيلة، بقواطع خشبية هندسية مضيئة وجلسات محيطية وثريا نحاسية أيقونية.",
    "details_en": "A private majlis that honours the ritual of gathering.",
    "details_ar": "مجلس خاص يحتفي بتقاليد الضيافة الأصيلة.",
    "philosophy": "Every detail contributes to a more meaningful way of living.",
    "vision_en": "Every detail contributes to a more meaningful way of living.",
    "vision_ar": "كل تفصيلة معمارية تساهم في إثراء التجربة الإنسانية والعيش الراقي.",
    "cover": "/images/project-majlis.png",
    "cover_image": "/images/project-majlis.png",
    "coverImage": "/images/project-majlis.png",
    "interior": "/images/project-majlis.png",
    "cinematic": "/images/project-majlis.png",
    "featured": false,
    "is_featured": false,
    "status": "completed",
    "publish_status": "Published",
    "lat": 24.7677,
    "lng": 46.6384,
    "display_order": 6,
    "lifecycle_stage": "handover",
    "gallery": [
      {
        "src": "/images/project-majlis.png",
        "caption": "Majlis",
        "category": "Interiors"
      },
      {
        "src": "/images/material-wood.png",
        "caption": "Carved Screens",
        "category": "Details"
      },
      {
        "src": "/images/material-fabric.png",
        "caption": "Upholstery",
        "category": "Details"
      }
    ],
    "gallery_images": [
      "/images/project-majlis.png",
      "/images/material-wood.png",
      "/images/material-fabric.png"
    ]
  }
];

export const INITIAL_INSIGHTS: InsightArticle[] = [
  {
    id: 'ins-1',
    slug: 'future-of-passive-cooling-arid-climates',
    title_en: 'The Future of Passive Cooling in Arid Climates: A New Paradigm.',
    title_ar: 'مستقبل التبريد السلبي في المناخات الجافة: نموذج معماري جديد.',
    category_en: 'Sustainability',
    category_ar: 'الاستدامة',
    category_slug: 'sustainability',
    date: 'Oct 12, 2024',
    author_en: 'Dr. Tarek Mansour, Lead Sustainability Specialist',
    author_ar: 'د. طارق منصور — كبير أخصائيي الاستدامة',
    read_time_en: '6 min read',
    read_time_ar: 'قراءة في 6 دقائق',
    excerpt_en: 'As global temperatures rise, traditional approaches to HVAC are becoming increasingly unsustainable. This article explores innovative passive cooling strategies integrating historical vernacular techniques with computational wind modeling.',
    excerpt_ar: 'مع الارتفاع العالمي في درجات الحرارة، أصبحت أنظمة التكييف التقليدية عبئاً استهلاكياً كبيراً. يستكشف هذا المقال استراتيجيات التبريد السلبي المبتكرة التي تدمج بين الحلول التراثية والنمذجة الهوائية الرقمية.',
    content_en: `The built environment in arid regions faces an urgent thermodynamic challenge. For decades, modern architecture in the Gulf and Middle East relied on heavy mechanical refrigeration, treating building envelopes as mere static barriers rather than active microclimatic filters.

At VIWAN, our recent research in Riyadh and the Eastern Province demonstrates that re-interpreting traditional 'Malqaf' (wind catchers) and 'Mashrabiya' through generative parametric modeling can reduce cooling loads by up to 34% without sacrificing contemporary aesthetic standards.

By combining self-shading double skins with ground-coupled geothermal heat exchangers, we achieve thermal comfort through natural physics before a single kilowatt of mechanical cooling is deployed.`,
    content_ar: 'تواجه البيئة العمرانية في المناطق الجافة تحدياً ديناميكياً حرارياً حتمياً. لعقود طويلة، اعتمدت العمارة الحديثة في منطقة الخليج والشرق الأوسط على التبريد الميكانيكي الكثيف، معتبرة غلاف المبنى حاجزاً مصمتاً بدلاً من كونه غشاءً نشطاً يتفاعل مع المناخ المحيط.\n\nفي VIWAN، أثبتت أبحاثنا ومشاريعنا التطبيقية أن إعادة ابتكار ملاقف الهواء والمشربيات بالنمذجة البارامترية قادرة على خفض أحمال التبريد بأكثر من 34% مع المحافظة على أعلى معايير الجمالية المعمارية المعاصرة.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'ins-2',
    slug: 'rethinking-the-masterplan-flexibility-modern-metropolis',
    title_en: 'Rethinking the Masterplan: Flexibility in the Modern Metropolis.',
    title_ar: 'إعادة التفكير في المخططات العامة: المرونة في المدن الكبرى المعاصرة.',
    category_en: 'Urban Design',
    category_ar: 'التصميم الحضري',
    category_slug: 'urban-design',
    date: 'Sep 28, 2024',
    author_en: 'Sarah Al-Husseini, Urban Planning Director',
    author_ar: 'سارة الحسيني — مديرة التخطيط الحضري',
    read_time_en: '5 min read',
    read_time_ar: 'قراءة في 5 دقائق',
    excerpt_en: 'Rigid zoning is giving way to adaptable frameworks. We analyze how dynamic masterplanning can create more resilient and economically viable urban districts.',
    excerpt_ar: 'تتراجع أساليب التخطيط الجامدة لصالح أطر عمرانية مرنة. نحلل كيف يمكن للتخطيط الحضري الديناميكي خلق أحياء ومدن أكثر مرونة واستدامة اقتصادية.',
    content_en: 'Urban masterplans can no longer be static 20-year blueprints. As technological and demographic shifts accelerate, communities require resilient urban infrastructure capable of modular expansion and mixed-use evolution.',
    content_ar: 'لم تعد المخططات العامة مجرد مخططات ورقية جامدة لـ 20 عاماً، بل أصبحت تتطلب بنية تحتية مرنة قادرة على التكيف والنمو المعياري المتعدد الاستخدامات.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'ins-3',
    slug: 'ontology-of-stone-grounding-contemporary-forms',
    title_en: 'The Ontology of Stone: Grounding Contemporary Forms.',
    title_ar: 'أنطولوجيا الحجر: تجذير الأشكال المعاصرة في المواد الطبيعية.',
    category_en: 'Materiality',
    category_ar: 'المواد والتنفيذ',
    category_slug: 'materiality',
    date: 'Sep 15, 2024',
    author_en: 'Karim Nader, Senior Design Architect',
    author_ar: 'كريم نادر — معماري أول',
    read_time_en: '4 min read',
    read_time_ar: 'قراءة في 4 دقائق',
    excerpt_en: 'Exploring the timeless appeal of natural stone in modern architecture. How local sourcing and traditional detailing can anchor futuristic structures.',
    excerpt_ar: 'استكشاف الجاذبية الخالدة للحجر الطبيعي في العمارة الحديثة، وكيف يربط الحجر المحلي بين التشكيل المستقبلي والأصالة المكانية.',
    content_en: 'Stone is memory solidified. In an era of lightweight composites, the tactile weight and thermal mass of local limestone provides authenticity and contextual grounding that synthetic cladding cannot replicate.',
    content_ar: 'الحجر هو ذاكرة المكان المتجسدة. في عصر المواد المركبة الخفيفة، توفر الكتلة الحرارية وملمس الحجر المحلي عمقاً وأصالة حقيقية.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'ins-4',
    slug: 'parametric-optimization-structural-engineering',
    title_en: 'Parametric Optimization in Structural Engineering.',
    title_ar: 'التحسين البارامتري في الهندسة الإنشائية.',
    category_en: 'Technology',
    category_ar: 'التكنولوجيا والهندسة',
    category_slug: 'technology',
    date: 'Aug 30, 2024',
    author_en: 'Eng. Omar Farouk, Head of Structural Engineering',
    author_ar: 'م. عمر فاروق — رئيس قسم الهندسة الإنشائية',
    read_time_en: '7 min read',
    read_time_ar: 'قراءة في 7 دقائق',
    excerpt_en: 'How algorithmic design is reducing material waste and enabling previously impossible geometries. A deep dive into the integration of computational tools.',
    excerpt_ar: 'كيف يسهم التصميم الخوارزمي في تقليل الفاقد الإنشائي وتمكين هياكل هندسية معقدة بكفاءة عالية واقتصادية فائقة.',
    content_en: 'By pairing finite element analysis with genetic algorithms during the early concept phase, structural engineers and architects can co-optimize geometry for both structural efficiency and artistic elegance.',
    content_ar: 'من خلال ربط التحليل الإنشائي بالخوارزميات التوليدية في المراحل الأولى، نصل إلى أشكال معمارية مذهلة تحقق أعلى درجات المتانة والأمان بأقل استهلاك للمواد.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'ins-5',
    slug: 'revisiting-modernism-lessons-for-contemporary-practice',
    title_en: 'Revisiting Modernism: Lessons for Contemporary Practice.',
    title_ar: 'إعادة قراءة الحداثة المعمارية: دروس للممارسة المعاصرة.',
    category_en: 'Theory',
    category_ar: 'الفكر والنظرية',
    category_slug: 'theory',
    date: 'Aug 12, 2024',
    author_en: 'Arch. Laila Refaat, Architectural Theorist',
    author_ar: 'المعمارية ليلى رفعت — باحثة معمارية',
    read_time_en: '5 min read',
    read_time_ar: 'قراءة في 5 دقائق',
    excerpt_en: 'A critical analysis of early 20th-century ideals and their relevance—or irrelevance—to today’s complex environmental and social architectural challenges.',
    excerpt_ar: 'تحليل نقدي لمبادئ الحداثة المعمارية الأولى ومدى ملاءمتها لتحديات العصر البيئية والاجتماعية والتقنية المعقدة.',
    content_en: 'Modernism taught us the power of spatial liberation and honest materiality. Today, we build upon that foundation by infusing regional identity and bioclimatic intelligence.',
    content_ar: 'علمتنا الحداثة قوة التحرر المكاني وصدق التعبير عن المواد. اليوم، نبني على هذا الإرث عبر تعزيز الهوية الإقليمية والذكاء البيئي والمناخي.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    quote: {
      text_en: '"Architecture is the learned game, correct and magnificent, of forms assembled in the light."',
      text_ar: '"العمارة هي اللعبة المتقنة، الدقيقة والمهيبة، لتشكيل الكتل والظلال في الضوء."',
      author_en: 'Le Corbusier',
      author_ar: 'لو كوربوزييه'
    }
  }
];

export const INITIAL_COMPANY_INFO: CompanyInfo = {
  name_en: 'VIWAN',
  name_ar: 'VIWAN',
  tagline_en: 'Architecture Consultancy delivering intelligent, sustainable, and context-driven solutions from concept to real-world impact.',
  tagline_ar: 'استشارات معمارية متكاملة تقدم حلولاً ذكية ومستدامة من الفكرة الأولية حتى التنفيذ والتأثير الواقعي.',
  hero_title_en: 'ARCHITECTURE THAT DEFINES VALUE.',
  hero_title_ar: 'عمارة تصنع القيمة وترتقي بالمستقبل.',
  hero_subtitle_en: 'We are an Architecture Consultancy delivering intelligent, sustainable, and context-driven solutions from concept to real-world impact.',
  hero_subtitle_ar: 'بيت استشارات معمارية وهندسية يقدم حلولاً مدروسة وذكية تراعي الهوية المحلية وأعلى معايير الجودة والاستدامة.',
  about_summary_en: 'At VIWAN, we believe good architecture is not created by form alone. It begins with understanding people, place, purpose, budget, regulations, and long-term value. Our role is to help clients make better architectural decisions at every stage of the project.',
  about_summary_ar: 'في VIWAN، نؤمن أن العمارة المتميزة لا تتشكل بالكتلة وحدها، بل تبدأ بالفهم العميق للإنسان، والمكان، والهدف، والميزانية، والأنظمة، والقيمة طويلة المدى. دورنا هو قيادة العملاء لاتخاذ القرارات الهندسية والتصميمية الأفضل في كل مرحلة.',
  footer_summary_en: 'Architecture Consultancy delivering intelligent, sustainable, and context-driven solutions from concept to real-world impact.',
  footer_summary_ar: 'استشارات معمارية وهندسية رائدة تقدم حلولاً ذكية ومستدامة من الفكرة الأولية حتى التنفيذ والأثر الواقعي.',
  phones: [
    {
      id: 'p-1',
      label_en: 'Cairo Direct Line',
      label_ar: 'هاتف استوديو القاهرة',
      number: '+20 100 000 0000',
      is_whatsapp: false
    },
    {
      id: 'p-2',
      label_en: 'Riyadh Direct Line',
      label_ar: 'هاتف استوديو الرياض',
      number: '+966 11 234 5678',
      is_whatsapp: false
    },
    {
      id: 'p-3',
      label_en: 'Official WhatsApp Consultation',
      label_ar: 'واتساب الاستشارات المباشرة',
      number: '+20 12 3456 7890',
      is_whatsapp: true
    }
  ],
  emails: [
    {
      id: 'e-1',
      label_en: 'General Inquiries',
      label_ar: 'الاستفسارات العامة والتواصل',
      email: 'info@viwan.net'
    },
    {
      id: 'e-2',
      label_en: 'Architectural Consultations',
      label_ar: 'استشارة هندسية وحجوزات',
      email: 'info@viwan.net'
    },
    {
      id: 'e-3',
      label_en: 'Careers & Talent',
      label_ar: 'التوظيف وشؤون الكفاءات',
      email: 'info@viwan.net'
    }
  ],
  social: {
    facebook: 'https://facebook.com/viwan.architecture',
    instagram: 'https://instagram.com/viwan.studio',
    whatsapp: 'https://wa.me/201234567890',
    youtube: 'https://youtube.com/@viwan',
    linkedin: 'https://linkedin.com/company/viwan'
  },
  cairo_studio: {
    title_en: 'Cairo Studio',
    title_ar: 'استوديو القاهرة',
    address_en: '12 Design District, Zamalek, Cairo, Egypt',
    address_ar: '12 حي التصميم، الزمالك، القاهرة، مصر',
    postal_code: '11211',
    phone: '+20 12 3456 7890',
    email: 'studio@viwan.com',
    lat: 30.0617,
    lng: 31.2198
  },
  riyadh_studio: {
    title_en: 'Riyadh Studio',
    title_ar: 'استوديو الرياض',
    address_en: 'King Abdullah Financial District (KAFD), Riyadh, Saudi Arabia',
    address_ar: 'مركز الملك عبد الله المالي (KAFD)، الرياض، المملكة العربية السعودية',
    postal_code: '13512',
    phone: '+966 11 234 5678',
    email: 'riyadh@viwan.com',
    lat: 24.7677,
    lng: 46.6384
  },
  studios: [
    {
      id: 'studio-cairo',
      title_en: 'Cairo Main Studio',
      title_ar: 'استوديو القاهرة الرئيسي',
      address_en: '12 Design District, Zamalek, Cairo, Egypt',
      address_ar: '12 حي التصميم، الزمالك، القاهرة، مصر',
      postal_code: '11211',
      phone: '+20 12 3456 7890',
      email: 'studio@viwan.com',
      lat: 30.0617,
      lng: 31.2198
    },
    {
      id: 'studio-riyadh',
      title_en: 'Riyadh Studio',
      title_ar: 'استوديو الرياض',
      address_en: 'King Abdullah Financial District (KAFD), Riyadh, Saudi Arabia',
      address_ar: 'مركز الملك عبد الله المالي (KAFD)، الرياض، المملكة العربية السعودية',
      postal_code: '13512',
      phone: '+966 11 234 5678',
      email: 'riyadh@viwan.com',
      lat: 24.7677,
      lng: 46.6384
    }
  ],
  stats: {
    years_experience: '15+',
    architects_count: '40+',
    projects_count: '200+',
    presence_en: 'GCC - EGYPT',
    presence_ar: 'الخليج ومصر'
  }
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Tarek Mansour',
    name_ar: 'طارق منصور',
    email: 'admin@viwan.com',
    password: '$2b$12$TdlL5BQGemPKisp8Y6n21ObNPWt/da4pyu1HqeL1cBdrnVR1WwAvi',
    role: 'Super Admin',
    role_ar: 'المدير العام وكبير المعماريين',
    phone: '+20 100 234 5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    status: 'Active',
    createdAt: '2024-01-15',
    lastLogin: 'Today, 09:30 AM'
  },
  {
    id: 'usr-2',
    name: 'Sarah Al-Ghamdi',
    name_ar: 'سارة الغامدي',
    email: 'sarah.g@viwan.com',
    password: '$2b$12$TdlL5BQGemPKisp8Y6n21ObNPWt/da4pyu1HqeL1cBdrnVR1WwAvi',
    role: 'Chief Architect',
    role_ar: 'رئيسة قطاع التصميم المعماري',
    phone: '+966 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    status: 'Active',
    createdAt: '2024-02-10',
    lastLogin: 'Yesterday, 14:15 PM'
  },
  {
    id: 'usr-3',
    name: 'Karim Mostafa',
    name_ar: 'كريم مصطفى',
    email: 'karim.m@viwan.com',
    password: '$2b$12$TdlL5BQGemPKisp8Y6n21ObNPWt/da4pyu1HqeL1cBdrnVR1WwAvi',
    role: 'Senior Project Architect',
    role_ar: 'مهندس مشاريع أول',
    phone: '+20 112 345 6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    status: 'Active',
    createdAt: '2024-03-01',
    lastLogin: 'Oct 22, 11:00 AM'
  }
];

export const INITIAL_EXPERTISE_SECTORS: import('../types').ExpertiseSector[] = [
  {
    id: 'sec-1',
    name_en: 'Private Villas & Palaces',
    name_ar: 'القصور والفلل الفاخرة',
    count: 48,
    status: 'Active',
    description_en: 'Bespoke high-end private residences blending luxury and contextual harmony.',
    description_ar: 'تصميم قصور وفلل فاخرة تجمع بين الخصوصية والفخامة المعمارية الاستثنائية.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    display_order: 1
  },
  {
    id: 'sec-2',
    name_en: 'Residential Developments',
    name_ar: 'المجمعات السكنية الراقية',
    count: 32,
    status: 'Active',
    description_en: 'Integrated gated communities and urban residential compounds.',
    description_ar: 'مجمعات سكنية متكاملة الخدمات تعزز جودة الحياة والترابط المجتمعي.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
    display_order: 2
  },
  {
    id: 'sec-3',
    name_en: 'Commercial & Retail Centers',
    name_ar: 'المراكز التجارية والترفيهية',
    count: 26,
    status: 'Active',
    description_en: 'Dynamic commercial destinations and premium retail lifestyle centers.',
    description_ar: 'مراكز تسوق ووجهات تجارية وترفيهية مبتكرة تجذب الزوار.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    display_order: 3
  },
  {
    id: 'sec-4',
    name_en: 'Hospitality & Resorts',
    name_ar: 'الضيافة والمنتجعات السياحية',
    count: 14,
    status: 'Active',
    description_en: 'Five-star eco-resorts, boutique hotels, and luxury wellness retreats.',
    description_ar: 'فنادق ومنتجعات سياحية بيئية فاخرة تعكس الهوية الثقافية والمناظر الطبيعية.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    display_order: 4
  },
  {
    id: 'sec-5',
    name_en: 'Healthcare & Medical Centers',
    name_ar: 'المستشفيات والمراكز الطبية',
    count: 9,
    status: 'Active',
    description_en: 'Specialized healthcare facilities built to international biomedical codes.',
    description_ar: 'مستشفيات ومراكز طبية تخصصية مصممة وفق أحدث المعايير الصحية العالمية.',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200&auto=format&fit=crop',
    display_order: 5
  },
  {
    id: 'sec-6',
    name_en: 'Corporate Headquarters',
    name_ar: 'المقرات الإدارية والشركات',
    count: 18,
    status: 'Active',
    description_en: 'State-of-the-art administrative office towers and corporate headquarters.',
    description_ar: 'أبراج مكتبية ومقرات شركات كبرى تعكس المكانة والابتكار المؤسسي.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    display_order: 6
  },
  {
    id: 'sec-7',
    name_en: 'Educational Campuses',
    name_ar: 'المؤسسات التعليمية والجامعات',
    count: 8,
    status: 'Active',
    description_en: 'Innovative university buildings, research centers, and international schools.',
    description_ar: 'جامعات ومدارس دولية مجهزة ببيئات تعليمية وبحثية تفاعلية متطورة.',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop',
    display_order: 7
  },
  {
    id: 'sec-8',
    name_en: 'Master Planning & Smart Cities',
    name_ar: 'المخططات العامة والمدن الذكية',
    count: 11,
    status: 'Active',
    description_en: 'Comprehensive regional masterplans and transit-oriented smart developments.',
    description_ar: 'مخططات مدن ذكية وتخطيط عمراني استراتيجي مستدام يواكب رؤية المستقبل.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    display_order: 8
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-architecture',
    code: 'SRV-ARCH',
    num: '01',
    slug: 'architecture',
    title_en: 'Architecture',
    title_ar: 'الهندسة المعمارية',
    desc_en: 'We craft contextually grounded architectural forms that unite spatial function, authentic proportion, and enduring materiality across residential, commercial, and mixed-use typology.',
    desc_ar: 'نبتكر حلولاً معمارية متجذرة في سياقها المكاني، تجمع بين وظيفة الفراغ وأصالة النسب ودقة الإضاءة لتدوم للأجيال القادمة في المشاريع السكنية والتجارية.',
    image: '/images/service-architecture.jpg',
    alt: 'Contemporary luxury travertine stone and glass villa at twilight',
    scope_en: [
      'Concept Design',
      'Schematic Design',
      'Design Development',
      'Architectural Documentation',
      'Façade Design',
      'BIM Coordination'
    ],
    scope_ar: [
      'التصميم المبدئي وتطوير الفكرة',
      'المخططات المعمارية الأولية',
      'تطوير التصميم والنسب الفراغية',
      'الوثائق المعمارية ورخص البناء',
      'تصميم الواجهات والإكساء الخارجي',
      'التنسيق المعماري عبر نماذج BIM'
    ],
    status: 'Active',
    display_order: 1
  },
  {
    id: 'srv-interior-design',
    code: 'SRV-INT',
    num: '02',
    slug: 'interior-design',
    title_en: 'Interior Design',
    title_ar: 'التصميم الداخلي',
    desc_en: 'Approaching interior design as a sensory spatial choreography — balancing circulation flow, tactile warmth, tailored joinery, and bespoke decorative elements.',
    desc_ar: 'نتعامل مع التصميم الداخلي كتجربة فراغية حسية متكاملة — نوازن بين تدفق الحركة، ودفء المواد الطبيعية، وتصميم الإضاءة التخصصية، والقطع الحصرية.',
    image: '/images/service-interior-design.jpg',
    alt: 'Ultra-luxury modern interior living room with bespoke furniture and cove lighting',
    scope_en: [
      'Space Planning',
      'Interior Concept',
      'Materials & Finishes',
      'FF&E',
      'Lighting Design',
      'Custom Furniture',
      'Styling & Art Direction'
    ],
    scope_ar: [
      'التخطيط الفراغي وتوزيع الحركة',
      'المفهوم الجمالي الداخلي',
      'انتقاء الخامات والأحجار الطبيعية',
      'جداول الأثاث والتجهيزات FF&E',
      'تصميم الإضاءة المعمارية المتخصصة',
      'تصميم قطع الأثاث المخصصة',
      'التنسيق الفني واختيار التحف الفنية'
    ],
    status: 'Active',
    display_order: 2
  },
  {
    id: 'srv-landscape-design',
    code: 'SRV-LND',
    num: '03',
    slug: 'landscape-design',
    title_en: 'Landscape Design',
    title_ar: 'تصميم اللاندسكيب',
    desc_en: 'Harmonizing botanical architecture, natural stone paths, reflecting water bodies, and bioclimatic microclimates to seamlessly extend living space into the outdoors.',
    desc_ar: 'تصميم متناغم يدمج البيئات النباتية والمائية والمسارات الحجرية والمظلات الخارجية لتعزيز الاتصال الفطري بين المساحات الداخلية والمحيط الطبيعي.',
    image: '/images/service-landscape-design.jpg',
    alt: 'Luxury private villa landscape garden at sunset with pool and pergola',
    scope_en: [
      'Landscape Concept',
      'Masterplanning',
      'Hardscape Design',
      'Softscape Design',
      'Outdoor Living',
      'Public Realm',
      'Irrigation & Sustainability'
    ],
    scope_ar: [
      'المفهوم البيئي للحدائق',
      'المخطط العام للموقع والمسارات',
      'تصميم العناصر الصلبة والمظلات',
      'اختيار وتنسيق النباتات المتوافقة مناخياً',
      'مناطق الجلوس والمعيشة الخارجية',
      'الفضاءات المفتوحة والساحات',
      'شبكات الري الذكية والاستدامة'
    ],
    status: 'Active',
    display_order: 3
  },
  {
    id: 'srv-urban-design',
    code: 'SRV-URB',
    num: '04',
    slug: 'urban-design',
    title_en: 'Urban Design',
    title_ar: 'التصميم والتخطيط العمراني',
    desc_en: 'Strategic spatial planning for forward-thinking urban communities, mixed-use destinations, and pedestrian-first public infrastructure.',
    desc_ar: 'تخطيط مكاني استراتيجي للمجتمعات الحضرية الرائدة، والوجهات متعددة الاستخدامات، والبنى التحتية الصديقة للمشاة والمناخ.',
    image: '/images/service-urban-design.jpg',
    alt: 'Aerial architectural drone view of contemporary masterplanned community',
    scope_en: [
      'Urban Planning',
      'Mixed-Use Developments',
      'Public Spaces',
      'Mobility & Connectivity',
      'Sustainability Strategies',
      'Urban Guidelines',
      '3D Visualization'
    ],
    scope_ar: [
      'التخطيط الحضري وتوزيع الكتل',
      'تطوير المجمعات متعددة الاستخدامات',
      'تصميم الساحات والفضاءات العامة',
      'شبكات الحركة والتنقل والمشاة',
      'استراتيجيات الاستدامة العمرانية',
      'صياغة الأدلة والمعايير العمرانية',
      'الإظهار والمحاكاة ثلاثية الأبعاد'
    ],
    status: 'Active',
    display_order: 4
  },
  {
    id: 'srv-engineering',
    code: 'SRV-ENG',
    num: '05',
    slug: 'engineering',
    title_en: 'Engineering',
    title_ar: 'التنسيق الهندسي الشامل',
    desc_en: 'Rigorous multidisciplinary engineering coordination ensuring structural integrity, MEP optimization, clash-free BIM integration, and strict buildability.',
    desc_ar: 'تنسيق هندسي متعدد التخصصات يجمع بين السلامة الإنشائية والأنظمة الكهروميكانيكية ونمذجة BIM لضمان تنفيذ دقيق وخالٍ تماماً من أخطاء الموقع.',
    image: '/images/service-engineering.jpg',
    alt: 'Contemporary architectural engineering office building with precise structural grid',
    scope_en: [
      'Structural Coordination',
      'MEP Coordination',
      'BIM',
      'Technical Documentation',
      'Shop Drawing Review',
      'Construction Support',
      'Value Engineering'
    ],
    scope_ar: [
      'التنسيق والتدقيق الإنشائي',
      'تنسيق الأنظمة الكهروميكانيكية MEP',
      'نمذجة BIM الموحدة وكشف التعارضات',
      'إعداد المخططات الفنية المتكاملة',
      'مراجعة واعتماد رسومات الورشة التنفيذية',
      'الدعم الفني المباشر للموقع',
      'الهندسة القيمية وترشيد الميزانيات'
    ],
    status: 'Active',
    display_order: 5
  },
  {
    id: 'srv-project-management',
    code: 'SRV-PM',
    num: '06',
    slug: 'project-management',
    title_en: 'Project Management',
    title_ar: 'إدارة المشاريع',
    desc_en: 'End-to-end management ensuring project delivery on schedule, within approved budget limits, and in complete fidelity to the architectural specification.',
    desc_ar: 'إدارة شاملة لجميع مراحل المشروع تضمن التسليم في الموعد المحدد وضمن الميزانية المعتمدة مع الالتزام التام بالمواصفات المعمارية القياسية.',
    image: '/images/service-project-management.jpg',
    alt: 'Architectural project management desk setup with white hardhat and blueprints',
    scope_en: [
      'Project Planning',
      'Cost Management',
      'Time Management',
      'Contract Administration',
      'Consultant Coordination',
      'Progress Monitoring',
      'Quality Control'
    ],
    scope_ar: [
      'إعداد المخططات الزمنية للمشروع',
      'إدارة التكاليف وضبط الميزانيات',
      'إدارة الوقت ومسار الأعمال الحرج',
      'إدارة العقود ومستحقات المقاولين',
      'التنسيق بين كافة الاستشاريين والموردين',
      'التقارير الدورية لمعدلات الإنجاز',
      'معايير وضوابط مراقبة الجودة'
    ],
    status: 'Active',
    display_order: 6
  },
  {
    id: 'srv-finishing-fit-out',
    code: 'SRV-FIT',
    num: '07',
    slug: 'finishing-fit-out',
    title_en: 'Finishing & Fit-Out',
    title_ar: 'التشطيبات والتجهيز الداخلي',
    desc_en: 'Meticulous execution of bespoke architectural joinery, stone cladding, metal trims, and artisan fit-outs to realize the intended design vision flawlessly.',
    desc_ar: 'تنفيذ دقيق للتجاليد المعمارية، وتكسيات الرخام الطبيعي، والقواطع المعدنية، والأعمال الخشبية الحرفية لتحويل الرؤية التصميمية إلى واقع ملموس.',
    image: '/images/service-fitout-marble.jpg',
    alt: 'Architectural bookmatched marble wall adjacent to fluted wood paneling',
    scope_en: [
      'Interior & Exterior Finishing',
      'Material Selection',
      'Technical Detailing',
      'Custom Joinery',
      'Fit-Out Execution',
      'Quality Assurance',
      'Handover Support'
    ],
    scope_ar: [
      'تنفيذ التشطيبات الداخلية والخارجية',
      'انتقاء وتوريد الرخام والأخشاب الفاخرة',
      'التفاصيل الفنية الدقيقة للتركيبات',
      'أعمال النجارة والتجاليد الحصرية',
      'التنفيذ الميداني بأعلى دقة حرفية',
      'توكيد الجودة ومطابقة عينات المواد',
      'الدعم الفني وإجراءات التسليم النهائي'
    ],
    status: 'Active',
    display_order: 7
  },
  {
    id: 'srv-construction-supervision',
    code: 'SRV-SUP',
    num: '08',
    slug: 'construction-supervision',
    title_en: 'Construction Supervision',
    title_ar: 'الإشراف على التنفيذ',
    desc_en: 'On-site architectural representation, continuous quality enforcement, progress audits, and technical direction from ground-breaking through turnkey handover.',
    desc_ar: 'تواجد هندسي مستمر بالموقع، ومراقبة صارمة للجودة، ومراجعة معدلات الإنجاز، وتوجيه فني مباشر من وضع الأساسات حتى التسليم على المفتاح.',
    image: '/images/service-construction-supervision.jpg',
    alt: 'Site engineer in hardhat and safety vest inspecting building under construction',
    scope_en: [
      'Site Supervision',
      'Quality Control',
      'Compliance with Specifications',
      'Progress Reporting',
      'Consultant & Contractor Coordination',
      'On-Site Problem Solving',
      'Final Inspection & Handover'
    ],
    scope_ar: [
      'الإشراف الميداني اليومي بالموقع',
      'فحص ومطابقة جودة الأعمال المنفذة',
      'الالتزام الصارم بالمواصفات وكود البناء',
      'إعداد التقارير الفنية المصورة للمالك',
      'تنسيق المهام بين المقاولين والاستشاري',
      'إيجاد حلول فورية للتحديات الهندسية الميدانية',
      'الفحص الهندسي النهائي والاستلام'
    ],
    status: 'Active',
    display_order: 8
  }
];



