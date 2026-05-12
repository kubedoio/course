/**
 * course-player.js
 * Loads curated course data from /courses and renders the lesson tree,
 * Markdown lesson content, runnable command blocks, and extracted quizzes.
 */

(function() {
    "use strict";

    var manifest = null;
    var quizIndex = {};
    var progressIndex = {};
    var progressUser = null;
    var progressApiAvailable = false;
    var initialized = false;
    var selectedCourseId = null;
    var selectedLessonId = null;
    var STORAGE_KEY_PROGRESS = "browser_lab_course_progress";

    function init() {
        if (initialized) return;
        initialized = true;

        var tree = document.getElementById("course-tree");
        var viewer = document.getElementById("lesson-viewer");
        if (!tree || !viewer) return;

        loadCourseData().catch(function(err) {
            viewer.innerHTML = '<div class="course-error">Course data could not be loaded: ' +
                escapeHtml(err.message) + '</div>';
            if (window.LabState) {
                window.LabState.addLog("Course load failed: " + err.message);
            }
        });
    }

    async function loadCourseData() {
        var manifestResp = await fetch("courses/manifest.json");
        if (!manifestResp.ok) {
            throw new Error("courses/manifest.json returned HTTP " + manifestResp.status);
        }
        manifest = await manifestResp.json();

        try {
            var quizResp = await fetch("courses/quizzes.json");
            if (quizResp.ok) {
                var quizData = await quizResp.json();
                buildQuizIndex(quizData.quizzes || []);
            }
        } catch (err) {
            if (window.LabState) {
                window.LabState.addLog("Quiz data unavailable: " + err.message);
            }
        }

        await loadProgress();
        renderHeader();
        renderTree();

        var firstCourse = manifest.courses && manifest.courses[0];
        var firstLesson = firstCourse && firstCourse.lessons && firstCourse.lessons[0];
        if (firstCourse && firstLesson) {
            await selectLesson(firstCourse.id, firstLesson.id);
        }
    }

    function buildQuizIndex(quizzes) {
        quizIndex = {};
        quizzes.forEach(function(quiz) {
            if (!quiz.course_id) return;
            if (!quizIndex[quiz.course_id]) quizIndex[quiz.course_id] = [];
            quizIndex[quiz.course_id].push(quiz);
        });
    }

    async function loadProgress() {
        try {
            var resp = await fetch("/api/progress", { credentials: "same-origin" });
            if (!resp.ok) throw new Error("progress API returned HTTP " + resp.status);
            var payload = await resp.json();
            progressApiAvailable = true;
            progressUser = payload.user || null;
            progressIndex = {};
            (payload.lessons || []).forEach(function(item) {
                setProgress(item.course_id, item.lesson_id, item.status);
            });
        } catch (err) {
            progressApiAvailable = false;
            progressUser = null;
            progressIndex = readLocalProgress();
            if (window.LabState) {
                window.LabState.addLog("Course progress API unavailable; using browser-local progress.");
            }
        }
    }

    function renderHeader() {
        var title = document.getElementById("course-title");
        var description = document.getElementById("course-description");
        if (title) title.textContent = "Online Lab Courses";
        if (description) {
            var label = progressUser && (progressUser.username || progressUser.email);
            description.textContent = label ?
                "Signed in as " + label + ". Progress is saved per user." :
                "Curated Linux, Git, Docker, scripting, database, and Kubernetes lessons for the browser VM.";
        }
    }

    function renderTree() {
        var tree = document.getElementById("course-tree");
        tree.innerHTML = "";

        (manifest.courses || []).forEach(function(course) {
            var group = document.createElement("section");
            group.className = "course-group";
            group.dataset.courseId = course.id;

            var heading = document.createElement("button");
            heading.type = "button";
            heading.className = "course-group-title";
            heading.innerHTML = '<span>' + escapeHtml(course.title) + '</span>' +
                '<small>' + escapeHtml(formatCourseProgress(course)) + '</small>';
            heading.title = course.summary || course.title;
            heading.addEventListener("click", function() {
                var firstLesson = course.lessons && course.lessons[0];
                if (firstLesson) selectLesson(course.id, firstLesson.id);
            });
            group.appendChild(heading);

            var list = document.createElement("div");
            list.className = "course-lessons";
            (course.lessons || []).forEach(function(lesson) {
                var button = document.createElement("button");
                button.type = "button";
                button.className = "lesson-link";
                button.dataset.courseId = course.id;
                button.dataset.lessonId = lesson.id;
                var status = getProgress(course.id, lesson.id);
                button.classList.toggle("is-completed", status === "completed");
                button.classList.toggle("is-in-progress", status === "in_progress");
                button.innerHTML = '<span class="lesson-state" aria-hidden="true">' + lessonStateIcon(status) + '</span>' +
                    '<span class="lesson-copy"><span class="lesson-title-text">' + escapeHtml(lesson.title) + '</span>' +
                    '<small>' + escapeHtml(formatCompatibility(lesson.vm_compatible)) + ' · ' +
                    escapeHtml(String(lesson.duration_minutes || "?")) + ' min</small></span>';
                button.addEventListener("click", function() {
                    selectLesson(course.id, lesson.id);
                });
                list.appendChild(button);
            });
            group.appendChild(list);
            tree.appendChild(group);
        });
    }

    async function selectLesson(courseId, lessonId) {
        var course = findCourse(courseId);
        var lesson = course && findLesson(course, lessonId);
        if (!course || !lesson) return;

        selectedCourseId = courseId;
        selectedLessonId = lessonId;
        markActiveLesson();
        await updateLessonProgress(courseId, lessonId, "in_progress", { render: true });

        var viewer = document.getElementById("lesson-viewer");
        viewer.innerHTML = '<div class="lesson-loading">Loading lesson...</div>';

        try {
            var resp = await fetch("courses/" + lesson.path);
            if (!resp.ok) throw new Error(lesson.path + " returned HTTP " + resp.status);
            var markdown = await resp.text();
            viewer.innerHTML = renderLesson(course, lesson, markdown);
            bindLessonControls(viewer);
            markActiveLesson();
        } catch (err) {
            viewer.innerHTML = '<div class="course-error">Lesson could not be loaded: ' +
                escapeHtml(err.message) + '</div>';
        }
    }

    function renderLesson(course, lesson, markdown) {
        var body = stripFrontmatter(markdown);
        var lessonQuizzes = (quizIndex[course.id] || []).slice(0, 4);
        var meta = '<div class="lesson-meta">' +
            '<span>' + escapeHtml(course.title) + '</span>' +
            '<span>' + escapeHtml(String(lesson.duration_minutes || "?")) + ' min</span>' +
            '<span>' + escapeHtml(formatCompatibility(lesson.vm_compatible)) + '</span>' +
            '</div>';
        var notes = lesson.notes ? '<div class="lesson-note">' + escapeHtml(lesson.notes) + '</div>' : "";
        return renderLessonProgressPanel(course, lesson) + meta + notes + markdownToHtml(body) + renderQuizzes(lessonQuizzes);
    }

    function renderLessonProgressPanel(course, lesson) {
        var status = getProgress(course.id, lesson.id);
        var completed = status === "completed";
        var label = completed ? "Completed" : "Mark complete";
        return '<div class="lesson-progress-panel">' +
            '<div><strong>' + escapeHtml(lesson.title) + '</strong>' +
            '<span>' + escapeHtml(completed ? "Finished section" : "Current section") + '</span></div>' +
            '<button type="button" class="btn btn-secondary lesson-complete" ' +
            'data-course-id="' + attr(course.id) + '" data-lesson-id="' + attr(lesson.id) + '"' +
            (completed ? ' disabled' : '') + '>' + escapeHtml(label) + '</button>' +
            '</div>';
    }

    function renderQuizzes(quizzes) {
        if (!quizzes.length) {
            return '<section class="quiz-panel"><h2>Quiz</h2><p>No extracted quiz is attached to this course yet.</p></section>';
        }

        var html = '<section class="quiz-panel"><h2>Quiz</h2>';
        quizzes.forEach(function(quiz, index) {
            html += '<form class="quiz-card" data-quiz-id="' + escapeHtml(quiz.id) + '">' +
                '<h3>Question ' + (index + 1) + '</h3>' +
                '<p>' + escapeHtml(quiz.prompt) + '</p>';
            (quiz.choices || []).forEach(function(choice, choiceIndex) {
                var inputId = quiz.id + "-" + choiceIndex;
                html += '<label class="quiz-choice" for="' + escapeHtml(inputId) + '">' +
                    '<input id="' + escapeHtml(inputId) + '" name="' + escapeHtml(quiz.id) +
                    '" type="radio" value="' + choiceIndex + '" data-correct="' + (choice.correct ? "true" : "false") + '">' +
                    '<span>' + escapeHtml(choice.text) + '</span>' +
                    '</label>';
            });
            html += '<button type="button" class="btn btn-secondary quiz-check">Check</button>' +
                '<div class="quiz-result" aria-live="polite"></div>' +
                '</form>';
        });
        html += '</section>';
        return html;
    }

    function bindLessonControls(root) {
        root.querySelectorAll(".code-action.copy").forEach(function(button) {
            button.addEventListener("click", function() {
                copyText(button.dataset.command || "");
                button.textContent = "Copied";
                setTimeout(function() { button.textContent = "Copy"; }, 1200);
            });
        });

        root.querySelectorAll(".code-action.run").forEach(function(button) {
            button.addEventListener("click", function() {
                var command = button.dataset.command || "";
                var result = window.V86Runtime && window.V86Runtime.sendCommand(command, { enter: true });
                if (result && result.ok) {
                    button.textContent = "Sent";
                    setTimeout(function() { button.textContent = "Run"; }, 1200);
                }
            });
        });

        root.querySelectorAll(".quiz-check").forEach(function(button) {
            button.addEventListener("click", function() {
                var card = button.closest(".quiz-card");
                var checked = card.querySelector("input[type=radio]:checked");
                var result = card.querySelector(".quiz-result");
                if (!checked) {
                    result.textContent = "Select an answer first.";
                    result.className = "quiz-result is-warning";
                    return;
                }
                var correct = checked.dataset.correct === "true";
                result.textContent = correct ? "Correct." : "Not correct. Review the lesson and try again.";
                result.className = "quiz-result " + (correct ? "is-correct" : "is-wrong");
            });
        });

        root.querySelectorAll(".lesson-complete").forEach(function(button) {
            button.addEventListener("click", async function() {
                button.disabled = true;
                button.textContent = "Saving";
                await updateLessonProgress(button.dataset.courseId, button.dataset.lessonId, "completed", { render: true });
                button.textContent = "Completed";
            });
        });
    }

    function markdownToHtml(markdown) {
        var tokens = markdown.split(/(```[\s\S]*?```)/g);
        var html = "";
        tokens.forEach(function(token) {
            if (!token) return;
            if (token.indexOf("```") === 0) {
                html += renderCodeBlock(token);
            } else {
                html += renderMarkdownText(token);
            }
        });
        return html;
    }

    function renderCodeBlock(token) {
        var match = token.match(/^```([^\n]*)?\n?([\s\S]*?)```$/);
        var lang = match && match[1] ? match[1].trim() : "text";
        var code = match ? match[2].replace(/\n$/, "") : token;
        var runnable = lang === "bash" || lang === "sh" || lang === "shell" || lang.indexOf("term") !== -1;
        return '<div class="code-block">' +
            '<div class="code-toolbar"><span>' + escapeHtml(lang) + '</span>' +
            '<div><button type="button" class="code-action copy" data-command="' + attr(code) + '">Copy</button>' +
            (runnable ? '<button type="button" class="code-action run" data-command="' + attr(code) + '">Run</button>' : '') +
            '</div></div>' +
            '<pre><code>' + escapeHtml(code) + '</code></pre>' +
            '</div>';
    }

    function renderMarkdownText(text) {
        var lines = text.split(/\n/);
        var html = "";
        var inList = false;

        lines.forEach(function(raw) {
            var line = raw.trim();
            if (!line) {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                return;
            }

            var heading = line.match(/^(#{1,4})\s+(.+)$/);
            if (heading) {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                var level = Math.min(heading[1].length + 1, 4);
                html += "<h" + level + ">" + inlineMarkdown(heading[2]) + "</h" + level + ">";
                return;
            }

            var bullet = line.match(/^-\s+(.+)$/);
            if (bullet) {
                if (!inList) {
                    html += "<ul>";
                    inList = true;
                }
                html += "<li>" + inlineMarkdown(bullet[1]) + "</li>";
                return;
            }

            if (inList) {
                html += "</ul>";
                inList = false;
            }
            html += "<p>" + inlineMarkdown(line) + "</p>";
        });

        if (inList) html += "</ul>";
        return html;
    }

    function inlineMarkdown(value) {
        return escapeHtml(value)
            .replace(/`([^`]+)`/g, "<code>$1</code>")
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    }

    function stripFrontmatter(markdown) {
        return markdown.replace(/^---[\s\S]*?---\s*/, "");
    }

    function markActiveLesson() {
        document.querySelectorAll(".lesson-link").forEach(function(button) {
            var active = button.dataset.courseId === selectedCourseId &&
                button.dataset.lessonId === selectedLessonId;
            button.classList.toggle("active", active);
        });
    }

    async function updateLessonProgress(courseId, lessonId, status, options) {
        var current = getProgress(courseId, lessonId);
        if (current === "completed" && status === "in_progress") return;
        if (current === status) return;

        setProgress(courseId, lessonId, status);
        if (progressApiAvailable) {
            try {
                var resp = await fetch("/api/progress/lessons/" + encodeURIComponent(courseId) + "/" + encodeURIComponent(lessonId), {
                    method: "PUT",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: status })
                });
                if (!resp.ok) throw new Error("HTTP " + resp.status);
            } catch (err) {
                progressApiAvailable = false;
                writeLocalProgress();
                if (window.LabState) {
                    window.LabState.addLog("Course progress save fell back to browser storage: " + err.message);
                }
            }
        } else {
            writeLocalProgress();
        }

        if (options && options.render) {
            renderHeader();
            renderTree();
            markActiveLesson();
        }
    }

    function setProgress(courseId, lessonId, status) {
        if (!progressIndex[courseId]) progressIndex[courseId] = {};
        progressIndex[courseId][lessonId] = status;
    }

    function getProgress(courseId, lessonId) {
        return progressIndex[courseId] && progressIndex[courseId][lessonId] || "";
    }

    function readLocalProgress() {
        try {
            var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS) || "{}");
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (err) {
            return {};
        }
    }

    function writeLocalProgress() {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progressIndex));
    }

    function formatCourseProgress(course) {
        var lessons = course.lessons || [];
        var total = lessons.length;
        var completed = lessons.filter(function(lesson) {
            return getProgress(course.id, lesson.id) === "completed";
        }).length;
        var percent = total ? Math.round((completed / total) * 100) : 0;
        return completed + " / " + total + " complete · " + percent + "%";
    }

    function lessonStateIcon(status) {
        if (status === "completed") return "✓";
        if (status === "in_progress") return "▶";
        return "";
    }

    function findCourse(courseId) {
        return (manifest.courses || []).filter(function(course) { return course.id === courseId; })[0];
    }

    function findLesson(course, lessonId) {
        return (course.lessons || []).filter(function(lesson) { return lesson.id === lessonId; })[0];
    }

    function formatCompatibility(value) {
        if (value === true) return "VM lab";
        if (value === "theory-only") return "Theory";
        if (value === "source-material") return "Source";
        return String(value || "Lesson");
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            return;
        }
        var area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
    }

    function attr(value) {
        return escapeHtml(value).replace(/"/g, "&quot;");
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    window.CoursePlayer = {
        init: init,
        selectLesson: selectLesson
    };
})();
