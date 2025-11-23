import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Particle {
  id: string;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

const ConfettiAnimation: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random confetti particles
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D', '#C44569', '#FFA502', '#00D4FF'];
    const generatedParticles: Particle[] = [];

    for (let i = 0; i < 50; i++) {
      generatedParticles.push({
        id: `particle-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.1,
        duration: 2 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
      });
    }

    setParticles(generatedParticles);

    // Auto-remove after animation completes (2 seconds)
    const timer = setTimeout(() => {
      setParticles([]);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ConfettiParticle key={particle.id} particle={particle} />
      ))}
    </View>
  );
};

interface ConfettiParticleProps {
  particle: Particle;
}

const ConfettiParticle: React.FC<ConfettiParticleProps> = ({ particle }) => {
  const translateY = new Animated.Value(0);
  const translateX = new Animated.Value(0);
  const opacity = new Animated.Value(1);

  useEffect(() => {
    // Create falling animation
    Animated.sequence([
      Animated.delay(particle.delay * 1000),
      Animated.parallel([
        // Vertical fall
        Animated.timing(translateY, {
          toValue: 1600,
          duration: particle.duration * 1000,
          useNativeDriver: true,
        }),
        // Horizontal drift
        Animated.timing(translateX, {
          toValue: (Math.random() - 0.5) * 200,
          duration: particle.duration * 1000,
          useNativeDriver: true,
        }),
        // Fade out at the end
        Animated.sequence([
          Animated.delay((particle.duration * 1000) * 0.7),
          Animated.timing(opacity, {
            toValue: 0,
            duration: (particle.duration * 1000) * 0.3,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [particle, translateY, translateX, opacity]);

  // Determine if particle is a streamer (thin rectangle) or confetti (square)
  const isStreamer = Math.random() > 0.5;

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${particle.left}%`,
          width: isStreamer ? particle.size : particle.size + 4,
          height: isStreamer ? particle.size * 3 : particle.size + 4,
          backgroundColor: particle.color,
          transform: [
            { translateY },
            { translateX },
            { rotate: `${particle.rotation}deg` },
          ],
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    zIndex: 100,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: 2,
  },
});

export default ConfettiAnimation;
