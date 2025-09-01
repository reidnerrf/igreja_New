const natural = require('natural');
const sw = require('stopword');

// Cache para armazenar classificações recentes
const classificationCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

class ModerationService {
  constructor() {
    this.toxicityWords = new Set([
      'ódio', 'raiva', 'violência', 'morte', 'morrer', 'matar', 'sangue',
      'guerra', 'conflito', 'briga', 'luta', 'agressão', 'ataque',
      'discriminação', 'preconceito', 'racismo', 'sexismo', 'homofobia',
      'xenofobia', 'intolerância', 'bullying', 'assédio', 'abuso'
    ]);

    this.spamPatterns = [
      /\b(?:viagra|casino|lottery|winner|prize|free money)\b/i,
      /\b(?:http|https|www\.)\S+/i, // URLs
      /(.)\1{4,}/, // Caracteres repetidos
      /\b[A-Z]{5,}\b/, // MAIÚSCULAS excessivas
      /[!?.]{3,}/, // Pontuação excessiva
    ];

    // Análise de sentimento removida temporariamente devido a limitações da biblioteca
    // this.sentimentAnalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'english');
  }

  /**
   * Classifica conteúdo para toxicidade
   * @param {string} text - Texto a ser analisado
   * @returns {Object} Resultado da classificação
   */
  classifyToxicity(text) {
    try {
      const cacheKey = `toxicity_${this.hashText(text)}`;
      const cached = this.getCachedResult(cacheKey);
      if (cached) return cached;

      const cleanText = this.preprocessText(text);
      const words = cleanText.split(' ');

      // Contar palavras tóxicas
      let toxicityScore = 0;
      let toxicWords = [];

      words.forEach(word => {
        const stemmed = natural.PorterStemmer.stem(word.toLowerCase());
        if (this.toxicityWords.has(word.toLowerCase()) ||
            this.toxicityWords.has(stemmed)) {
          toxicityScore += 1;
          toxicWords.push(word);
        }
      });

      // Análise de sentimento removida - usar apenas score baseado em palavras tóxicas
      const sentimentScore = 0; // Placeholder

      // Calcular score final (0-1) baseado apenas em palavras tóxicas
      const finalScore = Math.min(1, (toxicityScore / words.length) * 2);

      const result = {
        isToxic: finalScore > 0.3,
        score: finalScore,
        confidence: Math.min(1, toxicityScore / 5), // Confiança baseada em palavras tóxicas
        toxicWords: toxicWords.slice(0, 5), // Top 5 palavras tóxicas
        sentimentScore,
        needsReview: finalScore > 0.5 || toxicWords.length > 2
      };

      this.setCachedResult(cacheKey, result);
      return result;

    } catch (error) {
      console.error('Erro na classificação de toxicidade:', error);
      return {
        isToxic: false,
        score: 0,
        confidence: 0,
        error: 'Erro na análise'
      };
    }
  }

  /**
   * Classifica conteúdo para spam
   * @param {string} text - Texto a ser analisado
   * @returns {Object} Resultado da classificação
   */
  classifySpam(text) {
    try {
      const cacheKey = `spam_${this.hashText(text)}`;
      const cached = this.getCachedResult(cacheKey);
      if (cached) return cached;

      let spamScore = 0;
      const reasons = [];

      // Verificar padrões de spam
      this.spamPatterns.forEach((pattern, index) => {
        if (pattern.test(text)) {
          spamScore += 0.2;
          reasons.push(`Padrão ${index + 1} detectado`);
        }
      });

      // Análise de comprimento
      const wordCount = text.split(' ').length;
      if (wordCount < 3) {
        spamScore += 0.3;
        reasons.push('Texto muito curto');
      }

      // Análise de repetição
      const uniqueWords = new Set(text.toLowerCase().split(' '));
      const repetitionRatio = uniqueWords.size / wordCount;
      if (repetitionRatio < 0.5) {
        spamScore += 0.2;
        reasons.push('Muitas repetições');
      }

      // Análise de maiúsculas
      const uppercaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
      if (uppercaseRatio > 0.3) {
        spamScore += 0.2;
        reasons.push('Muitas maiúsculas');
      }

      const result = {
        isSpam: spamScore > 0.4,
        score: Math.min(1, spamScore),
        confidence: Math.min(1, spamScore * 2),
        reasons: reasons.slice(0, 3),
        needsReview: spamScore > 0.6
      };

      this.setCachedResult(cacheKey, result);
      return result;

    } catch (error) {
      console.error('Erro na classificação de spam:', error);
      return {
        isSpam: false,
        score: 0,
        confidence: 0,
        error: 'Erro na análise'
      };
    }
  }

