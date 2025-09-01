/**
 * Serviço de Branding da Igreja
 * ConnectFé - Sistema de Personalização
 */

const ChurchBranding = require('../models/ChurchBranding');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

class ChurchBrandingService {
    constructor() {
        this.uploadDir = path.join(__dirname, '../uploads/branding');
        this.ensureUploadDirectory();
    }

    /**
     * Garante que o diretório de upload existe
     */
    async ensureUploadDirectory() {
        try {
            await fs.access(this.uploadDir);
        } catch (error) {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
    }

    /**
     * Cria ou atualiza o branding de uma igreja
     * @param {string} churchId - ID da igreja
     * @param {Object} brandingData - Dados do branding
     * @returns {Object} Branding criado/atualizado
     */
    async createOrUpdateBranding(churchId, brandingData) {
        try {
            let branding = await ChurchBranding.findOne({ churchId });
            
            if (!branding) {
                branding = new ChurchBranding({
                    churchId,
                    ...brandingData
                });
            } else {
                Object.assign(branding, brandingData);
            }

            // Valida cores se fornecidas
            if (brandingData.colors) {
                await this.validateColors(brandingData.colors);
            }

            await branding.save();
            return branding;
        } catch (error) {
            throw new Error(`Erro ao criar/atualizar branding: ${error.message}`);
        }
    }

    /**
     * Valida as cores fornecidas
     * @param {Object} colors - Objeto com cores
     */
    async validateColors(colors) {
        const colorRegex = /^#[0-9A-F]{6}$/i;
        
        for (const [key, color] of Object.entries(colors)) {
            if (!colorRegex.test(color)) {
                throw new Error(`Cor inválida para ${key}: ${color}`);
            }
        }
    }

    /**
     * Faz upload de logo
     * @param {string} churchId - ID da igreja
     * @param {Buffer} fileBuffer - Buffer do arquivo
     * @param {string} originalName - Nome original do arquivo
     * @param {string} logoType - Tipo do logo (primary, secondary, favicon)
     * @returns {Object} Informações do upload
     */
    async uploadLogo(churchId, fileBuffer, originalName, logoType) {
        try {
            const extension = path.extname(originalName).toLowerCase();
            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
            
            if (!allowedExtensions.includes(extension)) {
                throw new Error('Formato de arquivo não suportado');
            }

            const filename = `${churchId}_${logoType}_${Date.now()}${extension}`;
            const filepath = path.join(this.uploadDir, filename);

            // Processa a imagem
            let processedBuffer = fileBuffer;
            
            if (logoType === 'favicon') {
                // Favicon deve ser pequeno
                processedBuffer = await sharp(fileBuffer)
                    .resize(32, 32)
                    .png()
                    .toBuffer();
            } else if (logoType === 'primary') {
                // Logo principal deve ter tamanho padrão
                processedBuffer = await sharp(fileBuffer)
                    .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
                    .png()
                    .toBuffer();
            }

            // Salva o arquivo
            await fs.writeFile(filepath, processedBuffer);

            // Atualiza o branding
            const branding = await ChurchBranding.findOne({ churchId });
            if (branding) {
                branding.logos[logoType] = `/uploads/branding/${filename}`;
                await branding.save();
            }

            return {
                success: true,
                filename: filename,
                path: `/uploads/branding/${filename}`,
                size: processedBuffer.length
            };
        } catch (error) {
            throw new Error(`Erro ao fazer upload do logo: ${error.message}`);
        }
    }

    /**
     * Faz upload de imagem de capa
     * @param {string} churchId - ID da igreja
     * @param {Buffer} fileBuffer - Buffer do arquivo
     * @param {string} originalName - Nome original do arquivo
     * @param {string} coverType - Tipo da capa (main, events, community, prayer)
     * @returns {Object} Informações do upload
     */
    async uploadCoverImage(churchId, fileBuffer, originalName, coverType) {
        try {
            const extension = path.extname(originalName).toLowerCase();
            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
            
            if (!allowedExtensions.includes(extension)) {
                throw new Error('Formato de arquivo não suportado');
            }

            const filename = `${churchId}_${coverType}_${Date.now()}${extension}`;
            const filepath = path.join(this.uploadDir, filename);

            // Processa a imagem de capa
            const processedBuffer = await sharp(fileBuffer)
                .resize(1200, 400, { fit: 'cover' })
                .jpeg({ quality: 85 })
                .toBuffer();

            // Salva o arquivo
            await fs.writeFile(filepath, processedBuffer);

            // Atualiza o branding
            const branding = await ChurchBranding.findOne({ churchId });
            if (branding) {
                branding.coverImages[coverType] = `/uploads/branding/${filename}`;
                await branding.save();
            }

            return {
                success: true,
                filename: filename,
                path: `/uploads/branding/${filename}`,
                size: processedBuffer.length
            };
        } catch (error) {
            throw new Error(`Erro ao fazer upload da imagem de capa: ${error.message}`);
        }
    }

    /**
     * Gera CSS personalizado para a igreja
     * @param {string} churchId - ID da igreja
     * @returns {string} CSS personalizado
     */
    async generateCustomCSS(churchId) {
        try {
            const branding = await ChurchBranding.findOne({ churchId });
            if (!branding) {
                throw new Error('Branding não encontrado');
            }

            const css = `
                /* CSS Personalizado - ${branding.name} */
                :root {
                    --church-primary: ${branding.colors.primary};
                    --church-secondary: ${branding.colors.secondary};
                    --church-accent: ${branding.colors.accent};
                    --church-background: ${branding.colors.background};
                    --church-text: ${branding.colors.text};
                    --church-success: ${branding.colors.success};
                    --church-warning: ${branding.colors.warning};
                    --church-error: ${branding.colors.error};
                }

                .church-branded {
                    background-color: var(--church-background);
                    color: var(--church-text);
                }

                .church-primary-btn {
                    background-color: var(--church-primary);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .church-primary-btn:hover {
                    background-color: ${this.darkenColor(branding.colors.primary, 0.1)};
                    transform: translateY(-2px);
                }

                .church-secondary-btn {
                    background-color: var(--church-secondary);
                    color: var(--church-text);
                    border: 2px solid var(--church-secondary);
                    padding: 10px 22px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .church-secondary-btn:hover {
                    background-color: transparent;
                    color: var(--church-secondary);
                }

                .church-accent-text {
                    color: var(--church-accent);
                }

                .church-header {
                    background: linear-gradient(135deg, var(--church-primary) 0%, var(--church-secondary) 100%);
                    color: white;
                    padding: 20px;
                    text-align: center;
                }

                .church-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    margin: 10px;
                    border-left: 4px solid var(--church-primary);
                }

                .church-footer {
                    background-color: var(--church-text);
                    color: var(--church-background);
                    padding: 30px 20px;
                    text-align: center;
                }

                /* Responsividade */
                @media (max-width: 768px) {
                    .church-header {
                        padding: 15px;
                    }
                    
                    .church-card {
                        margin: 5px;
                        padding: 15px;
                    }
                }
            `;

            return css;
        } catch (error) {
            throw new Error(`Erro ao gerar CSS personalizado: ${error.message}`);
        }
    }

    /**
     * Escurece uma cor
     * @param {string} hexColor - Cor em hexadecimal
     * @param {number} factor - Fator de escurecimento (0-1)
     * @returns {string} Cor escurecida
     */
    darkenColor(hexColor, factor) {
        const hex = hexColor.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
        
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }

    /**
     * Gera paleta de cores complementares
     * @param {string} primaryColor - Cor primária
     * @returns {Object} Paleta de cores
     */
    generateColorPalette(primaryColor) {
        const hex = primaryColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Cor complementar (oposta no círculo cromático)
        const complementary = `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`;

        // Cores análogas (adjacentes no círculo cromático)
        const analogous1 = `#${((r + 30) % 255).toString(16).padStart(2, '0')}${((g + 30) % 255).toString(16).padStart(2, '0')}${((b + 30) % 255).toString(16).padStart(2, '0')}`;
        const analogous2 = `#${((r - 30 + 255) % 255).toString(16).padStart(2, '0')}${((g - 30 + 255) % 255).toString(16).padStart(2, '0')}${((b - 30 + 255) % 255).toString(16).padStart(2, '0')}`;

        // Cores triádicas (formando triângulo no círculo cromático)
        const triadic1 = `#${((r + 120) % 255).toString(16).padStart(2, '0')}${((g + 120) % 255).toString(16).padStart(2, '0')}${((b + 120) % 255).toString(16).padStart(2, '0')}`;
        const triadic2 = `#${((r + 240) % 255).toString(16).padStart(2, '0')}${((g + 240) % 255).toString(16).padStart(2, '0')}${((b + 240) % 255).toString(16).padStart(2, '0')}`;

        return {
            primary: primaryColor,
            complementary,
            analogous: [analogous1, analogous2],
            triadic: [triadic1, triadic2],
            monochromatic: [
                this.darkenColor(primaryColor, 0.2),
                this.darkenColor(primaryColor, 0.1),
                this.lightenColor(primaryColor, 0.1),
                this.lightenColor(primaryColor, 0.2)
            ]
        };
    }

    /**
     * Clareia uma cor
     * @param {string} hexColor - Cor em hexadecimal
     * @param {number} factor - Fator de clareamento (0-1)
     * @returns {string} Cor clareada
     */
    lightenColor(hexColor, factor) {
        const hex = hexColor.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + (255 * factor));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + (255 * factor));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + (255 * factor));
        
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }

    /**
     * Valida contraste de acessibilidade
     * @param {string} backgroundColor - Cor de fundo
     * @param {string} textColor - Cor do texto
     * @returns {Object} Resultado da validação
     */
    validateContrast(backgroundColor, textColor) {
        const bg = this.hexToRgb(backgroundColor);
        const text = this.hexToRgb(textColor);
        
        const bgLuminance = this.calculateLuminance(bg);
        const textLuminance = this.calculateLuminance(text);
        
        const contrastRatio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                             (Math.min(bgLuminance, textLuminance) + 0.05);
        
        return {
            ratio: contrastRatio,
            passesAA: contrastRatio >= 4.5,
            passesAAA: contrastRatio >= 7,
            level: this.getContrastLevel(contrastRatio)
        };
    }

    /**
     * Converte cor hexadecimal para RGB
     * @param {string} hex - Cor em hexadecimal
     * @returns {Object} Objeto RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Calcula luminância de uma cor
     * @param {Object} rgb - Objeto RGB
     * @returns {number} Luminância
     */
    calculateLuminance(rgb) {
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Obtém nível de contraste
     * @param {number} ratio - Razão de contraste
     * @returns {string} Nível
     */
    getContrastLevel(ratio) {
        if (ratio >= 7) return 'AAA';
        if (ratio >= 4.5) return 'AA';
        if (ratio >= 3) return 'A';
        return 'Fail';
    }

    /**
     * Obtém branding de uma igreja
     * @param {string} churchId - ID da igreja
     * @returns {Object} Branding
     */
    async getBranding(churchId) {
        try {
            const branding = await ChurchBranding.findOne({ churchId });
            if (!branding) {
                throw new Error('Branding não encontrado');
            }
            return branding;
        } catch (error) {
            throw new Error(`Erro ao obter branding: ${error.message}`);
        }
    }

    /**
     * Remove branding de uma igreja
     * @param {string} churchId - ID da igreja
     * @returns {boolean} Sucesso
     */
    async removeBranding(churchId) {
        try {
            const branding = await ChurchBranding.findOne({ churchId });
            if (!branding) return true;

            // Remove arquivos de imagem
            const imageFields = [
                ...Object.values(branding.logos || {}),
                ...Object.values(branding.coverImages || {})
            ];

            for (const imagePath of imageFields) {
                if (imagePath) {
                    try {
                        const fullPath = path.join(__dirname, '..', imagePath);
                        await fs.unlink(fullPath);
                    } catch (error) {
                        console.warn(`Arquivo não encontrado para remoção: ${imagePath}`);
                    }
                }
            }

            // Remove registro do banco
            await ChurchBranding.deleteOne({ churchId });
            return true;
        } catch (error) {
            throw new Error(`Erro ao remover branding: ${error.message}`);
        }
    }

    /**
     * Obtém estatísticas de branding
     * @returns {Object} Estatísticas
     */
    async getBrandingStats() {
        try {
            const totalBrandings = await ChurchBranding.countDocuments();
            const brandingsWithLogos = await ChurchBranding.countDocuments({
                $or: [
                    { 'logos.primary': { $exists: true, $ne: null } },
                    { 'logos.secondary': { $exists: true, $ne: null } }
                ]
            });
            const brandingsWithCovers = await ChurchBranding.countDocuments({
                $or: [
                    { 'coverImages.main': { $exists: true, $ne: null } },
                    { 'coverImages.events': { $exists: true, $ne: null } }
                ]
            });

            return {
                total: totalBrandings,
                withLogos: brandingsWithLogos,
                withCovers: brandingsWithCovers,
                percentageWithLogos: totalBrandings > 0 ? (brandingsWithLogos / totalBrandings) * 100 : 0,
                percentageWithCovers: totalBrandings > 0 ? (brandingsWithCovers / totalBrandings) * 100 : 0
            };
        } catch (error) {
            throw new Error(`Erro ao obter estatísticas: ${error.message}`);
        }
    }
}

module.exports = new ChurchBrandingService();