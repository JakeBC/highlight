import React, { Component } from 'react';
import './App.css';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import Color from 'color';

import { SAMPLE_TEXT } from './text';
import SampleText from './SampleTextComponent';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userSelections: [],
            text: this.prepareContent()
        };
        this.selectEnd = this.handleSelectEnd.bind(this);
        this.clear = this.handleClear.bind(this);
    }

    // Create a span for each character in SAMPLE_TEXT
    // Use id to reference block and position
    prepareContent() {
        return SAMPLE_TEXT.map((block, i) => {
            return {
                ...block,
                content: block.content.split('').map((char, j) => {
                    const key = 'char-'+i+'-'+j;
                    return (
                        <span id={key} key={key} className='char'>{char}</span>
                    );
                })
            }
        });
    }

    handleSelectEnd() {
        // get the selected text
        let selectedText = window.getSelection();

        if (selectedText.toString()) {
            let userSelections = this.state.userSelections;
            const range = selectedText.getRangeAt(0);

            // determine the start and end elements
            const startElem = range.startContainer.parentElement;
            const endElem = range.endContainer.parentElement;

            const startBlock = parseInt(startElem.id.split('-')[1]);
            const startPos = parseInt(startElem.id.split('-')[2]);
            const endBlock = parseInt(endElem.id.split('-')[1]);
            const endPos = parseInt(endElem.id.split('-')[2]);

            const startIndex = parseInt(startElem.id.substring(5));
            const endIndex = parseInt(endElem.id.substring(5));
            let text = this.state.text;

            const newColour = `rgba(
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)},
                0.75
            )`;

            // Update the text to highlight the selected text
            if (startBlock === endBlock) {
                let content = text[startIndex].content;
                for (let i = startPos; i <= endPos; i++) {
                    content[i] = this.updateStyle(content[i], newColour);
                }
                text[startIndex].content = content;
            }
            else {
                for (let i = startBlock; i <= endBlock; i++) {
                    let content = text[i].content;
                    if (i === startBlock) {
                        // highlight from startPos to end
                        for (let j = startPos; j < content.length; j++) {
                            content[j] = this.updateStyle(content[j], newColour);
                        }
                    }
                    else if (i === endBlock) {
                        // highlight from start to endPos
                        for (let j = 0; j <= endPos; j++) {
                            content[j] = this.updateStyle(content[j], newColour);
                        }
                    }
                    else {
                        // highlight everything in this block
                        content = content.map(c => {
                            return this.updateStyle(c, newColour);
                        })
                    }
                    text[i].content = content;
                }
            }

            // update the selections for the sidebar
            userSelections.push({
                text: selectedText.toString()
            })
            this.setState({
                userSelections: userSelections,
                text: text
            });
        }
        selectedText.empty();
        selectedText.removeAllRanges();
    }

    // Add a highlight colour to the elements in the selection.
    updateStyle(element, newColour) {
        const currentColour = element.props.style
            ? element.props.style.backgroundColor
            : null;

        if (currentColour) {
            const colourObj = Color(currentColour);
            const c = colourObj.mix(Color(newColour));
            newColour = c.toString();
        }

        return React.cloneElement(element, {
            style: {
                backgroundColor: newColour
            }
        });
    }

    // reset to the original state
    handleClear() {
        this.setState({
            userSelections: [],
            text: this.prepareContent()
        })
    }

    // Factory for rendering formatted elements for the SAMPLE_TEXT
    renderText() {
        return (
            <SampleText handleSelectEnd={this.selectEnd}>
            {
                this.state.text.map((elem, i) => {
                    // TODO: support other element types
                    const id = 'elem-'+i;
                    switch (elem.type) {
                    case 'h1':
                        return <h1 key={id} id={id}>{elem.content}</h1>;
                    case 'h2':
                        return <h2 key={id} id={id}>{elem.content}</h2>;
                    case 'a':
                        return <a key={id} id={id} href={elem.href}>{elem.content}</a>;
                    default:
                        return <p key={id} id={id}>{elem.content}</p>;
                    }
                })
            }
            </SampleText>
        );
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
