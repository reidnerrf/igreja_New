/**
 * Modelo de Branding da Igreja
 * ConnectFé - Sistema de Personalização
 */

const mongoose = require('mongoose');

const churchBrandingSchema = new mongoose.Schema({
    // Identificação da igreja
    churchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Church',
        required: true,
        unique: true
    },
    
    // Informações básicas
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    
    // Cores principais
    colors: {
        primary: {
            type: String,
            default: '#1976D2',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        },
        secondary: {
            type: String,
            default: '#FFC107',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        },
        accent: {
            type: String,
            default: '#E91E63',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        },
        background: {
            type: String,
            default: '#FFFFFF',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        },
        text: {
            type: String,
            default: '#212121',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        },
        success: {
            type: String,
            default: '#4CAF50',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        },
        warning: {
            type: String,
            default: '#FF9800',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        },
        error: {
            type: String,
            default: '#F44336',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        }
    },
    
    // Tipografia
    typography: {
        primaryFont: {
            type: String,
            default: 'Roboto',
            enum: ['Roboto', 'Open Sans', 'Lato', 'Poppins', 'Inter', 'Montserrat', 'Nunito', 'Source Sans Pro']
        },
        secondaryFont: {
            type: String,
            default: 'Open Sans',
            enum: ['Roboto', 'Open Sans', 'Lato', 'Poppins', 'Inter', 'Montserrat', 'Nunito', 'Source Sans Pro']
        },
        headingFont: {
            type: String,
            default: 'Roboto',
            enum: ['Roboto', 'Open Sans', 'Lato', 'Poppins', 'Inter', 'Montserrat', 'Nunito', 'Source Sans Pro']
        },
        baseFontSize: {
            type: Number,
            default: 16,
            min: 12,
            max: 24
        },
        lineHeight: {
            type: Number,
            default: 1.6,
            min: 1.2,
            max: 2.0
        },
        fontWeight: {
            light: {
                type: Number,
                default: 300,
                min: 100,
                max: 900
            },
            regular: {
                type: Number,
                default: 400,
                min: 100,
                max: 900
            },
            medium: {
                type: Number,
                default: 500,
                min: 100,
                max: 900
            },
            bold: {
                type: Number,
                default: 700,
                min: 100,
                max: 900
            }
        }
    },
    
    // Logotipo
    logo: {
        primary: {
            url: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || v.startsWith('/uploads/');
                    },
                    message: 'URL do logotipo deve começar com /uploads/'
                }
            },
            alt: {
                type: String,
                maxlength: 100
            },
            width: {
                type: Number,
                min: 50,
                max: 500
            },
            height: {
                type: Number,
                min: 50,
                max: 500
            }
        },
        secondary: {
            url: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || v.startsWith('/uploads/');
                    },
                    message: 'URL do logotipo secundário deve começar com /uploads/'
                }
            },
            alt: {
                type: String,
                maxlength: 100
            },
            width: {
                type: Number,
                min: 50,
                max: 500
            },
            height: {
                type: Number,
                min: 50,
                max: 500
            }
        },
        favicon: {
            url: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || v.startsWith('/uploads/');
                    },
                    message: 'URL do favicon deve começar com /uploads/'
                }
            },
            alt: {
                type: String,
                maxlength: 100
            }
        }
    },
    
    // Imagens de capa
    coverImages: {
        main: {
            url: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || v.startsWith('/uploads/');
                    },
                    message: 'URL da imagem principal deve começar com /uploads/'
                }
            },
            alt: {
                type: String,
                maxlength: 100
            },
            overlay: {
                type: String,
                default: 'rgba(0, 0, 0, 0.3)',
                validate: {
                    validator: function(v) {
                        return /^rgba?\([0-9,\s.]+\)$/.test(v) || /^#[0-9A-F]{6,8}$/i.test(v);
                    },
                    message: 'Overlay deve estar no formato rgba() ou hexadecimal'
                }
            }
        },
        events: {
            url: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || v.startsWith('/uploads/');
                    },
                    message: 'URL da imagem de eventos deve começar com /uploads/'
                }
            },
            alt: {
                type: String,
                maxlength: 100
            }
        },
        community: {
            url: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || v.startsWith('/uploads/');
                    },
                    message: 'URL da imagem da comunidade deve começar com /uploads/'
                }
            },
            alt: {
                type: String,
                maxlength: 100
            }
        },
        prayer: {
            url: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || v.startsWith('/uploads/');
                    },
                    message: 'URL da imagem de oração deve começar com /uploads/'
                }
            },
            alt: {
                type: String,
                maxlength: 100
            }
        }
    },
    
    // Elementos visuais
    visualElements: {
        icons: {
            type: String,
            enum: ['material', 'fontawesome', 'custom'],
            default: 'material'
        },
        borderRadius: {
            type: Number,
            default: 8,
            min: 0,
            max: 50
        },
        shadows: {
            type: Boolean,
            default: true
        },
        animations: {
            type: Boolean,
            default: true
        },
        gradients: {
            type: Boolean,
            default: false
        }
    },
    
    // Layout e espaçamento
    layout: {
        containerMaxWidth: {
            type: Number,
            default: 1200,
            min: 800,
            max: 2000
        },
        spacing: {
            xs: {
                type: Number,
                default: 4,
                min: 2,
                max: 16
            },
            sm: {
                type: Number,
                default: 8,
                min: 4,
                max: 24
            },
            md: {
                type: Number,
                default: 16,
                min: 8,
                max: 32
            },
            lg: {
                type: Number,
                default: 24,
                min: 16,
                max: 48
            },
            xl: {
                type: Number,
                default: 32,
                min: 24,
                max: 64
            }
        },
        gridColumns: {
            type: Number,
            default: 12,
            min: 8,
            max: 16
        }
    },
    
    // Configurações de tema
    theme: {
        mode: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        },
        seasonalThemes: {
            type: Boolean,
            default: true
        },
        autoThemeSwitch: {
            type: Boolean,
            default: true
        },
        userPreference: {
            type: Boolean,
            default: true
        }
    },
    
    // Configurações de acessibilidade
    accessibility: {
        highContrast: {
            type: Boolean,
            default: false
        },
        largeText: {
            type: Boolean,
            default: false
        },
        reducedMotion: {
            type: Boolean,
            default: false
        },
        focusIndicators: {
            type: Boolean,
            default: true
        }
    },
    
    // Configurações de idioma
    language: {
        primary: {
            type: String,
            default: 'pt-BR',
            enum: ['pt-BR', 'pt-PT', 'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT']
        },
        fallback: {
            type: String,
            default: 'pt-BR',
            enum: ['pt-BR', 'pt-PT', 'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT']
        },
        autoDetect: {
            type: Boolean,
            default: true
        }
    },
    
    // Configurações de localização
    localization: {
        timezone: {
            type: String,
            default: 'America/Sao_Paulo'
        },
        dateFormat: {
            type: String,
            default: 'DD/MM/YYYY',
            enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY']
        },
        timeFormat: {
            type: String,
            default: '24h',
            enum: ['12h', '24h']
        },
        currency: {
            type: String,
            default: 'BRL',
            enum: ['BRL', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
        }
    },
    
    // Configurações de SEO
    seo: {
        title: {
            type: String,
            maxlength: 60
        },
        description: {
            type: String,
            maxlength: 160
        },
        keywords: [{
            type: String,
            trim: true,
            maxlength: 50
        }],
        ogImage: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || v.startsWith('/uploads/');
                },
                message: 'URL da imagem OG deve começar com /uploads/'
            }
        }
    },
    
    // Configurações de analytics
    analytics: {
        googleAnalytics: {
            type: String,
            maxlength: 20
        },
        facebookPixel: {
            type: String,
            maxlength: 20
        },
        hotjar: {
            type: String,
            maxlength: 20
        }
    },
    
    // Configurações de redes sociais
    socialMedia: {
        facebook: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^https?:\/\/(www\.)?facebook\.com\//.test(v);
                },
                message: 'URL do Facebook deve ser válida'
            }
        },
        instagram: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^https?:\/\/(www\.)?instagram\.com\//.test(v);
                },
                message: 'URL do Instagram deve ser válida'
            }
        },
        youtube: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^https?:\/\/(www\.)?youtube\.com\//.test(v);
                },
                message: 'URL do YouTube deve ser válida'
            }
        },
        whatsapp: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^https?:\/\/wa\.me\//.test(v);
                },
                message: 'URL do WhatsApp deve ser válida'
            }
        }
    },
    
    // Configurações de contato
    contact: {
        email: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Email deve ser válido'
            }
        },
        phone: {
            type: String,
            maxlength: 20
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: {
                type: String,
                default: 'Brasil'
            }
        }
    },
    
    // Status e moderação
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'suspended'],
        default: 'active'
    },
    isModerated: {
        type: Boolean,
        default: false
    },
    moderatorNotes: {
        type: String,
        maxlength: 1000
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para performance
churchBrandingSchema.index({ churchId: 1 });
churchBrandingSchema.index({ status: 1 });
churchBrandingSchema.index({ 'theme.mode': 1 });
churchBrandingSchema.index({ 'language.primary': 1 });

// Virtual para verificar se o branding está completo
churchBrandingSchema.virtual('isComplete').get(function() {
    return !!(this.logo.primary.url && this.colors.primary && this.typography.primaryFont);
});

// Virtual para obter cores de contraste
churchBrandingSchema.virtual('contrastColors').get(function() {
    return {
        primaryContrast: this.getContrastColor(this.colors.primary),
        secondaryContrast: this.getContrastColor(this.colors.secondary),
        accentContrast: this.getContrastColor(this.colors.accent),
        textContrast: this.getContrastColor(this.colors.text)
    };
});

// Middleware para atualizar timestamp
churchBrandingSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Método para obter cor de contraste
churchBrandingSchema.methods.getContrastColor = function(hexColor) {
    if (!hexColor) return '#000000';
    
    // Remove # se presente
    const hex = hexColor.replace('#', '');
    
    // Converte para RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcula luminância
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Retorna preto ou branco baseado na luminância
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Método para gerar paleta de cores
churchBrandingSchema.methods.generateColorPalette = function() {
    const primary = this.colors.primary;
    const secondary = this.colors.secondary;
    
    return {
        primary: {
            light: this.lightenColor(primary, 0.2),
            main: primary,
            dark: this.darkenColor(primary, 0.2)
        },
        secondary: {
            light: this.lightenColor(secondary, 0.2),
            main: secondary,
            dark: this.darkenColor(secondary, 0.2)
        },
        neutral: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121'
        }
    };
};

// Método para clarear cor
churchBrandingSchema.methods.lightenColor = function(hex, percent) {
    if (!hex) return '#FFFFFF';
    
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

// Método para escurecer cor
churchBrandingSchema.methods.darkenColor = function(hex, percent) {
    if (!hex) return '#000000';
    
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
        (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
        (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
};

// Método para validar contraste de acessibilidade
churchBrandingSchema.methods.validateAccessibility = function() {
    const results = {
        primary: this.calculateContrastRatio(this.colors.primary, this.colors.background),
        secondary: this.calculateContrastRatio(this.colors.secondary, this.colors.background),
        text: this.calculateContrastRatio(this.colors.text, this.colors.background)
    };
    
    const issues = [];
    
    Object.entries(results).forEach(([color, ratio]) => {
        if (ratio < 4.5) {
            issues.push(`${color}: contraste insuficiente (${ratio.toFixed(2)}:1)`);
        }
    });
    
    return {
        isValid: issues.length === 0,
        issues: issues,
        ratios: results
    };
};

// Método para calcular razão de contraste
churchBrandingSchema.methods.calculateContrastRatio = function(color1, color2) {
    if (!color1 || !color2) return 0;
    
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
};

// Método para obter luminância
churchBrandingSchema.methods.getLuminance = function(hexColor) {
    if (!hexColor) return 0;
    
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
        if (c <= 0.03928) {
            return c / 12.92;
        }
        return Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Método para exportar configurações CSS
churchBrandingSchema.methods.generateCSS = function() {
    const palette = this.generateColorPalette();
    
    return `
:root {
    /* Cores principais */
    --primary-color: ${this.colors.primary};
    --primary-light: ${palette.primary.light};
    --primary-dark: ${palette.primary.dark};
    
    --secondary-color: ${this.colors.secondary};
    --secondary-light: ${palette.secondary.light};
    --secondary-dark: ${palette.secondary.dark};
    
    --accent-color: ${this.colors.accent};
    --background-color: ${this.colors.background};
    --text-color: ${this.colors.text};
    
    /* Cores de estado */
    --success-color: ${this.colors.success};
    --warning-color: ${this.colors.warning};
    --error-color: ${this.colors.error};
    
    /* Tipografia */
    --font-family-primary: '${this.typography.primaryFont}', sans-serif;
    --font-family-secondary: '${this.typography.secondaryFont}', sans-serif;
    --font-family-heading: '${this.typography.headingFont}', sans-serif;
    
    --font-size-base: ${this.typography.baseFontSize}px;
    --line-height-base: ${this.typography.lineHeight};
    
    --font-weight-light: ${this.typography.fontWeight.light};
    --font-weight-regular: ${this.typography.fontWeight.regular};
    --font-weight-medium: ${this.typography.fontWeight.medium};
    --font-weight-bold: ${this.typography.fontWeight.bold};
    
    /* Layout */
    --container-max-width: ${this.layout.containerMaxWidth}px;
    --grid-columns: ${this.layout.gridColumns};
    
    /* Espaçamento */
    --spacing-xs: ${this.layout.spacing.xs}px;
    --spacing-sm: ${this.layout.spacing.sm}px;
    --spacing-md: ${this.layout.spacing.md}px;
    --spacing-lg: ${this.layout.spacing.lg}px;
    --spacing-xl: ${this.layout.spacing.xl}px;
    
    /* Bordas e sombras */
    --border-radius: ${this.visualElements.borderRadius}px;
    --box-shadow: ${this.visualElements.shadows ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
    
    /* Animações */
    --transition-duration: ${this.visualElements.animations ? '0.3s' : '0s'};
    --transition-timing: ease-in-out;
}
    `.trim();
};

// Método estático para buscar branding por igreja
churchBrandingSchema.statics.findByChurch = function(churchId) {
    return this.findOne({ churchId: churchId });
};

// Método estático para buscar branding ativos
churchBrandingSchema.statics.findActive = function() {
    return this.find({ status: 'active' });
};

// Método estático para criar branding padrão
churchBrandingSchema.statics.createDefault = function(churchId, churchName) {
    return new this({
        churchId: churchId,
        name: churchName,
        description: `Branding personalizado para ${churchName}`,
        colors: {
            primary: '#1976D2',
            secondary: '#FFC107',
            accent: '#E91E63',
            background: '#FFFFFF',
            text: '#212121',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        },
        typography: {
            primaryFont: 'Roboto',
            secondaryFont: 'Open Sans',
            headingFont: 'Roboto',
            baseFontSize: 16,
            lineHeight: 1.6,
            fontWeight: {
                light: 300,
                regular: 400,
                medium: 500,
                bold: 700
            }
        },
        layout: {
            containerMaxWidth: 1200,
            spacing: {
                xs: 4,
                sm: 8,
                md: 16,
                lg: 24,
                xl: 32
            },
            gridColumns: 12
        },
        visualElements: {
            icons: 'material',
            borderRadius: 8,
            shadows: true,
            animations: true,
            gradients: false
        },
        theme: {
            mode: 'light',
            seasonalThemes: true,
            autoThemeSwitch: true,
            userPreference: true
        },
        accessibility: {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            focusIndicators: true
        },
        language: {
            primary: 'pt-BR',
            fallback: 'pt-BR',
            autoDetect: true
        },
        localization: {
            timezone: 'America/Sao_Paulo',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            currency: 'BRL'
        }
    });
};

module.exports = mongoose.model('ChurchBranding', churchBrandingSchema);