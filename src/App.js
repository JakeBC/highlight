import React, { Component } from 'react';
import './App.css';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import Radium, { Style } from 'radium';
import Color from 'color';

import SampleText from './SampleTextComponent';
import { SAMPLE_TEXT } from './text.js';
import { COLOURS } from './colours.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userSelections: [],
            charArray: SAMPLE_TEXT.split('').map(c => {
                return {
                    char: c
                }
            })
        };
        this.selectEnd = this.handleSelectEnd.bind(this);
        this.clear = this.handleClear.bind(this);
    }

    handleSelectEnd() {
        // get the selected text
        let selectedText = window.getSelection();

        if (selectedText.toString()) {
            let userSelections = this.state.userSelections;
            const range = selectedText.getRangeAt(0);
            const startId = range.startContainer.parentElement.id
            const endId = range.endContainer.parentElement.id

            const start = parseInt(startId.substring(3));
            const end = parseInt(endId.substring(3));

            // generate a new colour and combine it with any existing ones
            let chars = this.state.charArray;
            const newColour = `rgba(
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)},
                0.5
            )`;
            for (let i = start; i <= end; i++) {
                chars[i].colour = this.combineColours(chars[i].colour, newColour);
            }

            userSelections.push({
                text: selectedText.toString(),
                start: start,
                end: end
            })
            this.setState({
                userSelections: userSelections
            });
        }
    }

    // reset to the original state
    handleClear() {
        this.setState({
            userSelections: [],
            charArray: SAMPLE_TEXT.split('').map(c => {
                return {
                    char: c
                }
            })
        })
    }

    combineColours(currentColour, newColour) {
        if (!currentColour) {
            return newColour;
        }

        const colourObj = Color(currentColour);
        const c = colourObj.mix(Color(newColour));
        return c.toString();
    }

    renderText() {
        return (
            <div onMouseUp={this.selectEnd}
                className='text'
            >
            {
                this.state.charArray.map((c, i) => {
                    return (
                        <span key={'char-'+i}
                            id={'id-'+i}
                            className='char'
                            style={{
                                backgroundColor: c.colour
                            }}
                        >
                            {c.char}
                        </span>
                    )
                })
            }
            </div>
        )
    }

    renderStyles() {
        // build the selector
        // add the styles (background colour)
        const blocks = this.state.userSelections.map(s => {
            const arr = [];
            for (let i = s.start; i <= s.end; i++) {
                arr.push('#id-'+i);
            }
            return arr;
        });

        return (
            <div>
            {
                blocks.map((b, i) => {
                    const bgc = COLOURS[i % 10];
                    const selector = b.join(',');
                    return (
                        <Style key={'style-'+i}
                            scopeSelector={selector}
                            rules={{
                                backgroundColor: bgc
                            }}
                        />
                    )
                })
            }
            </div>
        )
    }

    render() {
        return (
            <div className="App">
                <Grid>
                    <Row>
                        <Col md={9} sm={6} xs={12} className='sample-text'>
                            {this.renderText()}
                            <Button onClick={this.clear}>
                                clear
                            </Button>
                        </Col>
                        <Col md={3} sm={6} xs={12} className='user-selections'>
                            <div>User selections:</div>
                            <ul>
                            {
                                this.state.userSelections.map((selection, index) => {
                                    let header = `Selection ${index+1}:`;
                                    return (
                                        <li key={"selection-" + index}>
                                            <h4>{header}</h4>
                                            <div>{selection.text}</div>
                                        </li>
                                    )
                                })
                            }
                            </ul>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default App;
