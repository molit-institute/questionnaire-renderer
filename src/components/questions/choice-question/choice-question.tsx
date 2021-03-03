/**
 * This Component adds a single Multiple-Choice-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireController from '../../../utils/questionnaireController';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'choice-question',
  styleUrl: 'choice-question.css',
  shadow: false,
  scoped: true,
})
export class ChoiceQuestion {
  @Element() element: HTMLElement;

  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  /**
   * Variable to store the value of the input
   */
  @State() selected: any = [];
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
    //TODO get correct response when questions updates
    try {
      this.optionsList = await this.getChoiceOptions();
    } catch (error) {
      alert(error);
    }
    this.setSelected();
    this.repeats = this.question.repeats;
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
      alert(error);
    }
  }
  @Prop() questionnaireResponse: Object = null;
  @Watch('questionnaireResponse')
  async watchQuestionnaireResponse() {
    this.allow_events = false;
    await this.setSelected(); //TODO Hier ist der Übeltäter
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
  optionsList: any = null;
  repeats: any = null;

  /* computed */
  validate() {
    return this.selected || this.selected === [];
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
  getChoiceOptions() {
    return questionnaireController.getChoiceOptions(this.questionnaire, this.question, this.valueSets, this.baseUrl);
  }

  /**
   * Sets the value of the variable selected.
   */
  setSelected() {
    let data = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'coding');

    if (this.question.repeats) {
      this.selected = data;
    } else {
      this.selected = data[0];
    }
  }

  /* Lifecycle Methods */
  @Event() emitRemoveRequiredAnswer: EventEmitter;
  async componentWillLoad(): Promise<void> {
    try {
      this.optionsList = await this.getChoiceOptions();
    } catch (e) {
      console.error(e);
    }
    await this.setSelected();
    this.repeats = this.question.repeats;
    // this.removeQuestionFromRequiredAnsweredQuestionsList(this.question);
    this.emitRemoveRequiredAnswer.emit(this.question); //TODO passt das?
    this.allow_events = true;
  }
  render() {
    return (
      <div>
        <div class="card">
          <h2>
            {this.question.prefix} {this.question.text}
          </h2>
          {this.strings ? (
            !this.repeats ? (
              <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'hidden' : ''}>
                {this.strings.mandatory_question}
              </div>
            ) : (
              <div style={{ color: this.danger }} class={!this.validateCheckBox() ? 'hidden' : ''}>
                {this.strings.mandatory_question}
              </div>
            )
          ) : null}
        </div>

        <hr />

        {!this.repeats ? (
          <div class="form-group">
            {/* <!-- SINGLE CHOICE --> */}
            {this.optionsList.map(answer => (
              <div id={answer.code} class="card radio-button-card" style={{ background: this.selected && this.selected.code === answer.code ? '#e8f4fd' : 'white' }} onClick={() => this.onBoxClickedSingleChoice(answer.display, answer.code)}>
                <div class="form-check">
                  <input class="form-check-input radio-button" type="radio" name={'Radio' + this.question.linkId} id={answer.code} defaultChecked={this.selected && this.selected.code === answer.code} />
                  <label class="form-check-label title" htmlFor={answer.code}>
                    {answer.display}
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div class="form-group">
            {/* <!-- MULTIPLE CHOICE --> */}
            {this.optionsList.map(answer => (
              <div id={answer.code} class="card radio-button-card" style={{ background: this.checkIfSelected(answer) ? '#e8f4fd' : 'white' }}>
                <div class="form-check" onClick={() => this.onBoxClickedMultipleChoice(answer.display, answer.code)}>
                  <input
                    class="form-check-input radio-button"
                    type="checkbox"
                    name={'Checkbox' + this.question.linkId}
                    id={answer.code}
                    defaultChecked={this.checkIfSelected(answer)}
                  />
                  <label class="form-check-label title" htmlFor={answer.code}>
                    {answer.display}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
