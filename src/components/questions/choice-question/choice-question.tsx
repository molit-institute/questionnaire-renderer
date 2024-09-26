/**
 * This Component adds a single Multiple-Choice-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireController from '../../../utils/questionnaireController';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';
import fhirpath from '../../../assets/js/fhirpath.min.js';

@Component({
  tag: 'choice-question',
  styleUrl: 'choice-question.css',
  shadow: false,
  scoped: true,
})
export class ChoiceQuestion {
  @Element() element: HTMLElement;
  @Prop() variant: any = null;
  @Prop() key: string = null;
  @State() keyReset: number = 0;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  /**
   * Variable to store the value of the input
   */
  @State() selected: any = [];
  // @State() statusi: string="render";
  @Event() emitAnswer: EventEmitter;
  @Watch('selected')
  watchSelected() {
    if (this.allow_events) {
      let object = null;
      if (this.repeats) {
        //CHECKBOXES
        object = {
          type: 'coding',
          question: this.question,
          value: this.selected,
        };
      } else {
        //RADIOBUTTONS
        if (this.selected) {
          object = {
            type: 'coding',
            question: this.question,
            value: [this.selected],
          };
        } else {
          object = {
            type: 'coding',
            question: this.question,
            value: this.selected,
          };
        }
      }
      this.emitAnswer.emit(object);
    }
  }

  @Prop() questionnaire: any;
  @Prop() question: any;
  @Watch('question')
  async watchQuestion() {
    try {
      this.optionsList = await this.getChoiceOptions();
    } catch (error) {
      alert(error);
    }
    this.allow_events = false;
    this.setSelected();
    this.allow_events = true;
    this.repeats = this.question.repeats != null ? this.question.repeats : false;

    this.keyReset++;
  }
  @Prop() answers: any;
  @Prop() mode: string;
  @Prop() baseUrl: string = 'https://fhir.molit.eu/fhir';
  @Prop() valueSets: Array<any>;
  @Watch('valueSets')
  async watchValueSets() {
    try {
      this.optionsList = await this.getChoiceOptions();
    } catch (error) {
      this.emitError(error);
      alert(error);
    }
  }
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
  @Prop() enableErrorConsoleLogging: boolean;
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }
  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;
  optionsList: any = null;
  repeats: any = null;

  selectInput!: HTMLSelectElement;

  readonly FHIRPATH_DropDown = `extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and valueCodeableConcept.coding.code = 'drop-down')`;

  /* computed */
  //Returns true, if the selected is true and contains an array with one or more items
  validate() {
    return this.selected && this.selected.length !== 0;
  }

  isDropDownQuestion() {
    const item = fhirpath.evaluate(this.question, this.FHIRPATH_DropDown);
    if (item.length) return true;
    else return false;
  }

  /* methods */
  checkIfSelected(answer) {
    for (let i = 0; i < this.selected.length; i++) {
      if (this.selected[i].code === answer.code) {
        return true;
      }
    }
    return false;
  }

  validateCheckBox() {
    return this.selected && this.selected.length === 0 && this.question.required;
  }

  onBoxClickedSingleChoice(display, code) {
    this.selected = this.formatAnswer(display, code);
  }

  onBoxClickedMultipleChoice(display, code) {
    let currentSelected = this.selected;
    let selectedAnswer = this.formatAnswer(display, code);
    let deletedAnswer = false;
    //if selected Answer is not in the selected-Array, add it, else delete it
    for (let i = 0; i < currentSelected.length; i++) {
      if (currentSelected[i].code === selectedAnswer.code) {
        this.selected = currentSelected.slice(0, i).concat(currentSelected.slice(i + 1, currentSelected.length));
        deletedAnswer = true;
      }
    }
    if (!deletedAnswer) {
      this.selected = [...this.selected, selectedAnswer];
    }
  }

  /**
   * Returns a Object with display and code
   */
  formatAnswer(display, code) {
    let data = { display: display, code: code };
    return data;
  }

  /**
   * Returns the options for in the Question for the view to display
   */
  async getChoiceOptions() {
    return questionnaireController.getChoiceOptions(this.questionnaire, this.question, this.valueSets, this.baseUrl);
  }

  /**
   * Sets the value of the variable selected.
   */
  setSelected() {
    try {
      let data = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'coding');
      if (this.question.repeats) {
        this.selected = data;
      } else {
        this.selected = data[0];
      }
    } catch (error) {
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
      this.emitError(error);
    }
  }

  rerender() {
    // this.statusi = "updated";
  }

  compareOption() {
    let flatList = questionnaireResponseController.createItemList(this.questionnaire);
    for (let i = 0; i < flatList.length; i++) {
      const question = flatList[i];
      if (question.linkId === this.question.linkId) {
        //TODO abchecken wegen anderen optionsschreibweisen und ggf anpassen
        if (flatList[i - 1].type === 'choice' && flatList[i - 1].answerValueSet === this.question.answerValueSet) {
          return true;
        }
      }
    }
    return false;
  }

  // @Listen('emitSelectedChoices')
  handleInputSelected(ev) {
    if (this.repeats) this.onBoxClickedMultipleChoice(ev.detail.display, ev.detail.code);
    else this.onBoxClickedSingleChoice(ev.detail.display, ev.detail.code);
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
    this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
    try {
      this.optionsList = await this.getChoiceOptions();
    } catch (e) {
      if (this.enableErrorConsoleLogging) {
        console.error(e);
      }
      this.emitError(e);
    }
    await this.setSelected();
    this.repeats = this.question.repeats;
    // this.removeQuestionFromRequiredAnsweredQuestionsList(this.question);
    this.emitRemoveRequiredAnswer.emit(this.question); //TODO passt das?
    this.allow_events = true;
  }

  render() {
    return (
      <div class="qr-question-container" key={this.keyReset}>
        {this.variant === 'touch' ? (
          <div class="qr-question qr-question-choice">
            <div class="qr-question-head">
              <div class="qr-question-title">
                <div>
                  {this.question.prefix && this.question.prefix != '' ? <span class="qr-question-prefix">{this.question.prefix}</span> : null}
                  <span class="qr-question-text" innerHTML={textToHtml(this.question.text)}></span>
                </div>
              </div>
              <div class="qr-question-mandatoryQuestion">
                {this.strings ? (
                  !this.repeats ? (
                    <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'qr-question-hidden ' : ''}>
                      <div></div>
                      {this.strings.mandatory_question}
                    </div>
                  ) : (
                    <div style={{ color: this.danger }} class={!this.validateCheckBox() ? 'qr-question-hidden ' : ''}>
                      {this.strings.mandatory_question}
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <hr />
            {this.isDropDownQuestion() === true
              ? this.strings && (
                  <div class={'form-group qr-choiceQuestion-dropdownChoice-container'}>
                    <select-element optionsList={this.optionsList} selected={this.selected} translations={this.strings.select} repeats={this.repeats} onEmitSelectedChoices={ev => this.handleInputSelected(ev)} />
                  </div>
                )
              : this.optionsList.map(answer => (
                  <div class={!this.repeats ? 'form-group qr-choiceQuestion-singleChoice-container' : 'form-group qr-choiceQuestion-multiChoice-container'}>
                    <div
                      id={answer.code}
                      class={this.selected && this.selected.code === answer.code ? 'card qr-choiceQuestion-radioButtonCard qr-choice-question-selected' : 'card qr-choiceQuestion-radioButtonCard'}
                      onClick={() => (!this.repeats ? this.onBoxClickedSingleChoice(answer.display, answer.code) : this.onBoxClickedMultipleChoice(answer.display, answer.code))}
                    >
                      <div class="form-check qr-choiceQuestion-answer">
                        {!this.repeats && this.selected && this.selected.code === answer.code ? (
                          <input class="form-check-input qr-choiceQuestion-radioButton" type="radio" name={'Radio' + this.question.linkId} id={answer.code} checked />
                        ) : this.repeats && this.checkIfSelected(answer) ? (
                          <input class="form-check-input qr-choiceQuestion-radioButton" type="checkbox" name={'Checkbox' + this.question.linkId} id={answer.code} checked />
                        ) : (
                          <input class="form-check-input qr-choiceQuestion-radioButton" type={!this.repeats ? 'radio' : 'checkbox'} name={(!this.repeats ? 'Radio' : 'Checkbox') + this.question.linkId} id={answer.code} />
                        )}
                        <label class="form-check-label qr-choiceQuestion-answerDisplay" htmlFor={answer.code}>
                          {answer.display}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        ) : null}
        {this.variant === 'form' ? <div>{!this.compareOption() ? <div>erste</div> : <div>andere</div>}</div> : null}
        {this.variant === 'compact' ? <div></div> : null}
      </div>
    );
  }
}
