import React, { useState } from 'react';
import { Bitcoin, TrendingUp, Copy, Check, HelpCircle } from 'lucide-react';

type CryptoTab = 'PROFIT_CALC' | 'MINING_CALC' | 'DCA_CALC' | 'GAS_FEE';

const CryptoTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CryptoTab>('PROFIT_CALC');
  const [copied, setCopied] = useState(false);

  // Profit Calculator State
  const [profitData, setProfitData] = useState({
    amount: '',
    buyPrice: '',
    sellPrice: '',
    fees: ''
  });
  const [profitResult, setProfitResult] = useState({ profit: 0, roi: 0, total: 0 });

  // Mining Calculator State
  const [miningData, setMiningData] = useState({
    hashrate: '',
    power: '',
    electricityCost: '',
    poolFee: '',
    difficulty: '',
    blockReward: '',
    price: ''
  });
  const [miningResult, setMiningResult] = useState({ daily: 0, monthly: 0, yearly: 0, profitDaily: 0 });

  // DCA Calculator State
  const [dcaData, setDcaData] = useState({
    investment: '',
    frequency: 'monthly',
    duration: '',
    returnRate: ''
  });
  const [dcaResult, setDcaResult] = useState({ totalInvested: 0, futureValue: 0, profit: 0 });

  // Gas Fee Estimator State
  const [gasData, setGasData] = useState({
    gasPrice: '',
    gasLimit: '',
    ethPrice: ''
  });
  const [gasFee, setGasFee] = useState({ gwei: 0, eth: 0, usd: 0 });

  // Calculate Profit
  React.useEffect(() => {
    const amount = parseFloat(profitData.amount) || 0;
    const buyPrice = parseFloat(profitData.buyPrice) || 0;
    const sellPrice = parseFloat(profitData.sellPrice) || 0;
    const fees = parseFloat(profitData.fees) || 0;

    const investment = amount * buyPrice;
    const revenue = amount * sellPrice;
    const profit = revenue - investment - fees;
    const roi = investment > 0 ? (profit / investment) * 100 : 0;

    setProfitResult({ profit, roi, total: revenue });
  }, [profitData]);

  // Calculate Mining Profitability
  React.useEffect(() => {
    const hashrate = parseFloat(miningData.hashrate) || 0;
    const power = parseFloat(miningData.power) || 0;
    const electricityCost = parseFloat(miningData.electricityCost) || 0;
    const poolFee = parseFloat(miningData.poolFee) || 2;
    const blockReward = parseFloat(miningData.blockReward) || 6.25;
    const price = parseFloat(miningData.price) || 50000;

    // Simplified calculation (real mining is more complex)
    const dailyRevenue = (hashrate / 1000000000) * blockReward * price;
    const dailyElectricity = (power / 1000) * 24 * electricityCost;
    const dailyProfit = dailyRevenue - dailyElectricity - (dailyRevenue * poolFee / 100);

    setMiningResult({
      daily: dailyRevenue,
      monthly: dailyRevenue * 30,
      yearly: dailyRevenue * 365,
      profitDaily: dailyProfit
    });
  }, [miningData]);

  // Calculate DCA Returns
  React.useEffect(() => {
    const investment = parseFloat(dcaData.investment) || 0;
    const duration = parseFloat(dcaData.duration) || 0;
    const returnRate = parseFloat(dcaData.returnRate) || 0;

    const periods = dcaData.frequency === 'monthly' ? duration : duration * 12;
    const totalInvested = investment * periods;
    
    // Future value with compound interest
    const monthlyRate = returnRate / 100 / 12;
    let futureValue = 0;
    for (let i = 0; i < periods; i++) {
      futureValue += investment * Math.pow(1 + monthlyRate, periods - i);
    }

    setProfitResult({ profit: futureValue - totalInvested, roi: ((futureValue - totalInvested) / totalInvested) * 100, total: futureValue });
    setDcaResult({ totalInvested, futureValue, profit: futureValue - totalInvested });
  }, [dcaData]);

  // Calculate Gas Fees
  React.useEffect(() => {
    const gasPrice = parseFloat(gasData.gasPrice) || 0;
    const gasLimit = parseFloat(gasData.gasLimit) || 21000;
    const ethPrice = parseFloat(gasData.ethPrice) || 3000;

    const gwei = gasPrice * gasLimit;
    const eth = gwei / 1000000000;
    const usd = eth * ethPrice;

    setGasFee({ gwei, eth, usd });
  }, [gasData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Bitcoin className="text-orange-600" /> Cryptocurrency Tools
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'PROFIT_CALC', label: 'Profit Calculator', icon: TrendingUp },
              { id: 'MINING_CALC', label: 'Mining Calculator', icon: Bitcoin },
              { id: 'DCA_CALC', label: 'DCA Calculator', icon: TrendingUp },
              { id: 'GAS_FEE', label: 'Gas Fee Estimator', icon: Bitcoin },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CryptoTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'PROFIT_CALC' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Calculate your crypto trading profit/loss. Include trading fees for accurate results. ROI = (Profit / Investment) × 100. Remember to account for taxes on gains.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Amount (Coins)</label>
                    <input
                      type="number"
                      value={profitData.amount}
                      onChange={(e) => setProfitData({...profitData, amount: e.target.value})}
                      placeholder="10"
                      step="0.001"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Buy Price ($)</label>
                    <input
                      type="number"
                      value={profitData.buyPrice}
                      onChange={(e) => setProfitData({...profitData, buyPrice: e.target.value})}
                      placeholder="50000"
                      step="0.01"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Sell Price ($)</label>
                    <input
                      type="number"
                      value={profitData.sellPrice}
                      onChange={(e) => setProfitData({...profitData, sellPrice: e.target.value})}
                      placeholder="55000"
                      step="0.01"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Total Fees ($)</label>
                    <input
                      type="number"
                      value={profitData.fees}
                      onChange={(e) => setProfitData({...profitData, fees: e.target.value})}
                      placeholder="100"
                      step="0.01"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className={`p-6 rounded-lg text-center ${profitResult.profit >= 0 ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700'}`}>
                    <div className={`text-3xl font-bold ${profitResult.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${profitResult.profit.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">
                      {profitResult.profit >= 0 ? 'Profit' : 'Loss'}
                    </div>
                  </div>
                  <div className={`p-6 rounded-lg text-center ${profitResult.roi >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700' : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700'}`}>
                    <div className={`text-3xl font-bold ${profitResult.roi >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {profitResult.roi.toFixed(2)}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">ROI</div>
                  </div>
                  <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700 text-center">
                    <div className="text-3xl font-bold text-purple-600">${profitResult.total.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">Total Value</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DCA_CALC' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Dollar-Cost Averaging (DCA) reduces risk by investing fixed amounts regularly. Historical crypto returns vary (50-200% annually). Past performance doesn't guarantee future results.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Investment per Period ($)</label>
                    <input
                      type="number"
                      value={dcaData.investment}
                      onChange={(e) => setDcaData({...dcaData, investment: e.target.value})}
                      placeholder="100"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Frequency</label>
                    <select
                      value={dcaData.frequency}
                      onChange={(e) => setDcaData({...dcaData, frequency: e.target.value})}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">
                      Duration ({dcaData.frequency === 'monthly' ? 'Months' : 'Years'})
                    </label>
                    <input
                      type="number"
                      value={dcaData.duration}
                      onChange={(e) => setDcaData({...dcaData, duration: e.target.value})}
                      placeholder="12"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Expected Annual Return (%)</label>
                    <input
                      type="number"
                      value={dcaData.returnRate}
                      onChange={(e) => setDcaData({...dcaData, returnRate: e.target.value})}
                      placeholder="50"
                      step="0.1"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 text-center">
                    <div className="text-3xl font-bold text-blue-600">${dcaResult.totalInvested.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">Total Invested</div>
                  </div>
                  <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 text-center">
                    <div className="text-3xl font-bold text-green-600">${dcaResult.futureValue.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">Future Value</div>
                  </div>
                  <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700 text-center">
                    <div className="text-3xl font-bold text-purple-600">${dcaResult.profit.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">Profit</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'GAS_FEE' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Estimate Ethereum gas fees. Simple transfers use ~21,000 gas. Smart contract interactions use 50,000-500,000+ gas. Check current gas prices on etherscan.io or ethgasstation.info.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Gas Price (Gwei)</label>
                    <input
                      type="number"
                      value={gasData.gasPrice}
                      onChange={(e) => setGasData({...gasData, gasPrice: e.target.value})}
                      placeholder="50"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Gas Limit</label>
                    <input
                      type="number"
                      value={gasData.gasLimit}
                      onChange={(e) => setGasData({...gasData, gasLimit: e.target.value})}
                      placeholder="21000"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">ETH Price ($)</label>
                    <input
                      type="number"
                      value={gasData.ethPrice}
                      onChange={(e) => setGasData({...gasData, ethPrice: e.target.value})}
                      placeholder="3000"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="p-6 rounded-lg bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-700 text-center">
                    <div className="text-3xl font-bold text-orange-600">{gasFee.gwei.toFixed(0)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">Total Gwei</div>
                  </div>
                  <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 text-center">
                    <div className="text-3xl font-bold text-blue-600">{gasFee.eth.toFixed(6)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">ETH</div>
                  </div>
                  <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 text-center">
                    <div className="text-3xl font-bold text-green-600">${gasFee.usd.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">USD</div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Tip:</strong> Gas fees vary by network congestion. For lower fees, use Layer 2 solutions (Polygon, Arbitrum, Optimism) or transact during off-peak hours (weekends, late night UTC).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoTools;
