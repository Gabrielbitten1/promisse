'use strict';

const Groq = require('groq-sdk');
const logger = require('../config/logger');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL        = process.env.GROQ_MODEL        || 'llama-3.3-70b-versatile';
const MAX_TOKENS   = parseInt(process.env.GROQ_MAX_TOKENS) || 2048;
const TEMPERATURE  = parseFloat(process.env.GROQ_TEMPERATURE) || 0.2;

const NR_SYSTEM_CONTEXT = `Voce e um especialista em Normas Regulamentadoras brasileiras (NR-1, NR-9, NR-12, NR-17).
Responda exclusivamente com base nas normas vigentes do MTE.
Seja preciso, tecnico e objetivo. Nunca invente artigos ou penalidades.
Formato de saida: JSON estruturado conforme o schema solicitado.`;

const chat = async (userPrompt, systemContext = NR_SYSTEM_CONTEXT, maxTokens = MAX_TOKENS) => {
  const start = Date.now();
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: TEMPERATURE,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user',   content: userPrompt },
      ],
    });

    const latency = Date.now() - start;
    const usage = response.usage;

    logger.info('Groq API call completed', {
      model: MODEL,
      latency_ms: latency,
      prompt_tokens: usage?.prompt_tokens,
      completion_tokens: usage?.completion_tokens,
      total_tokens: usage?.total_tokens,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq API.');

    return JSON.parse(content);
  } catch (err) {
    logger.error('Groq API call failed', { error: err.message, latency_ms: Date.now() - start });
    throw err;
  }
};

const analyzeRiskPrompt = (risco) => `
Analise o risco ocupacional abaixo e retorne um JSON com a seguinte estrutura:
{
  "nivel_risco_calculado": "BAIXO|MEDIO|ALTO|CRITICO",
  "fundamentacao_legal": ["NR-X, item X.X.X"],
  "medidas_hierarquia": {
    "eliminacao": "...",
    "substituicao": "...",
    "controle_engenharia": "...",
    "controle_administrativo": "...",
    "epi": ["..."]
  },
  "prazo_recomendado_dias": 30,
  "observacoes_tecnicas": "..."
}

Dados do risco:
- Tipo: ${risco.tipo}
- Descricao: ${risco.descricao}
- Fonte geradora: ${risco.fonteGeradora}
- Probabilidade (1-5): ${risco.probabilidade}
- Severidade (1-5): ${risco.severidade}
- NR de referencia: ${risco.nrReferencia}
- Local: ${risco.localAplicacao}
`;

const complianceCheckPrompt = (dados) => `
Avalie a conformidade da maquina/equipamento com a NR-12 e retorne JSON:
{
  "percentual_conformidade": 0-100,
  "status": "CONFORME|PARCIALMENTE_CONFORME|NAO_CONFORME",
  "itens_criticos": [{ "artigo": "NR-12 item X.X", "descricao": "..." }],
  "acoes_imediatas": ["..."],
  "previsao_regularizacao": "..."
}

Dados da maquina:
${JSON.stringify(dados, null, 2)}
`;

const suggestControlsPrompt = (exposicao) => `
Com base na exposicao ergonomica (NR-17) descrita, retorne JSON:
{
  "diagnostico_ergonomico": "...",
  "medidas_priorizadas": [
    { "tipo": "...", "descricao": "...", "impacto": "ALTO|MEDIO|BAIXO" }
  ],
  "referencias_normativas": ["NR-17 item X.X"],
  "indicadores_monitoramento": ["..."]
}

Dados da exposicao:
${JSON.stringify(exposicao, null, 2)}
`;

module.exports = {
  chat,
  analyzeRiskPrompt,
  complianceCheckPrompt,
  suggestControlsPrompt,
};
