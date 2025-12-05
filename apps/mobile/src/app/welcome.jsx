import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Camera, Heart, ShoppingCart, Sparkles } from "lucide-react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [showTutorial, setShowTutorial] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const ValuePropCard = ({ icon: Icon, title, description }) => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "#FFF7ED",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Icon size={24} color="#F97316" />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Montserrat_600SemiBold",
          color: "#111827",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Montserrat_400Regular",
          color: "#4B5563",
          lineHeight: 20,
        }}
      >
        {description}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          maxWidth: 448,
          alignSelf: "center",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* App Icon & Branding */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>🍽️</Text>
          <Text
            style={{
              fontSize: 36,
              fontFamily: "Montserrat_700Bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            Swipr
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Montserrat_400Regular",
              color: "#4B5563",
              textAlign: "center",
            }}
          >
            Stop buying food you already have
          </Text>
        </View>

        {/* Value Propositions */}
        <ValuePropCard
          icon={Camera}
          title="Scan Your Receipt"
          description="AI reads your grocery receipts to know exactly what you have at home"
        />

        <ValuePropCard
          icon={Heart}
          title="Swipe on Meals"
          description="Get personalized recipe suggestions using your existing ingredients"
        />

        <ValuePropCard
          icon={ShoppingCart}
          title="Smart Shopping List"
          description="Only buy what you need - save money and reduce food waste"
        />

        {/* Primary CTA */}
        <TouchableOpacity
          style={{
            background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
            backgroundColor: "#F97316", // Fallback for gradient
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 32,
            marginTop: 20,
            marginBottom: 16,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
          onPress={() => router.push("/scan-receipt")}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat_600SemiBold",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Scan Your First Receipt
          </Text>
        </TouchableOpacity>

        {/* Secondary CTA */}
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 24,
            marginBottom: 20,
          }}
          onPress={() => setShowTutorial(true)}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat_600SemiBold",
              color: "#EA580C",
              textAlign: "center",
            }}
          >
            Watch Tutorial First
          </Text>
        </TouchableOpacity>

        {/* Fine Print */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_400Regular",
            color: "#9CA3AF",
            textAlign: "center",
            lineHeight: 16,
          }}
        >
          Free to start • No credit card required{"\n"}3 swipes per week on free
          plan
        </Text>
      </ScrollView>

      {/* Tutorial Modal */}
      {showTutorial && (
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
              borderRadius: 32,
              padding: 32,
              maxWidth: 448,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 72, marginBottom: 20 }}>✨</Text>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Montserrat_700Bold",
                color: "#111827",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              How Swipr Works
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat_400Regular",
                color: "#4B5563",
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 22,
              }}
            >
              Snap a photo of your receipt, swipe on meals you'd love to make,
              and get a smart shopping list!
            </Text>

            {/* Progress Dots */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 24,
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 8,
                  backgroundColor: "#F97316",
                  borderRadius: 4,
                }}
              />
              {[...Array(4)].map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: "#D1D5DB",
                    borderRadius: 4,
                  }}
                />
              ))}
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#F97316",
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 32,
                marginBottom: 12,
                width: "100%",
              }}
              onPress={() => setShowTutorial(false)}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Got It!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
