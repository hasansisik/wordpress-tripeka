import { createReducer } from "@reduxjs/toolkit";
import { getFeatures, updateFeatures } from "../actions/featuresActions";

interface FeaturesState {
  features: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: FeaturesState = {
  features: null,
  loading: false,
  error: null,
};

// Helper function to handle features5 section updates
const handleFeatures5Update = (state: FeaturesState, payload: any) => {
  
  // If direct backgroundColor update
  if (payload.features5.backgroundColor !== undefined) {
    state.features.features5.backgroundColor = payload.features5.backgroundColor;
  }
  
  // Handle title updates
  if (payload.features5.title !== undefined) {
    state.features.features5.title = payload.features5.title;
  }
  
  if (payload.features5.titleColor !== undefined) {
    state.features.features5.titleColor = payload.features5.titleColor;
  }
  
  // Handle description updates
  if (payload.features5.description !== undefined) {
    state.features.features5.description = payload.features5.description;
  }
  
  if (payload.features5.descriptionColor !== undefined) {
    state.features.features5.descriptionColor = payload.features5.descriptionColor;
  }
  
  // Handle sections operations
  if (payload.features5.sections) {
    const sections = payload.features5.sections;
    
    // Handle special operation object format
    if (sections.operation) {
      const { operation, section, sectionId, order } = sections;
            
      // Different operations based on the operation type
      switch (operation) {
        case 'add':
          if (section) {
            const newSection = {
              ...section,
              id: `section${Date.now()}`,
              position: state.features.features5.sections.length + 1,
              visible: true
            };
            state.features.features5.sections.push(newSection);
          }
          break;
          
        case 'update':
          if (section && section.id) {
            const index = state.features.features5.sections.findIndex(
              (s: any) => s.id === section.id
            );
            if (index !== -1) {
              // Update only the provided properties
              state.features.features5.sections[index] = {
                ...state.features.features5.sections[index],
                ...section
              };
            }
          }
          break;
          
        case 'remove':
          if (sectionId) {
            state.features.features5.sections = state.features.features5.sections.filter(
              (s: any) => s.id !== sectionId
            );
          }
          break;
          
        case 'reorder':
          if (order && Array.isArray(order)) {
            // Reorder sections based on the provided order
            const newSections: any[] = [];
            order.forEach((id, index) => {
              const section = state.features.features5.sections.find((s: any) => s.id === id);
              if (section) {
                newSections.push({
                  ...section,
                  position: index + 1
                });
              }
            });
            state.features.features5.sections = newSections;
          }
          break;
      }
    } 
    // Direct array update
    else if (Array.isArray(sections)) {
      state.features.features5.sections = sections;
    }
  }
  
  return state;
};

// Helper function to deep merge objects
const deepMerge = (target: any, source: any): any => {
  if (!source) return target;
  if (!target) return source;
  
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
};

export const featuresReducer = createReducer(initialState, (builder) => {
  builder
    // Hydration action for SSR
    .addCase('features/hydrate' as any, (state, action: any) => {
      return {
        ...state,
        features: action.payload,
        loading: false,
        error: null
      };
    })
    // Get Features
    .addCase(getFeatures.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getFeatures.fulfilled, (state, action) => {
      state.loading = false;
      state.features = action.payload;
      state.error = null;
    })
    .addCase(getFeatures.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Features
    .addCase(updateFeatures.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateFeatures.fulfilled, (state, action) => {
      state.loading = false;
      
      // Deep merge the updates with existing features data
      if (state.features) {
        state.features = deepMerge(state.features, action.payload);
      } else {
        state.features = action.payload;
      }
      
      state.success = true;
      state.message = "Features başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateFeatures.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default featuresReducer; 