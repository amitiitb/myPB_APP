import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Step {
  id: number;
  label: string;
  completed: boolean;
  current: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStepPage?: number; // 1, 2, or 3 to know which page we're on
  routeParams?: Record<string, any>; // Pass through route params for backward navigation
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStepPage, routeParams = {} }) => {
  const { darkMode } = useTheme();
  
  // Calculate progress percentage
  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const handleStepPress = (stepId: number) => {
    // Allow navigation to completed steps or previous steps (backward navigation)
    if (stepId >= currentStepPage!) return;
    
    if (stepId === 1) {
      router.push({
        pathname: '/BusinessProfileStepOne',
        params: routeParams,
      });
    } else if (stepId === 2) {
      router.push({
        pathname: '/BusinessProfileStepTwo',
        params: routeParams,
      });
    } else if (stepId === 3) {
      router.push({
        pathname: '/BusinessProfileStepThree',
        params: routeParams,
      });
    }
  };

  return (
    <View style={[scss.container, darkMode && scss.containerDark]}>
      <View style={scss.stepsRow}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            style={scss.stepContainer}
            onPress={() => handleStepPress(step.id)}
            disabled={step.id >= currentStepPage!}
          >
            {/* Step Circle with Number */}
            <View
              style={[
                scss.stepCircle,
                step.completed && scss.stepCircleCompleted,
                step.current && scss.stepCircleCurrent,
              ]}
            >
              {step.completed ? (
                <Ionicons name="checkmark-sharp" size={16} color="#34D399" strokeWidth={3} />
              ) : (
                <Text style={scss.stepNumber}>{step.id}</Text>
              )}
            </View>

            {/* Step Label */}
            <Text
              style={[
                scss.stepLabel,
                step.completed && scss.stepLabelCompleted,
                step.current && scss.stepLabelCurrent,
              ]}
              numberOfLines={1}
            >
              {step.label}
            </Text>

            {/* Connector Line (except for last step) */}
            {index < steps.length - 1 && (
              <View
                style={[
                  scss.connector,
                  steps[index + 1].completed && scss.connectorCompleted,
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress Bar */}
      <View style={scss.progressBar}>
        <LinearGradient
          colors={['#10B981', '#34D399']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[scss.progressFill, { width: `${progressPercentage}%` }]}
        />
      </View>
    </View>
  );
};

const scss = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 0,
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
  },
  stepCircleCurrent: {
    backgroundColor: '#7C3AED',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  inactiveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  stepLabelCompleted: {
    color: '#10B981',
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  connector: {
    position: 'absolute',
    top: 18,
    left: '50%',
    width: '90%',
    height: 1.5,
    backgroundColor: '#E5E7EB',
    zIndex: -1,
  },
  connectorCompleted: {
    backgroundColor: '#10B981',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
});

export default StepIndicator;
