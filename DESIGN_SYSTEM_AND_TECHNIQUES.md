# 🏛️ وثيقة المهارات البصرية، الألوان وهندسة التحريك (Design System & Motion Architecture)

تم إعداد هذا الدليل الشامل بالاعتماد على التحليل المعماري والبرمجي الدقيق للمواقع المرجعية الثلاثة:
1. **Hany Saad Innovations (HSI)**
2. **صروح الثقة (Soroh Theqa)**
3. **Mona Hussein Design House (MHDH)**

---

## 🎨 1. باليتة الألوان المرجعية (Color Palettes & Harmonies)

### أ. الموقع الأول: Hany Saad Innovations (طابع الفخامة المعمارية الحداثية - Minimalist Luxury)
* **اللون الأساسي للواجهات والتباين:** أسود داكن عميق `#000000` وأبيض نقي `#FFFFFF`.
* **الخلفيات الهادئة الفاتحة (Off-White/Canvas):** `#F5F5F5` و `#EEEEEE` (تمنح الصور المعمارية مساحة للتنفس).
* **لون التمييز (Accent Tint):** برتقالي نحاسي هادئ `#F76000` / `#D48B38` للأزرار والروابط التفاعلية `︎`.
* **الدرجات الثانوية للنصوص:** رمادي داكن `#333333` ورمادي متوسط `#666666` و `#999999`.

### ب. الموقع الثاني: صروح الثقة (طابع تجاري هندسي واثق - Commercial Fit-out Authority)
* **لون الهوية الرئيسي (Primary Accent):** أحمر طوبي معاصر `#F04036`.
* **لون الهوية الثانوي (Secondary Gold):** أصفر عنبري دافئ `#FFC527` (للـ Hover والحالات الخاصة).
* **لون الخلفيات الداكنة والفوتر:** كحلي فحمي داكن `#1A1C20` و `#111111`.
* **خلفيات البطاقات والكونتينرات:** أبيض ناصع `#FFFFFF` مع مساحات رمادية ناعمة `#F4F4F4` وحدود رمادية `#E2E2E2`.
* **نصوص العناوين والفقرات:** أسود كربوني `#000000` ورمادي قراءة متزن `#767676`.

### ج. الموقع الثالث: منى حسين MHDH (طابع سينمائي راقٍ وعصري - Cinematic High-End)
* **الخلفية الداكنة الفاخرة (Dark Base):** رمادي أسود دافئ `#0D0D0D` و `#121212`.
* **الألوان التمييزية الفخمة (Luxury Accents):**
  * ذهبي عسلي شفاف: `rgba(255, 183, 0, 0.2)` و `#D4AF37`.
  * تدرجات زجاجية فخمة (Glassmorphism Dark): `rgba(0, 0, 0, 0.56)` و `rgba(255, 255, 255, 0.1)`.
* **لون النصوص والأيقونات:** أبيض بلوري ناصع `#FFFFFF` ورمادي فضي باهت `rgba(255, 255, 255, 0.7)`.
* **ألوان الحدود والخطوط الفاصلة:** خطوط دقيقة شبه شفافة `rgba(255, 255, 255, 0.2)`.

---

### 🌟 الباليتة الموحدة المقترحة لمشروعنا ليتفوق عليهم (The Superior Palette):
```css
:root {
  /* الخلفيات */
  --bg-primary: #0A0A0B;          /* أسود عميق ناعم غير مجهد للعين */
  --bg-secondary: #141417;        /* بطاقات ومعارض المشاريع */
  --bg-light: #F8F9FA;            /* للأقسام ذات الطابع الأبيض العاجي الفاخر */
  --bg-glass: rgba(18, 18, 22, 0.75); /* تأثير الزجاج المصقول */

  /* التمييز المعماري والذهب المعاصر */
  --accent-gold: #C5A880;         /* شامبين ذهبي ملكي راقٍ */
  --accent-gold-hover: #D8B98F;
  --accent-bronze: #E07A5F;       /* برونزي ترابي أنيق */
  --accent-glow: rgba(197, 168, 128, 0.15);

  /* النصوص */
  --text-pure: #FFFFFF;
  --text-muted: #9E9E9E;
  --text-dark: #121214;

  /* الحدود والخطوط الدقيقة */
  --border-subtle: rgba(255, 255, 255, 0.12);
  --border-gold: rgba(197, 168, 128, 0.35);
}
```

---

## 🎬 2. هندسة الحركة والأنيميشن (Motion Engineering)

### الحركة الأولى: تحريك الصور والعناصر من أسفل إلى أعلى (Bottom-to-Top Reveal)
هذا التأثير هو العمود الفقري في مواقع الفخامة المعمارية؛ لا يظهر العنصر فجأة بل يصعد بوقار وفخامة مع تزايد الشفافية وتلاشي الستارة (Curtain Reveal).

#### كود التنفيذ بـ CSS النقي:
```css
/* كلاس الحركة الأساسي */
.reveal-up {
  opacity: 0;
  transform: translateY(60px);
  clip-path: inset(100% 0 0 0); /* قص الصورة من الأسفل */
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.8s ease-out,
              clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity, clip-path;
}

/* عند دخول العنصر في مجال رؤية المستخدم */
.reveal-up.is-inview {
  opacity: 1;
  transform: translateY(0);
  clip-path: inset(0 0 0 0); /* إزالة القص لظهور الصورة كاملة */
}
```

