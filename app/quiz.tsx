import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Pressable } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { QUESTIONS, LANGUAGES, Language } from '../data/quiz';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// [Imports remain the same]

const QuizScreen = () => {
  const router = useRouter();
  const swiperRef = useRef<Swiper<any>>(null);
  const [shuffledQuestions] = useState(() => shuffleArray(QUESTIONS));
  const [userScores, setUserScores] = useState<{ [key: string]: number }>({});
  const pan = useRef(new Animated.ValueXY()).current;
  const entranceAnim = useRef(new Animated.Value(0)).current; // For entrance animation
  const [quizFinished, setQuizFinished] = useState(false);
  const [bestMatchLanguage, setBestMatchLanguage] = useState<any[]>([]);
  const [rightSwipedTraits, setRightSwipedTraits] = useState<string[]>([]);
  const [leftSwipedTraits, setLeftSwipedTraits] = useState<string[]>([]); // New state for left swipes

  React.useEffect(() => {
    // Entrance animation
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const onSwiped = (cardIndex: number, direction: 'left' | 'right') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pan.setValue({ x: 0, y: 0 }); // Reset pan position
    const trait = QUESTIONS[cardIndex].trait;
    // Record the swipe
    if (direction === 'right') {
      setUserScores((prevScores) => ({
        ...prevScores,
        [trait]: (prevScores[trait] || 0) + 1,
      }));
      setRightSwipedTraits(prev => [...prev, trait]);
    } else if (direction === 'left') {
      setLeftSwipedTraits(prev => [...prev, trait]); // Add to left swiped traits
    }
  };

  const onSwipedAll = () => {
    // Calculate the maximum possible score based on user's "yes" answers.
    const maxPossibleScore = rightSwipedTraits.length * 5;

    const results = LANGUAGES.map(language => {
      // Calculate the language's score based *only* on the traits the user wanted (right swipes).
      let languageScore = rightSwipedTraits.reduce((score, trait) => {
        return score + (language.traits[trait] || 0);
      }, 0);

      // Penalize for traits the user explicitly said "no" to (left swipes).
      // Subtract the language's score for that trait.
      leftSwipedTraits.forEach(trait => {
        if (language.traits[trait]) {
          languageScore -= language.traits[trait]; // Penalize by subtracting the trait score
        }
      });

      // Ensure score doesn't go below zero
      languageScore = Math.max(0, languageScore);

      // Calculate a true percentage match.
      const percentage = maxPossibleScore > 0 
        ? Math.round((languageScore / maxPossibleScore) * 100) 
        : 0;
      
      return { langId: language.id, score: percentage };
    });

    // Sort by score and take top 3
    const top3 = results.sort((a, b) => b.score - a.score).slice(0, 3);
    
    setQuizFinished(true);
    setBestMatchLanguage(top3);

    if (top3.length > 0) {
      router.push({ 
        pathname: '/results', 
        params: { 
          results: JSON.stringify(top3)
        } 
      });
    }
  };

  const cardColorList = [
  ['#2C3E50', '#4CA1AF'], // Dark Blue to Cyan
  ['#764BA2', '#667EEA'], // Purple
  ['#2193b0', '#6dd5ed'], // Blue
  ['#FF416C', '#FF4B2B'], // Red/Orange
  ['#11998e', '#38ef7d'], // Green
  ['#ff9966', '#ff5e62'], // Orange
];

  const rightGlowOpacity = pan.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const leftGlowOpacity = pan.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const animatedSwiperStyle = {
    opacity: entranceAnim,
    transform: [
      {
        translateY: entranceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {!quizFinished ? (
        <>
          <Animated.View style={[styles.glow, styles.leftGlow, { opacity: leftGlowOpacity }]}>
            <LinearGradient colors={['rgba(229, 86, 109, 0.5)', 'transparent']} style={styles.glowGradient} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} />
          </Animated.View>
          <Animated.View style={[styles.glow, styles.rightGlow, { opacity: rightGlowOpacity }]}>
            <LinearGradient colors={['rgba(77, 237, 196, 0.5)', 'transparent']} style={styles.glowGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}/>
          </Animated.View>

          <Animated.View style={[styles.swiperContainer, animatedSwiperStyle]}>
            <Swiper
              ref={swiperRef}
              cards={shuffledQuestions}
              renderCard={(card, index) => {
                const cardGradientColors = cardColorList[index % cardColorList.length];
                return (
                  <LinearGradient colors={cardGradientColors} style={styles.card}>
                    <MaterialCommunityIcons name={card.iconName} size={48} color="white" />
                    <Text style={styles.cardText}>{card.text}</Text>
                  </LinearGradient>
                );
              }}
              onSwipedLeft={(index) => onSwiped(index, 'left')}
              onSwipedRight={(index) => onSwiped(index, 'right')}
              onSwipedAll={onSwipedAll}
              onSwiping={(x, y) => pan.setValue({ x, y })}
              onSwipedAborted={() => pan.setValue({x: 0, y: 0})}
              cardIndex={0}
              backgroundColor={'transparent'}
              stackSize={3}
              stackSeparation={15}
              animateCardOpacity
              verticalSwipe={false}
              overlayLabels={{
                left: {
                  title: 'HAYIR',
                  style: {
                    label: { backgroundColor: '#DC143C', color: 'white', fontSize: 32, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, overflow: 'hidden' },
                    wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 40, marginLeft: -40 },
                  },
                },
                right: {
                  title: 'EVET',
                  style: {
                    label: { backgroundColor: '#3CB371', color: 'white', fontSize: 32, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, overflow: 'hidden' },
                    wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 40, marginLeft: 40 },
                  },
                },
              }}
            />
          </Animated.View>
          <View style={styles.bottomContainer}>
            <Text style={styles.instructionsText}>Sola Kaydır: Hayır | Sağa Kaydır: Evet</Text>
          </View>
        </>
      ) : (
        <View style={styles.finishedContainer}>
            <Text style={styles.finishedTitle}>Quiz Bitti!</Text>
            <Pressable 
                style={styles.resultsButton} 
                onPress={() => {
                    if (bestMatchLanguage.length > 0) {
                        router.push({ 
                          pathname: '/results', 
                          params: { 
                            results: JSON.stringify(bestMatchLanguage)
                          } 
                        });
                    }
                }}
            >
                <Text style={styles.buttonText}>Sonuçları Görüntüle</Text>
            </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperContainer: {
    flex: 1,
    width: '100%',
  },
  card: {
    flex: 0.8,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  cardText: {
    textAlign: 'center',
    fontSize: 22, // Adjusted for icons
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 15,
  },
  icon: {
    marginBottom: 20,
  },
  bottomContainer: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  instructionsText: {
    fontSize: 18,
    color: '#A9A9A9',
    fontWeight: 'bold',
  },
  glow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    zIndex: -1,
  },
  leftGlow: { left: 0 },
  rightGlow: { right: 0 },
  glowGradient: { flex: 1 },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  resultsButton: {
    backgroundColor: '#4DEDC4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
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

export default QuizScreen;
