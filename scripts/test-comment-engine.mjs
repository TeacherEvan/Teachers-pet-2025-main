// Full integration test mirroring the app's REAL session payloads.
// P2 path supplies topicSubjects (explicit). K1/K2 supplies only topicRatings.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EnhancedCommentEngine, TeachersPetProcessor } from '../assets/js/comment-engine-bundle.js';
import { TeachersPetData } from '../assets/js/data/engine-data.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

function pickRandom(arr, n) {
  const c = [...arr]; const o = [];
  for (let i = 0; i < n && c.length; i++) o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);
  return o;
}

function loadCurriculum(file) {
  return JSON.parse(readFileSync(join(root, file), 'utf8'));
}

function topicName(t) { return typeof t === 'string' ? t : t.name; }

function buildP2Session(curriculum, name, gender, rating) {
  const subjects = pickRandom(curriculum.subjects, 3).map(s => s.name);
  const topicRatings = {};
  const topicSubjects = {};
  for (const sName of subjects) {
    const subj = curriculum.subjects.find(s => s.name === sName);
    for (const t of pickRandom(subj.topics, 2)) {
      const tn = topicName(t);
      topicRatings[tn] = 5;
      topicSubjects[tn] = sName;
    }
  }
  return {
    studentName: name, gender, overallRating: rating,
    strengths: ['creative thinking', 'problem solving'],
    weaknesses: ['fine motor skills'],
    subjects, topicRatings, topicSubjects,
  };
}

function buildK1Session(curriculum, name, gender, rating) {
  // K1 now supplies topicSubjects too (base controller records it on topic toggle)
  const subjects = pickRandom(curriculum.subjects, 3).map(s => s.name);
  const topicRatings = {};
  const topicSubjects = {};
  for (const sName of subjects) {
    const subj = curriculum.subjects.find(s => s.name === sName);
    for (const t of pickRandom(subj.topics, 2)) {
      const tn = topicName(t);
      topicRatings[tn] = 5;
      topicSubjects[tn] = sName;
    }
  }
  return {
    studentName: name, gender, overallRating: rating,
    strengths: ['creative thinking', 'problem solving'],
    weaknesses: ['fine motor skills'],
    subjects, topicRatings, topicSubjects,
  };
}

function checkIntegration(engine, sd) {
  const p = TeachersPetProcessor.processSessionData(sd, TeachersPetData);
  return { assigned: Object.values(p.topicsBySubject).flat().length, orphaned: p.orphanedTopics.length };
}

function validate(label, result, gender, name, subjects) {
  const g = gender;
  const text = result[g];
  const pronounOk = g === 'female'
    ? !/\b(He|his|him)\b/.test(text) && /\b(She|Her|her)\b/.test(text)
    : !/\b(She|Her|her)\b/.test(text) && /\b(He|His|his|him)\b/.test(text);
  const nameOk = text.includes(name);
  const subjOk = subjects.every(s => text.includes(s));
  const wc = result.wordCount[g];
  const fallback = /Unable to generate|satisfactory academic progress this term, showing appropriate developmental growth/.test(text);
  console.log(`\n=== ${label} ===\n${text}\n-- wc:${wc} name:${nameOk} subjects:${subjOk} pronouns:${pronounOk} fallback:${fallback}`);
  return nameOk && subjOk && pronounOk && !fallback && wc > 40;
}

(async () => {
  const engine = new EnhancedCommentEngine();
  let pass = true;
  const p2 = loadCurriculum('assets/data/curriculum/p2/semester 1.json');
  const k1 = loadCurriculum('assets/data/curriculum/k1/december.json');

  // P2 female + male (explicit topicSubjects)
  for (const [g, n, r] of [['female','Maya',8],['male','Liam',6]]) {
    const sd = buildP2Session(p2, n, g, r);
    const integ = checkIntegration(engine, sd);
    const res = await engine.generateComments(sd);
    const ok = validate(`P2 ${g.toUpperCase()} ${n}`, res, g, n, sd.subjects);
    console.log(`   integration: assigned=${integ.assigned} orphaned=${integ.orphaned}`);
    if (!ok || integ.orphaned !== 0) pass = false;
  }

  // K1 female + male (no topicSubjects -> robust fallback)
  for (const [g, n, r] of [['female','Ava',7],['male','Noah',9]]) {
    const sd = buildK1Session(k1, n, g, r);
    const integ = checkIntegration(engine, sd);
    const res = await engine.generateComments(sd);
    const ok = validate(`K1 ${g.toUpperCase()} ${n}`, res, g, n, sd.subjects);
    console.log(`   integration: assigned=${integ.assigned} orphaned=${integ.orphaned}`);
    if (!ok || integ.orphaned !== 0) pass = false;
  }

  console.log(`\n\nRESULT: ${pass ? 'ALL PASS' : 'FAIL'}`);
  process.exit(pass ? 0 : 1);
})();
