import React, {useState} from 'react';

const Calculator = () => {
  const [input, setInput] = useState('0');
  const [memory, setMemory] = useState(null);

  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
  const operations = ['+', '-', '×', '÷'];

  const handleInput = (value) => {
    if (input === '0') {
      setInput(value);
    } else {
      setInput(input + value);
    }
  };

  const calculateResult = () => {
    try {
      setInput(eval(input.replace(/×/g, '*').replace(/÷/g, '/')).toString());
    } catch (error) {
      setInput('Error');
    }
  };


  const clearInput = () => {
    setInput('0');
  };

  const memoryAdd = () => {
    setMemory(memory === null ? parseFloat(input) : memory + parseFloat(input));
  };

  const memorySubtract = () => {
    setMemory(memory === null ? parseFloat(input) : memory - parseFloat(input));
  };

  const memoryRecall = () => {
    if (memory !== null) {
      setInput(memory.toString());
    }
  };

  const memoryClear = () => {
    setMemory(null);
  };

  const handlePercentage = () => {
    setInput((parseFloat(input) / 100).toString());
  };

  const handleSquareRoot = () => {
    setInput(Math.sqrt(parseFloat(input)).toString());
  };

  const handleExponent = () => {
    setInput(input + '**');
  };

  const handleMod = () => {
    setInput(input + '%');
  };

  // The return part of the component is provided in the previous answer.
  return (
    <div className="calculator bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="display mb-4">
        <input
          type="text"
          value={input}
          readOnly
          className="w-full p-2 rounded-lg text-right bg-white text-black border border-gray-300"
        />
      </div>
      <div className="buttons grid grid-cols-4 gap-2">
        <div className="memory-operations col-span-4 grid grid-cols-4 gap-2">
          <button
            onClick={memoryRecall}
            className="bg-yellow-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            MR
          </button>
          <button
            onClick={memoryClear}
            className="bg-yellow-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            MC
          </button>
          <button
            onClick={memoryAdd}
            className="bg-yellow-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            M+
          </button>
          <button
            onClick={memorySubtract}
            className="bg-yellow-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            M-
          </button>
        </div>
        <div className="number-buttons col-span-3 grid grid-cols-3 gap-2">
          {numbers.map((num, idx) => (
            <button
              key={idx}
              onClick={() => handleInput(num)}
              className="bg-gray-200 text-black font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {num}
            </button>
          ))}
        </div>
        <div
          className="operation-buttons col-span-1 grid grid-cols-2 grid-rows-3 gap-2">
          <div className="col-span-2">
            <button
              onClick={clearInput}
              className="w-full bg-red-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              C
            </button>
          </div>
          <button
            onClick={handlePercentage}
            className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            %
          </button>
          <button
            onClick={handleSquareRoot}
            className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            √
          </button>
          <button
            onClick={handleExponent}
            className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            ^
          </button>
          <button
            onClick={handleMod}
            className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            mod
          </button>
          {operations.map((op, idx) => (
            <button
              key={idx}
              onClick={() => handleInput(op)}
              className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {op}
            </button>
          ))}
          <div className="col-span-2">
            <button
              onClick={calculateResult}
              className="w-full bg-green-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              =
            </button>
          </div>
        </div>

      </div>
    </div>
  );

};

export default Calculator;
