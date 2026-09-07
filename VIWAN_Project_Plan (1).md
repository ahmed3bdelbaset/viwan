# VIWAN — خطة العمل الكاملة للمشروع
### Master Project Plan | Website + Admin Dashboard

---

## 1. نظرة عامة على المشروع

الهدف: بناء موقع VIWAN (Architecture, Interior Design & Engineering Studio) بحيث يكون **أقوى بصريًا وتقنيًا** من المواقع الثلاثة اللي بعتهملنا العميل كـ reference (Hany Saad Innovations, Soroh Theqa, Mona Hussein Design House)، وفي نفس الوقت:

- **Fully Responsive** على كل الأجهزة (Desktop / Tablet / Mobile).
- فيه **Admin Dashboard** بـ رابط دخول مخفي (Hidden Login URL) يقدر بيه المسؤول يتحكم في كل محتوى الموقع (مشاريع، فوتر، أرقام تواصل، سوشيال ميديا) من غير ما يلمس الكود.

المرجع التصميمي الأساسي: الـ Mockups والـ Wireframe اللي في `Client_Requirements.md` (الألوان، الخطوط، الـ Sections، الصفحات).

---

## 2. تحليل المنافسين (Competitive Benchmark)

الهدف من الجدول ده إننا نحدد بالظبط الحاجة اللي هنسبقهم فيها في كل موقع، مش بس نقول "هنعمل أحسن" من غير تفاصيل.

| المعيار | Hany Saad Innovations | Soroh Theqa | Mona Hussein (MHDH) | **VIWAN (المستهدف)** |
|---|---|---|---|---|
| **الهوية البصرية** | قوية جدًا (سينمائي) لكن مبنية على Cargo بدون بنية تسويقية | ضعيفة (WordPress template عادي) | جيدة لكن فيها تكرار وعناصر خام | Design System كامل: ألوان + Typography + Grid ثابت في كل صفحة (زي VIWAN Mockups) |
| **الـ SEO / بنية الصفحات** | ضعيفة جدًا، مفيش services pages منفصلة | قوية (services pages + مدونة) | متوسطة، مفيش صفحات خدمات مفصلة | صفحات منفصلة لكل Discipline (Architecture / Interior / Landscape / Engineering) + بنية URLs نظيفة |
| **الـ Responsiveness** | غير مضمون (منصة Cargo قديمة الطراز) | متوسط (Slider Revolution بيبقى تقيل على الموبايل) | جيد (Next.js) | **Mobile-first فعليًا**، breakpoints مدروسة، أداء عالي (Lighthouse 90+) |
| **عرض المشاريع (Portfolio)** | صور كبيرة لكن بدون معلومات منظمة (Location/Year/Scope) | صور عامة بدون تفاصيل مشروع | معلومات قليلة، الصور بتتكرر | كل مشروع له: Location, Year, Type, Scope of Work + Gallery مفلترة (Editorial Layout مش Cards عادية) |
| **الـ CTA / Lead Generation** | مفيش نموذج تواصل واضح | فورم تواصل بسيط | فورم تواصل بسيط | نظام "30 Minutes Free Consultation" مخصص + Contact Form تفصيلي (Project Type / Budget / Stage) |
| **الإدارة (CMS)** | لا يوجد (يحتاج مطور لكل تعديل) | WordPress عادي | غالبًا Headless CMS محدود | **Admin Dashboard خاص** يتحكم في كل حاجة (مشاريع، فوتر، تواصل) بدون مطور |
| **الـ Credibility** | معتمد على اسم شخصي فقط | لا يوجد Testimonials حقيقية بارزة | قوي جدًا (Testimonials + Clients logos) | نعرض Clients logos + أرقام (Projects / m² / Disciplines / Markets) بشكل بصري منظم |
| **ثنائية اللغة** | إنجليزي فقط | عربي/إنجليزي (بس التنقل مربك) | إنجليزي فقط | EN/AR مع RTL/LTR switching سليم (زي اللي ظاهر في الـ Header mockup) |

**الخلاصة:** VIWAN هياخد صرامة الـ Storytelling البصري من HSI + قوة الـ SEO/Structure من Soroh Theqa + الـ Credibility من Mona Hussein، ويضيف عليهم حاجتين مش موجودين عند التلاتة: **Admin Dashboard كامل** و**أداء تقني عالي على الموبايل**.

---

## 3. الـ Tech Stack المعتمد (Confirmed)

الستاك ده اتقفل نهائيًا من العميل/الفريق، وبيلغي أي بديل كان مقترح قبل كده (PostgreSQL/MongoDB):

