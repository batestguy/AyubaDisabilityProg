import { useEffect, useState, type FormEvent } from "react";
import { languages, translations } from "./i18n";
import { localizeCourse } from "./courseLanguages";
import { type Course, courses as sampleCourses } from "./catalogue";
import {
  loadState,
  enrol,
  updateEnrolment,
  recommend,
  grade,
  fresh,
  uid,
  type State,
  type Learner,
} from "./store";
import { sources } from "./evidence";
import { HomePage } from "./HomePage";
import { ExplorePage } from "./ExplorePage";
import { AppDemoPage } from "./AppDemoPage";
import { AboutPage } from "./AboutPage";
const download = (name: string, text: string, type = "text/plain") => {
  const u = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
};
const safeUrl = (s: string) => {
  try {
    return new URL(s).protocol === "https:";
  } catch {
    return false;
  }
};
function Field({
  label,
  name,
  initial = "",
  area = false,
}: {
  label: string;
  name: string;
  initial?: string;
  area?: boolean;
}) {
  return (
    <label>
      {label}
      {area ? (
        <textarea
          aria-label={label}
          name={name}
          defaultValue={initial}
          maxLength={2000}
          required
        />
      ) : (
        <input
          aria-label={label}
          name={name}
          defaultValue={initial}
          maxLength={200}
          required
        />
      )}
    </label>
  );
}
const data = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  return Object.fromEntries(new FormData(e.currentTarget)) as Record<
    string,
    string
  >;
};
export default function App() {
  const [state, setState] = useState<State>(loadState),
    [page, setPage] = useState("overview"),
    [role, setRole] = useState("learner"),
    [lang, setLang] = useState("en"),
    [active, setActive] = useState("learner-demo"),
    [courseId, setCourseId] = useState(""),
    [notice, setNotice] = useState(""),
    [large, setLarge] = useState(false),
    [reduce, setReduce] = useState(false);
  const [aiText, setAiText] = useState(""),
    [aiRefs, setAiRefs] = useState<string[]>([]),
    [busy, setBusy] = useState(false);
  const t = (key: string) =>
    translations[lang]?.[key] || translations.en[key] || key;
  const learner =
    state.learners.find((l) => l.id === active) || state.learners[0];
  const originalCourse = state.courses.find((c) => c.id === courseId);
  const course = originalCourse
    ? localizeCourse(originalCourse, lang)
    : undefined;
  const entry = state.enrolments.find(
    (e) => e.courseId === courseId && e.learnerId === learner.id,
  );
  useEffect(() => {
    try {
      sessionStorage.setItem("mosaic-v1", JSON.stringify(state));
    } catch {
      setNotice(
        "Session storage unavailable. Changes remain available until this page closes.",
      );
    }
  }, [state]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("large", large);
    document.documentElement.classList.toggle("reduce", reduce);
  }, [lang, large, reduce]);
  const change = (s: State, msg = "Saved in this fictional sandbox.") => {
    setState(s);
    setNotice(msg);
  };
  const patchEntry = (patch: Parameters<typeof updateEnrolment>[2]) =>
    entry && change(updateEnrolment(state, entry.id, patch));
  const request = (
    e: FormEvent<HTMLFormElement>,
    kind: "question" | "mentoring" | "message",
  ) => {
    const f = data(e);
    change(
      {
        ...state,
        requests: [
          ...state.requests,
          {
            id: uid(),
            learnerId: learner.id,
            courseId: courseId || "",
            kind,
            text: f.text,
            createdAt: Date.now(),
          },
        ],
      },
      "Request saved. Switch to Expert consultant to respond.",
    );
    e.currentTarget.reset();
  };
  const learningPlan = () =>
    download(
      "learning-support-plan.txt",
      `DEMO LEARNING & SUPPORT PLAN\n${learner.name}\nLocation: ${learner.location}\nInterests: ${learner.interests}\nExisting skills: ${learner.skills.join(", ") || "Not recorded"}\nSupport preferences: ${learner.needs}\nLanguage: ${learner.language}\nContact: ${learner.contact}\n\nRecommended learning:\n${recommend(
        state,
        learner,
      )
        .map(
          ({ course }) =>
            course.title +
            ": six lessons, quiz (70%), approved practical assignment",
        )
        .join(
          "\n",
        )}\n\nNext steps: enrol, study at your pace, ask an expert, request mentoring. Confirm external programme availability with its organiser.\nFollow-up: ${
        state.requests
          .filter((r) => r.learnerId === learner.id && r.followup)
          .map((r) => r.followup)
          .join("; ") || "Arrange with your intermediary."
      }\nFictional sandbox; no service or qualification is guaranteed.`,
    );
  async function assist(e: FormEvent<HTMLFormElement>) {
    const f = data(e);
    setBusy(true);
    setAiText("");
    setAiRefs([]);
    try {
      const res = await fetch("/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: f.mode,
          prompt: f.prompt,
          language: lang,
          courseId: course?.id,
          context: {
            interests: learner.interests,
            skills: learner.skills,
            location: learner.location,
            needs: learner.needs,
          },
        }),
        signal: AbortSignal.timeout(25000),
      });
      if (!res.ok) {
        const v = await res.json().catch(() => ({}));
        throw Error(
          v.error ||
            "AI is unavailable. Your courses and expert inbox still work.",
        );
      }
      const r = await res.json();
      setAiText(r.text);
      setAiRefs(r.citations);
    } catch (e) {
      setAiText(e instanceof Error ? e.message : "AI is unavailable.");
    } finally {
      setBusy(false);
    }
  }
  function read(text: string) {
    if (!("speechSynthesis" in window)) {
      setNotice("Device read-aloud is unavailable.");
      return;
    }
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith(lang));
    if (!voice) {
      setNotice("No voice for this language is installed on this device.");
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    speechSynthesis.speak(u);
  }
  return (
    <>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <header>
        <a className="brand" href="#" onClick={() => setPage("overview")}>
          <span className="brand-mark" aria-hidden="true">
            ▦
          </span>
          <span>
            IMPACT MOSAIC<small>A vision for inclusive opportunity</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          {[["overview","Home"],["explore","Projects & Possibilities"],["about","About"]].map(([id,title])=><button key={id} aria-current={page===id?'page':undefined} onClick={()=>{setPage(id);window.scrollTo(0,0);}}>{title}</button>)}
        </nav>
        <label className="language">
          <span className="sr-only">{t("language")}</span>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            {languages.map((l) => (
              <option value={l.code} key={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      <div className="accessbar">
        <span>
          Independent showcase · Fictional app data · No assumed NCPWD endorsement
        </span>
        <div>
          <button aria-pressed={large} onClick={() => setLarge(!large)}>
            A+ Text
          </button>
          <button aria-pressed={reduce} onClick={() => setReduce(!reduce)}>
            Reduce motion
          </button>
          <button
            onClick={() =>
              read(document.getElementById("main")?.innerText || "")
            }
          >
            Read aloud
          </button>
          <button onClick={() => speechSynthesis?.cancel()}>Stop</button>
        </div>
      </div>
      {lang !== "en" && (
        <p className="translation-note" role="note">
          Experimental, unreviewed translation. Sample lessons, assessments and
          navigation are translated. Some supporting content and custom courses
          remain English. Ask the AI for experimental language support or an
          expert for clarification.
        </p>
      )}
      <div role="status" className="notice" aria-live="polite">
        {notice}
      </div>
      <main id="main" tabIndex={-1}>
        {page === "overview" ? (
          <HomePage reduceMotion={reduce} />
        ) : page === "explore" ? <ExplorePage onOpen={setPage}/> : page === "about" ? <AboutPage/> : page === "app-demo" ? <AppDemoPage/> : (
          <>
            <section className="workspace-heading">
              <div>
                <p className="eyebrow">YOUR PRIVATE DEMONSTRATION SPACE</p>
                <h1>
                  {page === "navigator"
                    ? t("navigator")
                    : "Learning, connected."}
                </h1>
                <p>
                  Use fictional details only. Changes stay in this tab’s browser
                  session. Role switching is a demonstration, not
                  authentication.
                </p>
              </div>
              <div className="actions">
                <button
                  onClick={() =>
                    download(
                      "fictional-sandbox.json",
                      JSON.stringify(state, null, 2),
                      "application/json",
                    )
                  }
                >
                  {t("export")}
                </button>
                <button
                  onClick={() => {
                    change(fresh(), "Sandbox reset.");
                    setActive("learner-demo");
                    setCourseId("");
                    setAiText("");
                    setAiRefs([]);
                  }}
                >
                  {t("reset")}
                </button>
              </div>
            </section>
            <div className="rolebar">
              <label>
                Perspective
                <select
                  aria-label="Perspective"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setCourseId("");
                  }}
                >
                  <option value="learner">PWD learner</option>
                  <option value="expert">Expert consultant</option>
                  <option value="admin">Intermediary / admin</option>
                </select>
              </label>
              <label>
                Fictional learner
                <select
                  aria-label="Fictional learner"
                  value={learner.id}
                  onChange={(e) => {
                    setActive(e.target.value);
                    setCourseId("");
                  }}
                >
                  {state.learners.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={learningPlan}>{t("plan")} ↗</button>
              <button onClick={() => window.print()}>Print this view</button>
            </div>
            {page === "navigator" ? (
              <div className="workspace-grid">
                <section className="panel">
                  <p className="eyebrow">GUIDANCE, WITH SOURCES</p>
                  <h2>A useful next step.</h2>
                  <p>
                    Only interests, skills, location and support preferences are
                    sent to the AI provider. Do not enter identifying or
                    sensitive information. Provider language support is
                    experimental.
                  </p>
                  <form onSubmit={assist}>
                    <label>
                      Help me with
                      <select name="mode">
                        <option value="recommend">
                          Course and support recommendations
                        </option>
                        <option value="explain">
                          Explain a lesson or programme
                        </option>
                        <option value="draft">
                          Draft an enquiry or mentoring request
                        </option>
                      </select>
                    </label>
                    <label>
                      Reviewed sample course
                      <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                      >
                        <option value="">Programme documents</option>
                        {sampleCourses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Field
                      label="Your question (fictional context only)"
                      name="prompt"
                      area
                    />
                    <button className="primary" disabled={busy}>
                      {busy ? "Working…" : t("send")}
                    </button>
                  </form>
                  {aiText && (
                    <div className="ai-answer" role="status">
                      <p>{aiText}</p>
                      {aiRefs.map((id) => {
                        const s = sources.find((s) => s.id === id);
                        return s ? (
                          <a
                            key={id}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            [{id}] {s.title}
                          </a>
                        ) : (
                          <p key={id}>
                            [{id}]{" "}
                            {state.courses.find((c) => c.id === id)?.title}
                          </p>
                        );
                      })}
                      <button onClick={() => read(aiText)}>
                        Read answer aloud
                      </button>
                    </div>
                  )}
                </section>
                <aside className="panel">
                  <h2>Catalogue guidance</h2>
                  <p>These recommendations work even when AI is unavailable.</p>
                  {recommend(state, learner).map(
                    ({ course: original, score }) => {
                      const c = localizeCourse(original, lang);
                      return (
                        <article key={c.id}>
                          <h3>{c.title}</h3>
                          <p>
                            {score
                              ? `Matches interests or skills in “${learner.interests}”.`
                              : "An optional starting point; ask an expert about your goals."}{" "}
                            Text lessons support{" "}
                            {learner.needs ||
                              "your selected access preferences"}
                            . Location ({learner.location}) does not limit these
                            demo courses.
                          </p>
                          <button
                            onClick={() => {
                              setCourseId(c.id);
                              setPage("sandbox");
                              setRole("learner");
                            }}
                          >
                            Explore course ↗
                          </button>
                        </article>
                      );
                    },
                  )}
                  <p>
                    Programme availability and individual eligibility need human
                    confirmation. Disability is never an automatic exclusion.
                  </p>
                </aside>
              </div>
            ) : (
              <>
                {role === "learner" && (
                  <>
                    <details className="panel profile">
                      <summary>
                        {t("profile")} · {learner.name}
                      </summary>
                      <Profile
                        learner={learner}
                        t={t}
                        onSave={(l) =>
                          change({
                            ...state,
                            learners: state.learners.map((x) =>
                              x.id === l.id ? l : x,
                            ),
                          })
                        }
                      />
                    </details>
                    <div className="section-heading">
                      <h2>{t("learn")}</h2>
                      <p>
                        {t("skills")}:{" "}
                        {learner.skills.join(", ") ||
                          "Complete a course to demonstrate new skills."}
                      </p>
                    </div>
                    <div className="course-grid">
                      {recommend(state, learner).map(
                        ({ course: original }, i) => {
                          const c = localizeCourse(original, lang);
                          const e = state.enrolments.find(
                            (e) =>
                              e.courseId === c.id && e.learnerId === learner.id,
                          );
                          return (
                            <article
                              className={"course-card color-" + i}
                              key={c.id}
                            >
                              <span className="eyebrow">
                                DEMO COURSE / 0{i + 1}
                              </span>
                              <h3>{c.title}</h3>
                              <p>{c.description}</p>
                              <small>
                                {c.lessons.length} lessons · Quiz · Practical
                                assignment
                              </small>
                              {e && (
                                <p>
                                  {e.completedAt
                                    ? "Demo certificate earned"
                                    : `${e.lessons.length}/${c.lessons.length} lessons completed`}
                                </p>
                              )}
                              <button
                                className="primary"
                                onClick={() => {
                                  if (!e)
                                    change(
                                      enrol(state, learner.id, c.id),
                                      "Enrolled directly.",
                                    );
                                  setCourseId(c.id);
                                }}
                              >
                                {e
                                  ? lang === "en"
                                    ? "Open course"
                                    : t("learn")
                                  : t("enrol")}{" "}
                                ↗
                              </button>
                            </article>
                          );
                        },
                      )}
                    </div>
                    {course && entry && (
                      <section className="panel study" key={entry.id}>
                        <p className="eyebrow">YOUR LEARNING SPACE</p>
                        <h2>{course.title}</h2>
                        <progress
                          aria-label="Lesson progress"
                          value={entry.lessons.length}
                          max={course.lessons.length}
                        />
                        <p>
                          {entry.lessons.length}/{course.lessons.length} lessons
                          · Best quiz score: {Math.max(0, ...entry.scores)}% ·
                          Attempts: {entry.scores.length}
                        </p>
                        {course.lessons.map((l, i) => (
                          <details key={i}>
                            <summary>
                              {i + 1}. {l.title}{" "}
                              {entry.lessons.includes(i) ? "✓" : ""}
                            </summary>
                            <p>{l.body}</p>
                            {l.resource && !safeUrl(l.resource) && (
                              <p>{l.resource}</p>
                            )}
                            {l.resource && safeUrl(l.resource) && (
                              <a
                                href={l.resource}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Resource ↗
                              </a>
                            )}
                            {l.video && safeUrl(l.video) && (
                              <>
                                <a
                                  href={l.video}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Video ↗
                                </a>
                                <p>Transcript: {l.transcript}</p>
                              </>
                            )}
                            <button onClick={() => read(l.body)}>
                              Read lesson
                            </button>
                            <button
                              disabled={entry.lessons.includes(i)}
                              onClick={() =>
                                patchEntry({ lessons: [...entry.lessons, i] })
                              }
                            >
                              {t("complete")}
                            </button>
                          </details>
                        ))}
                        <Quiz
                          key={entry.id + lang}
                          course={course}
                          t={t}
                          onScore={(score) =>
                            patchEntry({ scores: [...entry.scores, score] })
                          }
                        />
                        <h3>{t("assignment")}</h3>
                        <p>{course.assignment}</p>
                        <form
                          onSubmit={(e) => {
                            const f = data(e);
                            patchEntry({
                              submitted: f.work,
                              approved: false,
                              feedback: undefined,
                            });
                          }}
                        >
                          <Field
                            name="work"
                            label={
                              lang === "en"
                                ? "Your practical work (text submission)"
                                : t("assignment")
                            }
                            initial={entry.submitted}
                            area
                          />
                          <button className="primary">{t("submit")}</button>
                        </form>
                        <p>
                          {entry.feedback
                            ? `${t("feedback")}: ${entry.feedback}`
                            : "An expert must review your assignment before a certificate can be issued."}
                        </p>
                        {entry.completedAt && (
                          <div className="certificate">
                            <span>↗</span>
                            <h3>{t("certificate")} · DEMO</h3>
                            <p>
                              {learner.name} · {course.title}
                            </p>
                            <p>
                              All lessons completed, quiz ≥70%, practical
                              assignment approved. Demonstration only; not an
                              accredited qualification.
                            </p>
                            <button
                              onClick={() =>
                                download(
                                  "demo-certificate.txt",
                                  `DEMO CERTIFICATE — NOT ACCREDITED\n${learner.name}\n${course.title}\nCompleted ${new Date(entry.completedAt!).toLocaleDateString()}\nSkills: ${course.skills.join(", ")}\nVerified only inside this fictional browser sandbox.`,
                                )
                              }
                            >
                              Download certificate
                            </button>
                          </div>
                        )}
                        <div className="two-cols">
                          <form onSubmit={(e) => request(e, "question")}>
                            <h3>{t("questions")}</h3>
                            <Field
                              name="text"
                              label={
                                lang === "en"
                                  ? "Ask the expert"
                                  : t("questions")
                              }
                              area
                            />
                            <button>{t("send")}</button>
                          </form>
                          <form onSubmit={(e) => request(e, "mentoring")}>
                            <h3>{t("mentoring")}</h3>
                            <Field
                              name="text"
                              label={
                                lang === "en"
                                  ? "Goals and preferred meeting format"
                                  : t("mentoring")
                              }
                              area
                            />
                            <button>{t("send")}</button>
                          </form>
                        </div>
                      </section>
                    )}
                    <section className="panel">
                      <h2>Simulated inbox</h2>
                      <form onSubmit={(e) => request(e, "message")}>
                        <Field
                          name="text"
                          label="Message to the consultant"
                          area
                        />
                        <button>{t("send")}</button>
                      </form>
                      <Requests state={state} learnerId={learner.id} />
                    </section>
                  </>
                )}
                {role === "expert" && (
                  <>
                    <section className="panel">
                      <h2>
                        {t("expert")} · {t("profile")}
                      </h2>
                      <p>
                        Status:{" "}
                        {state.consultant.approved
                          ? "Approved"
                          : "Pending admin approval"}
                      </p>
                      <form
                        onSubmit={(e) => {
                          const f = data(e);
                          if (f.liveLink && !safeUrl(f.liveLink)) {
                            setNotice("Use an HTTPS live-class link.");
                            return;
                          }
                          change(
                            {
                              ...state,
                              consultant: {
                                ...state.consultant,
                                name: f.name,
                                bio: f.bio,
                                liveLink: f.liveLink,
                                approved: false,
                              },
                            },
                            "Profile submitted for admin approval.",
                          );
                        }}
                      >
                        <Field
                          label="Fictional teaching name"
                          name="name"
                          initial={state.consultant.name}
                        />
                        <Field
                          label="Teaching experience and access support"
                          name="bio"
                          initial={state.consultant.bio}
                          area
                        />
                        <label>
                          Optional external live-class link
                          <input
                            name="liveLink"
                            type="url"
                            defaultValue={state.consultant.liveLink}
                          />
                        </label>
                        <button>{t("save")}</button>
                      </form>
                    </section>
                    <section className="panel">
                      <h2>
                        {t("learn")} · {t("assignment")}
                      </h2>
                      {!state.enrolments.length && (
                        <p>
                          No enrolments yet. Switch to the learner perspective
                          to enrol.
                        </p>
                      )}
                      {state.enrolments
                        .filter(
                          (e) =>
                            state.courses.find((c) => c.id === e.courseId)
                              ?.consultantId === state.consultant.id,
                        )
                        .map((e) => {
                          const l = state.learners.find(
                            (l) => l.id === e.learnerId,
                          )!;
                          return (
                            <article key={e.id}>
                              <h3>
                                {l.name} ·{" "}
                                {
                                  state.courses.find((c) => c.id === e.courseId)
                                    ?.title
                                }
                              </h3>
                              <p>
                                Support: {l.needs} · Preferred language:{" "}
                                {l.language} · Contact: {l.contact}
                              </p>
                              <p>
                                Lessons: {e.lessons.length} · Best quiz:{" "}
                                {Math.max(0, ...e.scores)}%
                              </p>
                              {e.submitted ? (
                                <>
                                  <p className="submission">{e.submitted}</p>
                                  <form
                                    onSubmit={(ev) => {
                                      const f = data(ev);
                                      change(
                                        updateEnrolment(state, e.id, {
                                          feedback: f.feedback,
                                          approved: f.approve === "on",
                                        }),
                                        "Expert feedback saved; completion eligibility updated.",
                                      );
                                    }}
                                  >
                                    <Field
                                      label={t("feedback")}
                                      name="feedback"
                                      initial={e.feedback}
                                      area
                                    />
                                    <label className="checkbox">
                                      <input
                                        name="approve"
                                        type="checkbox"
                                        defaultChecked={e.approved}
                                      />
                                      Approve practical assignment
                                    </label>
                                    <button>{t("save")}</button>
                                  </form>
                                </>
                              ) : (
                                <p>Awaiting practical assignment.</p>
                              )}
                            </article>
                          );
                        })}
                    </section>
                    <section className="panel">
                      <h2>
                        {t("questions")} · {t("mentoring")}
                      </h2>
                      {!state.requests.length && <p>No requests yet.</p>}
                      {state.requests.map((r) => (
                        <article key={r.id}>
                          <h3>
                            {
                              state.learners.find((l) => l.id === r.learnerId)
                                ?.name
                            }{" "}
                            · {r.kind}
                          </h3>
                          <p>{r.text}</p>
                          <form
                            onSubmit={(e) => {
                              const f = data(e);
                              change({
                                ...state,
                                requests: state.requests.map((x) =>
                                  x.id === r.id
                                    ? {
                                        ...x,
                                        reply: f.reply,
                                        repliedAt: Date.now(),
                                      }
                                    : x,
                                ),
                              });
                            }}
                          >
                            <Field
                              name="reply"
                              label={t("reply")}
                              initial={r.reply}
                              area
                            />
                            <button>{t("send")}</button>
                          </form>
                        </article>
                      ))}
                    </section>
                    <CourseAuthor
                      t={t}
                      onCourse={(c) =>
                        change(
                          { ...state, courses: [...state.courses, c] },
                          "Course sent to admin publication review.",
                        )
                      }
                    />
                    <section className="panel">
                      <h2>Authored courses</h2>
                      {state.courses.map((c) => (
                        <p key={c.id}>
                          {localizeCourse(c, lang).title} · {c.status}
                        </p>
                      ))}
                    </section>
                  </>
                )}
                {role === "admin" && (
                  <>
                    <div className="metrics">
                      {[
                        ["Learners", state.learners.length],
                        ["Enrolments", state.enrolments.length],
                        [
                          "Completions",
                          state.enrolments.filter((e) => e.completedAt).length,
                        ],
                        [
                          "Unanswered requests",
                          state.requests.filter((r) => !r.reply).length,
                        ],
                      ].map(([k, v]) => (
                        <article key={k}>
                          <strong>{v}</strong>
                          <span>{k}</span>
                        </article>
                      ))}
                    </div>
                    <section className="panel">
                      <h2>Participation and support</h2>
                      <p>
                        Quiz attempts:{" "}
                        {state.enrolments.reduce(
                          (n, e) => n + e.scores.length,
                          0,
                        )}{" "}
                        · Passing learners:{" "}
                        {
                          new Set(
                            state.enrolments
                              .filter((e) => Math.max(0, ...e.scores) >= 70)
                              .map((e) => e.learnerId),
                          ).size
                        }{" "}
                        · Mentoring awaiting response:{" "}
                        {
                          state.requests.filter(
                            (r) => r.kind === "mentoring" && !r.reply,
                          ).length
                        }
                      </p>
                      <p>
                        Mean first response:{" "}
                        {state.requests.some((r) => r.repliedAt)
                          ? Math.round(
                              state.requests
                                .filter((r) => r.repliedAt)
                                .reduce(
                                  (n, r) => n + (r.repliedAt! - r.createdAt),
                                  0,
                                ) /
                                state.requests.filter((r) => r.repliedAt)
                                  .length /
                                60000,
                            ) + " minutes"
                          : "No responses yet"}
                        . Employment and income outcomes have not been measured.
                      </p>
                    </section>
                    <section className="panel">
                      <h2>Add a fictional learner</h2>
                      <Profile
                        t={t}
                        onSave={(l) => {
                          change(
                            { ...state, learners: [...state.learners, l] },
                            "Fictional learner added to all role views.",
                          );
                          setActive(l.id);
                        }}
                      />
                    </section>
                    <section className="panel">
                      <h2>Assisted enrolment</h2>
                      <p>
                        Selected learner: {learner.name}. Confirm their
                        fictional preference before assisting.
                      </p>
                      <form
                        onSubmit={(e) => {
                          const f = data(e);
                          const next = enrol(state, learner.id, f.course, true);
                          change(
                            next,
                            next === state
                              ? "Already enrolled or course unavailable."
                              : "Assisted enrolment recorded.",
                          );
                        }}
                      >
                        <label>
                          {t("course")}
                          <select name="course">
                            {state.courses
                              .filter((c) => c.status === "published")
                              .map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="checkbox">
                          <input type="checkbox" required />
                          The fictional learner requested assistance
                        </label>
                        <button>{t("enrol")}</button>
                      </form>
                    </section>
                    <section className="panel">
                      <h2>Publication review</h2>
                      <p>
                        Consultant: {state.consultant.name} ·{" "}
                        {state.consultant.approved
                          ? "Approved"
                          : "Needs review"}
                      </p>
                      <button
                        disabled={state.consultant.approved}
                        onClick={() =>
                          change({
                            ...state,
                            consultant: { ...state.consultant, approved: true },
                          })
                        }
                      >
                        Approve consultant profile
                      </button>
                      {state.courses
                        .filter((c) => c.status !== "published")
                        .map((c) => (
                          <article key={c.id}>
                            <h3>{c.title}</h3>
                            <p>{c.description}</p>
                            <details>
                              <summary>Review all course material</summary>
                              {c.lessons.map((l, i) => (
                                <div key={i}>
                                  <h4>{l.title}</h4>
                                  <p>{l.body}</p>
                                  <p>
                                    {l.resource} {l.video} {l.transcript}
                                  </p>
                                </div>
                              ))}
                              {c.quiz.map((q, i) => (
                                <p key={i}>
                                  {q.question} · {q.options.join(" / ")} ·
                                  Answer: {q.options[q.answer]}
                                </p>
                              ))}
                              <p>Assignment: {c.assignment}</p>
                            </details>
                            <button
                              disabled={!state.consultant.approved}
                              onClick={() =>
                                change(
                                  {
                                    ...state,
                                    courses: state.courses.map((x) =>
                                      x.id === c.id
                                        ? { ...x, status: "published" }
                                        : x,
                                    ),
                                  },
                                  "Course published in this sandbox.",
                                )
                              }
                            >
                              {t("publish")}
                            </button>
                          </article>
                        ))}
                    </section>
                    <section className="panel">
                      <h2>Accessibility support & follow-up</h2>
                      <Profile
                        key={learner.id}
                        learner={learner}
                        t={t}
                        onSave={(l) =>
                          change({
                            ...state,
                            learners: state.learners.map((x) =>
                              x.id === l.id ? l : x,
                            ),
                          })
                        }
                      />
                      {state.requests.map((r) => (
                        <article key={r.id}>
                          <h3>
                            {
                              state.learners.find((l) => l.id === r.learnerId)
                                ?.name
                            }{" "}
                            · {r.kind}
                          </h3>
                          <p>
                            {r.text} · {r.reply ? "Answered" : "Unresolved"}
                          </p>
                          <form
                            onSubmit={(e) => {
                              const f = data(e);
                              change({
                                ...state,
                                requests: state.requests.map((x) =>
                                  x.id === r.id
                                    ? { ...x, followup: f.followup }
                                    : x,
                                ),
                              });
                            }}
                          >
                            <Field
                              name="followup"
                              label="Follow-up owner, date and accessible format"
                              initial={r.followup}
                            />
                            <button>{t("save")}</button>
                          </form>
                        </article>
                      ))}
                    </section>
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>
      <footer>
        <div>
          <strong>IMPACT MOSAIC</strong>
          <p>
            A proposal by Jerry Bannister Zachary.
            <br />
            Designed for inclusion. Built for a conversation.
          </p>
        </div>
        <p>
          Fictional learning sandbox · Independent showcase
          <br />
          No real accounts, message delivery or NDMIS connection.
        </p>
        <a
          href="https://deerflow.tech"
          target="_blank"
          rel="noreferrer"
          className="signature"
        >
          Created By Deerflow ↗
        </a>
      </footer>
    </>
  );
}
function Profile({
  learner,
  t,
  onSave,
}: {
  learner?: Learner;
  t: (k: string) => string;
  onSave: (l: Learner) => void;
}) {
  return (
    <form
      key={learner?.id || "new"}
      onSubmit={(e) => {
        const f = data(e);
        onSave({
          id: learner?.id || uid(),
          name: f.name,
          interests: f.interests,
          needs: f.needs,
          location: f.location,
          qualifications: f.qualifications,
          language: f.language,
          contact: f.contact,
          skills: f.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        });
      }}
    >
      <div className="two-cols">
        {[
          "name",
          "interests",
          "needs",
          "location",
          "qualifications",
          "contact",
        ].map((k) => (
          <Field
            key={k}
            label={t(k)}
            name={k}
            initial={(learner?.[k as keyof Learner] as string) || ""}
          />
        ))}
        <label>
          {t("skills")}
          <input
            name="skills"
            defaultValue={learner?.skills.join(", ")}
            placeholder="Separate with commas"
            maxLength={500}
          />
        </label>
        <label>
          {t("language")}
          <select name="language" defaultValue={learner?.language || "en"}>
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="primary">{t("save")}</button>
    </form>
  );
}
function Quiz({
  course,
  t,
  onScore,
}: {
  course: Course;
  t: (k: string) => string;
  onScore: (s: number) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        const f = data(e);
        onScore(
          grade(
            course,
            course.quiz.map((_, i) => Number(f["q" + i])),
          ),
        );
      }}
    >
      <h3>{t("quiz")} · Pass at 70%. Retry any time.</h3>
      {course.quiz.map((q, i) => (
        <fieldset key={i}>
          <legend>
            {i + 1}. {q.question}
          </legend>
          {q.options.map((o, j) => (
            <label className="checkbox" key={j}>
              <input required type="radio" name={"q" + i} value={j} />
              {o}
            </label>
          ))}
        </fieldset>
      ))}
      <button className="primary">{t("submit")} quiz</button>
    </form>
  );
}
function Requests({ state, learnerId }: { state: State; learnerId: string }) {
  return (
    <>
      {state.requests
        .filter((r) => r.learnerId === learnerId)
        .map((r) => (
          <article key={r.id}>
            <small>
              {r.kind} · {new Date(r.createdAt).toLocaleString()}
            </small>
            <p>{r.text}</p>
            <p>
              {r.reply ? `Expert: ${r.reply}` : "Awaiting expert response."}
            </p>
            {r.followup && <p>Follow-up: {r.followup}</p>}
            {state.consultant.approved &&
              state.consultant.liveLink &&
              safeUrl(state.consultant.liveLink) && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={state.consultant.liveLink}
                >
                  External live-class link ↗
                </a>
              )}
          </article>
        ))}
    </>
  );
}
function CourseAuthor({
  t,
  onCourse,
}: {
  t: (k: string) => string;
  onCourse: (c: Course) => void;
}) {
  const [error, setError] = useState("");
  return (
    <section className="panel">
      <h2>Author a course</h2>
      <p>
        Each lesson starts with a title on its first line. Separate lessons with
        a line containing --- . Assessment JSON supports question, options and a
        zero-based answer index.
      </p>
      <form
        onSubmit={(e) => {
          const f = data(e);
          try {
            const quiz = JSON.parse(f.quiz);
            if (
              !Array.isArray(quiz) ||
              quiz.length < 1 ||
              !quiz.every(
                (q) =>
                  typeof q.question === "string" &&
                  Array.isArray(q.options) &&
                  q.options.length >= 2 &&
                  q.options.every((o: unknown) => typeof o === "string") &&
                  Number.isInteger(q.answer) &&
                  q.answer >= 0 &&
                  q.answer < q.options.length,
              )
            )
              throw Error("Check quiz question, options and answer fields.");
            const lessons = f.lessons.split(/\n---\s*\n/).map((s) => {
              const [title, ...body] = s.trim().split("\n");
              return { title, body: body.join("\n") };
            });
            if (lessons.some((l) => !l.title || !l.body))
              throw Error("Every lesson needs a title and body.");
            if (
              (f.resource && !safeUrl(f.resource)) ||
              (f.video && !safeUrl(f.video))
            )
              throw Error("Links must use HTTPS.");
            if (f.video && !f.transcript)
              throw Error("Video links require a text transcript.");
            lessons[0] = {
              ...lessons[0],
              ...{
                resource: f.resource,
                video: f.video,
                transcript: f.transcript,
              },
            };
            onCourse({
              id: uid(),
              title: f.title,
              description: f.description,
              tag: "Consultant authored",
              skills: f.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              lessons,
              quiz,
              assignment: f.assignment,
              status: "review",
              consultantId: "expert-demo",
            });
            setError("");
            e.currentTarget.reset();
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Check course content.",
            );
          }
        }}
      >
        <Field name="title" label="Course title" />
        <Field name="description" label="Description" />
        <Field name="skills" label="Demonstrated skills (comma-separated)" />
        <Field name="lessons" label="Lesson titles and structured text" area />
        <label>
          Resource link (optional)
          <input name="resource" type="url" />
        </label>
        <label>
          Video link (optional)
          <input name="video" type="url" />
        </label>
        <label>
          Video transcript
          <textarea name="transcript" maxLength={2000} />
        </label>
        <Field
          name="quiz"
          label="Assessment JSON"
          area
          initial={
            '[{"question":"Which action is safe?","options":["Share passwords","Keep passwords private"],"answer":1}]'
          }
        />
        <Field
          name="assignment"
          label="Practical assignment instructions"
          area
        />
        {error && <p role="alert">{error}</p>}
        <button className="primary">
          {t("submit")} for publication review
        </button>
      </form>
    </section>
  );
}
