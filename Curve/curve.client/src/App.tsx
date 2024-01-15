import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './App.css';

import { ScatterChart, Scatter, XAxis, 
    YAxis, CartesianGrid } from 'recharts';

interface DataPoint {
    x: number;
    y: number;
}
function App() {
    const [points, setPoints] = useState<string>('');
    const [curveType, setCurveType] = useState<string>('linear');
    const [inputError, setInputError] = useState<boolean>(false);
    const [data, setData] = useState<DataPoint[]>([]);

    const convertToChartData = (coordinateString: string): DataPoint[] => {
        return coordinateString.split(';') // Split into pairs
            .map(pair => pair.split(',')) // Split each pair into [x, y]
            .map(([x, y]) => ({ x: parseFloat(x), y: parseFloat(y) })) // Convert to object
            .filter(point => !isNaN(point.x) && !isNaN(point.y)); // Filter out invalid pairs
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // parse points and ensure we have the correct amount
        if (!/^(\d+,\d+;)+$/.test(points.replace(/\s+/g, ''))){
            setInputError(true);
            return;
        }
        setData(convertToChartData(points));
        try {
            const response = await fetch(`https://localhost:5173/curve?points=${encodeURIComponent(points)}&type=${encodeURIComponent(curveType)}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.text();
            console.log(result);
            // Handle the response here. For example, show it in the UI.
            } catch (error) {
            console.error('There was an error sending the request', error);
            // Handle error here
        }
    };

    const handlePointsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPoints(e.target.value);
        setInputError(false);
    };

    const handleCurveTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurveType(e.target.value);
    };

    return (
        <>        
            <form onSubmit={handleSubmit}>
            <label>
                Enter Points (format: x1,y1; x2,y2; ...):
                <input 
                type="text" 
                value={points} 
                onChange={handlePointsChange} 
                required
                style={inputError ? { borderColor: 'red' } : undefined} 
                />
            </label>
            <br />
            <label>
                Select Curve Type:
                <select value={curveType} onChange={handleCurveTypeChange}>
                <option value="linear">Linear</option>
                <option value="quadratic">Quadratic</option>
                <option value="cubic">Cubic</option>
                </select>
            </label>
            <br />
            <button type="submit">Calculate Curve</button>
            </form>

            {data.length && (
            <ScatterChart width={400} height={400}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" />
                <YAxis type="number" dataKey="y" />
                <Scatter data={data} fill="green" />
            </ScatterChart>)}
        </>

    );
}

export default App;