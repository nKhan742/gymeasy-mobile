import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { getAllDefaultExercises, getExerciseTemplates, deleteExerciseTemplate } from "@/services/exercises.service";
import { useExercisesStore } from "@/store/exercises.store";
import { useAuth } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState, useMemo } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const EXERCISE_CATEGORIES = [
  "chest",
  "back",
  "shoulders",
  "arms",
  "legs",
  "bicep",
  "tricep",
  "cardio",
  "other",
];

export default function ExercisesScreen() {
  const { user } = useAuth();
  const gym = typeof user?.gym === 'object' ? user?.gym : null;
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'default' | 'custom'>('default');

  const { selectedExercises, addExercise, removeExercise, isExerciseSelected, clearSelected } =
    useExercisesStore();

  useFocusEffect(
    useCallback(() => {
      fetchTemplates();
    }, [gym?._id])
  );

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      // Fetch both default and custom exercises
      const [defaults, customs] = await Promise.all([
        getAllDefaultExercises(),
        gym?._id ? getExerciseTemplates(gym._id) : Promise.resolve([]),
      ]);
      
      // Mark defaults and process customs
      const defaultsWithFlag = defaults.map((t: any) => ({
        ...t,
        isDefault: true,
      }));
      
      const customsWithFlag = (customs || []).map((t: any) => ({
        ...t,
        isDefault: false,
        displayName: t.name,
      }));
      
      // Combine both
      const allTemplates = [...defaultsWithFlag, ...customsWithFlag];
      setTemplates(allTemplates);
    } catch (error: any) {
      console.error("Failed to fetch templates:", error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = useMemo(() => {
    const filtered = templates.filter((template) => {
      const matchesSearch =
        !search ||
        template.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        template.exercises?.some((ex: string) =>
          ex.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(template.category?.toLowerCase());

      return matchesSearch && matchesCategory;
    });
    
    // Separate into default and custom
    const defaults = filtered.filter(t => t.isDefault);
    const customs = filtered.filter(t => !t.isDefault);
    
    return { defaults, customs, allFiltered: filtered };
  }, [templates, search, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectExercise = (template: any) => {
    if (isExerciseSelected(template.displayName)) {
      removeExercise(template.displayName);
    } else {
      addExercise({
        name: template.displayName,
        category: template.category,
        exercises: template.exercises,
      });
    }
  };

  const handleViewDetails = (template: any) => {
    setSelectedExercise(template);
    setShowDetailModal(true);
  };

  const handleAddExercise = () => {
    router.push({
      pathname: "/exercises/add",
      params: { mode: "add" },
    });
  };

  const handleEditExercise = (template: any) => {
    router.push({
      pathname: "/exercises/add",
      params: {
        mode: "edit",
        templateId: template._id,
        templateName: template.displayName,
        templateCategory: template.category,
        templateExercises: JSON.stringify(template.exercises),
      },
    });
  };

  const handleDeleteExercise = async (template: any) => {
    try {
      if (!gym?._id) return;
      
      // Call delete endpoint
      await deleteExerciseTemplate(gym._id, template._id);
      
      // Refresh the list
      await fetchTemplates();
      
      // Close modal if open
      setShowDetailModal(false);
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.safeArea}>
          <Header title="Exercises" />
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#42E695" />
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Exercises" />

        <View style={styles.container}>
          {/* GLASS SEARCH INPUT - SAME DESIGN AS MEMBERS/WHATSAPP */}
          <View style={styles.glassSearch}>
            <Ionicons name="search-outline" size={18} color="#ffffffcc" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search exercises..."
              placeholderTextColor="#ffffffaa"
              style={styles.glassInput}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.filterFab}
              onPress={() => setShowFilterModal(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="filter" size={20} color="#ffffffcc" />
            </TouchableOpacity>
          </View>

          {/* TAB SELECTOR WITH ADD BUTTON */}
          <View style={styles.tabsRow}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'default' && styles.tabActive,
                ]}
                onPress={() => setActiveTab('default')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'default' && styles.tabTextActive,
                  ]}
                >
                  Default Exercises
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'custom' && styles.tabActive,
                ]}
                onPress={() => setActiveTab('custom')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'custom' && styles.tabTextActive,
                  ]}
                >
                  My Exercises
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* ADD BUTTON ON RIGHT */}
            <TouchableOpacity
              style={styles.addTabButton}
              onPress={handleAddExercise}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* ACTIVE FILTERS TAG */}
          {selectedCategories.length > 0 && (
            <View style={styles.filterTagContainer}>
              {selectedCategories.map((cat) => (
                <View key={cat} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{cat}</Text>
                  <TouchableOpacity onPress={() => toggleCategory(cat)}>
                    <Ionicons
                      name="close-circle"
                      size={14}
                      color="#42E695"
                      style={{ marginLeft: 6 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* SELECTED EXERCISES COUNT WITH CLEAR BUTTON */}
          {selectedExercises.length > 0 && (
            <View style={styles.selectedCountBanner}>
              <View style={styles.selectedCountLeft}>
                <Ionicons name="checkmark-circle" size={16} color="#42E695" />
                <Text style={styles.selectedCountText}>
                  {selectedExercises.length} exercises selected
                </Text>
              </View>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => clearSelected()}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* EXERCISES LIST */}
          {filteredTemplates.allFiltered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#ffffffaa" />
              <Text style={styles.emptyText}>
                {search || selectedCategories.length > 0
                  ? "No exercises found"
                  : "No exercises available"}
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
              {/* SHOW ONLY ACTIVE TAB */}
              {activeTab === 'default' && filteredTemplates.defaults.length > 0 && (
                <View>
                  {filteredTemplates.defaults.map((item, idx) => {
                    const isSelected = isExerciseSelected(item.displayName);
                    return (
                      <GlassCard
                        key={`${item.name}-${idx}`}
                        style={[
                          styles.exerciseCard,
                          isSelected && styles.exerciseCardSelected,
                        ] as any}
                      >
                        <View style={styles.exerciseCardWrapper}>
                          <TouchableOpacity
                            onPress={() => handleViewDetails(item)}
                            activeOpacity={0.7}
                            style={styles.exerciseContent}
                          >
                            <View style={styles.exerciseInfo}>
                              <Text style={styles.exerciseName}>
                                {item.displayName}
                              </Text>
                              <Text style={styles.exerciseCategory}>
                                {item.category?.toUpperCase()}
                              </Text>
                              <View style={styles.exercisesPreview}>
                                {item.exercises?.slice(0, 2).map((ex: string, i: number) => (
                                  <Text key={i} style={styles.exerciseItemText}>
                                    • {ex}
                                  </Text>
                                ))}
                                {item.exercises?.length > 2 && (
                                  <Text style={styles.moreExercises}>
                                    +{item.exercises.length - 2} more
                                  </Text>
                                )}
                              </View>
                            </View>

                            <View style={styles.exerciseCountBadge}>
                              <Text style={styles.countText}>
                                {item.exercises?.length || 0}
                              </Text>
                              <Text style={styles.countLabel}>exercises</Text>
                            </View>
                          </TouchableOpacity>

                          {/* RADIO BUTTON */}
                          <TouchableOpacity
                            style={[
                              styles.radioButton,
                              isSelected && styles.radioButtonActive,
                            ]}
                            onPress={() => handleSelectExercise(item)}
                            activeOpacity={0.8}
                          >
                            {isSelected && (
                              <View style={styles.radioDot} />
                            )}
                          </TouchableOpacity>
                        </View>
                      </GlassCard>
                    );
                  })}
                </View>
              )}

              {activeTab === 'custom' && filteredTemplates.customs.length > 0 && (
                <View>
                  {filteredTemplates.customs.map((item, idx) => {
                    const isSelected = isExerciseSelected(item.name);
                    return (
                      <GlassCard
                        key={`${item.name}-${idx}`}
                        style={[
                          styles.exerciseCard,
                          isSelected && styles.exerciseCardSelected,
                        ] as any}
                      >
                        <View style={styles.exerciseCardWrapper}>
                          <TouchableOpacity
                            onPress={() => handleViewDetails(item)}
                            activeOpacity={0.7}
                            style={styles.exerciseContent}
                          >
                            <View style={styles.exerciseInfo}>
                              <Text style={styles.exerciseName}>
                                {item.displayName}
                              </Text>
                              <Text style={styles.exerciseCategory}>
                                {item.category?.toUpperCase()}
                              </Text>
                              <View style={styles.exercisesPreview}>
                                {item.exercises?.slice(0, 2).map((ex: string, i: number) => (
                                  <Text key={i} style={styles.exerciseItemText}>
                                    • {ex}
                                  </Text>
                                ))}
                                {item.exercises?.length > 2 && (
                                  <Text style={styles.moreExercises}>
                                    +{item.exercises.length - 2} more
                                  </Text>
                                )}
                              </View>
                            </View>

                            <View style={styles.exerciseCountBadge}>
                              <Text style={styles.countText}>
                                {item.exercises?.length || 0}
                              </Text>
                              <Text style={styles.countLabel}>exercises</Text>
                            </View>
                          </TouchableOpacity>

                          {/* RADIO BUTTON */}
                          <TouchableOpacity
                            style={[
                              styles.radioButton,
                              isSelected && styles.radioButtonActive,
                            ]}
                            onPress={() => handleSelectExercise(item)}
                            activeOpacity={0.8}
                          >
                            {isSelected && (
                              <View style={styles.radioDot} />
                            )}
                          </TouchableOpacity>
                        </View>
                      </GlassCard>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {/* ADD BUTTON REMOVED - NOW IN SEARCH BAR */}

        {/* EXERCISE DETAIL MODAL */}
        <Modal
          visible={showDetailModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDetailModal(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalContainer}>
              {/* MODAL HEADER */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Exercise Details</Text>
                <View style={{ width: 28 }} />
              </View>

              {/* MODAL CONTENT */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalContent}
              >
                {selectedExercise && (
                  <GlassCard style={styles.detailCard}>
                    <View style={styles.detailHeader}>
                      <View>
                        <Text style={styles.detailName}>
                          {selectedExercise.displayName}
                        </Text>
                        <Text style={styles.detailCategory}>
                          {selectedExercise.category?.toUpperCase()} •{" "}
                          {selectedExercise.exercises?.length} exercises
                        </Text>
                      </View>
                      {selectedExercise.isDefault ? (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      ) : (
                        <View style={styles.modalActionButtons}>
                          <TouchableOpacity
                            style={styles.editIconButton}
                            onPress={() => {
                              handleEditExercise(selectedExercise);
                              setShowDetailModal(false);
                            }}
                          >
                            <Ionicons name="pencil" size={20} color="#42E695" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.deleteIconButton}
                            onPress={() => handleDeleteExercise(selectedExercise)}
                          >
                            <Ionicons name="trash-outline" size={20} color="#ff5c5c" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {/* EXERCISES LIST */}
                    <View style={styles.detailExercisesList}>
                      <Text style={styles.exercisesTitle}>Exercises:</Text>
                      {selectedExercise.exercises?.map((ex: string, idx: number) => (
                        <View key={idx} style={styles.exerciseRow}>
                          <Text style={styles.exerciseNumber}>{idx + 1}.</Text>
                          <Text style={styles.exerciseNameInList}>{ex}</Text>
                        </View>
                      ))}
                    </View>
                  </GlassCard>
                )}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        {/* FILTER MODAL */}
        <Modal
          visible={showFilterModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <TouchableOpacity
            style={styles.filterModalOverlay}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          >
            <View style={styles.filterModalContent}>
              <Text style={styles.filterModalTitle}>Filter by Category</Text>

              {/* CATEGORY BUTTONS */}
              <View style={styles.categoryGrid}>
                {EXERCISE_CATEGORIES.map((category) => {
                  const isCategorySelected = selectedCategories.includes(category);
                  return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      isCategorySelected && styles.categoryButtonActive,
                    ] as any}
                    onPress={() => toggleCategory(category)}
                  >
                      <Ionicons
                        name={
                          selectedCategories.includes(category)
                            ? "checkmark-circle"
                            : "radio-button-off"
                        }
                        size={18}
                        color={
                          selectedCategories.includes(category)
                            ? "#42E695"
                            : "#ffffffaa"
                        }
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          styles.categoryButtonText,
                          isCategorySelected && styles.categoryButtonTextActive,
                        ] as any}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* BUTTONS */}
              <View style={styles.filterButtonsContainer}>
                <TouchableOpacity
                  style={styles.filterCancelButton}
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text style={styles.filterCancelButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filterClearButton}
                  onPress={() => {
                    setSelectedCategories([]);
                    setShowFilterModal(false);
                  }}
                >
                  <Text style={styles.filterClearButtonText}>Clear Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  glassSearch: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  glassInput: {
    flex: 1,
    marginLeft: 10,
    color: "#fff",
    fontSize: 14,
  },
  filterFab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 2,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    flex: 1,
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  tabText: {
    color: "#ffffffaa",
    fontSize: 12,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  addTabButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(66,230,149,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(66,230,149,0.3)",
  },
  filterTagText: {
    color: "#42E695",
    fontSize: 12,
    fontWeight: "600",
  },
  selectedCountBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(66,230,149,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(66,230,149,0.3)",
  },
  selectedCountText: {
    color: "#42E695",
    fontSize: 12,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#ffffffaa",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  exerciseCard: {
    marginBottom: 12,
  },
  exerciseCardSelected: {
    backgroundColor: "rgba(66,230,149,0.12)",
    borderColor: "rgba(66,230,149,0.35)",
  },
  exerciseCardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exerciseContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  exerciseCategory: {
    color: "#ffffffaa",
    fontSize: 11,
    marginTop: 2,
  },
  exercisesPreview: {
    marginTop: 4,
  },
  exerciseItemText: {
    color: "#e0e0e0",
    fontSize: 10,
    marginVertical: 1,
  },
  moreExercises: {
    color: "#42E695",
    fontSize: 9,
    fontWeight: "500",
    marginTop: 2,
  },
  exerciseCountBadge: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(66,230,149,0.1)",
    borderRadius: 6,
    minWidth: 50,
  },
  countText: {
    color: "#42E695",
    fontSize: 13,
    fontWeight: "700",
  },
  countLabel: {
    color: "#42E695",
    fontSize: 9,
    marginTop: 1,
  },
  toggleButton: {
    display: "none",
  },
  toggleButtonActive: {
    display: "none",
  },
  toggleSwitch: {
    display: "none",
  },
  toggleSwitchActive: {
    display: "none",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonActive: {
    borderColor: "#fff",
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  deleteIconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,92,92,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,92,92,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalActionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  selectedCountLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(255,83,92,0.2)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,83,92,0.4)",
  },
  clearButtonText: {
    color: "#ff5c5c",
    fontSize: 11,
    fontWeight: "600",
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#231a36",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(66,230,149,0.2)",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalContent: {
    padding: 16,
    paddingBottom: 40,
  },
  detailCard: {
    gap: 16,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  detailCategory: {
    color: "#ffffffaa",
    fontSize: 12,
    marginTop: 4,
  },
  defaultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(66,230,149,0.15)",
    borderWidth: 1,
    borderColor: "rgba(66,230,149,0.3)",
  },
  defaultBadgeText: {
    color: "#42E695",
    fontSize: 10,
    fontWeight: "600",
  },
  editIconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(66,230,149,0.15)",
    borderWidth: 1,
    borderColor: "rgba(66,230,149,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailExercisesList: {
    gap: 8,
  },
  exercisesTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  exerciseNumber: {
    color: "#42E695",
    fontSize: 12,
    fontWeight: "700",
    marginRight: 8,
  },
  exerciseNameInList: {
    color: "#e0e0e0",
    fontSize: 13,
    flex: 1,
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterModalContent: {
    backgroundColor: "#2a1f3a",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
    width: "85%",
  },
  filterModalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  categoryGrid: {
    gap: 10,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  categoryButtonActive: {
    backgroundColor: "rgba(66,230,149,0.15)",
    borderColor: "rgba(66,230,149,0.4)",
  },
  categoryButtonText: {
    color: "#ffffffaa",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryButtonTextActive: {
    color: "#42E695",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  filterCancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterCancelButtonText: {
    color: "#ffffffaa",
    fontSize: 12,
    fontWeight: "600",
  },
  filterClearButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(66,230,149,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterClearButtonText: {
    color: "#42E695",
    fontSize: 12,
    fontWeight: "600",
  },
});
