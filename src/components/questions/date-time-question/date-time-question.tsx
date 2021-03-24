/**
 * This Component adds a single DateTime-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import moment from 'moment';

@Component({
  tag: 'date-time-question',
  styleUrl: 'date-time-question.css',
  shadow: false,
  scoped: true,
})
export class DateTimeQuestion {
  @Element() element: HTMLElement;

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
      this.emitAnswer.emit(object);
    }
  }

  @Prop() question: any;
  @Watch('question')
  watchQuestion() {
    this.getDateAndTime();
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
    this.strings = await getLocaleComponentStrings(this.element, newValue);
  }

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
    return (this.dateTime || this.dateTime === []) && regex.test(this.date);
  }

  /* methods */
  getAnswer() {
    return questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'dateTime');
  }

  getDateAndTime() {
    if (this.getAnswer()) {
      let datetime = this.getAnswer();
      this.date = moment(datetime).format('YYYY-MM-DD');
      this.time = moment(datetime).format('HH:mm');
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

  /* Lifecycle Methods */
  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale);
      this.allow_events = false;
      this.getDateAndTime();
      this.allow_events = true;
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div>
        <div class="card">
          <h2>
            {this.question.prefix} {this.question.text}
          </h2>
          {this.strings ? (
            <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'hidden' : ''}>
              {this.strings.mandatory_question}
            </div>
          ) : null}
        </div>
        <hr />
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
                    {this.strings.date.text}:
                  </label>
                ) : null}
                {/* sm="6"  */}
                <input required={this.question.required} id="time" type="time" class="form-control" value={this.time} onInput={e => this.handleChange(e, 'time')} />
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}
