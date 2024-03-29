import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';

import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

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
  @Prop() enableErrorConsoleLogging:boolean;

  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }

  /**
   * Emits an error-event
   */
   @Event() errorLog: EventEmitter;
   emitError(error) {
     this.errorLog.emit(error);
   }

  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
    } catch (e) {
      if(this.enableErrorConsoleLogging){
        console.error(e);
      }
      this.emitError(e);
    }
  }

  render() {
    return (
      <div class="qr-displayQuestion-container">
          <span class="qr-displayQuestion-prefix">{this.question.prefix}</span>&nbsp;
          <span innerHTML={textToHtml(this.question.text)} class="qr-displayQuestion-text"></span>
      </div>
    );
  }
}
