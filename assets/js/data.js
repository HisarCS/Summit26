/* Content for the 13th Coding Summit site.
   Workshops come from the summit's lesson sheet (names of instructors are left out on purpose).
   Every workshop field except `title` is optional; the page builds filters from whatever is filled in. */

window.SUMMIT = {
  // From the Canva poster ("DEC 19, 2027"). Check with the team before publishing.
  date: "2027-12-19T09:00:00+03:00",
  dateLabel: { en: "DEC 19, 2027", tr: "19 ARALIK 2027" },

  // Set when registration opens; until then the Join button points to Instagram.
  registrationUrl: "",

  // { title, desc, category, level, language, age, day, session, duration }
  workshops: [],

  // [{ id, label: {en,tr}, slots: [{ time, title: {en,tr}, note: {en,tr} }] }]
  program: []
};