| الطبقة | التقنية المعتمدة | ملاحظات |
|---|---|---|
| اللغات | **TypeScript** + **JavaScript** | TypeScript للـ Components والـ Backend logic كلها، JavaScript في أي Config/Script بسيط |
| Frontend Framework | **Next.js 16 (App Router)** + **React 19** | ✅ ده بالظبط اللي متبني فعلًا في `viwan.zip` (16.3.3 / 19.2.4) — وهو الـ Active LTS الحالي وبياخد Security Patches شهرية رسمية، فمفيش داعي للـ Downgrade لـ 14/18 (تفاصيل في القسم 9.1) |
| الستايل | **CSS3 + Tailwind CSS** | HTML5/SVG للـ Markup والـ Icons/الرسومات |
| الـ Runtime | **Node.js** | نفس الـ Runtime للـ Frontend والـ API Routes، بدون سيرفر منفصل |
| Backend | **Next.js API Routes / Route Handlers** (TypeScript) | مفيش Express ولا Headless CMS منفصل — كل الـ Backend جوه نفس مشروع Next.js |
| قاعدة البيانات | **SQLite** (عبر SQL) | بديل PostgreSQL/MongoDB المذكور سابقًا — راجع "ملاحظات تقنية" تحت بخصوص تأثيرها على اختيار الاستضافة |
| ORM / DB Access | **Prisma** (أو **Drizzle ORM**) مع SQLite Provider | لازم Parameterized Queries تلقائيًا (مطلوبة أصلًا في القسم 11.7 للحماية من SQL Injection) — هيتقفل الاختيار وقت التنفيذ |
| تخزين الصور | مجلد `public/` جوه نفس المشروع (Self-hosted) أو Cloud Storage لاحقًا لو الحجم كبر | يتماشى مع بساطة الستاك؛ Cloud Storage يفضل خيار مفتوح لو الأداء طلب كده |

### ملاحظات تقنية مهمة على الستاك الجديد
1. **نسخة Next.js/React اتأكدت واتقفلت على اللي مبني فعلًا (16 / 19)** — بعد التأكد إن دي فعلًا الإصدارات الأحدث والـ Active LTS حاليًا (مش 14/18 زي ما كان مقترح الأول)، اعتمدنا نفس نسخة الكود الموجود بدل ما نعمل Downgrade غير ضروري. لو فيه سبب تاني (توافق مكتبة معينة) يستدعي النزول لـ 14، قولّي وأعدّل.
2. **الاستضافة لازم تدعم Persistent Disk** — بما إن SQLite ملف فعلي على القرص، الاستضافة الـ Serverless العادية (زي Vercel بشكلها الافتراضي) بتمسح أي كتابة على القرص بين الـ Requests، فأي بيانات هتتضاف من لوحة الأدمن (مشاريع، رسائل تواصل) هتضيع. الخيارات: **VPS بقرص دائم** (الأنسب هنا)، أو لو حبينا نفضل على Vercel نستخدم SQLite Cloud زي **Turso/LibSQL** بدل ملف محلي. القرار ده لازم ياخد قبل مرحلة الـ Backend مباشرة.
3. **الـ Redis من خطة الأمان (القسم 11.5) مش موجود في القائمة دي** — لو الاستضافة النهائية VPS واحد (Single Instance) طول الوقت، ينفع نستخدم `rate-limiter-flexible` مع `RateLimiterMemory` بدل `RateLimiterRedis`، لكن هنفقد استمرارية العداد لو السيرفر عمل Restart. لو الخطة توسّع لأكتر من Instance مستقبلًا، وقتها هنحتاج Redis زي ما هو متفق عليه أصلًا. القرار ده كمان معلّق على اختيار الاستضافة.
4. **حقول الـ Arrays في نموذج البيانات (قسم 8)** — زي `scope_of_work[]`, `gallery_images[]`, `requirements[]`, `phone_numbers[]`, `client_logos[]` — SQLite مفيهوش نوع عمود Array أصلي. هتتخزن كـ **JSON column (TEXT)** وتتعمل Serialize/Deserialize، وده مدعوم بشكل مباشر في Prisma (`Json` type) لو ده الاختيار.

---

## 4. خريطة الموقع النهائية (Sitemap)

بناءً على مقارنة الـ Navigation المقترح في محادثة "VIWAN ADMINS" (12 صفحة) مع الـ Mockups الفعلية (9 عناصر Navigation)، الخريطة النهائية المعتمدة:

```
1. HOME
2. PROJECTS  → PROJECT DETAILS (template ديناميكي لكل مشروع)
3. SERVICES  (يشمل Architecture / Interior Design / Landscape / Engineering كأقسام داخل نفس الصفحة بدل صفحات منفصلة)
4. STUDIO    (About VIWAN + Philosophy + Team)
5. HOW WE WORK
6. CAREERS   → JOB DETAILS (template ديناميكي لكل وظيفة)
7. CONTACT
8. 30 MINUTES FREE CONSULTATION (صفحة CTA مستقلة بحجز موعد)
+ ADMIN LOGIN (رابط مخفي، غير موجود في أي Navigation ظاهر)
```

