## Design System — Igreja & Comunidade (Mobile/Web)

### Identidade visual
- **Cores**
  - Primária Azul `--color-primary: #1E5AA6` (websafe contraste alto)
  - Primária Escura `--color-primary-600: #17467F`
  - Primária Clara `--color-primary-100: #E6F0FA`
  - Dourado Premium `--color-accent: #C9A227`
  - Fundo Claro `--color-bg: #FFFFFF`
  - Fundo Escuro `--color-bg-dark: #0C1116`
  - Texto Primário `--color-text: #0B0F14`
  - Texto Secundário `--color-text-2: #445266`
  - Sucesso `--color-success: #1F8A70`, Atenção `--color-warning: #EFB700`, Erro `--color-danger: #D64545`

- **Semânticas**
  - `--surface-1`, `--surface-2` (elevação sutil)
  - `--border-default`, `--border-muted`
  - `--brand-premium` (dourado para badges, CTAs premium)

### Tipografia
- Família: Inter (Fallback: System, Roboto, -apple-system)
- Escalas
  - Display 32/40, Title 24/32, Heading 20/28, Subheading 16/24, Body 16/24, Caption 14/20, Micro 12/16
- Pesos: 400, 500, 600, 700

### Ícones
- Biblioteca: Phosphor/Feather (estilo stroke, minimalista)
- Tamanhos: 16, 20, 24, 28, 32; cores seguem `--color-text`/`--color-primary`/`--color-accent`

### Espaçamento e Grid
- Base 4px (4, 8, 12, 16, 24, 32, 40)
- Raio `8px` padrão, `12px` para cards, `999px` para pill
- Sombra sutil: `shadow-1` (1px spread), `shadow-2` (2-4px)

### Estados
- Botões: default, hover, pressed, disabled, loading
- Inputs: default, focus (anéis azul), error, success, disabled
- Tema claro/escuro com tokens paralelos

### Componentes (RN/Expo + Web)
- Atômicos: Button, IconButton, Text, Input, Select, Switch, Badge, Tag, Chip
- Compostos: Card, ListItem, Modal/Sheet, Tabs, Accordion, Toast/Snackbar, EmptyState
- Páginas: AppBar/TopBar, BottomTabs, Drawer (dashboard), SearchBar, FilterBar, MapMarker

### Diretrizes de Acessibilidade
- Contraste AA/AAA, foco visível, labels, hit target ≥ 44x44, suporte a leitor de tela

### Tokens (JSON)
```json
{
  "color": {
    "primary": "#1E5AA6",
    "primary600": "#17467F",
    "primary100": "#E6F0FA",
    "accent": "#C9A227",
    "bg": "#FFFFFF",
    "bgDark": "#0C1116",
    "text": "#0B0F14",
    "text2": "#445266",
    "success": "#1F8A70",
    "warning": "#EFB700",
    "danger": "#D64545"
  },
  "radius": {"sm": 8, "md": 12, "xl": 999},
  "space": [4,8,12,16,24,32,40],
  "font": {
    "family": "Inter",
    "size": {"display": 32, "title": 24, "h1": 20, "h2": 16, "body": 16, "caption": 14, "micro": 12},
    "line": {"display": 40, "title": 32, "h1": 28, "h2": 24, "body": 24, "caption": 20, "micro": 16},
    "weight": [400,500,600,700]
  }
}
```

### Exemplos de Uso (React Native/Expo)
```tsx
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

type ButtonProps = { label: string; loading?: boolean; onPress?: () => void };

export function PrimaryButton({ label, loading, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={{
        backgroundColor: '#1E5AA6',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center'
      }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
```

### Exemplos de tokens (Web CSS variables)
```css
:root {
  --color-primary: #1E5AA6;
  --color-accent: #C9A227;
  --color-bg: #FFFFFF;
  --color-text: #0B0F14;
}
[data-theme="dark"] {
  --color-bg: #0C1116;
  --color-text: #E6EDF3;
}
```

### Entregáveis
- Biblioteca de componentes base (RN/Expo + RN Web)
- Arquivo de tokens (JSON) e tema claro/escuro
- Guia de uso no Figma (protótipo navegável)
