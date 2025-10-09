/**
 * This Component adds a Boolean-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'boolean-question',
  styleUrl: 'boolean-question.css',
  shadow: false,
  scoped: true,
})
export class BooleanQuestion {
  @Element() element: HTMLElement;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  /**
   * Variable to store the value of the input
   */
  @State() selected: any = null;
  @Event() emitAnswer: EventEmitter;
  @Watch('selected')
  watchSelected() {
    console.log("watchSelected")
    if (this.allow_events) {
      let object = null;
      if (this.selected !== null) {
        if (this.selected === 'noAnswer') {
          object = {
            type: 'boolean',
            question: this.question,
            value: [],
          };
        } else {
          object = {
            type: 'boolean',
            question: this.question,
            value: [this.selected],
          };
        }
        console.log("emittingEvent", object)
        this.emitAnswer.emit(object);
      }
    }
  }

  @Prop() questionnaire: Object = null;
  @Prop() question: any;
  @State() reset: Boolean = false;
  @Watch('question')
  async watchQuestion() {
    console.log("watchQuestion")
    this.allow_events = false;
    await this.setSelected();
    this.setOptions();
    this.allow_events = true;

    this.reset = true;
    setTimeout(() => {
      this.reset = false;
    }, 5);
  }

  @Prop() mode: string;
  @Prop() questionnaireResponse: Object = null;
  @Watch('questionnaireResponse')
  async watchQuestionnaireResponse() {
    this.allow_events = false;
    console.log("watchQuestionnaireResponse")
    await this.setSelected();
    this.allow_events = true;
  }
  /**
   * Primary color
   */
  @Prop() primary: string;
  /**
   * Secondary color
   */
  @Prop() secondary: string;
  /**
   * Color used to symbolise danger
   */
  @Prop() danger: string;
  @Prop() enableInformalLocale: boolean;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Prop() enableErrorConsoleLogging: boolean;
  @Prop() visibleBooleanNullOption: boolean;
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }
  @State() options: Array<any>;
  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;

  /* computed */
  validate() {
    return this.selected ? true : false;
  }

  /* methods */
  onCardClick(selectedValue) {
    this.selected = selectedValue;
  }

  /**
   * Checks if the question before this question has the type boolean
   * @returns true if the question before has the type boolean
   */
  checkForBooleanQuestions() {
    let flatList = questionnaireResponseController.createItemList(this.questionnaire);
    for (let i = 0; i < flatList.length; i++) {
      let question = flatList[i];
      if (question.linkId === this.question.linkId) {
        if (flatList[i - 1].type === 'boolean') {
          return true;
        }
      }
    }
    return false;
  }
  setOptions() {
    if (this.question.required || !this.visibleBooleanNullOption) {
      this.options = [
        { code: 'yes', display: this.strings.yes },
        { code: 'no', display: this.strings.no },
      ];
    } else {
      this.options = [
        { code: 'yes', display: this.strings.yes },
        { code: 'no', display: this.strings.no },
        { code: 'noAnswer', display: this.strings.noAnswer },
      ];
    }
  }
  setSelected() {
    try {
      console.log("setSelected")
      let value = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'boolean');
      if (value === true) {
        this.selected = 'yes';
      } else if (value === false) {
        this.selected = 'no';
      } else if (!this.question.required) {
        this.selected = 'noAnswer';
      }
    } catch (error) {
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
      this.emitError(error);
    }
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
      await this.setSelected();
      this.allow_events = true;
      this.setOptions();
    } catch (e) {
      if (this.enableErrorConsoleLogging) {
        console.error(e);
      }
      this.emitError(e);
    }
  }

  render() {
    return (
      <div class="qr-question-container">
        <div class="qr-question qr-question-boolean">
          <div class="qr-question-head">
            <div class="qr-question-title">
              <div class={this.reset ? 'qr-question-hidden' : ''}>
                {this.question.prefix && this.question.prefix != '' ? <span class="qr-question-prefix">{this.question.prefix}</span> : null}
                <span class="qr-question-text" innerHTML={textToHtml(this.question.text)}></span>
              </div>
            </div>
            <div class="qr-question-mandatoryQuestion">
              {this.strings ? (
                <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'qr-question-hidden' : ''}>
                  {this.strings.mandatory_question}
                </div>
              ) : null}
            </div>
          </div>
          <hr />
          <div class="qr-question-optionCard">
            {this.question ? (
              <div class="form-group" id={'radio-boolean-' + this.question.linkId}>
                {this.options.map(answer => (
                  <div
                    class={this.selected && answer.code === this.selected ? 'qr-booleanQuestion-card qr-booleanQuestion-radio-button-card qr-booleanQuestion-card-selected' : 'qr-booleanQuestion-card qr-booleanQuestion-radio-button-card'}
                    onClick={() => this.onCardClick(answer.code)}
                  >
                    <div class="form-check">
                      {this.selected === answer.code ? (
                        <input id={'radio-' + answer.code + '-' + this.question.linkId} class="form-check-input qr-booleanQuestion-radioButton" type="radio" name={'Radio' + this.question.linkId} checked disabled={this.question.readOnly} />
                      ) : (
                        <input id={'radio-' + answer.code + '-' + this.question.linkId} class="form-check-input qr-booleanQuestion-radioButton" type="radio" name={'Radio' + this.question.linkId} disabled={this.question.readOnly} />
                      )}
                      {this.strings ? (
                        <label class="form-check-label qr-question-inputLabel" htmlFor={'radio-' + answer.code + this.question.linkId}>
                          {answer.display}
                        </label>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <br />
        </div>
      </div>
    );
  }
}
