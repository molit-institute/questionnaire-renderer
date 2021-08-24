/**
 * This Component adds a Boolean-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'boolean-question',
  styleUrl: 'boolean-question.css',
  shadow: false,
  scoped: true,
})
export class BooleanQuestion {
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
      if (this.selected !== null) {
        let object = {
          type: 'boolean',
          question: this.question,
          value: [this.selected],
        };
        this.emitAnswer.emit(object);
      }
    }
  }

  @Prop() question: any;
  @Watch('question')
  async watchQuestion() {
    this.allow_events = false;
    await this.setSelected();
    this.allow_events = true;
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

  /* computed */
  validate() {
    return this.selected || this.selected === [];
    // return false;
  }

  /* methods */
  onCardClick(selectedValue) {
    this.selected = selectedValue;
  }

  setSelected() {
    let value = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'boolean');
    if (value === true) {
      this.selected = 'yes';
    } else if (value === false) {
      this.selected = 'no';
    } else {
      this.selected = null;
    }
  }

  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale);
      await this.setSelected();
      this.allow_events = true;
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const options: Array<any> = [
      { code: 'yes', display: this.strings.yes },
      { code: 'no', display: this.strings.no },
    ];
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
        <div>
          {this.question ? (
            <div class="form-group" id={'radio-boolean-' + this.question.linkId}>
              {options.map(answer => (
                <div class={this.selected && answer.code === this.selected ? 'card radio-button-card card-selected' : 'card radio-button-card'} onClick={() => this.onCardClick(answer.code)}>
                  <div class="form-check">
                    {this.selected === answer.code ? (
                      <input id={'radio-' + answer.code + '-' + this.question.linkId} class="form-check-input radio-button" type="radio" name={'Radio' + this.question.linkId} checked />
                    ) : (
                      <input id={'radio-' + answer.code + '-' + this.question.linkId} class="form-check-input radio-button" type="radio" name={'Radio' + this.question.linkId} />
                    )}
                    {this.strings ? (
                      <label class="form-check-label title" htmlFor={'radio-' + answer.code + this.question.linkId}>
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
    );
  }
}
