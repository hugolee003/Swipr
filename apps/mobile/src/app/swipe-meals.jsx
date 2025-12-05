import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import {
  X,
  Heart,
  Clock,
  ChefHat,
  DollarSign,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.3;

export default function SwipeMealsScreen() {
  const insets = useSafeAreaInsets();
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showPremium, setShowPremium] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // Sample recipes
  const recipes = [
    {
      id: 1,
      emoji: "🍗",
      title: "Honey Garlic Chicken",
      description:
        "Tender chicken breast glazed with a sweet and savory honey garlic sauce",
      time: "25 min",
      difficulty: "Easy",
      cost: "$12",
      youHave: ["Chicken Breast", "Garlic", "Salt", "Black Pepper"],
      youNeed: ["Honey", "Soy Sauce", "Fresh Ginger"],
      needCount: 3,
    },
    {
      id: 2,
      emoji: "🍛",
      title: "Veggie Fried Rice",
      description:
        "Colorful fried rice packed with fresh vegetables and aromatic spices",
      time: "20 min",
      difficulty: "Easy",
      cost: "$8",
      youHave: ["Rice", "Bell Peppers", "Onions", "Garlic", "Olive Oil"],
      youNeed: ["Eggs", "Soy Sauce"],
      needCount: 2,
    },
    {
      id: 3,
      emoji: "🥘",
      title: "Mediterranean Bowl",
      description: "Fresh and healthy bowl with roasted vegetables and herbs",
      time: "35 min",
      difficulty: "Medium",
      cost: "$14",
      youHave: ["Bell Peppers", "Onions", "Olive Oil"],
      youNeed: ["Quinoa", "Feta Cheese", "Olives", "Lemon", "Fresh Herbs"],
      needCount: 5,
    },
  ];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        rotation.setValue(gestureState.dx * 0.05);
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();

        if (gestureState.dx > SWIPE_THRESHOLD) {
          // Right swipe (like)
          swipeRight();
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Left swipe (pass)
          swipeLeft();
        } else {
          // Return to center
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }),
            Animated.spring(rotation, {
              toValue: 0,
              useNativeDriver: false,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const swipeRight = () => {
    const currentRecipe = recipes[currentRecipeIndex];

    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: width, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotation, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Add to liked recipes and shopping list
      setLikedRecipes((prev) => [...prev, currentRecipe]);
      setShoppingList((prev) => [...prev, ...currentRecipe.youNeed]);

      nextRecipe();
    });
  };

  const swipeLeft = () => {
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: -width, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotation, {
        toValue: -0.3,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      nextRecipe();
    });
  };

  const nextRecipe = () => {
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);

    // Show premium modal after 3 swipes
    if (newSwipeCount >= 3 && !showPremium) {
      setShowPremium(true);
      return;
    }

    if (currentRecipeIndex < recipes.length - 1) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
      pan.setValue({ x: 0, y: 0 });
      rotation.setValue(0);
    } else {
      // Navigate to summary
      router.push("/summary");
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const currentRecipe = recipes[currentRecipeIndex];

  const IngredientChip = ({ text, type }) => (
    <View
      style={{
        backgroundColor: type === "have" ? "#F3F4F6" : "#FFF7ED",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 4,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Montserrat_500Medium",
          color: type === "have" ? "#374151" : "#EA580C",
        }}
      >
        {type === "have" ? "✓ " : "+ "}
        {text}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Stats Header */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 24,
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Montserrat_700Bold",
              color: "#F97316",
            }}
          >
            {likedRecipes.length}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Montserrat_500Medium",
              color: "#9CA3AF",
            }}
          >
            Meals Planned
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Montserrat_700Bold",
              color: "#2563EB",
            }}
          >
            {new Set(shoppingList).size}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Montserrat_500Medium",
              color: "#9CA3AF",
            }}
          >
            Items to Buy
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Montserrat_700Bold",
              color: "#16A34A",
            }}
          >
            ${(likedRecipes.length * 25).toFixed(0)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Montserrat_500Medium",
              color: "#9CA3AF",
            }}
          >
            Money Saved
          </Text>
        </View>
      </View>

      {/* Recipe Card */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <Animated.View
          style={{
            flex: 1,
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              {
                rotate: rotation.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ["-12deg", "12deg"],
                }),
              },
            ],
          }}
          {...panResponder.panHandlers}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 32,
              padding: 32,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 12,
              maxHeight: height * 0.6,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Emoji Header */}
              <Text
                style={{
                  fontSize: 80,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {currentRecipe.emoji}
              </Text>

              {/* Success Badge */}
              <View
                style={{
                  backgroundColor: "#DCFCE7",
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 20,
                  alignSelf: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Montserrat_600SemiBold",
                    color: "#16A34A",
                  }}
                >
                  You only need {currentRecipe.needCount} items! 🎉
                </Text>
              </View>

              {/* Title & Description */}
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Montserrat_700Bold",
                  color: "#111827",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {currentRecipe.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Montserrat_400Regular",
                  color: "#4B5563",
                  textAlign: "center",
                  marginBottom: 20,
                  lineHeight: 20,
                }}
              >
                {currentRecipe.description}
              </Text>

              {/* Meta Info */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 20,
                  gap: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Clock size={16} color="#4B5563" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: "#4B5563",
                      marginLeft: 4,
                    }}
                  >
                    {currentRecipe.time}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ChefHat size={16} color="#4B5563" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: "#4B5563",
                      marginLeft: 4,
                    }}
                  >
                    {currentRecipe.difficulty}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <DollarSign size={16} color="#4B5563" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: "#4B5563",
                      marginLeft: 4,
                    }}
                  >
                    {currentRecipe.cost}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#E5E7EB",
                  marginBottom: 20,
                }}
              />

              {/* Ingredients Sections */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Montserrat_600SemiBold",
                    color: "#9CA3AF",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  YOU ALREADY HAVE
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {currentRecipe.youHave.map((ingredient, index) => (
                    <IngredientChip key={index} text={ingredient} type="have" />
                  ))}
                </View>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Montserrat_600SemiBold",
                    color: "#9CA3AF",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  YOU NEED
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {currentRecipe.youNeed.map((ingredient, index) => (
                    <IngredientChip key={index} text={ingredient} type="need" />
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingTop: 20,
          gap: 24,
        }}
      >
        <TouchableOpacity
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#FFFFFF",
            borderWidth: 2,
            borderColor: "#E5E7EB",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={swipeLeft}
        >
          <X size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#F97316",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#F97316",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
          onPress={swipeRight}
        >
          <Heart size={32} color="#FFFFFF" fill="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Shopping List Preview */}
      {shoppingList.length > 0 && (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginHorizontal: 20,
            marginTop: 20,
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <ShoppingCart size={16} color="#4B5563" />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                color: "#111827",
                marginLeft: 8,
              }}
            >
              Shopping List ({new Set(shoppingList).size})
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {Array.from(new Set(shoppingList))
              .slice(0, 4)
              .map((item, index) => (
                <IngredientChip key={index} text={item} type="need" />
              ))}
            {new Set(shoppingList).size > 4 && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Montserrat_500Medium",
                  color: "#9CA3AF",
                  alignSelf: "center",
                }}
              >
                +{new Set(shoppingList).size - 4} more
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={{ height: insets.bottom + 20 }} />

      {/* Premium Modal */}
      {showPremium && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 32,
              maxWidth: 400,
              width: "100%",
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#FFF7ED",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 32 }}>👑</Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontFamily: "Montserrat_700Bold",
                color: "#111827",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Unlock Unlimited Swipes
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat_400Regular",
                color: "#4B5563",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              You've reached your free swipe limit. Upgrade to premium for
              unlimited meal planning!
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#F97316",
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 32,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Start Free 7-Day Trial
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowPremium(false);
                router.push("/summary");
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Montserrat_500Medium",
                  color: "#9CA3AF",
                  textAlign: "center",
                }}
              >
                Continue with Free Plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
