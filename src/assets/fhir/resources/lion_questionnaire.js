const lion_questionnaire = {
    resourceType: "Questionnaire",
    id: "lionQuestionnaire",
    title: "Fragen zu Ihrem Gesundheitszustand",
    status: "draft",
    subjectType: ["Patient"],
    description: "Bitte beantworten Sie folgende Frage(n), damit wir Ihre Gesundheit besser einschätzen können.",
    item: [
        {
            linkId: "0.1",
            text: "Fragebogen bedingte Fragen anzeigen?",
            type: "boolean",
            required: true,
            extension: [
                {
                    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                    hidden: true
                }
            ]
        },
        {
            linkId: "0.2",
            text: "Fragebogen Gewichtszunahme anzeigen?",
            type: "boolean",
            required: true,
            extension: [
                {
                    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                    hidden: true
                }
            ]
        },
        {
            linkId: "0.3",
            text: "Fragebogen Gewichtsabnahme anzeigen?",
            type: "boolean",
            required: true,
            extension: [
                {
                    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                    hidden: true
                }
            ]
        },
        {
            linkId: "0.4",
            text: "Fragebogen für randomisierte Fragen anzeigen?",
            type: "boolean",
            required: true,
            extension: [
                {
                    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                    hidden: true
                }
            ]
        },
        {
            linkId: "1",
            text: "Bedingte Fragen",
            type: "group",
            enableWhen: [
                {
                    question: "0.1",
                    operator: "=",
                    answerBoolean: true
                }
            ],
            item: [
                {
                    linkId: "1.1",
                    text: "Bedingte Fragen für Bewegung anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.2",
                    text: "Bedingte Fragen für Belastungen anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.3",
                    text: "Bedingte Fragen für Konzentrationsprobleme anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.4",
                    text: "Bedingte Fragen für Schlafqualität anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.5",
                    text: "Bedingte Fragen für Erschöpfung anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.6",
                    text: "Bedingte Fragen für Übelkeit anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.7",
                    text: "Bedingte Fragen für Erbrechen anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.8",
                    text: "Bedingte Fragen für Schmerz anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.9",
                    text: "Bedingte Fragen für Kurzatmigkeit anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.10",
                    text: "Bedingte Fragen für Appetitveränderung anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.11",
                    text: "Bedingte Fragen für Verstopfung anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.12",
                    text: "Bedingte Fragen für Durchfall anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "1.1.1",
                    text: "Bedingte Fragen zur Bewegung",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.1",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.1.1.1",
                            text: "Bereitet es Ihnen Schwierigkeiten sich körperlich anzustrengen? (z.B. eine schwere Einkaufsstasche oder einen Koffer zu tragen)",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.1.1.2",
                            text: "Bereitet es Ihnen Schwierigkeiten, einen längeren Spaziergang zu machen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.1.1.3",
                            text: "Bereitet es Ihnen Schwierigkeiten , eine kurze Strecke außer Haus zu gehen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.1.1.4",
                            text: "Müssen Sie tagsüber im Bett liegen oder in einem Sessel sitzen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.1.1.5",
                            text: "Brauchen Sie Hilfe beim Essen, Anziehen, Waschen oder Benutzen der Toilette?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        }
                    ]
                },
                {
                    linkId: "1.2.1",
                    text: "Bedingte Fragen zur Belastung. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.2",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.2.1.1",
                            text: "Fühlten Sie sich angespannt?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.2.1.2",
                            text: "Haben Sie sich Sorgen gemacht?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.2.1.3",
                            text: "Waren Sie reizbar?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.2.1.4",
                            text: "Fühlten Sie sich niedergeschlagen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.2.1.5",
                            text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Familienleben beeinträchtigt?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.2.1.6",
                            text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Zusammensein oder Ihre gemeinsamen Unternehmungen mit anderen Menschen beeinträchtigt?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        }
                    ]
                },
                {
                    linkId: "1.3.1",
                    text: "Bedingte Fragen zu Konzentrationsproblemen. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.3",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.3.1.1",
                            text: "Hatten Sie Schwierigkeiten sich auf etwas zu konzentrieren, z.B auf das Zeitungslesen oder das Fernsehen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.3.1.2",
                            text: "Hatten Sie Schwierigkeiten, sich an Dinge zu erinnern?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        }
                    ]
                },
                {
                    linkId: "1.4.1",
                    text: "Bedingte Fragen zur Schlafqualität. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.4",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.4.1.1",
                            text: "Hatten Sie Schlafstörungen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                    ]
                },
                {
                    linkId: "1.5.1",
                    text: "Bedingte Fragen zu Erschöpfung. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.5",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.5.1.1",
                            text: "Mussten Sie sich ausruhen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.5.1.2",
                            text: "Fühlten Sie sich schwach?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.5.1.3",
                            text: "Waren Sie müde?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                    ]
                },
                {
                    linkId: "1.6.1",
                    text: "Bedingte Fragen zu Übelkeit. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.6",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.6.1.1",
                            text: "War Ihnen übel?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                    ]
                },
                {
                    linkId: "1.7.1",
                    text: "Bedingte Fragen zu Erbrechen. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.7",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.7.1.1",
                            text: "Haben Sie erbrochen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                    ]
                },
                {
                    linkId: "1.8.1",
                    text: "Bedingte Fragen zu Schmerzen. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.8",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.8.1.1",
                            text: "Hatten Sie Schmerzen?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                        {
                            linkId: "1.8.1.2",
                            text: "Fühlten Sie sich durch Schmerzen in Ihrem alltäglichen Leben beeinträchtigt?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        }
                    ]
                },
                {
                    linkId: "1.9.1",
                    text: "Bedingte Fragen zu Kurzatmigkeit. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.9",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.9.1.1",
                            text: "Waren Sie kurzatmig?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                    ]
                },
                {
                    linkId: "1.10.1",
                    text: "Bedingte Fragen zu Appetitveränderung. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.10",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.10.1.1",
                            text: "Hatten Sie Appetitmangel?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                    ]
                },
                {
                    linkId: "1.11.1",
                    text: "Bedingte Fragen zu Verstopfung. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.11",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.11.1.1",
                            text: "Hatten Sie Verstopfung?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                    ]
                },
                {
                    linkId: "1.12.1",
                    text: "Bedingte Fragen zu Durchfall. Während der letzten Woche: ",
                    type: "group",
                    enableWhen: [
                        {
                            question: "1.12",
                            operator: "=",
                            answerBoolean: true
                        }
                    ],
                    item: [
                        {
                            linkId: "1.12.1.1",
                            text: "Hatten Sie Durchfall?",
                            type: "choice",
                            required: true,
                            answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs"
                        },
                    ]
                }
            ]
        },
        {
            linkId: "2",
            text: "Gewichtszunahme",
            type: "group",
            enableWhen: [
                {
                    question: "0.2",
                    operator: "=",
                    answerBoolean: true
                }
            ],
            item: [
                {
                    linkId: "2.1",
                    text: "Bedingte Fragen für Bewegung anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "2.2",
                    text: "Bedingte Fragen für emotionale Belastung anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "2.3",
                    text: "Bedingte Fragen für Schmerzen anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "2.1.1",
                    text: "Fragen zur Bewegung",
                    type: "group",
                    enableWhen: [
                        {
                            question: "2.1",
                            operator: "=",
                            answerBoolean: true,
                        }
                    ],
                    item: [
                        {
                            linkId: "2.1.1.1",
                            text: "Beeinflusst deine Erkrankung deine tägliche Bewegung?",
                            type: "boolean",
                            required: true,
                        },
                        {
                            linkId: "2.1.1.2",
                            text: "Weiterführende Fragen zum Thema Bewegung",
                            type: "group",
                            enableWhen: [
                                {
                                    question: "2.1.1.1",
                                    operator: "=",
                                    answerBoolean: true,
                                }
                            ],
                            item: [
                                {
                                    linkId: "2.1.1.2.1",
                                    text: "Bereitet es Ihnen Schwierigkeiten sich körperlich anzustrengen (z.B. eine schwere Einkaufstasche oder einen Koffer zu tragen?)",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                                {
                                    linkId: "2.1.1.2.2",
                                    text: "Bereitet es Ihnen Schwierigkeiten, einen längeren Spaziergang zu machen?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                                {
                                    linkId: "2.1.1.2.3",
                                    text: "Bereitet es Ihnen Schwierigkeiten, eine kurze Strecke außer Haus zu gehen?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                                {
                                    linkId: "2.1.1.2.4",
                                    text: "Müssen Sie tagsüber im Bett liegen oder im Sessel sitzen?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                                {
                                    linkId: "2.1.1.2.5",
                                    text: "Brauchen Sie Hilfe beim Essen, Anziehen, Waschen oder Benutzen der Toilette?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                            ]
                        },
                    ]
                },
                {
                    linkId: "2.2.1",
                    text: "Fragen zur emotionalen Belastung",
                    type: "group",
                    enableWhen: [
                        {
                            question: "2.2",
                            operator: "=",
                            answerBoolean: true,
                        }
                    ],
                    item: [
                        {
                            linkId: "2.2.1.1",
                            text: "Belastet Dich Deine Erkrankung emotional?",
                            type: "boolean",
                            required: true,
                        },
                        {
                            linkId: "2.2.1.2",
                            text: "Während der letzten Woche",
                            type: "group",
                            enableWhen: [
                                {
                                    question: "2.2.1.1",
                                    operator: "=",
                                    answerBoolean: true,
                                }
                            ],
                            item: [
                                {
                                    linkId: "2.2.1.2.1",
                                    text: "Fühlten Sie sich angespannt?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",

                                },
                                {
                                    linkId: "2.2.1.2.2",
                                    text: "Haben Sie sich Sorgen gemacht?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                                {
                                    linkId: "2.2.1.2.3",
                                    text: "Waren Sie reizbar?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                                {
                                    linkId: "2.2.1.2.4",
                                    text: "Fühlten Sie sich niedergeschlagen?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                                {
                                    linkId: "2.2.1.2.5",
                                    text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Familienleben beeinträchtigt?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                                {
                                    linkId: "2.2.1.2.6",
                                    text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Zusammensein oder Ihre gemeinsamen Unternehmungen mit anderen Menschen beeinträchtigt?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                            ]
                        },
                    ]
                },
                {
                    linkId: "2.3.1",
                    text: "Fragen zu Schmerzen",
                    type: "group",
                    enableWhen: [
                        {
                            question: "2.3",
                            operator: "=",
                            answerBoolean: true,
                        }
                    ],
                    item: [
                        {
                            linkId: "2.3.1.1",
                            text: "Leidest Du aufgrund Deiner Erkrankung an Schmerzen?",
                            type: "boolean",
                            required: true,
                        },
                        {
                            linkId: "2.3.1.2",
                            text: "Während der letzten Woche",
                            type: "group",
                            enableWhen: [
                                {
                                    question: "2.3.1.1",
                                    operator: "=",
                                    answerBoolean: true,
                                }
                            ],
                            item: [
                                {
                                    linkId: "2.3.1.2.1",
                                    text: "Hatten Sie Schmerzen?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",

                                },
                                {
                                    linkId: "2.3.1.2.1",
                                    text: "Fühlten Sie sich durch Ihre Schmerzen in Ihrem alltäglichen Leben beeinträchtigt?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        {
            linkId: "3",
            text: "Gewichtsabnahme",
            type: "group",
            enableWhen: [
                {
                    question: "0.3",
                    operator: "=",
                    answerBoolean: true
                }
            ],
            item: [
                {
                    linkId: "3.1",
                    text: "Bedingte Fragen für Appetitlosigkeit anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "3.2",
                    text: "Bedingte Fragen für Durchfall anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "3.3",
                    text: "Bedingte Fragen für Erbrechen anzeigen?",
                    type: "boolean",
                    required: true,
                    extension: [
                        {
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
                            hidden: true
                        }
                    ],
                },
                {
                    linkId: "3.1.1",
                    text: "Fragen zur Appetitlosigkeit",
                    type: "group",
                    enableWhen: [
                        {
                            question: "3.1",
                            operator: "=",
                            answerBoolean: true,
                        }
                    ],
                    item: [
                        {
                            linkId: "3.1.1.1",
                            text: "Leidest Du aufgrund Deiner Erkrankung an Appetitmangel?",
                            type: "boolean",
                            required: true,
                        },
                        {
                            linkId: "3.1.1.2",
                            text: "Während der letzten Woche",
                            type: "group",
                            enableWhen: [
                                {
                                    question: "3.1.1.1",
                                    operator: "=",
                                    answerBoolean: true,
                                }
                            ],
                            item: [
                                {
                                    linkId: "3.1.1.2.1",
                                    text: "Hatten Sie Appetitmangel?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                            ]
                        },
                    ]
                },
                {
                    linkId: "3.2.1",
                    text: "Fragen zu Durchfall",
                    type: "group",
                    enableWhen: [
                        {
                            question: "3.2",
                            operator: "=",
                            answerBoolean: true,
                        }
                    ],
                    item: [
                        {
                            linkId: "3.2.1.1",
                            text: "Leidest Du aufgrund Deiner Erkrankung unter Durchfall?",
                            type: "boolean",
                            required: true,
                        },
                        {
                            linkId: "3.2.1.2",
                            text: "Während der letzten Woche",
                            type: "group",
                            enableWhen: [
                                {
                                    question: "3.2.1.1",
                                    operator: "=",
                                    answerBoolean: true,
                                }
                            ],
                            item: [
                                {
                                    linkId: "3.2.1.2.1",
                                    text: "Hatten Sie Durchfall?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                            ]
                        }
                    ]
                },
                {
                    linkId: "3.3.1",
                    text: "Fragen zu Erbrechen",
                    type: "group",
                    enableWhen: [
                        {
                            question: "3.3",
                            operator: "=",
                            answerBoolean: true,
                        }
                    ],
                    item: [
                        {
                            linkId: "3.3.1.1",
                            text: "Leidest Du aufgrund Deiner Erkrankung an Erbrechen?",
                            type: "boolean",
                            required: true,
                        },
                        {
                            linkId: "3.3.1.2",
                            text: "Während der letzten Woche",
                            type: "group",
                            enableWhen: [
                                {
                                    question: "3.3.1.1",
                                    operator: "=",
                                    answerBoolean: true,
                                }
                            ],
                            item: [
                                {
                                    linkId: "3.3.1.2.1",
                                    text: "Haben Sie erbrochen?",
                                    type: "choice",
                                    required: true,
                                    answerValueSet: "http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs",
                                },
                            ]
                        }
                    ]
                },
            ]
        },
        {
            linkId: "4",
            text: "Randomisierte Fragen",
            type: "group",
            enableWhen: [
                {
                    question: "0.4",
                    operator: "=",
                    answerBoolean: true
                }
            ],
            item: [

            ]
        }
    ]
};
export default lion_questionnaire