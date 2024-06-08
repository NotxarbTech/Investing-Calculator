import React, {useState} from "react";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './CompoundInterestCalculator.scss';

const CompoundInterestCalculator = () => {
    // Variables for the useState hook
    const [initial, setInitial] = useState(0);
    const [years, setYears] =  useState(0);
    const [apy, setApy] = useState(0);
    const [additional, setAdditional] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [finalDataPoint, setFinalDataPoint] = useState(0);

    // Function to calculate compound interest
    const calculateCompoundInterest = async () => {
        const response = await axios.post('http://localhost:5000/calculate', {
            initial,
            years,
            apy,
            additional
        });
        setChartData(response.data);
        setShowResults(true);

        setFinalDataPoint(response.data[response.data.length - 1]);
    }

    // Function to format currency
    const formatCurrency = (value) => `$${parseFloat(value).toLocaleString()}`;


    // JSX structure
    return (
        <div>
            <div className="calculator-container">
                <h3>Initial Investment:</h3>
                <input type="number" placeholder="Initial investment" onChange={(e) => setInitial(e.target.value)}/>
                <h3>Years To Grow:</h3>
                <input type="number" placeholder="Years to grow" onChange={(e) => setYears(e.target.value)}/>
                <h3>Annual Percentage Yield:</h3>
                <input type="number" placeholder="APY (%)" onChange={(e) => setApy(e.target.value)}/>
                <h3>Additional Investment (Yearly):</h3>
                <input type="number" placeholder="Additional Investment" onChange={(e) => setAdditional(e.target.value)}/>
                <button onClick={calculateCompoundInterest}>Calculate</button>
            </div>
            
            {showResults && (
                <div className="results-container">
                    <ResponsiveContainer width="50%" aspect={2}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="current_year" />
                            <YAxis domain={[parseFloat(initial), parseFloat(Math.round(finalDataPoint.amount))]} tickFormatter={formatCurrency}/>
                            <Tooltip formatter={(value) => formatCurrency(value)}/>
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#8884d8"/>
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="numbers-container">
                        <h2>Results:</h2>
                        <h3>Initial Investment: {formatCurrency(initial)}</h3>
                        <h3>Total Investment: {formatCurrency(parseFloat(initial) + parseFloat(additional) * parseFloat(years))}</h3>
                        <h3>Final Amount: {formatCurrency(finalDataPoint.amount)}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompoundInterestCalculator;
