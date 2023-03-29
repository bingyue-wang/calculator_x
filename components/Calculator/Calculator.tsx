import React, {useState} from 'react';
import Decimal from 'decimal.js';

const Calculator = () => {
  const [input, setInput] = useState('0');
  const [memory, setMemory] = useState(null);

  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
  const operations = ['+', '-', '×', '÷'];
  const advancedOperations = ['%', '√', '^', 'mod'];

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

    // Replace the last operator with the new one
    if (input === '0' && !isValueOperator) {
      setInput(value);
    } else {
      setInput(input + value);
    }
  };



  const calculateResult = () => {
    try {
      // Replace symbols with Decimal.js compatible operators
      const expression = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // Wrap expression with custom evaluation function
      const result = evaluate(expression);
      setInput(result.toString());
    } catch (error) {
      setInput('Error');
    }
  };

  const evaluate = (expression) => {
    let tokens = expression
      .replace(/\s+/g, '')
      .replace(/(\d\.)+(\d)/g, '$1$2')
      .split(/([+\-*/()^√%]|mod)/g) // Add √ and % to the regex pattern
      .filter((token) => token);

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

  const handleDecimal = () => {
    if (!input.includes('.')) {
      setInput(input + '.');
    }
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
          <button
            onClick={handleDecimal}
            className="bg-gray-200 text-black font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            .
          </button>
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
            className="bg-blue-500 text-white font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
  );

};

export default Calculator;