  /**
   * Classificação completa (toxicidade + spam)
   * @param {string} text - Texto a ser analisado
   * @returns {Object} Resultado completo
   */
  classifyContent(text) {
    const toxicity = this.classifyToxicity(text);
    const spam = this.classifySpam(text);

    const overallScore = (toxicity.score + spam.score) / 2;
    const needsModeration = toxicity.needsReview || spam.needsReview ||
                           (toxicity.isToxic && spam.isSpam);

    return {
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      toxicity,
      spam,
      overall: {
        score: overallScore,
        isFlagged: toxicity.isToxic || spam.isSpam,
        needsModeration,
        recommendedAction: this.getRecommendedAction(toxicity, spam)
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Moderação em lote para múltiplos conteúdos
   * @param {Array} contents - Array de objetos {id, text}
   * @returns {Array} Resultados da moderação
   */
  moderateBatch(contents) {
    return contents.map(content => ({
      id: content.id,
      ...this.classifyContent(content.text)
    }));
  }

  /**
   * Obter estatísticas de moderação
   * @param {Array} results - Resultados de moderação
   * @returns {Object} Estatísticas
   */
  getModerationStats(results) {
    const stats = {
      total: results.length,
      toxic: results.filter(r => r.toxicity.isToxic).length,
      spam: results.filter(r => r.spam.isSpam).length,
      needsModeration: results.filter(r => r.overall.needsModeration).length,
      averageToxicityScore: 0,
      averageSpamScore: 0,
      topToxicWords: {},
      commonSpamReasons: {}
    };

    if (results.length > 0) {
      stats.averageToxicityScore = results.reduce((sum, r) => sum + r.toxicity.score, 0) / results.length;
      stats.averageSpamScore = results.reduce((sum, r) => sum + r.spam.score, 0) / results.length;

      // Contar palavras tóxicas mais comuns
      results.forEach(result => {
        result.toxicity.toxicWords.forEach(word => {
          stats.topToxicWords[word] = (stats.topToxicWords[word] || 0) + 1;
        });

        result.spam.reasons.forEach(reason => {
          stats.commonSpamReasons[reason] = (stats.commonSpamReasons[reason] || 0) + 1;
        });
      });
    }

    return stats;
  }

  // Métodos auxiliares
  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remover pontuação
      .replace(/\s+/g, ' ') // Normalizar espaços
      .trim();
  }

  hashText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Converter para 32 bits
    }
    return hash.toString();
  }

  getCachedResult(key) {
    const cached = classificationCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    classificationCache.delete(key);
    return null;
  }

  setCachedResult(key, data) {
    classificationCache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Limpar cache antigo se necessário
    if (classificationCache.size > 1000) {
      const oldestKey = classificationCache.keys().next().value;
      classificationCache.delete(oldestKey);
    }
  }

  getRecommendedAction(toxicity, spam) {
    if (toxicity.isToxic && spam.isSpam) {
      return 'reject';
    } else if (toxicity.isToxic) {
      return 'review';
    } else if (spam.isSpam) {
      return 'flag';
    } else if (toxicity.needsReview || spam.needsReview) {
      return 'monitor';
    }
    return 'approve';
  }
}

module.exports = new ModerationService();