> ملحوظة: دمجنا Architecture/Interior/Landscape/Engineering جوه صفحة SERVICES واحدة (بدل 4 صفحات منفصلة) لأن ده اللي ظاهر فعليًا في آخر Mockups (الصفحة اللي فيها Navigation: Home / Projects / Services / Studio / How We Work / Careers / Contact) وهو أبسط للمستخدم وأقوى SEO-wise كصفحة واحدة غنية بدل تفتيت المحتوى.

---

## 5. نظام التصميم (Design System) — من ملف العميل

### الألوان
| الاسم | الكود | الاستخدام |
|---|---|---|
| Warm Ivory | `#F3F0E9` | الخلفية الرئيسية |
| Deep Charcoal | `#11110F` | الأقسام الداكنة (Dark Sections) |
| Soft Stone | `#C9C1B5` | الخطوط والخلفيات الثانوية |
| VIWAN Gold | `#B18B58` | Accent — بنسبة قليلة جدًا |
| Pure White | `#FFFFFF` | نص فوق الصور/الخلفيات الداكنة |

### الخطوط
- العناوين: **Cormorant Garamond** (أو أي بديل بنفس روح Canela) — Serif
- النصوص والـ Navigation: **Inter / Neue Haas Grotesk style** — Sans Serif

### الـ Grid (Desktop)
- Width: 1440px
- Content Area: 1280–1320px
- Margins: 60–80px
- Grid: 12 Columns
- المسافة بين الـ Sections: 120–160px

---

## 6. استراتيجية الـ Responsive Design

ده أهم جزء لازم نضمنه بعكس المنافسين التلاتة اللي حدهم مش Responsive بشكل احترافي:

### Breakpoints المقترحة
| الجهاز | العرض | التغييرات الأساسية |
|---|---|---|
| Desktop Large | 1440px+ | التصميم الأساسي زي الـ Mockups بالظبط |
| Desktop | 1024–1439px | تقليل الـ Margins، الحفاظ على 12 Columns |
| Tablet | 768–1023px | تحويل الأعمدة لـ 6–8، Sections اللي فيها Text+Image تتكدس (Stack) عمودي |
| Mobile | 375–767px | Header يتحول لـ Logo + ☰ Menu (Hamburger Panel زي المحدد في المتطلبات)، كل الـ Grid تتحول لعمود واحد، الصور Full-width |
| Small Mobile | <375px | خط أصغر، Padding أقل، اختبار على iPhone SE كحد أدنى |

### قواعد عامة للـ Responsiveness
1. الصور الكبيرة (Hero, Featured Project) تفضل Full-bleed لكن بـ `object-fit: cover` عشان متتقطعش بشكل سيء على الموبايل.
2. الـ Editorial Layout (مشروع بجانب نص) في صفحة Projects يتحول لـ Stack عمودي (صورة فوق، نص تحت) على الموبايل.
3. الـ Horizontal Timeline (Discover → Deliver) تتحول لـ Vertical Timeline على الموبايل.
4. اختبار حقيقي على: iPhone (Safari)، Android (Chrome)، iPad، ومتصفحات Desktop (Chrome/Safari/Edge) — مش بس Chrome DevTools.
5. الـ Mobile Menu Panel يفتح بالترتيب المحدد بالظبط: Home → Projects → Services → Studio → How We Work → Careers → Contact → خط فاصل → 30 Minutes Free Consultation → EN|AR → LinkedIn/Instagram.

---

## 7. لوحة تحكم الأدمن (Admin Dashboard)

### 7.1 رابط الدخول المخفي (Hidden Login)
- مفيش أي رابط أو زرار للأدمن ظاهر في الموقع العام (مش في الـ Header ولا الـ Footer).
- الرابط يكون على مسار غير متوقع وغير قياسي، زي:
  `viwan.net/[مسار-عشوائي-مش-admin-ولا-login]`
  (هنحدد المسار الفعلي وقت التنفيذ، ومينفعش يتحط هنا كـ placeholder عام عشان الفكرة أصلاً إنه "مخفي" مش موجود في أي مكان متوقع)
- الصفحة نفسها متضيفهاش في sitemap.xml ولا في أي robots.txt indexing، ومتتلينكش من أي صفحة تانية في الموقع.
- شكل صفحة تسجيل الدخول بسيط جدًا (Logo + Email/Username + Password) بنفس هوية VIWAN البصرية، من غير أي معلومات إضافية بتلمّح إنها لوحة تحكم.

### 7.2 صلاحيات المسؤول (Admin Capabilities)

