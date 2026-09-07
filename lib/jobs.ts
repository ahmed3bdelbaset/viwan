export type Job = {
  slug: string
  title: string
  titleAr: string
  experience: string
  experienceAr: string
  location: string
  locationAr: string
  type: string
  typeAr: string
  role: string
  roleAr: string
  responsibilities: string[]
  responsibilitiesAr: string[]
  requirements: string[]
  requirementsAr: string[]
  software: string[]
}

export const JOBS: Job[] = [
  {
    slug: 'architect',
    title: 'Architect',
    titleAr: 'مهندس معماري (Architect)',
    experience: '3–6 Years Experience',
    experienceAr: 'خبرة من 3 إلى 6 سنوات',
    location: 'Cairo, Egypt',
    locationAr: 'القاهرة، مصر',
    type: 'Full Time',
    typeAr: 'دوام كامل',
    role:
      'Lead architectural design and conceptual development for luxury residential, hospitality, and mixed-use projects. Collaborate closely with interior, landscape, and engineering teams to transform concepts into built reality.',
    roleAr:
      'قيادة التصميم المعماري وتطوير المفاهيم الفراغية للمشاريع السكنية والضيافة الفاخرة، والتعاون الوثيق مع فرق التصميم الداخلي واللاندسكيب لتحويل الرؤى إلى واقع معماري استثنائي.',
    responsibilities: [
      'Lead architectural massing, space planning, and facade design for high-end projects',
      'Produce comprehensive architectural drawing packages and detail sheets',
      'Coordinate multidisciplinary consultants and engineering systems in Revit/BIM',
      'Conduct site architectural reviews to safeguard design integrity',
    ],
    responsibilitiesAr: [
      'قيادة التوزيع الفراغي وتصميم الكتل والواجهات المعمارية للمشاريع الراقية',
      'إعداد المخططات المعمارية التنفيذية والتفاصيل الدقيقة بجودة عالمية',
      'التنسيق الهندسي المتكامل مع استشاريي الإنشاء والكهروميكانيك عبر Revit',
      'المتابعة الميدانية لضمان مطابقة التنفيذ لأعلى معايير التصميم الأصلي',
    ],
    requirements: [
      'Bachelor’s or Master’s degree in Architectural Engineering',
      '3+ years of experience in high-end architectural studio practice',
      'Strong proficiency in BIM (Revit), AutoCAD, Rhino, and presentation graphics',
      'Demonstrated passion for craft, materiality, and precise proportions',
    ],
    requirementsAr: [
      'بكالوريوس أو ماجستير في الهندسة المعمارية',
      'خبرة تزيد عن 3 سنوات في مكاتب التصميم المعماري المتميزة',
      'إتقان عالٍ لبيئة العمل عبر Revit و AutoCAD و Rhino وأدوات الإظهار',
      'شغف حقيقي بالحِرفة واختيار الخامات والنسب الفراغية المتزنة',
    ],
    software: ['Revit', 'AutoCAD', 'Rhino', 'Enscape / Lumion', 'Adobe Suite'],
  },
  {
    slug: 'interior-designer',
    title: 'Interior Designer',
    titleAr: 'مصمم داخلي (Interior Designer)',
    experience: '3–5 Years Experience',
    experienceAr: 'خبرة من 3 إلى 5 سنوات',
    location: 'Cairo, Egypt',
    locationAr: 'القاهرة، مصر',
    type: 'Full Time',
    typeAr: 'دوام كامل',
    role:
      'Craft sensory interior spaces with exquisite attention to custom millwork, natural stone, ambient architectural lighting, and bespoke furniture curation for private villas and boutique hospitality.',
    roleAr:
      'ابتكار مساحات داخلية غامرة تركز على التفاصيل الحرفية، والرخام الطبيعي، وتوزيع الإضاءة المعمارية، وانتقاء الأثاث الحصري للفلل الخاصة والمشاريع الراقية.',
    responsibilities: [
      'Develop sensory interior narratives, moodboards, and material palettes',
      'Design bespoke built-in furniture, custom joinery, and lighting layouts',
      'Prepare comprehensive interior shop drawings and FF&E schedules',
      'Collaborate with master craftsmen, stone fabricators, and fit-out teams',
    ],
    responsibilitiesAr: [
      'صياغة المفهوم الجمالي الداخلي ولوحات الخامات (Moodboards) المتكاملة',
      'تصميم قطع الأثاث المخصصة، والتجاليد الجدارية، ومخططات توزيع الإضاءة',
      'إعداد المخططات التنفيذية للتصميم الداخلي وجداول التجهيزات FF&E بدقة',
      'التنسيق المباشر مع كبار الحرفيين وموردي الرخام والأخشاب الفاخرة',
    ],
    requirements: [
      'Degree in Interior Design, Applied Arts, or Architecture',
      '3–5 years experience in luxury residential or boutique hospitality interiors',
      'Deep tactile understanding of natural stone, timber, textiles, and metalwork',
      'Proficiency in 3ds Max/Corona, SketchUp, and AutoCAD',
    ],
    requirementsAr: [
      'مؤهل جامعي في التصميم الداخلي، الفنون التطبيقية، أو العمارة',
      'خبرة من 3 إلى 5 سنوات في المشاريع السكنية الفاخرة والفندقية',
      'فهم حسّي عميق لملمس الأحجار والأخشاب الطبيعية والمعادن والأقمشة',
      'إتقان الإظهار الواقعي عبر 3ds Max / Corona والرسومات التنفيذية بـ AutoCAD',
    ],
    software: ['3ds Max / Corona', 'AutoCAD', 'SketchUp', 'Photoshop', 'InDesign'],
  },
  {
    slug: 'landscape-designer',
    title: 'Landscape Designer',
    titleAr: 'مصمم لاندسكيب (Landscape Designer)',
    experience: '3–5 Years Experience',
    experienceAr: 'خبرة من 3 إلى 5 سنوات',
    location: 'Cairo, Egypt',
    locationAr: 'القاهرة، مصر',
    type: 'Full Time',
    typeAr: 'دوام كامل',
    role:
      'Design captivating outdoor realms, private courtyards, reflective water bodies, and microclimate-responsive planting palettes that seamlessly extend architectural living spaces.',
    roleAr:
      'تصميم الفراغات الخارجية والحدائق الخاصة، والمسطحات المائية العاكسة، وشبكات الري الذكية، مع مراعاة المناخ الإقليمي وتناغم الطبيعة مع الكتل المعمارية.',
    responsibilities: [
      'Create masterplans, courtyard layouts, and outdoor living environments',
      'Produce technical hardscape grading, lighting, and detail packages',
      'Curate indigenous and drought-tolerant planting palettes for arid climates',
      'Coordinate levels, drainage, and irrigation systems with MEP engineers',
    ],
    responsibilitiesAr: [
      'تطوير المخططات العامة للحدائق والفناءات الخارجية ومسارات المشاة',
      'إعداد المخططات التنفيذية للعناصر الصلبة (Hardscape) وتدرج المناسيب',
      'انتقاء أنواع النباتات المحلية والأشجار المتوافقة مع طبيعة المناخ',
      'التنسيق مع مهندسي الموقع وأنظمة الري الذكية وشبكات تصريف المياه',
    ],
    requirements: [
      'Degree in Landscape Architecture or Architecture',
      '3–5 years in landscape planning and detailed site execution',
      'Proven knowledge of Middle Eastern and Mediterranean flora',
      'Strong portfolio in luxury residential gardens or public realm design',
    ],
    requirementsAr: [
      'بكالوريوس في عمارة البيئة أو الهندسة المعمارية',
      'خبرة 3 إلى 5 سنوات في تخطيط اللاندسكيب والتنفيذ الميداني للمواقع',
      'معرفة متعمقة بالنباتات الإقليمية ونباتات البحر الأبيض المتوسط',
      'ملف أعمال قوي في الحدائق السكنية الراقية أو المشاريع الحضرية',
    ],
    software: ['AutoCAD', 'Rhino / SketchUp', 'Lumion', 'Photoshop', 'Civil 3D'],
  },
  {
    slug: 'technical-office-engineer',
    title: 'Technical Office Engineer',
    titleAr: 'مهندس مكتب فني (Technical Office Engineer)',
    experience: '4–7 Years Experience',
    experienceAr: 'خبرة من 4 إلى 7 سنوات',
    location: 'Cairo, Egypt',
    locationAr: 'القاهرة، مصر',
    type: 'Full Time',
    typeAr: 'دوام كامل',
    role:
      'Bridge the gap between design vision and site execution. Produce precision shop drawings, architectural details, quantity surveying, tender packages, and technical site coordination.',
    roleAr:
      'الربط الاحترافي بين الرؤية التصميمية والتنفيذ على أرض الواقع؛ إعداد الرسومات التنفيذية (Shop Drawings)، وحساب الكميات (BOQ)، وإعداد مستندات الطرح والتنسيق الفني الدقيق.',
    responsibilities: [
      'Produce comprehensive architectural and structural shop drawing packages',
      'Prepare detailed Bills of Quantities (BOQ) and specification documents',
      'Perform technical review of submittals, material approvals, and contractor RFIs',
      'Coordinate clash-free technical details between architectural, structural, and MEP trades',
    ],
    responsibilitiesAr: [
      'إعداد المخططات التنفيذية وتفاصيل الورشة (Shop Drawings) بدقة متناهية',
      'إعداد جداول الكميات والمواصفات الفنية ومستندات العطاءات',
      'المراجعة الفنية لاعتمادات المواد والموردين واستفسارات المقاولين (RFIs)',
      'حل التعارضات الهندسية والتنسيق الفني بين كافة التخصصات',
    ],
    requirements: [
      'Bachelor’s degree in Architectural or Civil Engineering',
      '4+ years of verified technical office experience in luxury construction',
      'Mastery of AutoCAD, Revit, and advanced quantity surveying',
      'Deep knowledge of Egyptian and Gulf building codes and construction standards',
    ],
    requirementsAr: [
      'بكالوريوس في الهندسة المعمارية أو الهندسة المدنية',
      'خبرة موثقة تزيد عن 4 سنوات في المكاتب الفنية للمشاريع الراقية',
      'إتقان كامل لبرامج AutoCAD و Revit وحساب الكميات المتقدم',
      'دراية واسعة بكودات البناء المصرية والخليجية والمواصفات القياسية',
    ],
    software: ['AutoCAD', 'Autodesk Revit', 'Excel / CostX', 'Navisworks', 'Bluebeam'],
  },
]

export function getJob(slug: string) {
  return JOBS.find((j) => j.slug === slug)
}
