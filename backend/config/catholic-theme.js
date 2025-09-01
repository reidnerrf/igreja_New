/**
 * Configuração de Temas Católicos
 * ConnectFé - Sistema de Temas Sazonais Católicos
 */

const moment = require('moment');

class CatholicThemeConfig {
    constructor() {
        this.themes = {};
        this.seasons = {};
        this.loadCatholicThemes();
    }

    /**
     * Carrega todos os temas católicos e datas especiais
     */
    loadCatholicThemes() {
        // Temas Sazonais Católicos
        this.seasons = {
            // Tempo Comum
            ordinary: {
                name: 'Tempo Comum',
                color: '#2E7D32', // Verde
                startDate: null, // Calculado dinamicamente
                endDate: null,
                icon: '🌿',
                description: 'Período de crescimento e desenvolvimento espiritual'
            },

            // Advento
            advent: {
                name: 'Advento',
                color: '#1976D2', // Azul
                startDate: '12-01', // 1º de dezembro
                endDate: '12-24', // 24 de dezembro
                icon: '🕯️',
                description: 'Preparação para o Natal de Jesus Cristo',
                specialDays: ['12-08', '12-12', '12-25'] // Imaculada Conceição, Guadalupe, Natal
            },

            // Natal
            christmas: {
                name: 'Natal',
                color: '#D32F2F', // Vermelho
                startDate: '12-25', // 25 de dezembro
                endDate: '01-06', // 6 de janeiro (Epifania)
                icon: '🎄',
                description: 'Celebração do nascimento de Jesus Cristo',
                specialDays: ['12-25', '01-01', '01-06'] // Natal, Maria Mãe de Deus, Epifania
            },

            // Quaresma
            lent: {
                name: 'Quaresma',
                color: '#7B1FA2', // Roxo
                startDate: null, // Calculado (Quarta-feira de Cinzas)
                endDate: null, // Calculado (Quinta-feira Santa)
                icon: '🕊️',
                description: 'Período de penitência e preparação para a Páscoa',
                specialDays: ['ash-wednesday', 'palm-sunday', 'holy-thursday', 'good-friday']
            },

            // Páscoa
            easter: {
                name: 'Páscoa',
                color: '#FFD700', // Dourado
                startDate: null, // Calculado (Domingo de Páscoa)
                endDate: null, // Calculado (Pentecostes)
                icon: '✝️',
                description: 'Celebração da Ressurreição de Jesus Cristo',
                specialDays: ['easter-sunday', 'ascension', 'pentecost']
            },

            // Tempo Pascal
            easterSeason: {
                name: 'Tempo Pascal',
                color: '#FFD700', // Dourado
                startDate: null, // Calculado (Domingo de Páscoa)
                endDate: null, // Calculado (Pentecostes)
                icon: '🕊️',
                description: 'Celebração da vitória de Cristo sobre a morte'
            },

            // Pentecostes
            pentecost: {
                name: 'Pentecostes',
                color: '#FF5722', // Laranja
                startDate: null, // Calculado (50 dias após Páscoa)
                endDate: null, // Calculado (Trindade)
                icon: '🔥',
                description: 'Vinda do Espírito Santo sobre os apóstolos',
                specialDays: ['pentecost-sunday', 'trinity-sunday', 'corpus-christi']
            }
        };

        // Datas Especiais Católicas
        this.specialDates = {
            // Janeiro
            '01-01': {
                name: 'Maria Mãe de Deus',
                type: 'solemnity',
                color: '#E91E63', // Rosa
                icon: '👑',
                description: 'Solenidade de Maria, Mãe de Deus',
                isHoliday: true
            },
            '01-06': {
                name: 'Epifania do Senhor',
                type: 'solemnity',
                color: '#FFD700', // Dourado
                icon: '⭐',
                description: 'Manifestação de Jesus aos Magos',
                isHoliday: true
            },

            // Fevereiro
            '02-02': {
                name: 'Apresentação do Senhor',
                type: 'feast',
                color: '#FF9800', // Laranja
                icon: '🕯️',
                description: 'Apresentação de Jesus no Templo',
                isHoliday: false
            },
            '02-11': {
                name: 'Nossa Senhora de Lourdes',
                type: 'memorial',
                color: '#2196F3', // Azul
                icon: '🌹',
                description: 'Memorial de Nossa Senhora de Lourdes',
                isHoliday: false
            },

            // Março
            '03-19': {
                name: 'São José',
                type: 'solemnity',
                color: '#795548', // Marrom
                icon: '🔨',
                description: 'Solenidade de São José, Esposo da Virgem Maria',
                isHoliday: true
            },
            '03-25': {
                name: 'Anunciação do Senhor',
                type: 'solemnity',
                color: '#E91E63', // Rosa
                icon: '👼',
                description: 'Anunciação do Anjo Gabriel a Maria',
                isHoliday: true
            },

            // Abril
            '04-25': {
                name: 'São Marcos',
                type: 'feast',
                color: '#4CAF50', // Verde
                icon: '📖',
                description: 'Festa de São Marcos, Evangelista',
                isHoliday: false
            },

            // Maio
            '05-01': {
                name: 'São José Operário',
                type: 'memorial',
                color: '#795548', // Marrom
                icon: '🔨',
                description: 'Memorial de São José Operário',
                isHoliday: false
            },
            '05-31': {
                name: 'Visitação de Maria',
                type: 'feast',
                color: '#E91E63', // Rosa
                icon: '🤝',
                description: 'Visitação de Maria a Santa Isabel',
                isHoliday: false
            },

            // Junho
            '06-24': {
                name: 'Nascimento de São João Batista',
                type: 'solemnity',
                color: '#FF9800', // Laranja
                icon: '🕊️',
                description: 'Solenidade do Nascimento de São João Batista',
                isHoliday: true
            },
            '06-29': {
                name: 'São Pedro e São Paulo',
                type: 'solemnity',
                color: '#FFD700', // Dourado
                icon: '🗝️',
                description: 'Solenidade dos Apóstolos São Pedro e São Paulo',
                isHoliday: true
            },

            // Julho
            '07-16': {
                name: 'Nossa Senhora do Carmo',
                type: 'memorial',
                color: '#E91E63', // Rosa
                icon: '🌿',
                description: 'Memorial de Nossa Senhora do Carmo',
                isHoliday: false
            },
            '07-25': {
                name: 'São Tiago',
                type: 'feast',
                color: '#4CAF50', // Verde
                icon: '⚔️',
                description: 'Festa de São Tiago, Apóstolo',
                isHoliday: false
            },

            // Agosto
            '08-15': {
                name: 'Assunção de Nossa Senhora',
                type: 'solemnity',
                color: '#E91E63', // Rosa
                icon: '👑',
                description: 'Assunção de Maria ao Céu',
                isHoliday: true
            },
            '08-22': {
                name: 'Nossa Senhora Rainha',
                type: 'memorial',
                color: '#E91E63', // Rosa
                icon: '👑',
                description: 'Memorial de Nossa Senhora Rainha',
                isHoliday: false
            },

            // Setembro
            '09-08': {
                name: 'Nascimento de Nossa Senhora',
                type: 'feast',
                color: '#E91E63', // Rosa
                icon: '👶',
                description: 'Festa do Nascimento de Nossa Senhora',
                isHoliday: false
            },
            '09-14': {
                name: 'Exaltação da Santa Cruz',
                type: 'feast',
                color: '#D32F2F', // Vermelho
                icon: '✝️',
                description: 'Exaltação da Santa Cruz',
                isHoliday: false
            },
            '09-29': {
                name: 'São Miguel, São Gabriel e São Rafael',
                type: 'feast',
                color: '#FFD700', // Dourado
                icon: '👼',
                description: 'Festa dos Santos Arcanjos',
                isHoliday: false
            },

            // Outubro
            '10-01': {
                name: 'Santa Teresinha do Menino Jesus',
                type: 'memorial',
                color: '#E91E63', // Rosa
                icon: '🌹',
                description: 'Memorial de Santa Teresinha do Menino Jesus',
                isHoliday: false
            },
            '10-02': {
                name: 'Santos Anjos da Guarda',
                type: 'memorial',
                color: '#FFD700', // Dourado
                icon: '👼',
                description: 'Memorial dos Santos Anjos da Guarda',
                isHoliday: false
            },
            '10-07': {
                name: 'Nossa Senhora do Rosário',
                type: 'memorial',
                color: '#E91E63', // Rosa
                icon: '📿',
                description: 'Memorial de Nossa Senhora do Rosário',
                isHoliday: false
            },

            // Novembro
            '11-01': {
                name: 'Todos os Santos',
                type: 'solemnity',
                color: '#FFD700', // Dourado
                icon: '👼',
                description: 'Solenidade de Todos os Santos',
                isHoliday: true
            },
            '11-02': {
                name: 'Finados',
                type: 'commemoration',
                color: '#757575', // Cinza
                icon: '🕯️',
                description: 'Comemoração de Todos os Fiéis Defuntos',
                isHoliday: true
            },
            '11-21': {
                name: 'Apresentação de Nossa Senhora',
                type: 'memorial',
                color: '#E91E63', // Rosa
                icon: '👑',
                description: 'Memorial da Apresentação de Nossa Senhora',
                isHoliday: false
            },
            '11-30': {
                name: 'Santo André',
                type: 'feast',
                color: '#4CAF50', // Verde
                icon: '🎣',
                description: 'Festa de Santo André, Apóstolo',
                isHoliday: false
            },

            // Dezembro
            '12-08': {
                name: 'Imaculada Conceição',
                type: 'solemnity',
                color: '#E91E63', // Rosa
                icon: '👑',
                description: 'Solenidade da Imaculada Conceição',
                isHoliday: true
            },
            '12-12': {
                name: 'Nossa Senhora de Guadalupe',
                type: 'feast',
                color: '#E91E63', // Rosa
                icon: '🌹',
                description: 'Festa de Nossa Senhora de Guadalupe',
                isHoliday: false
            },
            '12-25': {
                name: 'Natal do Senhor',
                type: 'solemnity',
                color: '#D32F2F', // Vermelho
                icon: '🎄',
                description: 'Solenidade do Natal do Senhor',
                isHoliday: true
            }
        };

        // Datas móveis (calculadas dinamicamente)
        this.movableDates = {
            'ash-wednesday': {
                name: 'Quarta-feira de Cinzas',
                type: 'special',
                color: '#757575', // Cinza
                icon: '🖤',
                description: 'Início da Quaresma',
                calculate: () => this.calculateAshWednesday()
            },
            'palm-sunday': {
                name: 'Domingo de Ramos',
                type: 'special',
                color: '#4CAF50', // Verde
                icon: '🌿',
                description: 'Entrada triunfal de Jesus em Jerusalém',
                calculate: () => this.calculatePalmSunday()
            },
            'holy-thursday': {
                name: 'Quinta-feira Santa',
                type: 'special',
                color: '#7B1FA2', // Roxo
                icon: '🍷',
                description: 'Instituição da Eucaristia',
                calculate: () => this.calculateHolyThursday()
            },
            'good-friday': {
                name: 'Sexta-feira Santa',
                type: 'special',
                color: '#D32F2F', // Vermelho
                icon: '✝️',
                description: 'Paixão e Morte de Jesus Cristo',
                calculate: () => this.calculateGoodFriday()
            },
            'easter-sunday': {
                name: 'Domingo de Páscoa',
                type: 'special',
                color: '#FFD700', // Dourado
                icon: '✝️',
                description: 'Ressurreição de Jesus Cristo',
                calculate: () => this.calculateEasterSunday()
            },
            'ascension': {
                name: 'Ascensão do Senhor',
                type: 'special',
                color: '#FFD700', // Dourado
                icon: '☁️',
                description: 'Ascensão de Jesus ao Céu',
                calculate: () => this.calculateAscension()
            },
            'pentecost-sunday': {
                name: 'Pentecostes',
                type: 'special',
                color: '#FF5722', // Laranja
                icon: '🔥',
                description: 'Vinda do Espírito Santo',
                calculate: () => this.calculatePentecost()
            },
            'trinity-sunday': {
                name: 'Santíssima Trindade',
                type: 'special',
                color: '#FFD700', // Dourado
                icon: '☘️',
                description: 'Solenidade da Santíssima Trindade',
                calculate: () => this.calculateTrinitySunday()
            },
            'corpus-christi': {
                name: 'Corpus Christi',
                type: 'special',
                color: '#FFD700', // Dourado
                icon: '🍷',
                description: 'Corpo e Sangue de Cristo',
                calculate: () => this.calculateCorpusChristi()
            }
        };
    }

