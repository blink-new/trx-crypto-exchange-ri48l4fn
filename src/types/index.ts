export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw';
  currency: string;
  amount: number;
  address?: string;
  network?: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  hash?: string;
  confirmations?: number;
}

export interface Order {
  id: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price: number;
  amount: number;
  total: number;
  status: 'open' | 'filled' | 'cancelled';
  timestamp: number;
  fillPercent?: number;
}

export interface TransactionLimits {
  daily: number;
  monthly: number;
  minimum: number;
  maximum: number;
}

export interface NetworkConfig {
  name: string;
  code: string;
  confirmations: number;
  estimatedTime: string;
  fee: string;
  minWithdraw: string;
  maxWithdraw: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'demo' | 'real';
  currency: 'USD' | 'EUR';
  accountNumber: string;
  balance: number;
  wallets: Record<string, string>;
  icon: string;
}