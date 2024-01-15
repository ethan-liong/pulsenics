import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';
import './App.css';


interface DataPoint {
    x: number;
    y: number;
}
function App() {
    const [points, setPoints] = useState<string>('');
    const [curveType, setCurveType] = useState<string>('linear');
    const [inputError, setInputError] = useState<boolean>(false);
    const [data, setData] = useState<DataPoint[]>([]);
    const [dataLine, setDataLine] = useState<DataPoint[]>([]);
    const [equation, setEquation] = useState<string>('');

    const convertToChartData = (coordinateString: string): DataPoint[] => {
        return coordinateString.split(';') // Split into pairs
            .map(pair => pair.split(',')) // Split each pair into [x, y]
            .map(([x, y]) => ({ x: parseFloat(x), y: parseFloat(y) })) // Convert to object
            .filter(point => !isNaN(point.x) && !isNaN(point.y)); // Filter out invalid pairs
    }

    const createEquationString = (coefficients: number[]): string => {
        let equationBuilder = "";
        for (let i = coefficients.length - 1; i >= 0; i--){
            if (coefficients[i] == 0) continue;
            equationBuilder += coefficients[i];
            // add the power if appropriate and add the correct sign
            if (i >= 1) {
                equationBuilder += i > 1 ? "x^" + i : "x";
                equationBuilder += coefficients[i - 1] > 0 ? "+" : "";
            }
        }
        return equationBuilder;
    }

    const dataLineBuilder = (result: number[], convertedPoints: DataPoint[])=>{
        const xValues = convertedPoints.map(item => item.x);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const lineBuilder = [];
        const yBuilder = (x: number) => {
            if (curveType == "linear"){
                return result[0] + result[1] * x;
            } else if (curveType == "quadratic"){
                return result[0] + result[1] * x + result[2] * Math.pow(x,2);
            } else if (curveType == "cubic"){
                return result[0] + result[1] * x + result[2] * Math.pow(x,2) + result[3] * Math.pow(x,3);
            }
            return 0;
        }
        for (let i = minX; i < maxX; i++ ) {
            lineBuilder.push({ x: i, y: yBuilder(i) });
        }
        return lineBuilder;
    }
    useEffect(()=>{
        console.log(dataLine)
    },[dataLine])


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // parse points and ensure we have the correct amount
        if (!/^(\d+,\d+;)+$/.test(points.replace(/\s+/g, ''))){
            setInputError(true);
            return;
        }
        const convertedPoints = convertToChartData(points);
        setData(convertedPoints);
        try {
            const response = await fetch(`https://localhost:5173/curve?points=${encodeURIComponent(points)}&type=${encodeURIComponent(curveType)}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = JSON.parse(await response.text());
            setDataLine(dataLineBuilder(result, convertedPoints));
            setEquation(`y = ${createEquationString(result)}`);
        }
        catch (error) {
        }
    };

    const handlePointsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPoints(e.target.value);
        setInputError(false);
    };

    const handleCurveTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurveType(e.target.value);
        switch (e.target.value) {
            case ("linear"):
                setEquation("y = ax + b")
                break;
            case ("quadratic"):
                setEquation("y = ax^2 + bx + c")
                break;
            case ("cubic"):
                setEquation("y = ax^3 + bx^2 + cx + d")
                break;
        }
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
            {(data.length != 0) && (
                <>
                    <p>{equation}</p>
                    <LineChart
                        width={600}
                        height={600}
                        >
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis dataKey="x" />
                        <YAxis dataKey="y" />
                        <Line type="monotone" dataKey="y" stroke="none" data={data} dot={true}/>
                        <Line type="monotone" dataKey="y" stroke="#8884d8" data={dataLine} dot={false}/>
                    </LineChart>
                </>)
            }
        </>

    );
}

export default App;