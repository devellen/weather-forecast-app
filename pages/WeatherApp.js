import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Alert, Modal, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Input, Button } from "@rneui/themed";
import axios from "axios";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [city, setCity] = useState("Camaragibe");
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`https://api.hgbrasil.com/weather`, {
        params: {
          key: "3c01ddcc",
          city_name: city,
        },
      });

      // Verificar se os dados da resposta estão corretos
      if (response.data && response.data.results) {
        setWeather(response.data.results);
      } else {
        throw new Error("Dados inválidos da API");
      }
    } catch (err) {
      console.error("Erro ao buscar dados climáticos:", err);
      setError("Não foi possível carregar os dados do clima.");
      Alert.alert("Erro", "Não foi possível carregar os dados do clima.");
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = () => {
    setCity(newCity);
    setModalVisible(false);
    setNewCity("");
  };

  const iconMapping = {
    clear_day: 'sunny-outline',       // Dia claro
    clear_night: 'moon-outline',      // Noite clara
    rain: 'rainy-outline',            // Chuva
    storm: 'thunderstorm-outline',     // Tempestade
    snow: 'snow-outline',             // Neve
    hail: 'cloudy-outline',           // Granizo (substituto)
    fog: 'cloudy-outline',            // Névoa
    cloudly_day: 'partly-sunny-outline', // Parcialmente nublado
    cloudly_night: 'cloudy-night-outline', // Parcialmente nublado à noite
    cloud: 'cloud-outline',          // Nublado
    none_day: 'sunny-outline',        // Sem informações durante o dia
    none_night: 'moon-outline',       // Sem informações durante a noite
    default: 'cloud-outline',         // Ícone padrão
  };

  // Função para buscar o ícone correspondente
  const getWeatherIcon = (condition) => {
    return iconMapping[condition] || iconMapping['default'];
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error) return <Text>{error}</Text>;

  if (!weather) return <Text>Erro ao carregar dados climáticos.</Text>;
  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha a cidade</Text>
            <Input placeholder="Cidade" value={newCity}
              onChangeText={setNewCity} />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCityChange}
            >
              <Text style={styles.closeButtonText}>Confirmar</Text>
            </TouchableOpacity >
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="location-outline" size={24} color="#fff" />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.locationText}>{weather.city}</Text>
          </TouchableOpacity>
          <Icon name="notifications-outline" size={24} color="#fff" />
        </View>

        {/* Temperature and Weather Icon */}
        <View style={styles.weatherInfo}>
          <Icon
            name={getWeatherIcon(weather.condition_slug)}
            size={100}
            color="#fff"
          />
          <Text style={styles.temperature}>{weather.temp}°</Text>
          <Text style={styles.weatherDescription}>{weather.description}</Text>
          <Text style={styles.minMax}>Max.: {weather.forecast[0].max}° Min.: {weather.forecast[0].min}°</Text>
        </View>

        {/* Weather Details */}
        <View style={styles.weatherDetails}>
          <View style={styles.detailItem}>
            <Icon name="water-outline" size={20} color="#fff" />
            <Text style={styles.detailText}>{weather.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="cloud-outline" size={20} color="#fff" />
            <Text style={styles.detailText}>{weather.cloudiness}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="speedometer-outline" size={20} color="#fff" />
            <Text style={styles.detailText}>{weather.wind_speedy}</Text>
          </View>
        </View>

        {/* Today's Forecast */}
        <View style={styles.forecastToday}>
          <View style={styles.headerToday}>
            <Text style={styles.sectionTitle}>Hoje</Text>
            <Text style={styles.sectionTitleDate}>{weather.date}</Text>
          </View>

          <View style={styles.forecastHours}>
            {/* Repeat for each hour */}
            {weather.forecast.slice(0,4).map((hour, index) => {
              return (
                <View key={index} style={styles.hourItem}>
                  <Text style={styles.hourText}>{hour.time}</Text>
                  <Icon name={getWeatherIcon(hour.condition)} size={20} color="#fff" />
                  <Text style={styles.hourTemp}>{hour.temp}°C</Text>
                </View>
              )
            })}

          </View>
        </View>

        {/* Next Forecast */}
        <View style={styles.nextForecast}>
          <Text style={styles.sectionTitle}>Próximas Previsões</Text>
          {weather.forecast.slice(1, 7).map((day, index) => {
            return (
              <View key={index} style={styles.forecastDays}>
                <Text style={styles.dayText}>{day.weekday}</Text>
                <Icon
                  name={getWeatherIcon(day.condition)}
                  size={25}
                  color="#fff"
                />
                <Text style={styles.dayTemp}>{day.max}° - {day.min}°</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 35,
  },
  locationText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  weatherInfo: {
    alignItems: "center",
    marginVertical: 16,
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  temperature: {
    fontSize: 48,
    color: "#fff",
  },
  weatherDescription: {
    color: "#fff",
    fontSize: 16,
  },
  minMax: {
    color: "#fff",
    fontSize: 14,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  detailItem: {
    alignItems: "center",
  },
  detailText: {
    color: "#fff",
    fontSize: 14,
  },
  forecastToday: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
  },
  headerToday: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionTitleDate: {
    color: "#fff",
    fontWeight: "bold"
  },
  forecastHours: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  hourItem: {
    alignItems: "center",
  },
  hourText: {
    color: "#fff",
    fontSize: 14,
  },
  hourTemp: {
    color: "#fff",
    fontSize: 14,
  },
  nextForecast: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 16,
  },
  forecastDays: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  dayText: {
    color: "#fff",
    fontSize: 14,
  },
  dayTemp: {
    color: "#fff",
    fontSize: 14,
  },
  icon: {
    width: 25,
    height: 25,
    backgroundColor: 'black'
  }
});
