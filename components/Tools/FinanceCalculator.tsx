import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react';
import { analyzeLoanEligibility } from '../../services/geminiService';

interface FinanceCalculatorProps {
  initialTab?: 'EMI' | 'SIP' | 'TAX' | 'ELIGIBILITY' | 'INFLATION' | 'FD' | 'RD';
}

const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({ initialTab = 'EMI' }) => {
  const [activeTab, setActiveTab] = useState<'EMI' | 'SIP' | 'TAX' | 'ELIGIBILITY' | 'INFLATION' | 'FD' | 'RD'>(initialTab);
  
  // EMI State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(5); // Years
  const [emiResult, setEmiResult] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });

  // SIP State
  const [sipInvestment, setSipInvestment] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [sipResult, setSipResult] = useState({ invested: 0, returns: 0, total: 0 });

  // Tax State
  const [annualIncome, setAnnualIncome] = useState(800000);
  const [taxResult, setTaxResult] = useState({ tax: 0, cess: 0, total: 0 });

  // Eligibility AI State
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [monthlyObligations, setMonthlyObligations] = useState(10000);
  const [eligibilityResult, setEligibilityResult] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Inflation Adjuster State
  const [inflationRate, setInflationRate] = useState(6);
  const [yearsInflation, setYearsInflation] = useState(5);
  const [currentValue, setCurrentValue] = useState(100000);
  const [inflationResult, setInflationResult] = useState({ futureCost: 0, realValue: 0 });

  // Fixed Deposit (FD)
  const [fdPrincipal, setFdPrincipal] = useState(200000);
  const [fdRate, setFdRate] = useState(7);
  const [fdYears, setFdYears] = useState(3);
  const [fdResult, setFdResult] = useState({ maturityAmount: 0, interestEarned: 0 });

  // Recurring Deposit (RD)
  const [rdMonthly, setRdMonthly] = useState(5000);
  const [rdRate, setRdRate] = useState(6.5);
  const [rdYears, setRdYears] = useState(3);
  const [rdResult, setRdResult] = useState({ invested: 0, interest: 0, total: 0 });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    calculateEMI();
    calculateSIP();
    calculateTax();
    calculateInflation();
    calculateFD();
    calculateRD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanAmount, interestRate, tenure, sipInvestment, sipRate, sipYears, annualIncome, inflationRate, yearsInflation, currentValue, fdPrincipal, fdRate, fdYears, rdMonthly, rdRate, rdYears]);

  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    setEmiResult({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    });
  };

  const calculateInflation = () => {
    const r = inflationRate / 100;
    const n = yearsInflation;
    const futureCost = currentValue * Math.pow(1 + r, n);
    const realValue = currentValue / Math.pow(1 + r, n);
    setInflationResult({ futureCost: Math.round(futureCost), realValue: Math.round(realValue) });
  };

  const calculateFD = () => {
    const p = fdPrincipal;
    const r = fdRate / 100;
    const n = fdYears;
    const maturity = p * Math.pow(1 + r, n);
    setFdResult({ maturityAmount: Math.round(maturity), interestEarned: Math.round(maturity - p) });
  };

  const calculateRD = () => {
    const p = rdMonthly;
    const i = rdRate / 100 / 12;
    const n = rdYears * 12;
    const total = p * ((Math.pow(1 + i, n) - 1) / i);
    const invested = p * n;
    const interest = total - invested;
    setRdResult({ invested: Math.round(invested), interest: Math.round(interest), total: Math.round(total) });
  };

  const calculateSIP = () => {
    const p = sipInvestment;
    const i = sipRate / 100 / 12;
    const n = sipYears * 12;

    const totalValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = p * n;
    const returns = totalValue - invested;

    setSipResult({
        invested: Math.round(invested),
        returns: Math.round(returns),
        total: Math.round(totalValue)
    });
  };

  const calculateTax = () => {
    // Simplified Old Regime Slabs for Demo
    let income = annualIncome;
    let tax = 0;

    if (income > 250000) {
        if (income > 500000) {
            tax += (500000 - 250000) * 0.05;
            if (income > 1000000) {
                tax += (1000000 - 500000) * 0.20;
                tax += (income - 1000000) * 0.30;
            } else {
                tax += (income - 500000) * 0.20;
            }
        } else {
            tax += (income - 250000) * 0.05;
        }
    }

    // Section 87A Rebate
    if (annualIncome <= 500000) {
        tax = 0;
    }

    const cess = tax * 0.04;
    setTaxResult({
        tax: Math.round(tax),
        cess: Math.round(cess),
        total: Math.round(tax + cess)
    });
  };

  const handleAiCheck = async () => {
      setLoadingAi(true);
      const res = await analyzeLoanEligibility(monthlyIncome, monthlyObligations, loanAmount);
      setEligibilityResult(res);
      setLoadingAi(false);
  }

  const emiData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: emiResult.totalInterest },
  ];

  const sipData = [
      { name: 'Invested', value: sipResult.invested },
      { name: 'Returns', value: sipResult.returns }
  ];

  const COLORS = ['#4f46e5', '#10b981'];

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
      <div className="flex space-x-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
        {(['EMI', 'SIP', 'TAX', 'ELIGIBILITY', 'INFLATION', 'FD', 'RD'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap rounded-t-lg ${
              activeTab === tab 
              ? 'text-primary bg-slate-50 dark:bg-slate-700/50 border-b-2 border-primary' 
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab === 'EMI' ? 'EMI Calculator' : tab === 'SIP' ? 'SIP Calculator' : tab === 'TAX' ? 'Tax Calc' : tab === 'ELIGIBILITY' ? 'AI Check' : tab === 'INFLATION' ? 'Inflation Adjuster' : tab === 'FD' ? 'Fixed Deposit' : 'Recurring Deposit'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {activeTab === 'EMI' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Loan Amount
                </label>
                <input 
                  type="range" min="10000" max="10000000" step="10000" 
                  value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-400">10k</span>
                  <span className="font-bold text-primary">{loanAmount.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">1Cr</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Percent size={16} /> Interest Rate (%)
                </label>
                <input 
                  type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Tenure (Years)
                </label>
                <input 
                  type="range" min="1" max="30" step="1" 
                  value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                />
                <div className="text-right font-bold text-primary mt-1">{tenure} Years</div>
              </div>
            </>
          )}

          {activeTab === 'SIP' && (
             <>
             <div>
               <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                 <DollarSign size={16} /> Monthly Investment
               </label>
               <input 
                 type="range" min="500" max="100000" step="500" 
                 value={sipInvestment} onChange={(e) => setSipInvestment(Number(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-secondary"
               />
               <div className="flex justify-between mt-2">
                 <span className="text-xs text-slate-400">500</span>
                 <span className="font-bold text-secondary">{sipInvestment.toLocaleString()}</span>
                 <span className="text-xs text-slate-400">1L</span>
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                 <TrendingUp size={16} /> Expected Return Rate (%)
               </label>
               <input 
                 type="number" value={sipRate} onChange={(e) => setSipRate(Number(e.target.value))}
                 className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 focus:ring-2 focus:ring-secondary outline-none"
               />
             </div>

             <div>
               <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                 <Calendar size={16} /> Time Period (Years)
               </label>
               <input 
                 type="range" min="1" max="50" step="1" 
                 value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-secondary"
               />
               <div className="text-right font-bold text-secondary mt-1">{sipYears} Years</div>
             </div>
           </>
          )}

          {activeTab === 'TAX' && (
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-300">
                    <p>Note: Calculated based on General Slab Rates (Old Regime). Does not include deductions.</p>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-2">Annual Income</label>
                    <input 
                        type="number" value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))}
                        className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:border-slate-600 outline-none focus:ring-2 focus:ring-orange-500"
                    />
                 </div>
              </div>
          )}

          {activeTab === 'ELIGIBILITY' && (
             <div className="space-y-4">
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                     This tool uses AI to analyze your debt-to-income ratio and provides personalized advice.
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-2">Monthly Income</label>
                    <input 
                        type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-2">Current Monthly EMIs</label>
                    <input 
                        type="number" value={monthlyObligations} onChange={(e) => setMonthlyObligations(Number(e.target.value))}
                        className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-2">Desired Loan Amount</label>
                    <input 
                        type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 outline-none"
                    />
                 </div>
                 <button 
                    onClick={handleAiCheck}
                    disabled={loadingAi}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                 >
                     {loadingAi ? 'Analyzing...' : 'Check Eligibility with AI'}
                 </button>
             </div>
          )}

          {activeTab === 'INFLATION' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Current Value</label>
                <input 
                  type="number" value={currentValue} onChange={(e)=>setCurrentValue(Number(e.target.value))}
                  className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Inflation Rate (%)</label>
                <input 
                  type="number" value={inflationRate} onChange={(e)=>setInflationRate(Number(e.target.value))}
                  className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years</label>
                <input 
                  type="range" min="1" max="30" value={yearsInflation} onChange={(e)=>setYearsInflation(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                />
                <div className="text-right font-bold text-primary mt-1">{yearsInflation} Years</div>
              </div>
            </div>
          )}

          {activeTab === 'FD' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Principal</label>
                <input 
                  type="number" value={fdPrincipal} onChange={(e)=>setFdPrincipal(Number(e.target.value))}
                  className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rate (% p.a.)</label>
                <input 
                  type="number" value={fdRate} onChange={(e)=>setFdRate(Number(e.target.value))}
                  className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years</label>
                <input 
                  type="range" min="1" max="20" value={fdYears} onChange={(e)=>setFdYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                />
                <div className="text-right font-bold text-primary mt-1">{fdYears} Years</div>
              </div>
            </div>
          )}

          {activeTab === 'RD' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Deposit</label>
                <input 
                  type="number" value={rdMonthly} onChange={(e)=>setRdMonthly(Number(e.target.value))}
                  className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rate (% p.a.)</label>
                <input 
                  type="number" value={rdRate} onChange={(e)=>setRdRate(Number(e.target.value))}
                  className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years</label>
                <input 
                  type="range" min="1" max="15" value={rdYears} onChange={(e)=>setRdYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                />
                <div className="text-right font-bold text-primary mt-1">{rdYears} Years</div>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 flex flex-col justify-center min-h-[400px]">
            {activeTab === 'EMI' && (
                <>
                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <p className="text-xs text-slate-500 uppercase">Monthly EMI</p>
                        <p className="text-xl font-bold text-primary">${emiResult.emi.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <p className="text-xs text-slate-500 uppercase">Total Interest</p>
                        <p className="text-xl font-bold text-secondary">${emiResult.totalInterest.toLocaleString()}</p>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={emiData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {emiData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}/>
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                </>
            )}

            {activeTab === 'SIP' && (
                <>
                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <p className="text-xs text-slate-500 uppercase">Invested Amount</p>
                        <p className="text-lg font-bold text-primary">${sipResult.invested.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <p className="text-xs text-slate-500 uppercase">Est. Returns</p>
                        <p className="text-lg font-bold text-secondary">${sipResult.returns.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md">
                        <p className="text-xs opacity-80 uppercase">Total Value</p>
                        <p className="text-2xl font-bold">${sipResult.total.toLocaleString()}</p>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={sipData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        >
                            <Cell fill="#4f46e5" />
                            <Cell fill="#10b981" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}/>
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                </>
            )}

            {activeTab === 'TAX' && (
                <div className="flex flex-col h-full justify-center">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                            ${taxResult.total.toLocaleString()}
                        </h3>
                        <p className="text-slate-500 uppercase tracking-widest text-sm">Total Tax Liability</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-600 dark:text-slate-300">Base Tax</span>
                            <span className="font-bold font-mono">${taxResult.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-600 dark:text-slate-300">Cess (4%)</span>
                            <span className="font-bold font-mono">${taxResult.cess.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ELIGIBILITY' && (
                <div className="h-full flex items-center justify-center">
                    {eligibilityResult ? (
                        <div className="prose dark:prose-invert">
                            <h3 className="text-lg font-bold mb-2 text-primary">AI Analysis</h3>
                            <p className="whitespace-pre-line">{eligibilityResult}</p>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-center">Fill details and click check to get an AI assessment.</p>
                    )}
                </div>
            )}

            {activeTab === 'INFLATION' && (
              <div className="flex flex-col h-full justify-center">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Future Cost</h3>
                  <p className="text-2xl font-bold text-primary">${inflationResult.futureCost.toLocaleString()}</p>
                  <p className="text-slate-500 uppercase tracking-widest text-sm mt-2">Real value after {yearsInflation}y @ {inflationRate}%</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <p className="text-xs text-slate-500 uppercase">Current Value</p>
                    <p className="text-xl font-bold">${currentValue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <p className="text-xs text-slate-500 uppercase">Real Value</p>
                    <p className="text-xl font-bold">${inflationResult.realValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'FD' && (
              <div className="flex flex-col h-full justify-center">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Maturity Amount</h3>
                  <p className="text-2xl font-bold text-primary">${fdResult.maturityAmount.toLocaleString()}</p>
                  <p className="text-slate-500 uppercase tracking-widest text-sm mt-2">Interest Earned: ${fdResult.interestEarned.toLocaleString()}</p>
                </div>
              </div>
            )}

            {activeTab === 'RD' && (
              <div className="flex flex-col h-full justify-center">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Total Value</h3>
                  <p className="text-2xl font-bold text-primary">${rdResult.total.toLocaleString()}</p>
                  <p className="text-slate-500 uppercase tracking-widest text-sm mt-2">Invested: ${rdResult.invested.toLocaleString()} | Interest: ${rdResult.interest.toLocaleString()}</p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator;