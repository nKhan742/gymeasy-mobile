import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { useAuth } from "@/hooks/useAuth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  createExerciseTemplate,
  updateExerciseTemplate,
  deleteExerciseTemplate,
} from "@/services/exercises.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = ["chest", "back", "shoulders", "arms", "legs"];

export default function AddExerciseScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const gym = typeof user?.gym === 'object' ? user?.gym : null;
  const params = useLocalSearchParams();
  
  const isEditMode = params.mode === "edit";
  const templateId = params.templateId as string;
  const initialName = params.templateName as string || "";
  const initialCategory = params.templateCategory as string || "chest";
  const initialExercises = params.templateExercises ? JSON.parse(params.templateExercises as string) : [];

  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [exercises, setExercises] = useState<string[]>(initialExercises);
  const [exerciseInput, setExerciseInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddExercise = () => {
    if (exerciseInput.trim()) {
      setExercises([...exercises, exerciseInput.trim()]);
      setExerciseInput("");
    }
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        Alert.alert("Error", "Template name is required");
        return;
      }

      if (exercises.length === 0) {
        Alert.alert("Error", "Add at least one exercise");
        return;
      }

      if (!gym?._id) {
        Alert.alert("Error", "Gym information not found");
        return;
      }

      setLoading(true);

      if (isEditMode) {
        // Use update endpoint for edit mode
        await updateExerciseTemplate(gym._id, templateId, {
          name: name.trim(),
          category,
          exercises,
        });
      } else {
        // Use create endpoint for new templates
        await createExerciseTemplate(gym._id, {
          name: name.trim(),
          category,
          exercises,
        });
      }

      Alert.alert(
        "Success",
        isEditMode ? "Template updated successfully" : "Template created successfully",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Error saving template:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to save template"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER (MEMBER PROFILE STYLE) */}
        <View style={styles.headerWrapper}>
          <View style={[styles.topBar, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>
              {isEditMode ? "Edit Exercise" : "Add Exercise"}
            </Text>

            <View style={{ width: 40 }} />
          </View>
          <View style={styles.headerDivider} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* TEMPLATE NAME */}
          <GlassCard>
            <Text style={styles.label}>Template Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chest Day - Heavy"
              placeholderTextColor="#ffffffaa"
              value={name}
              onChangeText={setName}
            />
          </GlassCard>

          {/* CATEGORY */}
          <GlassCard style={{ marginTop: 12 }}>
            <Text style={styles.label}>Muscle Group *</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    category === cat && styles.categoryBtnActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryBtnText,
                      category === cat && styles.categoryBtnTextActive,
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* EXERCISES */}
          <GlassCard style={{ marginTop: 12 }}>
            <Text style={styles.label}>Exercises *</Text>
            
            {/* ADD EXERCISE INPUT */}
            <View style={styles.exerciseInputRow}>
              <TextInput
                style={styles.exerciseInput}
                placeholder="Add exercise name..."
                placeholderTextColor="#ffffffaa"
                value={exerciseInput}
                onChangeText={setExerciseInput}
              />
              <TouchableOpacity
                style={styles.squareGlassBtn}
                onPress={handleAddExercise}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* EXERCISES LIST */}
            <View style={styles.exercisesContainer}>
              {exercises.length === 0 ? (
                <Text style={styles.emptyExercisesText}>
                  No exercises added yet
                </Text>
              ) : (
                exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <Text style={styles.exerciseItemText}>
                      {index + 1}. {exercise}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(index)}
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    >
                      <Ionicons name="close-circle" size={18} color="#ff5c5c" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </GlassCard>

          {/* SAVE BUTTON */}
          <GlassButton
            title={loading ? "Saving..." : isEditMode ? "Update Template" : "Create Template"}
            onPress={handleSave}
            disabled={loading}
            style={styles.saveBtnStyle}
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    padding: 16,
    paddingBottom: 50,
  },
  label: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  input: {
    color: "#fff",
    fontSize: 14,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryBtn: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  categoryBtnActive: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  categoryBtnText: {
    color: "#cfcfcf",
    fontSize: 12,
    fontWeight: "500",
  },
  categoryBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  exerciseInputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  exerciseInput: {
    flex: 1,
    color: "#fff",
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  exercisesContainer: {
    marginTop: 12,
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  exerciseItemText: {
    color: "#e0e0e0",
    fontSize: 13,
    flex: 1,
  },
  emptyExercisesText: {
    color: "#a8a8a8",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 12,
  },
  saveBtnStyle: {
    marginTop: 24,
  },
  headerWrapper: {
    backgroundColor: "transparent",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  squareGlassBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
