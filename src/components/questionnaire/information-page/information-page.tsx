import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'information-page',
  styleUrl: 'information-page.css',
  shadow: false,
  scoped: true,
})
export class InformationPage {
  @Element() element: HTMLElement;

  @State() strings: any;

  @Prop() questionnaire: any = null;
  @Prop() informationText: String = '';
  @Prop() enableInformalLocale: boolean;
  @Prop() filteredItemList: Array<any>;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }

  @Event() startQuestionnaire: EventEmitter;
  onStartQuestionnaire() {
    this.startQuestionnaire.emit('start');
  }

  /**
   * Counts all Questions from ItemList excluding Groups
   */
  numberOfQuestions() {
    let number = 0;
    for (let i = 0; i < this.filteredItemList.length; i++) {
      if (this.filteredItemList[i].type !== 'group') {
        number++;
      }
    }
    return number;
  }
  render() {
    return (
      <div class="qr-informationPage-container">
        <div class="qr-informationPage-info">
          <div class="qr-informationPage-title">{this.questionnaire.title}</div>
          <div class="qr-informationPage-text">{this.questionnaire.description}</div>
          <div class="qr-informationPage-publisher-container">
            <span class="qr-informationPage-publisher"> {this.strings.publisher}</span>
            <span class="qr-informationPage-publisher-name">{this.questionnaire.publisher}</span>
          </div>
          <div class="qr-informationPage-questions-container">
            <span class="qr-informationPage-questions"> {this.strings.numberOfQuestions}</span>
            <span class="qr-informationPage-questions-number">{this.numberOfQuestions()}</span>
          </div>
        </div>
        <div class="qr-informationPage-button">
          <button type="button" class="btn button btn-primary btn-lg qr-button-primary qr-summary-ok-button" onClick={() => this.onStartQuestionnaire()}>
            {this.strings.start}
          </button>
        </div>
      </div>
    );
  }
}
