/* Content for the 13th Coding Summit site.
   Workshop names, levels, the 19 Dec flow and the Saturday session grid come from Mehmet Bener's update
   (WhatsApp, 11 Nov 2026): rows marked red in the sheet (FabArt, Generative Design, Julia) are removed.
   Seven workshops appear only in the session grid, not in the names sheet; their levels are not known yet
   (levels: [] shows "level to be announced").
   Instructor names are left out on purpose.
   Descriptions: `official` ones come from the summit's own texts; the rest are drafts to be replaced as the
   official texts and photos arrive. `pg` picks the interactive playground shown in the workshop window.
   levels: "ilkokul" (primary), "5-6", "7-8" (grades), "lise" (high school), "lise-adv" (high school, advanced).
   device: true = participants need a laptop or tablet. */

window.SUMMIT = {
  date: "2026-12-18T09:00:00+03:00",
  dateLabel: { en: "18–19 DEC 2026", tr: "18–19 ARALIK 2026" },
  registrationUrl: "",
  // Google Apps Script web-app URL that receives the registration form (POST, text/plain JSON). Empty = "opens soon".
  // Registration switch: false hides the Register button and sends register.html back to the home page.
  // The form, the Apps Script endpoint and the Google Sheet stay as they are. Set to true to open sign-ups.
  registrationOpen: false,
  registrationEndpoint: "https://script.google.com/macros/s/AKfycbxKrWLGIs22U5VpLgRlXYqRsiao5HuSTrU_-JAiUEo-iiqvwEKa8dMmhVyl6s-2Euqp7g/exec",

  // Google Forms links (Mehmet sends them by ~13 Nov). Empty = the button stays visible and says "link coming soon".
  applyFormUrl: "",
  brownieFormUrl: "",

  links: {
    email: "idealab@hisarschool.k12.tr",
    instagram: "https://www.instagram.com/hisarcs/",
    linkedin: "",
    frc: "https://6431.hisarschool.k12.tr/",
    hisarcs: "https://hisarcs.github.io/",
    previous: [
      { label: { en: "Hisar Coding Summit 2022", tr: "Hisar Coding Summit 2022" }, href: "https://hisarcs.github.io/Web/" },
      { label: { en: "HisarCS events", tr: "HisarCS etkinlikleri" }, href: "https://hisarcs.github.io/events.html" },
      { label: { en: "HisarCS", tr: "HisarCS" }, href: "https://hisarcs.github.io/" }
    ]
  },

  archive: [
    { no: 12, date: { en: "12–13 Dec 2025", tr: "12–13 Aralık 2025" }, title: { en: "Crossing the Lines: New Frontiers", tr: "Crossing the Lines: New Frontiers" }, note: { en: "Never published — source only", tr: "Hiç yayınlanmadı — yalnızca kaynak kod" }, href: "https://github.com/hisarcs/Summit25", kind: "source" },
    { no: 11, date: { en: "13–14 Dec 2024", tr: "13–14 Aralık 2024" }, href: "legacy/", kind: "local" },
    { no: 10, date: { en: "2024", tr: "2024" }, mark: "X", kind: "missing" },
    { no: 9, date: { en: "2023", tr: "2023" }, kind: "missing" },
    { no: 8, date: { en: "2–3 Apr 2022 · virtual", tr: "2–3 Nisan 2022 · sanal" }, href: "https://web.archive.org/web/20221219204118/https://event.hisarcs.com/", kind: "wayback" },
    { no: 7, date: { en: "2021", tr: "2021" }, href: "https://web.archive.org/web/20211130080913/https://event.hisarcs.com/", kind: "wayback" },
    { no: 6, date: { en: "2020", tr: "2020" }, href: "https://web.archive.org/web/20201205122817/http://event.hisarcs.com/", kind: "wayback" },
    { no: 5, date: { en: "2019", tr: "2019" }, href: "https://web.archive.org/web/20190916082949/http://event.hisarcs.com/", kind: "wayback" },
    { no: 4, date: { en: "2018", tr: "2018" }, href: "https://web.archive.org/web/20180928203754/http://event.hisarcs.com/", kind: "wayback" },
    { no: 3, date: { en: "2017", tr: "2017" }, href: "https://web.archive.org/web/20170509214955/http://event.hisarcs.com/", kind: "wayback" },
    { no: 2, date: { en: "2016", tr: "2016" }, href: "https://web.archive.org/web/20160505045630/http://event.hisarcs.com/", kind: "wayback" },
    { no: 1, date: { en: "20 May 2015", tr: "20 Mayıs 2015" }, href: "https://web.archive.org/web/20150520014621/http://event.hisarcs.com/", kind: "wayback" }
  ],

  categories: {
    robotics: { en: "Robotics", tr: "Robotik", color: "#c52a43" },
    ai: { en: "AI & Data", tr: "Yapay Zeka & Veri", color: "#efc232" },
    code: { en: "Code & Games", tr: "Kod & Oyun", color: "#6fa8ff" },
    fab: { en: "Digital Fabrication", tr: "Dijital Üretim", color: "#f4f1c1" },
    design: { en: "Design & Art", tr: "Tasarım & Sanat", color: "#ff8a5c" },
    electronics: { en: "Electronics", tr: "Elektronik", color: "#7be0b0" },
    innovation: { en: "Innovation", tr: "İnovasyon", color: "#c8a6ff" }
  },

  levels: {
    "ilkokul": { en: "Primary school", tr: "İlkokul" },
    "5-6": { en: "Grades 5–6", tr: "5–6. sınıf" },
    "7-8": { en: "Grades 7–8", tr: "7–8. sınıf" },
    "lise": { en: "High school", tr: "Lise" },
    "lise-adv": { en: "High school · advanced", tr: "Lise · ileri" }
  },

  workshops: [
    { id: "cardboard-robots-with-micro-bit", cat: "electronics", pg: "robot", levels: ["5-6", "7-8"], device: true,
      title: { tr: "Karton Robotlar: Tasarla ve Kodla!", en: "Cardboard Robotics: Design & Code!" },
      desc: { tr: "Kartondan robot arabalar yap, micro:bit ile programla ve temel elektroniği öğren. Atölyenin sonunda kendi tasarladığın robotu yarıştırıyorsun.",
              en: "Build cardboard robot cars, program them with micro:bit and learn basic electronics — then race the robot you designed." } },
    { id: "lemon-building-bio-inspired-robots", cat: "robotics", pg: "robot", levels: ["5-6", "7-8"], device: true,
      title: { tr: "Doğadan İlham Alan Robotlar: Lemon Atölyesi", en: "Bio-Inspired Robotics: Lemon Workshop" },
      desc: { tr: "Lemon, yeni başlayanların mekanik, elektronik, 3D tasarım ve biyomimetik robotlar hakkında bilgisini geliştiren bir robotik eğitim kiti. Bir robot yapmanın her adımını keşfediyorsun.",
              en: "Lemon is a robotics kit that helps beginners learn mechanics, electronics, 3D design and biomimetic robots while discovering every step of making a robot." } },
    { id: "snap-fit-3d-toy-design-and-making-in-tinkercad", cat: "fab", pg: "joint", levels: ["5-6", "7-8"], device: true,
      title: { tr: "Hayal Gücünden 3D'ye: Tinkercad Atölyesi", en: "From Imagination to 3D: Tinkercad Workshop" },
      desc: { tr: "Yapıştırıcısız, birbirine geçen parçalardan oluşan bir oyuncak tasarla ve 3D yazıcıda üret.",
              en: "Design a toy from parts that click together without glue, then 3D print it." } },
    { id: "ar-interactive-mechanical-systems-automata", cat: "robotics", pg: "gears", levels: ["ilkokul", "5-6", "7-8"], device: true,
      title: { tr: "AR Etkileşimli Mekanik Sistemler: Otomata Atölyesi", en: "AR-Enhanced Mechanical Systems: Automata Workshop" },
      desc: { tr: "Otomatalar, K12 öğrencilerine mekanik sistemleri öğretmek için tasarlanıp üretilmiş 3D kitler. Dişliler ve kam mekanizmaları gibi günlük hayatta sık karşılaşılan sistemleri kurarken, AR ile hazırlanmış etkileşimli animasyonlar sayesinde bu sistemlerin nasıl çalıştığını görüyorsun.",
              en: "Automata are 3D kits designed and made to teach mechanical systems to K12 students. You build everyday mechanisms like gears and cams, then watch how they work through interactive AR animations." } },
    { id: "swift-playground-an-image-recognition-app", cat: "ai", pg: "vision", levels: ["7-8", "lise"], device: true,
      title: { tr: "Görüntü Tanıma: Kendi Uygulamanı Geliştir!", en: "Image Recognition: Build Your Own App!" },
      desc: { tr: "Swift ve Xcode ile görüntüleri tanıyan bir uygulama yaz: kamera, model ve arayüzü bir araya getir.",
              en: "Write an app that recognises images with Swift and Xcode, bringing the camera, a model and the interface together." } },
    { id: "brother-embroidery-machine", cat: "fab", pg: "sticker", levels: ["7-8", "lise"], device: true,
      title: { tr: "Moda Stüdyosu: Dijital Nakış", en: "Fashion Studio: Digital Embroidery" },
      desc: { tr: "Kendi desenini dijital nakışa dönüştür ve nakış makinesinde kumaşa işle.",
              en: "Turn your own pattern into digital embroidery and stitch it onto fabric on an embroidery machine." } },
    { id: "machine-learning-for-kids", cat: "ai", pg: "ml", levels: ["ilkokul"], device: true,
      title: { tr: "Çocuklar İçin Makine Öğrenimi", en: "Machine Learning for Kids" },
      desc: { tr: "Etkileşimli etkinliklerle makine öğrenimine giriş: model eğitmeyi, tahmin yapmayı ve yapay zekanın etiğini eğlenceli bir şekilde öğreniyorsun.",
              en: "A playful introduction to machine learning through hands-on activities: train a model, make predictions and talk about the ethics of AI." } },
    { id: "2d-game-design-with-godot-monster-invasion", cat: "code", pg: "game", levels: ["ilkokul", "5-6"], device: true,
      title: { tr: "Oyun Tasarım Stüdyosu: Godot Atölyesi", en: "Game Design Studio: Godot Workshop" },
      desc: { tr: "Godot oyun motoruyla kendi 2D oyununu yap: karakter hareketi, düşmanlar, çarpışmalar ve skor.",
              en: "Make your own 2D game in the Godot engine: player movement, enemies, collisions and a score." } },
    { id: "technovation-girls-prototyping-for-impact", cat: "innovation", pg: "impact", levels: ["ilkokul", "5-6", "7-8", "lise"], device: true,
      title: { tr: "Technovation Girls: Fark Yarat", en: "Technovation Girls: Make a Difference" },
      desc: { tr: "Gerçek bir topluluk problemini seç, bir uygulama fikri geliştir ve hızlıca prototipini çıkar.",
              en: "Pick a real problem in your community, shape an app idea around it and prototype it fast." } },
    { id: "rnd-rapid-prototyping-minds-and-machines", cat: "innovation", pg: "rnd", official: true, levels: ["lise"], device: true,
      title: { tr: "Fikirden Prototipe: Ar-Ge ve Hızlı Üretim", en: "From Idea to Prototype: R&D Quickshop" },
      desc: { tr: "Bu atölye, STEM, toplum ve teknoloji arasındaki etkileşimi anlayarak disiplinlerarası problemleri çözmeyi hedefler. Katılımcılar, karmaşık sistemleri analiz ederken hesaplamalı düşünme ve tasarım odaklı araştırma becerilerini geliştirir. Oturum boyunca fikir üretme, problem tanımlama, hipotez kurma ve proje yazımı aşamaları uygulanır. Bu süreç, öğrencilerin düşüncelerini sistematik biçimde formüle edip araştırmaya dönüştürmesini sağlar.",
              en: "This workshop tackles interdisciplinary problems by understanding how STEM, society and technology interact. Participants build computational thinking and design-led research skills while analysing complex systems, and practise idea generation, problem definition, hypothesis building and proposal writing — turning their thinking into structured research." } },
    { id: "cybersecurity-workshop-router-penetration-testin", cat: "code", pg: "cyber", levels: ["lise"], device: true,
      title: { tr: "Bir Hacker Gibi Düşün: Metasploit Atölyesi", en: "Think Like a Hacker: Metasploit Workshop" },
      desc: { tr: "Bir hacker gibi düşün: güvenli bir test ortamında sistemlerin zayıf noktalarını Metasploit ile bul ve bu saldırılara karşı nasıl korunacağını öğren.",
              en: "Think like a hacker: use Metasploit to find weak spots in a safe test lab, and learn how to defend against those attacks." } },
    { id: "vibe-coding-build-apps-with-ai", cat: "code", pg: "vibe", levels: ["lise"], device: true,
      title: { tr: "Vibe Coding: Yapay Zekâ ile Uygulama Geliştir!", en: "Vibe Coding: Build Apps with AI" },
      desc: { tr: "Ne istediğini anlat, yapay zeka kodlasın: fikirden çalışan bir uygulamaya, yapay zekayla birlikte.",
              en: "Describe what you want and let AI write the code: go from an idea to a working app, together with AI." } },
    { id: "creative-coding-art-meets-algorithms", cat: "design", pg: "generative", levels: ["lise"], device: true,
      title: { tr: "Yaratıcı Kodlama: Algoritmik Sanat Atölyesi", en: "Creative Coding: Art Meets Algorithms" },
      desc: { tr: "Kodla çizim yap: döngüler, rastgelelik ve matematikle canlı, etkileşimli sanat eserleri üret.",
              en: "Draw with code: use loops, randomness and maths to make living, interactive art." } },
    { id: "tiny-ml-ai-meets-electronics", cat: "electronics", pg: "ml", levels: ["lise"], device: true,
      title: { tr: "TinyML: Elektronik Devrelerde Yapay Zeka", en: "TinyML: AI Meets Electronics" },
      desc: { tr: "Küçük mikrodenetleyicilerde çalışan yapay zeka modelleri: sensör verisi topla, modeli eğit, karta yükle.",
              en: "AI models that run on tiny microcontrollers: collect sensor data, train a model and put it on the board." } },
    { id: "pcb-design", cat: "electronics", pg: "pcb", levels: ["lise-adv"], device: true,
      title: { tr: "Bakır Yollarda Kuantum Sıçrama: Kendi Devreni Tasarla!", en: "Quantum Leap on Copper: Design Your Own PCB!" },
      desc: { tr: "Bir devreyi şemadan baskı devre kartına taşı: yerleşim, bakır yollar ve üretim.",
              en: "Take a circuit from schematic to printed circuit board: placement, copper traces and fabrication." } },
    { id: "quantum-computing", cat: "code", pg: "qubit", levels: ["lise-adv"], device: true,
      title: { tr: "Kuantum Sıçrama: Bitlerden Kübitlere", en: "Quantum Leap: From Bits to Qubits" },
      desc: { tr: "Kübitler, süperpozisyon ve ölçüm: bu yılın temasının arkasındaki bilimi kuantum devreleriyle keşfet.",
              en: "Qubits, superposition and measurement: explore the science behind this year's theme with quantum circuits." } },
    { id: "layered-making-with-laser-cutting-design-cut-bui", cat: "fab", pg: "layers", levels: ["lise", "lise-adv"], device: true,
      title: { tr: "Lazerle Katmanlı Üretim: Tasarla, Kes, İnşa Et!", en: "Layered Laser Fabrication: Design, Cut, Build!" },
      desc: { tr: "Bir 3D formu katmanlara böl, lazerle kes ve üst üste dizerek inşa et.",
              en: "Slice a 3D form into layers, laser-cut them and stack them into a real object." } },
    { id: "design-your-own-jointed-animal-in-onshape", cat: "fab", pg: "joint", levels: ["lise", "lise-adv"], device: true,
      title: { tr: "3D Tasarımın Anatomisi: Onshape Atölyesi", en: "Anatomy of 3D Design: Onshape Workshop" },
      desc: { tr: "Onshape'te hareketli eklemleri olan bir model tasarla; parçaları birleştir, eklemleri test et ve üretime hazırla.",
              en: "Design a model with moving joints in Onshape: assemble the parts, test the joints and get it ready to make." } },
    { id: "frc-robotics-sprint-a-robot-in-4-hours", cat: "robotics", pg: "robot", levels: ["lise", "lise-adv"], device: true,
      title: { tr: "FRC Robotik Sprinti: 4 Saatte Robot", en: "FRC Robotics Sprint: Robot in 4 Hours" },
      desc: { tr: "FRC takımının çalışma yöntemiyle dört saatte tasarımdan sürüşe bir robot: mekanik, elektronik ve kod aynı masada.",
              en: "Build a robot from design to driving in four hours, the way an FRC team works: mechanics, electronics and code at one table." } },
    { id: "making-music-with-ai-a-java-workshop", cat: "ai", pg: "music", levels: ["lise", "lise-adv"], device: true,
      title: { tr: "Notaların Ardında: Yapay Zeka ile Beste", en: "Decoding Music: Composing with AI" },
      desc: { tr: "Notaları kodla ve basit bir yapay zeka modelinin melodi üretmesini sağla.",
              en: "Code notes and let a simple AI model compose melodies." } },
    { id: "data-analysis-with-wolfram", cat: "ai", pg: "plot", levels: ["lise", "lise-adv"], device: true,
      title: { tr: "Veri Dedektifleri: Wolfram Atölyesi", en: "Data Detectives: Wolfram Workshop" },
      desc: { tr: "Wolfram Dili ile gerçek verileri topla, analiz et ve etkileşimli grafiklerle görselleştir.",
              en: "Collect, analyse and visualise real data with interactive charts in the Wolfram Language." } },
    { id: "video-editing", cat: "design", pg: "video", levels: ["lise", "lise-adv"], device: true,
      title: { tr: "Kamera Arkası: Video Kurgu ve Düzenleme", en: "Behind the Scenes: Video Editing" },
      desc: { tr: "Kurgu, renk ve ses: çektiğin görüntülerden kısa ve etkili bir video çıkar.",
              en: "Cutting, colour and sound: turn your footage into a short video that lands." } },

    /* In the 19 Dec session grid but not in the names sheet — levels not known yet. */
    { id: "quantum-world-think-beyond-bits", cat: "code", pg: "qubit", levels: [], device: true,
      title: { tr: "Kuantum Dünyası: Bitlerin Ötesini Düşün", en: "Quantum World: Think Beyond Bits" },
      desc: { tr: "Bitlerin ötesine geç: süperpozisyon ve dolanıklık gibi kuantum dünyasının tuhaf kurallarını deneylerle keşfet.",
              en: "Go beyond bits: explore the strange rules of the quantum world, like superposition and entanglement, through experiments." } },
    { id: "design-your-own-sticker-graphic-design-and-stick", cat: "design", pg: "sticker", levels: [], device: true,
      title: { tr: "Sticker Fabrikası: Kendi Sticker'ını Tasarla!", en: "Sticker Factory: Design Your Own!" },
      desc: { tr: "Grafik tasarımın temelleriyle kendi sticker'ını çiz, kesim hattını hazırla ve bas.",
              en: "Learn graphic design basics, draw your own sticker, prepare its cut line and print it." } },
    { id: "laser-magic-cut-build-create", cat: "fab", pg: "layers", levels: [], device: true,
      title: { tr: "Lazer Büyüsü: Kes, İnşa Et, Yarat", en: "Laser Magic: Cut, Build, Create" },
      desc: { tr: "Tasarımını lazer kesime hazırla, kes ve parçaları birleştirerek kendi objeni yap.",
              en: "Prepare your design for the laser cutter, cut it and assemble the parts into your own object." } },
    { id: "piwars-challenge-robot-design", cat: "robotics", pg: "robot", levels: [], device: true,
      title: { tr: "PiWars: İnşa Et, Kodla, Yarış!", en: "PiWars: Build, Code, Compete!" },
      desc: { tr: "Raspberry Pi tabanlı robotlarla PiWars görevlerine hazırlan: tasarım, sensörler ve parkur stratejisi.",
              en: "Get ready for PiWars challenges with Raspberry Pi robots: design, sensors and course strategy." } },
    { id: "cyber-detectives-osint-investigation", cat: "code", pg: "cyber", levels: [], device: true,
      title: { tr: "Siber Dedektifler: Bir OSINT Soruşturması", en: "Cyber Detectives: An OSINT Investigation" },
      desc: { tr: "Açık kaynaklardan ipucu topla, izleri birleştir ve bir siber vakayı çöz; bu sırada kendi dijital izini korumayı öğren.",
              en: "Gather clues from open sources, connect the traces and crack a cyber case — and learn to protect your own digital footprint along the way." } },
    { id: "vinyl-cutting", cat: "fab", pg: "sticker", levels: [], device: true,
      title: { tr: "Cricut ile Kişisel Tasarımlar", en: "Custom Creations with Cricut" },
      desc: { tr: "Vektör çizimini Cricut kesim makinesine hazırla, kes ve yüzeye uygula.",
              en: "Prepare a vector drawing for the Cricut cutter, cut it and apply it to a surface." } },
    { id: "haas-cnc", cat: "fab", pg: "cnc", levels: [], device: true,
      title: { tr: "Dijitalden Metale: Haas CNC Atölyesi", en: "From Digital to Metal: Haas CNC Workshop" },
      desc: { tr: "Endüstriyel bir Haas CNC tezgahının nasıl çalıştığını öğren: takım yolları, G-kodu ve güvenli üretim.",
              en: "See how an industrial Haas CNC machine works: toolpaths, G-code and safe machining." } }
  ],

  // kind: "break" = short pause, "session" = workshop session (links to the session grid), "event" = highlight.
  program: [
    { id: "d1", label: { en: "Fri · 18 Dec", tr: "Cuma · 18 Aralık" }, slots: [
      { time: "—", title: { en: "Program to be announced", tr: "Program açıklanacak" }, note: { en: "Details for Friday will be added soon.", tr: "Cuma gününün ayrıntıları yakında eklenecek." } }
    ] },
    { id: "d2", label: { en: "Sat · 19 Dec", tr: "Cumartesi · 19 Aralık" }, slots: [
      { time: "08:45 – 09:15", title: { en: "Registration & welcome", tr: "Kayıt ve karşılama" } },
      { time: "09:15 – 09:45", title: { en: "Opening talks", tr: "Açılış konuşmaları" } },
      { time: "09:45 – 10:00", title: { en: "Break", tr: "Mola" }, kind: "break" },
      { time: "10:00 – 12:00", title: { en: "Session 1: Workshops", tr: "1. Oturum: Atölye çalışmaları" }, kind: "session", session: 0 },
      { time: "12:00 – 12:50", title: { en: "Lunch break", tr: "Öğle arası" }, kind: "break" },
      { time: "12:50 – 14:50", title: { en: "Session 2: Workshops", tr: "2. Oturum: Atölye çalışmaları" }, kind: "session", session: 1 },
      { time: "14:50 – 15:00", title: { en: "Break", tr: "Mola" }, kind: "break" },
      { time: "15:00 – 16:30", title: { en: "Session 3: Workshops", tr: "3. Oturum: Atölye çalışmaları" }, kind: "session", session: 2 },
      { time: "16:30 – 16:35", title: { en: "Break", tr: "Mola" }, kind: "break" },
      { time: "16:35 – 17:05", title: { en: "Pi-Rodeo & Micro Rally competitions", tr: "Pi-Rodeo ve Micro Rally yarışmaları" }, kind: "event" },
      { time: "17:05 – 17:10", title: { en: "Break", tr: "Mola" }, kind: "break" },
      { time: "17:10 – 17:40", title: { en: "Brownie Wars & guest talks", tr: "Brownie Wars & konuk konuşmaları" }, kind: "event" },
      { time: "17:40 – 18:00", title: { en: "Awards & closing", tr: "Ödül töreni ve kapanış" }, kind: "event" }
    ] }
  ],

  // Saturday 19 Dec workshop sessions: which workshop runs in which room. People pick sessions in the Google Form.
  sessions: [
    { time: "10:00 – 12:00", label: { en: "Session 1", tr: "1. Oturum" }, rooms: [
      ["C 201", "ar-interactive-mechanical-systems-automata"],
      ["C 203", "lemon-building-bio-inspired-robots"],
      ["C 205", "swift-playground-an-image-recognition-app"],
      ["C 200", "quantum-world-think-beyond-bits"],
      ["C 202", "creative-coding-art-meets-algorithms"],
      ["FabLab: ideaLab Media Lab", "design-your-own-sticker-graphic-design-and-stick"],
      ["FabLab: ideaLab Prototyping Studio", "laser-magic-cut-build-create"],
      ["FabLab: ideaLab Collaboration Studio", "piwars-challenge-robot-design"],
      ["FabLab: ideaLab Fuaye", "frc-robotics-sprint-a-robot-in-4-hours"],
      ["FabLab: ideaLab Project Pod", "brother-embroidery-machine"],
      ["C 107", "cyber-detectives-osint-investigation"],
      ["B ideaLab", "2d-game-design-with-godot-monster-invasion"],
      ["C Kütüphane 1", "pcb-design"],
      ["C 111", "video-editing"],
      ["C 113", "vibe-coding-build-apps-with-ai"],
      ["C 115", "tiny-ml-ai-meets-electronics"]
    ] },
    { time: "12:50 – 14:50", label: { en: "Session 2", tr: "2. Oturum" }, rooms: [
      ["C 201", "ar-interactive-mechanical-systems-automata"],
      ["C 205", "swift-playground-an-image-recognition-app"],
      ["C 200", "quantum-world-think-beyond-bits"],
      ["C 202", "creative-coding-art-meets-algorithms"],
      ["FabLab: ideaLab Media Lab", "vinyl-cutting"],
      ["FabLab: ideaLab Collaboration Studio", "piwars-challenge-robot-design"],
      ["FabLab: ideaLab Fuaye", "frc-robotics-sprint-a-robot-in-4-hours"],
      ["FabLab: ideaLab Project Pod", "brother-embroidery-machine"],
      ["C 105", "technovation-girls-prototyping-for-impact"],
      ["C 109", "snap-fit-3d-toy-design-and-making-in-tinkercad"],
      ["B ideaLab", "2d-game-design-with-godot-monster-invasion"],
      ["C Kütüphane 1", "rnd-rapid-prototyping-minds-and-machines"],
      ["C Kütüphane 2", "machine-learning-for-kids"],
      ["C 111", "data-analysis-with-wolfram"],
      ["C 115", "tiny-ml-ai-meets-electronics"]
    ] },
    { time: "15:00 – 16:30", label: { en: "Session 3", tr: "3. Oturum" }, rooms: [
      ["C 203", "lemon-building-bio-inspired-robots"],
      ["C 202", "making-music-with-ai-a-java-workshop"],
      ["FabLab: ideaLab Media Lab", "design-your-own-sticker-graphic-design-and-stick"],
      ["FabLab: ideaLab Prototyping Studio", "laser-magic-cut-build-create"],
      ["FabLab: ideaLab Fuaye", "cardboard-robots-with-micro-bit"],
      ["FabGarage", "haas-cnc"],
      ["C 105", "technovation-girls-prototyping-for-impact"],
      ["C 107", "cyber-detectives-osint-investigation"],
      ["C 109", "design-your-own-jointed-animal-in-onshape"],
      ["C Kütüphane 1", "pcb-design"],
      ["C Kütüphane 2", "machine-learning-for-kids"],
      ["C 113", "vibe-coding-build-apps-with-ai"]
    ] }
  ]
};
