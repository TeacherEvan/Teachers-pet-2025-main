/**
 * Subjects Page UI Functions
 * Handles subject toggling, selection, and comment generation triggers.
 */

function toggleSubject(subjectId) {
  console.log("🔄 toggleSubject called for:", subjectId);

  const content = document.getElementById("content_" + subjectId);
  const arrow = document.getElementById("arrow_" + subjectId);

  if (!content || !arrow) {
    console.error("❌ Subject elements not found for:", subjectId);
    return;
  }

  const isActive = content.classList.contains("active");

  if (isActive) {
    content.classList.remove("active");
    arrow.classList.remove("rotated");
  } else {
    content.classList.add("active");
    arrow.classList.add("rotated");
  }

  // Force a style update
  content.style.display = content.classList.contains("active")
    ? "block"
    : "none";
}

function handleSubjectCheck(subjectId) {
  const checkbox = document.getElementById("subject_" + subjectId);
  const content = document.getElementById("content_" + subjectId);

  if (!checkbox || !content) {
    console.error("Subject checkbox or content not found for:", subjectId);
    return;
  }

  const topicCheckboxes = content.querySelectorAll(".topic-checkbox");

  if (checkbox.checked) {
    // Check all topics in this subject
    topicCheckboxes.forEach((cb) => (cb.checked = true));
  } else {
    // Uncheck all topics in this subject
    topicCheckboxes.forEach((cb) => (cb.checked = false));
  }

  // Update selection count
  if (typeof updateSelectionCount === "function") {
    updateSelectionCount();
  }
}

/**
 * Infer parent subjects from selected topics using DOM structure
 */
function inferSubjectsFromTopics(topicRatings, selectedSubjects) {
  const inferredSubjects = new Set();

  // For each selected topic, find its parent subject using DOM structure
  document.querySelectorAll(".topic-checkbox:checked").forEach((checkbox) => {
    // Find the parent subject-content div
    const contentDiv = checkbox.closest(".subject-content");
    if (!contentDiv) {
      console.warn(
        "⚠️ Could not find parent subject-content for topic:",
        checkbox.value
      );
      return;
    }

    // Extract subject ID from content div ID (e.g., 'content_iq' -> 'iq')
    const subjectId = contentDiv.id.replace("content_", "");

    // Find the corresponding subject checkbox to get the subject name
    const subjectCheckbox = document.getElementById("subject_" + subjectId);
    if (!subjectCheckbox) {
      console.warn("⚠️ Could not find subject checkbox for ID:", subjectId);
      return;
    }

    const subjectName = subjectCheckbox.value;
    if (subjectName && subjectName.trim() !== "") {
      inferredSubjects.add(subjectName);
    }
  });

  // Add inferred subjects to selectedSubjects if not already present
  inferredSubjects.forEach((subject) => {
    if (
      !selectedSubjects.some((s) => s.toLowerCase() === subject.toLowerCase())
    ) {
      console.log("✅ Inferred subject from topic (DOM-based):", subject);
      selectedSubjects.push(subject);
    }
  });
}

function setGenerateUiState(isGenerating) {
  const generateBtn = document.getElementById("generateBtn");
  if (generateBtn) {
    generateBtn.disabled = !!isGenerating;
    generateBtn.setAttribute("aria-busy", isGenerating ? "true" : "false");
  }

  const commentsSection = document.getElementById("generatedComments");
  if (commentsSection) {
    if (isGenerating) {
      commentsSection.classList.add("skeleton-loading");
    } else {
      commentsSection.classList.remove("skeleton-loading");
      commentsSection.classList.add("skeleton-loaded");
    }
  }
}

