import React, { useState, useMemo, useEffect } from 'react';

function App() {
  const [salary, setSalary] = useState(0);
  const [socialSecurityBase, setSocialSecurityBase] = useState(0);
  const [extraAllowances, setExtraAllowances] = useState(Array(12).fill(0));
  const [rates, setRates] = useState({
    养老保险: 8,
    医疗保险: 2,
    失业保险: 0.5,
    住房公积金: 7
  });
  const [housingDeduction, setHousingDeduction] = useState('none');
  const [childrenCount, setChildrenCount] = useState(0);
  const [elderlySupport, setElderlySupport] = useState('none');

  useEffect(() => {
    setSocialSecurityBase(salary);
  }, [salary]);

  const calculateTax = (accumulatedTaxableIncome) => {
    const taxRates = [
      { threshold: 0, rate: 0, deduction: 0 },
      { threshold: 36000, rate: 0.03, deduction: 0 },
      { threshold: 144000, rate: 0.1, deduction: 2520 },
      { threshold: 300000, rate: 0.2, deduction: 16920 },
      { threshold: 420000, rate: 0.25, deduction: 31920 },
      { threshold: 660000, rate: 0.3, deduction: 52920 },
      { threshold: 960000, rate: 0.35, deduction: 85920 },
      { threshold: Infinity, rate: 0.45, deduction: 181920 }
    ];

    const applicableRate = taxRates.find(rate => accumulatedTaxableIncome <= rate.threshold) || taxRates[taxRates.length - 1];
    return accumulatedTaxableIncome * applicableRate.rate - applicableRate.deduction;
  };

  const yearlyDetails = useMemo(() => {
    const totalInsurance = (rates.养老保险 + rates.医疗保险 + rates.失业保险) / 100;
    const housingFund = rates.住房公积金 / 100;
    const monthlyInsuranceDeduction = socialSecurityBase * totalInsurance;
    const monthlyHousingFundDeduction = socialSecurityBase * housingFund;
    
    const monthlySpecialDeduction = 
      (housingDeduction === 'mortgage' ? 1000 : housingDeduction === 'rent' ? 1500 : 0) +
      (childrenCount * 2000) +
      (elderlySupport === 'only' ? 3000 : elderlySupport === 'shared' ? 1500 : 0);

    let accumulatedTaxableIncome = 0;
    let accumulatedTax = 0;

    const details = Array.from({ length: 12 }, (_, month) => {
      const monthlyTaxableIncome = salary + extraAllowances[month] - monthlyInsuranceDeduction - monthlyHousingFundDeduction - 5000 - monthlySpecialDeduction;
      accumulatedTaxableIncome += monthlyTaxableIncome;
      const totalTax = calculateTax(accumulatedTaxableIncome);
      const monthlyTax = totalTax - accumulatedTax;
      accumulatedTax = totalTax;

      const netSalary = salary + extraAllowances[month] - monthlyInsuranceDeduction - monthlyHousingFundDeduction - monthlyTax;

      return {
        month: month + 1,
        grossSalary: salary,
        extraAllowance: extraAllowances[month],
        insuranceDeduction: monthlyInsuranceDeduction,
        housingFundDeduction: monthlyHousingFundDeduction,
        specialDeduction: monthlySpecialDeduction,
        taxableIncome: monthlyTaxableIncome,
        tax: monthlyTax,
        netSalary: netSalary
      };
    });

    // 计算年度汇总
    const yearlyTotal = details.reduce((total, month) => ({
      grossSalary: total.grossSalary + month.grossSalary,
      extraAllowance: total.extraAllowance + month.extraAllowance,
      insuranceDeduction: total.insuranceDeduction + month.insuranceDeduction,
      housingFundDeduction: total.housingFundDeduction + month.housingFundDeduction,
      specialDeduction: total.specialDeduction + month.specialDeduction,
      taxableIncome: total.taxableIncome + month.taxableIncome,
      tax: total.tax + month.tax,
      netSalary: total.netSalary + month.netSalary
    }), {
      grossSalary: 0,
      extraAllowance: 0,
      insuranceDeduction: 0,
      housingFundDeduction: 0,
      specialDeduction: 0,
      taxableIncome: 0,
      tax: 0,
      netSalary: 0
    });

    return { details, yearlyTotal };
  }, [salary, socialSecurityBase, rates, housingDeduction, childrenCount, elderlySupport, extraAllowances]);

  const handleExtraAllowanceChange = (month, value) => {
    const newExtraAllowances = [...extraAllowances];
    newExtraAllowances[month] = Number(value);
    setExtraAllowances(newExtraAllowances);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-7xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-5 text-center">上海工资计算器</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                月工资:
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                />
              </label>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                社保基数:
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  value={socialSecurityBase}
                  onChange={(e) => setSocialSecurityBase(Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">五险一金比例:</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(rates).map(([key, value]) => (
                <label key={key} className="block">
                  <span className="text-gray-700 text-sm font-bold">{key}:</span>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setRates({ ...rates, [key]: Number(e.target.value) })
                    }
                  />
                  <span className="text-gray-700 text-sm">%</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">专项附加扣除:</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700 text-sm font-bold">住房:</span>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={housingDeduction}
                  onChange={(e) => setHousingDeduction(e.target.value)}
                >
                  <option value="none">无</option>
                  <option value="mortgage">房贷(1000元/月)</option>
                  <option value="rent">租房(1500元/月)</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 text-sm font-bold">子女教育(每个2000元/月):</span>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  type="number"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="text-gray-700 text-sm font-bold">赡养老人:</span>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={elderlySupport}
                  onChange={(e) => setElderlySupport(e.target.value)}
                >
                  <option value="none">无</option>
                  <option value="only">独生子女(3000元/月)</option>
                  <option value="shared">非独生子女(1500元/月)</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="mt-6 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-3">年度工资明细:</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">月份</th>
                  <th className="py-2 px-4 border-b">税前工资</th>
                  <th className="py-2 px-4 border-b">额外补贴</th>
                  <th className="py-2 px-4 border-b">五险</th>
                  <th className="py-2 px-4 border-b">公积金</th>
                  <th className="py-2 px-4 border-b">专项附加扣除</th>
                  <th className="py-2 px-4 border-b">应纳税所得额</th>
                  <th className="py-2 px-4 border-b">个人所得税</th>
                  <th className="py-2 px-4 border-b">实发工资</th>
                </tr>
              </thead>
              <tbody>
                {yearlyDetails.details.map((detail) => (
                  <tr key={detail.month}>
                    <td className="py-2 px-4 border-b">{detail.month}</td>
                    <td className="py-2 px-4 border-b">{detail.grossSalary.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="number"
                        value={detail.extraAllowance}
                        onChange={(e) => handleExtraAllowanceChange(detail.month - 1, e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{detail.insuranceDeduction.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{detail.housingFundDeduction.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{detail.specialDeduction.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{detail.taxableIncome.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{detail.tax.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{detail.netSalary.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100">
                  <td className="py-2 px-4 border-b">年度总计</td>
                  <td className="py-2 px-4 border-b">{yearlyDetails.yearlyTotal.grossSalary.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{yearlyDetails.yearlyTotal.extraAllowance.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{yearlyDetails.yearlyTotal.insuranceDeduction.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{yearlyDetails.yearlyTotal.housingFundDeduction.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{yearlyDetails.yearlyTotal.specialDeduction.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{yearlyDetails.yearlyTotal.taxableIncome.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{yearlyDetails.yearlyTotal.tax.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{yearlyDetails.yearlyTotal.netSalary.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;