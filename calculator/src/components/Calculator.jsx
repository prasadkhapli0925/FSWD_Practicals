import React, { useState, useEffect } from 'react';
import Button from './Button';
import './Calculator.css';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const operators = ['+', '-', '*', '/', '.'];

  const handleInput = (val) => {
    // Handle the visual label for multiplication
    const actualVal = val === '×' ? '*' : val === '÷' ? '/' : val;

    // Prevent decimal point if already present in current number
    if (actualVal === '.') {
      const parts = expression.split(/[\+\-\*\/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) return;
    }

    // Prevent multiple consecutive operators
    if (
      operators.includes(actualVal) &&
      (expression === '' || operators.includes(expression.slice(-1)))
    ) {
      if (expression === '' && actualVal === '-') {
        // Allow negative numbers at the start
      } else {
        return;
      }
    }

    setExpression((prev) => prev + actualVal);
  };

  const clear = () => {
    setExpression('');
    setResult('');
  };

  const backspace = () => {
    if (expression.length > 0) {
      setExpression((prev) => prev.slice(0, -1));
    }
  };

  const calculate = () => {
    try {
      if (expression === '') return;
      
      // Close open operators at the end if any
      let exprToEval = expression;
      if (operators.includes(exprToEval.slice(-1))) {
        exprToEval = exprToEval.slice(0, -1);
      }

      // Basic sanitization: only allow numbers and operators
      const sanitizedExpression = exprToEval.replace(/[^-+/*0-9.]/g, '');
      
      // Use Function constructor for evaluation
      // eslint-disable-next-line no-new-func
      const res = new Function(`return ${sanitizedExpression}`)();
      
      if (res === Infinity || isNaN(res)) {
        setResult('Error');
      } else {
        // Limit decimal places to 8
        const formattedRes = Number.isInteger(res) ? res : Number(res.toFixed(8));
        setResult(String(formattedRes));
      }
    } catch (error) {
      setResult('Error');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/[0-9]/.test(e.key)) handleInput(e.key);
      if (operators.includes(e.key)) handleInput(e.key);
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      }
      if (e.key === 'Escape' || e.key === 'c') clear();
      if (e.key === 'Backspace') backspace();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression]);

  return (
    <div className="calculator-card">
      <div className="display-area">
        <div className="expression-viewer">{expression || '0'}</div>
        <div className="result-viewer">{result}</div>
      </div>
      <div className="buttons-grid">
        <Button label="C" onClick={clear} className="clear" />
        <Button label="⌫" onClick={backspace} className="backspace" />
        <Button label="÷" onClick={handleInput} className="operator" />
        <Button label="×" onClick={handleInput} className="operator" />

        <Button label="7" onClick={handleInput} />
        <Button label="8" onClick={handleInput} />
        <Button label="9" onClick={handleInput} />
        <Button label="-" onClick={handleInput} className="operator" />

        <Button label="4" onClick={handleInput} />
        <Button label="5" onClick={handleInput} />
        <Button label="6" onClick={handleInput} />
        <Button label="+" onClick={handleInput} className="operator" />

        <Button label="1" onClick={handleInput} />
        <Button label="2" onClick={handleInput} />
        <Button label="3" onClick={handleInput} />
        <Button label="=" onClick={calculate} className="equals" />

        <Button label="0" onClick={handleInput} className="btn-zero" />
        <Button label="." onClick={handleInput} />
      </div>
    </div>
  );
};

export default Calculator;