**أ. إدارة المشاريع (Projects Management)**
- إضافة مشروع جديد (Name, Location, Year, Type, Scope of Work, Category للفلترة)
- رفع صور المشروع (Hero image, Gallery images, Materials/Details images)
- تعديل أي مشروع موجود
- حذف مشروع
- إعادة ترتيب المشاريع (Drag & Drop أو رقم ترتيب) — عشان يتحكم مين يظهر في "Selected Work" في الصفحة الرئيسية
- تحديد مشروع كـ "Featured Project" ليظهر في السكشن المخصص بالصفحة الرئيسية

**ب. إدارة الفوتر (Footer Management)**
- تعديل أرقام الهاتف
- تعديل روابط منصات التواصل الاجتماعي (LinkedIn, Instagram, وأي منصة تانية تتضاف)
- تعديل الإيميل والعنوان (Cairo, Egypt)

**ج. إدارة الوظائف (Careers Management)**
- إضافة/تعديل/حذف وظائف مفتوحة (Title, Experience, Location, Type, Description, Requirements)
- عرض/إخفاء وظيفة بدون حذفها

**د. رسائل التواصل (Inbox)**
- عرض كل الرسائل الواردة من Contact Form و 30-Minutes Consultation Form
- تحديد حالة الرسالة (جديدة / تم الرد)

**هـ. إعدادات عامة (Site Settings)**
- تفعيل/تعديل نص "30 Minutes Free Consultation" لو احتاج تغيير
- تعديل أرقام الـ "Our Impact" section (عدد المشاريع، المساحة المصممة، عدد التخصصات، عدد الأسواق)
- إدارة Client Logos (إضافة/حذف شعارات العملاء)

### 7.3 الأمان الأساسي للوحة (المواصفة الكاملة في القسم 11)
- تسجيل دخول بـ Email + Password (Hashed بـ bcrypt، مش plain text)
- Access Token عمره 15 دقيقة + Refresh Token بـ Rotation مخزن في HttpOnly/Secure/SameSite=Strict Cookie (تفصيل كامل: القسم 11.2)
- كل الـ Admin routes خلف middleware من نوع Default Deny (401 لو مفيش توكن صالح) + middleware تاني للـ Role (403 لو الأدمن مش هو صاحب الصلاحية) — القسم 11.3
- Rate limiting بـ Dual-Key (IP + Email) على محاولات تسجيل الدخول لمنع الـ Brute Force، مع رسالة 429 عامة بدون تسريب معلومات — القسم 11.4
- Password Reset Flow آمن (Token عشوائي + Hash + صلاحية 15 دقيقة + `timingSafeEqual`) — القسم 11.5
- تسجيل كل عملية تعديل/حذف (Activity Log) — مين عمل التعديل ومتى، وتسجيل محاولات الدخول المرفوضة في الـ Security Logs

---

## 8. نموذج البيانات الأساسي (Data Models)

### Project
```
- id
- title
- slug
- category [Architecture | Interior Design | Landscape | Engineering]
- location
- year
- type (Private Residence, Villa, Commercial...)
- scope_of_work [array]
- hero_image
- gallery_images [array]
- materials_images [array]
- description
- is_featured (boolean)
- display_order
- status [draft | published]
```

### JobPosting
```
- id
- title
- experience_required
- location
- employment_type
- description
- requirements [array]
- status [open | closed]
```

### SiteSettings
```
- phone_numbers [array]
- social_links { linkedin, instagram, ... }
- email
- address
- impact_stats { projects_count, m2_designed, disciplines_count, markets_count }
- client_logos [array]
```

### ContactSubmission
```
- id
- name, company, email, phone
- project_location, project_type, project_size, budget, stage
- message
- submitted_at
- status [new | replied]
```

### AdminUser (جديد — مطلوب لتشغيل كل نظام الأمان في القسم 11)
```
- id
- email (unique)
- password_hash (bcrypt)
- role [admin | editor] — لو هيبقى فيه أكتر من مستوى صلاحية
- created_at
- last_login_at
```

### RefreshToken / Session (جديد — لدعم Refresh Token Rotation والـ family_id)
```
- id
- user_id (FK → AdminUser)
- family_id
- token_hash
- status [active | revoked]
- ip_address
- user_agent
- created_at
- expires_at (Absolute Expiry — 30 يوم من أول تسجيل دخول للعائلة)
```

### PasswordResetToken (جديد — لدعم Password Reset Flow)
```
- id
- user_id (FK → AdminUser)
- token_hash (SHA-256)
- used (boolean, default: false)
- created_at
- expires_at (15 دقيقة من وقت الإنشاء)
```

---

## 9. خطة التنفيذ على مراحل (Execution Phases)

