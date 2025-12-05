import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { Check, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

export default function PantryConfirmationScreen() {
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  // Sample pantry items from receipt scan
  const pantryItems = [
    { name: "Chicken Breast", quantity: "2 lbs", expiration: "Expires Nov 28" },
    {
      name: "Bell Peppers",
      quantity: "3 pieces",
      expiration: "Expires Nov 30",
    },
    { name: "Rice", quantity: "1 bag", expiration: "Expires Dec 15" },
    { name: "Onions", quantity: "2 lbs", expiration: "Expires Dec 5" },
    { name: "Garlic", quantity: "1 bulb", expiration: "Expires Dec 10" },
    { name: "Olive Oil", quantity: "1 bottle", expiration: "Expires Mar 2025" },
    { name: "Salt", quantity: "1 container", expiration: "No expiration" },
    {
      name: "Black Pepper",
      quantity: "1 container",
      expiration: "Expires Jul 2025",
    },
  ];

  if (!fontsLoaded) {
    return null;
  }

  const PantryItem = ({ name, quantity, expiration }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#16A34A",
          marginRight: 12,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat_600SemiBold",
            color: "#111827",
            marginBottom: 2,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_400Regular",
            color: "#9CA3AF",
          }}
        >
          {quantity}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Montserrat_400Regular",
          color: "#9CA3AF",
        }}
      >
        {expiration}
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

      {/* Success Header */}
      <View
        style={{
          alignItems: "center",
          paddingHorizontal: 24,
          marginBottom: 32,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#DCFCE7",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Check size={32} color="#16A34A" />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Montserrat_600SemiBold",
            color: "#111827",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Found {pantryItems.length} items!
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat_400Regular",
            color: "#4B5563",
            textAlign: "center",
          }}
        >
          Here's what we found in your pantry
        </Text>
      </View>

      {/* Pantry Items List */}
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          marginHorizontal: 20,
          borderRadius: 16,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
        showsVerticalScrollIndicator={false}
      >
        {pantryItems.map((item, index) => (
          <PantryItem
            key={index}
            name={item.name}
            quantity={item.quantity}
            expiration={item.expiration}
          />
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 20,
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
          onPress={() => router.push("/swipe-meals")}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat_600SemiBold",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Find My Meals
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
