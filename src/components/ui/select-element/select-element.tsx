import { Component, h, Prop } from '@stencil/core';
import Choices from 'choices.js';

@Component({
  tag: 'select-element',
  styleUrl: 'select-element.css',
  shadow: false,
  scoped: true,
})
export class SelectElement {
  @Prop() optionsList: any;
  @Prop() selected: any;
  selectInput: HTMLSelectElement;
  choice;
  attributes: Object = {
    'data-selector': 'selectInput',
    'name': 'select',
  };

  config: Object;

  createSelectConfig() {
    console.log('====================================');
    console.log(this.selected);
    console.log(this.optionsList);
    //TODO Create new Array from Value set matching
    const choices = [];
    this.optionsList.forEach(option => {
      const temp = {
        value: option.code,
        label: option.display,
        selected: this.selected != null && this.selected.code === option.code, //compare
        disabled: false,
        customProperties: option,
      };
      choices.push(temp);
    });
    this.config = {
      // items: this.selected != null ? [this.selected] : [],
      choices: choices,
    };
    console.log(this.config);

    console.log('====================================');
  }

  componentDidLoad() {
    this.createSelectConfig();
    this.choice = new Choices(this.selectInput, this.config);
  }

  componentDidUpdate() {
    this.createSelectConfig();
    this.choice = new Choices(this.selectInput, this.config);
  }

  render() {
    return (
      // data-placeholder="This is a placeholder"
      <select id="selectInput" ref={el => (this.selectInput = el as HTMLSelectElement)} {...this.attributes}>
        {/* {this.optionsList.map(answer => (
          <option value={answer.code}> {answer.display}</option>
        ))} */}
      </select>
    );
  }
}
