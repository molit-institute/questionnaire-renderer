import { Component, h, State } from '@stencil/core';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import { Questionnaire, QuestionnaireResponse, Task } from '@/types';
import * as examplePatient from '../../assets/fhir/resources/patient-example.js';
// import enableQuestionnaire from '../../assets/fhir/resources/questionnaire-lang-enable.js';
// import everyTypeQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type.js';
// import everyTypeWithInitialQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type_with_initial.js';
// import repeatedQuestionnaire from '../../assets/fhir/resources/questionnaire-repeat.js';
// import q_5d_5l from '../../assets/fhir/resources/5q-5d-5l.js';
import vomit from '../../assets/fhir/resources/vomit.js';
// import lion from '../../assets/fhir/resources/lion_questionnaire.js';
// import dropdown_test from '../../assets/fhir/resources/dropdown_test_questionnaire.js';
// import lion_response from '../../assets/fhir/resources/lion_questionnaire_response2.js';
// import qlq30_response from '../../assets/fhir/resources/qlq30_response.js';

const STORAGE_KEY = 'test-ui-settings';

interface RendererOption {
  key: string;
  label: string;
  type: 'checkbox' | 'select' | 'text' | 'json';
  default: string | boolean;
  values?: string[];
  description?: string;
}

const RENDERER_OPTIONS: RendererOption[] = [
  { key: 'basicAuth', label: 'basicAuth', type: 'checkbox', default: false, description: 'If basicAuth is true, the authorization header in server requests will be set to "Basic "' },
  { key: 'danger', label: 'danger', type: 'text', default: '', description: 'Color used to symbolise danger' },
  { key: 'editMode', label: 'editMode', type: 'checkbox', default: false, description: 'If true the render will show the button to exit the renderer. It can be used in combination with the summary to edit answers.' },
  { key: 'enableErrorConsoleLogging', label: 'enableErrorConsoleLogging', type: 'checkbox', default: true, description: 'Allows the renderer to show errors in the console while emitting error-events' },
  { key: 'enableExpand', label: 'enableExpand', type: 'checkbox', default: true, description: 'If true, enables the renderer to expand valueSets to also load included code systems' },
  { key: 'enableFinishButton', label: 'enableFinishButton', type: 'checkbox', default: false, description: 'Shows a finish-button instead of next at the last question' },
  {
    key: 'enableFullQuestionnaireResponse',
    label: 'enableFullQuestionnaireResponse',
    type: 'checkbox',
    default: false,
    description: 'If true the Renderer will return a QuestionnaireResponse with all items, even if some items have been deactivated by enableWhen',
  },
  { key: 'enableGroupDescription', label: 'enableGroupDescription', type: 'checkbox', default: false, description: 'If true, shows the description of the group for every question thats part of the group' },
  { key: 'enableInformalLocale', label: 'enableInformalLocale', type: 'checkbox', default: true, description: 'If true enables the use of the informalLocale - only available for german translation' },
  { key: 'enableInformationPage', label: 'enableInformationPage', type: 'checkbox', default: true, description: 'If true enables the renderer to show the informationPage' },
  { key: 'enableNext', label: 'enableNext', type: 'checkbox', default: true, description: 'Enable the button that can be used to show the summary or end the questionnaire.' },
  {
    key: 'enableReturn',
    label: 'enableReturn',
    type: 'checkbox',
    default: false,
    description: 'Enable the return-button to exit the render-view. This will also enable the "exit"-Event to be thrown if the information-page is deactivated.',
  },
  {
    key: 'enableSendQuestionnaireResponse',
    label: 'enableSendQuestionnaireResponse',
    type: 'checkbox',
    default: true,
    description: 'If true enables the summary to send QuestionnaireResponses to the FHIR Server. Needs the fhir-base url to be able send to the server',
  },
  { key: 'enableSummary', label: 'enableSummary', type: 'checkbox', default: true, description: 'Enable the summary. The summary will be shown if enableSummary is true' },
  {
    key: 'enableVersioning',
    label: 'enableVersioning',
    type: 'checkbox',
    default: true,
    description: 'If true, the Renderer handles questionnaire versions: the version is appended to the questionnaire reference in the created QuestionnaireResponse, the task-questionnaire match includes the version and a versioned questionnaireUrl is fetched with the version. If false, all version handling is deactivated.',
  },
  { key: 'informationPageText', label: 'informationPageText', type: 'text', default: '<u>Test</u> Information <br> PageText', description: 'Text shown in the top half of the information page' },
  { key: 'lastQuestion', label: 'lastQuestion', type: 'checkbox', default: false, description: 'If true, the Renderer will start with the last question' },
  { key: 'locale', label: 'locale', type: 'select', default: 'de', values: ['de', 'en', 'es'], description: 'Language property of the component. Currently supported: [de, en, es]' },
  {
    key: 'mode',
    label: 'mode',
    type: 'select',
    default: 'full-questionnaire',
    values: ['full-questionnaire', 'stepper-questionnaire'],
    description: 'Current type of Questionnaire-Style to display. Available: stepper-questionnaire, grouped-questionnaire, full-questionnaire',
  },
  { key: 'primary', label: 'primary', type: 'text', default: '', description: 'Primary color' },
  { key: 'questionnaireResponseStatus', label: 'questionnaireResponseStatus', type: 'text', default: 'amended', description: 'If set, will change the status of the questionnaireResponse to the given string value' },
  { key: 'questionnaireUrl', label: 'questionnaireUrl', type: 'text', default: '', description: 'The Url to fetch the Questionnaire from' },
  {
    key: 'questionnaireUrlIdentifier',
    label: 'questionnaireUrlIdentifier',
    type: 'text',
    default: 'https://molit.eu/fhir/Questionnaire/qlq30',
    description: 'Canonical identifier for this questionnaire, represented as a URI. If provided will be used to fetch the questionnaire from the fhir server using the provided url (example: baseUrl/Questionnaire/1)',
  },
  { key: 'secondary', label: 'secondary', type: 'text', default: '', description: 'Secondary color' },
  { key: 'showOnlySummary', label: 'showOnlySummary', type: 'checkbox', default: false, description: 'If showOnlySummary is true, the questionnaire-renderer will only show the summary' },
  { key: 'showSummaryRemarks', label: 'showSummaryRemarks', type: 'checkbox', default: false, description: 'If true shows the remarks at the bottom of the summary' },
  { key: 'startQuestion', label: 'startQuestion', type: 'json', default: '', description: 'The question where in the list of questions the renderer should start. Expects the question as an object.' },
  {
    key: 'summaryText',
    label: 'summaryText',
    type: 'text',
    default: 'Ihre Antworten werden nachfolgend abgebildet. Über den Button unterhalb dieser Übersicht gelangen Sie direkt zur Auswertung des Fragebogens',
    description: 'The text shown in the top half of the Summary',
  },
  { key: 'trademarkText', label: 'trademarkText', type: 'text', default: 'Dont copy meeeeee', description: 'Shows a trademark/copyright text at the bottom of the renderer' },
  { key: 'vasSelectedValueLabel', label: 'vasSelectedValueLabel', type: 'text', default: '', description: 'Text for the label of the selected value' },
  { key: 'vasShowSelectedValue', label: 'vasShowSelectedValue', type: 'checkbox', default: true, description: 'If true shows the selected value for the vas scale' },
  { key: 'vasVertical', label: 'vasVertical', type: 'checkbox', default: true, description: 'Options for Visual Analog Scale' },
  { key: 'visibleBooleanNullOption', label: 'visibleBooleanNullOption', type: 'checkbox', default: true, description: "If true shows a third 'no Answer' option in boolean questions." },
];

