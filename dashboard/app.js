const stepDetails = {
  planner: {
    title: "Planner",
    copy: "사용자 주제에서 핵심 키워드와 관련 분야를 뽑아 검색 방향을 정합니다. 현재 예시는 marketing과 information systems를 선택했습니다.",
  },
  journal: {
    title: "Journal Selector",
    copy: "xlsx/json에 정의된 허용 저널 안에서만 논문을 필터링합니다. 이 제약이 hallucination과 저품질 결과를 줄이는 핵심입니다.",
  },
  retriever: {
    title: "Retriever",
    copy: "OpenAlex 후보를 가져오고, 첫 검색 결과가 부족하면 더 넓은 쿼리로 재검색합니다. 현재 데모는 2번의 retrieval attempt를 보여줍니다.",
  },
  verifier: {
    title: "Verifier",
    copy: "DOI resolve 여부, 저널명, open access 상태를 검증합니다. 반환된 Top papers는 모두 DOI valid 상태입니다.",
  },
  ranker: {
    title: "Ranker & Comparator",
    copy: "관련성, 인용 수, 최신성, DOI 검증, open access 여부를 합쳐 점수를 계산하고 common point, difference, research gap을 만듭니다.",
  },
  critic: {
    title: "Critic & Report",
    copy: "결과 수가 목표 Top 5보다 적은 경우처럼 품질 이슈를 표시하고 Markdown/HTML 보고서로 남깁니다.",
  },
};

const journalDetails = {
  marketing: {
    title: "Marketing Journal Universe",
    copy: "마케팅 분야 상위 저널을 중심으로 소비자 행동, AI 마케팅, 리테일, 제품 혁신 연구를 탐색합니다.",
    rows: [
      ["Matched papers", "2"],
      ["Example journals", "Journal of Marketing, Journal of the Academy of Marketing Science"],
      ["Use case", "Consumer trust, AI disclosure, online reviews"],
    ],
  },
  is: {
    title: "Information Systems Journal Universe",
    copy: "정보시스템 분야 저널을 통해 privacy, platform, online systems, decision support 관련 연구를 탐색합니다.",
    rows: [
      ["Matched papers", "1"],
      ["Example journals", "MIS Quarterly, Information Systems Research"],
      ["Use case", "Online platforms, privacy, digital trust"],
    ],
  },
  management: {
    title: "Management Journal Universe",
    copy: "조직, 전략, 경영 일반 분야의 상위 저널입니다. 현재 예시 쿼리에서는 최종 Top paper가 없습니다.",
    rows: [
      ["Matched papers", "0"],
      ["Example journals", "Academy of Management Journal, Strategic Management Journal"],
      ["Use case", "Organization, strategy, management theory"],
    ],
  },
};

const paperDetails = {
  "consumers-ai": {
    title: "Consumers and Artificial Intelligence: An Experiential Perspective",
    copy: "AI와 consumer 키워드가 직접 매칭되며, Journal of Marketing에 게재된 open access 논문입니다.",
    rows: [
      ["Journal", "Journal of Marketing"],
      ["Year", "2020"],
      ["DOI", "10.1177/0022242920953847"],
      ["Citations", "976"],
      ["Research gap", "AI, consumer를 disclosure, trust, online review 맥락과 연결할 수 있습니다."],
    ],
  },
  "strategic-ai": {
    title: "A strategic framework for artificial intelligence in marketing",
    copy: "AI 마케팅 전략 프레임워크 논문입니다. 직접적인 disclosure/trust 키워드는 약하지만 배경 이론으로 활용할 수 있습니다.",
    rows: [
      ["Journal", "Journal of the Academy of Marketing Science"],
      ["Year", "2020"],
      ["DOI", "10.1007/s11747-020-00749-9"],
      ["Citations", "1474"],
      ["Research gap", "AI 전략 논의를 consumer trust와 disclosure 설계로 좁힐 수 있습니다."],
    ],
  },
  "privacy-digital": {
    title: "Privacy in the Digital Age: a Review of Information Privacy Research in Information Systems",
    copy: "MIS Quarterly의 정보 프라이버시 리뷰 논문입니다. online review platform의 trust/privacy 논의에 연결할 수 있습니다.",
    rows: [
      ["Journal", "MIS Quarterly"],
      ["Year", "2011"],
      ["DOI", "10.2307/41409971"],
      ["Citations", "1289"],
      ["Research gap", "privacy와 AI disclosure 기반 신뢰 형성 메커니즘을 연결할 수 있습니다."],
    ],
  },
};

const insightTitle = document.querySelector("#insight-title");
const insightCopy = document.querySelector("#insight-copy");
const paperGrid = document.querySelector(".paper-grid");
const dialog = document.querySelector("#detail-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCopy = document.querySelector("#dialog-copy");
const dialogGrid = document.querySelector("#dialog-grid");
const dialogEyebrow = document.querySelector("#dialog-eyebrow");

function setInsight(detail) {
  insightTitle.textContent = detail.title;
  insightCopy.textContent = detail.copy;
}

function openDetail(eyebrow, detail) {
  dialogEyebrow.textContent = eyebrow;
  dialogTitle.textContent = detail.title;
  dialogCopy.textContent = detail.copy;
  dialogGrid.innerHTML = detail.rows
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
  dialog.showModal();
}

function filterPapers(domain) {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === domain);
  });

  document.querySelectorAll(".paper-card").forEach((card) => {
    const show = domain === "all" || card.dataset.domain === domain;
    card.hidden = !show;
  });
}

function sortPapers(key) {
  const cards = [...document.querySelectorAll(".paper-card")];
  cards
    .sort((a, b) => Number(b.dataset[key]) - Number(a.dataset[key]))
    .forEach((card) => paperGrid.append(card));
}

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-step]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    setInsight(stepDetails[button.dataset.step]);
    document.querySelector("#evaluation").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

document.querySelectorAll("[data-journal]").forEach((button) => {
  button.addEventListener("click", () => {
    openDetail("Journal detail", journalDetails[button.dataset.journal]);
  });
});

document.querySelectorAll("[data-open-paper]").forEach((button) => {
  button.addEventListener("click", () => {
    openDetail("Paper detail", paperDetails[button.dataset.openPaper]);
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    filterPapers(button.dataset.filter);
    document.querySelector("#papers").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    sortPapers(button.dataset.sort);
  });
});

document.querySelector("[data-close-dialog]").addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (outside) {
    dialog.close();
  }
});
