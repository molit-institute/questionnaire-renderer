import { Component, h, State } from '@stencil/core';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import * as examplePatient from '../../assets/fhir/resources/patient-example.js';
import enableQuestionnaire from '../../assets/fhir/resources/questionnaire-lang-enable.js';
import everyTypeQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type.js';
import everyTypeWithInitialQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type_with_initial.js';
import repeatedQuestionnaire from '../../assets/fhir/resources/questionnaire-repeat.js';
import qlq_c30 from '../../assets/fhir/resources/qlq-c30.js';
import q_5d_5l from '../../assets/fhir/resources/5q-5d-5l.js';
import vomit from '../../assets/fhir/resources/vomit.js';
import lion from '../../assets/fhir/resources/lion_questionnaire.js';
import dropdown_test from '../../assets/fhir/resources/dropdown_test_questionnaire.js';
// import lion_response from '../../assets/fhir/resources/lion_questionnaire_response2.js';
// import qlq30_response from '../../assets/fhir/resources/qlq30_response.js';

@Component({
  tag: 'test-ui',
  styleUrl: 'test-ui.css',
  shadow: false,
  scoped: true,
})
export class TestUi {
  @State() questionnaireMode: string = 'stepper-questionnaire';
  @State() questionnaireVariant: string = 'Touch';
  questionnaireResponse: any = null;
  @State() show_questionnaire_list: boolean = true;
  @State() show_renderer: boolean = false;
  @State() show_summary: boolean = false;
  lastQuestion: boolean = false;
  edit: boolean = false;
  indexQuestion: Object = null;
  // baseUrl: string = 'https://fhir.molit.eu/fhir';
  // baseUrl: string = 'https://equ.molit-service.de/fhir';
  // baseUrl: string = 'https://dev.lion-app.de/fhir';
  baseUrl: string = 'https://vitu-dev-app.molit-service.de/fhir';
  questionnaireUrl: string = this.baseUrl + '/Questionnaire/56';
  questionnaire: any = null;
  questionnaires: Array<any> = [enableQuestionnaire, everyTypeQuestionnaire, everyTypeWithInitialQuestionnaire, repeatedQuestionnaire, qlq_c30, q_5d_5l, vomit, lion, dropdown_test];
  token: string =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtTmZsdHEyMVhOd19Fdk1uQXlaX2E0Sjk5Zm5kX2JJbjY5NzljMGZNT0JRIn0.eyJleHAiOjE3MzcwMzE3MzQsImlhdCI6MTczNzAzMTEzNCwiYXV0aF90aW1lIjoxNzM3MDMwNTM0LCJqdGkiOiJlNjIyNDIwYi05OWE2LTQ2YzctODQ4OS1lYmJlNTQ0NjdmMDEiLCJpc3MiOiJodHRwczovL3ZpdHUtZGV2LWFwcC5tb2xpdC1zZXJ2aWNlLmRlL2F1dGgvcmVhbG1zL3ZpdHUtcmVhbG0iLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiNzEyNzU3ZGUtOWRhMC00MDRiLWJjYzAtYjlhMzJiNGVlODNhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidml0dS1hdXRoIiwic2lkIjoiNzQ2ZTIxMjgtMzRiYy00NDBkLWE4MzgtZDUyMGRjNmZiNzE4IiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3QqIiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaHR0cDovL2xvY2FsaG9zdDo0MTczIiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyIsImh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyIsImh0dHA6Ly9sb2NhbGhvc3Q6NTE3My8iLCJodHRwczovL3ZpdHUtZGV2LWFwcC5tb2xpdC1zZXJ2aWNlLmRlIiwiaHR0cDovL2xvY2FsaG9zdDo0MTczLyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidml0dS1jYXNlLW1hbmFnZXIiLCJkZWZhdWx0LXJvbGVzLXZpdHUtcmVhbG0iLCJ2aXR1LW1vZGVyYXRvciIsInZpdHUtdXNlciIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ2aXR1LWFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIiwidmlldy1ldmVudHMiLCJtYW5hZ2UtdXNlcnMiLCJ2aWV3LXVzZXJzIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiSmFuIFJvw58iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqYW4ucm9zc0Btb2xpdC1zZXJ2aWNlLmRlIiwiZ2l2ZW5fbmFtZSI6IkphbiIsImZhbWlseV9uYW1lIjoiUm_DnyIsInZpdHUtZ3JvdXAiOlsidGVzdDIzZXJkMjMiXSwiZW1haWwiOiJqYW4ucm9zc0Btb2xpdC1zZXJ2aWNlLmRlIn0.EYieUz6EEfus6Yvf2uE1dVZACw_0ROgc4Xl6aM7OVPdTc_Kwz1G-hNb6Nzod8NKZca5-R9BKx3DkP8uNrM4jVSuuLmxRmlA19Mxh75rInvskqRHA-n1EpdKQ8S_24Hyj4AFVkivuddV_bTBFsKbRaRHml2nPXOm1f_Pc-QB_4DqexbW05Gpdqxa1X5SOPdDqIQx6ZVxOfIr8QS_UzNOtC00CL_L6eEEdmzzAAiDu3s28Aq41kIRq4sE3hoF6jV0mxZ6TmaS98B37BmKzs3RLi0qf5U00YpnIenNEywcjLFXryrjmi4JtNxSljTc-HzH_lu-L4MCQW96SF_6qS8enow';
  testResp: object = null;
  /* computed */
  examplePatient() {
    return examplePatient;
  }