@Component({
  tag: 'test-ui',
  styleUrl: 'test-ui.css',
  shadow: false,
  scoped: true,
})
export class TestUi {
  @State() rendererOptions: Record<string, any> = {};
  @State() questionnaireResponse: QuestionnaireResponse | null = null;
  @State() bundle: object | null = null;
  @State() show_renderer: boolean = false;
  @State() show_summary: boolean = false;
  lastQuestion: boolean = false;
  edit: boolean = false;
  indexQuestion: any = null;
  // baseUrl: string = 'https://fhir.molit.eu/fhir';
  @State() baseUrl: string = 'https://equ.molit-service.de/fhir';
  // @State() baseUrl: string = 'https://vitu-dev-app.molit-service.de/fhir';
  // baseUrl: string = 'https://dev.lion-app.de/fhir';
  // baseUrl: string = 'https://vitu-dev-app.molit-service.de/fhir';
  // questionnaireUrl: string = this.baseUrl + '/Questionnaire/56';
  @State() questionnaire: Questionnaire | null = null;
  questionnaires: Questionnaire[] = [vomit];
  @State() token: string | null = null;
  @State() selectedQuestionnaireIndex: string = '';
  @State() manualQuestionnaire: string = '';
  @State() manualTask: string = '';
  @State() manualPatient: string = '';
  @State() manualQuestionnaireResponse: string = '';
  @State() manualValueSets: string = '';
  @State() startError: string | null = null;
  @State() task: Task | null = null;
  questionnaireResponseInput: QuestionnaireResponse | null = null;
  valueSets: any[] | null = null;
  startQuestion: any = null;
  subject: any = null;
  defaultTask: any = null;

