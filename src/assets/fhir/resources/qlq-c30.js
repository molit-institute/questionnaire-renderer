const qlq_c30={
    resourceType: 'Questionnaire',
    id: '979',
    meta: {
      versionId: "1",
      lastUpdated: "2020-07-02T14:24:48.075+02:00",
      source: "#jp97iWZiYyrtZCLy"
    },
    identifier: [ {
      system: "eu.molit.questionic",
      value: "eortc_qlq-30-long"
    } ],
    title: "QLQ-C30",
    status: "active",
    subjectType: [ "Patient" ],
    date: "2017-08-23T00:00:00+02:00",
    publisher: "EORTC",
    description: "Der QLQ-C30 ist ein Fragebogen welcher entwickelt wurde um die Lebensqualität von Krebs-Patienten zu bewerten.",
    item: [ {
      linkId: "1",
      prefix: "1. ",
      text: "Bereitet es Ihnen Schwierigkeiten sich körperlich anzustrengen? (z.B. eine schwere Einkaufsstasche oder einen Koffer zu tragen)",
      type: "choice",
      required: true,
      answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
    }, {
      linkId: "2",
      prefix: "2. ",
      text: "Bereitet es Ihnen Schwierigkeiten, einen längeren Spaziergang zu machen?",
      type: "choice",
      required: true,
      answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
    }, {
      linkId: "3",
      prefix: "3. ",
      text: "Bereitet es Ihnen Schwierigkeiten , eine kurze Strecke außer Haus zu gehen?",
      type: "choice",
      required: true,
      answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
    }, {
      linkId: "4",
      prefix: "4. ",
      text: "Müssen Sie tagsüber im Bett liegen oder in einem Sessel sitzen?",
      type: "choice",
      required: true,
      answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
    }, {
      linkId: "5",
      prefix: "5. ",
      text: "Brauchen Sie Hilfe beim Essen, Anziehen, Waschen oder Benutzen der Toilette?",
      type: "choice",
      required: true,
      answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
    }, {
      linkId: "6",
      text: "Während der letzten Woche:",
      type: "group",
      item: [ {
        linkId: "6.1",
        prefix: "6. ",
        text: "Waren Sie bei Ihrer Arbeit oder bei anderen tagtäglichen Beschäftigungen eingeschränkt?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.2",
        prefix: "7. ",
        text: "Waren Sie bei Ihren Hobbys oder anderen Freizeitbeschäftigungen eingeschränkt?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.3",
        prefix: "8. ",
        text: "Waren Sie kurzatmig?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.4",
        prefix: "9. ",
        text: "Hatten Sie Schmerzen?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.5",
        prefix: "10. ",
        text: "Mussten Sie sich ausruhen?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.6",
        prefix: "11. ",
        text: "Hatten Sie Schlafstörungen?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.7",
        prefix: "12. ",
        text: "Fühlten Sie sich schwach?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.8",
        prefix: "13. ",
        text: "Hatten Sie Appetitmangel?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.9",
        prefix: "14. ",
        text: "War Ihnen übel?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.10",
        prefix: "15. ",
        text: "Haben Sie erbrochen?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.11",
        prefix: "16. ",
        text: "Hatten Sie Verstopfung?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.12",
        prefix: "17. ",
        text: "Hatten Sie Durchfall?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.13",
        prefix: "18. ",
        text: "Waren Sie müde?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.14",
        prefix: "19. ",
        text: "Fühlten Sie sich durch Schmerzen in Ihrem alltäglichen Leben beeinträchtigt?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.15",
        prefix: "20. ",
        text: "Hatten Sie Schwierigkeiten sich auf etwas zu konzentrieren, z.B auf das Zeitungslesen oder das Fernsehen?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.16",
        prefix: "21. ",
        text: "Fühlten Sie sich angespannt?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.17",
        prefix: "22. ",
        text: "Haben Sie sich Sorgen gemacht?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.18",
        prefix: "23. ",
        text: "Waren Sie reizbar?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.19",
        prefix: "24. ",
        text: "Fühlten Sie sich niedergeschlagen?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.20",
        prefix: "25. ",
        text: "Hatten Sie Schwierigkeiten, sich an Dinge zu erinnern?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.21",
        prefix: "26. ",
        text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Familienleben beeinträchtigt?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.22",
        prefix: "27. ",
        text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Zusammensein oder Ihre gemeinsamen Unternehmungen mit anderen Menschen beeinträchtigt?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      }, {
        linkId: "6.23",
        prefix: "28. ",
        text: "Hat Ihr körperlicher Zustand oder Ihre medizinische behandlung für Sie finanzielle Schwierigkeiten mit sich gebracht?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
      } ]
    }, {
      linkId: "7",
      text: "Bitte wählen Sie bei den folgenden Fragen die Zahl zwischen 1 und 7 an die am besten auf Sie zutrifft",
      type: "group",
      item: [ {
       linkId: "7.1",
        prefix: "29. ",
        text: "Wie würden Sie insgesamt Ihren Gesundheitszustand  während der letzten Woche einschätzen?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers7"
      }, {
        linkId: "7.2",
        prefix: "30. ",
        text: "Was würden Sie insgesamt Ihre Lebensqualität während der letzten Woche einschatzen?",
        type: "choice",
        required: true,
        answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers7"
      } ]
    } ]
}

export default qlq_c30;