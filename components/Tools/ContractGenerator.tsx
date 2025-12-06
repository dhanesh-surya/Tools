import React, { useState } from 'react';
import { Download, FileSignature, Users, Calendar, FileText, CheckCircle2 } from 'lucide-react';

type ContractType = 'nda' | 'service' | 'employment' | 'freelance' | 'rental';

interface PartyInfo {
  name: string;
  address: string;
  email: string;
}

interface ContractData {
  type: ContractType;
  party1: PartyInfo;
  party2: PartyInfo;
  startDate: string;
  endDate: string;
  effectiveDate: string;
  compensation: string;
  paymentTerms: string;
  customTerms: string[];
}

const ContractGenerator: React.FC = () => {
  const [contract, setContract] = useState<ContractData>({
    type: 'service',
    party1: { name: '', address: '', email: '' },
    party2: { name: '', address: '', email: '' },
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    compensation: '',
    paymentTerms: 'Net 30 days',
    customTerms: [],
  });

  const [newTerm, setNewTerm] = useState('');

  const contractTemplates = {
    nda: {
      name: 'Non-Disclosure Agreement (NDA)',
      description: 'Protect confidential information',
      party1Label: 'Disclosing Party',
      party2Label: 'Receiving Party',
    },
    service: {
      name: 'Service Agreement',
      description: 'Professional services contract',
      party1Label: 'Service Provider',
      party2Label: 'Client',
    },
    employment: {
      name: 'Employment Contract',
      description: 'Full-time employment agreement',
      party1Label: 'Employer',
      party2Label: 'Employee',
    },
    freelance: {
      name: 'Freelance Contract',
      description: 'Independent contractor agreement',
      party1Label: 'Client',
      party2Label: 'Freelancer',
    },
    rental: {
      name: 'Rental Agreement',
      description: 'Property lease contract',
      party1Label: 'Landlord',
      party2Label: 'Tenant',
    },
  };

  const currentTemplate = contractTemplates[contract.type];

  const addCustomTerm = () => {
    if (newTerm.trim()) {
      setContract({ ...contract, customTerms: [...contract.customTerms, newTerm.trim()] });
      setNewTerm('');
    }
  };

  const removeTerm = (index: number) => {
    setContract({ ...contract, customTerms: contract.customTerms.filter((_, i) => i !== index) });
  };

  const downloadContract = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = generateContractHTML();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const generateContractHTML = () => {
    const template = currentTemplate;

    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${template.name} - ${contract.party1.name} & ${contract.party2.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Times New Roman',Georgia,serif;line-height:1.8;color:#000;padding:60px;background:#fff;font-size:12pt}
.contract{max-width:800px;margin:0 auto}
.title{text-align:center;font-size:20pt;font-weight:bold;text-transform:uppercase;margin-bottom:30px;letter-spacing:1px}
.section{margin-bottom:25px}
.section-title{font-size:13pt;font-weight:bold;margin-bottom:10px;text-transform:uppercase}
.parties{margin-bottom:30px;border:2px solid #000;padding:20px;background:#f9f9f9}
.party{margin-bottom:15px}
.party-label{font-weight:bold;text-transform:uppercase;margin-bottom:5px}
.clause{margin-bottom:20px}
.clause-number{font-weight:bold;margin-bottom:5px}
.signature-section{margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
.signature-block{border-top:2px solid #000;padding-top:10px}
.sig-label{font-weight:bold;margin-bottom:30px}
.sig-line{border-bottom:1px solid #000;margin:10px 0;padding-bottom:5px}
@media print{body{padding:40px}@page{margin:1in;size:letter}}
</style>
<script>window.onload=function(){setTimeout(function(){window.print()},500)}</script>
</head><body>
<div class="contract">
  <div class="title">${template.name}</div>
  
  <div class="section">
    <p>This ${template.name} (the "Agreement") is entered into as of <strong>${new Date(contract.effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> (the "Effective Date").</p>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-label">${template.party1Label}:</div>
      <div><strong>${contract.party1.name}</strong></div>
      <div>${contract.party1.address}</div>
      <div>${contract.party1.email}</div>
    </div>
    
    <div class="party">
      <div class="party-label">${template.party2Label}:</div>
      <div><strong>${contract.party2.name}</strong></div>
      <div>${contract.party2.address}</div>
      <div>${contract.party2.email}</div>
    </div>
  </div>

  ${generateContractBody()}

  ${contract.customTerms.length > 0 ? `
    <div class="section">
      <div class="section-title">Additional Terms</div>
      ${contract.customTerms.map((term, i) => `
        <div class="clause">
          <div class="clause-number">${i + 1}.</div>
          <div>${term}</div>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <div class="section" style="margin-top:40px">
    <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the date first written above.</p>
  </div>

  <div class="signature-section">
    <div class="signature-block">
      <div class="sig-label">${template.party1Label}</div>
      <div class="sig-line"></div>
      <div>Signature</div>
      <div class="sig-line">${contract.party1.name}</div>
      <div>Printed Name</div>
      <div class="sig-line"></div>
      <div>Date</div>
    </div>

    <div class="signature-block">
      <div class="sig-label">${template.party2Label}</div>
      <div class="sig-line"></div>
      <div>Signature</div>
      <div class="sig-line">${contract.party2.name}</div>
      <div>Printed Name</div>
      <div class="sig-line"></div>
      <div>Date</div>
    </div>
  </div>
</div>
</body></html>`;
  };

  const generateContractBody = () => {
    switch (contract.type) {
      case 'nda':
        return `
          <div class="section">
            <div class="section-title">1. Definition of Confidential Information</div>
            <p>For purposes of this Agreement, "Confidential Information" means any data or information that is proprietary to the Disclosing Party and not generally known to the public, including but not limited to trade secrets, business plans, customer lists, and technical data.</p>
          </div>

          <div class="section">
            <div class="section-title">2. Obligations of Receiving Party</div>
            <p>The Receiving Party agrees to: (a) hold and maintain the Confidential Information in strict confidence; (b) not disclose the Confidential Information to third parties without prior written consent; and (c) use the Confidential Information solely for the purpose of the business relationship between the parties.</p>
          </div>

          <div class="section">
            <div class="section-title">3. Term</div>
            <p>This Agreement shall remain in effect from ${new Date(contract.startDate).toLocaleDateString()} ${contract.endDate ? `until ${new Date(contract.endDate).toLocaleDateString()}` : 'and continue indefinitely'}, unless terminated earlier by mutual written agreement.</p>
          </div>

          <div class="section">
            <div class="section-title">4. Return of Materials</div>
            <p>Upon termination of this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof.</p>
          </div>`;

      case 'service':
        return `
          <div class="section">
            <div class="section-title">1. Services</div>
            <p>The Service Provider agrees to provide professional services as mutually agreed upon between the parties. The specific scope of work, deliverables, and timelines shall be detailed in separate statements of work.</p>
          </div>

          <div class="section">
            <div class="section-title">2. Term</div>
            <p>This Agreement shall commence on ${new Date(contract.startDate).toLocaleDateString()} and shall continue ${contract.endDate ? `until ${new Date(contract.endDate).toLocaleDateString()}` : 'until terminated by either party with 30 days written notice'}.</p>
          </div>

          <div class="section">
            <div class="section-title">3. Compensation</div>
            <p>In consideration for the services provided, the Client agrees to pay the Service Provider ${contract.compensation || 'the agreed-upon fees'}. Payment terms: ${contract.paymentTerms}.</p>
          </div>

          <div class="section">
            <div class="section-title">4. Independent Contractor</div>
            <p>The Service Provider is an independent contractor and not an employee of the Client. The Service Provider shall be responsible for all taxes, insurance, and other obligations.</p>
          </div>`;

      case 'employment':
        return `
          <div class="section">
            <div class="section-title">1. Position and Duties</div>
            <p>The Employer hereby employs the Employee in the capacity as mutually agreed. The Employee shall perform all duties and responsibilities associated with this position and any other duties as reasonably assigned.</p>
          </div>

          <div class="section">
            <div class="section-title">2. Term of Employment</div>
            <p>Employment shall commence on ${new Date(contract.startDate).toLocaleDateString()} and shall continue ${contract.endDate ? `until ${new Date(contract.endDate).toLocaleDateString()}` : 'until terminated by either party in accordance with this Agreement'}.</p>
          </div>

          <div class="section">
            <div class="section-title">3. Compensation and Benefits</div>
            <p>The Employee shall receive compensation of ${contract.compensation || '[Amount] per [period]'}. Payment shall be made ${contract.paymentTerms}. The Employee shall be entitled to benefits as outlined in the Employer's employee handbook.</p>
          </div>

          <div class="section">
            <div class="section-title">4. Termination</div>
            <p>Either party may terminate this employment with appropriate notice as required by applicable law and company policy.</p>
          </div>`;

      case 'freelance':
        return `
          <div class="section">
            <div class="section-title">1. Scope of Work</div>
            <p>The Freelancer agrees to provide services as an independent contractor. The specific deliverables, milestones, and acceptance criteria shall be mutually agreed upon in writing.</p>
          </div>

          <div class="section">
            <div class="section-title">2. Project Term</div>
            <p>The project shall commence on ${new Date(contract.startDate).toLocaleDateString()} ${contract.endDate ? `and is expected to be completed by ${new Date(contract.endDate).toLocaleDateString()}` : 'with deliverables as scheduled'}.</p>
          </div>

          <div class="section">
            <div class="section-title">3. Payment Terms</div>
            <p>The Client agrees to pay the Freelancer ${contract.compensation || 'the agreed project fee'}. Payment schedule: ${contract.paymentTerms}.</p>
          </div>

          <div class="section">
            <div class="section-title">4. Intellectual Property</div>
            <p>Upon full payment, all work product and intellectual property rights shall transfer to the Client. The Freelancer may retain portfolio rights for promotional purposes.</p>
          </div>`;

      case 'rental':
        return `
          <div class="section">
            <div class="section-title">1. Property</div>
            <p>The Landlord agrees to rent to the Tenant the property located at the address specified above (the "Premises").</p>
          </div>

          <div class="section">
            <div class="section-title">2. Lease Term</div>
            <p>The lease term shall commence on ${new Date(contract.startDate).toLocaleDateString()} and shall end on ${contract.endDate ? new Date(contract.endDate).toLocaleDateString() : '[End Date]'}, unless renewed or terminated earlier in accordance with this Agreement.</p>
          </div>

          <div class="section">
            <div class="section-title">3. Rent and Payment</div>
            <p>The monthly rent shall be ${contract.compensation || '[Amount]'}, due and payable ${contract.paymentTerms}. Late payments may incur additional fees as permitted by law.</p>
          </div>

          <div class="section">
            <div class="section-title">4. Security Deposit</div>
            <p>The Tenant shall pay a security deposit equal to one month's rent, to be held by the Landlord and returned upon satisfactory termination of the lease, less any lawful deductions.</p>
          </div>`;

      default:
        return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <FileSignature className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Contract Generator</h1>
        <p className="text-slate-600 dark:text-slate-400">Generate professional legal contracts instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Type Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText size={20} />Contract Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(contractTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setContract({ ...contract, type: key as ContractType })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${contract.type === key
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-white">{template.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Party Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users size={20} />Parties Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Party 1 */}
              <div className="space-y-3">
                <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">{currentTemplate.party1Label}</h4>
                <input type="text" placeholder="Full Name/Company" value={contract.party1.name}
                  onChange={(e) => setContract({ ...contract, party1: { ...contract.party1, name: e.target.value } })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                <input type="text" placeholder="Address" value={contract.party1.address}
                  onChange={(e) => setContract({ ...contract, party1: { ...contract.party1, address: e.target.value } })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                <input type="email" placeholder="Email" value={contract.party1.email}
                  onChange={(e) => setContract({ ...contract, party1: { ...contract.party1, email: e.target.value } })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>

              {/* Party 2 */}
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-600 dark:text-purple-400">{currentTemplate.party2Label}</h4>
                <input type="text" placeholder="Full Name/Company" value={contract.party2.name}
                  onChange={(e) => setContract({ ...contract, party2: { ...contract.party2, name: e.target.value } })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
                <input type="text" placeholder="Address" value={contract.party2.address}
                  onChange={(e) => setContract({ ...contract, party2: { ...contract.party2, address: e.target.value } })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
                <input type="email" placeholder="Email" value={contract.party2.email}
                  onChange={(e) => setContract({ ...contract, party2: { ...contract.party2, email: e.target.value } })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={20} />Contract Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Effective Date</label>
                <input type="date" value={contract.effectiveDate}
                  onChange={(e) => setContract({ ...contract, effectiveDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                <input type="date" value={contract.startDate}
                  onChange={(e) => setContract({ ...contract, startDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">End Date (Optional)</label>
                <input type="date" value={contract.endDate}
                  onChange={(e) => setContract({ ...contract, endDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Compensation</label>
                <input type="text" placeholder="e.g., $5,000/month" value={contract.compensation}
                  onChange={(e) => setContract({ ...contract, compensation: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Payment Terms</label>
                <input type="text" placeholder="e.g., Net 30 days" value={contract.paymentTerms}
                  onChange={(e) => setContract({ ...contract, paymentTerms: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          {/* Custom Terms */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Custom Terms (Optional)</h3>
            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="Add a custom term or clause" value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomTerm()}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              <button onClick={addCustomTerm}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                Add
              </button>
            </div>
            {contract.customTerms.length > 0 && (
              <div className="space-y-2">
                {contract.customTerms.map((term, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">{term}</p>
                    <button onClick={() => removeTerm(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contract Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Contract Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Type:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentTemplate.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Effective:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {contract.effectiveDate ? new Date(contract.effectiveDate).toLocaleDateString() : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Custom Terms:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{contract.customTerms.length}</span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button onClick={downloadContract}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
            <Download size={20} />Generate Contract
          </button>

          {/* Legal Disclaimer */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
            <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
              ⚖️ Legal Disclaimer
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              This contract generator provides templates for informational purposes only. These documents do not constitute legal advice. Consult with a qualified attorney before using any contract for legal purposes.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">💡 Tips</h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1.5">
              <li>• Fill all required fields carefully</li>
              <li>• Review all terms before signing</li>
              <li>• Keep copies for your records</li>
              <li>• Have contracts reviewed by legal counsel</li>
              <li>• Ensure all parties receive signed copies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;