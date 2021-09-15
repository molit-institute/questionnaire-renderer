/**
 * This Component adds a single Integer-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import fhirpath from '../../../assets/js/fhirpath.min.js';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'integer-question',
  styleUrl: 'integer-question.css',
  shadow: false,
  scoped: true,
})
export class IntegerQuestion {
  @Element() element: HTMLElement;
  integerInput!: HTMLInputElement;
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
          type: 'integer',
          question: this.question,
          value: [this.selected],
        };
      } else {
        object = {
          type: 'integer',
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
    /**Note: This code prevents the input from showing the invalid value as long as the type of the question
     * doesnt change. If a invalid Number is entered, selected is "" - the code will then force the input
     * to have the value "" aswell
     **/
    if (this.selected === '') {
      this.integerInput.value = '';
    }
    this.setSelected();
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

  readonly FHIRPATH_SLIDER = `extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and valueCodeableConcept.coding.code = 'slider')`;
  readonly FHIRPATH_SLIDER_MIN = `extension.where(url='http://hl7.org/fhir/StructureDefinition/minValue').valueInteger`;
  readonly FHIRPATH_SLIDER_MAX = `extension.where(url='http://hl7.org/fhir/StructureDefinition/maxValue').valueInteger`;
  readonly FHIRPATH_SLIDER_STEP = `extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue').valueInteger`;
  readonly FHIRPATH_SLIDER_LOWER = `item.where(extension.url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and extension.valueCodeableConcept.coding.code = 'lower').text`;
  readonly FHIRPATH_SLIDER_UPPER = `item.where(extension.url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and extension.valueCodeableConcept.coding.code = 'upper').text`;

  /* computed */
  validate() {
    return this.selected || this.selected === [];
  }
  isVasQuestion() {
    const vas = fhirpath.evaluate(this.question, this.FHIRPATH_SLIDER);
    if (vas.length) {
      return true;
    } else {
      return false;
    }
  }
  minVas() {
    if (this.isVasQuestion() === true) {
      return fhirpath.evaluate(this.question, this.FHIRPATH_SLIDER_MIN)[0];
    } else {
      return null;
    }
  }
  maxVas() {
    if (this.isVasQuestion() === true) {
      return fhirpath.evaluate(this.question, this.FHIRPATH_SLIDER_MAX)[0];
    } else {
      return null;
    }
  }
  stepVas() {
    if (this.isVasQuestion() === true) {
      return fhirpath.evaluate(this.question, this.FHIRPATH_SLIDER_STEP)[0];
    } else {
      return null;
    }
  }
  labelLowerVas() {
    if (this.isVasQuestion() === true) {
      return fhirpath.evaluate(this.question, this.FHIRPATH_SLIDER_LOWER)[0];
    } else {
      return null;
    }
  }
  labelUpperVas() {
    if (this.isVasQuestion() === true) {
      return fhirpath.evaluate(this.question, this.FHIRPATH_SLIDER_UPPER)[0];
    } else {
      return null;
    }
  }

  /* methods */
  @Listen('emitSelected')
  handleInputVas(value) {
    // this.selected = parseInt(value.detail, 10);
    this.selected = value.detail;
  }

  handleChange(event) {
    this.selected = event.target.value;
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
  setSelected() {
    this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'integer');
  }
  /**
   * Parses a String into a integer
   */
  toInteger(value) {
    return parseInt(value);
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
    return (
      <div>
        {this.variant === 'touch' ? (
          <div>
            <h2>
              {this.question.prefix} {this.question.text}
            </h2>
            {this.strings ? (
              <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'hidden' : ''}>
                {this.strings.mandatory_question}
              </div>
            ) : null}
            <hr />
            {this.isVasQuestion() === true ? (
              <vas-question min={this.minVas()} max={this.maxVas()} step={this.stepVas()} selected={this.selected} labelLower={this.labelLowerVas()} labelUpper={this.labelUpperVas()} />
            ) : (
              <div class="class option-card">
                <div class="form-row">
                  <div id={'integer' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                    <label class="" htmlFor="integerInput">
                      {this.strings.integer.text}:
                    </label>
                    <input
                      ref={el => (this.integerInput = el as HTMLInputElement)}
                      type="number"
                      step="1"
                      onKeyPress={e => {
                        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
                          e.preventDefault();
                        }
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={this.selected}
                      onInput={e => this.handleChange(e)}
                      class="form-control"
                    />
                    {this.strings ? (
                      <div style={{ color: this.danger }} class={this.validate() !== false ? 'hidden my-invalid-feedback' : this.selected === null ? 'hidden my-invalid-feedback' : 'visible my-invalid-feedback'}>
                        {this.strings.integer.invalid}
                      </div>
                    ) : null}
                  </div>
                </div>
                <br />
              </div>
            )}
          </div>
        ) : null}
        {this.variant === 'form' ? (
        <div>
          <div class="class option-card">
                <div class="form-row">
                  <div id={'integer' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                    <label class="" htmlFor="integerInput">
                      {this.strings.integer.text}:
                    </label>
                    <input
                      ref={el => (this.integerInput = el as HTMLInputElement)}
                      type="number"
                      step="1"
                      onKeyPress={e => {
                        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
                          e.preventDefault();
                        }
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={this.selected}
                      onInput={e => this.handleChange(e)}
                      class="form-control"
                    />
                    {this.strings ? (
                      <div style={{ color: this.danger }} class={this.validate() !== false ? 'hidden my-invalid-feedback' : this.selected === null ? 'hidden my-invalid-feedback' : 'visible my-invalid-feedback'}>
                        {this.strings.integer.invalid}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
        </div>
        ) : null}
        {this.variant === 'compact' ? (
        <div>

        </div>
        ) : null}
      </div>
    );
  }
}
