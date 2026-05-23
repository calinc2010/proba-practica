export interface CurrencyExchangeProduct {
  id: string;
  originalProductId: string;
  imageUrl: string;
  name: string;
  description: string;
  priceUsd: string;
  priceRon: string;
  usdRonRate: string;
  exchangeRateDate: string;
}
