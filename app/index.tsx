import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from '../components/SplashScreen';

const HomeScreen = () => {
  const router = useRouter();
  const [isSplashFinished, setSplashFinished] = useState(false);

  if (!isSplashFinished) {
    return <SplashScreen onAnimationComplete={() => setSplashFinished(true)} />;
  }

  return (
    <LinearGradient colors={['#1E1E1E', '#121212']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>WhichLang?</Text>
          <Text style={styles.subtitle}>
            Hangi programlama dilinin sana uygun olduğunu bulmak için kısa bir teste gir.
          </Text>
          <Pressable style={styles.button} onPress={() => router.push('/quiz')}>
            <Text style={styles.buttonText}>Teste Başla</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#4DEDC4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#1E1E1E',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
