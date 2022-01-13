const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const queryString = require("query-string");

const { add, sous, mult, div, resetArray } = require("./src/utils");

let memory = [
    { action: '*', number1: 5, number2: 2, resultCalcualtor: 10 },
    { action: '*', number1: 5, number2: 2, resultCalcualtor: 10 },
    { action: '*', number1: 5, number2: 2, resultCalcualtor: 10 },
    { action: '*', number1: 5, number2: 2, resultCalcualtor: 10 },
    { action: '*', number1: 5, number2: 2, resultCalcualtor: 10 },
    { action: '*', number1: 5, number2: 2, resultCalcualtor: 10 },
    { action: '*', number1: 5, number2: 2, resultCalcualtor: 10 },
    { action: '*', number1: 5, number2: 2, resultCalcualtor: 10 }
]
let resultCalcualtor = 0;

module.exports = http.createServer((req, res) => {
    const { url, method } = req;

    if (url === "/" && method === "GET") {
        const template = fs.readFileSync("./views/home.html", "utf8");
        res.writeHead(200, {
            "Content-Types": "text/html"
        });
        res.write(ejs.render(template, { resultCalcualtor }));
        res.end();

        return;
    }

    if (url === "/" && method === "POST") {
        let body = "";
        let objBody = {};
        req.on("data", data => {
            body += data;
            objBody = queryString.parse(body);
            console.log(objBody);

            const { action } = objBody;
            const number1 = parseInt(objBody.number1);
            const number2 = parseInt(objBody.number2);
            let transformAction = "";

            switch (action) {
                case "add":
                    resultCalcualtor = add(number1, number2);
                    transformAction = "+";
                    break;
                case "sous":
                    resultCalcualtor = sous(number1, number2);
                    transformAction = "-";
                    break;
                case "mult":
                    resultCalcualtor = mult(number1, number2);
                    transformAction = "*";
                    break;
                case "div":
                    resultCalcualtor = div(number1, number2);
                    transformAction = "/";
                    break;
                case "reset":
                    memory = resetArray(memory);
                    break;
            }

            if (isNaN(resultCalcualtor)) {
                resultCalcualtor = "Veuillez taper des nombres !!"
            } 
            if (!isNaN(resultCalcualtor) && action !== "reset") {
                memory.push({ action: transformAction, number1, number2, resultCalcualtor });
                console.log("memory", memory);
            }
        })
        req.on("end", () => {
            const template = fs.readFileSync("./views/home.html", "utf8");
            res.writeHead(200, {
                "Content-Types": "text/html"
            });
            res.write(ejs.render(template, { resultCalcualtor }));
            res.end();
        })

        return;
    }

    if (url === "/memory" && method === "GET") {
        const template = fs.readFileSync("./views/memory.html", "utf8");
        res.writeHead(200, {
            "Content-Types": "text/html"
        });
        res.write(ejs.render(template, { memory }));
        res.end();
        
        return;
    }

    if (url === "/bootstrap") {
        const css = fs.readFileSync("./assets/css/bootstrap.min.css");
        res.writeHead(200, {
            "Content-Type": "text/css"
        });
        res.write(css);
        res.end();

        return;
    }

    res.statusCode = 404
    res.end();
})