function showCommentSkeleton() {
  const commentsSection = document.getElementById("generatedComments");
  if (!commentsSection) return;

  const comment1Text = document.getElementById("commentText1");
  const comment2Text = document.getElementById("commentText2");
  const wordCount1 = document.getElementById("wordCount1");
  const wordCount2 = document.getElementById("wordCount2");

  const skeletonHtml = `
        <div class="skeleton-wrapper" aria-hidden="true">
            <div class="skeleton-line" style="width: 92%"></div>
            <div class="skeleton-line" style="width: 88%"></div>
            <div class="skeleton-line" style="width: 95%"></div>
            <div class="skeleton-line" style="width: 70%"></div>
        </div>
    `.trim();

  if (comment1Text) comment1Text.innerHTML = skeletonHtml;
  if (comment2Text) comment2Text.innerHTML = skeletonHtml;
  if (wordCount1) wordCount1.textContent = "";
  if (wordCount2) wordCount2.textContent = "";

  commentsSection.style.display = "block";
  commentsSection.classList.remove("display-none");
}

async function ensureCommentGeneration() {
  try {
    console.log("🚀 Starting comment generation...");

    const safeParse = (val) => {
      try {
        return JSON.parse(val || "{}");
      } catch {
        return {};
      }
    };

    let studentData = safeParse(localStorage.getItem("studentData"));
    // If required fields are missing, try to recover from sessionStorage
    if (!studentData.studentName || !studentData.gender) {
      const ssData = safeParse(sessionStorage.getItem("studentData"));
      if (ssData.studentName && ssData.gender) {
        console.warn("ℹ️ Restoring studentData from sessionStorage fallback");
        studentData = ssData;
        try {
          localStorage.setItem("studentData", JSON.stringify(ssData));
        } catch {}
      }
    }

    const selectedSubjects = [];
    const topicRatings = {};

    // ⚡ PERFORMANCE OPTIMIZATION: Cache DOM queries
    const checkedSubjectCheckboxes = document.querySelectorAll(
      ".subject-checkbox:checked"
    );
    const checkedTopicCheckboxes = document.querySelectorAll(
      ".topic-checkbox:checked"
    );

    // Collect selected subjects and topics
    checkedSubjectCheckboxes.forEach((cb) => {
      if (cb.value && cb.value.trim() !== "") {
        selectedSubjects.push(cb.value);
      }
    });

    checkedTopicCheckboxes.forEach((cb) => {
      if (cb.value && cb.value.trim() !== "") {
        topicRatings[cb.value] = 5; // Default rating
      }
    });

    // Infer parent subjects from selected topics
    inferSubjectsFromTopics(topicRatings, selectedSubjects);

    // Validate required data
    if (!studentData.studentName || !studentData.gender) {
      alert(
        "Missing student information. Please go back and complete the student information form."
      );
      return;
    }

    // Prepare session data
    const sessionData = {
      studentName: studentData.studentName,
      gender: studentData.gender,
      overallRating: parseInt(studentData.overallAttributes) || 5,
      strengths: studentData.strengths || "",
      weaknesses: studentData.weaknesses || "",
      subjects: selectedSubjects,
      topicRatings: topicRatings,
    };

    // STRICT: Do NOT inject fake subjects/topics
    if (
      selectedSubjects.length === 0 &&
      Object.keys(topicRatings).length === 0
    ) {
      alert(
        "Please select at least one subject or topic before generating comments."
      );
      return;
    }

    showCommentSkeleton();
    setGenerateUiState(true);

    let comments;
    if (
      typeof commentGenerator !== "undefined" &&
      commentGenerator &&
      typeof commentGenerator.generateComments === "function"
    ) {
      comments = await commentGenerator.generateComments(sessionData);
    } else if (typeof EnhancedCommentEngine !== "undefined") {
      // Fallback path if optimized generator is unavailable
      const enhancedEngine = new EnhancedCommentEngine();
      comments = await enhancedEngine.generateComments(sessionData);
    } else if (typeof PremiumCommentEngine !== "undefined") {
      const engine = new PremiumCommentEngine();
      comments = await engine.generateComments(sessionData);
    } else {
      alert("Comment generation engine not available.");
      return;
    }

    // Validate that user data appears in comments
    const validationResult = validateUserDataInComments(comments, sessionData);
    if (!validationResult.isValid) {
      console.warn(
        "⚠️ Some user data missing from comments:",
        validationResult.missing
      );
    }

    // Display generated comments
    displayGeneratedComments(comments);
  } catch (error) {
    console.error("❌ Comment generation setup failed:", error);
    alert("An error occurred during comment generation: " + error.message);
  } finally {
    setGenerateUiState(false);
  }
}