#### كود GSAP ScrollTrigger الاحترافي (المستخدم في أرقى المواقع العالمية):
```javascript
gsap.utils.toArray('.reveal-up').forEach((elem) => {
  gsap.fromTo(elem, 
    { y: 70, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: elem,
        start: "top 85%", // يبدأ التأثير عند وصول العنصر لـ 85% من الشاشة
        toggleActions: "play none none reverse"
      }
    }
  );
});
```

---

### الحركة الثانية: تحريك الصور والعناوين من اليسار إلى المنتصف (Left-to-Center Slide)
موجودة بقوة في عناوين HSI وموقع Mona Hussein عند فتح الأقسام والـ Split Screens حيث يتدفق المحتوى أفقياً ليعطي إيحاءً بالامتداد والاتساع المعماري.

#### كود التنفيذ بـ CSS:
```css
.reveal-left {
  opacity: 0;
  transform: translateX(-100px);
  transition: transform 1.1s cubic-bezier(0.25, 1, 0.5, 1),
              opacity 0.9s ease-out;
  will-change: transform, opacity;
}

.reveal-left.is-inview {
  opacity: 1;
  transform: translateX(0);
}

/* في حالة اللغة العربية RTL نعكس الاتجاه تلقائياً */
[dir="rtl"] .reveal-left {
  transform: translateX(100px);
}
[dir="rtl"] .reveal-left.is-inview {
  transform: translateX(0);
}
```

---

### الحركة الثالثة: انفتاح الستارة المزدوجة في الهيرو (Split-Screen Hero Reveal)
الميزة التي تنفرد بها مقدمة **Mona Hussein**، حيث تنشق الشاشة أو الصورة من المنتصف كستارة مسرح تكشف عما بداخلها (`.split-left` و `.split-right`).

#### كود التقنية:
```css
.split-hero-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.split-hero-curtain-left,
.split-hero-curtain-right {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  background: #0D0D0D;
  z-index: 10;
  transition: transform 1.4s cubic-bezier(0.77, 0, 0.175, 1);
}

.split-hero-curtain-left {
  left: 0;
  transform-origin: left;
}

.split-hero-curtain-right {
  right: 0;
  transform-origin: right;
}

/* حالة الانفتاح بعد تحميل الصفحة */
.split-hero-container.loaded .split-hero-curtain-left {
  transform: scaleX(0);
}
.split-hero-container.loaded .split-hero-curtain-right {
  transform: scaleX(0);
}
```

---

### الحركة الرابعة: شريط الماركي اللانهائي الفاخر (Infinite Architectural Marquee)
يستخدمه **Hany Saad** لكتابة شعار المكتب وفروعه (CAI - DXB - KSA) بشكل شريطي متحرك، وتستخدمه **صروح الثقة** لعرض معرض صور مستمر بدون توقف.

#### كود شريط الـ Marquee السلس:
```css
.marquee-wrapper {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  user-select: none;
}

.marquee-track {
  display: flex;
  flex-shrink: 0;
  animation: marquee-scroll 25s linear infinite;
}

.marquee-wrapper:hover .marquee-track {
  animation-play-state: paused; /* توقف هادئ عند وضع الماوس */
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

[dir="rtl"] .marquee-track {
  animation-name: marquee-scroll-rtl;
}

@keyframes marquee-scroll-rtl {
  0% { transform: translateX(0); }
  100% { transform: translateX(50%); }
}
```

---

### الحركة الخامسة: خطوط التقدم والأرقام المعمارية المتوسعة (Expanding Line Indicator)
في موقع منى حسين، عند تبديل الخدمات من `01/07` إلى `02/07` يتمدد خط سفلي وعلوي بحركة خطية دقيقة:
```css
.expanding-line {
  position: relative;
}

.expanding-line::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--accent-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.expanding-line.active::after {
  transform: scaleX(1);
}
```

---

### الحركة السادسة: السلاسة التامة للتمرير (Smooth Inertia Scrolling - Lenis)
الموقع يستخدم **Lenis Smooth Scroll** الذي يلغي قفزات الماوس ويجعل تجربة التمرير تبدو كأنها فيلم سينمائي سلس بـ 60/120 إطار في الثانية:
```javascript
// Lenis Initialization
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

---

## 🛠️ 3. الأدوات والمكتبات الموصى بها لمشروعنا
1. **HTML5 / CSS3 الحديثة / Tailwind CSS:** لأداء خفيف جداً وتحكم دقيق في الأبعاد والتجاوب.
2. **GSAP + ScrollTrigger:** لتزامن حركات الصور والنصوص عند التمرير بأعلى سلاسة ممكنة.
3. **Lenis Scroll:** لإعطاء إحساس النعومة السينمائي المشابه لمنى حسين.
4. **Swiper.js:** لمعارض المشاريع وسلايدر الخدمات والتنقل الرقمي (01 - 07).
5. **Interactive Before/After Slider:** لإبهار العميل بعرض مقارنات التشطيب والتصميم قبل التنفيذ وبعده.

---

## 📋 4. ملخص المعايير التي تجعلنا نتفوق عليهم:
* ✅ الجمع بين فخامة الخطوط والمعارض الهندسية الحرّة لـ **HSI**.
* ✅ التفاعلية العالية والسرد وسلاسة التمرير لـ **Mona Hussein**.
* ✅ قوة الإقناع والتحويل التجاري وسهولة التواصل والاتصال والواتساب لـ **صروح الثقة**.
* ✅ سرعة تحميل خرافية، وتوافق تام مع الهواتف الذكية، ودعم فوري للغتين العربية والإنجليزية.
