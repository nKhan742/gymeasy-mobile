import api from "@/services/api";

// Fetch all custom exercise templates for gym
export const getExerciseTemplates = async (gymId: string) => {
  try {
    console.log("🏋️ Fetching exercise templates for gym:", gymId);
    const res = await api.get(`/exercises/${gymId}`);
    console.log("✅ Exercise templates response:", res.data);
    return res.data.data || [];
  } catch (error: any) {
    console.error("❌ Failed to fetch exercise templates:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message,
    });
    // Return empty array on error, don't throw
    return [];
  }
};

// Fetch default exercise templates for category
export const getDefaultExercises = async (category: string) => {
  try {
    console.log("🏋️ Fetching default exercises for category:", category);
    const res = await api.get(`/exercises/defaults/${category}`);
    console.log("✅ Default exercises response:", res.data);
    return res.data.data || [];
  } catch (error: any) {
    console.error("❌ Failed to fetch default exercises:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message,
    });
    return [];
  }
};

// Fetch all default exercise templates (all categories) - no gymID required
export const getAllDefaultExercises = async () => {
  try {
    console.log("🏋️ Fetching all default exercise templates");
    const categories = ["chest", "back", "shoulders", "arms", "legs"];
    const allDefaults: any[] = [];
    
    for (const category of categories) {
      const templates = await getDefaultExercises(category);
      // Add isDefault flag to mark as default template
      const defaultTemplates = templates.map((template: any) => ({
        ...template,
        isDefault: true,
        category: category,
      }));
      allDefaults.push(...defaultTemplates);
    }
    
    console.log("✅ All default templates fetched:", allDefaults.length);
    return allDefaults;
  } catch (error: any) {
    console.error("❌ Failed to fetch all default exercises:", error.message);
    return [];
  }
};

// Create custom exercise template
export const createExerciseTemplate = async (
  gymId: string,
  data: {
    name: string;
    category: string; // chest, back, shoulders, arms, legs
    exercises: string[]; // exercise names
    description?: string;
  }
) => {
  try {
    console.log("🏋️ Creating exercise template:", data);
    const res = await api.post(`/exercises/${gymId}/create`, data);
    console.log("✅ Create template response:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Failed to create template:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message,
    });
    throw error;
  }
};

// Add default template to gym
export const addDefaultTemplate = async (
  gymId: string,
  data: {
    templateKey: string;
    category: string;
  }
) => {
  try {
    console.log("🏋️ Adding default template:", data);
    const res = await api.post(`/exercises/${gymId}/add-default`, data);
    console.log("✅ Add default template response:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Failed to add default template:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message,
    });
    throw error;
  }
};

// Update exercise template
export const updateExerciseTemplate = async (
  gymId: string,
  templateId: string,
  data: {
    name: string;
    category: string;
    exercises: string[];
    description?: string;
  }
) => {
  try {
    console.log("🏋️ Updating exercise template:", templateId, data);
    const res = await api.put(`/exercises/${gymId}/${templateId}`, data);
    console.log("✅ Update template response:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Failed to update template:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message,
    });
    throw error;
  }
};

// Delete exercise template
export const deleteExerciseTemplate = async (
  gymId: string,
  templateId: string
) => {
  try {
    console.log("🏋️ Deleting exercise template:", templateId);
    const res = await api.delete(`/exercises/${gymId}/${templateId}`);
    console.log("✅ Delete template response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Failed to delete template:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message,
    });
    throw error;
  }
};