function validateUserDataInComments(comments, sessionData) {
  const maleComment = comments.male.toLowerCase();
  const femaleComment = comments.female.toLowerCase();

  const result = {
    isValid: true,
    missing: [],
    found: [],
  };

  // Check student name
  const nameLower = sessionData.studentName.toLowerCase();
  if (maleComment.includes(nameLower) && femaleComment.includes(nameLower)) {
    result.found.push("Student name");
  } else {
    result.missing.push("Student name");
    result.isValid = false;
  }

  return result;
}

function displayGeneratedComments(comments) {
  const commentsSection = document.getElementById("generatedComments");
  if (!commentsSection) return;

  const comment1Text = document.getElementById("commentText1");
  const comment2Text = document.getElementById("commentText2");
  const wordCount1 = document.getElementById("wordCount1");
  const wordCount2 = document.getElementById("wordCount2");

  if (comment1Text) comment1Text.textContent = comments.male;
  if (comment2Text) comment2Text.textContent = comments.female;
  if (wordCount1) wordCount1.textContent = `(${comments.wordCount.male} words)`;
  if (wordCount2)
    wordCount2.textContent = `(${comments.wordCount.female} words)`;

  commentsSection.style.display = "block";
  commentsSection.classList.remove("display-none");
  commentsSection.scrollIntoView({ behavior: "smooth" });
}

function selectComment(commentNumber) {
  document.querySelectorAll(".comment-option").forEach((option) => {
    option.classList.remove("selected");
  });

  const selectedComment = document.getElementById("comment" + commentNumber);
  if (selectedComment) {
    selectedComment.classList.add("selected");
  }
}

function copySelectedComment() {
  const selectedComment = document.querySelector(
    ".comment-option.selected .comment-box"
  );
  if (!selectedComment) {
    if (typeof app !== "undefined" && app.showNotification) {
      app.showNotification("Please select a comment first.", "warning");
    } else {
      alert("Please select a comment first.");
    }
    return;
  }

  const text = selectedComment.textContent;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (typeof app !== "undefined" && app.showNotification) {
          app.showNotification("Comment copied to clipboard!", "success");
        } else {
          // Fallback toast if app is missing
          showFallbackToast("Comment copied to clipboard!");
        }
      })
      .catch((err) => {
        fallbackCopyToClipboard(text);
      });
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand("copy");
    if (typeof app !== "undefined" && app.showNotification) {
      app.showNotification("Comment copied to clipboard!", "success");
    } else {
      showFallbackToast("Comment copied to clipboard!");
    }
  } catch (err) {
    if (typeof app !== "undefined" && app.showNotification) {
      app.showNotification(
        "Failed to copy comment. Please select and copy manually.",
        "error"
      );
    } else {
      alert("Failed to copy comment. Please select and copy manually.");
    }
  }

  document.body.removeChild(textArea);
}

function showFallbackToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease forwards;
    `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s";
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

function exportReport() {
  const selectedComment = document.querySelector(
    ".comment-option.selected .comment-box"
  );
  if (!selectedComment) {
    alert("Please select a comment first.");
    return;
  }

  const studentData = JSON.parse(localStorage.getItem("studentData") || "{}");
  const commentText = selectedComment.textContent;

  const reportContent = `
KINDERGARTEN REPORT
==================

Student Name: ${studentData.studentName || "N/A"}
Gender: ${studentData.gender || "N/A"}
Overall Rating: ${studentData.overallAttributes || "N/A"}/10

Strengths: ${studentData.strengths || "N/A"}
Areas for Improvement: ${studentData.weaknesses || "N/A"}

GENERATED COMMENT:
${commentText}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${studentData.studentName || "Student"}_Report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
