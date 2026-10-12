import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // أسعار تجريبية للجرام بالريال العُماني
  goldPrices = [
    { karat: 18, price: 27.500 },
    { karat: 21, price: 32.100 },
    { karat: 22, price: 33.600 },
    { karat: 24, price: 36.700 }
  ];

  // بيانات الحاسبة
  selectedKarat = '21';
  weight = '10';
  calculatedValue: number | null = null;
  calculatorError = '';

  // العيار المختار لسجل الأسعار
  historyKarat = '21';

  // إنشاء بيانات تجريبية لآخر 30 يومًا
  historyRows = this.createHistoryRows();

  private createHistoryRows() {
    const rows = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const variation = Math.sin(i * 0.55) * 0.35
        + Math.cos(i * 0.23) * 0.20
        + (29 - i) * 0.008;

      rows.push({
        date: date.toLocaleDateString('ar-OM'),
        k18: 27.500 + variation * 18 / 21,
        k21: 32.100 + variation,
        k22: 33.600 + variation * 22 / 21,
        k24: 36.700 + variation * 24 / 21
      });
    }

    return rows;
  }

  // عند تغيير عيار الذهب في الحاسبة
  onKaratChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedKarat = select.value;
    this.calculatedValue = null;
    this.calculatorError = '';
  }

  // عند إدخال الوزن
  onWeightChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.weight = input.value;
    this.calculatedValue = null;
    this.calculatorError = '';
  }

  // حساب القيمة التقديرية للذهب
  calculateGold(): void {
    const enteredWeight = Number(this.weight);

    if (
      this.weight.trim() === '' ||
      !Number.isFinite(enteredWeight) ||
      enteredWeight <= 0
    ) {
      this.calculatorError = 'يرجى إدخال وزن صحيح أكبر من صفر.';
      this.calculatedValue = null;
      return;
    }

    const gold = this.goldPrices.find(
      item => item.karat === Number(this.selectedKarat)
    );

    if (!gold) {
      this.calculatorError = 'يرجى اختيار عيار صحيح.';
      this.calculatedValue = null;
      return;
    }

    this.calculatedValue = gold.price * enteredWeight;
    this.calculatorError = '';
  }

  // تغيير العيار في سجل الأسعار
  selectHistoryKarat(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.historyKarat = select.value;
  }

  // استخراج أسعار العيار المختار
  get selectedHistoryPrices(): number[] {
    const key = `k${this.historyKarat}` as
      'k18' | 'k21' | 'k22' | 'k24';

    return this.historyRows.map(row => row[key]);
  }

  // ملخص الأسعار: الحالي والأعلى والأقل
  get historyStats() {
    const prices = this.selectedHistoryPrices;

    return {
      current: prices[prices.length - 1] ?? 0,
      high: Math.max(...prices),
      low: Math.min(...prices)
    };
  }

  // تجهيز الأعمدة للرسم البياني
  get historyPoints() {
    const prices = this.selectedHistoryPrices;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    return prices.map((price, index) => ({
      day: index,
      price,
      height: 15 + ((price - min) / range) * 85
    }));
  }
}