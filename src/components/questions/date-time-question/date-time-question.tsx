/**
 * This Component adds a single DateTime-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import moment from 'moment';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'date-time-question',
  styleUrl: 'date-time-question.css',
  shadow: false,
  scoped: true,
})
export class DateTimeQuestion {
  @Element() element: HTMLElement;
  @Prop() variant: any = null;
  @Prop() enableErrorConsoleLogging: boolean;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  /**
   * Variable to store the date of the input
   */
  @State() date: any = '';
  @Watch('date')
  watchDate() {
    this.dateTime = moment(this.date + 'T00:00:00-00:00').format();
  }
  /**
   * Variable to store the time of the input
   */
  @State() time: any = '';
  @Watch('time')
  watchTime() {
    this.dateTime = moment(this.date + 'T' + this.time + ':00').format();
  }
  /**
   * Variable to store the dateTime of the input
   */
  @State() dateTime: any = '';
  @Event() emitAnswer: EventEmitter;
  @Watch('dateTime')
  watchDateTime() {
    if (this.allow_events) {
      let object = null;
      if (this.dateTime && this.dateTime !== '' && this.time !== '' && this.date !== '' && this.validate) {
        object = {
          type: 'dateTime',
          question: this.question,
          value: [this.dateTime],
        };
      } else {
        object = {
          type: 'dateTime',
          question: this.question,
          value: [],
        };
      }
      if (this.date !== '' && this.time !== '') {
        this.emitAnswer.emit(object);
      }
    }
  }

  @Prop() question: any;
  @State() reset: Boolean = false;
  @Watch('question')
  watchQuestion() {
    this.getDateAndTime();

    setTimeout(() => {
      this.reset = false;
    }, 5);
  }
  @Prop() mode: string;
  @Prop() questionnaireResponse: Object = null;
  @Watch('questionnaireResponse')
  async watchQuestionnaireResponse() {
    this.allow_events = false;
    this.getDateAndTime();
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
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }
  @Prop() enableInformalLocale: boolean;

  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;
  /**
   * Official FHIR-Date Regex
   */
  dateRegex: '^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$';

  /* computed */
  validate() {
    let regex = new RegExp(this.dateRegex);
    return this.dateTime && regex.test(this.date);
  }

  /* methods */
  getAnswer() {
    try {
      return questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'dateTime');

    } catch (error) {
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
      this.emitError(error);
    }
  }

  getDateAndTime() {
    if (this.getAnswer()) {
      let datetime = this.getAnswer();
      this.date = moment(datetime).format('YYYY-MM-DD');
      this.time = moment(datetime).format('HH:mm');
    } else {
      (this.date = ''), (this.time = '');
    }
  }
  handleChange(event, type) {
    switch (type) {
      case 'date':
        this.date = event.target.value;
        break;
      case 'time':
        this.time = event.target.value;
        break;
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
      this.allow_events = false;
      this.getDateAndTime();
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
          <div class="qr-question qr-question-dateTime">
            <div class="card qr-question-head">
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
              <div class="container-fluid">
                <div class="row">
                  <div class="col-sm-6">
                    {this.strings ? (
                      <label class="qr-question-inputLabel qr-dateTimeQuestion-inputLabel" htmlFor="date">
                        {this.strings.date.text}:
                      </label>
                    ) : null}
                    {/* sm="6" */}
                    <input required={this.question.required} id="date" class="form-control" type="date" max="9999-12-31" value={this.date} onInput={e => this.handleChange(e, 'date')} />
                  </div>
                  <div class="col-sm-6">
                    {this.strings ? (
                      <label class="" htmlFor="time">
                        {this.strings.time.text}:
                      </label>
                    ) : null}
                    {/* sm="6"  */}
                    <input required={this.question.required} id="time" type="time" class="form-control qr-question-input qr-dateTimeQuestion-input" value={this.time} onInput={e => this.handleChange(e, 'time')} />
                  </div>
                </div>
              </div>
            </div>
            <br />
          </div>
        ) : null}
        {this.variant === 'form' ? (
          <div>
            <div class="card option-card">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-sm-6">
                    {this.strings ? (
                      <label class="" htmlFor="date">
                        {this.strings.date.text}:
                      </label>
                    ) : null}
                    {/* sm="6" */}
                    <input required={this.question.required} id="date" class="form-control" type="date" max="9999-12-31" value={this.date} onInput={e => this.handleChange(e, 'date')} />
                  </div>
                  <div class="col-sm-6">
                    {this.strings ? (
                      <label class="" htmlFor="time">
                        {this.strings.time.text}:
                      </label>
                    ) : null}
                    {/* sm="6"  */}
                    <input required={this.question.required} id="time" type="time" class="form-control" value={this.time} onInput={e => this.handleChange(e, 'time')} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {this.variant === 'compact' ? (
          <div>
            <div class="card option-card">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-sm-6">
                    {this.strings ? (
                      <label class="" htmlFor="date">
                        {this.strings.date.text}:
                      </label>
                    ) : null}
                    {/* sm="6" */}
                    <input required={this.question.required} id="date" class="form-control" type="date" max="9999-12-31" value={this.date} onInput={e => this.handleChange(e, 'date')} />
                  </div>
                  <div class="col-sm-6">
                    {this.strings ? (
                      <label class="" htmlFor="time">
                        {this.strings.time.text}:
                      </label>
                    ) : null}
                    {/* sm="6"  */}
                    <input required={this.question.required} id="time" type="time" class="form-control" value={this.time} onInput={e => this.handleChange(e, 'time')} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
