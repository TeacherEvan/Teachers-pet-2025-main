// Diagnose grouping of REAL P2 topic names through the exact app pipeline.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EnhancedCommentEngine, TeachersPetData, TeachersPetProcessor } from '../assets/js/comment-engine-bundle.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const curriculum = JSON.parse(
  readFileSync(join(root, 'assets/data/curriculum/p2/semester 1.json'), 'utf8')
);

function pickRandom(arr, n) {
  const c = [...arr]; const o = [];
  for (let i = 0; i < n && c.length; i++) o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);
  return o;
}

let runs = 0, totalTopics = 0, totalOrphaned = 0, runsWithOrphans = 0;
const engine = new EnhancedCommentEngine();

for (let r = 0; r < 8; r++) {
  const subjects = pickRandom(curriculum.subjects, 3).map(s => s.name);
  const topicRatings = {};
  const topicSubjects = {};
  for (const sName of subjects) {
    const subj = curriculum.subjects.find(s => s.name === sName);
    for (const t of pickRandom(subj.topics, 2)) {
      topicRatings[t.name] = 5;
      topicSubjects[t.name] = sName;
    }
  }
  const sd = {
    studentName: 'Test', gender: 'female', overallRating: 7,
    strengths: [], weaknesses: [], subjects, topicRatings, topicSubjects
  };
  const p = TeachersPetProcessor.processSessionData(sd, TeachersPetData);
  const t = Object.keys(topicRatings).length;
  const o = p.orphanedTopics.length;
  const a = Object.values(p.topicsBySubject).flat().length;
  totalTopics += t; totalOrphaned += o; runs++;
  if (o > 0) runsWithOrphans++;
  console.log(`run${r}: subjects=[${subjects.join(', ')}] topics=${t} grouped=${a} orphaned=${o}`);
}
console.log(`\nSUMMARY over ${runs} runs: topics=${totalTopics} orphaned=${totalOrphaned} runsWithOrphans=${runsWithOrphans}/${runs}`);
console.log(totalOrphaned === 0 ? 'GROUPING OK' : 'GROUPING DEFECTIVE');
