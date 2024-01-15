import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './App.css';

interface CurveFitRequest {
    points: string;
    type: string;
  }
  

function App() {
    const [points, setPoints] = useState<string>('');
    const [curveType, setCurveType] = useState<string>('linear');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data: CurveFitRequest = {
        points,
        type: curveType
        };

        try {
        const response = await fetch('https://localhost:5173/Curve', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
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
    };

    const handleCurveTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurveType(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
        <label>
            Enter Points (format: x1,y1; x2,y2; ...):
            <input 
            type="text" 
            value={points} 
            onChange={handlePointsChange} 
            required 
            />
        </label>
        <label>
            Select Curve Type:
            <select value={curveType} onChange={handleCurveTypeChange}>
            <option value="linear">Linear</option>
            <option value="quadratic">Quadratic</option>
            <option value="cubic">Cubic</option>
            </select>
        </label>
        <button type="submit">Calculate Curve</button>
        </form>
    );
}

export default App;