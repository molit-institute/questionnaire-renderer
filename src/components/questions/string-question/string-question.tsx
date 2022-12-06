/**
 * This Component adds a String-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'string-question',
  styleUrl: 'string-question.css',
  shadow: false,
  scoped: true,
})
export class StringQuestion {
  @Element() element: HTMLElement;
  @Prop() variant: any = null;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;

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
  @Prop() enableErrorConsoleLogging:boolean;
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
   * Variable to store the value of the input
   */
  @State() selected: any = null;
  @Event() emitAnswer: EventEmitter;
  @Watch('selected')
  watchSelected() {
    if (this.allow_events) {
      let object = null;
      if (this.selected) {
        this.selected = this.selected.trimLeft();
        object = {
          type: 'string',
          question: this.question,
          value: [this.selected],
        };
      } else {
        object = {
          type: 'string',
          question: this.question,
          value: [],
        };
      }
      this.emitAnswer.emit(object);
    }
  }
  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;

  /* computed */
  validate() {
    return this.selected ? true : false;
    // return false;
  }

  /* methods */
  handleChange(event) {
    this.selected = event.target.value;
  }

  setSelected() {
    try {
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'string');
    } catch (error) {
      this.emitError(error)
    }
  }
  /**
   *  Handles KeyPresses by adding Eventlisteners
   */
  @Event() emitNext: EventEmitter;
  @Listen('keyup')
  handleKeyPress(ev: KeyboardEvent) {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      this.emitNext.emit('next');
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
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div class="qr-question-container">
        {/* TOUCH */}
        {this.variant === 'touch' ? (
          <div>
            <div class="">
              <div class="qr-question-title">
                <div class={this.reset ? 'qr-question-hidden' : ''}>
                  <span class="qr-question-prefix">{this.question.prefix}</span>&nbsp;
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

            <div id={'string' + this.question.linkId} class="qr-question-optionCard">
              {this.strings ? (
                <label class="qr-question-inputLabel qr-stringQuestion-inputLabel" htmlFor="string">
                  {this.strings.text.text}:
                </label>
              ) : null}
              <input id="string" type="text" class="form-control qr-question-input qr-stringQuestion-input" value={this.selected} onInput={e => this.handleChange(e)} />
            </div>
            <br />
          </div>
        ) : null}
        {/* FORM */}
        {this.variant === 'form' ? (
          <div>
            <div id={'string' + this.question.linkId} class="option-card">
              {this.strings ? (
                <label class="" htmlFor="string">
                  {this.question.text}:
                </label>
              ) : null}
              <input id="string" type="text" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
            </div>
          </div>
        ) : null}
        {/* COMPACT */}
        {this.variant === 'compact' ? (
          <div>
            <div id={'string' + this.question.linkId} class="option-card">
              {this.strings ? (
                <label class="" htmlFor="string">
                  {this.question.text}:
                </label>
              ) : null}
              <input id="string" type="text" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
