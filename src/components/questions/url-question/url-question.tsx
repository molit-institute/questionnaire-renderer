/**
 * This Component adds a single Url-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'url-question',
  styleUrl: 'url-question.css',
  shadow: false,
  scoped: true,
})
export class UrlQuestion {
  @Element() element: HTMLElement;
  @Prop() variant: any = null;
  @Prop() enableErrorConsoleLogging: boolean;
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
      this.validateUrl();
      if (this.selected != null) {
        this.selected = this.selected.trimLeft();
        object = {
          type: 'url',
          question: this.question,
          value: [this.selected],
        };
      } else {
        object = {
          type: 'url',
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
    this.allow_events = false;
    this.setSelected();
    this.allow_events = true;

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
  naUrl: boolean = null;

  /* computed */
  validate() {
    return this.selected ? true : false;
  }

  /* methods */
  validateUrl() {
    if (this.selected === '' || this.selected === null) {
      this.naUrl = null;
    } else {
      let regex = new RegExp('^\\S*$');
      this.naUrl = this.selected.match(regex) ? true : false;
    }
  }

  handleChange(event) {
    this.selected = event.target.value;
  }

  setSelected() {
    try {
      this.selected = '';
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'url');

    } catch (error) {
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
      this.emitError(error);
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
  @Event() emitRemoveRequiredAnswer: EventEmitter;
  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
      this.emitRemoveRequiredAnswer.emit(this.question);
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
          <div class="qr-question qr-question-url">
            <div class="qr-question-head">
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
                  <div id="url-mandatory" style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'qr-question-hidden' : ''}>
                    {this.strings.mandatory_question}
                  </div>
                ) : null}
              </div>
            </div>
            <hr />

            <div class="qr-question-optionCard">
              <div class="form-row">
                <div id={'url' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                  <label class="qr-question-inputLabel qr-urlQuestion-inputLabel" htmlFor="url-text">
                    {this.strings.url.text}:
                  </label>
                  <input type="text" value={this.selected} onInput={e => this.handleChange(e)} class="form-control qr-question-input qr-urlQuestion-input" id="url-text" pattern="\S*" />
                  {this.strings ? (
                    this.naUrl ? (
                      <div class={this.naUrl === null ? 'qr-question-hidden qr-integerQuestion-hidden my-invalid-feedback' : 'qr-question-visible my-valid-feedback'}>{this.strings.url.valid}</div>
                    ) : (
                      <div style={{ color: this.danger }} class={this.naUrl === false ? 'qr-question-visible my-invalid-feedback' : this.naUrl === null ? 'qr-question-hidden my-invalid-feedback' : 'qr-question-hidden my-invalid-feedback'}>
                        {this.strings.url.invalid}
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            </div>
            <br />
          </div>
        ) : null}
        {this.variant === 'form' ? (
          <div>
            <div class="option-card">
              <div class="form-row">
                <div id={'url' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                  <label class="" htmlFor="url-text">
                    {this.question.text}:
                  </label>
                  <input type="text" value={this.selected} onInput={e => this.handleChange(e)} class="form-control" id="url-text" pattern="\S*" />
                  {this.strings ? (
                    this.naUrl ? (
                      <div class={this.naUrl === null ? 'hidden my-valid-feedback' : 'visible my-valid-feedback'}>{this.strings.url.valid}</div>
                    ) : (
                      <div style={{ color: this.danger }} class={this.naUrl === false ? 'visible my-invalid-feedback' : this.naUrl === null ? 'hidden my-invalid-feedback' : 'hidden my-invalid-feedback'}>
                        {this.strings.url.invalid}
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {this.variant === 'compact' ? (
          <div>
            <div class="option-card">
              <div class="form-row">
                <div id={'url' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                  <label class="" htmlFor="url-text">
                    {this.question.text}:
                  </label>
                  <input type="text" value={this.selected} onInput={e => this.handleChange(e)} class="form-control" id="url-text" pattern="\S*" />
                  {this.strings ? (
                    this.naUrl ? (
                      <div class={this.naUrl === null ? 'hidden my-valid-feedback' : 'visible my-valid-feedback'}>{this.strings.url.valid}</div>
                    ) : (
                      <div style={{ color: this.danger }} class={this.naUrl === false ? 'visible my-invalid-feedback' : this.naUrl === null ? 'hidden my-invalid-feedback' : 'hidden my-invalid-feedback'}>
                        {this.strings.url.invalid}
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