| المرحلة | المحتوى | الحالة |
|---|---|---|
| **1. Setup** | إعداد الـ Tech Stack، الـ Design System (ألوان/خطوط/Grid) كـ متغيرات ثابتة (CSS Variables / Tailwind Config) | ✅ **خلصت** |
| **2. Static Pages** | بناء الصفحات الثابتة: Home, Studio, Services, How We Work, Contact بالتصميم الكامل Desktop + Responsive | 🟡 **جزئي** — Home بس خلصت، الباقي لسه مش موجود |
| **3. Dynamic Pages** | Projects listing + Project Details template + Careers + Job Details (مربوطين بقاعدة البيانات) | 🟡 **جزئي** — الـ Data Shape جاهزة كـ Mock Data، بس مفيش صفحات ولا DB حقيقية |
| **4. Admin Dashboard** | بناء صفحة الدخول المخفية + كل الـ CRUD operations للمشاريع/الفوتر/الوظائف/الرسائل | 🔴 **لسه مبدأش** |
| **5. Responsive QA** | اختبار كامل على كل الأجهزة الحقيقية المذكورة في القسم 6 | 🔴 **لسه مبدأش** |
| **6. Security Pass** | تطبيق كل بنود ملف الأمان (القسم 11) | 🔴 **لسه مبدأش** — الخطة جاهزة دلوقتي، محتاجة Backend يتبني الأول |
| **7. Content Population** | إدخال المحتوى الحقيقي (مشاريع VIWAN الفعلية، صور حقيقية، بيانات تواصل حقيقية) | 🔴 **لسه مبدأش** — كل المحتوى الحالي Placeholder |
| **8. Launch** | رفع الموقع + ربط الدومين + مراجعة نهائية | 🔴 **لسه مبدأش** |

> تفاصيل الحالة الفعلية للكود اللي وصلنا (viwan.zip) موجودة بالكامل في القسم 9.1 تحت.

---

## 9.1 تدقيق الكود الحالي (Code Audit — بناءً على مراجعة viwan.zip)

المشروع دلوقتي عبارة عن **Next.js 16 / React 19 / Tailwind CSS 4** frontend، فيه صفحة Home كاملة بس، من غير أي Backend أو Database أو Auth. التفاصيل:

### ✅ اللي خلص فعلًا
- **الـ Setup الأساسي**: Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript، مربوطين صح، وده مطابق للستاك المعتمد في القسم 3.
- **Design System مطابق 100% للقسم 5**: الألوان (`#F3F0E9`, `#11110F`, `#C9C1B5`, `#B18B58`) متعرفة كـ CSS Variables في `globals.css`، والخطوط (`Cormorant Garamond` للعناوين، `Inter` للنصوص) متربطة صح في `layout.tsx`.
- **صفحة الـ Home كاملة**، بكل الـ Sections اللي في الخطة: Hero, Who We Are, Selected Projects, Services Preview, Featured Project, Philosophy, Process Preview, Cinematic Break, Final CTA.
- **الـ Header والـ Footer العامّين** (site-header.tsx / site-footer.tsx) شغالين على كل الصفحات، فيهم الـ Navigation والـ Mobile Hamburger Menu بالترتيب المطلوب في القسم 6.5، وزرار "30 Minutes Free Consultation".
- **Animations**: Reveal-on-scroll provider (`reveal.tsx`) وحركات fade-up/fade-in/scale-in متظبطة في الـ CSS.
- **Data Shape جاهزة**: `lib/projects.ts` و`lib/jobs.ts` فيهم الـ Types والـ Mock Data بنفس الحقول المتفق عليها في نموذج البيانات (القسم 8) — يعني لما نيجي نربطهم بـ DB حقيقية، الـ Schema تقريبًا جاهز.

### 🟡 موجود جزئيًا / محتاج انتباه
- **الـ Navigation بيشاور على صفحات مش موجودة**: `lib/site.ts` فيه روابط لـ `/projects`, `/services`, `/studio`, `/how-we-work`, `/careers`, `/contact` — لكن المسارات دي كلها مش متبنية في `app/` لسه (يعني دلوقتي أي زرار غير الـ Home هيدي 404).
- **EN/AR Switcher شكلي بس**: في الـ Mobile Menu فيه "EN | AR" ظاهرة بصريًا، لكن مفيش أي Logic خلفها — الـ `<html lang="en">` ثابتة، ومفيش `dir="rtl"` ولا نظام ترجمة فعلي. يعني بند "ثنائية اللغة" في جدول المقارنة (قسم 2) لسه مش متحقق.
- **"Our Impact" Stats و Client Logos**: متذكورين في القسم 7.2.هـ كحاجة الأدمن هيتحكم فيها، لكن مفيش أي Section ليهم في الـ Home الحالية.
- **next.config.mjs فيه إعدادين محتاجين مراجعة قبل الإنتاج**: `typescript: { ignoreBuildErrors: true }` و`images: { unoptimized: true }` — دول مقبولين في مرحلة الـ Prototype، بس لازم يتشالوا قبل الـ Launch عشان يتوافقوا مع هدف الأداء (Lighthouse 90+) المذكور في القسم 2.