  /* computed */
  examplePatient(): typeof examplePatient {
    return examplePatient;
  }

  /* Lifecycle Methods */
  componentWillLoad(): void {
    for (const option of RENDERER_OPTIONS) {
      this.rendererOptions[option.key] = option.default;
    }
    this.loadSettings();
  }

  /* methods */
  loadSettings() {
    try {
      let stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored && typeof stored === 'object') {
        if (typeof stored.token === 'string') {
          this.token = stored.token;
        }
        if (typeof stored.baseUrl === 'string') {
          this.baseUrl = stored.baseUrl;
        }
        if (typeof stored.manualQuestionnaire === 'string') {
          this.manualQuestionnaire = stored.manualQuestionnaire;
        }
        if (typeof stored.manualTask === 'string') {
          this.manualTask = stored.manualTask;
        }
        if (typeof stored.manualPatient === 'string') {
          this.manualPatient = stored.manualPatient;
        }
        if (typeof stored.manualQuestionnaireResponse === 'string') {
          this.manualQuestionnaireResponse = stored.manualQuestionnaireResponse;
        }
        if (typeof stored.manualValueSets === 'string') {
          this.manualValueSets = stored.manualValueSets;
        }
        if (stored.rendererOptions && typeof stored.rendererOptions === 'object') {
          for (const option of RENDERER_OPTIONS) {
            let value = stored.rendererOptions[option.key];
            if (value !== undefined && typeof value === typeof option.default) {
              this.rendererOptions[option.key] = value;
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  persistSettings() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: this.token,
          baseUrl: this.baseUrl,
          manualQuestionnaire: this.manualQuestionnaire,
          manualTask: this.manualTask,
          manualPatient: this.manualPatient,
          manualQuestionnaireResponse: this.manualQuestionnaireResponse,
          manualValueSets: this.manualValueSets,
          rendererOptions: this.rendererOptions,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }
  getItemList(object: QuestionnaireResponse) {
    return questionnaireResponseController.createItemList(object);
  }
  updateQR(newqr: CustomEvent<any>) {
    this.questionnaireResponse = newqr.detail;
  }
  start() {
    this.startError = null;
    let questionnaire: Questionnaire | null = null;
    if (this.manualQuestionnaire.trim() !== '') {
      try {
        questionnaire = JSON.parse(this.manualQuestionnaire);
      } catch (error) {
        console.error(error);
        this.startError = 'The Questionnaire JSON is not valid';
        return;
      }
    } else if (this.selectedQuestionnaireIndex !== '') {
      questionnaire = this.questionnaires[Number(this.selectedQuestionnaireIndex)];
    }
    let task: Task = this.defaultTask;
    if (this.manualTask.trim() !== '') {
      try {
        task = JSON.parse(this.manualTask);
      } catch (error) {
        console.error(error);
        this.startError = 'The Task JSON is not valid';
        return;
      }
    }
    let subject: any = null;
    if (this.manualPatient.trim() !== '') {
      try {
        subject = JSON.parse(this.manualPatient);
      } catch (error) {
        console.error(error);
        this.startError = 'The Patient JSON is not valid';
        return;
      }
    }
    let valueSets: any[] | null = null;
    if (this.manualValueSets.trim() !== '') {
      try {
        valueSets = JSON.parse(this.manualValueSets);
      } catch (error) {
        console.error(error);
        this.startError = 'The ValueSets JSON is not valid';
        return;
      }
    }
    let startQuestion: any = null;
    if (this.rendererOptions.startQuestion.trim() !== '') {
      try {
        startQuestion = JSON.parse(this.rendererOptions.startQuestion);
      } catch (error) {
        console.error(error);
        this.startError = 'The StartQuestion JSON is not valid';
        return;
      }
    }
    let questionnaireResponse: QuestionnaireResponse | null = null;
    if (this.manualQuestionnaireResponse.trim() !== '') {
      try {
        questionnaireResponse = JSON.parse(this.manualQuestionnaireResponse);
      } catch (error) {
        console.error(error);
        this.startError = 'The QuestionnaireResponse JSON is not valid';
        return;
      }
    }
    if (!questionnaire && this.rendererOptions.questionnaireUrlIdentifier.trim() === '' && this.rendererOptions.questionnaireUrl.trim() === '') {
      this.startError = 'No questionnaire source: select a stored questionnaire, paste a Questionnaire JSON or set a Questionnaire Url';
      return;
    }
    this.questionnaire = questionnaire;
    this.task = task;
    this.subject = subject;
    this.valueSets = valueSets;
    this.startQuestion = startQuestion;
    this.questionnaireResponseInput = questionnaireResponse;
    this.show_summary = false;
    this.show_renderer = true;
  }
  editQuestion(question: any) {
    this.show_summary = false;
    this.edit = true;
    this.indexQuestion = question;
    this.lastQuestion = false;
    this.show_renderer = true;
  }
  toSummary(newQr: CustomEvent<any>) {
    this.questionnaireResponse = newQr.detail;
    this.show_renderer = false;
    this.edit = false;
    // this.index = null;
    this.show_summary = true;
    this.indexQuestion = null;
    this.lastQuestion = false;
  }
  backToRenderer() {
    this.show_summary = false;
    this.lastQuestion = true;
    this.show_renderer = true;
    this.edit = false;
    this.indexQuestion = null;
  }
  exitRenderer() {
    this.show_renderer = false;
    this.show_summary = false;
    this.lastQuestion = false;
  }
  reset() {
    this.show_renderer = false;
    this.show_summary = false;
    this.lastQuestion = false;
    this.edit = false;
    this.indexQuestion = null;
    this.questionnaire = null;
    this.task = null;
    this.questionnaireResponseInput = null;
    this.subject = null;
    this.valueSets = null;
    this.startQuestion = null;
    this.questionnaireResponse = null;
    this.bundle = null;
    this.startError = null;
  }

  handleTokenInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.token = input.value;
    this.persistSettings();
  };
  handleBaseUrlInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.baseUrl = input.value;
    this.persistSettings();
  };
  handleQuestionnaireSelect = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    this.selectedQuestionnaireIndex = select.value;
  };
  handleManualQuestionnaireInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    this.manualQuestionnaire = textarea.value;
    this.persistSettings();
  };
  handleManualTaskInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    this.manualTask = textarea.value;
    this.persistSettings();
  };
  handleManualPatientInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    this.manualPatient = textarea.value;
    this.persistSettings();
  };
  handleManualQuestionnaireResponseInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    this.manualQuestionnaireResponse = textarea.value;
    this.persistSettings();
  };
  handleManualValueSetsInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    this.manualValueSets = textarea.value;
    this.persistSettings();
  };
  handleOptionChange = (key: string) => (event: Event) => {
    const target = event.target as HTMLInputElement;
    let value: string | boolean = target.value;
    if (target.type === 'checkbox') {
      value = target.checked;
    }
    this.rendererOptions[key] = value;
    this.persistSettings();
  };
  initSelectValue = (el: HTMLElement | null, optionKey: string) => {
    if (el) {
      (el as HTMLSelectElement).value = String(this.rendererOptions[optionKey]);
    }
  };

  render() {
    return (
      <div>
        <div class="container-fluid">
          <div class="row" style={{ width: '100%' }}>
            <div class="col-sm-8">
              {/* QUESTIONNAIRE RENDERER */}
              <h5> QUESTIONNAIRE RENDERER</h5>
              <div>
                Token: <input type="text" style={{ 'min-width': '50%', 'margin': '0 0 10px 0' }} value={this.token} onInput={this.handleTokenInput} />
              </div>
              <div>
                Fhir Base Url: <input type="text" style={{ 'min-width': '50%', 'margin': '0 0 10px 0' }} value={this.baseUrl} onInput={this.handleBaseUrlInput}></input>
              </div>
              <div style={{ margin: '0 0 10px 0' }}>
                <div>Hinterlegte Fragebögen:</div>
                <select style={{ 'min-width': '50%' }} onChange={this.handleQuestionnaireSelect}>
                  <option value="">-- auswählen --</option>
                  {this.questionnaires.map((questionnaire, index) => (
                    <option value={index}>{questionnaire.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ margin: '0 0 10px 0' }}>
                <details open>
                  <summary>Renderer-Optionen</summary>
                  <div class="test-ui-options">
                    {RENDERER_OPTIONS.filter(option => option.type === 'select').map(option => (
                      <div style={{ margin: '10px 0 10px 0' }} data-tooltip={option.description}>
                        <div>{option.label}:</div>
                        <select style={{ 'min-width': '50%' }} ref={el => this.initSelectValue(el, option.key)} onChange={this.handleOptionChange(option.key)}>
                          {option.values.map(value => (
                            <option value={value}>{value}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <div class="test-ui-options-grid">
                      {RENDERER_OPTIONS.filter(option => option.type === 'checkbox').map(option => (
                        <label class="test-ui-option" data-tooltip={option.description}>
                          <input type="checkbox" checked={this.rendererOptions[option.key]} onChange={this.handleOptionChange(option.key)} /> {option.label}
                        </label>
                      ))}
                    </div>
                    {RENDERER_OPTIONS.filter(option => option.type === 'text').map(option => (
                      <div style={{ margin: '10px 0 10px 0' }} data-tooltip={option.description}>
                        {option.label}: <input type="text" style={{ 'min-width': '50%' }} value={this.rendererOptions[option.key]} onInput={this.handleOptionChange(option.key)} />
                      </div>
                    ))}
                    {RENDERER_OPTIONS.filter(option => option.type === 'json').map(option => (
                      <div style={{ margin: '10px 0 10px 0' }} data-tooltip={option.description}>
                        <div>{option.label} (JSON):</div>
                        <textarea rows={4} style={{ width: '100%' }} value={this.rendererOptions[option.key]} onInput={this.handleOptionChange(option.key)}></textarea>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
              <div style={{ margin: '0 0 10px 0' }}>
                <details open>
                  <summary>Manuelle Eingabe</summary>
                  <div class="test-ui-options">
                    <div>Questionnaire (JSON):</div>
                    <textarea rows={8} style={{ width: '100%', margin: '0 0 10px 0' }} value={this.manualQuestionnaire} onInput={this.handleManualQuestionnaireInput}></textarea>
                    <div>Task (JSON):</div>
                    <textarea rows={8} style={{ width: '100%', margin: '0 0 10px 0' }} value={this.manualTask} onInput={this.handleManualTaskInput}></textarea>
                    <div>Patient (JSON):</div>
                    <textarea rows={8} style={{ width: '100%', margin: '0 0 10px 0' }} value={this.manualPatient} onInput={this.handleManualPatientInput}></textarea>
                    <div>QuestionnaireResponse (JSON):</div>
                    <textarea rows={8} style={{ width: '100%', margin: '0 0 10px 0' }} value={this.manualQuestionnaireResponse} onInput={this.handleManualQuestionnaireResponseInput}></textarea>
                    <div>ValueSets (JSON):</div>
                    <textarea rows={8} style={{ width: '100%' }} value={this.manualValueSets} onInput={this.handleManualValueSetsInput}></textarea>
                  </div>
                </details>
              </div>
              {this.startError ? <div class="test-ui-error">{this.startError}</div> : null}
              <button style={{ margin: '0 0 10px 0' }} disabled={this.show_renderer} onClick={() => this.start()}>
                Start
              </button>
              <button style={{ margin: '0 0 10px 10px' }} disabled={!this.show_renderer && !this.show_summary} onClick={() => this.reset()}>
                Reset
              </button>

              {this.show_renderer ? (
                <questionnaire-renderer
                  onErrorLog={event => console.error(event.detail)}
                  onFinished={event => this.toSummary(event)}
                  onUpdated={event => this.updateQR(event)}
                  onUpdatedBundle={event => (this.bundle = event.detail)}
                  onExit={() => this.exitRenderer()}
                  trademarkText={this.rendererOptions.trademarkText || null}
                  enableInformationPage={this.rendererOptions.enableInformationPage}
                  informationPageText={this.rendererOptions.informationPageText || null}
                  questionnaireResponse={this.questionnaireResponseInput}
                  questionnaire={this.questionnaire}
                  questionnaireUrl={this.rendererOptions.questionnaireUrl || null}
                  baseUrl={this.baseUrl}
                  locale={this.rendererOptions.locale}
                  mode={this.rendererOptions.mode}
                  editMode={this.rendererOptions.editMode}
                  startQuestion={this.startQuestion}
                  enableFullQuestionnaireResponse={this.rendererOptions.enableFullQuestionnaireResponse}
                  enableSummary={this.rendererOptions.enableSummary}
                  enableReturn={this.rendererOptions.enableReturn}
                  subject={this.subject}
                  enableNext={this.rendererOptions.enableNext}
                  enableFinishButton={this.rendererOptions.enableFinishButton}
                  enableInformalLocale={this.rendererOptions.enableInformalLocale}
                  showOnlySummary={this.rendererOptions.showOnlySummary}
                  enableExpand={this.rendererOptions.enableExpand}
                  enableGroupDescription={this.rendererOptions.enableGroupDescription}
                  summaryText={this.rendererOptions.summaryText || null}
                  vasVertical={this.rendererOptions.vasVertical}
                  vasShowSelectedValue={this.rendererOptions.vasShowSelectedValue}
                  vasSelectedValueLabel={this.rendererOptions.vasSelectedValueLabel || null}
                  token={this.token}
                  enableErrorConsoleLogging={this.rendererOptions.enableErrorConsoleLogging}
                  questionnaireResponseStatus={this.rendererOptions.questionnaireResponseStatus || null}
                  visibleBooleanNullOption={this.rendererOptions.visibleBooleanNullOption}
                  questionnaireUrlIdentifier={this.rendererOptions.questionnaireUrlIdentifier || null}
                  task={this.task}
                  valueSets={this.valueSets}
                  lastQuestion={this.rendererOptions.lastQuestion}
                  showSummaryRemarks={this.rendererOptions.showSummaryRemarks}
                  enableSendQuestionnaireResponse={this.rendererOptions.enableSendQuestionnaireResponse}
                  enableVersioning={this.rendererOptions.enableVersioning}
                  basicAuth={this.rendererOptions.basicAuth}
                  primary={this.rendererOptions.primary || null}
                  secondary={this.rendererOptions.secondary || null}
                  danger={this.rendererOptions.danger || null}
                ></questionnaire-renderer>
              ) : null}
            </div>
            <div class="col-sm-4" style={{ 'backgroundColor': 'lightgrey', 'max-height': '100vh', 'overflow-y': 'auto' }}>
              <h5>Questionnaire Response</h5>
              <pre>
                <pre>{`${JSON.stringify(this.questionnaireResponse, null, 2)}`}</pre>
              </pre>

              <h5>Bundle</h5>

              <pre>{`${JSON.stringify(this.bundle, null, 2)}`}</pre>
            </div>
          </div>

          {this.show_summary ? (
            <div class="row">
              <div class="col-sm-4" style={{ backgroundColor: 'lightgrey', cursor: 'pointer' }}>
                <div onClick={() => this.backToRenderer()}>
                  <pre>{`${JSON.stringify(this.questionnaireResponse, null, 2)}`}</pre>
                </div>
              </div>
              <div class="col-sm-4" style={{ backgroundColor: 'lightgrey', cursor: 'pointer' }}>
                <div onClick={() => this.backToRenderer()}>
                  <pre>{`${JSON.stringify(this.questionnaire, null, 2)}`}</pre>
                </div>
              </div>
              <div class="col-sm-4">
                <div>
                  {this.getItemList(this.questionnaireResponse).map(item =>
                    item.hasOwnProperty('extension') && item.type === 'display' ? null : (
                      <div>
                        {item.text}
                        <div>
                          {item && !item.item ? (
                            <pre style={{ cursor: 'pointer' }} onClick={() => this.editQuestion(item)}>
                              {`${JSON.stringify(item.answer, null, 2)}`}
                            </pre>
                          ) : null}
                        </div>
                        <hr />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
