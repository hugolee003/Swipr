import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Share } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import {
  Users,
  ShoppingCart,
  Check,
  Calendar,
  Clock,
  DollarSign,
  ArrowLeft,
} from "lucide-react-native";
import { router } from "expo-router";

export default function SummaryScreen() {
  const insets = useSafeAreaInsets();
  const [checkedItems, setCheckedItems] = useState(new Set());

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // Sample data (would come from previous screens)
  const stats = {
    mealsPlanned: 2,
    itemsToBuy: 5,
    moneySaved: 50,
  };

  const shoppingList = [
    { name: "Honey", price: 4.99 },
    { name: "Soy Sauce", price: 2.49 },
    { name: "Fresh Ginger", price: 1.99 },
    { name: "Eggs", price: 3.99 },
    { name: "Quinoa", price: 5.99 },
  ];

  const mealPlan = [
    { emoji: "🍗", name: "Honey Garlic Chicken", time: "25 min", day: "Today" },
    { emoji: "🍛", name: "Veggie Fried Rice", time: "20 min", day: "Tomorrow" },
  ];

  const toggleCheckItem = (index) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const totalPrice = shoppingList.reduce((sum, item) => sum + item.price, 0);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎉 Week Planned with Swipr!\n\n📋 ${stats.mealsPlanned} meals planned\n🛒 ${stats.itemsToBuy} items to buy\n💰 $${stats.moneySaved} saved vs ordering out\n\nCheck out Swipr - the AI meal planner that helps you stop buying food you already have!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const StatCard = ({ value, label, color }) => (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text
        style={{
          fontSize: 28,
          fontFamily: "Montserrat_700Bold",
          color,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Montserrat_500Medium",
          color: "#9CA3AF",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </View>
  );

  const ShoppingListItem = ({ item, index, checked, onToggle }) => (
    <TouchableOpacity
      onPress={() => onToggle(index)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: index < shoppingList.length - 1 ? 1 : 0,
        borderBottomColor: "#F3F4F6",
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: checked ? "#16A34A" : "#D1D5DB",
          backgroundColor: checked ? "#16A34A" : "transparent",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        {checked && <Check size={14} color="#FFFFFF" />}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat_600SemiBold",
            color: checked ? "#9CA3AF" : "#111827",
            textDecorationLine: checked ? "line-through" : "none",
          }}
        >
          {item.name}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Montserrat_600SemiBold",
          color: checked ? "#9CA3AF" : "#111827",
          textDecorationLine: checked ? "line-through" : "none",
        }}
      >
        ${item.price.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  const MealPlanItem = ({ meal }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 32, marginRight: 12 }}>{meal.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat_600SemiBold",
            color: "#111827",
            marginBottom: 2,
          }}
        >
          {meal.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Clock size={14} color="#9CA3AF" />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Montserrat_500Medium",
              color: "#9CA3AF",
              marginLeft: 4,
              marginRight: 12,
            }}
          >
            {meal.time}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Montserrat_500Medium",
              color: "#9CA3AF",
            }}
          >
            {meal.day}
          </Text>
        </View>
      </View>
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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>🎉</Text>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Montserrat_700Bold",
              color: "#111827",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Week Planned!
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat_400Regular",
              color: "#4B5563",
              textAlign: "center",
            }}
          >
            You're all set for delicious meals
          </Text>
        </View>

        {/* Social Share Banner */}
        <TouchableOpacity
          style={{
            backgroundColor: "#9333EA",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleShare}
        >
          <Users size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat_600SemiBold",
                color: "#FFFFFF",
                marginBottom: 2,
              }}
            >
              Share My Week
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_400Regular",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              Show friends how much you saved
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <StatCard
            value={stats.mealsPlanned}
            label="Meals Planned"
            color="#F97316"
          />
          <StatCard
            value={stats.itemsToBuy}
            label="Items to Buy"
            color="#2563EB"
          />
          <StatCard
            value={`$${stats.moneySaved}`}
            label="Money Saved"
            color="#16A34A"
          />
        </View>

        {/* Shopping List Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            marginBottom: 24,
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
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 12,
            }}
          >
            <ShoppingCart size={20} color="#111827" />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Montserrat_600SemiBold",
                color: "#111827",
                marginLeft: 8,
                flex: 1,
              }}
            >
              Shopping List
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                color: "#9CA3AF",
              }}
            >
              {checkedItems.size}/{shoppingList.length}
            </Text>
          </View>

          {shoppingList.map((item, index) => (
            <ShoppingListItem
              key={index}
              item={item}
              index={index}
              checked={checkedItems.has(index)}
              onToggle={toggleCheckItem}
            />
          ))}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#F3F4F6",
              paddingHorizontal: 16,
              paddingVertical: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat_600SemiBold",
                color: "#111827",
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Montserrat_700Bold",
                color: "#111827",
              }}
            >
              ${totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Meal Plan Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
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
              marginBottom: 16,
            }}
          >
            <Calendar size={20} color="#111827" />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Montserrat_600SemiBold",
                color: "#111827",
                marginLeft: 8,
              }}
            >
              Your Meal Plan
            </Text>
          </View>

          {mealPlan.map((meal, index) => (
            <MealPlanItem key={index} meal={meal} />
          ))}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={{
            backgroundColor: "#F97316",
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 32,
            marginBottom: 12,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
          onPress={() => router.push("/welcome")}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat_600SemiBold",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Plan Another Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 24,
          }}
          onPress={handleShare}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat_500Medium",
              color: "#EA580C",
              textAlign: "center",
            }}
          >
            Share Results
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