### 🔴 لسه مش موجود خالص
- **مفيش Backend خالص**: لا API Routes، لا اتصال بأي Database، كل المحتوى Static/Hardcoded في ملفات TypeScript.
- **مفيش Admin Dashboard**: لا Hidden Login، لا Auth، لا أي CRUD — القسم 7 كله (عدا الشكل الأمامي) لسه ما اتلمسش.
- **مفيش أي نظام أمان مطبّق**: طبيعي طالما مفيش Backend أصلًا — كل بنود القسم 11 هتتطبق مع بداية بناء الـ Backend.
- **مفيش Contact Form ولا 30-Minutes Consultation Form شغالين فعليًا** (يعني لسه مفيش مكان بيستقبل submissions ويخزنها كـ ContactSubmission).
- **بيانات التواصل كلها Placeholder**: رقم الهاتف `+20 100 000 0000`، وروابط LinkedIn/Instagram بتودي لصفحات الموقع الرئيسية (`linkedin.com`, `instagram.com`) مش لصفحات VIWAN الفعلية — لسه مستنيين البيانات الحقيقية من العميل (مطابق للقسم 10).
- **مفيش Responsive QA حقيقي اتعمل** على أجهزة فعلية لسه (الأساس Mobile-first موجود بحكم Tailwind، بس مفيش اختبار موثّق).

---

## 10. معلومات مطلوبة من العميل (Content Checklist)

عشان نبدأ التنفيذ الفعلي محتاجين من VIWAN:
- [ ] Logo بصيغة عالية الجودة (SVG لو ممكن)
- [ ] صور حقيقية للمشاريع (أو تأكيد إن الصور الحالية Render/Placeholder هتفضل مؤقتًا)
- [ ] بيانات المشاريع الفعلية: Location, Year, Scope of Work لكل مشروع
- [ ] أرقام هاتف وإيميلات التواصل الفعلية
- [ ] روابط السوشيال ميديا الفعلية (LinkedIn, Instagram)
- [ ] شعارات العملاء (Emaar, Sodic, TMG... إلخ لو دول عملاء حقيقيين وليسوا للتوضيح فقط)
- [ ] الوظائف المفتوحة الحالية إن وجدت
- [ ] بيانات دخول الأدمن (Email + كلمة سر مبدئية هيتم تغييرها)

---

## 11. خطة الأمان الكاملة (Security Plan)

الخطة دي بتغطي كل طبقة أمان لازمة قبل ما نبدأ فعليًا في بناء الـ Admin Dashboard والـ Backend (المرحلة 4 و6 في القسم 9). كل بند هنا لازم يتطبق كـ Middleware أو Service مستقل في الـ Backend، ومربوط بنماذج البيانات الجديدة في القسم 8 (`AdminUser`, `RefreshToken`, `PasswordResetToken`).

### 11.1 الـ JWT — التوقيع والـ Payload
- توقيع التوكن بـ **HS256** (أو **RS256** لو هيبقى فيه أكتر من خدمة/سيرفر بيتحقق من التوكن).
- الـ Payload يحتوي على **`sub`, `exp`, `role` بس** — ممنوع أي بيانات حساسة أو باسووردات جوه الـ Payload لأنه مقروء (Base64) مش مشفر.
- الـ Access Token عمره **قصير جدًا: 15 دقيقة**، ويتعوض بـ Refresh Token (تفصيل في 11.2).
- **إلزامي عند التحقق من التوكن في السيرفر**: تثبيت الخوارزمية المتوقعة صراحة في الكود (`algorithms: ['HS256']`) ورفض أي توكن جاي بـ `alg: none` فورًا — دي أشهر ثغرة في مكتبات الـ JWT القديمة.

### 11.2 نظام الجلسات والـ Refresh Token Rotation
| البند | القيمة/السلوك |
|---|---|
| Access Token | عمره 15 دقيقة، يتخزن **In-Memory** في الـ Client (مش Cookie ومش localStorage) |
| Refresh Token | يتخزن في Cookie بخصائص **HttpOnly, Secure, SameSite=Strict**، ومقفول على مسار `/api/refresh/` بس |
| جدول التوكنز | جدول في الـ DB (`RefreshToken`)، كل جلسة مربوطة بـ `family_id` منفصل، وبيسجل الحالة (Active/Revoked) والـ IP والـ User-Agent |
| عند التجديد (Refresh) | يتولّد زوج جديد (Access + Refresh)، ويتلغي القديم مع **Grace Period مدته 5 ثوانٍ** يسمح فيه للتوكن القديم يشتغل — عشان يتفادى تضارب الطلبات المتزامنة (Race Conditions) |
| لو حد استخدم توكن ملغي بعد الـ 5 ثوانٍ | يعتبر ده **هجوم**، ويتم إلغاء **كل عائلة التوكنز** (كل الـ `family_id`) فورًا + إرسال إشعار أمني للمستخدم |
| عند تسجيل الخروج (Logout) | يتم حذف الـ Cookie + تحديث حالة **كل** توكنز العائلة في الـ DB لـ Revoked |
| أقصى مدة صلاحية (Absolute Expiry) | 30 يوم من أول تسجيل دخول للعائلة، مهما اتجدد التوكن |
| Garbage Collection | Cron Job يومي يمسح التوكنز المنتهية من الـ DB لتخفيف الضغط |

