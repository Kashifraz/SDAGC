import React, { useState, useEffect, useRef } from "react";
import { Circle } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useScene } from "./SceneContext";
import Popup from "./TurnBook";

export default function Work() {
  //Access context values
  const { projectBookRef } = useScene();
  const { setCameraAnimation, cameraAnimation, cameraPositions } = useScene();
  const { clock } = useThree();
  const [active, setActive] = useState(true);
  const activeRef = useRef(projectBookRef.current.map(() => true));
  const { resetPositionsRef } = useScene();
  const [showTurnBook, setShowTurnBook] = useState(false);
  const [page, setPage] = useState(1); // Initialize turnjs bookpage to 1

  useEffect(() => {
    // Animate to the work state
    setCameraAnimation("work");
  }, [setCameraAnimation]);

  //Effect to start book animation after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(true);
    }, 3000); // Starts the animation after 5 seconds
    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

  useFrame(({ camera }) => {
    // Update camera position
    const { position, lookAt } = cameraPositions[cameraAnimation];
    camera.position.lerp(new THREE.Vector3(...position), 0.07);
    camera.lookAt(lookAt);

    //Iterate through project books
    if (projectBookRef.current) {
      projectBookRef.current.forEach((book, index) => {
        // Animate the project books along the z-axis
        if (book.position.z > -13) {
          book.rotation.x += 0.01;
          book.rotation.y += 0.01;
          book.rotation.z += 0.01;
        }

        // Check if the book is a project book, is defined, and should still be animated
        if (book && book.userData.isProjectBook && activeRef.current[index]) {
          const delta = clock.getDelta(); // Time elapsed since last frame
          const speed = 250; // Adjusts animation speed
          const distance = active ? speed * delta : 0;
          book.position.z += distance;

          //Stop books forward animation when reaching a certain distance
          if (book.position.z > -13) {
            activeRef.current[index] = false;
          }
        }
      });
    }
  });

  // OpenAI GPT-3.5 (2023). AI-Generated Code Snippet to return books to their original position when not on work page anymore. (Accessed: January 4, 2024).
  // Effect for logging new positions when 'active' changes
  useEffect(() => {
    const newPositions = projectBookRef.current.map((book, index) => {
      if (book) {
        const { x, y, z } = book.position;
        console.log(`Project Book ${index + 1}:`, x, y, z);
        return { x, y, z, width: book.width, height: book.height };
      }
    });
  }, [projectBookRef, active]);

  // Ref for storing the original positions of project books
  const originalPositions = useRef(
    projectBookRef.current.map((book) => book.position.clone())
  );

  // Reset function
  const resetPositions = () => {
    projectBookRef.current.forEach((book, index) => {
      // Reset the position to the original position
      book.position.copy(originalPositions.current[index]);
      book.rotation.set(0, 0, 0);
    });
  };
  resetPositionsRef.current = resetPositions;

  const projectBookClick = (index) => {
    setShowTurnBook(true); //popup component
    setPage(index * 2 + 2); // Set the page number based on the index
  };

  const popupClose = () => {
    setShowTurnBook(false);
  };
  return (
    <>
      {/*Render circle on book position to trigger click events and show turnjs book */}
      {projectBookRef.current.map((book, index) => (
        <Circle
          key={index}
          position={[book.position.x, book.position.y, book.position.z]}
          args={[3.2, book.height]}
          onClick={() => projectBookClick(index)}
          material={
            new THREE.MeshBasicMaterial({
              color: 0xffff00,
              transparent: true,
              opacity: 0,
            })
          }
        />
      ))}
      {/* Render popup if showTurnBook is true */}
      {showTurnBook && <Popup page={page} onClose={popupClose} />}
    </>
  );
}
