import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Substitua pela sua chave da WeatherAPI (gratuita, sem cartão)
// Obtenha gratuitamente em: https://www.weatherapi.com/signup.aspx
// Plano gratuito: 1 milhão de chamadas/mês, sem cartão de crédito!
const API_KEY = '7e51c021e5b74715a5e203228252311';
const API_URL = 'https://api.weatherapi.com/v1/current.json';

export default function App() {
  const [cidade, setCidade] = useState('');
  const [dadosClima, setDadosClima] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [historico, setHistorico] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  // Cidades sugeridas brasileiras
  const cidadesSugeridas = [
    '🏖️ Rio de Janeiro',
    '🏙️ São Paulo', 
    '🌴 Salvador',
    '⛰️ Belo Horizonte',
    '🎭 Brasília',
    '🌊 Florianópolis'
  ];

  // Função para buscar dados do clima
  const buscarClima = async () => {
    if (!cidade.trim()) {
      Alert.alert('Atenção', 'Por favor, digite o nome de uma cidade.');
      return;
    }

    if (API_KEY === 'SUA_CHAVE_API_AQUI') {
      Alert.alert(
        'Configuração necessária',
        'Por favor, adicione sua chave da WeatherAPI no arquivo App.js. Obtenha grátis (sem cartão) em: weatherapi.com'
      );
      return;
    }

    setCarregando(true);
    setErro('');
    setDadosClima(null);

    try {
      const response = await fetch(
        `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(cidade)}&lang=pt`
      );

      const data = await response.json();

      if (response.ok) {
        // Corrigir nome do país
        let nomePais = data.location.country;
        if (nomePais === 'Brazil' || nomePais === 'Brésil') {
          nomePais = 'Brasil';
        }
        
        // Traduzir e melhorar descrição do clima
        let descricaoClima = data.current.condition.text;
        const traducoes = {
          'Partly cloudy': 'Parcialmente nublado',
          'Partly Cloudy': 'Parcialmente nublado',
          'Cloudy': 'Nublado',
          'Overcast': 'Nublado',
          'Mist': 'Neblina',
          'Fog': 'Nevoeiro',
          'Foggy': 'Nevoeiro',
          'Clear': 'Céu limpo',
          'Sunny': 'Ensolarado',
          'Light rain': 'Chuva leve',
          'Moderate rain': 'Chuva moderada',
          'Heavy rain': 'Chuva forte',
          'Light rain shower': 'Pancadas de chuva',
          'Moderate or heavy rain shower': 'Pancadas fortes',
          'Patchy rain possible': 'Possibilidade de chuva',
          'Patchy light rain': 'Chuva fraca irregular',
          'Moderate rain at times': 'Chuva moderada intermitente',
          'Heavy rain at times': 'Chuva forte intermitente',
          'Thundery outbreaks possible': 'Possibilidade de trovoadas',
          'Light drizzle': 'Garoa leve',
          'Freezing drizzle': 'Garoa congelante',
          'Heavy freezing drizzle': 'Garoa congelante forte',
          'Patchy light drizzle': 'Garoa irregular',
          'Light snow': 'Neve leve',
          'Moderate snow': 'Neve moderada',
          'Heavy snow': 'Neve forte',
          'Blowing snow': 'Nevasca',
          'Blizzard': 'Tempestade de neve',
          'Patchy snow possible': 'Possibilidade de neve',
          'Patchy sleet possible': 'Possibilidade de granizo',
          'Patchy freezing drizzle possible': 'Possibilidade de garoa congelante',
          'Thunderstorm': 'Tempestade',
          'Thunder': 'Trovoada',
          'Ice pellets': 'Granizo',
          'Light sleet': 'Granizo leve',
          'Moderate or heavy sleet': 'Granizo moderado ou forte'
        };
        descricaoClima = traducoes[descricaoClima] || descricaoClima;
        
        // Adaptar formato da WeatherAPI para o formato usado no app
        const dadosAdaptados = {
          name: data.location.name,
          sys: { country: nomePais },
          main: {
            temp: data.current.temp_c,
            feels_like: data.current.feelslike_c,
            humidity: data.current.humidity
          },
          weather: [{
            main: obterCondicaoPrincipal(data.current.condition.code),
            description: descricaoClima
          }],
          wind: {
            speed: data.current.wind_kph / 3.6 // Converter km/h para m/s
          }
        };
        setDadosClima(dadosAdaptados);
        
        // Adicionar ao histórico (sem duplicatas)
        const nomeCidade = data.location.name;
        setHistorico(prev => {
          const novoHistorico = [nomeCidade, ...prev.filter(c => c !== nomeCidade)];
          return novoHistorico.slice(0, 5); // Manter apenas 5 últimas
        });
        setMostrarHistorico(false);
      } else {
        // Melhorar mensagem de erro
        let mensagemErro = data.error?.message || 'Erro desconhecido';
        if (mensagemErro.includes('No matching location found')) {
          mensagemErro = 'Cidade não encontrada. Verifique o nome e tente novamente.';
        }
        setErro(mensagemErro);
      }
    } catch (error) {
      setErro('Erro ao buscar dados. Verifique sua conexão com a internet.');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Função para buscar cidade do histórico ou sugerida
  const buscarCidadeRapida = async (nomeCidade) => {
    // Remover emoji se houver
    const cidadeLimpa = nomeCidade.replace(/[^\w\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ-]/g, '').trim();
    
    if (!cidadeLimpa) return;
    
    setCidade(cidadeLimpa);
    setMostrarHistorico(false);
    setCarregando(true);
    setErro('');
    setDadosClima(null);

    try {
      const response = await fetch(
        `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(cidadeLimpa)}&lang=pt`
      );

      const data = await response.json();

      if (response.ok) {
        // Corrigir nome do país
        let nomePais = data.location.country;
        if (nomePais === 'Brazil' || nomePais === 'Brésil') {
          nomePais = 'Brasil';
        }
        
        // Traduzir descrição
        let descricaoClima = data.current.condition.text;
        const traducoes = {
          'Partly cloudy': 'Parcialmente nublado',
          'Partly Cloudy': 'Parcialmente nublado',
          'Cloudy': 'Nublado',
          'Overcast': 'Nublado',
          'Mist': 'Neblina',
          'Fog': 'Nevoeiro',
          'Clear': 'Céu limpo',
          'Sunny': 'Ensolarado',
          'Light rain': 'Chuva leve',
          'Moderate rain': 'Chuva moderada',
          'Heavy rain': 'Chuva forte',
          'Patchy rain possible': 'Possibilidade de chuva',
          'Thundery outbreaks possible': 'Possibilidade de trovoadas'
        };
        descricaoClima = traducoes[descricaoClima] || descricaoClima;
        
        const dadosAdaptados = {
          name: data.location.name,
          sys: { country: nomePais },
          main: {
            temp: data.current.temp_c,
            feels_like: data.current.feelslike_c,
            humidity: data.current.humidity
          },
          weather: [{
            main: obterCondicaoPrincipal(data.current.condition.code),
            description: descricaoClima
          }],
          wind: {
            speed: data.current.wind_kph / 3.6
          }
        };
        
        setDadosClima(dadosAdaptados);
        
        // Adicionar ao histórico
        const nomeCidadeHistorico = data.location.name;
        setHistorico(prev => {
          const novoHistorico = [nomeCidadeHistorico, ...prev.filter(c => c !== nomeCidadeHistorico)];
          return novoHistorico.slice(0, 5);
        });
      } else {
        let mensagemErro = data.error?.message || 'Erro desconhecido';
        if (mensagemErro.includes('No matching location found')) {
          mensagemErro = 'Cidade não encontrada. Verifique o nome e tente novamente.';
        }
        setErro(mensagemErro);
      }
    } catch (error) {
      setErro('Erro ao buscar dados. Verifique sua conexão com a internet.');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Função para limpar histórico
  const limparHistorico = () => {
    Alert.alert(
      'Limpar Histórico',
      'Deseja realmente limpar todo o histórico de buscas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: () => {
            setHistorico([]);
            setMostrarHistorico(false);
          }
        }
      ]
    );
  };

  // Função para mapear código da WeatherAPI para condição principal
  const obterCondicaoPrincipal = (code) => {
    // Códigos da WeatherAPI: https://www.weatherapi.com/docs/weather_conditions.json
    if (code === 1000) return 'Clear'; // Sunny/Clear
    if ([1003, 1006, 1009].includes(code)) return 'Clouds'; // Cloudy
    if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return 'Rain';
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'Thunderstorm';
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return 'Snow';
    if ([1030, 1135, 1147].includes(code)) return 'Mist';
    if ([1168, 1171, 1198, 1201, 1204, 1207, 1237, 1249, 1252, 1261, 1264].includes(code)) return 'Drizzle';
    return 'Clear';
  };

  // Função para obter o ícone do clima
  const obterIconeClima = (condicao) => {
    const icones = {
      Clear: 'sunny',
      Clouds: 'cloudy',
      Rain: 'rainy',
      Drizzle: 'rainy',
      Thunderstorm: 'thunderstorm',
      Snow: 'snow',
      Mist: 'cloud',
      Smoke: 'cloud',
      Haze: 'cloud',
      Dust: 'cloud',
      Fog: 'cloud',
      Sand: 'cloud',
      Ash: 'cloud',
      Squall: 'cloud',
      Tornado: 'cloud'
    };

    return icones[condicao] || 'partly-sunny';
  };

  // Função para obter a cor de fundo baseada no clima
  const obterCorFundo = (condicao) => {
    const cores = {
      Clear: '#FFA726',        // Laranja ensolarado
      Clouds: '#78909C',       // Cinza azulado nublado
      Rain: '#5C6BC0',         // Azul chuva
      Drizzle: '#7E57C2',      // Roxo garoa
      Thunderstorm: '#455A64', // Cinza escuro tempestade
      Snow: '#81D4FA',         // Azul claro neve
      Mist: '#90A4AE'          // Cinza névoa
    };

    return cores[condicao] || '#42A5F5';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="partly-sunny" size={55} color="#fff" />
            </View>
            <Text style={styles.titulo}>Previsão do Tempo</Text>
            <Text style={styles.subtitulo}>Consulte o clima em qualquer cidade</Text>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity 
              onPress={() => setMostrarHistorico(!mostrarHistorico)}
              style={styles.botaoHistorico}
            >
              <Ionicons 
                name={mostrarHistorico ? "time" : "time-outline"} 
                size={22} 
                color="#2E88C7" 
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da cidade (ex: Maricá, São Paulo)"
              placeholderTextColor="#999"
              value={cidade}
              onChangeText={setCidade}
              onSubmitEditing={buscarClima}
              onFocus={() => setMostrarHistorico(false)}
              returnKeyType="search"
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={styles.botao}
              onPress={buscarClima}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="search" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Sugestões de cidades */}
          {!dadosClima && !carregando && !erro && !mostrarHistorico && (
            <View style={styles.sugestoesContainer}>
              <Text style={styles.sugestoesTitulo}>🌟 Cidades Populares</Text>
              <View style={styles.sugestoesGrid}>
                {cidadesSugeridas.map((cidadeSugerida, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.cidadeSugerida}
                    onPress={() => buscarCidadeRapida(cidadeSugerida)}
                  >
                    <Text style={styles.cidadeSugeridaTexto}>{cidadeSugerida}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Histórico de buscas */}
          {mostrarHistorico && historico.length > 0 && (
            <View style={styles.historicoContainer}>
              <View style={styles.historicoHeader}>
                <Text style={styles.historicoTitulo}>📍 Buscas Recentes</Text>
                <TouchableOpacity onPress={limparHistorico}>
                  <Text style={styles.limparTexto}>Limpar</Text>
                </TouchableOpacity>
              </View>
              {historico.map((cidadeHistorico, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.itemHistorico}
                  onPress={() => buscarCidadeRapida(cidadeHistorico)}
                >
                  <Ionicons name="location" size={20} color="#2E88C7" />
                  <Text style={styles.itemHistoricoTexto}>{cidadeHistorico}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {erro ? (
            <View style={styles.erroContainer}>
              <Ionicons name="warning" size={40} color="#ff6b6b" />
              <Text style={styles.erroTexto}>{erro}</Text>
              <TouchableOpacity 
                style={styles.botaoTentarNovamente}
                onPress={() => {
                  setErro('');
                  setCidade('');
                }}
              >
                <Ionicons name="refresh-circle" size={20} color="#C53030" />
                <Text style={styles.botaoTentarNovamenteTexto}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {dadosClima ? (
            <View
              style={[
                styles.resultadoContainer,
                {
                  backgroundColor: obterCorFundo(dadosClima.weather[0].main)
                }
              ]}
            >
              {/* Botão voltar ao topo */}
              <TouchableOpacity 
                style={styles.botaoVoltar}
                onPress={() => {
                  setDadosClima(null);
                  setErro('');
                  setCidade('');
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.cidadeNome}>
                {dadosClima.name}, {dadosClima.sys.country}
              </Text>

              <View style={styles.iconeContainer}>
                <Ionicons
                  name={obterIconeClima(dadosClima.weather[0].main)}
                  size={100}
                  color="#fff"
                />
              </View>

              <Text style={styles.temperatura}>
                {Math.round(dadosClima.main.temp)}°C
              </Text>

              <Text style={styles.descricao}>
                {dadosClima.weather[0].description.charAt(0).toUpperCase() +
                  dadosClima.weather[0].description.slice(1)}
              </Text>

              {/* Botão de atualizar */}
              <TouchableOpacity 
                style={styles.botaoAtualizar}
                onPress={() => buscarCidadeRapida(dadosClima.name)}
                disabled={carregando}
              >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.botaoAtualizarTexto}>Atualizar</Text>
              </TouchableOpacity>

              <View style={styles.detalhesContainer}>
                <View style={styles.detalheItem}>
                  <Ionicons name="water" size={24} color="#fff" />
                  <Text style={styles.detalheTexto}>
                    {dadosClima.main.humidity}%
                  </Text>
                  <Text style={styles.detalheLabel}>Umidade</Text>
                </View>

                <View style={styles.detalheItem}>
                  <Ionicons name="speedometer" size={24} color="#fff" />
                  <Text style={styles.detalheTexto}>
                    {Math.round(dadosClima.wind.speed * 3.6)} km/h
                  </Text>
                  <Text style={styles.detalheLabel}>Vento</Text>
                </View>

                <View style={styles.detalheItem}>
                  <Ionicons name="thermometer" size={24} color="#fff" />
                  <Text style={styles.detalheTexto}>
                    {Math.round(dadosClima.main.feels_like)}°C
                  </Text>
                  <Text style={styles.detalheLabel}>Sensação</Text>
                </View>
              </View>

              {/* Botão Nova Busca */}
              <TouchableOpacity 
                style={styles.botaoNovaBusca}
                onPress={() => {
                  setDadosClima(null);
                  setErro('');
                  setCidade('');
                }}
              >
                <Ionicons name="search-outline" size={22} color="#fff" />
                <Text style={styles.botaoNovaBuscaTexto}>Nova Busca</Text>
              </TouchableOpacity>
            </View>
          ) : (
            !carregando &&
            !erro && (
              <View style={styles.placeholderContainer}>
                <Ionicons name="partly-sunny" size={80} color="#ccc" />
                <Text style={styles.placeholderTexto}>
                  Digite uma cidade e busque a previsão do tempo
                </Text>
              </View>
            )
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8'
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20
  },
  header: {
    backgroundColor: '#2E88C7',
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#2E88C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8
  },
  headerIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
    letterSpacing: 0.3
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#2E88C7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2.5,
    borderColor: '#B8DCF0'
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 8,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500'
  },
  botao: {
    backgroundColor: '#2E88C7',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    shadowColor: '#2E88C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4
  },
  erroContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    backgroundColor: '#FFF5F5',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEB2B2',
    shadowColor: '#fc8181',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  erroTexto: {
    color: '#C53030',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600'
  },
  resultadoContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 35,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12
  },
  cidadeNome: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  iconeContainer: {
    marginVertical: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 80,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5
  },
  temperatura: {
    fontSize: 82,
    fontWeight: '900',
    color: '#fff',
    marginVertical: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6
  },
  descricao: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 35,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  detalhesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  detalheItem: {
    alignItems: 'center',
    flex: 1
  },
  detalheTexto: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  detalheLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    opacity: 0.95,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60
  },
  placeholderTexto: {
    fontSize: 18,
    color: '#7B8A99',
    textAlign: 'center',
    marginTop: 25,
    lineHeight: 26,
    fontWeight: '500'
  },
  botaoHistorico: {
    paddingLeft: 15,
    paddingRight: 10,
    justifyContent: 'center'
  },
  sugestoesContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#2E88C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  sugestoesTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center'
  },
  sugestoesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  cidadeSugerida: {
    backgroundColor: '#E8F4F8',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 22,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C5E5F5',
    shadowColor: '#2E88C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3
  },
  cidadeSugeridaTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E88C7',
    letterSpacing: 0.3
  },
  historicoContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#2E88C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F4F8'
  },
  historicoTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C3E50'
  },
  limparTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C53030'
  },
  itemHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#F8FBFC'
  },
  itemHistoricoTexto: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginLeft: 10
  },
  botaoAtualizar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2
  },
  botaoAtualizarTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  botaoVoltar: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4
  },
  botaoNovaBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  botaoNovaBuscaTexto: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5
  },
  botaoTentarNovamente: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#FEB2B2',
    shadowColor: '#C53030',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  botaoTentarNovamenteTexto: {
    color: '#C53030',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.3
  }
});