### 11.3 التفويض (Authorization) — طبقتين، وقفل ثغرة الـ IDOR
1. **Role Middleware (خشن — Coarse)**: بيقرأ `req.user.role`، ويرجع **403** لو الـ route محتاج role معين والـ user معندوش.
2. **Ownership Check (ناعم — Fine)**: في أي handler بيتعامل مع مورد معين (تعديل/حذف)، لازم:
   - نجيب المورد **من الـ DB نفسه** (مش من الـ URL).
   - نقارن `resource.ownerId` مع `req.user.id`.
   - نرجع **403** لو مختلفين، إلا لو الـ user دوره `admin`.
3. **قواعد إلزامية**:
   - ممنوع الثقة في أي ID جاي في الـ URL لتحديد الملكية.
   - ممنوع الاعتماد على إخفاء الأزرار في الـ Frontend كحماية — **كل الفحص لازم يبقى في الـ Backend**.

الفرق بين الطبقتين هو اللي بيقفل ثغرة الـ **IDOR** (Insecure Direct Object Reference) تمامًا: الـ Role Middleware بيتأكد إن الدور مسموح له بالعملية أصلًا، والـ Ownership Check بيتأكد إن الـ Resource ده بتاع الـ User ده تحديدًا.

### 11.4 الحماية الافتراضية (Default Deny) على كل الـ Routes
- Middleware واحد بيتحقق من كل Request قبل ما يوصل لأي route:
  - يقرأ التوكن من الـ `Authorization` header أو الـ httpOnly Cookie.
  - يتحقق منه بخوارزمية مثبتة في الكود (allow-list، ورفض `alg:none`)، ويفحص الـ `exp`.
  - لو تمام: يحط الـ user في `req.user` ويكمّل. لو لأ: **401**.
- الـ Middleware ده مطبّق على **كل الـ Routes افتراضيًا**، وفيه قائمة بيضاء صريحة (Explicit Whitelist) للـ Routes العامة بس: `login`, `register`, `reset-password`.
- Middleware ثاني منفصل للـ Roles بيرجع **403 Forbidden** لو الـ User مش مصرح له (زي محاولة وصول لـ route خاص بالـ Admin).

### 11.5 الحماية من الـ Brute Force — Rate Limiting بطبقتين
- تفعيل `app.set('trust proxy', 1)` عشان نقرأ الـ IP الحقيقي من هيدر `X-Forwarded-For` بشكل صح خلف أي Load Balancer/Proxy.
- استخدام مكتبة **`rate-limiter-flexible`** مع **`ioredis`** كـ Shared Store — ده ضروري عشان يشتغل صح لو السيرفر شغال على أكتر من Instance، ومنعًا لثغرات الـ Window Edge (يعني حد يستنى لحظة تجدد الـ Window عشان يحاول تاني).
- **Dual-Key Strategy**:
  | المفتاح | الحد | السبب |
  |---|---|---|
  | IP | 10 محاولات / 15 دقيقة | مراعاة الشبكات اللي وراها أكتر من مستخدم (NAT) |
  | Email | 5 محاولات فاشلة + Exponential Backoff | يمنع استخدام محاولات الفشل كأداة لعمل Lockout لحساب شخص تاني (Lockout Abuse) |
- استخدام `consume()` على **المحاولات الفاشلة بس**، وتصفير عداد الحساب فور نجاح تسجيل الدخول.
- لو المستخدم تخطى الحد: يتمنع الـ Request من الوصول أصلًا لعمليات الـ DB أو تجزئة bcrypt (توفير موارد + منع Timing Attacks)، ويترجع **429** برسالة عامة (Generic) بدون أي تفاصيل تكشف هل الإيميل موجود أصلًا ولا لأ (Anti User-Enumeration).
- إرفاق هيدر `Retry-After` وهيدرز `X-RateLimit-*` القياسية، وتسجيل كل رفض في الـ Security Logs.
- معالجة انقطاع الاتصال بـ Redis باستراتيجية **Fail-Open** (يعني النظام يفضل شغال حتى لو Redis واقع، بدل ما يوقف الموقع كله) مع تسجيل تفصيلي للخطأ في الـ Error Log.

