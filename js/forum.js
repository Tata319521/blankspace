document.addEventListener("DOMContentLoaded", async () => {
  const userRaw = sessionStorage.getItem("blank_space_user");
  if (!userRaw) {
    window.location.href = "./index.html";
    return;
  }

  const user = JSON.parse(userRaw);

  const welcomeText = document.getElementById("welcomeText");
  const logoutBtn = document.getElementById("logoutBtn");
  const dungeonList = document.getElementById("dungeonList");
  const dungeonDetail = document.getElementById("dungeonDetail");
  const reviewList = document.getElementById("reviewList");
  const submitReviewBtn = document.getElementById("submitReviewBtn");
  const reviewMsg = document.getElementById("reviewMsg");
  const reviewUser = document.getElementById("reviewUser");
  const reviewScore = document.getElementById("reviewScore");
  const reviewContent = document.getElementById("reviewContent");

  welcomeText.textContent = `欢迎你，${user.username}（${user.role}）`;
  reviewUser.value = user.username;

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("blank_space_user");
    window.location.href = "./index.html";
  });

  let dungeons = [];
  let currentDungeonId = null;

  try {
    const res = await fetch("./data/dungeons.json");
    dungeons = await res.json();
  } catch (error) {
    dungeonDetail.innerHTML = `<p>副本数据加载失败，请确认是否使用 Live Server 运行项目。</p>`;
    return;
  }

  function getLocalReviews() {
    return JSON.parse(localStorage.getItem("blank_space_reviews") || "{}");
  }

  function saveLocalReviews(data) {
    localStorage.setItem("blank_space_reviews", JSON.stringify(data));
  }

  function getMergedReviews(dungeon) {
    const localReviews = getLocalReviews();
    const extra = localReviews[dungeon.id] || [];
    const base = dungeon.reviews || [];
    return [...extra, ...base];
  }

  function calcAvg(reviews) {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, item) => sum + Number(item.score), 0);
    return (total / reviews.length).toFixed(1);
  }

  function makeStars(score) {
    const rounded = Math.round(score);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  }

  function renderSidebar() {
    dungeonList.innerHTML = "";

    dungeons.forEach((dungeon) => {
      const reviews = getMergedReviews(dungeon);
      const avg = calcAvg(reviews);

      const item = document.createElement("div");
      item.className = "dungeon-item" + (dungeon.id === currentDungeonId ? " active" : "");
      item.innerHTML = `
        <div class="title">${dungeon.title}</div>
        <div class="meta">${dungeon.type} · ${dungeon.difficulty}</div>
        <div class="score">评分：${avg} / 5　·　${reviews.length} 条评价</div>
      `;

      item.addEventListener("click", () => {
        currentDungeonId = dungeon.id;
        renderSidebar();
        renderCurrentDungeon();
      });

      dungeonList.appendChild(item);
    });
  }

  function renderCurrentDungeon() {
    const dungeon = dungeons.find(d => d.id === currentDungeonId);
    if (!dungeon) return;

    const reviews = getMergedReviews(dungeon);
    const avg = calcAvg(reviews);

    dungeonDetail.innerHTML = `
      <h2>${dungeon.title}</h2>
      <div class="detail-meta">
        <span class="tag">${dungeon.type}</span>
        <span class="tag">难度：${dungeon.difficulty}</span>
        ${dungeon.tags.map(tag => `<span class="tag"># ${tag}</span>`).join("")}
      </div>
      <div class="detail-desc">${dungeon.description}</div>

      <div class="score-panel">
        <div class="score-number">${avg}</div>
        <div>
          <div class="score-stars">${makeStars(Number(avg))}</div>
          <div class="score-info">共 ${reviews.length} 条评价</div>
        </div>
      </div>
    `;

    renderReviews(reviews);
  }

  function renderReviews(reviews) {
    if (!reviews.length) {
      reviewList.innerHTML = `<div class="empty-text">暂无评价，来写下第一条评论吧。</div>`;
      return;
    }

    reviewList.innerHTML = reviews.map(item => `
      <div class="review-item">
        <div class="review-head">
          <div>
            <span class="review-user">${item.user}</span>
            <span class="review-role">(${item.role})</span>
          </div>
          <div>
            <span class="review-score">评分：${item.score} / 5</span>
            <span class="review-time">　${item.time}</span>
          </div>
        </div>
        <div class="review-content">${item.content}</div>
      </div>
    `).join("");
  }

  submitReviewBtn.addEventListener("click", () => {
    const nickname = reviewUser.value.trim() || user.username;
    const score = Number(reviewScore.value);
    const content = reviewContent.value.trim();

    if (score < 0 || score > 5 || Number.isNaN(score)) {
      reviewMsg.textContent = "评分请输入 0 到 5 之间的数字";
      return;
    }

    if (!content) {
      reviewMsg.textContent = "评价内容不能为空";
      return;
    }

    const localReviews = getLocalReviews();
    if (!localReviews[currentDungeonId]) {
      localReviews[currentDungeonId] = [];
    }

    localReviews[currentDungeonId].unshift({
      user: nickname,
      role: user.role,
      score: Number(score).toFixed(1),
      content,
      time: formatNow()
    });

    saveLocalReviews(localReviews);
    reviewContent.value = "";
    reviewScore.value = "4.5";
    reviewMsg.textContent = "评价发表成功";

    renderSidebar();
    renderCurrentDungeon();
  });

  function formatNow() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}`;
  }

  currentDungeonId = dungeons[0]?.id || null;
  renderSidebar();
  renderCurrentDungeon();


  // 新增骰子按钮事件
const diceBtn = document.getElementById("diceBtn");
if (diceBtn) {
  diceBtn.addEventListener("click", () => {
    window.location.href = "./dice.html";
  });
}
});