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
  rust: ["#000000", "#FF4500"],
  cpp: ["#0000FF", "#8A2BE2"],
};

// Card component for each language result
const LanguageCard = ({ langId, score }: { langId: string; score: number }) => {
  const language = LANGUAGES.find((lang) => lang.id === langId);
  if (!language) return null;

  const gradientColors: [string, string] = languageColors[language.id] || ["#000000", "#434343"];

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradientColors}
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
  const parsedResults: { langId: string; score: number }[] = results
    ? JSON.parse(results)
    : [];

  // Filter out languages with 0% score
  const filteredResults = parsedResults.filter(result => result.score > 0);

  if (filteredResults.length === 0) {
    return (
      <LinearGradient colors={["#1E1E1E", "#121212"]} style={styles.container}>
        <View style={styles.noResultsContainer}>
          <Text style={styles.errorText}>Hiç eşleşme bulunamadı! Belki de sorulara verdiğin cevapları gözden geçirmek istersin.</Text>
          <Pressable
            style={styles.button}
            onPress={() => router.replace("/quiz")}
          >
            <Text style={styles.buttonText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  const titleText = `İşte Senin İçin En İyi ${filteredResults.length} Eşleşme:`;

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
        <Text style={styles.title}>{titleText}</Text>
        {filteredResults.map((result) => (
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B", // Slightly softer red for error
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 25,
  },
});

export default ResultsScreen;
