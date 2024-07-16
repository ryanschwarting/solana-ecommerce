const fetchSolPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
  );
  const data = await response.json();
  return data.solana.usd;
};

export const getSolPriceFromLocalStorage = () => {
  const solPriceData = localStorage.getItem("solPriceData");
  if (solPriceData) {
    const { price, timestamp } = JSON.parse(solPriceData);
    const now = new Date().getTime();
    if (now - timestamp < 5 * 60 * 1000) {
      return price;
    }
  }
  return null;
};

export const setSolPriceToLocalStorage = (price: number) => {
  const solPriceData = {
    price,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem("solPriceData", JSON.stringify(solPriceData));
};

export const getSolPrice = async () => {
  let price = getSolPriceFromLocalStorage();
  if (price === null) {
    price = await fetchSolPrice();
    setSolPriceToLocalStorage(price);
  }
  return price;
};
