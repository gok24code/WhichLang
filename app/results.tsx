import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LANGUAGES } from "../data/quiz";

const languageColors: { [key: string]: string[] } = {
  python: ["#4DEDC4", "#30CC7C"],
  javascript: ["#FFD700", "#FFA500"],
  typescript: ["#00BFFF", "#1E90FF"],
  java: ["#FF4500", "#FF6347"],
  csharp: ["#BA55D3", "#9370DB"],
  go: ["#3CB371", "#2E8B57"],
  rust: ["#FF00FF", "#FF00FF"],
  cpp: ["#ff0000", "#ff4500"],
};

// Card component for each language result
const LanguageCard = ({ langId, score }: { langId: string; score: number }) => {
  const language = LANGUAGES.find((lang) => lang.id === langId);
  if (!language) return null;

  const gradientColors = languageColors[language.id] || ["#A1FFCE", "#FAFFD1"];

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        style={styles.cardHeader}
      >
        <Text style={styles.langName}>{language.name}</Text>
        <Text style={styles.score}>{score}%</Text>
      </LinearGradient>
      <View style={styles.cardBody}>
        <Text style={styles.description}>{language.description}</Text>
        <Pressable
          style={styles.infoButton}
          onPress={() => WebBrowser.openBrowserAsync(language.url)}
        >
          <Text style={styles.infoButtonText}>Daha Fazla Bilgi</Text>
        </Pressable>
      </View>
    </View>
  );
};

const ResultsScreen = () => {
  const router = useRouter();
  const { results } = useLocalSearchParams<{ results: string }>();
  const topResults: { langId: string; score: number }[] = results
    ? JSON.parse(results)
    : [];

  if (topResults.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sonuç bulunamadı!</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#1E1E1E", "#121212"]} style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sonuçlar",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#1E1E1E" },
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>İşte Senin İçin En İyi 3 Eşleşme:</Text>
        {topResults.map((result) => (
          <LanguageCard
            key={result.langId}
            langId={result.langId}
            score={result.score}
          />
        ))}
        <Pressable
          style={styles.button}
          onPress={() => router.replace("/quiz")}
        >
          <Text style={styles.buttonText}>Tekrar Dene</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  langName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E1E",
  },
  score: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E1E1E",
  },
  cardBody: {
    padding: 20,
  },
  description: {
    fontSize: 15,
    color: "#E0E0E0",
    marginBottom: 20,
    lineHeight: 22,
  },
  infoButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  infoButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4DEDC4",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: "#1E1E1E",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default ResultsScreen;
