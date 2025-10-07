import { Component, h, State } from '@stencil/core';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import * as examplePatient from '../../assets/fhir/resources/patient-example.js';
import enableQuestionnaire from '../../assets/fhir/resources/questionnaire-lang-enable.js';
import everyTypeQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type.js';
// import everyTypeWithInitialQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type_with_initial.js';
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
  // @State() baseUrl: string = 'https://equ.molit-service.de/fhir';
  @State() baseUrl: string = 'https://vitu-dev-app.molit-service.de/fhir';
  // baseUrl: string = 'https://dev.lion-app.de/fhir';
  // baseUrl: string = 'https://vitu-dev-app.molit-service.de/fhir';
  // questionnaireUrl: string = this.baseUrl + '/Questionnaire/56';
  questionnaireUrl: any = null;
  questionnaire: any = null;
  // @State() questionnaireUrlIdentifier: any = "https://molit.eu/fhir/Questionnaire/qlq30";
  @State() questionnaireUrlIdentifier: any = 'http://molit.eu/fhir/vitu/Questionnaire/vkh-questionnaire-tumorboard-lunge';
  questionnaires: Array<any> = [enableQuestionnaire, everyTypeQuestionnaire, repeatedQuestionnaire, qlq_c30, q_5d_5l, vomit, lion, dropdown_test];
  @State() token: string = null;
  // testResp: object = null;
  testResp: object = {
      "resourceType": "QuestionnaireResponse",
      "id": "58781",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2025-10-02T11:12:06.194+02:00"
      },
      "questionnaire": "http://molit.eu/fhir/vitu/Questionnaire/vkh-questionnaire-tumorboard-lunge",
      "status": "in-progress",
      "subject": {
        "reference": "Patient/37025",
        "display": "mi li"
      },
      "authored": "2025-10-02T11:08:37+02:00",
      "source": {
        "reference": "Patient/37025",
        "display": "mi li"
      },
      "item": [ {
        "linkId": "1",
        "text": "Diagnostik",
        "item": [ {
          "linkId": "1.1",
          "answer": [ {
            "valueCoding": {
              "code": "A2",
              "display": "Erstvorstellung (Verdachtsdiagnose)"
            }
          } ]
        }, {
          "linkId": "1.4",
          "text": "Diagnose",
          "answer": [ {
            "valueCoding": {
              "code": "C00.4",
              "display": "Bösartige Neubildung der Lippe|Unterlippe Innenseite"
            }
          }, {
            "valueCoding": {
              "code": "C00.8",
              "display": "Bösartige Neubildung der Lippe|Lippe mehrere Teilbereiche überlappend"
            }
          } ]
        }, {
          "linkId": "1.5",
          "text": "Nebendiagnose",
          "answer": [ {
            "valueCoding": {
              "code": "C00.2",
              "display": "Bösartige Neubildung der Lippe|Äußere Lippe nicht näher bezeichnet"
            }
          }, {
            "valueCoding": {
              "code": "C00.8",
              "display": "Bösartige Neubildung der Lippe|Lippe mehrere Teilbereiche überlappend"
            }
          }, {
            "valueCoding": {
              "code": "C01",
              "display": "Bösartige Neubildung des Zungengrundes"
            }
          } ]
        } ]
      }, {
        "linkId": "2",
        "text": "Anamnese",
        "item": [ {
          "linkId": "2.1",
          "text": "cTNM / pTNM",
          "answer": [ {
            "valueCoding": {
              "code": "A2",
              "display": "pTNM"
            }
          } ]
        }, {
          "linkId": "2.2",
          "text": "R-Status",
          "answer": [ {
            "valueCoding": {
              "code": "A2",
              "display": "R1"
            }
          } ]
        }, {
          "linkId": "2.3",
          "text": "Histologie/Pathologe (pTNM)",
          "item": [ {
            "linkId": "2.3.1",
            "text": "Histologie (1)",
            "answer": [ {
              "valueString": "test"
            } ]
          }, {
            "linkId": "2.3.2",
            "text": "Pathologe (1)",
            "answer": [ {
              "valueString": "test 2"
            } ]
          }, {
            "linkId": "2.3.3",
            "text": "Histologie (2)",
            "answer": [ {
              "valueString": "test 3"
            } ]
          }, {
            "linkId": "2.3.4",
            "text": "Pathologe (2)",
            "answer": [ {
              "valueString": "test 4"
            } ]
          }, {
            "linkId": "2.3.5",
            "text": "Histologie (3)",
            "answer": [ {
              "valueString": "test 5"
            } ]
          }, {
            "linkId": "2.3.6",
            "text": "Pathologe (3)",
            "answer": [ {
              "valueString": "test 6"
            } ]
          } ]
        }, {
          "linkId": "2.4",
          "text": "Tumorgröße (cm)",
          "answer": [ {
            "valueString": "22"
          } ]
        }, {
          "linkId": "2.13",
          "text": "TNM T-Wert",
          "answer": [ {
            "valueCoding": {
              "code": "T1",
              "display": "T1"
            }
          } ]
        }, {
          "linkId": "2.14",
          "text": "TNM N-Wert",
          "answer": [ {
            "valueCoding": {
              "code": "N1",
              "display": "N1"
            }
          } ]
        }, {
          "linkId": "2.14.1",
          "text": "Metastasen-Anzahl, betroffene Organe"
        }, {
          "linkId": "2.15",
          "text": "TNM M-Wert",
          "answer": [ {
            "valueCoding": {
              "code": "M0",
              "display": "M0"
            }
          } ]
        }, {
          "linkId": "2.16",
          "text": "UICC-Stadium",
          "answer": [ {
            "valueCoding": {
              "system": "http://molit.eu/fhir/vitu/CodeSystem/vkh-uicc-extension",
              "version": "0.1.12",
              "code": "IB/IIA",
              "display": "IB/IIA"
            }
          } ]
        }, {
          "linkId": "2.16.1",
          "text": "Genutztes Bildgebungsverfahren",
          "answer": [ {
            "valueString": "Handy"
          } ]
        }, {
          "linkId": "2.5",
          "text": "ECOG-Stadium",
          "answer": [ {
            "valueCoding": {
              "code": "LA9624-3",
              "display": "ECOG 2: (Gehfähig, Selbstversorgung möglich, aber nicht arbeitsfähig; kann mehr als 50% der Wachzeit aufstehen)"
            }
          } ]
        }, {
          "linkId": "2.6",
          "text": "Raucher?",
          "answer": [ {
            "valueBoolean": true
          } ]
        }, {
          "linkId": "2.9",
          "text": "Packyears",
          "answer": [ {
            "valueString": "2"
          } ]
        }, {
          "linkId": "2.10",
          "text": "Fall in der Familie?",
          "answer": [ {
            "valueBoolean": true
          } ]
        }, {
          "linkId": "2.11",
          "text": "Fallbeschreibung",
          "answer": [ {
            "valueString": "Hunger"
          } ]
        }, {
          "linkId": "2.12",
          "text": "Sonstiges",
          "answer": [ {
            "valueString": "Nüchts"
          } ]
        } ]
      }, {
        "linkId": "3",
        "text": "Befund",
        "item": [ {
          "linkId": "3.1",
          "text": "Bildgebende Diagnostik",
          "answer": [ {
            "valueCoding": {
              "code": "A1",
              "display": "Radiologische Diagnostik / Nuklearmedizin"
            }
          }, {
            "valueCoding": {
              "code": "A6",
              "display": "PetCT"
            }
          }, {
            "valueCoding": {
              "code": "A3",
              "display": "CT"
            }
          } ]
        }, {
          "linkId": "3.2",
          "text": "Radiobefund",
          "answer": [ {
            "valueString": "nüchts da"
          } ]
        }, {
          "linkId": "3.4",
          "text": "CT-Befund",
          "answer": [ {
            "valueString": "wieder nüchts"
          } ]
        }, {
          "linkId": "3.7",
          "text": "PET-CT-Befund",
          "answer": [ {
            "valueString": "nope"
          } ]
        }, {
          "linkId": "3.10",
          "text": "Endo-Bronchiale Diagnostik",
          "answer": [ {
            "valueBoolean": false
          } ]
        }, {
          "linkId": "3.12",
          "text": "Biopsie",
          "answer": [ {
            "valueBoolean": true
          } ]
        }, {
          "linkId": "3.13",
          "text": "Endo-Brochoskopie",
          "answer": [ {
            "valueBoolean": true
          } ]
        }, {
          "linkId": "3.14",
          "text": "Lungenfunktions-Diagnostik",
          "answer": [ {
            "valueBoolean": true
          } ]
        }, {
          "linkId": "3.15",
          "text": "VC (ml)",
          "answer": [ {
            "valueString": "33"
          } ]
        }, {
          "linkId": "3.16",
          "text": "FEV1 (ml)",
          "answer": [ {
            "valueString": "11"
          } ]
        }, {
          "linkId": "3.17",
          "text": "Post-Op FEV1 (ml)",
          "answer": [ {
            "valueString": "55"
          } ]
        }, {
          "linkId": "3.18",
          "text": "Labor-Diagnostik",
          "answer": [ {
            "valueBoolean": true
          } ]
        }, {
          "linkId": "3.19",
          "text": "Labor-Befund",
          "answer": [ {
            "valueString": "Tolle streifen"
          } ]
        }, {
          "linkId": "3.20",
          "text": "Blutgruppe",
          "answer": [ {
            "valueCoding": {
              "code": "A2",
              "display": "A Rhesus negativ"
            }
          } ]
        }, {
          "linkId": "3.21",
          "text": "Molekular-Diagnostik"
        } ]
      }, {
        "linkId": "4",
        "text": "Tumorboardempfehlung",
        "item": [ {
          "linkId": "4.1",
          "text": "Empfehlung:",
          "answer": [ {
            "valueString": "Mehr Sonnencreme"
          } ]
        }, {
          "linkId": "4.2",
          "text": "Therapieempfehlung:",
          "answer": [ {
            "valueCoding": {
              "code": "A2",
              "display": "systematische Therapie"
            }
          }, {
            "valueCoding": {
              "code": "A3",
              "display": "Strahlentherapie"
            }
          } ]
        }, {
          "linkId": "4.4",
          "text": "systemische Therapie (Details)",
          "answer": [ {
            "valueString": "touch more grass"
          } ]
        }, {
          "linkId": "4.5",
          "text": "Strahlentherapie (Details)",
          "answer": [ {
            "valueString": "Sonnenbestrahlung"
          } ]
        }, {
          "linkId": "4.6",
          "text": "Primärfall",
          "answer": [ {
            "valueBoolean": false
          } ]
        }, {
          "linkId": "4.7",
          "text": "Leitliniengerechte Entscheidung",
          "answer": [ {
            "valueBoolean": true
          } ]
        }, {
          "linkId": "4.10",
          "text": "Bitte Quelle angeben: Link zur Leitlinie einfügen",
          "answer": [ {
            "valueUri": "https://heute.de/linkender/link"
          } ]
        }, {
          "linkId": "4.8",
          "text": "Dissensentscheidung",
          "answer": [ {
            "valueBoolean": false
          } ]
        } ]
      } ]
    };
  /* computed */
  examplePatient() {
    return examplePatient;
  }
  task: any = {
    resourceType: 'Task',
    meta: {
      tag: [
        {
          code: 'pre-OP',
          display: 'vor OP',
        },
      ],
    },
    status: 'active',
    intent: 'order',
    code: {
      coding: [
        {
          system: 'http://molit.eu/fhir/CodeSystem/taskTypes',
          code: 'eQuestionnaire',
          display: 'eQU Questionnaire',
        },
      ],
      text: 'PatientQuestionnaireTask',
    },
    focus: {
      reference: 'Questionnaire/1',
      display: 'QLQ-C30',
    },
    for: {
      reference: 'Patient/14',
      display: 'Maier, Peter',
    },
    executionPeriod: {
      start: '2026-10-25',
      end: '2026-10-25',
    },
  };

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
  startQuestionnaire() {
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

  handleTokenInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.token = input.value;
  };

  handleUrlInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.questionnaireUrlIdentifier = input.value;
  };
  handleBaseUrlInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.baseUrl = input.value;
  };

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
          <br />
          <div>
            Token: <input type="text" style={{ 'min-width': '50%', 'margin': '0 0 10px 0' }} value={this.token} onInput={this.handleTokenInput} />
          </div>
          <div>
            Questionnaire Url: <input type="text" style={{ 'min-width': '50%', 'margin': '0 0 10px 0' }} value={this.questionnaireUrlIdentifier} onInput={this.handleUrlInput}></input>
          </div>
          <div>
            Fhir Base Url: <input type="text" style={{ 'min-width': '50%' }} value={this.baseUrl} onInput={this.handleBaseUrlInput}></input>
          </div>
          <br />
          <button onClick={() => this.startQuestionnaire()}>Start via Url</button>
          <br />
          <br />
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
              // enableNext={false}
              // enableFinishButton={true}
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
              questionnaireUrlIdentifier={this.questionnaireUrlIdentifier}
              task={this.task}
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
