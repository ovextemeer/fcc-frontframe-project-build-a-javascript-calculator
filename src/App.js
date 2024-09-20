import "./styles.css";
import "./fonts/ds_digital/DS-DIGI.TTF";
import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "0",
      output: "",
    };

    this.clear = this.clear.bind(this);
    this.operate = this.operate.bind(this);
    this.input = this.input.bind(this);
    this.calculate = this.calculate.bind(this);
  }

  clear() {
    this.setState({ input: "0", output: "" });
  }

  operate(event) {
    this.setState((state) => {
      let operator = event.target.innerHTML;
      let input = state.input.slice(0);
      let output = state.output.slice(0);

      if (operator === "x") {
        operator = "*";
      }

      if (input === "NaN") {
        output = "NaN" + operator;
        input = operator;
      } else if (input === "0" && output === "") {
        input = operator;
        output += "0" + operator;
      } else if ("+-*/".includes(output.slice(-1))) {
        if (operator === "-") {
          if (output.length > 2 && "+-*/".includes(output.slice(-2, -1))) {
            input = operator;
            output = output.slice(0, output.length - 2) + operator;
          } else {
            input += operator;
            output += operator;
          }
        } else {
          if (output.length > 2 && "+-*/".includes(output.slice(-2, -1))) {
            input = operator;
            output = output.slice(0, output.length - 2) + operator;
          } else {
            input = operator;
            output = output.slice(0, output.length - 1) + operator;
          }
        }
      } else if (
        (output.slice(-1) >= "0" && output.slice(-1) <= "9") ||
        output.slice(-1) === "N"
      ) {
        input = operator;
        output += operator;
      } else if (output.slice(-1) === ".") {
        if (!(output.length > 2 && "+-*/".includes(output.slice(-2, -1)))) {
          input = operator;
          output += operator;
        }
      }

      return { input: input, output: output };
    });
  }

  input(event) {
    this.setState((state) => {
      const key = event.target.innerHTML;
      let input = state.input.slice(0);
      let output = state.output.slice(0);

      if (input === "0" && output === "") {
        if (key === ".") {
          input += key;
          output += "0.";
        } else {
          input += key;
          input = input.slice(1);
          output += key;
        }
      } else if (output.length === 1 && output === "0") {
        if (key === ".") {
          input += key;
          output += key;
        } else {
          input += key;
          input.slice(1);
          output += key;
          output.slice(1);
        }
      } else if ("+-*/".includes(output.slice(-1))) {
        input = key;
        output += key;
      } else if (!(input.includes(".") && key === ".")) {
        input += key;
        output += key;
      }

      return { input: input, output: output };
    });
  }

  calculate() {
    this.setState((state) => {
      let input = state.input.slice(0);
      let output = state.output.slice(0);
      let temp = [];
      let t = "";

      for (let i = 0; i < output.length; ++i) {
        if ("0123456789.NaN".includes(output[i])) {
          t += output[i];

          if (i === output.length - 1) {
            temp.push(t);
          }
        } else {
          if ("0123456789.NaN".includes(output[i - 1])) {
            temp.push(t);
            t = "";
            temp.push(output[i]);
          } else {
            t = output[i];

            if (i === output.length - 1) {
              temp.push(t);
            }
          }
        }
      }

      if ("+-*/".includes(temp[temp.length - 1])) {
        if ("+-*/".includes(temp[temp.length - 2])) {
          temp.pop();
          temp.pop();
        } else {
          temp.pop();
        }
      }

      for (let i = 0; i < temp.length; ++i) {
        if (!"+-*/".includes(temp[i])) {
          if (isNaN(Number(temp[i]))) {
            temp[i] = "NaN";
          } else {
            temp[i] = Number(temp[i]);

            if (temp[i] === 0 && temp[i - 1] === "/") {
              temp.splice(i - 1, 2, "NaN");
            }
          }
        }
      }

      if (temp.includes("NaN")) {
        output = "";
        temp.forEach((e) => (output += e.toString()));
        output += "=NaN";
        input = "NaN";

        return { input: input, output: output };
      } else {
        output = "";
        temp.forEach((e) => (output += e.toString()));

        again1: while (temp.includes("*") || temp.includes("/")) {
          for (let i = 0; i < temp.length; ++i) {
            if (temp[i] === "*") {
              temp.splice(i - 1, 3, temp[i - 1] * temp[i + 1]);
              continue again1;
            } else if (temp[i] === "/") {
              temp.splice(i - 1, 3, temp[i - 1] / temp[i + 1]);
              continue again1;
            }
          }
        }

        again2: while (temp.includes("+") || temp.includes("-")) {
          for (let i = 0; i < temp.length; ++i) {
            if (temp[i] === "+") {
              temp.splice(i - 1, 3, temp[i - 1] + temp[i + 1]);
              continue again2;
            } else if (temp[i] === "-") {
              temp.splice(i - 1, 3, temp[i - 1] - temp[i + 1]);
              continue again2;
            }
          }
        }

        let result = Math.round(temp[0] * 10000) / 10000;
        output += "=" + result.toString();
        input = result.toString();

        return { input: input, output: output };
      }
    });
  }

  render() {
    return (
      <div className="App">
        <div className="calculator">
          <div id="display2">{this.state.output}</div>
          <div id="display">{this.state.input}</div>
          <div className="controls">
            <button id="clear" onClick={this.clear}>
              AC
            </button>
            <button id="divide" onClick={this.operate}>
              /
            </button>
            <button id="multiply" onClick={this.operate}>
              x
            </button>
            <button id="seven" onClick={this.input}>
              7
            </button>
            <button id="eight" onClick={this.input}>
              8
            </button>
            <button id="nine" onClick={this.input}>
              9
            </button>
            <button id="subtract" onClick={this.operate}>
              -
            </button>
            <button id="four" onClick={this.input}>
              4
            </button>
            <button id="five" onClick={this.input}>
              5
            </button>
            <button id="six" onClick={this.input}>
              6
            </button>
            <button id="add" onClick={this.operate}>
              +
            </button>
            <button id="one" onClick={this.input}>
              1
            </button>
            <button id="two" onClick={this.input}>
              2
            </button>
            <button id="three" onClick={this.input}>
              3
            </button>
            <button id="equals" onClick={this.calculate}>
              =
            </button>
            <button id="zero" onClick={this.input}>
              0
            </button>
            <button id="decimal" onClick={this.input}>
              .
            </button>
          </div>
        </div>
      </div>
    );
  }
}
