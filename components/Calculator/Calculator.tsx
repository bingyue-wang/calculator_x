import React, {useEffect, useState} from 'react';
import Decimal from 'decimal.js';
import {AiOutlineDelete, AiOutlineRollback} from 'react-icons/ai';

const Calculator = ({user}) => {
  const [input, setInput] = useState('0');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);

  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
  const operations = ['+', '-', '×', '÷'];
  const advancedOperations = ['%', '√', '^', 'mod'];

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'userId': user._id,
          },
        });
        const data = await response.json();
        setHistory(data.history);
      } catch (error) {
        console.error('Error fetching history:', error.message);
      }
    };

    fetchHistory();
  }, []);
  const handleInput = (value) => {
    // Check if the last character in the input is an operator or an advanced operator
    const lastChar = input[input.length - 1];
    // check lastChar is an operator or advanced operator
    const isLastCharOperator = operations.includes(lastChar) || advancedOperations.includes(lastChar);
    // check user-typed value is an operator or advanced operator
    const isValueOperator = operations.includes(value) || advancedOperations.includes(value);

    // Don't allow multiple operators or advanced operators
    if (isLastCharOperator && isValueOperator && !(lastChar !== value && (value === '√' || value === '%'))) {
      return;
    }
    // Don't allow two 'mod' operators consecutively
    if (value === 'mod' && input.slice(-3) === 'mod') {
      return;
    }

    // Toggle sign when "±" button is clicked
    if (value === '±') {
      const lastNumberRegex = /(\d+(\.\d+)?|\.\d+)$/;
      const match = input.match(lastNumberRegex);

      if (match) {
        const lastIndex = match.index;
        const lastNumber = match[0];
        const newNumber = lastNumber[0] === '-' ? lastNumber.slice(1) : `(-${lastNumber})`;
        setInput(input.slice(0, lastIndex) + newNumber);
      }
      return;
    }



    // Replace the last operator with the new one
    if (input === '0' && !isValueOperator) {
      setInput(value);
    } else if (input === '0' && (value === '√' || value === '%')) {
      setInput(value);
    } else {
      setInput(input + value);
    }
  };

  const handleHistoryClick = (expression) => {
    setInput(expression);
  };

  const deleteHistory = async (id) => {
    if (!user) {
      setHistory(history.filter((item) => item._id !== id));
      return;
    }

    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
      });
      if (!response.ok) {
        throw new Error('Failed to delete history item');
      }

      // Update history state by removing the deleted item
      setHistory(history.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error.message);
    }
  };


  const calculateResult = async () => {
    try {
      // Replace symbols with Decimal.js compatible operators
      const expression = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // Wrap expression with custom evaluation function
      const result = evaluate(expression);
      setInput(result.toString());

      // Save to history
      const historyEntry = {
        _id: null,
        input: input,
        result: result.toString(),
      };
      setHistory([...history, historyEntry]);

      if (!user) return;

      // Save to database in the background
      await (async () => {
        const response = await fetch('/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({input: input, result: result.toString()}),
        });

        const data = await response.json();
        if (response.ok) {
          historyEntry._id = data.id;
        } else {
          alert('Failed to save history entry in the database');
        }
        setHistory([...history, historyEntry]);
      })();
    } catch (error) {
      setInput('Error');
    }
  };

  const evaluate = (expression) => {
    let tokens = expression
      .replace(/\s+/g, '')
      .replace(/(\d\.)+(\d)/g, '$1$2')
      .split(/([+\-*/()^√%]|mod)/g)
      .filter((token) => token);

    // Handle negative numbers
    tokens = tokens.reduce((acc, token, index) => {
      if (token === '-' && (index === 0 || '+-*/^%mod√('.includes(tokens[index - 1]))) {
        // Handle unary minus (negative numbers)
        acc.push(token + tokens[index + 1]);
      } else if (index > 0 && tokens[index - 1] === '-' && (tokens[index - 2] === undefined || '+-*/^%mod√('.includes(tokens[index - 2]))) {
        // Skip the number after unary minus, as it's already combined
        return acc;
      } else {
        // Handle other tokens
        acc.push(token);
      }
      return acc;
    }, []);

    // Handle implied multiplication
    tokens = tokens.reduce((acc, token, index) => {
      if (index > 0 && (token === '√' || token === '%') && !isNaN(Number(acc[acc.length - 1]))) {
        acc.push('*');
      }
      acc.push(token);
      return acc;
    }, []);

    console.log('[Debugger_], tokens ', tokens);

    const output = [];
    const operators = [];

    tokens.forEach((token) => {
      if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        let operator = operators.pop();
        while (operator !== '(') {
          output.push(operator);
          operator = operators.pop();
        }
      } else if ('+-*/^%mod√'.includes(token)) {
        while (
          operators.length > 0 &&
          precedence(operators[operators.length - 1]) >= precedence(token)
          ) {
          output.push(operators.pop());
        }
        operators.push(token);
      } else {
        output.push(token);
      }
    });

    console.log('[Debugger_], output ', output);
    while (operators.length > 0) {
      output.push(operators.pop());
    }

    console.log('[Debugger_], output ', output);

    const stack = [];
    output.forEach((token) => {
      if ('+-*/^mod'.includes(token)) {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(calculate(a, token, b));
      } else if (token === '√') {
        const a = stack.pop();
        stack.push(calculate(a, token));
      } else if (token === '%') {
        const a = stack.pop();
        stack.push(calculate(a, token));
      } else {
        stack.push(new Decimal(token));
      }
    });


    return stack[0];
  };

  const precedence = (operator) => {
    switch (operator) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
        return 2;
      case '^':
      case 'mod':
      case '√':
      case '%':
        return 3;
      default:
        return 0;
    }
  };


  const calculate = (a, operator, b?) => {
    switch (operator) {
      case '+':
        return a.plus(b);
      case '-':
        return a.minus(b);
      case '*':
        return a.times(b);
      case '/':
        return a.div(b);
      case '^': // Add the ^ operation using Decimal.js pow method
        return a.pow(b);
      case 'mod': // Add the mod operation using Decimal.js modulo method
        return a.mod(b);
      case '√': // Add the √ operation using Decimal.js sqrt method
        return a.sqrt();
      case '%': // Add the % operation using Decimal.js times method
        return a.div(100);
      default:
        throw new Error('Invalid operator');
    }
  };


  const clearInput = () => {
    setInput('0');
  };

  const clearChar = () => {
    if (input.length === 1 || (input.length === 2 && input[0] === '-')) {
      setInput('0');
    } else if (input.slice(-3) === 'mod') {
      setInput(input.slice(0, -3));
    } else {
      const lastChar = input[input.length - 1];
      const isLastCharOperator = operations.includes(lastChar) || advancedOperations.includes(lastChar);
      if (isLastCharOperator) {
        setInput(input.slice(0, -1));
      } else {
        setInput(input.slice(0, -1));
      }
    }
  };


  const parseInputAsNumber = (input) => {
    const match = input.match(/\((-?\d+(\.\d+)?)\)/);
    return match ? parseFloat(match[1]) : parseFloat(input);
  };

  const memoryAdd = () => {
    setMemory(memory === null ? parseInputAsNumber(input) : memory + parseInputAsNumber(input));
  };

  const memorySubtract = () => {
    setMemory(memory === null ? parseInputAsNumber(input) : memory - parseInputAsNumber(input));
  };

  const memoryRecall = () => {
    if (memory !== null) {
      const lastChar = input[input.length - 1];
      const isLastCharOperator = operations.includes(lastChar) || advancedOperations.includes(lastChar);

      if (isLastCharOperator) {
        const memoryString = memory < 0 ? `(${memory})` : memory.toString();
        setInput(input + memoryString);
      }
    }
  };



  const memoryClear = () => {
    setMemory(0);
  };

  const handleDecimal = () => {
    if (!input.includes('.')) {
      setInput(input + '.');
    }
  };


  // The return part of the component is provided in the previous answer.
  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-col md:flex-row">
        <div className="calculator">
          <div className="memory ml-4 w-32 mr-2 mb-4">
            <h2 className="text-xl font-bold mb-2">Memory</h2>
            <div
              className="bg-amber-300 p-2 rounded-lg shadow-md divide-y divide-gray-300">
              <div className="text-sm font-bold overflow-scroll">{memory}</div>
            </div>
          </div>
          <div className="panel min-w-fit w-full">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="display mb-4">
                <input
                  type="text"
                  value={input}
                  readOnly
                  className="w-full p-2 rounded-lg text-right bg-white text-black border border-gray-300"
                />
              </div>
              <div className="buttons grid grid-cols-4 gap-2">
                <div
                  className="memory-operations col-span-4 grid grid-cols-4 gap-2">
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
                <div
                  className="number-buttons col-span-3 grid grid-cols-3 gap-2">
                  {numbers.map((num, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleInput(num)}
                      className="bg-gray-200 text-black font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={handleDecimal}
                    className="bg-gray-200 text-black font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    .
                  </button>
                  <button
                    onClick={() => handleInput('±')}
                    className="bg-gray-200 text-black font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    ±
                  </button>
                </div>
                <div
                  className="operation-buttons col-span-1 grid grid-cols-2 grid-rows-3 gap-2">
                  <button
                    onClick={clearInput}
                    className="w-full bg-red-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    C
                  </button>
                  <button
                    onClick={clearChar}
                    className="w-full bg-red-500 text-[0.5rem] sm:text-base text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    DEL
                  </button>
                  <button
                    onClick={() => handleInput(advancedOperations[0])}
                    className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {advancedOperations[0]}
                  </button>

                  <button
                    onClick={() => handleInput(advancedOperations[1])}
                    className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {advancedOperations[1]}
                  </button>

                  <button
                    onClick={() => handleInput(advancedOperations[2])}
                    className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {advancedOperations[2]}
                  </button>

                  <button
                    onClick={() => handleInput(advancedOperations[3])}
                    className="bg-blue-500 text-[0.5rem] sm:text-base text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {advancedOperations[3]}
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
          </div>
        </div>
        <div className="history ml-4 w-64 mt-4 md:mt-0">
          <h2 className="text-xl font-bold mb-2">History</h2>
          <ul
            className="bg-amber-100 p-2 rounded-lg shadow-2xl divide-y divide-gray-300 min-h-[100px] max-h-[500px] overflow-y-auto">
            {history.map((entry, index) => (
              <div className="flex justify-between items-center p-2"
                   key={index}>
                <div className="text-sm">
                  <div className="font-bold mb-1 text-blue-400">
                    Entry {index + 1}
                  </div>
                  <div
                    className="overflow-scroll whitespace-nowrap text-overflow-ellipsis min-w-[200px] max-w-[200px]">
                    {entry.input}
                  </div>
                  <div
                    className="text-sm font-bold overflow-scroll whitespace-nowrap text-overflow-ellipsis min-w-[200px] max-w-[200px]">
                    ={entry.result}
                  </div>
                </div>
                <div className="flex flex-col">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1"
                    onClick={() => handleHistoryClick(entry.input)}
                  >
                    <AiOutlineRollback/>
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => deleteHistory(entry._id)}
                  >
                    <AiOutlineDelete/>
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
      <div className="notes text-gray-700">
        <div className="font-bold">Note:</div>
        <p className="mb-2">
          To use the % operation, you can enter the first number, then click on the <span className="text-green-500 font-semibold">%</span> button, and then enter the second number.
        </p>
        <div className="bg-green-100 rounded p-2 mt-4">
          <p className="text-gray-600">
            <span className="font-semibold">20% of 100:</span> Enter "100", click on the <span className="text-green-500 font-semibold">%</span> button, enter "20", and then click on the "=" button. The result will be "20".
          </p>
        </div>
        <p>
          To use the square root <span className="text-green-500 font-semibold">√</span> operation, you can enter the <span className="text-green-500 font-semibold">√</span> and then the number you want to find the square root of.
        </p>
        <div className="bg-green-100 rounded p-2 mt-4">
          <p className="text-gray-600">
            <span className="font-semibold">Square root of 16:</span> Enter <span className="text-green-500 font-semibold">√</span>, enter "16", and then click on the "=" button. The result will be "4".
          </p>
        </div>
      </div>




    </div>
  );

};

export default Calculator;