  /* methods */
  setQuestionnaireMode(selectedMode) {
    this.questionnaireMode = selectedMode;
  }
  setQuestionnaireVariant(selectedVariant) {
    this.questionnaireVariant = selectedVariant;
  }
  setQuestionnaireResponse(response) {
    this.questionnaireResponse = response;
  }
  openSelectedQuestionnaire(questionnaire) {
    this.questionnaire = questionnaire;
    this.show_renderer = true;
    this.show_questionnaire_list = false;
    this.show_summary = false;
  }
  getItemList(object) {
    return questionnaireResponseController.createItemList(object);
  }
  updateQR(newqr) {
    this.questionnaireResponse = newqr.detail;
  }
  editQuestion(question) {
    this.show_summary = false;
    this.edit = true;
    this.indexQuestion = question;
    this.lastQuestion = false;
    this.show_renderer = true;
  }
  toQuestionnaireList() {
    this.show_renderer = false;
    this.show_summary = false;
    this.show_questionnaire_list = true;
    this.lastQuestion = false;
  }
  toSummary(newQr) {
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
  render() {
    return (
      <div>
        <div class="container-fluid">
          {/* QUESTIONNAIRE RENDERER */}
          <div class="flex">
            <div onClick={() => this.setQuestionnaireMode('stepper-questionnaire')} class={this.questionnaireMode === 'stepper-questionnaire' ? 'item item-selected' : 'item'}>
              Stepper
            </div>
            <div onClick={() => this.setQuestionnaireMode('grouped-questionnaire')} class={this.questionnaireMode === 'grouped-questionnaire' ? 'item item-selected' : 'item'}>
              Grouped
            </div>
            <div onClick={() => this.setQuestionnaireMode('full-questionnaire')} class={this.questionnaireMode === 'full-questionnaire' ? 'item item-selected' : 'item'}>
              Full
            </div>
          </div>
          <div class="flex">
            <div onClick={() => this.setQuestionnaireVariant('Form')} class={this.questionnaireVariant === 'Form' ? 'item item-selected' : 'item'}>
              Form
            </div>
            <div onClick={() => this.setQuestionnaireVariant('Compact')} class={this.questionnaireVariant === 'Compact' ? 'item item-selected' : 'item'}>
              Compact
            </div>
            <div onClick={() => this.setQuestionnaireVariant('Touch')} class={this.questionnaireVariant === 'Touch' ? 'item item-selected' : 'item'}>
              Touch
            </div>
          </div>

          {this.show_questionnaire_list
            ? this.questionnaires.map(questionnaire => (
                <div onClick={() => this.openSelectedQuestionnaire(questionnaire)}>
                  <div class="padding">{questionnaire.title}</div>
                </div>
              ))
            : null}
          {this.show_renderer ? (
            <questionnaire-renderer
              onFinished={event => this.toSummary(event)}
              onUpdated={event => this.updateQR(event)}
              onExit={() => this.toQuestionnaireList()}
              trademarkText="Dont copy meeeeee"
              enableInformationPage={true}
              informationPageText="<u>Test</u> Information <br> PageText"
              // questionnaireResponse={this.questionnaireResponse}
              // questionnaireResponse={lion_response}
              questionnaireResponse={this.testResp}
              questionnaire={this.questionnaire}
              // questionnaireUrl={this.questionnaireUrl}
              baseUrl={this.baseUrl}
              // lastQuestion={this.lastQuestion}
              locale="de"
              // danger="red"
              mode={this.questionnaireMode}
              // editMode={this.edit}
              // startQuestion={this.indexQuestion}
              enableFullQuestionnaireResponse={false}
              enableSummary={true}
              enableReturn={false}
              enableNext={true}
              enableFinishButton={true}
              // variant={this.questionnaireVariant}
              enableInformalLocale={true}
              showOnlySummary={false}
              enableExpand={true}
              enableGroupDescription={false}
              summaryText="Ihre Antworten werden nachfolgend abgebildet. Über den Button unterhalb dieser Übersicht gelangen Sie direkt zur Auswertung des Fragebogens"
              vasVertical={true}
              vasShowSelectedValue={true}
              token={this.token}
              enableErrorConsoleLogging={true}
              questionnaireResponseStatus="amended"
              onErrorLog={error => console.info(error)}
              visibleBooleanNullOption={true}
            ></questionnaire-renderer>
          ) : null}
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