    /**
     * Calcula a data da Quarta-feira de Cinzas
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato MM-DD
     */
    calculateAshWednesday(year = new Date().getFullYear()) {
        const easter = this.calculateEasterSunday(year);
        const easterDate = moment(easter, 'YYYY-MM-DD');
        const ashWednesday = easterDate.clone().subtract(46, 'days');
        return ashWednesday.format('MM-DD');
    }

    /**
     * Calcula a data do Domingo de Ramos
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato MM-DD
     */
    calculatePalmSunday(year = new Date().getFullYear()) {
        const easter = this.calculateEasterSunday(year);
        const easterDate = moment(easter, 'YYYY-MM-DD');
        const palmSunday = easterDate.clone().subtract(7, 'days');
        return palmSunday.format('MM-DD');
    }

    /**
     * Calcula a data da Quinta-feira Santa
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato MM-DD
     */
    calculateHolyThursday(year = new Date().getFullYear()) {
        const easter = this.calculateEasterSunday(year);
        const easterDate = moment(easter, 'YYYY-MM-DD');
        const holyThursday = easterDate.clone().subtract(3, 'days');
        return holyThursday.format('MM-DD');
    }

    /**
     * Calcula a data da Sexta-feira Santa
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato MM-DD
     */
    calculateGoodFriday(year = new Date().getFullYear()) {
        const easter = this.calculateEasterSunday(year);
        const easterDate = moment(easter, 'YYYY-MM-DD');
        const goodFriday = easterDate.clone().subtract(2, 'days');
        return goodFriday.format('MM-DD');
    }

