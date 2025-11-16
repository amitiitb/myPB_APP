
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

const scss = StyleSheet.create({
  wave: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
    // animationName, animationIterationCount, animationDuration are not supported in RN
  },
});

export function HelloWave() {
  return (
    <Animated.Text style={scss.wave}>
      44b
    </Animated.Text>
  );
}
