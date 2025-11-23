# 🌤️ App de Previsão do Tempo

Aplicativo móvel simples para consultar a previsão do tempo de qualquer cidade do mundo, desenvolvido com React Native e Expo.

## 📱 Funcionalidades

### Core Features ⭐
- ✅ Busca de previsão do tempo por nome da cidade (com suporte a acentos!)
- ✅ Exibição de temperatura atual em Celsius
- ✅ Descrição do clima traduzida para português
- ✅ Ícones dinâmicos representando condições climáticas
- ✅ Informações adicionais: umidade, velocidade do vento e sensação térmica
- ✅ Cores de fundo que mudam conforme o clima

### Funcionalidades Extras 🎯
- ✅ **Histórico de Buscas** - Salva as 5 últimas cidades pesquisadas
- ✅ **Sugestões de Cidades** - Cidades brasileiras populares com acesso rápido
- ✅ **Botão Atualizar** - Recarrega os dados da cidade atual
- ✅ **Suporte a Caracteres Especiais** - Funciona com Maricá, São Paulo, etc.
- ✅ **Interface Premium** - Design moderno com sombras e animações
- ✅ **+30 Traduções Climáticas** - Todas as condições em português

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para facilitar o desenvolvimento
- **OpenWeatherMap API** - API pública de dados meteorológicos
- **@expo/vector-icons** - Biblioteca de ícones

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Aplicativo **Expo Go** no seu dispositivo móvel ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

## 🔑 Configuração da API (100% Gratuita!)

1. Acesse [WeatherAPI](https://www.weatherapi.com/signup.aspx)
2. Crie uma conta **gratuita** (não precisa de cartão de crédito! 🎉)
3. Após o login, copie sua **API Key** do painel
4. Abra o arquivo `App.js`
5. Substitua `'SUA_CHAVE_API_AQUI'` pela sua chave:

```javascript
const API_KEY = 'sua_chave_api_real_aqui';
```

**Plano Gratuito**: 1 milhão de chamadas por mês - mais que suficiente!

## ⚙️ Instalação

1. Clone ou baixe este repositório

2. Navegue até a pasta do projeto:
```bash
cd app-clima
```

3. Instale as dependências:
```bash
npm install
```

ou

```bash
yarn install
```

## 🎮 Como Executar

1. Inicie o servidor Expo:
```bash
npm start
```

ou

```bash
expo start
```

2. Um QR code será exibido no terminal e no navegador

3. Abra o aplicativo **Expo Go** no seu smartphone

4. Escaneie o QR code:
   - **Android**: Use o leitor de QR code do Expo Go
   - **iOS**: Use a câmera nativa do iPhone

5. O aplicativo será carregado no seu dispositivo

## 📱 Como Usar

1. Digite o nome de uma cidade no campo de texto
2. Pressione o botão de busca (ícone de lupa) ou a tecla Enter
3. Aguarde o carregamento dos dados
4. Visualize as informações do clima:
   - Nome da cidade e país
   - Temperatura atual
   - Descrição do clima
   - Umidade
   - Velocidade do vento
   - Sensação térmica

## 🎨 Estrutura do Projeto

```
app-clima/
├── App.js              # Componente principal do aplicativo
├── package.json        # Dependências e scripts
├── app.json           # Configurações do Expo
├── babel.config.js    # Configuração do Babel
├── .gitignore         # Arquivos ignorados pelo Git
└── README.md          # Documentação do projeto
```

## 🌐 API Utilizada

**WeatherAPI** (100% Gratuita, sem cartão!)
- Endpoint: `https://api.weatherapi.com/v1/current.json`
- Parâmetros:
  - `key`: Chave da API
  - `q`: Nome da cidade
  - `lang=pt`: Descrições em português
- **Plano Gratuito**: 1 milhão de requisições/mês
- **Sem cartão de crédito necessário!** ✨

## 🎯 Recursos Implementados

### Interface de Usuário (UI)
- ✅ Campo de entrada de texto para nome da cidade
- ✅ Botão de busca com ícone
- ✅ Área de exibição de resultados
- ✅ Indicador de carregamento (ActivityIndicator)
- ✅ Mensagens de erro amigáveis
- ✅ Design responsivo e moderno

### Consumo de API
- ✅ Requisições HTTP com fetch
- ✅ Tratamento de erros de rede
- ✅ Validação de entrada do usuário
- ✅ Processamento de resposta JSON

### Exibição de Dados
- ✅ Nome da cidade e país
- ✅ Temperatura atual em Celsius
- ✅ Descrição do clima em português
- ✅ Ícones dinâmicos baseados no clima
- ✅ Informações extras (umidade, vento, sensação térmica)
- ✅ Cores de fundo dinâmicas

## 🎨 Ícones por Condição Climática

| Condição | Ícone |
|----------|-------|
| Céu limpo | ☀️ sunny |
| Nublado | ☁️ cloudy |
| Chuva | 🌧️ rainy |
| Tempestade | ⛈️ thunderstorm |
| Neve | ❄️ snow |
| Neblina | 🌫️ cloud |

## 🔧 Possíveis Melhorias Futuras

- [ ] Previsão para os próximos dias
- [ ] Localização automática (GPS)
- [ ] Histórico de buscas
- [ ] Favoritar cidades
- [ ] Modo escuro/claro
- [ ] Gráficos de temperatura
- [ ] Notificações de alertas climáticos
- [ ] Suporte a múltiplos idiomas

## ⚠️ Solução de Problemas

### Erro "API Key inválida"
- Verifique se você inseriu a chave correta no `App.js`
- Confirme se copiou a chave completa do painel da WeatherAPI
- A chave é ativada instantaneamente após o cadastro!

### Erro "Cidade não encontrada"
- Verifique a ortografia do nome da cidade
- Tente usar o nome em inglês
- Use nomes de cidades maiores ou mais conhecidas

### Erro de conexão
- Verifique sua conexão com a internet
- Certifique-se de que o dispositivo está na mesma rede
