import React, { Component } from 'react';

import { SAMPLE_TEXT } from './text';

class SampleTextComponent extends Component {
    render() {
        return (
            <div onMouseUp={this.props.handleSelectEnd} className='text'>
                {this.props.children}
            </div>
        );
    }
}

export default SampleTextComponent;
