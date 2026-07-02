'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BookAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Book Geometry
    const pageGeometry = new THREE.BoxGeometry(2, 2.8, 0.05);
    const coverMaterial = new THREE.MeshPhongMaterial({ color: 0x846b6b }); // Mauve from design system
    const pageMaterial = new THREE.MeshPhongMaterial({ color: 0xfff8f7 }); // Cream from design system

    const leftCover = new THREE.Mesh(pageGeometry, coverMaterial);
    leftCover.position.x = -1.02;
    const rightCover = new THREE.Mesh(pageGeometry, coverMaterial);
    rightCover.position.x = 1.02;

    const bookGroup = new THREE.Group();
    bookGroup.add(leftCover);
    bookGroup.add(rightCover);
    scene.add(bookGroup);

    camera.position.z = 5;

    // Animation loop
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Smoothly rotate book based on mouse
      bookGroup.rotation.y += (mouseX * 0.5 - bookGroup.rotation.y) * 0.05;
      bookGroup.rotation.x += (mouseY * 0.3 - bookGroup.rotation.x) * 0.05;
      
      // Floating effect
      bookGroup.position.y = Math.sin(Date.now() * 0.002) * 0.1;

      renderer.render(scene, camera);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      pageGeometry.dispose();
      coverMaterial.dispose();
      pageMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
