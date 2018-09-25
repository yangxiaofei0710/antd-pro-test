import React, { Component } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { connect } from 'dva';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/base16-light.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

@connect((state) => {
  return {
    editModuleInfo: state.configManage.editModuleInfo, // 当前服务资源信息（name，id, moduleid, porjectid）
  };
})
export default class ControlledEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange = (editor, data, value) => {
  }
  render() {
    const options = {
      mode: 'xml',
      theme: 'base16-light',
      lineNumbers: true,
    };
    return (
      <div >
        <CodeMirror
          value={this.props.value}
          options={options}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
