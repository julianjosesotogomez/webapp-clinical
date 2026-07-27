/**
 * Static label map for the intake questionnaire (v2.0), mirroring
 * `leads-clinical-ai/app/agent/questionnaire.py`. Lets this app render the
 * answers JSONB legibly WITHOUT calling the Python service. If the Python
 * questionnaire changes, update this map to match.
 */

interface QuestionMeta {
  label: string;
  options?: Record<string, string>;
}

const QUESTIONS: Record<string, QuestionMeta> = {
  red_flags: {
    label: "Síntomas de alarma actuales",
    options: {
      dolor_pecho: "Dolor intenso en el pecho",
      dificultad_respiratoria: "Dificultad importante para respirar",
      perdida_conciencia: "Pérdida del conocimiento reciente",
      deficit_neurologico:
        "Debilidad de un lado, dificultad para hablar o convulsiones",
      cefalea_subita: "Dolor de cabeza súbito e intenso",
      sangrado_abundante: "Sangrado abundante",
      ictericia: "Color amarillo en piel u ojos con malestar",
      ninguno: "Ninguno",
    },
  },
  age: { label: "Edad" },
  weight_kg: { label: "Peso (kg)" },
  height_cm: { label: "Estatura (cm)" },
  main_goal: {
    label: "Motivo principal de consulta",
    options: {
      bajar_de_peso: "Bajar de peso",
      salud_hormonal: "Mejorar salud hormonal",
      manejar_enfermedad: "Manejo de enfermedad crónica",
      prevencion: "Valoración preventiva / salud general",
    },
  },
  weight_desire: {
    label: "¿Desea bajar de peso?",
    options: { si: "Sí", no: "No" },
  },
  weight_history: {
    label: "Comportamiento reciente del peso",
    options: {
      aumento: "Ha aumentado progresivamente",
      dificultad: "Le cuesta bajarlo aunque lo intenta",
      estable: "Se mantiene estable",
      baja: "Ha bajado",
    },
  },
  metabolic_dx: {
    label: "Diagnósticos metabólicos",
    options: {
      resistencia_insulina: "Resistencia a la insulina",
      prediabetes: "Prediabetes",
      diabetes2: "Diabetes tipo 2",
      dislipidemia: "Colesterol o triglicéridos altos",
      hipertension: "Hipertensión",
      apnea: "Apnea del sueño",
      higado_graso: "Hígado graso",
      ninguna: "Ninguna",
    },
  },
  weight_meds_interest: {
    label: "¿Interés en tratamiento médico para bajar de peso?",
    options: { si: "Sí", no: "No", no_conozco: "No los conoce" },
  },
  thyroid_dx: {
    label: "Enfermedad tiroidea",
    options: {
      hipotiroidismo: "Hipotiroidismo",
      hipertiroidismo: "Hipertiroidismo",
      otra: "Otra enfermedad tiroidea",
      ninguna: "Ninguna",
    },
  },
  female_dx: {
    label: "Situaciones hormonales",
    options: {
      sop: "Síndrome de ovario poliquístico (SOP)",
      menopausia: "Menopausia o perimenopausia",
      alteraciones_menstruales: "Alteraciones del ciclo menstrual",
      sintomas_hormonales: "Síntomas de desequilibrio hormonal",
      ninguna: "Ninguna",
    },
  },
  chronic_dx: {
    label: "Condiciones crónicas",
    options: {
      renal: "Enfermedad renal crónica",
      sii: "Síndrome de intestino irritable",
      migrana: "Migraña",
      gastritis_reflujo: "Gastritis o reflujo gastroesofágico",
      otra_digestiva: "Otra enfermedad digestiva o metabólica",
      ninguna: "Ninguna",
    },
  },
  renal_warning: {
    label: "Alarma renal (oliguria, edema severo o disnea)",
    options: { si: "Sí", no: "No" },
  },
};

export interface FormattedAnswer {
  label: string;
  value: string;
}

function formatValue(meta: QuestionMeta | undefined, raw: unknown): string {
  if (Array.isArray(raw)) {
    return raw.map((v) => meta?.options?.[String(v)] ?? String(v)).join(", ");
  }
  if (meta?.options && typeof raw === "string") {
    return meta.options[raw] ?? raw;
  }
  return String(raw);
}

/** Turns the raw answers JSONB into an ordered, human-readable list. */
export function formatAnswers(
  answers: Record<string, unknown>,
): FormattedAnswer[] {
  return Object.entries(answers).map(([key, raw]) => ({
    label: QUESTIONS[key]?.label ?? key,
    value: formatValue(QUESTIONS[key], raw),
  }));
}
