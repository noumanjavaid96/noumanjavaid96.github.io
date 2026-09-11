const header = document.querySelector("[data-header]");
const progressBar = document.querySelector(".scroll-progress span");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const pointerLight = document.querySelector(".pointer-light");
const heroArt = document.querySelector("[data-hero-art]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const projectData = {
  longpass: {
    kicker: "Longpass / Product systems",
    title: "Connecting company decisions to an employee experience that makes sense.",
    summary:
      "Longpass needed a coherent incentive journey across two sides of the product: company administrators making decisions and employees understanding what those decisions meant.",
    challenge:
      "Stakeholder feedback covered KPI baselines, targets, review dates, pending units, awards, claims, vesting, carry-forward, and performance history. Each element had value, but the experience needed one connected model.",
    contribution:
      "I translated feedback into linked workflows, clarified the relationship between admin and employee actions, documented decisions, and shaped a review-ready product story for stakeholder demos.",
    outcome:
      "The work established a coherent admin-to-employee journey and made the platform easier to discuss, validate, and move toward a pilot-ready experience.",
    tags: ["Product workflow", "Delivery coordination", "Stakeholder demos", "Experience logic"],
    link: "https://www.longpass.co/",
  },
  inscape: {
    kicker: "InScape / Platform strategy",
    title: "A build-ready foundation for membership, campaigns, rewards, and trust.",
    summary:
      "InScape brought together membership, Campaign Credits, live campaigns, Partner Offers, admin operations, and a mobile experience. Delivery needed one shared source of product truth.",
    challenge:
      "The platform combined commercial, operational, experience, data, and go-live decisions across several connected journeys. Ambiguity risked entering delivery as an unapproved assumption.",
    contribution:
      "I developed an integrated BRD, FRD, and SRS; defined the mobile-first MVP; documented journeys, states, APIs, traceability, security, analytics, tests, open decisions, and phased delivery.",
    outcome:
      "The team gained a structured requirements baseline, clearer launch priorities, and explicit go-live gates around terminology, ledger integrity, trust, and unresolved stakeholder decisions.",
    tags: ["MVP strategy", "BRD / FRD / SRS", "Traceability", "Go-live controls"],
    link: "https://inscapedls.com/",
  },
  microleague: {
    kicker: "MicroLeague Sports / Release readiness",
    title: "Testing a connected sports ecosystem—not a collection of isolated screens.",
    summary:
      "MicroLeague spans simulations, predictions, brackets, survivor pools, challenges, profiles, balances, and wallet behaviour. Product quality depends on the state moving correctly between them.",
    challenge:
      "Issues could appear local while originating in shared authentication, state management, data synchronisation, economic logic, or an adjacent product surface.",
    contribution:
      "I tested critical journeys end to end, documented expected and actual behaviour, grouped findings by module, assigned severity and priority, and separated launch blockers from later polish.",
    outcome:
      "Stakeholders received a clearer picture of release risk and the team could prioritise the defects that most affected workflow integrity, customer trust, and launch readiness.",
    tags: ["Cross-platform QA", "UAT", "Severity triage", "Release decisions"],
    link: "https://www.microleaguesports.com/",
  },
  verity: {
    kicker: "VerityIndex / Conversational AI",
    title: "Giving a real-time AI agent structure, control, and safer behaviour.",
    summary:
      "A real-time calling experience has to listen, respond, recover, execute tools, and handle interruption without losing the purpose or boundaries of the conversation.",
    challenge:
      "Natural conversations are unpredictable. The agent needed explicit control logic for turn-taking, interruption handling, recovery paths, tool execution, and adversarial behaviour.",
    contribution:
      "I architected system prompts and dialogue-state trees, prepared conversational datasets, supported fine-tuning workflows, and designed repeatable jailbreak and prompt-injection evaluations.",
    outcome:
      "The resulting architecture created a clearer control model for agent behaviour and a repeatable basis for prompt hardening, evaluation, and regression testing.",
    tags: ["System prompts", "Dialogue states", "Dataset preparation", "AI security"],
    link: "https://verityindex.com/",
  },
};

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  header?.classList.toggle("is-scrolled", scrollTop > 16);
  if (progressBar) progressBar.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
}

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  navigation?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("dialog-open", willOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("dialog-open");
  });
});

if (!reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => revealObserver.observe(item));

  document.addEventListener("pointermove", (event) => {
    if (pointerLight) {
      pointerLight.style.left = `${event.clientX}px`;
      pointerLight.style.top = `${event.clientY}px`;
    }
    if (heroArt && event.pointerType !== "touch") {
      const x = (event.clientX / window.innerWidth - 0.5) * 10;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      heroArt.style.setProperty("--parallax-x", `${x}px`);
      heroArt.style.setProperty("--parallax-y", `${y}px`);
    }
  }, { passive: true });
} else {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.25, 0.5] },
);
document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const dialog = document.querySelector("#case-dialog");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogKicker = document.querySelector("[data-dialog-kicker]");
const dialogSummary = document.querySelector("[data-dialog-summary]");
const dialogChallenge = document.querySelector("[data-dialog-challenge]");
const dialogContribution = document.querySelector("[data-dialog-contribution]");
const dialogOutcome = document.querySelector("[data-dialog-outcome]");
const dialogTags = document.querySelector("[data-dialog-tags]");
const dialogLink = document.querySelector("[data-dialog-link]");

function openCase(key) {
  const item = projectData[key];
  if (!item || !dialog) return;
  dialogKicker.textContent = item.kicker;
  dialogTitle.textContent = item.title;
  dialogSummary.textContent = item.summary;
  dialogChallenge.textContent = item.challenge;
  dialogContribution.textContent = item.contribution;
  dialogOutcome.textContent = item.outcome;
  dialogTags.replaceChildren(...item.tags.map((tag) => {
    const li = document.createElement("li");
    li.textContent = tag;
    return li;
  }));
  if (item.link) {
    dialogLink.href = item.link;
    dialogLink.hidden = false;
  } else {
    dialogLink.hidden = true;
  }
  dialog.showModal();
  document.body.classList.add("dialog-open");
  history.replaceState(null, "", `#case-${key}`);
}

function closeCase() {
  if (!dialog?.open) return;
  dialog.close();
  document.body.classList.remove("dialog-open");
  history.replaceState(null, "", "#work");
}

document.querySelectorAll("[data-open-case]").forEach((button) => {
  button.addEventListener("click", () => openCase(button.dataset.openCase));
});
document.querySelector("[data-close-dialog]")?.addEventListener("click", closeCase);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeCase();
});
dialog?.addEventListener("close", () => document.body.classList.remove("dialog-open"));

const initialCase = window.location.hash.match(/^#case-(.+)$/)?.[1];
if (initialCase && projectData[initialCase]) openCase(initialCase);

document.querySelector("[data-copy-link]")?.addEventListener("click", async () => {
  const status = document.querySelector("[data-copy-status]");
  try {
    await navigator.clipboard.writeText(window.location.href.split("#")[0]);
    status.textContent = "Portfolio link copied.";
  } catch {
    status.textContent = "Copy the URL from your browser to share this portfolio.";
  }
  window.setTimeout(() => { status.textContent = ""; }, 3000);
});

document.querySelector("[data-year]").textContent = String(new Date().getFullYear());