// Default exercise templates data (for frontend use)
export const DEFAULT_EXERCISE_TEMPLATES = {
  chest: [
    {
      id: "chest_1",
      name: "Chest Day 1 - Barbell Focus",
      category: "chest",
      exercises: [
        "Barbell Bench Press",
        "Dumbbell Incline Press",
        "Cable Fly",
        "Machine Press",
      ],
      description: "Heavy barbell chest focus",
    },
    {
      id: "chest_2",
      name: "Chest Day 2 - Dumbbell Focus",
      category: "chest",
      exercises: [
        "Dumbbell Bench Press",
        "Incline Dumbbell Press",
        "Decline Push-ups",
        "Fly Machine",
      ],
      description: "Dumbbell-based chest workout",
    },
    {
      id: "chest_3",
      name: "Chest Day 3 - Lower Chest",
      category: "chest",
      exercises: [
        "Decline Bench Press",
        "Low Cable Fly",
        "Push-ups",
        "Smith Machine Press",
      ],
      description: "Lower chest emphasis",
    },
  ],
  back: [
    {
      id: "back_1",
      name: "Back Day 1 - Strength",
      category: "back",
      exercises: [
        "Barbell Deadlift",
        "Barbell Row",
        "Pull-ups",
        "T-Bar Row",
      ],
      description: "Heavy back strength focus",
    },
    {
      id: "back_2",
      name: "Back Day 2 - Volume",
      category: "back",
      exercises: [
        "Dumbbell Row",
        "Lat Pulldown",
        "Seated Cable Row",
        "Face Pulls",
      ],
      description: "High volume back workout",
    },
    {
      id: "back_3",
      name: "Back Day 3 - Lats",
      category: "back",
      exercises: [
        "Wide Grip Pulldown",
        "Straight Arm Pulldown",
        "Machine Row",
        "Assisted Pull-ups",
      ],
      description: "Lat development focus",
    },
  ],
  shoulders: [
    {
      id: "shoulders_1",
      name: "Shoulder Day 1 - Press",
      category: "shoulders",
      exercises: [
        "Barbell Shoulder Press",
        "Dumbbell Military Press",
        "Machine Press",
        "Pike Push-ups",
      ],
      description: "Overhead press focus",
    },
    {
      id: "shoulders_2",
      name: "Shoulder Day 2 - Lateral",
      category: "shoulders",
      exercises: [
        "Lateral Raises",
        "Machine Lateral Press",
        "Cable Lateral Raise",
        "Dumbbell Upright Row",
      ],
      description: "Lateral deltoid development",
    },
    {
      id: "shoulders_3",
      name: "Shoulder Day 3 - Rear Delts",
      category: "shoulders",
      exercises: [
        "Reverse Pec Deck",
        "Face Pulls",
        "Bent Over Raise",
        "Reverse Machine Fly",
      ],
      description: "Rear deltoid focus",
    },
  ],
  arms: [
    {
      id: "arms_1",
      name: "Arms Day 1 - Heavy",
      category: "arms",
      exercises: [
        "Barbell Curl",
        "Close Grip Bench",
        "Skull Crusher",
        "Barbell Row",
      ],
      description: "Heavy arm focus",
    },
    {
      id: "arms_2",
      name: "Arms Day 2 - Pump",
      category: "arms",
      exercises: [
        "Dumbbell Curl",
        "Rope Tricep Extension",
        "Cable Curl",
        "Tricep Dip",
      ],
      description: "High volume pump workout",
    },
    {
      id: "arms_3",
      name: "Arms Day 3 - Finisher",
      category: "arms",
      exercises: [
        "Machine Curl",
        "Machine Tricep",
        "Preacher Curl",
        "Overhead Extension",
      ],
      description: "Machine-based arm finisher",
    },
  ],
  legs: [
    {
      id: "legs_1",
      name: "Leg Day 1 - Quads",
      category: "legs",
      exercises: [
        "Barbell Squat",
        "Leg Press",
        "Leg Extension",
        "Walking Lunges",
      ],
      description: "Quad focus",
    },
    {
      id: "legs_2",
      name: "Leg Day 2 - Hamstrings",
      category: "legs",
      exercises: [
        "Romanian Deadlift",
        "Leg Curl",
        "Stiff Leg Deadlift",
        "Nordic Curl",
      ],
      description: "Hamstring development",
    },
    {
      id: "legs_3",
      name: "Leg Day 3 - Full Leg",
      category: "legs",
      exercises: [
        "Hack Squat",
        "Leg Press",
        "Sissy Squat",
        "Standing Calf Raise",
      ],
      description: "Full leg workout",
    },
  ],
};