    /**
     * Calcula a data do Domingo de Páscoa (Algoritmo de Meeus/Jones/Butcher)
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato YYYY-MM-DD
     */
    calculateEasterSunday(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    /**
     * Calcula a data da Ascensão (40 dias após Páscoa)
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato MM-DD
     */
    calculateAscension(year = new Date().getFullYear()) {
        const easter = this.calculateEasterSunday(year);
        const easterDate = moment(easter, 'YYYY-MM-DD');
        const ascension = easterDate.clone().add(40, 'days');
        return ascension.format('MM-DD');
    }

    /**
     * Calcula a data do Pentecostes (50 dias após Páscoa)
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato MM-DD
     */
    calculatePentecost(year = new Date().getFullYear()) {
        const easter = this.calculateEasterSunday(year);
        const easterDate = moment(easter, 'YYYY-MM-DD');
        const pentecost = easterDate.clone().add(50, 'days');
        return pentecost.format('MM-DD');
    }

    /**
     * Calcula a data da Santíssima Trindade (domingo após Pentecostes)
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato MM-DD
     */
    calculateTrinitySunday(year = new Date().getFullYear()) {
        const pentecost = this.calculatePentecost(year);
        const pentecostDate = moment(pentecost, 'MM-DD');
        const trinitySunday = pentecostDate.clone().add(7, 'days');
        return trinitySunday.format('MM-DD');
    }

    /**
     * Calcula a data do Corpus Christi (quinta-feira após Trindade)
     * @param {number} year - Ano para calcular
     * @returns {string} Data no formato MM-DD
     */
    calculateCorpusChristi(year = new Date().getFullYear()) {
        const trinity = this.calculateTrinitySunday(year);
        const trinityDate = moment(trinity, 'MM-DD');
        const corpusChristi = trinityDate.clone().add(4, 'days');
        return corpusChristi.format('MM-DD');
    }

    /**
     * Obtém o tema atual baseado na data
     * @param {Date} date - Data para verificar (padrão: hoje)
     * @returns {Object} Tema atual
     */
    getCurrentTheme(date = new Date()) {
        const currentDate = moment(date);
        const monthDay = currentDate.format('MM-DD');
        const year = currentDate.year();

        // Verifica datas especiais fixas
        if (this.specialDates[monthDay]) {
            return {
                type: 'special',
                data: this.specialDates[monthDay],
                season: this.getCurrentSeason(date)
            };
        }

        // Verifica datas móveis
        for (const [key, movableDate] of Object.entries(this.movableDates)) {
            const calculatedDate = movableDate.calculate(year);
            if (monthDay === calculatedDate) {
                return {
                    type: 'movable',
                    data: movableDate,
                    season: this.getCurrentSeason(date)
                };
            }
        }

        // Retorna o tema da estação atual
        return {
            type: 'season',
            data: this.getCurrentSeason(date),
            season: this.getCurrentSeason(date)
        };
    }

    /**
     * Obtém a estação litúrgica atual
     * @param {Date} date - Data para verificar
     * @returns {Object} Estação atual
     */
    getCurrentSeason(date = new Date()) {
        const currentDate = moment(date);
        const year = currentDate.year();

        // Calcula datas móveis para o ano atual
        const easter = this.calculateEasterSunday(year);
        const easterDate = moment(easter, 'YYYY-MM-DD');
        const ashWednesday = moment(this.calculateAshWednesday(year), 'MM-DD').year(year);
        const pentecost = moment(this.calculatePentecost(year), 'MM-DD').year(year);

        // Verifica Advento (1º de dezembro a 24 de dezembro)
        if (currentDate.month() === 11 && currentDate.date() <= 24) {
            return this.seasons.advent;
        }

        // Verifica Natal (25 de dezembro a 6 de janeiro)
        if ((currentDate.month() === 11 && currentDate.date() >= 25) ||
            (currentDate.month() === 0 && currentDate.date() <= 6)) {
            return this.seasons.christmas;
        }

        // Verifica Quaresma (Quarta-feira de Cinzas a Quinta-feira Santa)
        if (currentDate.isBetween(ashWednesday, easterDate.clone().subtract(3, 'days'), 'day', '[]')) {
            return this.seasons.lent;
        }

        // Verifica Páscoa (Domingo de Páscoa a Pentecostes)
        if (currentDate.isBetween(easterDate, pentecost, 'day', '[]')) {
            return this.seasons.easter;
        }

        // Verifica Pentecostes (Domingo de Pentecostes + 1 semana)
        const trinitySunday = moment(this.calculateTrinitySunday(year), 'MM-DD').year(year);
        if (currentDate.isBetween(pentecost, trinitySunday.clone().add(7, 'days'), 'day', '[]')) {
            return this.seasons.pentecost;
        }

        // Tempo Comum (padrão)
        return this.seasons.ordinary;
    }

    /**
     * Obtém todas as datas especiais de um mês
     * @param {number} month - Mês (1-12)
     * @param {number} year - Ano
     * @returns {Array} Lista de datas especiais
     */
    getMonthSpecialDates(month, year = new Date().getFullYear()) {
        const specialDates = [];
        const monthStr = month.toString().padStart(2, '0');

        // Adiciona datas fixas do mês
        Object.entries(this.specialDates).forEach(([date, data]) => {
            if (date.startsWith(monthStr)) {
                specialDates.push({
                    date: `${year}-${date}`,
                    ...data
                });
            }
        });

        // Adiciona datas móveis do mês
        Object.entries(this.movableDates).forEach(([key, data]) => {
            const calculatedDate = data.calculate(year);
            if (calculatedDate.startsWith(monthStr)) {
                specialDates.push({
                    date: `${year}-${calculatedDate}`,
                    ...data
                });
            }
        });

        // Ordena por data
        return specialDates.sort((a, b) => moment(a.date).diff(moment(b.date)));
    }

    /**
     * Obtém o calendário litúrgico completo de um ano
     * @param {number} year - Ano
     * @returns {Object} Calendário litúrgico
     */
    getLiturgicalCalendar(year = new Date().getFullYear()) {
        const calendar = {
            year: year,
            seasons: {},
            specialDates: {},
            movableDates: {}
        };

        // Calcula datas móveis
        Object.entries(this.movableDates).forEach(([key, data]) => {
            const calculatedDate = data.calculate(year);
            calendar.movableDates[key] = {
                date: `${year}-${calculatedDate}`,
                ...data
            };
        });

        // Adiciona datas especiais
        Object.entries(this.specialDates).forEach(([date, data]) => {
            calendar.specialDates[date] = {
                date: `${year}-${date}`,
                ...data
            };
        });

        // Calcula estações
        const easter = this.calculateEasterSunday(year);
        const easterDate = moment(easter, 'YYYY-MM-DD');
        
        calendar.seasons = {
            advent: {
                start: `${year}-12-01`,
                end: `${year}-12-24`,
                ...this.seasons.advent
            },
            christmas: {
                start: `${year}-12-25`,
                end: `${year + 1}-01-06`,
                ...this.seasons.christmas
            },
            lent: {
                start: `${year}-${this.calculateAshWednesday(year)}`,
                end: `${year}-${this.calculateHolyThursday(year)}`,
                ...this.seasons.lent
            },
            easter: {
                start: easter,
                end: `${year}-${this.calculatePentecost(year)}`,
                ...this.seasons.easter
            },
            pentecost: {
                start: `${year}-${this.calculatePentecost(year)}`,
                end: `${year}-${this.calculateTrinitySunday(year)}`,
                ...this.seasons.pentecost
            }
        };

        return calendar;
    }

    /**
     * Obtém as próximas datas especiais
     * @param {number} count - Número de datas para retornar
     * @returns {Array} Próximas datas especiais
     */
    getUpcomingSpecialDates(count = 10) {
        const today = moment();
        const year = today.year();
        const nextYear = year + 1;
        
        let allDates = [];

        // Adiciona datas do ano atual
        Object.entries(this.specialDates).forEach(([date, data]) => {
            const fullDate = moment(`${year}-${date}`);
            if (fullDate.isAfter(today)) {
                allDates.push({
                    date: fullDate.format('YYYY-MM-DD'),
                    ...data
                });
            }
        });

        // Adiciona datas móveis do ano atual
        Object.entries(this.movableDates).forEach(([key, data]) => {
            const calculatedDate = data.calculate(year);
            const fullDate = moment(`${year}-${calculatedDate}`);
            if (fullDate.isAfter(today)) {
                allDates.push({
                    date: fullDate.format('YYYY-MM-DD'),
                    ...data
                });
            }
        });

        // Adiciona datas do próximo ano se necessário
        if (allDates.length < count) {
            Object.entries(this.specialDates).forEach(([date, data]) => {
                const fullDate = moment(`${nextYear}-${date}`);
                allDates.push({
                    date: fullDate.format('YYYY-MM-DD'),
                    ...data
                });
            });

            Object.entries(this.movableDates).forEach(([key, data]) => {
                const calculatedDate = data.calculate(nextYear);
                const fullDate = moment(`${nextYear}-${calculatedDate}`);
                allDates.push({
                    date: fullDate.format('YYYY-MM-DD'),
                    ...data
                });
            });
        }

        // Ordena por data e retorna as próximas
        return allDates
            .sort((a, b) => moment(a.date).diff(moment(b.date)))
            .slice(0, count);
    }

    /**
     * Obtém o tema para uma data específica
     * @param {string} date - Data no formato YYYY-MM-DD
     * @returns {Object} Tema da data
     */
    getThemeForDate(date) {
        const momentDate = moment(date);
        return this.getCurrentTheme(momentDate.toDate());
    }

    /**
     * Verifica se uma data é feriado
     * @param {string} date - Data no formato YYYY-MM-DD
     * @returns {boolean} É feriado
     */
    isHoliday(date) {
        const theme = this.getThemeForDate(date);
        
        if (theme.type === 'special' || theme.type === 'movable') {
            return theme.data.isHoliday || false;
        }
        
        return false;
    }

    /**
     * Obtém estatísticas dos temas
     * @returns {Object} Estatísticas
     */
    getThemeStats() {
        const totalSpecialDates = Object.keys(this.specialDates).length;
        const totalMovableDates = Object.keys(this.movableDates).length;
        const totalSeasons = Object.keys(this.seasons).length;
        
        return {
            totalSpecialDates,
            totalMovableDates,
            totalSeasons,
            totalThemes: totalSpecialDates + totalMovableDates + totalSeasons
        };
    }
}

// Instância singleton
const catholicThemeConfig = new CatholicThemeConfig();

module.exports = catholicThemeConfig;