import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { Sparkles, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

export default function ScanReceiptScreen() {
  const insets = useSafeAreaInsets();
  const [scanAnimation] = useState(new Animated.Value(1));
  const [isScanning, setIsScanning] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    // Start scanning animation after mount
    setTimeout(() => {
      setIsScanning(true);
      startScanAnimation();

      // Navigate to pantry confirmation after 3 seconds
      setTimeout(() => {
        router.push("/pantry-confirmation");
      }, 3000);
    }, 1000);
  }, []);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  if (!fontsLoaded) {
    return null;
  }

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

      {/* Scanning Animation */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Animated.View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "#F97316",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
            transform: [{ scale: scanAnimation }],
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#EA580C",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sparkles size={32} color="#FFFFFF" />
          </View>
        </Animated.View>

        <Text
          style={{
            fontSize: 24,
            fontFamily: "Montserrat_600SemiBold",
            color: "#111827",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {isScanning ? "Scanning receipt..." : "Get Ready"}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat_400Regular",
            color: "#4B5563",
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          {isScanning
            ? "Reading your ingredients with AI"
            : "Place your receipt in view and tap to scan"}
        </Text>
      </View>

      {/* Camera Simulation Button */}
      {!isScanning && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#F97316",
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 32,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
            onPress={() => {
              setIsScanning(true);
              startScanAnimation();
              setTimeout(() => {
                router.push("/pantry-confirmation");
              }, 3000);
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
              Scan Receipt
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
