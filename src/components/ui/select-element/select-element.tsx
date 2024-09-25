import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import Choices from 'choices.js';

@Component({
  tag: 'select-element',
  styleUrl: 'select-element.css',
})
export class SelectElement {
  @Prop() translations: any = {
    placeholder: 'Please select',
    noResults: 'No entries found',
    loadingText: 'Loading...',
  };
  @Prop() optionsList: any;
  @Prop() selected: any;
  @Prop() repeats: Boolean = false;
  selectInput: HTMLSelectElement;
  choice;
  attributes: Object = {
    'data-selector': 'selectInput',
    'name': 'select',
  };

  config: Object;

  createSelectConfig() {
    const choices = [];
    this.optionsList.forEach(option => {
      const temp = {
        value: option.code,
        label: option.display,
        selected: this.selected != null && this.checkIfSelected(option),
        disabled: false,
        customProperties: option,
      };
      choices.push(temp);
    });
    this.config = {
      choices: choices,
      placeholderValue: this.translations?.placeholder,
      noResultsText: this.translations?.noResults,
      loadingText: this.translations?.loadingText,
      itemSelectText: '',
      removeItemButton: this.repeats,
      shouldSort: false,
      searchResultLimit: -1,
    };
  }

  checkIfSelected(option) {
    if (!this.repeats) return this.selected.code === option.code;
    for (let i = 0; i < this.selected.length; i++) {
      if (this.selected[i].code === option.code) {
        return true;
      }
    }
    return false;
  }

  @Event({ eventName: 'emitSelectedChoices', bubbles: false }) emitSelectedChoices: EventEmitter;
  emitHandler(value) {
    const temp = this.optionsList.find(el => el.code === value.detail.value);
    this.emitSelectedChoices.emit(temp);
  }

  componentDidLoad() {
    this.createSelectConfig();
    this.choice = new Choices(this.selectInput, this.config);
  }

  render() {
    return this.repeats ? (
      <select id="selectInput" ref={el => (this.selectInput = el as HTMLSelectElement)} multiple {...this.attributes} onChange={ev => this.emitHandler(ev)} />
    ) : (
      <select id="selectInput" ref={el => (this.selectInput = el as HTMLSelectElement)} {...this.attributes} onChange={ev => this.emitHandler(ev)} />
    );
  }
}
