document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const roleSelect = document.getElementById("role");
  const msg = document.getElementById("loginMsg");

  if (!loginBtn) return;

  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;

    if (username !== "admin" || password !== "123456") {
      msg.textContent = "用户名或密码错误";
      return;
    }

    if (!role) {
      msg.textContent = "请选择登录分类：npc / 玩家 / boss";
      return;
    }

    const userInfo = {
      username,
      role
    };

    sessionStorage.setItem("blank_space_user", JSON.stringify(userInfo));
    msg.textContent = "登录成功，正在进入论坛...";
    setTimeout(() => {
      window.location.href = "./forum.html";
    }, 700);
  });
});