import React from "react";
import Sketch from "react-p5";
import st from "./styles.module.css";

export default ({ h }) => {
    let countX,
        countY,
        cellSize = 5,
        baseHue;

    const setup = (p5, canvasParentRef) => {
        // const hh = p5.windowWidth * 0.13515625; // freaking magic number for emergency cases!
        p5.createCanvas(p5.windowWidth, h).parent(canvasParentRef);
        p5.background(255);
        p5.noStroke();
        p5.colorMode(p5.HSB, 100);
        countX = p5.width / cellSize;
        countY = p5.height / cellSize;
        baseHue = p5.random(100);

        for (let x = 0; x < countX; x++) {
            for (let y = 0; y < countY; y++) {
                drawRect(x * cellSize, y * cellSize, cellSize, p5);
            }
        }
    };

    const draw = (p5) => {
        for (let i = 0; i < 40; i++) {
            drawRect(
                p5.round(p5.random(countX)) * cellSize,
                p5.round(p5.random(countY)) * cellSize,
                cellSize,
                p5,
            );
        }
    };

    function drawRect(x, y, r, p5) {
        const hsb = [baseHue + p5.random(-20, 20), p5.int(p5.random(30,100)), p5.int(p5.random(80,100))];
        const c = p5.color(hsb);
        p5.fill(c);
        p5.rect(x, y, r, r);
    }

    return (
        <div className={st.tiles}>
            <Sketch setup={setup} draw={draw} />
        </div>
    )

};

