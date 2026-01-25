import { performance } from "node:perf_hooks";
import { TeachersPetData } from "../../assets/js/data/engine-data.js";
import { TeachersPetProcessor } from "../../assets/js/engine/processor.js";
import { TeachersPetTemplates } from "../../assets/js/engine/templates.js";

const sessionData = {
  studentName: "Taylor",
  gender: "He",
  overallRating: 6,
  grade: "K1",
  month: "January",
  subjects: ["Mathematics"],
  topicRatings: {
    "addition with counters": 6,
    "number recognition": 6,
  },
  strengths: "focus, collaboration",
  weaknesses: "patience",
};

const iterations = 1000;
const templateIterations = 200;

const startProcessor = performance.now();
for (let i = 0; i < iterations; i += 1) {
  TeachersPetProcessor.processSessionData(sessionData, TeachersPetData);
}
const endProcessor = performance.now();

const processed = TeachersPetProcessor.processSessionData(
  sessionData,
  TeachersPetData,
);
const startTemplates = performance.now();
for (let i = 0; i < templateIterations; i += 1) {
  // eslint-disable-next-line no-await-in-loop
  await TeachersPetTemplates.generateStyleComment("male", processed);
}
const endTemplates = performance.now();

const processorTime = endProcessor - startProcessor;
const templateTime = endTemplates - startTemplates;

console.log("Engine Benchmark Results");
console.log(
  `Processor: ${iterations} iterations in ${processorTime.toFixed(2)} ms`,
);
console.log(
  `Templates: ${templateIterations} iterations in ${templateTime.toFixed(2)} ms`,
);
