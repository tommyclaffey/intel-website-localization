/* ============================================================
   Intel — Sustainability Through the Ages
   Localization: strings, direction, and number formatting.

   WHY A SEPARATE FILE: the page has one job per file already
   (structure / style / behaviour). Copy is a fourth concern, and
   it is the one that changes most often. Translators should never
   have to open index.html.
   ============================================================ */

/* Four languages, chosen to break the layout in four different ways:

   en  the source
   es  ~20% longer than English — proves nothing is sized to fit the
       original copy
   ja  no spaces between words, so it cannot wrap the way Latin script
       does, and needs its own font stack
   ar  right-to-left — the only one that requires code changes, not just
       strings                                                        */

const TRANSLATIONS = {

  en: {
    'lang.label': 'English',
    'doc.title': 'Intel — Sustainability Through the Ages',
    'hero.title': 'Sustainability through the ages',
    'hero.sub': 'Explore Intel’s journey through time — from its founding to a net-zero future — and how a commitment to innovation has shaped a more sustainable path for technology and the planet.',
    'tl.heading': 'Six decades of milestones',
    'c1968.name': 'Intel is founded',
    'c1968.body': 'Robert Noyce and Gordon Moore found Intel in Mountain View, California, beginning a company whose efficiency gains would later shape the energy footprint of computing worldwide.',
    'c1968.alt': 'An Intel chip on a circuit board, picked out in colour against black and white',
    'c1971.name': 'The first microprocessor',
    'c1971.body': 'The Intel 4004 puts a complete CPU on a single chip. Integration is the original efficiency story: fewer parts, less material, and far less power for the same work.',
    'c1971.alt': 'Macro photograph of an Intel Core processor seated in its socket',
    'c2007.name': 'Lead-free processors',
    'c2007.body': 'Intel goes 100% lead-free across its entire 45nm processor family, removing a hazardous heavy metal from products that ship by the hundreds of millions.',
    'c2007.alt': 'An Intel Core processor at the centre of a blue circuit board',
    'c2008.name': 'Largest green power buyer',
    'c2008.body': 'Intel becomes the largest voluntary purchaser of green power in the United States with a 1.3 billion kilowatt-hour commitment, and holds the top spot for years afterwards.',
    'c2008.alt': 'Rows of solar panels in bright sun',
    'c2020.name': 'The RISE strategy',
    'c2020.body': 'Intel launches RISE — Responsible, Inclusive, Sustainable, Enabling — setting 2030 goals and committing to use its scale to move the wider technology industry, not just its own operations.',
    'c2020.alt': 'Wind turbines on open land',
    'c2030.name': 'Net positive water',
    'c2030.body': 'Goals for the decade: 100% renewable electricity globally, net positive water, and zero total waste to landfill. Chip fabrication is water-intensive, which is exactly why returning more than is used matters.',
    'c2030.alt': 'Aerial view of a water treatment facility',
    'c2040.name': 'Net-zero operations',
    'c2040.body': 'A commitment to net-zero greenhouse gas emissions across Intel’s own operations — Scope 1 and 2 — covering the factories and the electricity that runs them.',
    'c2040.alt': 'Wind farm at sunset',
    'c2050.name': 'Net-zero value chain',
    'c2050.body': 'The hardest target: net-zero upstream emissions across suppliers and materials. Scope 3 is most of a chip company’s real footprint, and it cannot be reached alone.',
    'c2050.alt': 'Aerial view of a dense pine forest',
    'hint.desktop': 'Scroll or drag the bar to move through time · hover a card for the detail',
    'hint.mobile': 'Scroll to move through time · tap a card for the detail',
    'footer.a': 'Student coursework. Milestones are drawn from Intel’s published RISE commitments and press releases. Photography is CC0 and Unsplash-licensed; the Intel wordmark is public domain via Wikimedia Commons. Per-image credits are in',
    'footer.b': 'Intel and the Intel logo are trademarks of Intel Corporation — this page is not affiliated with or endorsed by Intel.',
    'a11y.progress': 'Timeline scroll position',
    'a11y.lang': 'Choose a language'
  },

  es: {
    'lang.label': 'Español',
    'doc.title': 'Intel — La sostenibilidad a través del tiempo',
    'hero.title': 'La sostenibilidad a través del tiempo',
    'hero.sub': 'Recorre la trayectoria de Intel a lo largo del tiempo — desde su fundación hasta un futuro de cero emisiones netas — y cómo su compromiso con la innovación ha trazado un camino más sostenible para la tecnología y el planeta.',
    'tl.heading': 'Seis décadas de hitos',
    'c1968.name': 'Se funda Intel',
    'c1968.body': 'Robert Noyce y Gordon Moore fundan Intel en Mountain View, California, y dan origen a una empresa cuyas mejoras de eficiencia acabarían definiendo la huella energética de la informática en todo el mundo.',
    'c1968.alt': 'Un chip de Intel sobre una placa de circuito, resaltado en color sobre un fondo en blanco y negro',
    'c1971.name': 'El primer microprocesador',
    'c1971.body': 'El Intel 4004 integra una CPU completa en un solo chip. La integración es la historia original de la eficiencia: menos piezas, menos material y mucha menos energía para el mismo trabajo.',
    'c1971.alt': 'Fotografía macro de un procesador Intel Core montado en su zócalo',
    'c2007.name': 'Procesadores sin plomo',
    'c2007.body': 'Intel elimina el plomo al 100% en toda su familia de procesadores de 45 nm, retirando un metal pesado peligroso de productos que se fabrican por cientos de millones.',
    'c2007.alt': 'Un procesador Intel Core en el centro de una placa de circuito azul',
    'c2008.name': 'Mayor comprador de energía verde',
    'c2008.body': 'Intel se convierte en el mayor comprador voluntario de energía verde de Estados Unidos, con un compromiso de 1300 millones de kilovatios-hora, y conserva ese primer puesto durante años.',
    'c2008.alt': 'Hileras de paneles solares bajo un sol intenso',
    'c2020.name': 'La estrategia RISE',
    'c2020.body': 'Intel lanza RISE — Responsable, Inclusiva, Sostenible y Habilitadora — fijando objetivos para 2030 y comprometiéndose a usar su escala para mover a todo el sector tecnológico, no solo a sus propias operaciones.',
    'c2020.alt': 'Aerogeneradores en campo abierto',
    'c2030.name': 'Balance hídrico positivo',
    'c2030.body': 'Objetivos de la década: 100% de electricidad renovable a nivel mundial, balance hídrico positivo y cero residuos totales a vertedero. Fabricar chips consume mucha agua, y por eso importa devolver más de la que se usa.',
    'c2030.alt': 'Vista aérea de una planta de tratamiento de agua',
    'c2040.name': 'Operaciones de cero emisiones netas',
    'c2040.body': 'Un compromiso de cero emisiones netas de gases de efecto invernadero en las operaciones propias de Intel — Alcance 1 y 2 — que abarca las fábricas y la electricidad que las alimenta.',
    'c2040.alt': 'Parque eólico al atardecer',
    'c2050.name': 'Cadena de valor de cero emisiones netas',
    'c2050.body': 'El objetivo más difícil: cero emisiones netas aguas arriba, en proveedores y materiales. El Alcance 3 es la mayor parte de la huella real de una empresa de chips, y no se alcanza en solitario.',
    'c2050.alt': 'Vista aérea de un denso bosque de pinos',
    'hint.desktop': 'Desplaza o arrastra la barra para avanzar en el tiempo · pasa el cursor sobre una tarjeta para ver el detalle',
    'hint.mobile': 'Desplaza para avanzar en el tiempo · toca una tarjeta para ver el detalle',
    'footer.a': 'Trabajo académico. Los hitos proceden de los compromisos RISE publicados por Intel y de sus notas de prensa. Las fotografías son CC0 y con licencia de Unsplash; el logotipo de Intel es de dominio público vía Wikimedia Commons. Los créditos por imagen están en',
    'footer.b': 'Intel y el logotipo de Intel son marcas registradas de Intel Corporation — esta página no está afiliada a Intel ni cuenta con su respaldo.',
    'a11y.progress': 'Posición en la cronología',
    'a11y.lang': 'Elegir idioma'
  },

  ja: {
    'lang.label': '日本語',
    'doc.title': 'Intel — 時代を越えたサステナビリティ',
    'hero.title': '時代を越えたサステナビリティ',
    'hero.sub': '創業からネットゼロの未来まで、インテルの歩みをたどります。イノベーションへの姿勢が、テクノロジーと地球のためのより持続可能な道をどう切り開いてきたのかをご覧ください。',
    'tl.heading': '60年にわたる節目',
    'c1968.name': 'インテル創業',
    'c1968.body': 'ロバート・ノイスとゴードン・ムーアがカリフォルニア州マウンテンビューでインテルを創業。この会社の効率化は、のちに世界中のコンピューティングのエネルギー消費を左右することになります。',
    'c1968.alt': 'モノクロの基板上でカラーに浮かび上がるインテル製チップ',
    'c1971.name': '世界初のマイクロプロセッサ',
    'c1971.body': 'Intel 4004 が完全な CPU を 1 つのチップに集約。集積化こそが効率化の原点です。部品も材料も減り、同じ処理をはるかに少ない電力で実現しました。',
    'c1971.alt': 'ソケットに装着された Intel Core プロセッサのマクロ写真',
    'c2007.name': '鰛フリープロセッサ',
    'c2007.body': '45nm プロセッサファミリー全体で鰛を 100% 除去。数億個単位で出荷される製品から有害な重金属を取り除きました。',
    'c2007.alt': '青い基板の中央に配置された Intel Core プロセッサ',
    'c2008.name': 'グリーン電力の最大購入者へ',
    'c2008.body': '13 億キロワット時の調達を約束し、米国におけるグリーン電力の最大の自発的購入者となり、その地位を何年にもわたって維持しました。',
    'c2008.alt': '強い日差しの下に並ぶ太陽光パネル',
    'c2020.name': 'RISE 戦略',
    'c2020.body': 'インテルは RISE（Responsible、Inclusive、Sustainable、Enabling）を発表。 2030 年目標を定め、自社の事業だけでなくテクノロジー業界全体を動かすためにその規模を用いることを約束しました。',
    'c2020.alt': '開けた土地に立つ風力発電機',
    'c2030.name': 'ウォーターポジティブ',
    'c2030.body': 'この 10 年の目標は、全世界で再生可能電力 100%、ウォーターポジティブ、埋立廃棄物ゼロ。半導体製造は水を多く使うからこそ、使った以上に戻すことに意味があります。',
    'c2030.alt': '浄水施設を上空から見た様子',
    'c2040.name': '自社事業でネットゼロ',
    'c2040.body': 'インテル自社の事業活動（スコープ 1 および 2）における温室効果ガス排出量をネットゼロにする約束で、工場とそこで使う電力が対象です。',
    'c2040.alt': '夕日に染まる風力発電所',
    'c2050.name': 'バリューチェーン全体でネットゼロ',
    'c2050.body': '最も困難な目標。サプライヤーと材料を含む上流排出量をネットゼロにします。スコープ 3 は半導体企業の実際のフットプリントの大半を占め、一社だけでは達成できません。',
    'c2050.alt': '密生する松林を上空から見た様子',
    'hint.desktop': 'スクロールまたはバーをドラッグして時代を移動 · カードにカーソルを合わせると詳細が表示されます',
    'hint.mobile': 'スクロールして時代を移動 · カードをタップすると詳細が表示されます',
    'footer.a': '学習用の課題作品です。節目はインテルが公表した RISE のコミットメントおよび報道発表に基づきます。写真は CC0 および Unsplash ライセンス、インテルのワードマークは Wikimedia Commons 経由のパブリックドメインです。画像ごとのクレジットは次のファイルに記載しています：',
    'footer.b': 'Intel および Intel ロゴは Intel Corporation の商標です。本ページはインテルと提携しておらず、同社の承認を受けたものでもありません。',
    'a11y.progress': 'タイムラインのスクロール位置',
    'a11y.lang': '言語を選択'
  },

  ar: {
    'lang.label': 'العربية',
    'doc.title': 'إنتل — الاستدامة عبر العصور',
    'hero.title': 'الاستدامة عبر العصور',
    'hero.sub': 'تابع مسيرة إنتل عبر الزمن — من تأسيسها إلى مستقبل خالٍ من الانبعاثات — وكيف رسم الالتزام بالابتكار مسارًا أكثر استدامة للتقنية وللكوكب.',
    'tl.heading': 'ستة عقود من المحطات الفارقة',
    'c1968.name': 'تأسيس إنتل',
    'c1968.body': 'أسّس روبرت نويس وجوردون مور شركة إنتل في ماونتن فيو بولاية كاليفورنيا، لتبدأ مسيرة شركة سترسم مكاسبُ كفاءتها لاحقًا البصمة الطاقية للحوسبة حول العالم.',
    'c1968.alt': 'رقاقة إنتل على لوحة دوائر، مُبرزة بالألوان على خلفية بالأبيض والأسود',
    'c1971.name': 'أول معالج دقيق',
    'c1971.body': 'وضع معالج Intel 4004 وحدة معالجة مركزية كاملة على رقاقة واحدة. التكامل هو قصة الكفاءة الأولى: قطع أقل، ومواد أقل، وطاقة أقل بكثير لأداء العمل نفسه.',
    'c1971.alt': 'صورة ماكرو لمعالج Intel Core مثبت في مقبسه',
    'c2007.name': 'معالجات خالية من الرصاص',
    'c2007.body': 'أزالت إنتل الرصاص بنسبة 100% من عائلة معالجات 45 نانومترًا بالكامل، مُخرجةً معدنًا ثقيلًا خطرًا من منتجات تُشحن بمئات الملايين.',
    'c2007.alt': 'معالج Intel Core في مركز لوحة دوائر زرقاء',
    'c2008.name': 'أكبر مشترٍ للطاقة الخضراء',
    'c2008.body': 'أصبحت إنتل أكبر مشترٍ طوعيٍ للطاقة الخضراء في الولايات المتحدة بالتزام قدره 1.3 مليار كيلوواط/ساعة، وحافظت على الصدارة لسنوات بعدها.',
    'c2008.alt': 'صفوف من الألواح الشمسية تحت شمس ساطعة',
    'c2020.name': 'استراتيجية RISE',
    'c2020.body': 'أطلقت إنتل استراتيجية RISE — مسؤولة، شاملة، مستدامة، ومُمكِّنة — وحددت أهداف 2030، ملتزمةً بتوظيف حجمها لتحريك قطاع التقنية بأكمله، لا عملياتها وحدها.',
    'c2020.alt': 'توربينات رياح في أرض مفتوحة',
    'c2030.name': 'مياه إيجابية الصافي',
    'c2030.body': 'أهداف العقد: كهرباء متجددة بنسبة 100% عالميًا، ومياه إيجابية الصافي، وصفر نفايات إلى المطامر. فصناعة الرقائق كثيفة استهلاك المياه، ولذلك تحديدًا يهم أن تُعاد أكثر مما يُستهلك.',
    'c2030.alt': 'منظر جوي لمحطة معالجة مياه',
    'c2040.name': 'عمليات خالية من الانبعاثات',
    'c2040.body': 'التزام بصافٍ صفري لانبعاثات الغازات الدفيئة عبر عمليات إنتل نفسها — النطاق 1 والنطاق 2 — ويشمل ذلك المصانع والكهرباء التي تُشغّلها.',
    'c2040.alt': 'مزرعة رياح عند الغروب',
    'c2050.name': 'سلسلة قيمة خالية من الانبعاثات',
    'c2050.body': 'الهدف الأصعب: صافٍ صفري للانبعاثات المنبعية عبر الموردين والمواد. النطاق 3 يشكل معظم البصمة الحقيقية لشركة رقائق، ولا يُمكن بلوغه منفردًا.',
    'c2050.alt': 'منظر جوي لغابة صنوبر كثيفة',
    'hint.desktop': 'مرّر أو اسحب الشريط للتنقّل عبر الزمن · مرّر المؤشر فوق بطاقة لعرض التفاصيل',
    'hint.mobile': 'مرّر للتنقّل عبر الزمن · انقر على بطاقة لعرض التفاصيل',
    'footer.a': 'عمل دراسي. المحطات مستمدة من التزامات RISE المنشورة من إنتل ومن بياناتها الصحفية. الصور برخصة CC0 ورخصة Unsplash؛ وعلامة إنتل النصية ملكية عامة عبر Wikimedia Commons. وترد اعتمادات كل صورة في',
    'footer.b': 'Intel وشعار Intel علامتان تجاريتان لشركة Intel Corporation — وهذه الصفحة غير تابعة لإنتل ولا مُعتمدة منها.',
    'a11y.progress': 'موضع التمرير في الجدول الزمني',
    'a11y.lang': 'اختر لغة'
  }
};

/* Direction is a PROPERTY OF THE LANGUAGE, not a setting. Keeping it here
   means adding Hebrew or Farsi later is a data change, not a code change. */
const RTL_LANGS = ['ar', 'he', 'fa', 'ur'];

const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'intel-timeline-lang';

window.I18N = { TRANSLATIONS, RTL_LANGS, DEFAULT_LANG, STORAGE_KEY };
