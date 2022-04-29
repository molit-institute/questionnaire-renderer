import { Component, h, Prop, Watch, State, Element } from '@stencil/core';

import { getLocaleComponentStrings } from '../../../utils/locale';
import {markdownToHtml} from '../../../utils/markdown'

@Component({
  tag: 'display-question',
  styleUrl: 'display-question.css',
  shadow: false,
  scoped: true,
})
export class DisplayQuestion {
  @Element() element: HTMLElement;
  @State() strings: any;
  @Prop() variant: any = null;
  @Prop() question: any;
  @Prop() mode: string;
  @Prop() enableInformalLocale: boolean; 

  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {

    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }

  markdown(text) {
    if (!text ) {
      return "";
    }
    return markdownToHtml(text);
  }
  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div class="display">
        <h5 class=""><span class="qr-question-prefix">{this.question.prefix}</span>&nbsp;
          <span class="qr-question-text">{this.question.text}</span></h5>
      </div>
    );
  }
}
