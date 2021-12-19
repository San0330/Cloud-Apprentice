const waiter = (delay) =>
  new Promise((resolve, _) => setTimeout(resolve, delay));

const fetchWithRetry = async (url, nTimes) => {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (err) {
    if (nTimes == 0) throw err;
    await waiter(2000);
    console.log(`Retrying...`);
    return fetchWithRetry(url, nTimes - 1);
  }
};

function parseCookies() {
  let cookieString = decodeURIComponent(document.cookie);
  let cookies = cookieString.split(";");
  let cookieData = {};
  for (let i = 0; i < cookies.length; i++) {
    let [name, value] = cookies[i].split("=");
    cookieData[name.trim()] = value.trim();
  }
  return cookieData;
}

const orderBtns = document.querySelectorAll(".order-btn");
orderBtns.forEach((orderBtn) => {
  orderBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    let cookieData = parseCookies();
    let name = cookieData.name;
    let phone = cookieData.phone;

    try {
      let data = await fetchWithRetry(
        `http://192.168.49.2:30101/orders?name=${name}&phone=${phone}`,
        5
      );
      alert(data.message);
    } catch (e) {
      alert("Something went wrong!!!");
    }
  });
});
