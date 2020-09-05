import React from "react";
import Sketch from "react-p5";
import st from "./styles.module.css";
let walkers = [];

export default ({ baseHue }) => {
    const nums = 20,
        cellSize = 5,
        count = 20,
        canSize = cellSize * ( count - 1),
        min = 0,
        max = canSize - cellSize;

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(canSize, canSize).parent(canvasParentRef);
        p5.frameRate(15);
        p5.pixelDensity(2);
        p5.noStroke();
        p5.rectMode(p5.CENTER);
        p5.colorMode(p5.HSB, 360, 100, 100);

        for (let i = 0; i < nums; i++){
            walkers[i] = new Walker(canSize / 2, canSize / 2, p5);
        }
    };

    const draw = () => {
        for (let i = 0; i < nums; i++){
            walkers[i].whichWay();
            walkers[i].go();
        }
    };

    function Walker(x, y, p5) {
        this.x = x;
        this.y = y;

        this.whichWay = () => {
            const ranVal = p5.random();

            if (ranVal < 0.25) {
                if (this.x < max) this.x += cellSize;
                else this.x -= cellSize;
            }
            if (ranVal >= 0.25 && ranVal < 0.5) {
                if (this.y < max) this.y += cellSize;
                else this.y -= cellSize;
            }
            if (ranVal >= 0.5 && ranVal < 0.75) {
                if (this.x > min) this.x -= cellSize;
                else this.x += cellSize;
            }
            if (ranVal >= 0.75) {
                if (this.y > min) this.y -= cellSize;
                else this.y += cellSize;
            }
        }

        this.go = () => {
            const hsb = [baseHue + p5.int(p5.random(-60, 60)), p5.int(p5.random(30,100)), p5.int(p5.random(80, 100))];
            const c = p5.color(hsb);
            p5.fill(c);
            p5.rect(this.x, this.y, cellSize, cellSize);
        }
    }

    return (
        <div className={st.preloader}>
            <Sketch setup={setup} draw={draw} />
        </div>
    )
};

