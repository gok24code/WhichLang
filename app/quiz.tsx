import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Pressable } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { QUESTIONS, LANGUAGES } from '../data/quiz';
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

const cardColorList = [
  ['#2C3E50', '#4CA1AF'], // Dark Blue to Cyan
  ['#764BA2', '#667EEA'], // Purple
  ['#2193b0', '#6dd5ed'], // Blue
  ['#FF416C', '#FF4B2B'], // Red/Orange
  ['#11998e', '#38ef7d'], // Green
  ['#ff9966', '#ff5e62'], // Orange
];

const Card = ({ card, index }: { card: any, index: number }) => {
  const cardGradientColors = cardColorList[index % cardColorList.length];
  const cardEntranceAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Reset animation for new cards (pop-out)
    cardEntranceAnim.setValue(0);
    Animated.spring(cardEntranceAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [card, cardEntranceAnim]);

  const animatedCardStyle = {
    opacity: cardEntranceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        scale: cardEntranceAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 1.1, 1],
        }),
      },
      {
        translateY: cardEntranceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };
  return (
    <Animated.View style={[styles.card, animatedCardStyle]}>
      <LinearGradient colors={cardGradientColors} style={styles.cardContent}>
        <MaterialCommunityIcons name={card.iconName} size={48} color="white" />
        <Text style={styles.cardText}>{card.text}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const QuizScreen = () => {
  const router = useRouter();
  const swiperRef = useRef<Swiper<any>>(null);
  const [shuffledQuestions] = useState(() => shuffleArray(QUESTIONS));
  const [cardIndex, setCardIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;
  const entranceAnim = useRef(new Animated.Value(0)).current; // For entrance animation
  const [quizFinished, setQuizFinished] = useState(false);
  const [bestMatchLanguage, setBestMatchLanguage] = useState<any[]>([]);
  const [rightSwipedTraits, setRightSwipedTraits] = useState<string[]>([]);
  const [leftSwipedTraits, setLeftSwipedTraits] = useState<string[]>([]); // New state for left swipes
  const [starSwipedTraits, setStarSwipedTraits] = useState<string[]>([]); // New state for star swipes

  const yesButtonScale = useRef(new Animated.Value(1)).current;
  const noButtonScale = useRef(new Animated.Value(1)).current;
  const starButtonScale = useRef(new Animated.Value(1)).current;

  const handleSwipe = (swipedCardIndex: number, direction: 'left' | 'right' | 'star') => {
    const trait = shuffledQuestions[swipedCardIndex].trait;
    if (direction === 'right') {
      setRightSwipedTraits(prev => [...prev, trait]);
    } else if (direction === 'left') {
      setLeftSwipedTraits(prev => [...prev, trait]);
    } else if (direction === 'star') {
      setStarSwipedTraits(prev => [...prev, trait]);
    }
  };

  const handlePressIn = (scaleAnim: Animated.Value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scaleAnim, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleAnim: Animated.Value, direction: 'left' | 'right' | 'star') => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 2,
      tension: 50,
      useNativeDriver: true,
    }).start();
    
    // Trigger the swipe corresponding to the button pressed
    if (direction === 'left') {
      swiperRef.current?.swipeLeft();
    } else if (direction === 'right') {
      swiperRef.current?.swipeRight();
    } else if (direction === 'star') {
      swiperRef.current?.swipeTop();
    }
  };
  
  React.useEffect(() => {
    // Entrance animation
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [entranceAnim]);
  
  const hapticDirection = useRef<null | 'left' | 'right'>(null);
  
  const onSwipedAll = () => {
    const STAR_SWIPE_MULTIPLIER = 1.2; // Starred answers are 20% more important

    // 1. Calculate raw scores for all languages
    const languageScores = LANGUAGES.map(language => {
      let rawScore = rightSwipedTraits.reduce((score, trait) => score + (language.traits[trait] || 0), 0);
      rawScore += starSwipedTraits.reduce((score, trait) => score + (language.traits[trait] || 0) * STAR_SWIPE_MULTIPLIER, 0);
      leftSwipedTraits.forEach(trait => {
        if (language.traits[trait]) rawScore -= language.traits[trait];
      });
      rawScore = Math.max(0, rawScore);
      return { langId: language.id, rawScore };
    });

    // 2. Sort by raw score to find the top 3
    const sortedScores = languageScores.sort((a, b) => b.rawScore - a.rawScore);
    const top3Languages = sortedScores.slice(0, 3);

    // 3. Calculate the sum of the raw scores of ONLY the top 3
    const sumOfTop3Scores = top3Languages.reduce((sum, lang) => sum + lang.rawScore, 0);

    // 4. Normalize the top 3 scores so their percentages add up to 100%
    const finalResults = top3Languages.map(lang => {
      const percentage = (sumOfTop3Scores > 0)
        ? Math.round((lang.rawScore / sumOfTop3Scores) * 100)
        : 0;
      return { langId: lang.langId, score: percentage };
    });
    
    setQuizFinished(true);
    setBestMatchLanguage(finalResults);

    if (finalResults.length > 0) {
      router.push({ 
        pathname: '/results', 
        params: { 
          results: JSON.stringify(finalResults)
        } 
      });
    }
  };
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
            <LinearGradient colors={['rgba(229, 86, 109, 0.5)', 'transparent']} style={styles.glowGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </Animated.View>
          <Animated.View style={[styles.glow, styles.rightGlow, { opacity: rightGlowOpacity }]}>
            <LinearGradient colors={['rgba(77, 237, 196, 0.5)', 'transparent']} style={styles.glowGradient} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}/>
          </Animated.View>

          <Animated.View style={[styles.swiperContainer, animatedSwiperStyle]}>
            <Swiper
              ref={swiperRef}
              cards={shuffledQuestions}
              renderCard={(card, index) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  index={index} 
                />
              )}
              onSwipedLeft={(index) => handleSwipe(index, 'left')}
              onSwipedRight={(index) => handleSwipe(index, 'right')}
              onSwipedTop={(index) => handleSwipe(index, 'star')}
              onSwiped={() => {
                pan.setValue({ x: 0, y: 0 });
                hapticDirection.current = null;
                setCardIndex(prev => prev + 1);
              }}
              onSwipedAll={onSwipedAll}
              onSwiping={(x, y) => {
                pan.setValue({ x, y });
                const swipeThreshold = width / 4; // Horizontal threshold
                const verticalSwipeThreshold = width / 4; // Vertical threshold

                if (x > swipeThreshold && hapticDirection.current !== 'right') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  hapticDirection.current = 'right';
                } else if (x < -swipeThreshold && hapticDirection.current !== 'left') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  hapticDirection.current = 'left';
                } else if (y < -verticalSwipeThreshold && hapticDirection.current !== 'up') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  hapticDirection.current = 'up';
                }
                else if (Math.abs(x) < swipeThreshold && Math.abs(y) < verticalSwipeThreshold && hapticDirection.current !== null) {
                  hapticDirection.current = null; // Reset when back in the neutral zone
                }
              }}
              onSwipedAborted={() => {
                pan.setValue({x: 0, y: 0});
                hapticDirection.current = null;
              }}
              cardIndex={cardIndex}
              backgroundColor={'transparent'}
              verticalSwipe={true}
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
                top: {
                  element: <Animated.View style={{ opacity: pan.y.interpolate({ inputRange: [-width / 4, 0], outputRange: [1, 0], extrapolate: 'clamp' }) }}>
                             <MaterialCommunityIcons name="star" size={64} color="#FFD700" />
                           </Animated.View>,
                  style: {
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end', // Move to the bottom
                      paddingBottom: 40, // Add some padding from the bottom edge
                    },
                  },
                },
              }}
            />
          </Animated.View>
          <View style={styles.buttonContainer}>
            <Animated.View style={[{transform: [{scale: noButtonScale}]}]}>
              <Pressable 
                style={[styles.iconButton, styles.noButton]} 
                onPressIn={() => handlePressIn(noButtonScale)}
                onPressOut={() => handlePressOut(noButtonScale, 'left')}
              >
                <MaterialCommunityIcons name="close" size={32} color="white" />
              </Pressable>
            </Animated.View>
            <Animated.View style={[{transform: [{scale: starButtonScale}]}]}>
              <Pressable 
                style={[styles.iconButton, styles.starButton]}
                onPressIn={() => handlePressIn(starButtonScale)}
                onPressOut={() => handlePressOut(starButtonScale, 'star')}
              >
                <MaterialCommunityIcons name="star" size={32} color="white" />
              </Pressable>
            </Animated.View>
            <Animated.View style={[{transform: [{scale: yesButtonScale}]}]}>
              <Pressable 
                style={[styles.iconButton, styles.yesButton]}
                onPressIn={() => handlePressIn(yesButtonScale)}
                onPressOut={() => handlePressOut(yesButtonScale, 'right')}
              >
                <MaterialCommunityIcons name="heart" size={32} color="white" />
              </Pressable>
            </Animated.View>
          </View>
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
    paddingTop: 50, // Move cards down
  },
  card: {
    flex: 0.8,
    borderRadius: 25, // Increased border-radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    overflow: 'hidden', // Clip content to rounded borders
  },
  cardContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardText: {
    textAlign: 'center',
    fontSize: 22, // Adjusted for icons
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 32, // Adjust overlap as needed
    zIndex: 1, // Make sure buttons are on top of the bottom text
  },
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  yesButton: {
    backgroundColor: '#3CB371',
  },
  noButton: {
    backgroundColor: '#DC143C',
  },
  starButton: {
    backgroundColor: '#FFD700', // Gold color for the star button
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
