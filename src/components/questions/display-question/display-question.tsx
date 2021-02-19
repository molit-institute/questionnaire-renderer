import { Component, h, Prop, Watch, State, Element } from '@stencil/core';

import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'display-question',
  styleUrl: 'display-question.css',
  shadow: false,
  scoped: true,
})
export class DisplayQuestion {
  @Element() element: HTMLElement;
  @State() strings: any;

  @Prop() question: any;
  @Prop() mode: string;

  /**
   * Language property of the component. </br>
   * Currently suported: [de, en]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    console.log(newValue);
    this.strings = await getLocaleComponentStrings(this.element, newValue);
  }

  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div class="display">
      <h5 class="">{ this.question.prefix } { this.question.text }</h5>
    </div>
    );
  }
}
