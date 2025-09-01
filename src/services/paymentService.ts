import { Alert } from 'react-native';

interface PixPaymentData {
  amount: number;
  description: string;
  pixKey: string;
  payerName: string;
  payerEmail: string;
}

interface CardPaymentData {
  amount: number;
  description: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
}

class PaymentService {
  // Processar pagamento PIX
  async processPixPayment(paymentData: PixPaymentData): Promise<{
    success: boolean;
    transactionId?: string;
    qrCode?: string;
    pixCode?: string;
    error?: string;
  }> {
    try {
      // Simular processamento PIX
      // Em produção, integrar com gateway de pagamento real
      
      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          transactionId: result.transactionId,
          qrCode: result.qrCode,
          pixCode: result.pixCode,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Erro no processamento do PIX',
        };
      }
    } catch (error) {
      console.error('Erro no pagamento PIX:', error);
      return {
        success: false,
        error: 'Erro de conexão. Tente novamente.',
      };
    }
  }

  // Processar pagamento com cartão
  async processCardPayment(paymentData: CardPaymentData): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    try {
      // Validar dados do cartão
      if (!this.validateCardNumber(paymentData.cardNumber)) {
        return {
          success: false,
          error: 'Número do cartão inválido',
        };
      }

      if (!this.validateExpiryDate(paymentData.expiryDate)) {
        return {
          success: false,
          error: 'Data de validade inválida',
        };
      }

      if (!this.validateCVV(paymentData.cvv)) {
        return {
          success: false,
          error: 'CVV inválido',
        };
      }

      // Processar pagamento
      const response = await fetch('/api/payments/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          transactionId: result.transactionId,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Erro no processamento do cartão',
        };
      }
    } catch (error) {
      console.error('Erro no pagamento com cartão:', error);
      return {
        success: false,
        error: 'Erro de conexão. Tente novamente.',
      };
    }
  }

  // Gerar QR Code PIX
  generatePixQRCode(pixKey: string, amount: number, description: string): string {
    // Implementar geração de QR Code PIX real
    // Por enquanto, retornar um código simulado
    const pixCode = `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${amount.toFixed(2)}5802BR5925${description}6009SAO PAULO62070503***6304`;
    return pixCode;
  }

  // Validações
  private validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned) && this.luhnCheck(cleaned);
  }

  private validateExpiryDate(expiryDate: string): boolean {
    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiry > now;
  }

  private validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // Formatar número do cartão
  formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ') : '';
  }

  // Formatar data de validade
  formatExpiryDate(expiryDate: string): string {
    const cleaned = expiryDate.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  }

  // Obter tipo do cartão
  getCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6/.test(cleaned)) return 'discover';
    
    return 'unknown';
  }

  // Processar assinatura premium
  async subscribePremium(planType: 'user' | 'church', paymentMethod: 'pix' | 'card', paymentData: any) {
    try {
      const plans = {
        user: { price: 19.90, name: 'Premium Usuário' },
        church: { price: 49.90, name: 'Premium Igreja' }
      };

      const plan = plans[planType];
      
      if (paymentMethod === 'pix') {
        return await this.processPixPayment({
          amount: plan.price,
          description: `Assinatura ${plan.name}`,
          pixKey: paymentData.pixKey,
          payerName: paymentData.payerName,
          payerEmail: paymentData.payerEmail,
        });
      } else {
        return await this.processCardPayment({
          amount: plan.price,
          description: `Assinatura ${plan.name}`,
          ...paymentData,
        });
      }
    } catch (error) {
      console.error('Erro na assinatura premium:', error);
      return {
        success: false,
        error: 'Erro ao processar assinatura premium',
      };
    }
  }
}

export const paymentService = new PaymentService();