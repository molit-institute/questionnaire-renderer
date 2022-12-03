import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getLocaleComponentStrings } from '../../../utils/locale';
import questionnaireController from '../../../utils/questionnaireController';
import { textToHtml } from '../../../utils/textToHtml';

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
  @Prop() informationPageText: String = '';
  @Prop() enableInformalLocale: boolean = false;
  @Prop() filteredItemList: Array<any>;
  @Prop() trademarkText: string = null;
  @Prop() enableErrorConsoleLogging: boolean;
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

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    return (
      <div class="qr-informationPage-container">
        {this.questionnaire && this.questionnaire.title ? (
          <div class="qr-informationPage-title">{this.questionnaire.title}</div>
        ) : null}
        <div class="qr-informationPage-info">
          {this.questionnaire && this.questionnaire.description ? (
            <div class="qr-informationPage-description" innerHTML={textToHtml(this.questionnaire.description)}></div>
          ) : null}
          {this.questionnaire && this.questionnaire.text ? (
            <div class="qr-informationPage-text" innerHTML={textToHtml(this.informationPageText)}></div>
          ) : null}
          <div class="qr-informatonPage-info-section">
            {this.questionnaire && this.questionnaire.publisher ? (
              <div class="qr-informationPage-publisher-container">
                <span class="qr-informationPage-publisher"> {this.strings.publisher}:</span>
                <span class="qr-informationPage-publisher-name">{this.questionnaire.publisher}</span>
              </div>
            ) : null}
            <div class="qr-informationPage-questions-container">
              <span class="qr-informationPage-questions"> {this.strings.numberOfQuestions}:</span>
              <span class="qr-informationPage-questions-number">{questionnaireController.getNumberOfQuestions(null, this.filteredItemList)}</span>
            </div>
          </div>

        </div>
        <div class="qr-informationPage-button">
          <button type="button" class="btn button btn-primary btn-lg qr-button-primary qr-summary-ok-button" onClick={() => this.onStartQuestionnaire()}>
            {this.strings.start}
          </button>
        </div>
        {this.trademarkText ? (
          <div class="qr-informationPage-trademark">
            {this.trademarkText}
          </div>
        ) : null}
      </div>
    );
  }
}
