import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class ExchangeRateService {
  async getUsdRonRate(): Promise<{ rate: number; date: string }> {
    const response = await fetch('https://www.bnr.ro/nbrfxrates.xml');
    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });

    const data = parser.parse(xml);

    const cube = data.DataSet.Body.Cube;
    const rates = cube.Rate;

    const usdRate = rates.find((rate) => rate.currency === 'USD');

    return {
      rate: Number(usdRate['#text']),
      date: cube.date,
    };
  }
}
