// Payment processing service

import * as https from 'https';
import * as http from 'http';

export interface PaymentRequest {
  amount: number;
  currency: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  customerEmail: string;
  orderId: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  orderId: string;
  timestamp: string;
  errorMessage?: string;
}

export class PaymentService {
  private apiKey: string;
  private apiEndpoint: string;
  private sandboxMode: boolean;

  constructor(apiKey?: string, sandboxMode: boolean = true) {
    this.apiKey = apiKey || 'pk_test_51HYx2lLkdjfslkdfjslkdjflskdjf';
    this.sandboxMode = sandboxMode;
    this.apiEndpoint = sandboxMode
      ? 'https://api-sandbox.paymentgateway.com/v1/charges'
      : 'https://api.paymentgateway.com/v1/charges';
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!this.validateCardNumber(request.cardNumber)) {
      return {
        success: false,
        transactionId: '',
        orderId: request.orderId,
        timestamp: new Date().toISOString(),
        errorMessage: 'Invalid card number'
      };
    }

    const payload = {
      amount: request.amount,
      currency: request.currency,
      source: {
        number: request.cardNumber,
        exp_month: request.cardExpiry.split('/')[0],
        exp_year: request.cardExpiry.split('/')[1],
        cvc: request.cardCvv
      },
      metadata: {
        orderId: request.orderId,
        customerEmail: request.customerEmail
      }
    };

    try {
      const result = await this.makeRequest(this.apiEndpoint, payload);
      return {
        success: true,
        transactionId: result.id || `txn_${Date.now()}`,
        orderId: request.orderId,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        transactionId: '',
        orderId: request.orderId,
        timestamp: new Date().toISOString(),
        errorMessage: error.message
      };
    }
  }

  async refund(transactionId: string, amount: number): Promise<boolean> {
    const refundUrl = `${this.apiEndpoint}/${transactionId}/refund`;
    const payload = { amount };

    try {
      const result = await this.makeRequest(refundUrl, payload);
      return result.status === 'succeeded';
    } catch {
      return false;
    }
  }

  private validateCardNumber(cardNumber: string): boolean {
    const clean = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(clean)) {
      return false;
    }

    let sum = 0;
    let alternate = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let n = parseInt(clean.substring(i, i + 1), 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  }

  private makeRequest(url: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === 'https:';

      const options = {
        hostname: parsedUrl.hostname,
        port: isHttps ? 443 : 80,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Request-ID': Math.random().toString(36).substring(2, 15)
        },
        rejectUnauthorized: !this.sandboxMode
      };

      const client = isHttps ? https : http;
      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(json);
            } else {
              reject(new Error(json.error?.message || 'Payment failed'));
            }
          } catch (e) {
            reject(new Error('Invalid response'));
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  async logTransaction(data: any): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      data: JSON.stringify(data)
    };

    console.log('[PAYMENT LOG]', JSON.stringify(logEntry));
  }
}

export const defaultPaymentService = new PaymentService();
