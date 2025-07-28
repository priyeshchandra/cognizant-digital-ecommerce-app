import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { Mesh } from 'three';
import { Product } from '@/types/product';

interface Product3DProps {
  product: Product;
  className?: string;
}

const ProductMesh = ({ product }: { product: Product }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // Different geometries based on product category
  const getGeometry = () => {
    switch (product.category) {
      case 'jeans':
        return <cylinderGeometry args={[0.3, 0.4, 1.5, 8]} />;
      case 'shirts':
        return <boxGeometry args={[1, 1.2, 0.3]} />;
      case 'shoes':
        return <boxGeometry args={[0.8, 0.3, 1.2]} />;
      case 'shorts':
        return <cylinderGeometry args={[0.35, 0.4, 0.8, 8]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getColor = () => {
    if (product.colors.length > 0) {
      const colorMap: { [key: string]: string } = {
        'Blue': '#4299e1',
        'Black': '#1a202c',
        'White': '#f7fafc',
        'Red': '#e53e3e',
        'Green': '#38a169',
        'Gray': '#718096',
        'Brown': '#8b4513',
        'Navy': '#2c5282'
      };
      return colorMap[product.colors[0]] || '#4299e1';
    }
    return '#4299e1';
  };

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={getColor()} 
        metalness={0.2} 
        roughness={0.1}
      />
    </mesh>
  );
};

export const Product3D = ({ product, className = "" }: Product3DProps) => {
  return (
    <div className={`w-full h-64 ${className}`}>
      <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <ProductMesh product={product} />
        
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.1}
            height={0.02}
            position={[0, -1.5, 0]}
          >
            {product.name}
            <meshStandardMaterial color="#333" />
          </Text3D>
        </Center>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={6}
          minDistance={2}
        />
      </Canvas>
    </div>
  );
};