### 11.6 استعادة كلمة المرور والتحقق من الإيميل (Password Reset Flow)
1. عند طلب الـ Reset: توليد Token عشوائي بـ `crypto.randomBytes(32)`، وتخزين **SHA-256 Hash** بتاعه في الـ DB بس (مش الـ Token نفسه) مع صلاحية **15 دقيقة** وعلامة `used: false`.
2. مهمة إرسال الإيميل تتنفذ في **Background Job**، والرد يترجع **موحد وفوري** بغض النظر هل الإيميل موجود فعلًا ولا لأ — ده بيمنع ثغرتين مع بعض: **Account Enumeration** و**Timing Attacks**.
3. رابط الإيميل بيعرض الـ UI بطلب **GET** بس، والـ Token **لا يُستهلك إلا** عن طريق طلب **POST** صريح بيحمل الباسورد الجديد.
4. مقارنة الـ Tokens تتم بـ `crypto.timingSafeEqual` (مش `===` العادي) لمنع Timing Attacks عند المقارنة نفسها.
5. عند نجاح الـ Reset:
   - الباسورد الجديد يترفم بـ **bcrypt**.
   - الـ Token يتعلّم كـ **مستهلك (used: true)**.
   - **يتم إبطال وحذف كل الـ Refresh Tokens والـ Sessions القديمة** الخاصة بالمستخدم فورًا — عشان لو حد سرق الجلسة قبل كده، يتقفل بره فورًا.

### 11.7 ممارسات أمان عامة إضافية
- الحماية من الهجمات الشائعة: **SQL/NoSQL Injection** (استخدام ORM/Parameterized Queries)، **XSS** (تنظيف/Escape أي مدخلات المستخدم قبل العرض)، **CSRF** (خصوصًا مع الاعتماد على Cookies للـ Refresh Token).
- **HTTPS إجباري** على كل الـ Routes، بما فيها صفحة الدخول المخفية (القسم 7.1).
- **النسخ الاحتياطي (Backups)** دوري للـ Database، وموثّق إجراء الاسترجاع.
- **تشفير البيانات الحساسة** وقت التخزين (Passwords عبر bcrypt، Tokens عبر Hashing زي أعلاه — لا نخزن أي Secret كـ Plain Text في أي مكان).
- لو هيبقى فيه أكتر من مسؤول واحد على اللوحة مستقبلًا، الـ Role في `AdminUser` (القسم 8) جاهز لدعم مستويات صلاحية إضافية (`admin` / `editor`) من غير ما نغيّر البنية.

---

## 12. الخطوات التالية المقترحة (Next Steps)

بناءً على تدقيق الكود الحالي (القسم 9.1) وخطة الأمان (القسم 11)، الترتيب المنطقي للخطوات الجاية:

0. **(أولوية قبل أي حاجة تانية) تأكيد اختيار الاستضافة** (VPS بقرص دائم أو Turso/LibSQL) قبل ما نبدأ نكتب أي كود Backend يعتمد على SQLite، وتأكيد لو هنحتاج Redis (القسم 11.5) بناءً على القرار ده.
1. **إكمال الصفحات الثابتة الناقصة** (Studio, Services, How We Work, Contact) عشان روابط الـ Navigation الموجودة فعلًا في `lib/site.ts` تشتغل بدل ما تدّي 404.
2. **بناء صفحات الـ Dynamic** (Projects listing + Project Details, Careers + Job Details) وربطها بالـ Mock Data الموجودة أصلًا كخطوة أولى، تمهيدًا لربطها بـ DB حقيقية بعدين.
3. **البدء في الـ Backend**: إعداد الـ Database، وبناء نموذج `AdminUser` والـ Auth الأساسي (JWT + Middleware من القسم 11.1 و11.4) كأول حجر أساس، لأن كل باقي نظام الأمان (Rate Limiting، Refresh Rotation، Password Reset) مبني فوقه.
4. **تفعيل Contact Form و30-Minutes Consultation Form** فعليًا وربطهم بموديل `ContactSubmission`.
5. **بناء الـ Admin Dashboard** (Hidden Login + كل الـ CRUD المذكورة في القسم 7.2) مع تطبيق كل بنود الأمان في القسم 11 من أول يوم — مش كخطوة لاحقة منفصلة.
6. **تفعيل EN/AR الفعلي** (i18n + RTL) بما إنها مذكورة كميزة تنافسية أساسية في القسم 2.
7. **جمع المحتوى الحقيقي من العميل** (القسم 10) — البيانات دي محتاجة توصل بدري عشان متبقاش هي آخر حاجة قبل الإطلاق.
8. **Responsive QA حقيقي** على الأجهزة الفعلية (القسم 6) بعد ما الصفحات كلها تخلص، مش بس على الـ Home.

---

**آخر تحديث:** الخطة اتحدثت بعد استلام متطلبات الأمان الكاملة (القسم 11)، مراجعة كود المشروع الحالي (`viwan.zip` — القسم 9.1)، واعتماد الـ Tech Stack النهائي في القسم 3 (TypeScript/JavaScript, SQLite, Next.js 14 App Router, React 18, Node.js, Tailwind CSS).
