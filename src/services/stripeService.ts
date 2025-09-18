import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

export async function openPaymentSheet(amount: number, description: string): Promise<{ success: boolean; error?: string }>{
  try {
    const res = await fetch('/api/payments/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description, currency: 'brl' })
    });
    const json = await res.json();
    if (!json.clientSecret) return { success: false, error: 'Erro ao iniciar pagamento' };

    const init = await initPaymentSheet({
      paymentIntentClientSecret: json.clientSecret,
      merchantDisplayName: 'ConnectFé',
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: { name: 'Usuário ConnectFé' }
    });
    if (init.error) return { success: false, error: init.error.message };

    const present = await presentPaymentSheet();
    if (present.error) return { success: false, error: present.error.message };

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha no pagamento' };
  }
}

