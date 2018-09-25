import React, { Component } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { connect } from 'dva';
import _ from 'lodash';

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
    this.state = {
      value: this.props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }
  onBeforeChange = (editor, data, value) => {
    this.setState({ value });
  }
  onChange = (editor, data, value) => {
    const { dispatch, editModuleInfo, index } = this.props;
    const newEditModuleInfo = _.cloneDeep(editModuleInfo);
    newEditModuleInfo[index].filecontext = value;
    dispatch({
      type: 'configManage/saveModuleInfo',
      payload: newEditModuleInfo,
    });
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
          value={this.state.value}
          options={options}
          onBeforeChange={this.onBeforeChange}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
