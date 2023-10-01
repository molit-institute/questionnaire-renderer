/**
 * This Component adds a single Time-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'time-question',
  styleUrl: 'time-question.css',
  shadow: false,
  scoped: true,
})
export class TimeQuestion {
  @Element() element: HTMLElement;
  @Prop() variant: any = null;
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
    if (this.allow_events) {
      let object = null;
      if (this.selected) {
        object = {
          type: 'time',
          question: this.question,
          value: [this.selected],
        };
      } else {
        object = {
          type: 'time',
          question: this.question,
          value: [],
        };
      }
      this.emitAnswer.emit(object);
    }
  }

  @Prop() question: any;
  @State() reset: Boolean = false;
  @Watch('question')
  watchQuestion() {
    this.setSelected();
    setTimeout(() => {
      this.reset = false;
    }, 5);
  }

  @Prop() mode: string;
  @Prop() questionnaireResponse: Object = null;
  @Watch('questionnaireResponse')
  async watchQuestionnaireResponse() {
    this.allow_events = false;
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

  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;

  /* computed */
  validate() {
    return this.selected ? true : false;
  }

  /* methods */
  setSelected() {
    try {
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'time');
    } catch (error) {
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
      this.emitError(error);
    }
  }
  handleChange(event) {
    this.selected = event.target.value;
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
        {this.variant === 'touch' ? (
          <div>
            <div class="card">
              <div class="qr-question-title">
                <div class={this.reset ? 'qr-question-hidden' : ''}>
                  {this.question.prefix && this.question.prefix != "" ? (
                    <span class="qr-question-prefix">{this.question.prefix}</span>
                  ) : null}
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
            <div class="card qr-question-optionCard">
              <div>
                {this.strings ? (
                  <label class="qr-question-inputLabel qr-timeQuestion-inputLabel" htmlFor="time">
                    {this.strings.time.text}:
                  </label>
                ) : null}
                <input id="time" type="time" class="form-control qr-question-input qr-timeQuestion-input" value={this.selected} onInput={e => this.handleChange(e)} />
              </div>
            </div>
            <br />
          </div>
        ) : null}
        {this.variant === 'form' ? (
          <div>
            {' '}
            <div class="card option-card">
              <div>
                {this.strings ? (
                  <label class="" htmlFor="time">
                    {this.question.text}:
                  </label>
                ) : null}
                <input id="time" type="time" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
              </div>
            </div>
          </div>
        ) : null}
        {this.variant === 'compact' ? (
          <div>
            <div class="card option-card">
              <div>
                {this.strings ? (
                  <label class="" htmlFor="time">
                    {this.question.text}:
                  </label>
                ) : null}
                <input id="time" type="time" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
